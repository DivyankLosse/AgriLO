import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const BookingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.location?.address || '',
        date: '',
        time: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await loadRazorpay();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // 1. Get Razorpay Key
            const configRes = await api.get('/appointments/config');
            const razorpayKey = configRes.data.key;

            if (!razorpayKey) {
                alert('Payment configuration missing.');
                setLoading(false);
                return;
            }

            // 2. Create Order
            const orderResponse = await api.post('/appointments/create_order', {
                amount: 199 // 199 INR
            });
            const order = orderResponse.data;

            if (!order) {
                alert('Server error. Are you online?');
                setLoading(false);
                return;
            }

            // 3. Options for Razorpay
            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: "Agri-Lo Soil Test",
                description: "Book a Soil Test Appointment",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyResponse = await api.post('/appointments/verify_payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            appointment_details: formData
                        });

                        if (verifyResponse.data.status === 'success') {
                            navigate('/dashboard');
                            alert('Appointment Booked Successfully!');
                        }
                    } catch (error) {
                        alert('Payment Verification Failed');
                        console.error(error);
                    }
                },
                prefill: {
                    name: formData.name,
                    contact: formData.phone,
                    email: user?.email
                },
                theme: {
                    color: "#618965"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Booking Error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-text-main dark:text-white leading-tight tracking-[-0.033em]">
                    Book a Soil Test
                </h1>
                <p className="text-text-light dark:text-text-secondary-dark">
                    Get expert soil analysis at your farm. Schedule an appointment now.
                </p>
            </div>

            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm">
                <div className="mb-6 bg-primary/10 p-4 rounded-xl flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-2xl">science</span>
                    </div>
                    <div>
                        <p className="font-bold text-primary text-lg">Soil Testing Package</p>
                        <p className="text-sm text-text-light dark:text-text-secondary-dark">Includes ph, NPK, Moisture, and Expert Report</p>
                    </div>
                    <div className="ml-auto font-black text-2xl text-text-main dark:text-white">
                        ₹199
                    </div>
                </div>

                <form onSubmit={handleBooking} className="flex flex-col gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-text-light dark:text-text-secondary-dark">Name</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                type="text"
                                className="h-12 px-4 rounded-xl bg-[#f6f8f6] dark:bg-[#1a2c1e] dark:text-white border-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-text-light dark:text-text-secondary-dark">Phone</label>
                            <input
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                type="tel"
                                className="h-12 px-4 rounded-xl bg-[#f6f8f6] dark:bg-[#1a2c1e] dark:text-white border-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase text-text-light dark:text-text-secondary-dark">Address</label>
                        <textarea
                            required
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="2"
                            className="p-4 rounded-xl bg-[#f6f8f6] dark:bg-[#1a2c1e] dark:text-white border-none focus:ring-2 focus:ring-primary/50 resize-none"
                            placeholder="Farm Address / Location"
                        ></textarea>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-text-light dark:text-text-secondary-dark">Preferred Date</label>
                            <input
                                required
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                type="date"
                                className="h-12 px-4 rounded-xl bg-[#f6f8f6] dark:bg-[#1a2c1e] dark:text-white border-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-text-light dark:text-text-secondary-dark">Time Slot</label>
                            <select
                                required
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="h-12 px-4 rounded-xl bg-[#f6f8f6] dark:bg-[#1a2c1e] dark:text-white border-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                            >
                                <option value="">Select Time</option>
                                <option value="morning">Morning (9 AM - 12 PM)</option>
                                <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                                <option value="evening">Evening (4 PM - 7 PM)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 h-14 rounded-xl bg-primary text-white font-bold text-lg shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing...' : 'Pay ₹199 & Book Now'}
                        {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingPage;
