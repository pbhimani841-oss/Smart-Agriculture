import React, { useState } from 'react';
import api from '../services/api';

const QueryPage = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });


    // As a user (farmer or customer), we could fetch our own queries if the backend supported it.
    // However, the backend currently only has query index for admins.
    // If you need users to see their own queries, ensure you add a user-specific endpoint.

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: '', text: '' });

        try {
            await api.post('/queries', { subject, message });
            setStatusMessage({ type: 'success', text: 'Your query has been submitted successfully.' });
            setSubject('');
            setMessage('');
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'Failed to submit query. Please try again later.' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white border shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-700 border-b pb-2">Submit a Query</h2>
            <p className="text-gray-600 mb-6 text-sm">Need help or have questions? Submit a query to the Admin team.</p>

            {statusMessage.text && (
                <div className={`p-3 rounded mb-4 text-sm ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        placeholder="E.g., Issue with login"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-300"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows="5"
                        placeholder="Describe your issue or question in detail..."
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-300"
                    ></textarea>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition">
                    Submit Query
                </button>
            </form>
        </div>
    );
};

export default QueryPage;
