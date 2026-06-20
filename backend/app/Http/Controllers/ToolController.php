<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ToolController extends Controller
{
    /**
     * Handle the AI Chatbot request.
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $userMessage = $request->input('message');

        try {
            $apiKey = env('GEMINI_API_KEY');

            if (empty($apiKey)) {
                return response()->json(['success' => false, 'message' => 'Gemini API Key not configured.'], 500);
            }

            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'systemInstruction' => [
                    'parts' => [
                        ['text' => 'You are a helpful agricultural assistant helping a farmer. Be concise and practical.']
                    ]
                ],
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $userMessage]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'No response generated.';

                return response()->json([
                    'success' => true,
                    'reply' => $reply
                ]);
            }

            $errorData = $response->json();
            $errorMessage = $errorData['error']['message'] ?? 'Gemini API error.';

            // Fallback for API errors (like quota exceeded) to keep the demo functional
            if ($response->status() === 429 || str_contains(strtolower($errorMessage), 'quota')) {
                $mockReplies = [
                    "🌱 Based on current trends, practicing crop rotation can significantly improve your soil health!",
                    "💧 Remember to check your irrigation systems for leaks to conserve water during dry periods.",
                    "🌾 For pest control, consider using neem oil as a natural alternative to harsh chemicals.",
                    "☀️ With the upcoming weather, it might be a good time to prepare for harvesting.",
                    "🚜 I'm currently operating in offline fallback mode due to API limits, but I'm always here to share general farming tips!"
                ];
                $fallbackReply = "🤖 " . $mockReplies[array_rand($mockReplies)];

                return response()->json([
                    'success' => true,
                    'reply' => $fallbackReply . "\n\n*(Note: This is a fallback response because the API quota was exceeded)*"
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Gemini API error.',
                'error' => $errorData
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Chat service error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle the Weather forecast request.
     */
    public function weather(Request $request)
    {
        $user = $request->user();

        // Default to the user's district or state, fallback to a general value if none exists
        $location = $user->district ?? $user->state ?? 'Mumbai';

        $apiKey = env('OPENWEATHER_API_KEY');

        if (empty($apiKey)) {
            return response()->json(['success' => false, 'message' => 'Weather API Key not configured.'], 500);
        }

        try {
            // Fetch weather data from OpenWeatherMap
            $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
                'q' => $location,
                'appid' => $apiKey,
                'units' => 'metric'
            ]);

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'success' => true,
                    'location' => $data['name'],
                    'weather' => [
                        'temperature' => $data['main']['temp'],
                        'humidity' => $data['main']['humidity'],
                        'description' => $data['weather'][0]['description'],
                        'wind_speed' => $data['wind']['speed'],
                        'icon' => $data['weather'][0]['icon']
                    ]
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve weather data.',
                'error' => $response->json()
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Weather service error: ' . $e->getMessage()
            ], 500);
        }
    }
}
