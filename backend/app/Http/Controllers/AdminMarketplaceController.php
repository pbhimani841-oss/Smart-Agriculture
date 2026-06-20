<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Crop;
use App\Models\Order;

class AdminMarketplaceController extends Controller
{
    // Admin: View all crop stocks
    public function cropStocks()
    {
        $crops = Crop::with(['farmer:id,name'])->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'crops' => $crops]);
    }

    // Admin: View all orders
    public function orders()
    {
        $orders = Order::with([
            'customer:id,name,mobile_number',
            'orderItems.crop:id,crop_name,farmer_id',
            'orderItems.crop.farmer:id,name'
        ])->orderBy('created_at', 'desc')->get();

        return response()->json(['success' => true, 'orders' => $orders]);
    }
}
