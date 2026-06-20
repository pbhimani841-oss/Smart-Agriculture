<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PredictionController extends Controller
{
    /**
     * Yield Prediction
     */
    public function predictYield(Request $request)
    {
        $request->validate([
            'state' => 'required|string',
            'district' => 'required|string',
            'season' => 'required|string|in:Summer,Winter,Monsoon',
            'crop' => 'required|string|in:Wheat,Rice,Cotton,Maize,Sugarcane,Groundnut,Soybean,Bajra,Tomato,Potato',
            'area' => 'required|numeric|min:0.1',
        ]);

        $apiKey = env('GEMINI_API_KEY');

        if (empty($apiKey)) {
            return response()->json(['success' => false, 'message' => 'Gemini API Key not configured.'], 500);
        }

        $inputData = $request->only(['state', 'district', 'season', 'crop', 'area']);

        $prompt = "You are an expert agricultural data analyst. Based on the following conditions, provide a yield prediction.\n\n" .
            "Conditions:\n" .
            "- State: {$inputData['state']}\n" .
            "- District: {$inputData['district']}\n" .
            "- Season: {$inputData['season']}\n" .
            "- Crop: {$inputData['crop']}\n" .
            "- Area: {$inputData['area']} acres\n\n" .
            "Please return a single JSON object. Do NOT wrap the JSON in markdown blocks like ```json ... ```, just return the raw JSON object. " .
            "The object must have the following keys:\n" .
            "- 'estimated_yield_per_acre' (string) Average yield per acre in kilogram \n" .
            "- 'total_estimated_yield' (string) Total yield for {$inputData['area']} acres\n" .
            "- 'influencing_factors' (string) Key factors affecting this yield\n" .
            "- 'improvement_suggestions' (string) Actionable advice to improve yield";

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

                // Decode JSON to ensure it's valid
                $prediction = json_decode($replyText, true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($prediction)) {
                    return response()->json([
                        'success' => true,
                        'prediction' => $prediction
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
                'message' => 'Prediction service error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rainfall Prediction
     */
    public function predictRainfall(Request $request)
    {
        $request->validate([
            'state' => 'required|string',
            'district' => 'required|string',
            'season' => 'required|string|in:Summer,Winter,Monsoon',
        ]);

        $apiKey = env('GEMINI_API_KEY');

        if (empty($apiKey)) {
            return response()->json(['success' => false, 'message' => 'Gemini API Key not configured.'], 500);
        }

        $inputData = $request->only(['state', 'district', 'season']);

        $prompt = "You are an expert meteorological and agricultural consultant. Based on the following conditions, provide a rainfall estimation.\n\n" .
            "Conditions:\n" .
            "- State: {$inputData['state']}\n" .
            "- District: {$inputData['district']}\n" .
            "- Season: {$inputData['season']}\n\n" .
            "Please return a single JSON object. Do NOT wrap the JSON in markdown blocks like ```json ... ```, just return the raw JSON object. " .
            "The object must have the following keys:\n" .
            "- 'estimated_rainfall_range' (string) Expected rainfall in mm\n" .
            "- 'rainfall_pattern' (string) e.g., Low, Moderate, or Heavy\n" .
            "- 'farming_impact_advice' (string) Advice for farmers based on this predicted rainfall";

        try {
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'systemInstruction' => [
                    'parts' => [
                        ['text' => 'You are a meteorological expert. You strictly return JSON responses only without markdown block wrappers.']
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
                $prediction = json_decode($replyText, true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($prediction)) {
                    return response()->json([
                        'success' => true,
                        'prediction' => $prediction
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
                'message' => 'Prediction service error: ' . $e->getMessage()
            ], 500);
        }
    }
}
