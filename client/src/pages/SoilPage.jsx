import React, { useState } from 'react';
import api from '../services/api';
import SoilGauge from '../components/features/SoilGauge';
import NPKChart from '../components/features/NPKChart';
import { useLanguage } from '../context/LanguageContext';

const SoilPage = () => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isLiveSync, setIsLiveSync] = useState(true); // Default to live sync

    const [formData, setFormData] = useState({
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        ph: '',
        moisture: '',
        temperature: '25',
        rainfall: '100'
    });

    const [lastSyncData, setLastSyncData] = useState(null);

    React.useEffect(() => {
        let interval;
        if (isLiveSync) {
            fetchSensorData(true); // Initial fetch
            interval = setInterval(() => fetchSensorData(true), 5000);
        }
        return () => clearInterval(interval);
    }, [isLiveSync]);

    const simulateIoT = () => {
        // Random plausible values
        setFormData({
            nitrogen: Math.floor(Math.random() * 150) + 20,
            phosphorus: Math.floor(Math.random() * 80) + 10,
            potassium: Math.floor(Math.random() * 80) + 10,
            ph: (Math.random() * (7.5 - 5.5) + 5.5).toFixed(1),
            moisture: Math.floor(Math.random() * 50) + 30,
            temperature: '28',
            rainfall: '120'
        });
    };

    const fetchSensorData = async (autoAnalyze = false) => {
        try {
            const response = await api.get('/soil/latest');
            const data = response.data;

            const newData = {
                nitrogen: data.nitrogen,
                phosphorus: data.phosphorus,
                potassium: data.potassium,
                ph: data.ph,
                moisture: data.moisture,
                temperature: data.temperature,
                rainfall: formData.rainfall || '100'
            };

            setFormData(newData);

            // If data changed and autoAnalyze is on, trigger analysis
            if (autoAnalyze) {
                const dataString = JSON.stringify({ ...data, rainfall: newData.rainfall });
                if (dataString !== lastSyncData) {
                    setLastSyncData(dataString);
                    performAnalysis(newData);
                }
            }
        } catch (err) {
            console.error("Failed to fetch sensor data", err);
            setError("Sync/Fetch Error: Check server connection or if sensors are active.");
        }
    };

    const performAnalysis = async (payload) => {
        setLoading(true);
        setError('');
        try {
            const formattedPayload = {
                nitrogen: parseInt(payload.nitrogen),
                phosphorus: parseInt(payload.phosphorus),
                potassium: parseInt(payload.potassium),
                ph: parseFloat(payload.ph),
                moisture: parseFloat(payload.moisture),
                temperature: parseFloat(payload.temperature),
                rainfall: parseFloat(payload.rainfall)
            };

            const response = await api.post('/analysis/soil/analyze', formattedPayload);
            setResult(response.data.data);
        } catch (err) {
            console.error(err);
            setError('Failed to analyze soil. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        performAnalysis(formData);
    };

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-black text-text-main dark:text-white leading-tight tracking-[-0.033em]">
                    Soil Monitor
                </h1>
                <p className="text-text-light dark:text-text-secondary-dark mt-2">
                    Real-time data from your IoT sensors. Full analysis is available on the <a href="/analytics" className="text-primary hover:underline">Analytics Dashboard</a>.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Sensors Grid */}
                <div className="lg:col-span-12">
                    <div className="p-8 rounded-3xl bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-3xl">sensors</span>
                                </div>
                                <h3 className="text-xl font-bold text-text-main dark:text-white tracking-tight">Active Sensors</h3>
                            </div>
                            <div
                                onClick={() => setIsLiveSync(!isLiveSync)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${isLiveSync ? 'bg-green-50 border-green-200 text-green-700 shadow-sm shadow-green-100' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                            >
                                <span className={`relative flex h-2.5 w-2.5 ${!isLiveSync && 'hidden'}`}>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-black uppercase tracking-widest">{isLiveSync ? 'Live Mode' : 'Paused'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Nitrogen', value: formData.nitrogen, unit: 'mg/kg', icon: 'N', color: 'text-blue-500', bg: 'bg-blue-50' },
                                { label: 'Phosphorus', value: formData.phosphorus, unit: 'mg/kg', icon: 'P', color: 'text-orange-500', bg: 'bg-orange-50' },
                                { label: 'Potassium', value: formData.potassium, unit: 'mg/kg', icon: 'K', color: 'text-purple-500', bg: 'bg-purple-50' },
                                { label: 'pH Level', value: formData.ph, unit: 'pH', icon: 'science', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                { label: 'Moisture', value: formData.moisture, unit: '%', icon: 'water_drop', color: 'text-cyan-500', bg: 'bg-cyan-50' },
                                { label: 'Temperature', value: formData.temperature, unit: '°C', icon: 'thermostat', color: 'text-red-500', bg: 'bg-red-50' }
                            ].map((s) => (
                                <div key={s.label} className="p-6 rounded-2xl bg-[#f8faf8] dark:bg-white/5 border border-transparent hover:border-primary/20 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`size-10 rounded-xl ${s.bg} flex items-center justify-center font-bold ${s.color}`}>
                                            {s.icon.length > 1 ? <span className="material-symbols-outlined">{s.icon}</span> : s.icon}
                                        </span>
                                        <span className="text-[10px] font-black text-text-light uppercase tracking-tighter opacity-50">{s.unit}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-text-light mb-1">{s.label}</h4>
                                    <p className="text-3xl font-black text-text-main dark:text-white">{s.value || '0'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoilPage;
