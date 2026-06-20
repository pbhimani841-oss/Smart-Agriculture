import React, { useState } from 'react';
import { CloudRain, MapPin, CloudSun, Loader2, Sparkles, AlertCircle, Droplets, Info } from 'lucide-react';
import api from '../services/api';

const RainfallPredictionPage = () => {
    const [formData, setFormData] = useState({
        state: '',
        district: '',
        season: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const seasons = ['Summer', 'Winter', 'Monsoon'];

    const validateField = (name, value) => {
        let err = '';
        if (!value) err = 'This field is required';
        return err;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFieldErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const isFormValid = () => {
        const errors = {};
        Object.keys(formData).forEach(key => {
            const err = validateField(key, formData[key]);
            if (err) errors[key] = err;
        });
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setPrediction(null);

        if (!isFormValid()) return;
        setLoading(true);

        try {
            const response = await api.post('/predict/rainfall', formData);
            if (response.data.success) {
                setPrediction(response.data.prediction);
            } else {
                setError(response.data.message || 'Failed to get prediction.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while fetching prediction.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <CloudRain className="text-blue-500 mr-2" size={32} />
                        AI Rainfall Prediction
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Anticipate seasonal precipitation to plan your irrigation and planting schedules.
                    </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl flex items-center text-sm font-semibold shadow-sm">
                    <AlertCircle size={16} className="mr-2" /> AI-Based Estimation
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form Column */}
                <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Location & Timing</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* State */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <MapPin size={16} className="text-gray-500 mr-1.5" /> State
                            </label>
                            <input
                                type="text"
                                name="state"
                                placeholder="e.g., Maharashtra"
                                value={formData.state}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors ${fieldErrors.state ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            />
                            {fieldErrors.state && <p className="text-red-500 text-xs mt-1">{fieldErrors.state}</p>}
                        </div>

                        {/* District */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <MapPin size={16} className="text-gray-500 mr-1.5" /> District
                            </label>
                            <input
                                type="text"
                                name="district"
                                placeholder="e.g., Pune"
                                value={formData.district}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors ${fieldErrors.district ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            />
                            {fieldErrors.district && <p className="text-red-500 text-xs mt-1">{fieldErrors.district}</p>}
                        </div>

                        {/* Season */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <CloudSun size={16} className="text-amber-500 mr-1.5" /> Season
                            </label>
                            <select
                                name="season"
                                value={formData.season}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors ${fieldErrors.season ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            >
                                <option value="" disabled>Select Season</option>
                                {seasons.map(season => (
                                    <option key={season} value={season}>{season}</option>
                                ))}
                            </select>
                            {fieldErrors.season && <p className="text-red-500 text-xs mt-1">{fieldErrors.season}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || Object.values(fieldErrors).some(err => err) || Object.values(formData).some(val => !val)}
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-bold text-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Predicting...
                                </>
                            ) : (
                                'Get Rainfall Forecast'
                            )}
                        </button>
                    </form>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-2">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-6 shadow-sm">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!loading && !prediction && !error && (
                        <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-12 text-center h-full flex flex-col justify-center items-center transition-all">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                <CloudRain className="text-blue-500" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Awaiting Parameters</h3>
                            <p className="text-gray-500 max-w-sm">
                                Enter your state, district, and season to calculate expected rainfall and corresponding farming impacts.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-full flex flex-col justify-center items-center shadow-sm">
                            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 animate-pulse">Computing Meteorological Data...</h3>
                            <p className="text-gray-500">Processing climate models and regional weather history.</p>
                        </div>
                    )}

                    {prediction && !loading && (
                        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                            <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 to-indigo-600"></div>
                            <div className="p-8">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <Sparkles className="text-blue-500 mr-2" size={24} />
                                        Prediction Results
                                    </h2>
                                    <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wide">
                                        Estimation
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-cyan-50 p-5 rounded-xl border border-cyan-100 flex flex-col justify-center text-center">
                                            <h4 className="text-xs font-bold text-cyan-800 uppercase tracking-widest mb-2 flex items-center justify-center">
                                                <Droplets size={14} className="mr-1.5 text-cyan-500" /> Expected Range
                                            </h4>
                                            <p className="text-gray-900 font-bold text-2xl">{prediction.estimated_rainfall_range}</p>
                                        </div>
                                        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 flex flex-col justify-center text-center">
                                            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-2 flex items-center justify-center">
                                                <CloudRain size={14} className="mr-1.5 text-indigo-500" /> Category
                                            </h4>
                                            <p className="text-indigo-700 font-bold text-3xl">{prediction.rainfall_pattern}</p>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-50/80 p-5 rounded-xl border border-emerald-100">
                                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 flex items-center">
                                            <Info size={16} className="text-emerald-600 mr-2" /> Farming Impact Advice
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed text-sm">{prediction.farming_impact_advice}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RainfallPredictionPage;
