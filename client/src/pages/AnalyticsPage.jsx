import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const AnalyticsPage = () => {
    const { t } = useLanguage();
    const [data, setData] = useState({
        soil_trends: [],
        soil_status: "Excellent",
        soil_problems: [],
        disease_stats: [],
        recent_activity: []
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        fetchAnalytics();

        // Continuous Sync: Poll every 5 seconds
        const interval = setInterval(fetchAnalytics, 5000);

        return () => clearInterval(interval);
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/analytics/summary');
            setData(response.data);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (isoString) => {
        try {
            return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (e) {
            return isoString;
        }
    };

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString();
        } catch (e) {
            return dateStr;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-text-main dark:text-white leading-tight tracking-[-0.033em]">
                        Farm Analytics
                    </h1>
                    <p className="text-text-light dark:text-text-secondary-dark mt-1">
                        Real-time insights on soil health and disease patterns.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800/30">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-green-700 dark:text-green-400">Live Sync</span>
                        </div>
                        <span className="text-[10px] text-text-light dark:text-text-secondary-dark font-medium">Last Updated: {lastUpdated}</span>
                    </div>
                    <button onClick={fetchAnalytics} className="flex items-center gap-2 bg-white dark:bg-surface-dark px-4 py-2 rounded-xl border border-[#f0f4f0] dark:border-[#2a3c2e] text-sm font-bold text-text-main dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">refresh</span>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Live Soil Monitor & Problems */}
                <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-text-main dark:text-white">Live Soil Monitor</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${data.soil_status === 'Critical' ? 'bg-red-100 text-red-700' :
                            data.soil_status === 'Fair' ? 'bg-orange-100 text-orange-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                            {data.soil_status}
                        </span>
                    </div>

                    <div className="flex-1 space-y-4">
                        <p className="text-sm font-bold text-text-light dark:text-text-secondary-dark uppercase tracking-wider">Detected Issues</p>
                        {data.soil_problems.length > 0 ? (
                            <div className="space-y-3">
                                {data.soil_problems.map((problem, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20 text-red-700 dark:text-red-400">
                                        <span className="material-symbols-outlined text-red-500">warning</span>
                                        <span className="text-sm font-bold leading-tight">{problem}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 bg-[#f0f4f0] dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
                                <span className="material-symbols-outlined text-green-500 text-4xl mb-2">check_circle</span>
                                <p className="text-sm text-text-light dark:text-text-secondary-dark font-medium text-center">No critical soil problems detected. Conditions are optimal.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Distribution Chart (Disease Stats) */}
                <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm h-[400px]">
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-6">Disease Frequency</h3>
                    {data.disease_stats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={data.disease_stats} layout="vertical" barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                                <Bar dataKey="count" fill="#ef4444" radius={[0, 8, 8, 0]} name="Detections" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <span className="material-symbols-outlined text-4xl mb-2">pest_control_rodent</span>
                            <p>No disease detections yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Live Nutrient Timeline - Full Width */}
            <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm h-[400px]">
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-6">Live Nutrient Timeline (NPK)</h3>
                {data.soil_trends.length > 0 ? (
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={data.soil_trends}>
                            <defs>
                                <linearGradient id="colorN" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#11d421" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#11d421" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorK" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="date" tickFormatter={formatTime} axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="nitrogen" stackId="1" stroke="#11d421" fill="url(#colorN)" name="Nitrogen" isAnimationActive={false} />
                            <Area type="monotone" dataKey="phosphorus" stackId="1" stroke="#3b82f6" fill="url(#colorP)" name="Phosphorus" isAnimationActive={false} />
                            <Area type="monotone" dataKey="potassium" stackId="1" stroke="#f59e0b" fill="url(#colorK)" name="Potassium" isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-4xl mb-2">bar_chart_off</span>
                        <p>No live data available yet.</p>
                    </div>
                )}
            </div>

            {/* Recent Analysis Logs */}
            <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm">
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-6">Recent Activity Log</h3>
                <div className="overflow-x-auto">
                    {data.recent_activity.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-text-light dark:text-text-secondary-dark text-sm border-b border-[#f0f4f0] dark:border-[#2a3c2e]">
                                    <th className="font-medium py-3 px-4">Image</th>
                                    <th className="font-medium py-3 px-4">Date</th>
                                    <th className="font-medium py-3 px-4">Type</th>
                                    <th className="font-medium py-3 px-4">Result</th>
                                    <th className="font-medium py-3 px-4">Confidence</th>
                                    <th className="font-medium py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {data.recent_activity.map((row, idx) => (
                                    <tr key={idx} className="border-b border-[#f0f4f0] dark:border-[#2a3c2e] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="size-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10">
                                                {row.image ? (
                                                    <img src={row.image} alt={row.type} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <span className="material-symbols-outlined text-sm">image_not_supported</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-text-main dark:text-white">
                                            {formatDate(row.date)}
                                        </td>
                                        <td className="py-4 px-4 text-text-main dark:text-white font-medium capitalize">
                                            {row.type}
                                        </td>
                                        <td className="py-4 px-4 font-bold text-text-main dark:text-white">
                                            {row.result}
                                        </td>
                                        <td className="py-4 px-4 text-text-main dark:text-white">{row.confidence}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'Critical' ? 'bg-red-100 text-red-600' :
                                                row.status === 'Warning' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No recent activity.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
