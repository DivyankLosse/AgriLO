import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import api from '../services/api';

const Dashboard = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [weather, setWeather] = useState(null);

    // Mock Market Data (Can be replaced with API if available)
    const marketData = {
        value: '₹ 2,100',
        crop: 'Wheat',
        trend: '+2.5%'
    };

    useEffect(() => {
        // Simple Open-Meteo fetch for location (defaulting to New Delhi for demo if geoloc fails)
        const fetchWeather = async (lat, lon) => {
            try {
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m`);
                const data = await response.json();
                setWeather({
                    temp: data.current.temperature_2m,
                    humidity: data.current.relative_humidity_2m,
                    wind: data.current.wind_speed_10m,
                    rain: data.current.rain
                });
            } catch (error) {
                console.error("Weather fetch failed", error);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                () => fetchWeather(28.61, 77.20) // Default: New Delhi
            );
        } else {
            fetchWeather(28.61, 77.20);
        }
    }, []);

    const stats = [
        {
            title: t('farm_status'),
            value: t('good'),
            subText: 'Optimal Conditions',
            icon: 'spa',
            color: 'text-primary',
            bg: 'bg-primary/10',
            borderColor: 'border-primary/20'
        },
        {
            title: t('soil_health'),
            value: 'Monitor',
            subText: 'Nitrogen Low',
            icon: 'landscape',
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            borderColor: 'border-orange-500/20'
        },
        {
            title: t('weather'),
            value: weather ? `${weather.temp}°C` : 'Loading...',
            subText: weather ? `${t('humidity')}: ${weather.humidity}%` : 'Fetching...',
            icon: 'partly_cloudy_day',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
        },
        {
            title: t('market'),
            value: marketData.value,
            subText: `${marketData.crop} ${marketData.trend}`,
            icon: 'trending_up',
            color: 'text-green-600',
            bg: 'bg-green-600/10',
            borderColor: 'border-green-600/20'
        }
    ];

    const [recentScans, setRecentScans] = useState([]);

    // Fetch History
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/analysis/history?limit=3');
                setRecentScans(response.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            }
        };
        fetchHistory();
    }, []);

    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-700';
        const lower = status.toLowerCase();
        if (lower.includes('good') || lower.includes('healthy')) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
        return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black leading-tight text-text-main dark:text-white tracking-[-0.033em]">
                        {t('hello')}, {user?.name?.split(' ')[0] || 'Farmer'}! ☀️
                    </h1>
                    <p className="text-text-light dark:text-text-secondary-dark font-medium mt-1">
                        Here's what's happening on your farm today.
                    </p>
                </div>
                <Link to="/detect" className="hidden md:flex items-center gap-2 bg-primary hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                    <span className="material-symbols-outlined">add_a_photo</span>
                    {t('new_scan')}
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className={`p-5 rounded-2xl bg-white dark:bg-surface-dark border ${stat.borderColor} shadow-sm flex flex-col gap-3 group hover:shadow-md transition-all`}>
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <span className="material-symbols-outlined">{stat.icon}</span>
                            </div>
                            {index === 0 && <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">8.5/10</span>}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-light dark:text-text-secondary-dark">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-text-main dark:text-white mt-1">{stat.value}</h3>
                            <p className={`text-xs font-medium mt-1 ${stat.color} brightness-90`}>{stat.subText}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Scans Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-text-main dark:text-white">{t('recent_scans')}</h2>
                    <Link to="/history" className="text-primary font-bold text-sm hover:underline">{t('view_all')}</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* New Scan Card (Mobile visible) */}
                    <Link to="/detect" className="md:hidden flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors gap-3">
                        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">add</span>
                        </div>
                        <span className="font-bold text-primary">{t('new_scan')}</span>
                    </Link>

                    {recentScans.length > 0 ? recentScans.map((scan) => (
                        <div key={scan.id} className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-[#f0f4f0] dark:border-[#2a3c2e] hover:border-primary/50 transition-all group overflow-hidden">
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100">
                                <div className="absolute top-2 right-2 z-10">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${getStatusColor(scan.status)}`}>
                                        {scan.status}
                                    </span>
                                </div>
                                <img src={scan.image} alt={scan.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-lg font-bold text-text-main dark:text-white truncate max-w-[150px]">{scan.type === 'Leaf' ? scan.result.split('___')[1]?.replace(/_/g, ' ') || scan.result : scan.result}</h3>
                                    <div className="flex items-center gap-1 text-text-light dark:text-text-secondary-dark text-xs mt-1">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                        {new Date(scan.date).toLocaleDateString()}
                                    </div>
                                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider mt-1 block">{scan.type}</span>
                                </div>

                                <Link
                                    to="/analysis/result"
                                    state={{
                                        result: {
                                            disease: scan.result,
                                            confidence: scan.confidence,
                                            status: scan.status,
                                            description: scan.type === 'Root' ? `Root Diagnosis: ${scan.diagnosis}` : undefined,
                                            treatments: scan.treatment,
                                            type: scan.type
                                        },
                                        image: scan.image
                                    }}
                                    className="size-10 rounded-full bg-[#f0f4f0] dark:bg-[#2a3c2e] flex items-center justify-center text-text-main dark:text-white group-hover:bg-primary group-hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-8 text-center text-text-light">No recent scans found. Start by scanning a crop!</div>
                    )}

                    {/* Upload Placeholder for Desktop */}
                    <Link to="/detect" className="hidden md:flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#dbe6dc] dark:border-[#2a3c2e] rounded-2xl bg-[#f0f4f0]/50 dark:bg-white/5 hover:border-primary hover:bg-primary/5 transition-all gap-4 group">
                        <div className="size-16 rounded-full bg-white dark:bg-[#2a3c2e] shadow-sm flex items-center justify-center text-text-light dark:text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all">
                            <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-text-main dark:text-white group-hover:text-primary">{t('new_scan')}</h3>
                            <p className="text-sm text-text-light dark:text-text-secondary-dark">{t('detect_disease')}</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Quick Actions / Tools Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
                {[
                    { name: t('weather'), icon: 'thunderstorm', color: 'text-blue-500', bg: 'bg-blue-50', action: () => alert("Weather details provided above!") },
                    { name: t('fertilizer'), icon: 'compost', color: 'text-green-600', bg: 'bg-green-50', action: () => navigate('/fertilizer') },
                    { name: t('soil_test'), icon: 'science', color: 'text-purple-500', bg: 'bg-purple-50', action: () => navigate('/soil') },
                    { name: t('market'), icon: 'storefront', color: 'text-orange-500', bg: 'bg-orange-50', action: () => navigate('/market') },
                ].map((tool, idx) => (
                    <button
                        key={idx}
                        onClick={tool.action}
                        className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-surface-dark rounded-2xl border border-[#f0f4f0] dark:border-[#2a3c2e] hover:shadow-md transition-all active:scale-95"
                    >
                        <div className={`size-12 rounded-full ${tool.bg} dark:bg-white/10 flex items-center justify-center ${tool.color}`}>
                            <span className="material-symbols-outlined text-2xl">{tool.icon}</span>
                        </div>
                        <span className="font-bold text-text-main dark:text-white text-sm">{tool.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
