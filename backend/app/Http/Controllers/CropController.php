<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Crop;
use App\Services\NotificationService;

class CropController extends Controller
{
    // Farmer: Add a new crop
    public function store(Request $request, NotificationService $notificationService)
    {
        $request->validate([
            'crop_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price_per_kg' => 'required|numeric|min:1',
            'description' => 'nullable|string',
        ]);

        $crop = Crop::create([
            'farmer_id' => $request->user()->id,
            'crop_name' => $request->input('crop_name'),
            'quantity' => $request->input('quantity'),
            'price_per_kg' => $request->input('price_per_kg'),
            'listing_price' => $request->input('price_per_kg'),
            'remaining_quantity' => $request->input('quantity'),
            'description' => $request->input('description'),
            'status' => 'active',
        ]);

        $farmerName = $request->user()->name;
        $notificationService->sendToRole('admin', 'New Crop Added', "New crop added by {$farmerName}: {$crop->crop_name}", 'crop_added');
        $notificationService->sendToRole('customer', 'New Crop Added', "New crop added by {$farmerName}: {$crop->crop_name}", 'crop_added');

        return response()->json(['success' => true, 'crop' => $crop, 'message' => 'Crop listed successfully'], 201);
    }

    // Farmer: Get selling history (crops added by logged-in farmer)
    public function indexFarmer(Request $request)
    {
        // remaining quantity is dynamically calculated later or we just show the current quantity
        $crops = Crop::where('farmer_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $totalEarnings = $crops->where('status', 'completed')->sum('total_amount');

        // Assuming current quantity is the remaining quantity (since orders reduce this directly)
        return response()->json(['success' => true, 'crops' => $crops, 'total_earnings' => $totalEarnings]);
    }

    // Customer: View available crops
    public function indexCustomer()
    {
        $crops = Crop::with(['farmer:id,name,address,state,district,mobile_number'])
            ->where('status', '!=', 'completed')
            ->where('remaining_quantity', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get();

        // Map crops to hide sensitive fields if needed, or simply return as is but front-end obscures it.
        // As per requirement: Customer cannot see total amount, selling price history, so we map them to omit those.
        $crops->transform(function ($crop) {
            unset($crop->selling_price);
            unset($crop->total_amount);
            return $crop;
        });

        return response()->json(['success' => true, 'crops' => $crops]);
    }
}
