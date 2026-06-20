import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Toast from '../components/Toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!email) errs.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Valid email is required";

        if (!password) errs.password = "Password is required";
        else if (password.length < 6) errs.password = "Password must be at least 6 characters";

        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {     
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        setFieldErrors({});

        try {
            const response = await api.post('/login', { email, password });
            login(response.data.user, response.data.token);

            setToast({ message: 'Login successful', type: 'success' });

            setTimeout(() => {
                const role = response.data.role;
                if (role === 'admin') navigate('/admin/dashboard');
                else if (role === 'farmer') navigate('/');
                else navigate('/');
            }, 1000);

        } catch (err) {
            setIsSubmitting(false);
            if (err.response?.status === 422 && err.response.data.errors) {
                const backendErrors = {};
                for (let field in err.response.data.errors) {
                    backendErrors[field] = err.response.data.errors[field][0];
                }
                setFieldErrors(backendErrors);
            } else {
                setToast({ message: err.response?.data?.message || 'Login failed. Please check your credentials.', type: 'error' });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white p-8 border rounded shadow">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            // if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                        }}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring transition ${fieldErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-green-300 focus:ring-green-100'}`}
                        
                    />
                    {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            // if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                        }}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring transition ${fieldErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-green-300 focus:ring-green-100'}`}
                    />
                    {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account? <Link to="/signup/farmer" className="text-green-600 hover:underline">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
