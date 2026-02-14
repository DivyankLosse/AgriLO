import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthPage = () => {
    const { t } = useLanguage();
    const { login, register, user } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        language: 'en'
    });

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email.trim(), formData.password);
            } else {
                await register(formData.name, formData.email.trim(), formData.password, formData.phone, formData.language);
                // Auto-login is now handled within register
            }
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            const detail = err.response?.data?.detail;
            if (typeof detail === 'string') {
                setError(detail);
            } else if (Array.isArray(detail)) {
                // Handle Pydantic validation errors (array of objects)
                setError(detail.map(e => e.msg).join(', '));
            } else if (typeof detail === 'object' && detail !== null) {
                // Handle generic error object
                setError(JSON.stringify(detail));
            } else {
                setError('Authentication failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display overflow-x-hidden min-h-screen flex flex-col">
            <div className="flex flex-col h-full grow">
                {/* Top Navigation */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f4f0] dark:border-[#2a3c2e] px-4 md:px-10 py-3 bg-surface-light dark:bg-surface-dark">
                    <div className="flex items-center gap-3 text-text-main dark:text-white">
                        <div className="size-8 text-primary">
                            <span className="material-symbols-outlined text-3xl">spa</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Agri-Lo</h2>
                    </div>
                    <button className="flex items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f0f4f0] dark:bg-[#2a3c2e] text-text-main dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-4 hover:bg-[#e0e4e0] dark:hover:bg-[#3a4c3e] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">translate</span>
                        <span className="hidden sm:inline">English</span>
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 md:px-8">
                    <div className="flex flex-col max-w-[560px] w-full gap-6">
                        {/* Hero Image */}
                        <div className="w-full">
                            <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl h-[240px] shadow-sm" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAmkZ_NEpYtmfeVNkTPwIy12UoGu7S-ZWYWhPUoUdHzXM-sXutbdtqFaFr7839023EDPPQEuTc9B1WIGty5WW84fIG6hjJrF40hmwckR6FTzJhsnVVC9XuopikXQO6dhmX_QU608J_w7Durlc2dgZftw2V90G_MfFnov3rpxkBor0_8dlDnkgGxeUn9XMw-0aC92_33CdChe3e82JA2nmSBwF4o9A7CYZGFg2h1IRu_RxErfXLiHf0CIrXO5BFZqBnGYteVUyPRRtcd')` }}>
                                <div className="bg-gradient-to-t from-black/60 to-transparent p-6">
                                    <p className="text-white font-medium text-lg">"Agri-Lo helped me save 30% of my crop last season."</p>
                                </div>
                            </div>
                        </div>

                        {/* Headline & Intro */}
                        <div className="text-center space-y-2">
                            <h1 className="text-text-main dark:text-white text-3xl md:text-4xl font-bold leading-tight">
                                {isLogin ? 'Welcome, Farmer Friend' : 'Join Agri-Lo Today'}
                            </h1>
                            <p className="text-text-light dark:text-gray-400 text-base font-normal">
                                {isLogin ? "Login to access your farm's health reports and AI tools" : "Create an account to start your smart farming journey"}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-center text-sm font-medium border border-red-200 dark:border-red-800">
                                {error}
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleAuth} className="flex flex-col gap-6 w-full bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-transparent dark:border-[#2a3c2e]">

                            {!isLogin && (
                                <label className="flex flex-col gap-2 w-full">
                                    <span className="text-text-main dark:text-white text-base font-medium">Full Name</span>
                                    <div className="relative">
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-input flex w-full rounded-xl text-text-main dark:text-white border border-[#dbe6dc] dark:border-[#4a5c4e] bg-white dark:bg-[#1a2c1e] h-14 pl-4 pr-10 placeholder:text-[#618965] dark:placeholder:text-gray-500 text-base focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            placeholder="Ram Patil"
                                            type="text"
                                            required={!isLogin}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#618965] dark:text-gray-500 pointer-events-none">
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                    </div>
                                </label>
                            )}

                            <label className="flex flex-col gap-2 w-full">
                                <span className="text-text-main dark:text-white text-base font-medium">Email Address</span>
                                <div className="relative">
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input flex w-full rounded-xl text-text-main dark:text-white border border-[#dbe6dc] dark:border-[#4a5c4e] bg-white dark:bg-[#1a2c1e] h-14 pl-4 pr-10 placeholder:text-[#618965] dark:placeholder:text-gray-500 text-base focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="farmer@example.com"
                                        type="email"
                                        required
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#618965] dark:text-gray-500 pointer-events-none">
                                        <span className="material-symbols-outlined">email</span>
                                    </div>
                                </div>
                            </label>

                            {!isLogin && (
                                <label className="flex flex-col gap-2 w-full">
                                    <span className="text-text-main dark:text-white text-base font-medium">Phone Number</span>
                                    <div className="relative">
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="form-input flex w-full rounded-xl text-text-main dark:text-white border border-[#dbe6dc] dark:border-[#4a5c4e] bg-white dark:bg-[#1a2c1e] h-14 pl-4 pr-10 placeholder:text-[#618965] dark:placeholder:text-gray-500 text-base focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            placeholder="+91 9876543210"
                                            type="tel"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#618965] dark:text-gray-500 pointer-events-none">
                                            <span className="material-symbols-outlined">call</span>
                                        </div>
                                    </div>
                                </label>
                            )}

                            <label className="flex flex-col gap-2 w-full">
                                <span className="text-text-main dark:text-white text-base font-medium">Password</span>
                                <div className="relative">
                                    <input
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input flex w-full rounded-xl text-text-main dark:text-white border border-[#dbe6dc] dark:border-[#4a5c4e] bg-white dark:bg-[#1a2c1e] h-14 pl-4 pr-10 placeholder:text-[#618965] dark:placeholder:text-gray-500 text-base focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        type="password"
                                        required
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#618965] dark:text-gray-500 pointer-events-none">
                                        <span className="material-symbols-outlined">lock</span>
                                    </div>
                                </div>
                            </label>

                            {/* Main Action */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center rounded-xl h-14 bg-primary hover:bg-primary-dark text-white text-lg font-bold tracking-wide transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                            </button>

                            {/* Divider */}
                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-[#e0e6e0] dark:border-[#2a3c2e]"></div>
                                <span className="flex-shrink mx-4 text-text-light dark:text-gray-500 text-sm">Or</span>
                                <div className="flex-grow border-t border-[#e0e6e0] dark:border-[#2a3c2e]"></div>
                            </div>

                            {/* Secondary Action (OTP) - Placeholder functionality */}
                            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl h-14 border-2 border-[#dbe6dc] dark:border-[#4a5c4e] bg-transparent hover:bg-[#f0f4f0] dark:hover:bg-[#2a3c2e] text-text-main dark:text-white text-base font-bold transition-colors">
                                <span className="material-symbols-outlined text-[22px]">sms</span>
                                {isLogin ? 'Login with OTP' : 'Sign Up with OTP'}
                            </button>

                            {/* Sign Up Link */}
                            <div className="text-center pt-2">
                                <p className="text-text-main dark:text-white text-sm">
                                    {isLogin ? 'New to Agri-Lo? ' : 'Already have an account? '}
                                    <button
                                        type="button"
                                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                        className="text-primary font-bold hover:underline"
                                    >
                                        {isLogin ? 'Create an Account' : 'Login here'}
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AuthPage;
