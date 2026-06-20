import React, { useState, useEffect } from 'react';
import { PackageOpen, Wheat, Search, TrendingUp, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const AdminCropStocksPage = () => {
    const [crops, setCrops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCropStocks();
    }, []);

    const fetchCropStocks = async () => {
        try {
            const response = await api.get('/admin/crop-stocks');
            if (response.data.success) {
                setCrops(response.data.crops);
            }
        } catch (error) {
            console.error('Failed to fetch crop stocks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCrops = crops.filter(crop =>
        crop.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.farmer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalAvailable = filteredCrops.filter(c => c.status === 'active').length;
    const totalSoldOut = filteredCrops.filter(c => c.status === 'completed').length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Global Crop Stocks</h1>
                    <p className="text-gray-500 mt-1">Monitor all agricultural inventory across the marketplace.</p>
                </div>
                <div className="w-full md:w-80">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by crop or farmer name..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-[20px] hover-lift transition-all flex items-center">
                    <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 mr-4">
                        <Wheat size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Listings</p>
                        <p className="text-2xl font-bold text-gray-900">{filteredCrops.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-[20px] hover-lift transition-all flex items-center">
                    <div className="p-3 bg-green-50 rounded-full text-[#16A34A] mr-4">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Currently Available</p>
                        <p className="text-2xl font-bold text-gray-900">{totalAvailable}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-[20px] hover-lift transition-all flex items-center">
                    <div className="p-3 bg-red-50 rounded-full text-red-600 mr-4">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Sold Out Stocks</p>
                        <p className="text-2xl font-bold text-gray-900">{totalSoldOut}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#DCFCE7] border-b border-gray-100 text-[11px] uppercase tracking-wider font-bold text-green-900">
                                <th className="px-6 py-4 rounded-tl-xl">Crop Name</th>
                                <th className="px-6 py-4">Farmer</th>
                                <th className="px-6 py-4 text-center">Total Qty</th>
                                <th className="px-6 py-4 text-center">Sold Qty</th>
                                <th className="px-6 py-4 text-center">Remaining Qty</th>
                                <th className="px-6 py-4 text-right">Listing Price</th>
                                <th className="px-6 py-4 text-right">Selling Price</th>
                                <th className="px-6 py-4 text-right">Total Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredCrops.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <PackageOpen className="h-10 w-10 text-gray-300 mb-3" />
                                            <p className="font-medium text-gray-600">No crop listings found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCrops.map((crop) => (
                                    <tr key={crop.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-gray-900">{crop.crop_name}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">Listed: {new Date(crop.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-900 font-medium">{crop.farmer?.name}</div>
                                            <div className="text-xs text-gray-500">ID: #{crop.farmer?.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                                            <span className="font-semibold text-gray-900">{parseFloat(crop.quantity)} kg</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                                            <span className="font-semibold text-gray-900">{parseFloat(crop.sold_quantity)} kg</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                                            <span className={`font-semibold ${parseFloat(crop.remaining_quantity) === 0 ? 'text-red-500' : 'text-gray-900'}`}>
                                                {parseFloat(crop.remaining_quantity)} kg
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                                            ₹{parseFloat(crop.listing_price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                                            {crop.selling_price ? `₹${parseFloat(crop.selling_price).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-700">
                                            {crop.total_amount ? `₹${parseFloat(crop.total_amount).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${crop.status === 'active' ? 'bg-green-100 text-green-700' :
                                                crop.status === 'partially_sold' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {crop.status === 'active' ? 'Active' : crop.status === 'partially_sold' ? 'Partially Sold' : 'Completed'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCropStocksPage;
