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

    const [paymentMethod, setPaymentMethod] = useState('pay_later'); // 'pay_later' or 'upi'
    const [showQR, setShowQR] = useState(false);

    const upiId = "9284527291-2@ybl";
    const amount = 199;
    const upiUrl = `upi://pay?pa=${upiId}&pn=Agri-Lo&am=${amount}&cu=INR&tn=Soil%20Test%20Booking`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Direct Booking
            const response = await api.post('/appointments/book_direct', {
                ...formData,
                payment_method: paymentMethod
            });

            if (response.data.status === 'success') {
                alert('Appointment Booked Successfully!');
                navigate('/dashboard');
            }
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

                    <div className="flex flex-col gap-2 mt-2">
                        <label className="text-xs font-bold uppercase text-text-light dark:text-text-secondary-dark">Payment Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => { setPaymentMethod('pay_later'); setShowQR(false); }}
                                className={`h-12 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${paymentMethod === 'pay_later' ? 'border-primary bg-primary/5 text-primary' : 'border-[#dbe6dc] dark:border-[#4a5c4e] text-text-light'}`}
                            >
                                <span className="material-symbols-outlined">schedule</span>
                                Pay Later
                            </button>
                            <button
                                type="button"
                                onClick={() => { setPaymentMethod('upi'); setShowQR(true); }}
                                className={`h-12 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/5 text-primary' : 'border-[#dbe6dc] dark:border-[#4a5c4e] text-text-light'}`}
                            >
                                <span className="material-symbols-outlined">qr_code_2</span>
                                Pay Now (UPI)
                            </button>
                        </div>
                    </div>

                    {showQR && (
                        <div className="flex flex-col items-center gap-4 p-6 bg-[#f0f4f0] dark:bg-[#1a2c1e] rounded-2xl border-2 border-dashed border-primary/30 mt-2 animate-in fade-in zoom-in duration-300">
                            <p className="font-bold text-text-main dark:text-white">Scan QR to Pay ₹199</p>
                            <div className="bg-white p-3 rounded-xl shadow-md">
                                <img src={qrCodeUrl} alt="UPI QR Code" className="size-40" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-text-main dark:text-white">{upiId}</p>
                                <p className="text-xs text-text-light dark:text-text-secondary-dark mt-1">Pay with GPay, PhonePe, or any UPI App</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 h-14 rounded-xl bg-primary text-white font-bold text-lg shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing...' : (paymentMethod === 'upi' ? 'Confirm & Book' : 'Book Appointment')}
                        {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingPage;
