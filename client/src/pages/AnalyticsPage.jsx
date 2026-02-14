import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const AnalyticsPage = () => {
    const { t } = useLanguage();
    const [data, setData] = useState({
        soil_trends: [],
        disease_stats: [],
        recent_activity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/analytics/summary');
            setData(response.data);
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        } finally {
            setLoading(false);
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
                <button onClick={fetchAnalytics} className="flex items-center gap-2 bg-white dark:bg-surface-dark px-4 py-2 rounded-xl border border-[#f0f4f0] dark:border-[#2a3c2e] text-sm font-bold text-text-main dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined">refresh</span>
                    Refresh Data
                </button>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Trend Chart (Soil NPK) */}
                <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm h-[400px]">
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-6">Soil Nutrient Trends</h3>
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
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="nitrogen" stackId="1" stroke="#11d421" fill="url(#colorN)" name="Nitrogen" />
                                <Area type="monotone" dataKey="phosphorus" stackId="1" stroke="#3b82f6" fill="url(#colorP)" name="Phosphorus" />
                                <Area type="monotone" dataKey="potassium" stackId="1" stroke="#f59e0b" fill="url(#colorK)" name="Potassium" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <span className="material-symbols-outlined text-4xl mb-2">bar_chart_off</span>
                            <p>No soil data available.</p>
                        </div>
                    )}
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
                                            {new Date(row.date).toLocaleDateString()}
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
