<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Query;

class QueryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $query = Query::create([
            'user_id' => $request->user()->id,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
        ]);

        return response()->json(['message' => 'Query submitted successfully', 'query' => $query], 201);
    }

    public function index()
    {
        $queries = Query::with('user:id,name,role')->latest()->get();
        return response()->json($queries);
    }

    public function updateStatus(Request $request, Query $query)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,resolved'
        ]);

        $query->update(['status' => $validated['status']]);

        return response()->json(['message' => 'Query status updated successfully', 'query' => $query]);
    }
}
