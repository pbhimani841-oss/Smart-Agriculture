<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Crop;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Customer: Buy Now
    public function store(Request $request)
    {
        $request->validate([
            'crop_id' => 'required|exists:crops,id',
            'quantity' => 'required|numeric|min:0.1',
        ]);

        try {
            DB::beginTransaction();

            $crop = Crop::lockForUpdate()->findOrFail($request->input('crop_id'));

            if ($crop->status === 'completed' || $crop->remaining_quantity < $request->input('quantity')) {
                return response()->json(['success' => false, 'message' => 'Requested quantity is not available.'], 400);
            }

            // For instant purchase Buy Now, selling price equals listing price (or price_per_kg)
            $sellingPrice = $crop->listing_price ?? $crop->price_per_kg;
            $totalAmount = $sellingPrice * $request->input('quantity');

            // Create Order
            $order = Order::create([
                'customer_id' => $request->user()->id,
                'total_amount' => $totalAmount,
                'status' => 'completed', // Assuming immediate completion for buy now
            ]);

            // Create Order Item
            OrderItem::create([
                'order_id' => $order->id,
                'crop_id' => $crop->id,
                'quantity' => $request->input('quantity'),
                'price' => $sellingPrice,
            ]);

            // Update Crop transaction fields
            $purchasedQty = $request->input('quantity');
            $crop->selling_price = $sellingPrice; // Keep track of latest selling transaction price or maybe average.
            $crop->sold_quantity += $purchasedQty;
            $crop->remaining_quantity = $crop->quantity - $crop->sold_quantity;

            // Total amount for this crop across all sales
            $crop->total_amount = ($crop->total_amount ?? 0) + $totalAmount;

            if ($crop->remaining_quantity <= 0) {
                $crop->status = 'completed';
                $crop->remaining_quantity = 0; // prevent negative
            } else {
                $crop->status = 'partially_sold';
            }

            $crop->save();

            DB::commit();

            // Fetch the farmer details to show to the customer
            $farmer = $crop->farmer;

            return response()->json([
                'success' => true,
                'message' => 'Purchase successful. Contact farmer below.',
                'farmer' => [
                    'name' => $farmer->name,
                    'mobile_number' => $farmer->mobile_number
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Failed to process purchase.', 'error' => $e->getMessage()], 500);
        }
    }
}
