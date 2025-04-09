import React, { useState, useEffect } from 'react';

const ForgotPassword = ({ setPasswordHint }) => {
    const [step, setStep] = useState(0); // sets whether to show this form and what step to show; 0 means
    //  show just "Forgot password?" link
    const [code, setCode] = useState(''); // TOTP Code from MFA app
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handlePasswordHintSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch('/user/passwordHint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ email, code }).toString(),
                credentials: "include"
            });
    
            const data = await response.json();

            if(data.status === "success") {
                setPasswordHint(data.hint); // sets master password hint for parent component
                setStep(0);
                setCode('');
                setEmail('');
                setError('');
            }

        } catch (err) {
            setError("Error retrieving master password hint: " + err);
        }


    }

    const onCancel = () => {
        setStep(0);
        setCode('');
        setEmail('');
        setError('');
    }

    return (
        <div>
            {step === 0 && (
                <div className="mt-4 text-center">
                <button onClick={() => setStep(1)} className="text-sm text-blue-400 hover:underline">
                  Forgot your password? Request your master password hint!
                </button>
              </div>
            )}

            {step === 1 && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">Please Enter Your Email</h2>
                            <button
                                onClick={onCancel}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>
                        <form onSubmit={handlePasswordHintSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300">Email</label>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            {/* MFA Code */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Enter your 6-digit authentication code
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    placeholder="123456"
                                    required
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-300"
                            >
                                Request Password Hint
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

};

export default ForgotPassword;