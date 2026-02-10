import React, { useState } from 'react';
import API from '../services/api';
import { FaLock, FaTimes, FaCheckCircle } from 'react-icons/fa';

const PaymentModal = ({ course, onClose, onSuccess }) => {
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleConfirmPayment = async () => {
        setProcessing(true);
        setError(null);

        try {
            const { data } = await API.post('/payments/process', {
                courseId: course._id,
            });

            setSuccess(true);

            // Wait 2 seconds to show success message, then close
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
                <div className="bg-discord-gray rounded-lg w-full max-w-md shadow-2xl overflow-hidden p-8 text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheckCircle className="text-4xl text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                    <p className="text-discord-text-muted mb-4">
                        You've been enrolled in <strong className="text-white">{course.title}</strong>
                    </p>
                    <p className="text-sm text-discord-text-muted">
                        📧 Check your email for confirmation details
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-discord-gray rounded-lg w-full max-w-md shadow-2xl overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-discord-text-muted hover:text-white transition-colors z-10"
                    disabled={processing}
                >
                    <FaTimes />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center">
                    <h3 className="text-xl font-bold mb-2">Confirm Enrollment</h3>
                    <p className="opacity-90 text-sm">Complete your purchase to start learning</p>
                </div>

                {/* Course Details */}
                <div className="p-6">
                    <div className="bg-discord-sidebar rounded-lg p-4 mb-6">
                        <h4 className="text-white font-bold mb-2">{course.title}</h4>
                        <p className="text-discord-text-muted text-sm mb-3 line-clamp-2">
                            {course.description}
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="text-discord-text-muted text-sm">Course Price:</span>
                            <span className="text-2xl font-bold text-white">${course.price}</span>
                        </div>
                    </div>

                    {/* Demo Payment Notice */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <FaLock className="text-blue-400 mt-1" />
                            <div>
                                <h5 className="text-white font-semibold text-sm mb-1">Demo Payment Mode</h5>
                                <p className="text-discord-text-muted text-xs">
                                    This is a demo payment. No actual charges will be made.
                                    You'll receive confirmation emails after enrollment.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Confirm Button */}
                    <button
                        onClick={handleConfirmPayment}
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                    >
                        {processing ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </div>
                        ) : (
                            `Confirm Payment - $${course.price}`
                        )}
                    </button>

                    {/* Security Notice */}
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-discord-text-muted">
                        <FaLock />
                        <span>Secure demo transaction</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
