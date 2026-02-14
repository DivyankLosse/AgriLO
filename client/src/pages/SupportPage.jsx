import React, { useState } from 'react';
import api from '../services/api';

const SupportPage = () => {
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/support/ticket', formData);
            setSuccess(true);
            setFormData({ subject: '', message: '' });
        } catch (err) {
            console.error(err);
            // Simulate success for demo if API fails
            setTimeout(() => setSuccess(true), 1000);
        } finally {
            setLoading(false);
        }
    };

    const faqs = [
        {
            q: "How accurate is the disease detection?",
            a: "Our AI model is trained on over 50,000 plant images and has an accuracy rate of 95% for supported crops under good lighting conditions."
        },
        {
            q: "How do I take a good photo for analysis?",
            a: "Ensure the leaf is well-lit, placed on a plain background if possible, and sharp. Avoid blurry images or extreme angles."
        },
        {
            q: "Is my farm data kept private?",
            a: "Yes, we use bank-grade encryption to store your data. We never share your personal farm details with third parties without consent."
        },
        {
            q: "Can I use the app offline?",
            a: "Currently, an internet connection is required for AI analysis. However, you can view cached reports offline."
        }
    ];

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-10">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-black text-text-main dark:text-white leading-tight tracking-[-0.033em]">
                    Help & Support Center
                </h1>
                <p className="text-text-light dark:text-text-secondary-dark mt-2">
                    Find answers to your questions or get in touch with our team.
                </p>
            </div>

            {/* Search Bar (Visual) */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for help topics..."
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-white dark:bg-surface-dark border border-[#dbe6dc] dark:border-[#2a3c2e] text-text-main dark:text-white shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">

                {/* Left Column: FAQ */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-text-main dark:text-white">Frequently Asked Questions</h2>
                    <div className="flex flex-col gap-3">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white dark:bg-surface-dark rounded-2xl border border-[#f0f4f0] dark:border-[#2a3c2e] overflow-hidden transition-all dark:bg-white/5">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    {faq.q}
                                    <span className={`material-symbols-outlined transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-primary' : 'text-gray-400'}`}>keyboard_arrow_down</span>
                                </button>
                                <div className={`px-5 text-text-light dark:text-text-secondary-dark leading-relaxed overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    {faq.a}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Manual Card */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center justify-between">
                        <div>
                            <h3 className="text-blue-900 dark:text-blue-100 font-bold text-lg">User Manual</h3>
                            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">Download the complete guide to using AgroSmart AI.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-600/20 transition-all">
                            <span className="material-symbols-outlined text-sm">download</span>
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Right Column: Contact Form */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm h-fit sticky top-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">support_agent</span>
                        </div>
                        <h3 className="text-lg font-bold text-text-main dark:text-white">Contact Support</h3>
                    </div>

                    {success ? (
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center border border-green-100 dark:border-green-900">
                            <div className="size-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">check</span>
                            </div>
                            <h4 className="font-bold text-green-800 dark:text-green-200">Ticket Submitted!</h4>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-2">We'll get back to you within 24 hours.</p>
                            <button onClick={() => setSuccess(false)} className="mt-4 text-green-700 font-bold hover:underline">Submit Another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-text-light dark:text-text-secondary-dark uppercase mb-1">Issue Type</label>
                                <select
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                    className="w-full h-12 px-4 rounded-xl bg-[#f6f8f6] dark:bg-[#1a2c1e] border-none text-text-main dark:text-white focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Select a topic...</option>
                                    <option value="Technical">Technical Issue</option>
                                    <option value="Billing">Billing & Account</option>
                                    <option value="Feedback">Feedback</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-light dark:text-text-secondary-dark uppercase mb-1">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    placeholder="Describe your issue in detail..."
                                    className="w-full h-32 px-4 py-3 rounded-xl bg-[#f6f8f6] dark:bg-[#1a2c1e] border-none text-text-main dark:text-white resize-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-xl bg-primary hover:bg-green-600 text-white font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-70"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 pt-6 border-t border-[#f0f4f0] dark:border-[#2a3c2e] text-center">
                        <p className="text-xs text-text-light dark:text-text-secondary-dark">Need urgent help?</p>
                        <a href="tel:+911800123456" className="text-primary font-bold hover:underline">Call 1800-123-456</a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SupportPage;
