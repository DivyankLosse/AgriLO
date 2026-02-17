import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const { t } = useLanguage();

    return (
        <div className="relative flex min-h-screen w-full flex-col group/design-root font-display">
            {/* Top Navigation */}
            <nav className="w-full bg-surface-light dark:bg-surface-dark border-b border-[#f0f4f0] dark:border-[#2a442d] sticky top-0 z-50 transition-colors duration-300">
                <div className="px-4 md:px-10 py-3 max-w-[1280px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-8 text-primary">
                            <span className="material-symbols-outlined text-3xl">spa</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-main dark:text-white">Agri-Lo</h2>
                    </div>
                    <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                        <div className="flex items-center gap-6 lg:gap-9">
                            {/* Navigation Links can be added here if needed */}
                        </div>
                        <div className="flex gap-3 items-center">
                            <Link to="/auth" className="flex items-center justify-center rounded-xl h-10 px-4 bg-primary text-text-main-light text-sm font-bold shadow-lg hover:bg-opacity-90 transition-all text-white">
                                <span className="truncate">Login / Sign Up</span>
                            </Link>
                            <button aria-label="Language Selector" className="flex items-center justify-center rounded-xl h-10 w-10 bg-[#f0f4f0] dark:bg-[#2a442d] hover:bg-[#e0e4e0] dark:hover:bg-[#3a553d] text-text-main-light dark:text-text-primary-dark transition-colors">
                                <span className="material-symbols-outlined text-[20px]">language</span>
                            </button>
                        </div>
                    </div>
                    {/* Mobile Menu Button can be hooked up if state is managed */}
                    <button className="md:hidden p-2 text-text-main dark:text-white">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center w-full bg-background-light dark:bg-background-dark">
                {/* Hero Section */}
                <section className="w-full max-w-[1280px] px-4 md:px-10 py-12 md:py-20 lg:py-24">
                    <div className="@container">
                        <div className="flex flex-col-reverse lg:flex-row gap-10 items-center">
                            {/* Hero Content */}
                            <div className="flex flex-col gap-6 lg:w-1/2 items-start text-left">
                                <div className="flex flex-col gap-4">
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em] text-text-main dark:text-white">
                                        Smart Farming with <span className="text-primary">AI</span>
                                    </h1>
                                    <h2 className="text-base sm:text-lg text-text-light dark:text-text-secondary-dark font-normal leading-relaxed max-w-lg">
                                        Detect plant diseases instantly and get expert farming advice with Agri-Lo. Your personal agronomist in your pocket.
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                                    <Link to="/detect" className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary text-text-main-light text-base font-bold shadow-lg shadow-primary/20 hover:translate-y-[-2px] hover:shadow-xl transition-all w-full sm:w-auto text-white">
                                        <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                                        <span>Scan Your Crop</span>
                                    </Link>
                                    <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-white dark:bg-surface-dark border border-[#dbe6dc] dark:border-[#2a442d] text-text-main dark:text-white text-base font-bold hover:bg-[#f0f4f0] dark:hover:bg-[#233f26] transition-all w-full sm:w-auto">
                                        <span className="material-symbols-outlined text-[20px]">play_circle</span>
                                        <span>Watch Demo</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#f0f4f0] dark:border-[#2a442d]">
                                    {/* Trusted by section */}
                                    <p className="text-sm font-medium text-text-light dark:text-text-secondary-dark">Trusted by <span className="text-primary font-bold">50,000+</span> farmers</p>
                                </div>
                            </div>
                            {/* Hero Image */}
                            <div className="lg:w-1/2 w-full">
                                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl shadow-emerald-900/10 dark:shadow-black/20 group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                                    <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCWQZmtRIsl8O59TKNx4iASLJC97ldFHiHJeA_0NAsHwbJsJC9TTU6tzO93UkujqqtZFCyqa_aJlUJq7hOOz8b-KOAnaAzjdZNwuW5G1BLunLWSJbCwsTjTE5AbwPnkfdUAFBLn-x4Kbz8HcB6wwHc53DEVY-8kVh0NYGak8ayXeLe03Mrd0t4VEM3TYJVjnTp4KSMxuzR940laZEA4zTD8FAC-D9cqC6W0aPNJUs8gPjg5IGdeTTlB_NVhnh8vpTXmFZNIAYV-Vr5k')` }}></div>

                                    {/* Floating Card */}
                                    <div className="absolute bottom-6 left-6 right-6 z-20 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 dark:border-white/10 flex items-center gap-4 animate-fade-in-up">
                                        <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <span className="material-symbols-outlined text-[28px]">check_circle</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-light dark:text-text-secondary-dark font-medium uppercase tracking-wider">Status</p>
                                            <p className="text-lg font-bold text-text-main dark:text-white">Healthy Crop Detected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="w-full bg-[#f0f4f0] dark:bg-[#152b17] py-12">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-10">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {[
                                { icon: 'groups', label: 'Farmers Helped', value: '50,000+' },
                                { icon: 'bug_report', label: 'Diseases Detected', value: '1.2M' },
                                { icon: 'grass', label: 'Crops Covered', value: '50+' },
                                { icon: 'verified', label: 'Accuracy Rate', value: '98%' },
                            ].map((stat, index) => (
                                <div key={index} className="flex flex-col gap-1 p-6 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-transparent dark:border-[#2a442d] hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-2 text-primary">
                                        <span className="material-symbols-outlined">{stat.icon}</span>
                                    </div>
                                    <p className="text-text-light dark:text-text-secondary-dark text-sm font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold tracking-tight text-text-main dark:text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full max-w-[1280px] px-4 md:px-10 py-16 md:py-24">
                    <div className="flex flex-col items-center text-center gap-4 mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Features</span>
                        <h2 className="text-3xl md:text-4xl font-black leading-tight max-w-2xl text-text-main dark:text-white">
                            Why Choose Agri-Lo?
                        </h2>
                        <p className="text-text-light dark:text-text-secondary-dark text-lg max-w-2xl">
                            Empowering farmers with cutting-edge technology for better yields and healthier crops.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: 'photo_camera', title: 'AI Disease Detection', desc: 'Instantly identify crop diseases by taking a photo and get AI-driven treatment suggestions.' },
                            { icon: 'ssid_chart', title: 'Crop Analytics', desc: 'Track weather patterns, soil health, and growth stages to optimize your harvest schedule.' },
                            { icon: 'smart_toy', title: 'AI Assistant', desc: 'Chat with our AI bot to get answers to all your farming queries in your local language.' },
                        ].map((feature, index) => (
                            <div key={index} className="flex flex-col gap-4 rounded-2xl border border-[#dbe6dc] dark:border-[#2a442d] bg-white dark:bg-surface-dark p-8 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
                                <div className="w-14 h-14 rounded-full bg-[#f0f4f0] dark:bg-[#2a442d] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[32px]">{feature.icon}</span>
                                </div>
                                <div className="flex flex-col gap-2 mt-2">
                                    <h3 className="text-xl font-bold text-text-main dark:text-white">{feature.title}</h3>
                                    <p className="text-text-light dark:text-text-secondary-dark leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full px-4 md:px-10 py-10 mb-10">
                    <div className="max-w-[1280px] mx-auto rounded-[2rem] overflow-hidden relative">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBIfanTFvP8BjJIHoVhMXXgBDaa9lFsx8WoHbD7jasiPIvsIfGE7W8ejuIwFHANq6UwUJjkRxS0OTmzsigQyjmE3skgfjQANF1SgTK9nrISm1d396jgIW44F6GBcI6XL17vksCBVrgsEF29mxIaLCJMbFw-2c94CQHoln72mBSfLQ5SToqIyKTm9ecxQ1MU1yT9USVfkgpUxlalS2L2Fr89EJtt9IArttQbXbEefp4qtctxtaBBGMgO4uGHXcNOpcQ7TtuEgEIrbHxD')` }}></div>
                        <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-[2px]"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-8 py-20 px-6">
                            <div className="flex flex-col gap-4 max-w-2xl">
                                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                    Ready to improve your yield?
                                </h2>
                                <p className="text-gray-200 text-lg md:text-xl font-normal leading-relaxed">
                                    Join thousands of farmers using Agri-Lo today to make smarter decisions for a better harvest.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Link to="/auth" className="flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-primary text-text-main-light text-lg font-bold shadow-lg hover:bg-green-400 hover:scale-105 transition-all text-white">
                                    <span>Get Started for Free</span>
                                    <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                                </Link>
                                <button className="flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-lg font-bold hover:bg-white/20 transition-all">
                                    <span>Contact Sales</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full bg-white dark:bg-surface-dark border-t border-[#f0f4f0] dark:border-[#2a442d] py-12">
                <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div className="flex items-center gap-3">
                        <div className="size-6 text-primary">
                            <span className="material-symbols-outlined">spa</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-text-main dark:text-white">Agri-Lo</span>
                    </div>
                    <p className="text-text-light dark:text-text-secondary-dark text-sm">© 2026 Agri-Lo. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-text-light dark:text-text-secondary-dark hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="text-text-light dark:text-text-secondary-dark hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="text-text-light dark:text-text-secondary-dark hover:text-primary transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
