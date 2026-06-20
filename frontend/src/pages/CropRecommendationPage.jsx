import React, { useState } from 'react';
import { Leaf, Thermometer, MapPin, Droplets, CloudSun, Loader2, ListTree, Sparkles } from 'lucide-react';
import api from '../services/api';

const CropRecommendationPage = () => {
    const [formData, setFormData] = useState({
        soil_type: '',
        season: '',
        irrigation_type: '',
        state: '',
        district: '',
        current_temperature: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState(null);
    const [error, setError] = useState(null);

    const soilTypes = ['Black Soil', 'Red Soil', 'Alluvial Soil', 'Sandy Soil', 'Clay Soil', 'Loamy Soil'];
    const seasons = ['Summer', 'Winter', 'Monsoon'];
    const irrigationTypes = ['Rainfed', 'Drip', 'Canal'];

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
        setRecommendations(null);

        if (!isFormValid()) return;
        setLoading(true);

        try {
            const response = await api.post('/recommend/crop', formData);
            if (response.data.success) {
                setRecommendations(response.data.recommendations);
            } else {
                setError(response.data.message || 'Failed to get recommendations.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while fetching recommendations.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                    <Sparkles className="text-green-500 mr-2" size={32} />
                    AI Crop Recommendation
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    Provide your farm conditions and let our AI suggest the best crops for maximum yield.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form Column */}
                <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Farm Details</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Soil Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <ListTree size={16} className="text-amber-600 mr-1.5" /> Soil Type
                            </label>
                            <select
                                name="soil_type"
                                value={formData.soil_type}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors ${fieldErrors.soil_type ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            >
                                <option value="" disabled>Select Soil Type</option>
                                {soilTypes.map(soil => (
                                    <option key={soil} value={soil}>{soil}</option>
                                ))}
                            </select>
                            {fieldErrors.soil_type && <p className="text-red-500 text-xs mt-1">{fieldErrors.soil_type}</p>}
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
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors ${fieldErrors.season ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            >
                                <option value="" disabled>Select Season</option>
                                {seasons.map(season => (
                                    <option key={season} value={season}>{season}</option>
                                ))}
                            </select>
                            {fieldErrors.season && <p className="text-red-500 text-xs mt-1">{fieldErrors.season}</p>}
                        </div>

                        {/* Irrigation Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <Droplets size={16} className="text-blue-400 mr-1.5" /> Irrigation Type
                            </label>
                            <select
                                name="irrigation_type"
                                value={formData.irrigation_type}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors ${fieldErrors.irrigation_type ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            >
                                <option value="" disabled>Select Irrigation Type</option>
                                {irrigationTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {fieldErrors.irrigation_type && <p className="text-red-500 text-xs mt-1">{fieldErrors.irrigation_type}</p>}
                        </div>

                        {/* Temperature */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <Thermometer size={16} className="text-red-500 mr-1.5" /> Current Temp (°C)
                            </label>
                            <input
                                type="number"
                                name="current_temperature"
                                step="0.1"
                                placeholder="e.g., 28.5"
                                value={formData.current_temperature}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors ${fieldErrors.current_temperature ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            />
                            {fieldErrors.current_temperature && <p className="text-red-500 text-xs mt-1">{fieldErrors.current_temperature}</p>}
                        </div>

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
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors ${fieldErrors.state ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
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
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors ${fieldErrors.district ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            />
                            {fieldErrors.district && <p className="text-red-500 text-xs mt-1">{fieldErrors.district}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || Object.values(fieldErrors).some(err => err) || Object.values(formData).some(val => !val)}
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-bold text-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Analyzing Data...
                                </>
                            ) : (
                                'Get Recommendations'
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

                    {!loading && !recommendations && !error && (
                        <div className="bg-green-50/50 rounded-2xl border border-green-100 p-12 text-center h-full flex flex-col justify-center items-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                <Leaf className="text-green-500" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Assist</h3>
                            <p className="text-gray-500 max-w-sm">
                                Enter your farm and soil details on the left, and our AI will consult current agricultural data to provide the best crop choices.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-full flex flex-col justify-center items-center shadow-sm">
                            <div className="w-16 h-16 border-4 border-green-100 border-t-green-600 rounded-full animate-spin mb-6"></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 animate-pulse">Running AI Analysis...</h3>
                            <p className="text-gray-500">Checking soil profiles, climate data, and expected yields.</p>
                        </div>
                    )}

                    {recommendations && !loading && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <Sparkles className="text-amber-500 mr-2" size={24} />
                                Top Recommended Crops
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                {recommendations.map((crop, index) => (
                                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden hover:shadow-md transition-shadow">
                                        {/* Header card color variation optional, using a smooth gradient border top */}
                                        <div className="h-1.5 w-full bg-gradient-to-r from-green-400 to-emerald-600"></div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                                    <span className="bg-green-100 text-green-800 h-8 w-8 rounded-full flex items-center justify-center text-sm mr-3 font-extrabold shadow-sm">
                                                        #{index + 1}
                                                    </span>
                                                    {crop.crop_name}
                                                </h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                                                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-1.5">Why it's suitable</h4>
                                                    <p className="text-gray-700 text-sm">{crop.why_suitable}</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-50">
                                                        <h4 className="text-sm font-bold text-amber-800 uppercase tracking-widest mb-1.5">Expected Yield</h4>
                                                        <p className="text-gray-800 font-medium text-sm">{crop.expected_yield}</p>
                                                    </div>
                                                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-50">
                                                        <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-1.5">Fertilizer Suggestion</h4>
                                                        <p className="text-gray-800 font-medium text-sm">{crop.fertilizer_suggestion}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CropRecommendationPage;
