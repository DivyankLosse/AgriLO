import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const MarketPage = () => {
    const { t, language } = useLanguage();
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        performSearch(query);
    };

    const performSearch = (searchQuery) => {
        const langCode = language === 'hi' ? 'hi' : language === 'mr' ? 'mr' : 'en';
        // Optimize query for market prices
        const optimizedQuery = `${searchQuery} price today market mandi rate`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(optimizedQuery)}&hl=${langCode}`;
        window.open(url, '_blank');
    };

    const quickCrops = [
        { name: 'Wheat', icon: 'grass' },
        { name: 'Rice', icon: 'grain' },
        { name: 'Cotton', icon: 'checkroom' },
        { name: 'Onion', icon: 'nutrition' },
        { name: 'Potato', icon: 'nutrition' },
        { name: 'Tomato', icon: 'nutrition' },
        { name: 'Soybean', icon: 'eco' },
        { name: 'Mustard', icon: 'local_florist' }
    ];

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-10 min-h-[60vh] justify-center">
            <div className="text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 mb-2">
                    <span className="material-symbols-outlined text-5xl">storefront</span>
                </div>
                <h1 className="text-4xl font-black text-text-main dark:text-white leading-tight tracking-tight">
                    Check Market Prices
                </h1>
                <p className="text-lg text-text-light dark:text-text-secondary-dark max-w-lg mx-auto">
                    Get real-time Mandi rates and market prices for your crops directly from Google.
                </p>
            </div>

            <div className="w-full max-w-2xl mx-auto">
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for 'Wheat price in Punjab'..."
                        className="w-full h-16 pl-14 pr-4 rounded-full bg-white dark:bg-surface-dark border-2 border-[#f0f4f0] dark:border-[#2a3c2e] focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-lg shadow-gray-100 dark:shadow-none outline-none text-lg font-medium transition-all"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 h-12 px-8 bg-primary hover:bg-green-600 text-white rounded-full font-bold transition-all shadow-md active:scale-95"
                    >
                        Search
                    </button>
                </form>
            </div>

            <div className="space-y-4 text-center">
                <p className="text-sm font-bold text-text-light dark:text-text-secondary-dark uppercase tracking-wider">Quick Check</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {quickCrops.map((crop) => (
                        <button
                            key={crop.name}
                            onClick={() => performSearch(crop.name)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-[#f0f4f0] dark:border-[#2a3c2e] hover:border-primary hover:text-primary dark:text-gray-300 transition-all font-medium text-sm shadow-sm hover:shadow-md active:scale-95"
                        >
                            <span className="material-symbols-outlined text-lg">{crop.icon}</span>
                            {crop.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 text-center max-w-2xl mx-auto relative overflow-hidden">
                <span className="material-symbols-outlined absolute top-[-20%] right-[-10%] text-9xl text-orange-200 dark:text-orange-800/20 pointer-events-none">trending_up</span>
                <h3 className="text-lg font-bold text-orange-800 dark:text-orange-300 mb-2">Live Market Trends</h3>
                <p className="text-orange-600 dark:text-orange-400 text-sm">
                    We redirect you to Google to find the latest daily mandi rates across different states and markets.
                </p>
            </div>
        </div>
    );
};

export default MarketPage;
