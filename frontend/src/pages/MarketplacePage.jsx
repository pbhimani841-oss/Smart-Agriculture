import React, { useState, useEffect } from 'react';
import { ShoppingCart, Handshake, Search, MapPin, Leaf, User } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const MarketplacePage = () => {
    const { showToast } = useToast();
    const [crops, setCrops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modals state
    const [buyModalCrop, setBuyModalCrop] = useState(null);
    const [offerModalCrop, setOfferModalCrop] = useState(null);
    const [actionData, setActionData] = useState({ quantity: '', price: '' });
    const [actionErrors, setActionErrors] = useState({});
    const [actionLoading, setActionLoading] = useState(false);

    const validateActionField = (name, value, maxQty) => {
        let err = '';
        if (!value) err = 'This field is required';
        else if (isNaN(value) || Number(value) <= 0) {
            err = 'Must be a positive number';
        } else if (name === 'quantity' && maxQty && Number(value) > maxQty) {
            err = `Maximum available is ${maxQty} kg`;
        }
        return err;
    };

    const handleActionChange = (name, value, maxQty) => {
        setActionData(prev => ({ ...prev, [name]: value }));
        setActionErrors(prev => ({
            ...prev,
            [name]: validateActionField(name, value, maxQty)
        }));
    };

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            const response = await api.get('/customer/available-crops');
            if (response.data.success) {
                setCrops(response.data.crops);
            }
        } catch (error) {
            console.error('Failed to fetch crops:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuyNow = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const response = await api.post('/customer/buy-now', {
                crop_id: buyModalCrop.id,
                quantity: actionData.quantity
            });
            if (response.data.success) {
                showToast(`Success! Please contact the farmer to arrange delivery/pickup.\nFarmer: ${response.data.farmer.name}\nMobile: ${response.data.farmer.mobile_number}`, 'success');
                setBuyModalCrop(null);
                setActionData({ quantity: '', price: '' });
                setActionErrors({});
                fetchCrops(); // Refresh list to update quantities
            }
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to process purchase.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendOffer = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const response = await api.post('/customer/offers', {
                crop_id: offerModalCrop.id,
                quantity: actionData.quantity,
                requested_price: actionData.price
            });
            if (response.data.success) {
                showToast('Offer sent successfully! You can track its status in "My Offers".', 'success');
                setOfferModalCrop(null);
                setActionData({ quantity: '', price: '' });
                setActionErrors({});
            }
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to send offer.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredCrops = crops.filter(crop =>
        crop.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.farmer?.district?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Marketplace</h1>
                    <p className="text-gray-500 mt-1">Discover and buy fresh produce directly from farmers.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search crops or locations..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm shadow-sm transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredCrops.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Leaf size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No crops found</h3>
                    <p className="text-gray-500">There are currently no crops available matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCrops.map((crop) => (
                        <div key={crop.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col h-full group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-gray-900 text-lg">{crop.crop_name}</h3>
                                <span className="bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-lg text-sm">
                                    ₹{parseFloat(crop.listing_price).toFixed(2)}/kg
                                </span>
                            </div>

                            {crop.description && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{crop.description}</p>
                            )}

                            <div className="space-y-2 mt-auto text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                                <div className="flex items-center text-gray-600">
                                    <Leaf size={14} className="mr-2 text-green-500" />
                                    <span>Available: <strong className="text-gray-900">{parseFloat(crop.remaining_quantity)} kg</strong></span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <User size={14} className="mr-2 text-blue-500" />
                                    <span className="truncate">Farmer: <strong className="text-gray-900">{crop.farmer?.name}</strong></span>
                                </div>
                                {crop.farmer?.district && (
                                    <div className="flex items-center text-gray-600">
                                        <MapPin size={14} className="mr-2 text-red-400" />
                                        <span>Loc: <strong className="text-gray-900">{crop.farmer.district}</strong></span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <button
                                    onClick={() => {
                                        setOfferModalCrop(crop);
                                        setActionData({ quantity: '', price: '' });
                                        setActionErrors({});
                                    }}
                                    className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors"
                                >
                                    <Handshake size={16} />
                                    <span>Offer</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setBuyModalCrop(crop);
                                        setActionData({ quantity: '', price: '' });
                                        setActionErrors({});
                                    }}
                                    className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 shadow-sm transition-colors"
                                >
                                    <ShoppingCart size={16} />
                                    <span>Buy</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Buy Now Modal */}
            {buyModalCrop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Buy {buyModalCrop.crop_name}</h3>
                            <button onClick={() => setBuyModalCrop(null)} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleBuyNow} className="p-6">
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">Price: <strong className="text-gray-900">₹{parseFloat(buyModalCrop.listing_price).toFixed(2)} / kg</strong></p>
                                <p className="text-sm text-gray-600">Available: <strong className="text-gray-900">{parseFloat(buyModalCrop.remaining_quantity)} kg</strong></p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Buy (kg)</label>
                                    <input
                                        type="number"
                                        min="0.1"
                                        max={buyModalCrop.remaining_quantity}
                                        step="0.1"
                                        value={actionData.quantity}
                                        onChange={(e) => handleActionChange('quantity', e.target.value, buyModalCrop.remaining_quantity)}
                                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-all ${actionErrors.quantity ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-green-500 focus:ring-green-100'}`}
                                    />
                                    {actionErrors.quantity && <p className="text-red-500 text-xs mt-1">{actionErrors.quantity}</p>}
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex justify-between items-center">
                                    <span className="text-sm font-medium text-green-800">Total Amount:</span>
                                    <span className="text-lg font-bold text-green-700">
                                        ₹{actionData.quantity ? (parseFloat(actionData.quantity) * parseFloat(buyModalCrop.listing_price)).toFixed(2) : '0.00'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button type="button" onClick={() => setBuyModalCrop(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={actionLoading || !actionData.quantity || !!actionErrors.quantity}
                                    className="flex-1 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >Confirm Purchase</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Send Offer Modal */}
            {offerModalCrop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Negotiate for {offerModalCrop.crop_name}</h3>
                            <button onClick={() => setOfferModalCrop(null)} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSendOffer} className="p-6">
                            <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-500">Asking Price:</span>
                                    <strong className="text-gray-900">₹{parseFloat(offerModalCrop.listing_price).toFixed(2)}/kg</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Available Qty:</span>
                                    <strong className="text-gray-900">{parseFloat(offerModalCrop.remaining_quantity)} kg</strong>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Proposed Quantity (kg)</label>
                                    <input
                                        type="number"
                                        min="0.1"
                                        max={offerModalCrop.remaining_quantity}
                                        step="0.1"
                                        value={actionData.quantity}
                                        onChange={(e) => handleActionChange('quantity', e.target.value, offerModalCrop.remaining_quantity)}
                                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-all ${actionErrors.quantity ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'}`}
                                    />
                                    {actionErrors.quantity && <p className="text-red-500 text-xs mt-1">{actionErrors.quantity}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Proposed Price (₹/kg)</label>
                                    <input
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        value={actionData.price}
                                        onChange={(e) => handleActionChange('price', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-all ${actionErrors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'}`}
                                    />
                                    {actionErrors.price && <p className="text-red-500 text-xs mt-1">{actionErrors.price}</p>}
                                    <p className="text-xs text-gray-500 mt-1">Total Offer Value: ₹{actionData.quantity && actionData.price && !actionErrors.quantity && !actionErrors.price ? (parseFloat(actionData.quantity) * parseFloat(actionData.price)).toFixed(2) : '0.00'}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button type="button" onClick={() => setOfferModalCrop(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={actionLoading || !actionData.quantity || !actionData.price || !!actionErrors.quantity || !!actionErrors.price}
                                    className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >Send Offer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketplacePage;
