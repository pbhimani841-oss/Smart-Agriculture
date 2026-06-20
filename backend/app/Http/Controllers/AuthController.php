<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Services\NotificationService;

class AuthController extends Controller
{
    public function farmerSignup(Request $request, NotificationService $notificationService)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'address' => 'required|string',
            'state' => 'required|string',
            'district' => 'required|string',
            'taluka' => 'required|string',
            'mobile_number' => 'required|digits:10',
            'password' => 'required|min:6|confirmed',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = 'farmer';

        $user = User::create($validated);

        $notificationService->sendToRole('admin', 'New Farmer Registered', "New Farmer Registered: {$user->name}", 'new_user');

        return response()->json(['message' => 'Farmer registered successfully', 'user' => $user], 201);
    }

    public function customerSignup(Request $request, NotificationService $notificationService)
    {
        $validated = $request->request->all(); // Workaround for tests optionally, but let's stick to validate
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'address' => 'required|string',
            'state' => 'required|string',
            'district' => 'required|string',
            'taluka' => 'required|string',
            'mobile_number' => 'required|digits:10',
            'password' => 'required|min:6|confirmed',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = 'customer';

        $user = User::create($validated);

        $notificationService->sendToRole('admin', 'New Customer Registered', "New Customer Registered: {$user->name}", 'new_user');

        return response()->json(['message' => 'Customer registered successfully', 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'message' => ['Invalid credentials.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Logged in successfully',
            'user' => $user,
            'token' => $token,
            'role' => $user->role
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'state' => 'sometimes|string',
            'district' => 'sometimes|string',
            'taluka' => 'sometimes|string',
            'mobile_number' => 'sometimes|string',
        ]);

        $user->update($validated);

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }
}
