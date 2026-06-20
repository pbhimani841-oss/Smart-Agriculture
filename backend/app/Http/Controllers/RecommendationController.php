<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RecommendationController extends Controller
{
    /**
     * Crop Recommendation
     */
    public function recommendCrop(Request $request)
    {
        $request->validate([
            'soil_type' => 'required|string',
            'season' => 'required|string',
            'irrigation_type' => 'required|string',
            'state' => 'required|string',
            'district' => 'required|string',
            'current_temperature' => 'required|numeric',
        ]);

        $apiKey = env('GEMINI_API_KEY');

        if (empty($apiKey)) {
            return response()->json(['success' => false, 'message' => 'Gemini API Key not configured.'], 500);
        }

        $inputData = $request->only(['soil_type', 'season', 'irrigation_type', 'state', 'district', 'current_temperature']);

        $prompt = "You are an expert agricultural consultant. Based on the following conditions, recommend the top 3 most suitable crops.\n\n" .
            "Conditions:\n" .
            "- Soil Type: {$inputData['soil_type']}\n" .
            "- Season: {$inputData['season']}\n" .
            "- Irrigation Type: {$inputData['irrigation_type']}\n" .
            "- State: {$inputData['state']}\n" .
            "- District: {$inputData['district']}\n" .
            "- Current Temperature: {$inputData['current_temperature']}°C\n\n" .
            "Please return a JSON array with exactly 3 objects. Do NOT wrap the JSON in markdown blocks like ```json ... ```, just return the raw JSON array. " .
            "Each object must have the following keys:\n" .
            "- 'crop_name' (string)\n" .
            "- 'why_suitable' (string)\n" .
            "- 'expected_yield' (string)\n" .
            "- 'fertilizer_suggestion' (string)";

        try {
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'systemInstruction' => [
                    'parts' => [
                        ['text' => 'You are an agricultural expert. You strictly return JSON responses only without markdown block wrappers.']
                    ]
                ],
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $replyText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '[]';

                // Decode JSON to ensure it's valid
                $recommendations = json_decode($replyText, true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($recommendations)) {
                    return response()->json([
                        'success' => true,
                        'recommendations' => $recommendations
                    ]);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to parse AI response.',
                        'raw_reply' => $replyText
                    ], 500);
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Gemini API error.',
                'error' => $response->json()
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Recommendation service error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Fertilizer Recommendation
     */
    public function recommendFertilizer(Request $request)
    {
        $request->validate([
            'crop_name' => 'required|string',
            'soil_type' => 'required|string',
            'nitrogen_level' => 'required|string|in:Low,Medium,High',
            'phosphorus_level' => 'required|string|in:Low,Medium,High',
            'potassium_level' => 'required|string|in:Low,Medium,High',
            'land_area' => 'required|numeric|min:0.1',
        ]);

        $apiKey = env('GEMINI_API_KEY');

        if (empty($apiKey)) {
            return response()->json(['success' => false, 'message' => 'Gemini API Key not configured.'], 500);
        }

        $inputData = $request->only(['crop_name', 'soil_type', 'nitrogen_level', 'phosphorus_level', 'potassium_level', 'land_area']);

        $prompt = "You are an expert agricultural consultant. Based on the following conditions, recommend the best fertilizer program.\n\n" .
            "Conditions:\n" .
            "- Crop: {$inputData['crop_name']}\n" .
            "- Soil Type: {$inputData['soil_type']}\n" .
            "- NPK Levels: N={$inputData['nitrogen_level']}, P={$inputData['phosphorus_level']}, K={$inputData['potassium_level']}\n" .
            "- Land Area: {$inputData['land_area']} acres\n\n" .
            "Please return a single JSON object. Do NOT wrap the JSON in markdown blocks like ```json ... ```, just return the raw JSON object. " .
            "The object must have the following keys:\n" .
            "- 'fertilizer_name' (string) Name or type of combination fertilizer\n" .
            "- 'quantity_per_acre' (string) Quantity per acre\n" .
            "- 'total_quantity' (string) Exact total quantity for {$inputData['land_area']} acres\n" .
            "- 'application_guide' (string) Brief overview of when and how to apply\n" .
            "- 'safety_tips' (string) Precautions or safety tips";

        try {
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'systemInstruction' => [
                    'parts' => [
                        ['text' => 'You are an agricultural expert. You strictly return JSON responses only without markdown block wrappers.']
                    ]
                ],
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $replyText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '{}';

                // Decode JSON
                $recommendation = json_decode($replyText, true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($recommendation)) {
                    return response()->json([
                        'success' => true,
                        'recommendation' => $recommendation
                    ]);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to parse AI response.',
                        'raw_reply' => $replyText
                    ], 500);
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Gemini API error.',
                'error' => $response->json()
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Recommendation service error: ' . $e->getMessage()
            ], 500);
        }
    }
}
