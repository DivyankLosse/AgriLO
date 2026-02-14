import React from 'react';
import { AlertCircle, CheckCircle, Shield, Bug } from 'lucide-react';

const DiseaseResults = ({ result }) => {
    if (!result) return null;

    const { disease, confidence, severity, treatment } = result;

    // Severity Color
    const getSeverityColor = (sev) => {
        if (sev?.includes('High') || sev?.includes('Critical')) return 'text-red-600 bg-red-50 border-red-200';
        if (sev?.includes('Medium')) return 'text-orange-600 bg-orange-50 border-orange-200';
        if (sev?.includes('Low')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-green-600 bg-green-50 border-green-200';
    };

    const severityClass = getSeverityColor(severity);

    return (
        <div className="fade-in">
            <div className="card mb-4" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#1e293b', marginBottom: '5px' }}>{disease}</h2>
                    <div className="flex justify-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            🎯 Confidence: <strong>{confidence}%</strong>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border ${severityClass} text-xs font-bold`}>
                            Severity: {severity}
                        </span>
                    </div>
                </div>

                {/* Treatment Sections */}
                <div className="grid gap-4">

                    {/* Immediate Action */}
                    <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                        <h4 className="flex items-center gap-2 text-red-800 font-bold mb-2">
                            <AlertCircle size={20} /> Immediate Action
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-red-700">
                            {treatment.immediate?.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Prevention */}
                    <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                        <h4 className="flex items-center gap-2 text-green-800 font-bold mb-2">
                            <Shield size={20} /> Prevention
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-green-700">
                            {treatment.preventive?.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Pesticides */}
                    {treatment.pesticides?.length > 0 && (
                        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100">
                            <h4 className="flex items-center gap-2 text-yellow-800 font-bold mb-2">
                                <Bug size={20} /> Recommended Pesticides
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-yellow-700">
                                {treatment.pesticides.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default DiseaseResults;
