import React, { useState } from 'react';
import { Leaf, DollarSign, Package, AlertCircle } from 'lucide-react';
import api from '../services/api';

const TradeCropsPage = () => {
    const [formData, setFormData] = useState({
        crop_name: '',
        quantity: '',
        price_per_kg: '',
        description: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    const validateField = (name, value) => {
        let err = '';
        if (name !== 'description' && !value) err = 'This field is required';
        else if ((name === 'quantity' || name === 'price_per_kg') && (isNaN(value) || Number(value) <= 0)) {
            err = 'Must be a positive number greater than 0';
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
        setMessage({ type: '', content: '' });

        if (!isFormValid()) return;
        setIsLoading(true);

        try {
            const response = await api.post('/farmer/crops', formData);
            if (response.data.success) {
                setMessage({ type: 'success', content: 'Crop listed successfully!' });
                setFormData({
                    crop_name: '',
                    quantity: '',
                    price_per_kg: '',
                    description: '',
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                content: error.response?.data?.message || 'Failed to list crop. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-green-50/50 px-6 py-6 border-b border-green-100 flex items-center space-x-3">
                    <div className="bg-green-100 p-2.5 rounded-xl text-green-600">
                        <Leaf size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">List New Crop</h2>
                        <p className="text-sm text-green-600/80 font-medium mt-0.5">Add a new crop to the marketplace</p>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    {message.content && (
                        <div className={`mb-6 p-4 rounded-xl flex items-start space-x-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                            <AlertCircle className="shrink-0 mt-0.5" size={18} />
                            <p className="text-sm font-medium">{message.content}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 block">Crop Name *</label>
                                <input
                                    type="text"
                                    name="crop_name"
                                    value={formData.crop_name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:bg-white focus:ring-2 transition-all duration-200 outline-none ${fieldErrors.crop_name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-500/20'}`}
                                    placeholder="e.g., Organic Wheat"
                                />
                                {fieldErrors.crop_name && <p className="text-red-500 text-xs mt-1">{fieldErrors.crop_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 block">Quantity (kg) *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Package size={18} />
                                    </div>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        step="1"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border focus:bg-white focus:ring-2 transition-all duration-200 outline-none ${fieldErrors.quantity ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-500/20'}`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {fieldErrors.quantity && <p className="text-red-500 text-xs mt-1">{fieldErrors.quantity}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 block">Price per kg (₹) *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <DollarSign size={18} />
                                    </div>
                                    <input
                                        type="number"
                                        name="price_per_kg"
                                        min="1"
                                        step="1"
                                        value={formData.price_per_kg}
                                        onChange={handleChange}
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border focus:bg-white focus:ring-2 transition-all duration-200 outline-none ${fieldErrors.price_per_kg ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-green-500/20'}`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {fieldErrors.price_per_kg && <p className="text-red-500 text-xs mt-1">{fieldErrors.price_per_kg}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 block">Description</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 outline-none resize-none"
                                    placeholder="Provide details about the crop quality, farming methods, etc."
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading || Object.values(fieldErrors).some(err => err) || !formData.crop_name || !formData.quantity || !formData.price_per_kg}
                                className="w-full py-3.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md focus:ring-4 focus:ring-green-500/20 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Listing Crop...</span>
                                    </>
                                ) : (
                                    <span>List Crop for Sale</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TradeCropsPage;
