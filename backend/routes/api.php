<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\QueryController;

Route::post('/signup/farmer', [AuthController::class, 'farmerSignup']);
Route::post('/signup/customer', [AuthController::class, 'customerSignup']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllRead']);

    Route::post('/queries', [QueryController::class, 'store']);

    Route::middleware('role:farmer')->group(function () {
        Route::post('/chat', [\App\Http\Controllers\ToolController::class, 'chat']);
        Route::get('/weather', [\App\Http\Controllers\ToolController::class, 'weather']);

        // Recommendation
        Route::post('/recommend/crop', [\App\Http\Controllers\RecommendationController::class, 'recommendCrop']);
        Route::post('/recommend/fertilizer', [\App\Http\Controllers\RecommendationController::class, 'recommendFertilizer']);

        // Prediction
        Route::post('/predict/yield', [\App\Http\Controllers\PredictionController::class, 'predictYield']);
        Route::post('/predict/rainfall', [\App\Http\Controllers\PredictionController::class, 'predictRainfall']);

        // Marketplace: Farmer
        Route::post('/farmer/crops', [\App\Http\Controllers\CropController::class, 'store']);
        Route::get('/farmer/crops', [\App\Http\Controllers\CropController::class, 'indexFarmer']);
        Route::get('/farmer/history/download', [\App\Http\Controllers\HistoryController::class, 'downloadFarmerHistory']);
        Route::get('/farmer/price-requests', [\App\Http\Controllers\PriceRequestController::class, 'indexFarmer']);
        Route::post('/farmer/price-requests/{id}/accept', [\App\Http\Controllers\PriceRequestController::class, 'accept']);
        Route::post('/farmer/price-requests/{id}/reject', [\App\Http\Controllers\PriceRequestController::class, 'reject']);
    });

    Route::middleware('role:customer')->group(function () {
        // Marketplace: Customer
        Route::get('/customer/available-crops', [\App\Http\Controllers\CropController::class, 'indexCustomer']);
        Route::post('/customer/buy-now', [\App\Http\Controllers\OrderController::class, 'store']);
        Route::post('/customer/offers', [\App\Http\Controllers\PriceRequestController::class, 'store']);
        Route::get('/customer/my-offers', [\App\Http\Controllers\PriceRequestController::class, 'indexCustomer']);

        // Buying History & PDF
        Route::get('/customer/buying-history', [\App\Http\Controllers\HistoryController::class, 'customerBuyingHistory']);
        Route::get('/customer/buying-history/download', [\App\Http\Controllers\HistoryController::class, 'downloadCustomerHistory']);
    });

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/farmers', [AdminController::class, 'farmers']);
        Route::get('/customers', [AdminController::class, 'customers']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

        Route::get('/queries', [QueryController::class, 'index']);
        Route::put('/queries/{query}/status', [QueryController::class, 'updateStatus']);

        // Marketplace: Admin
        Route::get('/crop-stocks', [\App\Http\Controllers\AdminMarketplaceController::class, 'cropStocks']);
        Route::get('/orders', [\App\Http\Controllers\AdminMarketplaceController::class, 'orders']);
    });
});
