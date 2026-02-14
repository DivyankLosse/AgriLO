import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const AnalysisResultPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    // Fallback data for development/preview if no state passed
    const defaultResult = {
        disease: "Early Blight",
        confidence: 0.94,
        status: "Critical",
        description: "Early blight is a common disease of tomato and potato and is caused by the fungus Alternaria solani. It can cause significant yield loss if not managed properly.",
        treatments: [
            "Remove infected leaves immediately to prevent spread.",
            "Apply copper-based fungicides or chlorothalonil.",
            "Improve air circulation by proper spacing.",
            "Avoid overhead irrigation to keep foliage dry."
        ]
    };

    const { result = defaultResult, image = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIfanTFvP8BjJIHoVhMXXgBDaa9lFsx8WoHbD7jasiPIvsIfGE7W8ejuIwFHANq6UwUJjkRxS0OTmzsigQyjmE3skgfjQANF1SgTK9nrISm1d396jgIW44F6GBcI6XL17vksCBVrgsEF29mxIaLCJMbFw-2c94CQHoln72mBSfLQ5SToqIyKTm9ecxQ1MU1yT9USVfkgpUxlalS2L2Fr89EJtt9IArttQbXbEefp4qtctxtaBBGMgO4uGHXcNOpcQ7TtuEgEIrbHxD' } = location.state || {};

    // Normalize result data coming from History vs Fresh Scan
    // History might have `treatment` as string, array, or object (structured data)
    let normalizedTreatments = [];
    const rawTreatment = result.treatments || result.treatment;

    if (Array.isArray(rawTreatment)) {
        // If it's an array, it might be strings or objects. We need strings.
        normalizedTreatments = rawTreatment.map(t => {
            if (typeof t === 'string') return t;
            if (typeof t === 'object' && t !== null) {
                // If element is object {immediate: ..., preventive: ...}, flatten it
                return [t.immediate, t.preventive].flat().filter(x => typeof x === 'string');
            }
            return JSON.stringify(t);
        }).flat();
    } else if (typeof rawTreatment === 'object' && rawTreatment !== null) {
        // Handle structured treatment object { immediate, preventive, etc. }
        if (Array.isArray(rawTreatment.immediate)) normalizedTreatments.push(...rawTreatment.immediate);
        if (Array.isArray(rawTreatment.preventive)) normalizedTreatments.push(...rawTreatment.preventive);

        // Fallback if structured but empty arrays or other format (like pesticides)
        if (normalizedTreatments.length === 0) {
            Object.values(rawTreatment).forEach(val => {
                if (typeof val === 'string') normalizedTreatments.push(val);
                else if (Array.isArray(val)) normalizedTreatments.push(...val.filter(v => typeof v === 'string'));
            });
        }
    } else if (typeof rawTreatment === 'string') {
        normalizedTreatments = [rawTreatment];
    }

    if (normalizedTreatments.length === 0) {
        normalizedTreatments = ["Consult an expert for advice."];
    }

    // Determine if we should show confidence
    // Hide for Root (confidence is often null/not applicable) or if missing
    // Hide for Soil (uses score instead)
    const showConfidence = result.confidence != null && result.type !== 'Root' && result.type !== 'Soil';

    const isHealthy = result?.disease?.toLowerCase().includes('healthy');
    const isUnknown = result?.disease === 'Unknown' || result?.disease === 'Model error';

    let statusColor = 'text-red-600 bg-red-100';
    let borderColor = 'border-red-200';

    if (isHealthy) {
        statusColor = 'text-green-600 bg-green-100';
        borderColor = 'border-green-200';
    } else if (isUnknown) {
        statusColor = 'text-gray-600 bg-gray-100';
        borderColor = 'border-gray-200';
    }

    // Parse Disease String (Format: Crop___Disease)
    const parsePrediction = (label) => {
        if (!label) return { crop: 'Unknown', disease: 'Unknown' };
        // Check for double or triple underscore
        const parts = label.split('___');
        if (parts.length > 1) {
            return {
                crop: parts[0].replace(/_/g, ' '),
                disease: parts[1].replace(/_/g, ' ')
            };
        }
        return { crop: 'Unknown', disease: label };
    };

    const { crop, disease: cleanDiseaseName } = parsePrediction(result.disease);

    // Fetch Similar Cases
    const [similarCases, setSimilarCases] = React.useState([]);

    React.useEffect(() => {
        if (!isHealthy && result.disease) {
            import('../services/api').then(module => {
                const api = module.default;
                api.get(`/analysis/similar?disease=${encodeURIComponent(result.disease)}`)
                    .then(res => setSimilarCases(res.data))
                    .catch(e => console.error("Failed to fetch similar cases", e));
            });
        }
    }, [isHealthy, result.disease]);

    const handleBuyFungicides = () => {
        // Open Google Shopping
        const query = `${cleanDiseaseName} fungicide treatment`;
        window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`, '_blank');
    };

    const handleAskExpert = () => {
        // Navigate to Chat
        navigate('/chat');
    };

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-text-light dark:text-text-secondary-dark">
                <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <Link to="/detect" className="hover:text-primary">Detect</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="font-bold text-text-main dark:text-white">Analysis Result</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">

                {/* Left Column: Image & Quick Stats */}
                <div className="flex flex-col gap-6">
                    <div className="w-full relative rounded-2xl overflow-hidden shadow-sm border border-[#f0f4f0] dark:border-[#2a3c2e] bg-black">
                        <img
                            src={image}
                            alt="Analyzed Crop"
                            className="w-full h-auto max-h-[500px] object-contain mx-auto"
                        />
                        {showConfidence && (
                            <div className={`absolute top-4 left-4 px-4 py-2 rounded-xl font-bold backdrop-blur-md shadow-sm ${statusColor}`}>
                                {Number(result.confidence).toFixed(0)}% Confidence
                            </div>
                        )}
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm">
                        <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Analysis Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-[#f0f4f0] dark:bg-white/5">
                                <span className="text-xs text-text-light dark:text-text-secondary-dark font-bold uppercase tracking-wider">Detected Issue</span>
                                <p className={`text-lg font-black mt-1 ${isHealthy ? 'text-green-600' : (isUnknown ? 'text-gray-500' : 'text-red-500')}`}>
                                    {isHealthy ? 'Healthy' : (isUnknown ? 'Inconclusive' : 'Diseased')}
                                </p>
                                {!isHealthy && <p className="text-xs text-text-light mt-1">{cleanDiseaseName}</p>}
                            </div>
                            <div className="p-4 rounded-xl bg-[#f0f4f0] dark:bg-white/5">
                                <span className="text-xs text-text-light dark:text-text-secondary-dark font-bold uppercase tracking-wider">Date</span>
                                <p className="text-lg font-black mt-1 text-text-main dark:text-white">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Diagnosis & Action */}
                <div className="flex flex-col gap-6">
                    <div className={`p-8 rounded-2xl bg-white dark:bg-surface-dark border-2 ${borderColor} shadow-sm relative overflow-hidden`}>
                        {/* Background Accent */}
                        <div className={`absolute top-0 right-0 p-16 opacity-5 pointer-events-none rounded-bl-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>

                        <div className="mb-6">
                            <h2 className="text-3xl font-black text-text-main dark:text-white leading-tight mb-2">
                                {isHealthy ? 'Great News! Your crop is healthy.' : (isUnknown ? 'Analysis Inconclusive' : 'Attention Required!')}
                            </h2>
                            <p className="text-text-light dark:text-text-secondary-dark text-lg leading-relaxed">
                                {result.description || "No specific description available."}
                            </p>
                        </div>

                        {!isHealthy && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">medical_services</span>
                                        Recommended Treatment
                                    </h3>
                                    <ul className="space-y-3">
                                        {normalizedTreatments.map((step, idx) => (
                                            <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#f0f4f0] dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-[#dbe6dc] transition-all">
                                                <span className="flex-shrink-0 size-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs mt-0.5">{idx + 1}</span>
                                                <span className="text-text-main dark:text-white font-medium">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleBuyFungicides}
                                        className="flex-1 h-14 rounded-xl bg-primary hover:bg-green-600 text-white font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">shopping_cart</span>
                                        Buy Fungicides
                                    </button>
                                    <button
                                        onClick={handleAskExpert}
                                        className="flex-1 h-14 rounded-xl border-2 border-primary text-primary hover:bg-primary/5 font-bold transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">forum</span>
                                        Ask Expert
                                    </button>
                                </div>
                            </div>
                        )}

                        {isHealthy && (
                            <div className="flex gap-4">
                                <button onClick={() => navigate('/detect')} className="flex-1 h-14 rounded-xl bg-primary hover:bg-green-600 text-white font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">add_a_photo</span>
                                    Scan Another
                                </button>
                                <button onClick={() => navigate('/dashboard')} className="flex-1 h-14 rounded-xl border-2 border-[#f0f4f0] dark:border-[#2a3c2e] text-text-main dark:text-white hover:bg-[#f0f4f0] font-bold transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">dashboard</span>
                                    Dashboard
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Similar Cases / Community */}
                    {!isHealthy && similarCases.length > 0 && (
                        <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm">
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Similar Cases in Your Area</h3>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {similarCases.map((scan) => (
                                    <div key={scan.id} className="min-w-[150px] rounded-xl overflow-hidden border border-[#f0f4f0] dark:border-[#2a3c2e] bg-white cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/analysis/result', { state: { result: { disease: scan.disease }, image: scan.image } })}>
                                        <img src={scan.image} className="w-full h-24 object-cover" alt="Similar case" />
                                        <div className="p-3">
                                            <p className="font-bold text-xs text-text-main dark:text-white truncate">{scan.disease?.split('___')[1] || scan.disease}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-[10px] text-text-light">2km away</p>
                                                <span className="text-[10px] text-primary font-bold">View</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalysisResultPage;
