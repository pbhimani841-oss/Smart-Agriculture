import React, { useState } from 'react';
import { Target, MapPin, CloudSun, Scaling, Loader2, Sparkles, AlertCircle, LineChart, ListTree } from 'lucide-react';
import api from '../services/api';

const YieldPredictionPage = () => {
    const [formData, setFormData] = useState({
        state: '',
        district: '',
        season: '',
        crop: '',
        area: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const crops = ['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane', 'Groundnut', 'Soybean', 'Bajra', 'Tomato', 'Potato'];
    const seasons = ['Summer', 'Winter', 'Monsoon'];

    const validateField = (name, value) => {
        let err = '';
        if (!value) err = 'This field is required';
        else if (name === 'area' && (isNaN(value) || Number(value) <= 0)) {
            err = 'Must be a positive number';
        }
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
            const response = await api.post('/predict/yield', formData);
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
                        <LineChart className="text-purple-500 mr-2" size={32} />
                        AI Yield Prediction
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Estimate your crop harvest accurately based on historical data and AI analysis.
                    </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-xl flex items-center text-sm font-semibold shadow-sm">
                    <AlertCircle size={16} className="mr-2" /> AI-Based Estimation
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form Column */}
                <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Planting Details</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* State */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <MapPin size={16} className="text-gray-500 mr-1.5" /> State
                            </label>
                            <input
                                type="text"
                                name="state"
                                placeholder="e.g., Gujarat"
                                value={formData.state}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-colors ${fieldErrors.state ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
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
                                placeholder="e.g., Surat"
                                value={formData.district}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-colors ${fieldErrors.district ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            />
                            {fieldErrors.district && <p className="text-red-500 text-xs mt-1">{fieldErrors.district}</p>}
                        </div>

                        {/* Season */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <CloudSun size={16} className="text-blue-500 mr-1.5" /> Season
                            </label>
                            <select
                                name="season"
                                value={formData.season}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-colors ${fieldErrors.season ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            >
                                <option value="" disabled>Select Season</option>
                                {seasons.map(season => (
                                    <option key={season} value={season}>{season}</option>
                                ))}
                            </select>
                            {fieldErrors.season && <p className="text-red-500 text-xs mt-1">{fieldErrors.season}</p>}
                        </div>

                        {/* Crop */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <ListTree size={16} className="text-green-600 mr-1.5" /> Crop
                            </label>
                            <select
                                name="crop"
                                value={formData.crop}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-colors ${fieldErrors.crop ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            >
                                <option value="" disabled>Select Crop</option>
                                {crops.map(crop => (
                                    <option key={crop} value={crop}>{crop}</option>
                                ))}
                            </select>
                            {fieldErrors.crop && <p className="text-red-500 text-xs mt-1">{fieldErrors.crop}</p>}
                        </div>

                        {/* Area */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <Scaling size={16} className="text-amber-600 mr-1.5" /> Area (Acres)
                            </label>
                            <input
                                type="number"
                                name="area"
                                step="0.1"
                                placeholder="e.g., 5"
                                value={formData.area}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-colors ${fieldErrors.area ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            />
                            {fieldErrors.area && <p className="text-red-500 text-xs mt-1">{fieldErrors.area}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || Object.values(fieldErrors).some(err => err) || Object.values(formData).some(val => !val)}
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-bold text-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Analyzing Data...
                                </>
                            ) : (
                                'Predict Yield'
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
                        <div className="bg-purple-50/50 rounded-2xl border border-purple-100 p-12 text-center h-full flex flex-col justify-center items-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                <Target className="text-purple-500" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Analyze</h3>
                            <p className="text-gray-500 max-w-sm">
                                Enter your location and planting details to receive an AI-powered yield estimation.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-full flex flex-col justify-center items-center shadow-sm">
                            <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mb-6"></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 animate-pulse">Calculating Yield...</h3>
                            <p className="text-gray-500">Cross-referencing crop data and regional metrics.</p>
                        </div>
                    )}

                    {prediction && !loading && (
                        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
                            <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                            <div className="p-8">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <Sparkles className="text-amber-500 mr-2" size={24} />
                                        Prediction Results
                                    </h2>
                                    <div className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 uppercase tracking-wide">
                                        Estimation
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 flex flex-col justify-center text-center">
                                            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">Estimated Yield per Acre</h4>
                                            <p className="text-gray-900 font-bold text-2xl">{prediction.estimated_yield_per_acre}</p>
                                        </div>
                                        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 flex flex-col justify-center text-center">
                                            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-2">Total Estimated Yield</h4>
                                            <p className="text-indigo-700 font-bold text-3xl">{prediction.total_estimated_yield}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/80 p-5 rounded-xl border border-gray-100">
                                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 flex items-center">
                                            <AlertCircle size={16} className="text-amber-500 mr-2" /> Influencing Factors
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed text-sm">{prediction.influencing_factors}</p>
                                    </div>

                                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                                        <h4 className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center">
                                            <Target size={16} className="text-blue-500 mr-2" /> Improvement Suggestions
                                        </h4>
                                        <p className="text-blue-900 leading-relaxed text-sm">{prediction.improvement_suggestions}</p>
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

export default YieldPredictionPage;
