import React, { useState, useEffect } from 'react';
import { Package, Search, MapPin, Calendar, DownloadCloud, CreditCard } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const CustomerBuyingHistoryPage = () => {
    const { showToast } = useToast();
    const [history, setHistory] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (location) params.append('location', location);
            if (month) params.append('month', month);
            if (year) params.append('year', year);

            const response = await api.get(`/customer/buying-history?${params.toString()}`);
            if (response.data.success) {
                setHistory(response.data.history);
                setTotalAmount(response.data.total_buying_amount);
            }
        } catch (error) {
            console.error('Failed to fetch buying history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [month, year]); // Only auto-fetch on month/year changes

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchHistory();
    };

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (location) params.append('location', location);
            if (month) params.append('month', month);
            if (year) params.append('year', year);

            const response = await api.get(`/customer/buying-history/download?${params.toString()}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'customer_buying_report.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            showToast("PDF generated successfully.", "success");
        } catch (error) {
            console.error('Failed to download PDF:', error);
            showToast('Failed to generate PDF. Please try again.', 'error');
        } finally {
            setIsDownloading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Buying History</h1>
                    <p className="text-gray-500 mt-1">Track all your past purchases and monitor your spending.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-xl flex items-center shadow-sm">
                        <div className="bg-emerald-100 p-2 rounded-full mr-3 text-[#16A34A]">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-[#16A34A] font-semibold uppercase tracking-wider">Total Purchase Amount</p>
                            <p className="text-xl font-bold text-green-900">₹ {Number(totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleDownloadPdf}
                        disabled={isDownloading}
                        className="flex items-center justify-center bg-[#16A34A] text-white rounded-lg shadow-sm py-3 px-5 text-sm font-medium hover:bg-[#15803D] hover-lift transition-all disabled:opacity-50 whitespace-nowrap"
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

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Search Crop/Farmer</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City or State"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="w-full sm:w-auto min-w-[120px]">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                        >
                            <option value="">All Months</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>

                    <div className="w-full sm:w-auto min-w-[100px]">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                        >
                            <option value="">All Years</option>
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2 bg-[#16A34A] text-white text-sm font-medium rounded-lg hover:bg-[#15803D] transition-colors"
                    >
                        Apply Filters
                    </button>

                    {(search || location || month || year) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch(''); setLocation(''); setMonth(''); setYear('');
                                setTimeout(fetchHistory, 0); // Need to wait for states to clear or pass empty string 
                            }}
                            className="w-full sm:w-auto px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-lg transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#DCFCE7] border-b border-gray-100 uppercase tracking-wider text-[11px] font-bold text-green-900">
                                <th className="px-6 py-4">Crop Name</th>
                                <th className="px-6 py-4">Farmer Details</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4 text-right">Qty (kg)</th>
                                <th className="px-6 py-4 text-right">Price (₹/kg)</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center">
                                            <Package className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="font-medium text-gray-600">No purchases found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                history.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-gray-900 capitalize">{item.crop_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-900 font-medium">{item.farmer_name}</div>
                                            <div className="text-gray-500 text-xs">{item.farmer_mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {item.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                                            {parseFloat(item.buy_quantity)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                                            ₹{parseFloat(item.buying_price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">
                                            ₹{parseFloat(item.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                                            {new Date(item.date).toLocaleDateString()}
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

export default CustomerBuyingHistoryPage;
