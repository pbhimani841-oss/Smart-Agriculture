import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import { Loader2 } from 'lucide-react';

const FarmerSignup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', mobile_number: '', address: '', state: '', district: '', taluka: '', password: '', password_confirmation: ''
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const validateField = (name, value, allData) => {
        let err = '';
        if (!value) err = 'This field is required';
        else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) err = 'Valid email required';
        else if (name === 'mobile_number' && !/^\d{10}$/.test(value)) err = 'Must be exactly 10 digits';
        else if (name === 'password' && value.length < 6) err = 'Minimum 6 characters';
        else if (name === 'password_confirmation' && value !== allData.password) err = 'Passwords do not match';
        return err;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...formData, [name]: value };
        setFormData(newData);
        if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    };

    const isFormValid = () => {
        const errors = {};
        Object.keys(formData).forEach(key => {
            const err = validateField(key, formData[key], formData);
            if (err) errors[key] = err;
        });
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) return;

        setIsSubmitting(true);
        setFieldErrors({});

        try {
            await api.post('/signup/farmer', formData);
            setToast({ message: 'Farmer Registration Successful! Redirecting...', type: 'success' });
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setIsSubmitting(false);
            if (err.response?.status === 422 && err.response.data.errors) {
                const backendErrors = {};
                for (let field in err.response.data.errors) {
                    backendErrors[field] = err.response.data.errors[field][0];
                }
                setFieldErrors(backendErrors);
            } else {
                setToast({ message: err.response?.data?.message || 'Registration failed.', type: 'error' });
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 border rounded shadow">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Farmer Registration</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring transition ${fieldErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-green-300 focus:ring-green-100'}`} />
                    {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring transition ${fieldErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-green-300 focus:ring-green-100'}`} />
                    {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Mobile Number</label>
                    <input type="text" name="mobile_number" value={formData.mobile_number} onChange={handleChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring transition ${fieldErrors.mobile_number ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-green-300 focus:ring-green-100'}`} />
                    {fieldErrors.mobile_number && <p className="text-red-500 text-xs mt-1">{fieldErrors.mobile_number}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring transition ${fieldErrors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-green-300 focus:ring-green-100'}`} />
                    {fieldErrors.address && <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring transition ${fieldErrors.state ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-green-300 focus:ring-green-100'}`} />
                    {fieldErrors.state && <p className="text-red-500 text-xs mt-1">{fieldErrors.state}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">District</label>
                    <input type="text" name="district" value={formData.district} onChange={handleChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring transition ${fieldErrors.district ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-green-300 focus:ring-green-100'}`} />
                    {fieldErrors.district && <p className="text-red-500 text-xs mt-1">{fieldErrors.district}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Taluka</label>
                    <input type="text" name="taluka" value={formData.taluka} onChange={handleChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring transition ${fieldErrors.taluka ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-green-300 focus:ring-green-100'}`} />
                    {fieldErrors.taluka && <p className="text-red-500 text-xs mt-1">{fieldErrors.taluka}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring transition ${fieldErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-green-300 focus:ring-green-100'}`} />
                    {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Confirm Password</label>
                    <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring transition ${fieldErrors.password_confirmation ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-green-300 focus:ring-green-100'}`} />
                    {fieldErrors.password_confirmation && <p className="text-red-500 text-xs mt-1">{fieldErrors.password_confirmation}</p>}
                </div>

                <div className="md:col-span-2 mt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register as Farmer'}
                    </button>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="text-green-600 hover:underline">Log in</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default FarmerSignup;
