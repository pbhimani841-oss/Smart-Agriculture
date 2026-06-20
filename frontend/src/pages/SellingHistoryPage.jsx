import React, { useState, useEffect } from 'react';
import { Package, Clock, ShieldCheck, Tag, DownloadCloud, DollarSign } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const SellingHistoryPage = () => {
    const { showToast } = useToast();
    const [crops, setCrops] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/farmer/crops');
            if (response.data.success) {
                setCrops(response.data.crops);
                setTotalEarnings(response.data.total_earnings || 0);
            }
        } catch (error) {
            console.error('Failed to fetch selling history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        try {
            const response = await api.get('/farmer/history/download', {
                responseType: 'blob', // Important for file download
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'farmer_sales_report.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            showToast("PDF downloaded successfully.", "success");
        } catch (error) {
            console.error('Failed to download PDF:', error);
            showToast('Failed to generate PDF. Please try again.', 'error');
        } finally {
            setIsDownloading(false);
        }
    };

    const filteredCrops = activeTab === 'active'
        ? crops.filter(crop => parseFloat(crop.remaining_quantity) > 0)
        : crops;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Selling History & Trades</h1>
                    <p className="text-gray-500 mt-1">Manage your active trades and track past inventory.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-xl flex items-center shadow-sm">
                        <div className="bg-emerald-100 p-2 rounded-full mr-3 text-[#16A34A]">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-[#16A34A] font-semibold uppercase tracking-wider">Total Earnings</p>
                            <p className="text-xl font-bold text-green-900">₹ {Number(totalEarnings).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isDownloading}
                        className="flex items-center justify-center bg-[#16A34A] text-white rounded-lg shadow-sm py-3 px-5 text-sm font-medium hover:bg-[#15803D] hover-lift transition-all disabled:opacity-50"
                    >
                        {isDownloading ? (
                            <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                        ) : (
                            <>
                                <DownloadCloud className="w-5 h-5 mr-2" />
                                Download PDF
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 space-x-8">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'active' ? 'text-[#16A34A]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Active Trades
                    {activeTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#16A34A] rounded-t-md"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'history' ? 'text-[#16A34A]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    All History
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#16A34A] rounded-t-md"></div>}
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#DCFCE7] border-b border-gray-100 uppercase tracking-wider text-[11px] font-bold text-green-900">
                                <th className="px-6 py-4">Crop Name</th>
                                <th className="px-6 py-4 text-center">Total Qty</th>
                                <th className="px-6 py-4 text-center">Sold Qty</th>
                                <th className="px-6 py-4 text-center">Remaining Qty</th>
                                <th className="px-6 py-4 text-right">Listing Price</th>
                                <th className="px-6 py-4 text-right">Selling Price</th>
                                <th className="px-6 py-4 text-right">Total Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredCrops.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center">
                                            <Package className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="font-medium text-gray-600">No crops found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCrops.map((crop) => (
                                    <tr key={crop.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{crop.crop_name}</div>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                                            ₹{parseFloat(crop.listing_price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                                            {crop.selling_price ? `₹${parseFloat(crop.selling_price).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-700">
                                            {crop.total_amount ? `₹${parseFloat(crop.total_amount).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${crop.status === 'active' ? 'bg-green-100 text-green-700' :
                                                crop.status === 'partially_sold' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {crop.status === 'active' ? 'Active' : crop.status === 'partially_sold' ? 'Partially Sold' : 'Completed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                                            {new Date(crop.created_at).toLocaleDateString()}
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

export default SellingHistoryPage;
