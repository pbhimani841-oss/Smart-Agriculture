<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Crop;
use App\Models\OrderItem;
use Barryvdh\DomPDF\Facade\Pdf;

class HistoryController extends Controller
{
    // Farmer: Download History (PDF)
    public function downloadFarmerHistory(Request $request)
    {
        $crops = Crop::where('farmer_id', $request->user()->id)
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalEarnings = $crops->sum('total_amount');

        $pdf = Pdf::loadView('pdf.farmer_history', [
            'crops' => $crops,
            'totalEarnings' => $totalEarnings,
            'date' => now()->format('Y-m-d H:i:s'),
            'farmer' => $request->user()
        ]);

        return $pdf->download('farmer_history.pdf');
    }

    // Customer: Customer Buying History API (with filters)
    public function customerBuyingHistory(Request $request)
    {
        $items = $this->getFilteredCustomerBuyingQuery($request)->get();

        $total_buying_amount = 0;
        $history = $items->map(function ($item) use (&$total_buying_amount) {
            $amount = $item->quantity * $item->price;
            $total_buying_amount += $amount;

            $farmer = $item->crop->farmer ?? null;

            return [
                'id' => $item->id,
                'crop_name' => $item->crop->crop_name ?? 'N/A',
                'buy_quantity' => $item->quantity,
                'buying_price' => $item->price,
                'farmer_name' => $farmer->name ?? 'N/A',
                'farmer_mobile' => $farmer->mobile_number ?? 'N/A',
                'location' => ($farmer->state ?? '') . ', ' . ($farmer->district ?? ''),
                'amount' => $amount,
                'date' => $item->created_at->format('Y-m-d H:i:s')
            ];
        });

        return response()->json([
            'success' => true,
            'history' => $history,
            'total_buying_amount' => $total_buying_amount
        ]);
    }

    // Customer: Download Buying History API (PDF)
    public function downloadCustomerHistory(Request $request)
    {
        $items = $this->getFilteredCustomerBuyingQuery($request)->get();

        $total_buying_amount = 0;
        $history = $items->map(function ($item) use (&$total_buying_amount) {
            $amount = $item->quantity * $item->price;
            $total_buying_amount += $amount;

            $farmer = $item->crop->farmer ?? null;

            return [
                'crop_name' => $item->crop->crop_name ?? 'N/A',
                'buy_quantity' => $item->quantity,
                'buying_price' => $item->price,
                'farmer_name' => $farmer->name ?? 'N/A',
                'farmer_mobile' => $farmer->mobile_number ?? 'N/A',
                'location' => trim(($farmer->state ?? '') . ' ' . ($farmer->district ?? '')),
                'amount' => $amount,
                'date' => $item->created_at->format('Y-m-d H:i:s')
            ];
        });

        $pdf = Pdf::loadView('pdf.customer_history', [
            'history' => $history,
            'total_buying_amount' => $total_buying_amount,
            'date' => now()->format('Y-m-d H:i:s'),
            'customer' => $request->user()
        ]);

        return $pdf->download('customer_buying_history.pdf');
    }

    private function getFilteredCustomerBuyingQuery(Request $request)
    {
        $query = OrderItem::with(['crop', 'crop.farmer'])
            ->whereHas('order', function ($q) use ($request) {
                $q->where('customer_id', $request->user()->id);
            });

        // Search Filter (Crop Name or Farmer Name)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('crop', function ($q) use ($search) {
                $q->where('crop_name', 'like', "%{$search}%")
                    ->orWhereHas('farmer', function ($f) use ($search) {
                        $f->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Location Filter (State or District)
        if ($request->filled('location')) {
            $location = $request->location;
            $query->whereHas('crop.farmer', function ($q) use ($location) {
                $q->where('state', 'like', "%{$location}%")
                    ->orWhere('district', 'like', "%{$location}%");
            });
        }

        // Month Filter
        if ($request->filled('month')) {
            $query->whereMonth('created_at', $request->month);
        }

        // Year Filter
        if ($request->filled('year')) {
            $query->whereYear('created_at', $request->year);
        }

        return $query->orderBy('created_at', 'desc');
    }
}
