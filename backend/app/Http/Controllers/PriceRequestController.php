<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PriceRequest;
use App\Models\Crop;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use App\Services\NotificationService;

class PriceRequestController extends Controller
{
    // Customer: Send Offer
    public function store(Request $request, NotificationService $notificationService)
    {
        $request->validate([
            'crop_id' => 'required|exists:crops,id',
            'quantity' => 'required|integer|min:1',
            'requested_price' => 'required|numeric|min:1',
        ]);

        $crop = Crop::findOrFail($request->input('crop_id'));

        if ($crop->status === 'completed' || $crop->remaining_quantity < $request->input('quantity')) {
            return response()->json(['success' => false, 'message' => 'Requested quantity is not available.'], 400);
        }

        $priceRequest = PriceRequest::create([
            'crop_id' => $crop->id,
            'customer_id' => $request->user()->id,
            'farmer_id' => $crop->farmer_id,
            'requested_price' => $request->input('requested_price'),
            'quantity' => $request->input('quantity'),
            'status' => 'pending',
        ]);

        $notificationService->sendToUser($crop->farmer_id, 'New Offer Received', "New offer received for {$crop->crop_name}", 'offer_received');

        return response()->json(['success' => true, 'message' => 'Offer sent successfully!', 'data' => $priceRequest], 201);
    }

    // Customer: View My Offers
    public function indexCustomer(Request $request)
    {
        $offers = PriceRequest::with(['crop:id,crop_name', 'farmer:id,name,mobile_number'])
            ->where('customer_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'offers' => $offers]);
    }

    // Farmer: View Incoming Offers
    public function indexFarmer(Request $request)
    {
        $requests = PriceRequest::with(['crop:id,crop_name,quantity', 'customer:id,name,mobile_number'])
            ->where('farmer_id', $request->user()->id)
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'requests' => $requests]);
    }

    // Farmer: Accept Offer
    public function accept(Request $request, $id, NotificationService $notificationService)
    {
        try {
            DB::beginTransaction();

            $priceRequest = PriceRequest::lockForUpdate()->findOrFail($id);

            if ($priceRequest->farmer_id !== $request->user()->id || $priceRequest->status !== 'pending') {
                return response()->json(['success' => false, 'message' => 'Invalid request.'], 400);
            }

            $crop = Crop::lockForUpdate()->findOrFail($priceRequest->crop_id);

            if ($crop->remaining_quantity < $priceRequest->quantity) {
                return response()->json(['success' => false, 'message' => 'Insufficient crop quantity to accept this offer.'], 400);
            }

            // Create Order
            $totalAmount = $priceRequest->requested_price * $priceRequest->quantity;
            $order = Order::create([
                'customer_id' => $priceRequest->customer_id,
                'total_amount' => $totalAmount,
                'status' => 'completed',
            ]);

            // Create Order Item
            OrderItem::create([
                'order_id' => $order->id,
                'crop_id' => $crop->id,
                'quantity' => $priceRequest->quantity,
                'price' => $priceRequest->requested_price,
            ]);

            // Reduce Crop Quantity and update new Trade Module fields
            $crop->selling_price = $priceRequest->requested_price;
            $crop->sold_quantity += $priceRequest->quantity;
            $crop->remaining_quantity = $crop->quantity - $crop->sold_quantity;
            $crop->total_amount = ($crop->total_amount ?? 0) + $totalAmount;

            if ($crop->remaining_quantity <= 0) {
                $crop->status = 'completed';
                $crop->remaining_quantity = 0;
            } else {
                $crop->status = 'partially_sold';
            }
            $crop->save();

            // Update Request Status
            $priceRequest->status = 'accepted';
            $priceRequest->save();

            DB::commit();

            $notificationService->sendToUser($priceRequest->customer_id, 'Offer Accepted', "Your offer for {$crop->crop_name} has been ACCEPTED", 'offer_accepted');

            return response()->json([
                'success' => true,
                'message' => 'Offer accepted successfully!',
                'customer' => $priceRequest->customer
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Failed to accept offer.', 'error' => $e->getMessage()], 500);
        }
    }

    // Farmer: Reject Offer
    public function reject(Request $request, $id, NotificationService $notificationService)
    {
        $priceRequest = PriceRequest::with('crop')->findOrFail($id);

        if ($priceRequest->farmer_id !== $request->user()->id || $priceRequest->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Invalid request.'], 400);
        }

        $priceRequest->status = 'rejected';
        $priceRequest->save();

        $notificationService->sendToUser($priceRequest->customer_id, 'Offer Rejected', "Your offer for {$priceRequest->crop->crop_name} has been REJECTED", 'offer_rejected');

        return response()->json(['success' => true, 'message' => 'Offer rejected.']);
    }
}
