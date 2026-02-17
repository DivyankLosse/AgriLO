import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth, RecaptchaVerifier } from '../utils/firebase';
import { signInWithPhoneNumber } from "firebase/auth";

const AuthPage = () => {
    const { t } = useLanguage();
    const { login, register, user, loginWithFirebase } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isPhoneLogin, setIsPhoneLogin] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '+91 ',
        otp: '',
        language: 'en'
    });

    const [confirmationResult, setConfirmationResult] = useState(null);

    useEffect(() => {
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }
        };
    }, []);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const setupRecaptcha = (containerId) => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                'size': 'invisible',
                'callback': (response) => {
                    console.log("Recaptcha resolved");
                }
            });
        }
    };

    const onSignInSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Clear existing verifier if any to prevent "already rendered" error
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }

            setupRecaptcha('sign-in-button');

            // Cleanup phone number: ensure it starts with +91 if user deleted it
            let phoneNumber = formData.phone.trim();
            if (!phoneNumber.startsWith('+')) {
                phoneNumber = `+${phoneNumber}`;
            }

            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(confirmation);
            setShowOTP(true);
        } catch (err) {
            console.error("SMS Error:", err);
            if (err.code === 'auth/billing-not-enabled') {
                setError("SMS quota reached or billing required for real numbers. Please use a 'Test Phone Number' from Firebase Console for local development.");
            } else {
                setError(err.message || "Failed to send OTP. Ensure phone number is valid.");
            }
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } finally {
            setLoading(false);
        }
    };

    const onOTPVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            console.log("Verifying OTP:", formData.otp.trim());
            const result = await confirmationResult.confirm(formData.otp.trim());
            console.log("OTP Verified successfully");
            const idToken = await result.user.getIdToken();
            await loginWithFirebase(idToken);
            navigate('/dashboard');
        } catch (err) {
            console.error("Firebase OTP Error:", err);
            // Show more specific error message if available
            setError(err.message || "Invalid OTP code. Please try again.");
        } finally {
            setLoading(false);
        }
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
            }
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            const detail = err.response?.data?.detail;
            if (typeof detail === 'string') {
                setError(detail);
            } else if (Array.isArray(detail)) {
                setError(detail.map(e => e.msg).join(', '));
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
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f4f0] dark:border-[#2a3c2e] px-4 md:px-10 py-3 bg-surface-light dark:bg-surface-dark">
                    <div className="flex items-center gap-3 text-text-main dark:text-white">
                        <div className="size-8 text-primary">
                            <span className="material-symbols-outlined text-3xl">spa</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Agri-Lo</h2>
                    </div>
                </header>

                <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 md:px-8">
                    <div className="flex flex-col max-w-[560px] w-full gap-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-text-main dark:text-white text-3xl md:text-4xl font-bold leading-tight">
                                {showOTP ? 'Verify OTP' : (isLogin ? 'Welcome, Farmer Friend' : 'Join Agri-Lo Today')}
                            </h1>
                            <p className="text-text-light dark:text-gray-400 text-base font-normal">
                                {showOTP ? `Enter the 6-digit code sent to ${formData.phone}` :
                                    (isLogin ? "Login with Email or Phone Number" : "Create an account to start your journey")}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-center text-sm font-medium border border-red-200 dark:border-red-800">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-6 w-full bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-transparent dark:border-[#2a3c2e]">
                            {isPhoneLogin ? (
                                !showOTP ? (
                                    <form onSubmit={onSignInSubmit} className="flex flex-col gap-6">
                                        <label className="flex flex-col gap-2 w-full">
                                            <span className="text-text-main dark:text-white text-base font-medium">Phone Number</span>
                                            <div className="relative">
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="form-input flex w-full rounded-xl text-text-main dark:text-white border border-[#dbe6dc] dark:border-[#4a5c4e] bg-white dark:bg-[#1a2c1e] h-14 pl-4 pr-10 placeholder:text-[#618965] dark:placeholder:text-gray-500 text-base focus:outline-0 focus:ring-2 focus:ring-primary transition-all"
                                                    placeholder="+91 9876543210"
                                                    type="tel"
                                                    required
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#618965] dark:text-gray-500 pointer-events-none">
                                                    <span className="material-symbols-outlined">call</span>
                                                </div>
                                            </div>
                                        </label>
                                        <div id="sign-in-button"></div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex w-full items-center justify-center rounded-xl h-14 bg-primary hover:bg-primary-dark text-white text-lg font-bold transition-colors shadow-lg shadow-primary/20 disabled:opacity-70"
                                        >
                                            {loading ? 'Sending SMS...' : 'Send OTP'}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={onOTPVerify} className="flex flex-col gap-6">
                                        <label className="flex flex-col gap-2 w-full">
                                            <span className="text-text-main dark:text-white text-base font-medium">Enter 6-digit OTP</span>
                                            <div className="relative">
                                                <input
                                                    name="otp"
                                                    value={formData.otp}
                                                    onChange={handleChange}
                                                    className="form-input flex w-full rounded-xl text-text-main dark:text-white border border-[#dbe6dc] dark:border-[#4a5c4e] bg-white dark:bg-[#1a2c1e] h-14 pl-4 pr-10 placeholder:text-[#618965] dark:placeholder:text-gray-500 text-base text-center tracking-[0.5em] font-bold focus:outline-0 focus:ring-2 focus:ring-primary transition-all"
                                                    placeholder="000000"
                                                    type="text"
                                                    maxLength="6"
                                                    required
                                                />
                                            </div>
                                        </label>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex w-full items-center justify-center rounded-xl h-14 bg-primary hover:bg-primary-dark text-white text-lg font-bold transition-colors shadow-lg shadow-primary/20 disabled:opacity-70"
                                        >
                                            {loading ? 'Verifying...' : 'Verify & Login'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowOTP(false)}
                                            className="text-primary text-sm font-bold hover:underline text-center"
                                        >
                                            Change Phone Number
                                        </button>
                                    </form>
                                )
                            ) : (
                                <form onSubmit={handleAuth} className="flex flex-col gap-6 w-full">
                                    {!isLogin && (
                                        <label className="flex flex-col gap-2 w-full">
                                            <span className="text-text-main dark:text-white text-base font-medium">Full Name</span>
                                            <input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="form-input flex w-full rounded-xl text-text-main dark:text-white border border-[#dbe6dc] dark:border-[#4a5c4e] bg-white dark:bg-[#1a2c1e] h-14 pl-4 pr-10 placeholder:text-[#618965] dark:placeholder:text-gray-500 text-base focus:outline-0 focus:ring-2 focus:ring-primary transition-all"
                                                placeholder="Ram Patil"
                                                type="text"
                                                required={!isLogin}
                                            />
                                        </label>
                                    )}

                                    {!isLogin && (
                                        <label className="flex flex-col gap-2 w-full">
                                            <span className="text-text-main dark:text-white text-base font-medium">Phone Number</span>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-input flex w-full rounded-xl text-text-main dark:text-white border border-[#dbe6dc] dark:border-[#4a5c4e] bg-white dark:bg-[#1a2c1e] h-14 pl-4 pr-10 placeholder:text-[#618965] dark:placeholder:text-gray-500 text-base focus:outline-0 focus:ring-2 focus:ring-primary transition-all"
                                                placeholder="+91 9876543210"
                                                type="text"
                                                required={!isLogin}
                                            />
                                        </label>
                                    )}

                                    <label className="flex flex-col gap-2 w-full">
                                        <span className="text-text-main dark:text-white text-base font-medium">Email or Phone Number</span>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-input flex w-full rounded-xl text-text-main dark:text-white border border-[#dbe6dc] dark:border-[#4a5c4e] bg-white dark:bg-[#1a2c1e] h-14 pl-4 pr-10 placeholder:text-[#618965] dark:placeholder:text-gray-500 text-base focus:outline-0 focus:ring-2 focus:ring-primary transition-all"
                                            placeholder="farmer@example.com or +91 9876543210"
                                            type="text"
                                            required
                                        />
                                    </label>

                                    <label className="flex flex-col gap-2 w-full">
                                        <span className="text-text-main dark:text-white text-base font-medium">Password</span>
                                        <input
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="form-input flex w-full rounded-xl text-text-main dark:text-white border border-[#dbe6dc] dark:border-[#4a5c4e] bg-white dark:bg-[#1a2c1e] h-14 pl-4 pr-10 placeholder:text-[#618965] dark:placeholder:text-gray-500 text-base focus:outline-0 focus:ring-2 focus:ring-primary transition-all"
                                            placeholder="••••••••"
                                            type="password"
                                            required
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex w-full items-center justify-center rounded-xl h-14 bg-primary hover:bg-primary-dark text-white text-lg font-bold transition-colors shadow-lg shadow-primary/20 disabled:opacity-70"
                                    >
                                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                                    </button>
                                </form>
                            )}

                            {!showOTP && (
                                <>
                                    <div className="relative flex py-1 items-center">
                                        <div className="flex-grow border-t border-[#e0e6e0] dark:border-[#2a3c2e]"></div>
                                        <span className="flex-shrink mx-4 text-text-light dark:text-gray-500 text-sm">Or</span>
                                        <div className="flex-grow border-t border-[#e0e6e0] dark:border-[#2a3c2e]"></div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => { setIsPhoneLogin(!isPhoneLogin); setError(''); }}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl h-14 border-2 border-[#dbe6dc] dark:border-[#4a5c4e] bg-transparent hover:bg-[#f0f4f0] dark:hover:bg-[#2a3c2e] text-text-main dark:text-white text-base font-bold transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[22px]">
                                            {isPhoneLogin ? 'email' : 'sms'}
                                        </span>
                                        {isPhoneLogin ? 'Login with Email' : 'Login with OTP'}
                                    </button>

                                    <div className="text-center pt-2">
                                        <p className="text-text-main dark:text-white text-sm">
                                            {isLogin ? 'New to Agri-Lo? ' : 'Already have an account? '}
                                            <button
                                                type="button"
                                                onClick={() => { setIsLogin(!isLogin); setError(''); setIsPhoneLogin(false); }}
                                                className="text-primary font-bold hover:underline"
                                            >
                                                {isLogin ? 'Create an Account' : 'Login here'}
                                            </button>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AuthPage;

