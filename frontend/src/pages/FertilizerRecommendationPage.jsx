import React, { useState } from 'react';
import { FlaskConical, Beaker, ListTree, Map, Scaling, Info, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const FertilizerRecommendationPage = () => {
    const [formData, setFormData] = useState({
        crop_name: '',
        soil_type: '',
        nitrogen_level: '',
        phosphorus_level: '',
        potassium_level: '',
        land_area: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState(null);

    const crops = ['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane', 'Groundnut', 'Soybean', 'Bajra', 'Tomato', 'Potato'];
    const soilTypes = ['Black Soil', 'Red Soil', 'Alluvial Soil', 'Sandy Soil', 'Clay Soil', 'Loamy Soil'];
    const levels = ['Low', 'Medium', 'High'];

    const validateField = (name, value) => {
        let err = '';
        if (!value) err = 'This field is required';
        else if (name === 'land_area' && (isNaN(value) || Number(value) <= 0)) {
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
        setRecommendation(null);

        if (!isFormValid()) return;
        setLoading(true);

        try {
            const response = await api.post('/recommend/fertilizer', formData);
            if (response.data.success) {
                setRecommendation(response.data.recommendation);
            } else {
                setError(response.data.message || 'Failed to get recommendation.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while fetching fertilizer recommendation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                    <FlaskConical className="text-blue-500 mr-2" size={32} />
                    AI Fertilizer Guide
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    Input your soil nutrients and let our AI create the perfect fertilizer plan for your crop.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form Column */}
                <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Soil & Crop Details</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Crop Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <ListTree size={16} className="text-green-600 mr-1.5" /> Crop Name
                            </label>
                            <select
                                name="crop_name"
                                value={formData.crop_name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors ${fieldErrors.crop_name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            >
                                <option value="" disabled>Select Crop</option>
                                {crops.map(crop => (
                                    <option key={crop} value={crop}>{crop}</option>
                                ))}
                            </select>
                            {fieldErrors.crop_name && <p className="text-red-500 text-xs mt-1">{fieldErrors.crop_name}</p>}
                        </div>

                        {/* Soil Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <Map size={16} className="text-amber-600 mr-1.5" /> Soil Type
                            </label>
                            <select
                                name="soil_type"
                                value={formData.soil_type}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors ${fieldErrors.soil_type ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            >
                                <option value="" disabled>Select Soil Type</option>
                                {soilTypes.map(soil => (
                                    <option key={soil} value={soil}>{soil}</option>
                                ))}
                            </select>
                            {fieldErrors.soil_type && <p className="text-red-500 text-xs mt-1">{fieldErrors.soil_type}</p>}
                        </div>

                        {/* NPK Levels */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center mb-2">
                                <Beaker size={16} className="text-indigo-500 mr-1.5" /> NPK Levels
                            </h3>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Nitrogen (N)</label>
                                <select
                                    name="nitrogen_level"
                                    value={formData.nitrogen_level}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-blue-500 text-sm ${fieldErrors.nitrogen_level ? 'border-red-500' : 'border-gray-200'}`}
                                >
                                    <option value="" disabled>Select Level</option>
                                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                                {fieldErrors.nitrogen_level && <p className="text-red-500 text-xs mt-1">{fieldErrors.nitrogen_level}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Phosphorus (P)</label>
                                <select
                                    name="phosphorus_level"
                                    value={formData.phosphorus_level}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-blue-500 text-sm ${fieldErrors.phosphorus_level ? 'border-red-500' : 'border-gray-200'}`}
                                >
                                    <option value="" disabled>Select Level</option>
                                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                                {fieldErrors.phosphorus_level && <p className="text-red-500 text-xs mt-1">{fieldErrors.phosphorus_level}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Potassium (K)</label>
                                <select
                                    name="potassium_level"
                                    value={formData.potassium_level}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-blue-500 text-sm ${fieldErrors.potassium_level ? 'border-red-500' : 'border-gray-200'}`}
                                >
                                    <option value="" disabled>Select Level</option>
                                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                                {fieldErrors.potassium_level && <p className="text-red-500 text-xs mt-1">{fieldErrors.potassium_level}</p>}
                            </div>
                        </div>

                        {/* Land Area */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <Scaling size={16} className="text-gray-500 mr-1.5" /> Land Area (Acres)
                            </label>
                            <input
                                type="number"
                                name="land_area"
                                step="0.1"
                                placeholder="e.g., 2.5"
                                value={formData.land_area}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors ${fieldErrors.land_area ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                            />
                            {fieldErrors.land_area && <p className="text-red-500 text-xs mt-1">{fieldErrors.land_area}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || Object.values(fieldErrors).some(err => err) || Object.values(formData).some(val => !val)}
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-bold text-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Calculating...
                                </>
                            ) : (
                                'Get Fertilizer Plan'
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

                    {!loading && !recommendation && !error && (
                        <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-12 text-center h-full flex flex-col justify-center items-center transition-all">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                <FlaskConical className="text-blue-500" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Awaiting Parameters</h3>
                            <p className="text-gray-500 max-w-sm">
                                Provide your soil nutrient levels and crop type. Our AI will compute the precise fertilizer quantities needed.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-full flex flex-col justify-center items-center shadow-sm">
                            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 animate-pulse">Computing Fertilizer Formula...</h3>
                            <p className="text-gray-500">Analyzing NPK ratios and calculating area requirements.</p>
                        </div>
                    )}

                    {recommendation && !loading && (
                        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                            <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 to-indigo-600"></div>
                            <div className="p-8">
                                <div className="flex items-center mb-6 border-b pb-4">
                                    <Sparkles className="text-blue-500 mr-3" size={28} />
                                    <h2 className="text-2xl font-bold text-gray-900">Recommended Plan</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Fertilizer Name */}
                                    <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
                                        <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-widest mb-1.5 flex items-center">
                                            <FlaskConical size={16} className="mr-2" /> Fertilizer Grade / Name
                                        </h3>
                                        <p className="text-lg font-bold text-gray-900">{recommendation.fertilizer_name}</p>
                                    </div>

                                    {/* Quantities */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-50">
                                            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center">
                                                <Scaling size={14} className="mr-1.5" /> Quantity Per Acre
                                            </h4>
                                            <p className="text-gray-800 font-bold text-xl">{recommendation.quantity_per_acre}</p>
                                        </div>
                                        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-50">
                                            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2 flex items-center">
                                                <ListTree size={14} className="mr-1.5" /> Total Quantity Required
                                            </h4>
                                            <p className="text-emerald-700 font-bold text-xl">{recommendation.total_quantity}</p>
                                        </div>
                                    </div>

                                    {/* Application Guide */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 flex items-center">
                                            <Info size={16} className="text-gray-500 mr-2" /> Application Guide
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed text-sm">{recommendation.application_guide}</p>
                                    </div>

                                    {/* Safety Tips */}
                                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                                        <h4 className="text-sm font-bold text-amber-800 uppercase tracking-widest mb-2 flex items-center">
                                            <AlertTriangle size={16} className="text-amber-600 mr-2" /> Precautions & Safety Tips
                                        </h4>
                                        <p className="text-amber-900 leading-relaxed text-sm">{recommendation.safety_tips}</p>
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

export default FertilizerRecommendationPage;
