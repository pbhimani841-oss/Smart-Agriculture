import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Phone, MapPin, Mail, Compass, Save, X, Edit2, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const BaseProfile = ({ roleTitle, colorClass, buttonClass, bannerClass }) => {
    const { user, setUser } = useContext(AuthContext);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                mobile_number: user.mobile_number || '',
                address: user.address || '',
                state: user.state || '',
                district: user.district || '',
                taluka: user.taluka || ''
            });
        }
    }, [user]);

    const validateField = (name, value) => {
        let error = '';
        if (!value || value.trim() === '') {
            error = 'This field is required';
        } else if (name === 'mobile_number' && !/^[0-9]{10}$/.test(value)) {
            error = 'Enter a valid 10-digit mobile number';
        }
        setFieldErrors(prev => ({ ...prev, [name]: error }));
        return error === '';
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (fieldErrors[e.target.name]) validateField(e.target.name, e.target.value);
    };

    const isFormValid = () => {
        let valid = true;
        Object.keys(formData).forEach(key => {
            if (!validateField(key, formData[key])) valid = false;
        });
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;

        setMessage({ type: '', text: '' });
        try {
            const response = await api.put('/profile', formData);
            setUser(response.data.user);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditMode(false);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    if (!user) return null;

    const initial = (user.name ? user.name.charAt(0) : 'U').toUpperCase();

    return (
        <div className="max-w-4xl mx-auto mt-10 mb-20 px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                {/* Banner */}
                <div className={`h-32 w-full ${bannerClass} relative`}>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMiAydjIwTTIyIDEySDFtMTUuNS03LjVMMy41IDE5LjVtMTctMTVMNi41IDQuNSIvPjwvc3ZnPg==')] bg-repeat"></div>
                </div>

                {/* Avatar */}
                <div className="absolute top-16 left-8">
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md border border-gray-100">
                        <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl font-bold ${bannerClass} text-white`}>
                            {initial}
                        </div>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex justify-between items-start pt-16 px-8 pb-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            {user.name}
                            <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase tracking-widest ml-2">
                                {roleTitle}
                            </span>
                        </h2>
                        <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                            <Mail size={16} className={colorClass} /> {user.email}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            if (editMode) {
                                // Reset form on cancel
                                setFormData({
                                    name: user.name || '', mobile_number: user.mobile_number || '', address: user.address || '',
                                    state: user.state || '', district: user.district || '', taluka: user.taluka || ''
                                });
                                setFieldErrors({});
                            }
                            setEditMode(!editMode);
                        }}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-all flex items-center shadow-sm ${editMode
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover-lift'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover-lift'
                            }`}
                    >
                        {editMode ? <><X size={16} className="mr-2" /> Cancel Editing</> : <><Edit2 size={16} className="mr-2" /> Edit Profile</>}
                    </button>
                </div>

                <div className="p-8">
                    {message.text && (
                        <div className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.type === 'success' ? <Compass size={18} className="mr-2" /> : <AlertTriangle size={18} className="mr-2" />}
                            {message.text}
                        </div>
                    )}

                    {!editMode ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            <div className="flex gap-4">
                                <div className={`p-3 rounded-full h-11 w-11 flex items-center justify-center bg-gray-50 ${colorClass}`}><User size={20} /></div>
                                <div>
                                    <span className="font-bold text-gray-400 block text-xs uppercase tracking-wider mb-1">Full Name</span>
                                    <span className="text-gray-900 font-medium text-lg">{user.name}</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className={`p-3 rounded-full h-11 w-11 flex items-center justify-center bg-gray-50 ${colorClass}`}><Phone size={20} /></div>
                                <div>
                                    <span className="font-bold text-gray-400 block text-xs uppercase tracking-wider mb-1">Mobile Number</span>
                                    <span className="text-gray-900 font-medium text-lg">{user.mobile_number || 'Not provided'}</span>
                                </div>
                            </div>
                            <div className="md:col-span-2 flex gap-4">
                                <div className={`p-3 rounded-full h-11 w-11 flex items-center justify-center bg-gray-50 ${colorClass}`}><MapPin size={20} /></div>
                                <div className="w-full">
                                    <span className="font-bold text-gray-400 block text-xs uppercase tracking-wider mb-1">Address Details</span>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div><span className="text-xs text-gray-500 block">Street/Area</span><span className="text-gray-900 font-medium">{user.address || '-'}</span></div>
                                        <div><span className="text-xs text-gray-500 block">Taluka</span><span className="text-gray-900 font-medium">{user.taluka || '-'}</span></div>
                                        <div><span className="text-xs text-gray-500 block">District</span><span className="text-gray-900 font-medium">{user.district || '-'}</span></div>
                                        <div className="sm:col-span-3 pt-3 border-t border-gray-200 mt-1"><span className="text-xs text-gray-500 block">State</span><span className="text-gray-900 font-medium">{user.state || '-'}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={(e) => validateField('name', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-shadow ${fieldErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#16A34A] focus:ring-green-100'}`} />
                                {fieldErrors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Mobile Number</label>
                                <input type="text" name="mobile_number" value={formData.mobile_number} onChange={handleChange} onBlur={(e) => validateField('mobile_number', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-shadow ${fieldErrors.mobile_number ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#16A34A] focus:ring-green-100'}`} />
                                {fieldErrors.mobile_number && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.mobile_number}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Street Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} onBlur={(e) => validateField('address', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-shadow ${fieldErrors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#16A34A] focus:ring-green-100'}`} />
                                {fieldErrors.address && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.address}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">State</label>
                                <input type="text" name="state" value={formData.state} onChange={handleChange} onBlur={(e) => validateField('state', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-shadow ${fieldErrors.state ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#16A34A] focus:ring-green-100'}`} />
                                {fieldErrors.state && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.state}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">District</label>
                                <input type="text" name="district" value={formData.district} onChange={handleChange} onBlur={(e) => validateField('district', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-shadow ${fieldErrors.district ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#16A34A] focus:ring-green-100'}`} />
                                {fieldErrors.district && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.district}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Taluka</label>
                                <input type="text" name="taluka" value={formData.taluka} onChange={handleChange} onBlur={(e) => validateField('taluka', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-shadow ${fieldErrors.taluka ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#16A34A] focus:ring-green-100'}`} />
                                {fieldErrors.taluka && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.taluka}</p>}
                            </div>

                            <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-200 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={Object.values(fieldErrors).some(err => err !== '')}
                                    className={`flex items-center text-white font-bold py-3 px-8 rounded-xl shadow-sm hover-lift transition ${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <Save className="mr-2" size={20} /> Save Changes
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export const FarmerProfile = () => <BaseProfile roleTitle="Farmer" colorClass="text-[#16A34A]" bannerClass="bg-gradient-to-r from-[#166534] to-[#16A34A]" buttonClass="bg-[#16A34A] hover:bg-[#15803D]" />;
export const CustomerProfile = () => <BaseProfile roleTitle="Customer" colorClass="text-blue-600" bannerClass="bg-gradient-to-r from-blue-800 to-blue-600" buttonClass="bg-blue-600 hover:bg-blue-700" />;
