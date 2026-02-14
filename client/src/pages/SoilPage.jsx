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

    const [formData, setFormData] = useState({
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        ph: '',
        moisture: '',
        temperature: '25',
        rainfall: '100'
    });

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

    const fetchSensorData = async () => {
        try {
            const response = await api.get('/soil/latest');
            const data = response.data;
            setFormData({
                nitrogen: data.nitrogen,
                phosphorus: data.phosphorus,
                potassium: data.potassium,
                ph: data.ph,
                moisture: data.moisture,
                temperature: data.temperature,
                rainfall: '100' // sensor doesn't provide rainfall usually
            });
        } catch (err) {
            console.error("Failed to fetch sensor data", err);
            setError("No sensor data found or connection failed.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                nitrogen: parseInt(formData.nitrogen),
                phosphorus: parseInt(formData.phosphorus),
                potassium: parseInt(formData.potassium),
                ph: parseFloat(formData.ph),
                moisture: parseFloat(formData.moisture),
                temperature: parseFloat(formData.temperature),
                rainfall: parseFloat(formData.rainfall)
            };

            const response = await api.post('/analysis/soil/analyze', payload);
            setResult(response.data.data);
        } catch (err) {
            console.error(err);
            setError('Failed to analyze soil. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-black text-text-main dark:text-white leading-tight tracking-[-0.033em]">
                    Soil Quality Analysis
                </h1>
                <p className="text-text-light dark:text-text-secondary-dark mt-2">
                    Enter sensor data or simulate IoT readings to get AI-powered crop recommendations.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Input Form */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">sensors</span>
                                Sensor Data
                            </h3>
                            <button
                                type="button"
                                onClick={fetchSensorData}
                                className="px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary/5 text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">sync</span>
                                Sync Sensor
                            </button>
                            <button
                                type="button"
                                onClick={simulateIoT}
                                className="px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary/5 text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">wifi_tethering</span>
                                Simulate IoT
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-text-light dark:text-text-secondary-dark uppercase tracking-wider">Nutrients (mg/kg)</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'N', name: 'nitrogen', color: 'border-blue-200 focus:border-blue-500' },
                                        { label: 'P', name: 'phosphorus', color: 'border-orange-200 focus:border-orange-500' },
                                        { label: 'K', name: 'potassium', color: 'border-purple-200 focus:border-purple-500' }
                                    ].map((field) => (
                                        <div key={field.name}>
                                            <label className="block text-xs font-bold text-text-main dark:text-white mb-1.5 text-center">{field.label}</label>
                                            <input
                                                type="number"
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                required
                                                className={`w-full h-12 px-3 text-center rounded-xl bg-[#f0f4f0] dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#1a2e1d] outline-none transition-all font-bold text-lg ${field.color}`}
                                                placeholder="0"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <p className="text-xs font-bold text-text-light dark:text-text-secondary-dark uppercase tracking-wider">Conditions</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'pH Level', name: 'ph', step: '0.1', icon: 'science' },
                                        { label: 'Moisture %', name: 'moisture', step: '1', icon: 'water_drop' },
                                        { label: 'Temp (°C)', name: 'temperature', step: '1', icon: 'thermostat' },
                                        { label: 'Rainfall (mm)', name: 'rainfall', step: '1', icon: 'rainy' }
                                    ].map((field) => (
                                        <div key={field.name}>
                                            <label className="block text-xs font-medium text-text-light dark:text-text-secondary-dark mb-1.5">{field.label}</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    step={field.step}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#f0f4f0] dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#1a2e1d] focus:border-primary/50 outline-none transition-all font-medium"
                                                    placeholder="0"
                                                />
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">{field.icon}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full h-14 mt-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-green-600 hover:scale-[1.02] shadow-primary/30'}`}
                            >
                                {loading ? (
                                    <>
                                        <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">analytics</span>
                                        Analyze Soil
                                    </>
                                )}
                            </button>
                        </form>
                        {error && <p className="text-red-500 text-sm font-medium mt-3 text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</p>}
                    </div>
                </div>

                {/* Right Column: Results Section */}
                <div className="lg:col-span-7">
                    <div className={`h-full min-h-[500px] rounded-2xl bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm p-6 relative overflow-hidden transition-all ${!result ? 'flex items-center justify-center' : ''}`}>

                        {!result ? (
                            <div className="text-center text-text-light dark:text-text-secondary-dark flex flex-col items-center gap-4 max-w-sm mx-auto">
                                <div className="size-20 rounded-full bg-[#f0f4f0] dark:bg-[#2a3c2e] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-gray-400">query_stats</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-main dark:text-white">Analysis Pending</h3>
                                    <p className="text-sm mt-1">Fill in the sensor data on the left or click "Simulate IoT" to see AI recommendations.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="fade-in space-y-8">
                                <div className="flex items-center justify-between border-b border-[#f0f4f0] dark:border-[#2a3c2e] pb-6">
                                    <div>
                                        <p className="text-xs font-bold text-text-light dark:text-text-secondary-dark uppercase tracking-wider mb-1">Health Score</p>
                                        <div className="flex items-baseline gap-3">
                                            <h2 className="text-4xl font-black text-text-main dark:text-white">{result.health_score}</h2>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.health_status === 'Good' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {result.health_status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-text-light dark:text-text-secondary-dark uppercase tracking-wider mb-1">Recommended Crop</p>
                                        <h2 className="text-3xl font-black text-primary">{result.recommended_crop}</h2>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-lg">donut_small</span>
                                            Nutrient Balance
                                        </h4>
                                        <div className="bg-[#f0f4f0] dark:bg-white/5 rounded-xl p-4">
                                            {/* Reuse existing NPKChart or simplified bars if preferred. Using Chart component for now */}
                                            <NPKChart
                                                nitrogen={result.input_data.nitrogen}
                                                phosphorus={result.input_data.phosphorus}
                                                potassium={result.input_data.potassium}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-lg">checklist</span>
                                            Action Plan
                                        </h4>
                                        <ul className="space-y-3">
                                            {result.recommendations.map((rec, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-text-main dark:text-white">
                                                    <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">check_circle</span>
                                                    <span className="leading-snug">{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoilPage;
