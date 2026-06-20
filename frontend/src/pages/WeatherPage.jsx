import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, MapPin, Loader2, ThermometerSun, AlertCircle } from 'lucide-react';
import api from '../services/api';

const WeatherPage = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/weather');
                if (response.data.success) {
                    setWeatherData(response.data);
                    setError(null);
                } else {
                    throw new Error(response.data.message || 'Failed to analyze weather data');
                }
            } catch (err) {
                console.error("Weather API Error:", err);
                setError(err.response?.data?.message || err.message || "Failed to fetch weather forecast.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
                <p className="text-gray-600 font-semibold text-lg animate-pulse">Fetching Real-time Forecast...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-10 bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-2xl flex flex-col items-center text-center shadow-sm">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Weather Forecast Unavailable</h3>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-6 rounded-full transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!weatherData) return null;

    const { location, weather } = weatherData;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-4">
            <div className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                    <Cloud className="text-blue-500 mr-3" size={36} /> Weather Forecast
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Real-time agricultural weather updates for your region.</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 text-blue-400 opacity-20 pointer-events-none">
                    <Cloud size={250} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">

                    <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                        <div className="flex items-center text-blue-100 mb-2 bg-blue-800 bg-opacity-30 px-4 py-1 rounded-full">
                            <MapPin size={18} className="mr-2" />
                            <span className="font-medium tracking-wide">{location}</span>
                        </div>
                        <div className="flex items-center justify-center mt-4">
                            {weather.icon && (
                                <img
                                    src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                                    alt={weather.description}
                                    className="w-32 h-32 drop-shadow-lg -ml-4"
                                />
                            )}
                            <div className="flex flex-col">
                                <span className="text-7xl font-bold tracking-tighter shadow-sm">{Math.round(weather.temperature)}°</span>
                                <span className="text-xl capitalize text-blue-100 font-medium">{weather.description}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto mt-6 md:mt-0">
                        <div className="bg-white bg-opacity-20 backdrop-blur-md p-5 rounded-2xl flex flex-col items-center justify-center border border-white border-opacity-20">
                            <ThermometerSun className="text-yellow-300 mb-2" size={32} />
                            <span className="text-sm text-blue-100 uppercase tracking-wider font-semibold">Feels Like</span>
                            <span className="text-2xl font-bold">{Math.round(weather.temperature)}°C</span>
                        </div>
                        <div className="bg-white bg-opacity-20 backdrop-blur-md p-5 rounded-2xl flex flex-col items-center justify-center border border-white border-opacity-20">
                            <Droplets className="text-blue-200 mb-2" size={32} />
                            <span className="text-sm text-blue-100 uppercase tracking-wider font-semibold">Humidity</span>
                            <span className="text-2xl font-bold">{weather.humidity}%</span>
                        </div>
                        <div className="bg-white bg-opacity-20 backdrop-blur-md p-5 rounded-2xl flex flex-col items-center justify-center border border-white border-opacity-20 col-span-2">
                            <Wind className="text-gray-200 mb-2" size={32} />
                            <span className="text-sm text-blue-100 uppercase tracking-wider font-semibold">Wind Speed</span>
                            <span className="text-2xl font-bold">{weather.wind_speed} m/s</span>
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Agricultural Insight</h3>
                <p className="text-blue-800 leading-relaxed">
                    Based on these current conditions, {weather.temperature > 30 ? 'high temperatures might require additional crop irrigation today.' : weather.humidity > 80 ? 'high humidity conditions observed. Monitor closely for fungal risks in sensitive crops.' : 'conditions generally look stable for standard field operations.'}
                </p>
            </div>
        </div>
    );
};

export default WeatherPage;
