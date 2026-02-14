import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

const HistoryPage = () => {
    const { t } = useLanguage();
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch more items for the full history page
                const response = await api.get('/analysis/history?limit=50');
                setScans(response.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
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
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 rounded-full bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] hover:bg-gray-50 flex items-center justify-center">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-2xl font-bold text-text-main dark:text-white">{t('recent_scans')} History</h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scans.length > 0 ? scans.map((scan) => (
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
                                    <h3 className="text-lg font-bold text-text-main dark:text-white truncate max-w-[180px]">
                                        {scan.type === 'Leaf' ? scan.result.split('___')[1]?.replace(/_/g, ' ') || scan.result : scan.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-text-light dark:text-text-secondary-dark text-xs mt-1">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                        {new Date(scan.date).toLocaleDateString()}
                                    </div>
                                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider mt-1 block">{scan.type} Analysis</span>
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
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-text-light opacity-60">
                            <span className="material-symbols-outlined text-6xl mb-4">history_toggle_off</span>
                            <p>No history found. Perform a scan to see it here!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
