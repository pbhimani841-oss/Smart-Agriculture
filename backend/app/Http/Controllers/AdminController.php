<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'total_farmers' => User::where('role', 'farmer')->count(),
            'total_customers' => User::where('role', 'customer')->count()
        ]);
    }

    public function farmers()
    {
        $farmers = User::where('role', 'farmer')->get();
        return response()->json($farmers);
    }

    public function customers()
    {
        $customers = User::where('role', 'customer')->get();
        return response()->json($customers);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        if ($user->role === 'admin') {
            return response()->json(['success' => false, 'message' => 'Admin cannot be deleted'], 403);
        }

        try {
            $user->delete();
            return response()->json(['success' => true, 'message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to delete user. Please check if this user has dependent records.'], 500);
        }
    }
}
