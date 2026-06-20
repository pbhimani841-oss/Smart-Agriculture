import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/admin/orders');
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = orders.filter(o =>
        o.id.toString().includes(searchQuery) ||
        o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.order_items?.[0]?.crop?.farmer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

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
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Marketplace Orders</h1>
                    <p className="text-gray-500 mt-1">Review all completed and pending transactions.</p>
                </div>
                <div className="w-full md:w-80">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search Order ID, Customer, Farmer..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-[20px] hover-lift transition-all flex items-center">
                    <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 mr-4">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Orders volume</p>
                        <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-[20px] hover-lift transition-all flex items-center">
                    <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 mr-4">
                        <span className="text-2xl font-bold">₹</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Application GMV</p>
                        <p className="text-2xl font-bold text-emerald-600">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#DCFCE7] border-b border-gray-100 text-[11px] uppercase tracking-wider font-bold text-green-900">
                                <th className="px-6 py-4 rounded-tl-xl">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Farmer</th>
                                <th className="px-6 py-4">Item Details</th>
                                <th className="px-6 py-4 text-right">Total Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <ShoppingBag className="h-10 w-10 text-gray-300 mb-3" />
                                            <p className="font-medium text-gray-600">No orders found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const firstItem = order.order_items?.[0];
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-bold text-gray-900">#ORD-{order.id.toString().padStart(4, '0')}</div>
                                                <div className="text-[11px] text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-900 font-medium">{order.customer?.name}</div>
                                                <div className="text-xs text-gray-500">{order.customer?.mobile_number}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-900 font-medium">{firstItem?.crop?.farmer?.name || 'Unknown'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-semibold text-gray-800">{firstItem?.crop?.crop_name || 'Item'}</div>
                                                <div className="text-xs text-gray-500">{firstItem ? `${parseFloat(firstItem.quantity)} kg @ ₹${parseFloat(firstItem.price)}/kg` : ''}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-600">
                                                ₹{parseFloat(order.total_amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'completed'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.status === 'completed' && <CheckCircle size={10} className="mr-1" />}
                                                    {order.status === 'pending' && <Clock size={10} className="mr-1" />}
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
