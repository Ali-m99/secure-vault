import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const DeletePassword = ({ onPasswordDeleted, passwordId, serviceName }) => {
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('passwordId', passwordId);

        try {
            const response = await fetch('http://localhost:8080/password/delete', {
                method: 'POST',
                body: formData, // FormData will automatically set the Content-Type to multipart/form-data
                credentials: "include" 
            });

            const data = await response.text();

            if (response.ok) {
                onPasswordDeleted(); // Notify parent component to refresh the file list
                setShowForm(false); // Hide the form after successful submission
            } else {
                throw new Error(data || 'Failed to delete password');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            {/* Simplified icon button */}
            <button
                onClick={() => setShowForm(true)}
                className="text-red-400 hover:text-red-500 p-1"
                aria-label="Delete password"
            >
                <TrashIcon className="w-5 h-5" />
            </button>

            {/* Existing modal remains unchanged */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                         {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">Delete Password</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Centered confirmation message */}
                        <div className="text-center mb-6">
                            <p className="text-white text-lg">Are you sure you want to delete this {serviceName} password?</p>
                        </div>

                        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                        <form onSubmit={handleSubmit} className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeletePassword;