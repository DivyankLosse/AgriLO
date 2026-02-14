import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const DetectPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    const handleAnalyze = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/analysis/detect', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status === 'success') {
                // Navigate to result page with data
                // In a real app we might redirect to /analysis/:id if the backend saved it
                // For now passing state
                navigate('/analysis/result', { state: { result: response.data.data, image: preview } });
            } else {
                setError('Analysis failed: ' + JSON.stringify(response.data.data));
            }
        } catch (err) {
            console.error(err);
            setError('Error uploading image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-black text-text-main dark:text-white leading-tight tracking-[-0.033em]">
                    Upload Crop Data
                </h1>
                <p className="text-text-light dark:text-text-secondary-dark mt-2">
                    Upload a clear photo of your crop leaf for instant disease detection.
                </p>
            </div>

            <div className={`
                relative flex flex-col items-center justify-center w-full min-h-[400px] rounded-3xl border-4 border-dashed transition-all duration-300
                ${isDragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-[#dbe6dc] dark:border-[#2a3c2e] bg-white dark:bg-surface-dark'}
                ${preview ? 'border-solid border-none p-0 overflow-hidden' : 'p-10'}
            `}>
                <div {...getRootProps()} className="absolute inset-0 z-10 cursor-pointer focus:outline-none" />
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative w-full h-full min-h-[400px]">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20 pointer-events-none">
                            <p className="text-white font-medium">Click or Drag to change image</p>
                        </div>
                        <button
                            onClick={clearFile}
                            className="absolute top-4 right-4 z-30 size-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-red-500 transition-colors flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 text-center pointer-events-none">
                        <div className="size-24 rounded-full bg-[#f0f4f0] dark:bg-[#2a3c2e] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-text-main dark:text-white">
                                {isDragActive ? 'Drop your photo here' : 'Click or Drag Photo Here'}
                            </h3>
                            <p className="text-text-light dark:text-text-secondary-dark mt-2 text-sm max-w-xs mx-auto">
                                Supports JPG, PNG, WEBP. Max size 10MB.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-center font-medium">
                    {error}
                </div>
            )}

            <div className="flex justify-center">
                <button
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                    className={`
                        w-full md:w-auto min-w-[300px] h-14 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all
                        ${!file || loading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-green-600 hover:scale-[1.02] shadow-primary/30'}
                    `}
                >
                    {loading ? (
                        <>
                            <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-2xl">auto_fix_high</span>
                            Analyze Health
                        </>
                    )}
                </button>
            </div>

            {/* Recent Uploads List - Semantic / Visual Only for now */}
            <div className="mt-8">
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Recent Uploads</h3>
                <div className="flex flex-col gap-3">
                    {[
                        { name: 'Corn_Leaf_001.jpg', date: 'Today, 10:30 AM', size: '2.4 MB', status: 'Completed' },
                        { name: 'Tomato_Blight_Test.png', date: 'Yesterday, 4:15 PM', size: '1.8 MB', status: 'Completed' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark border border-[#f0f4f0] dark:border-[#2a3c2e] rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-[#f0f4f0] dark:bg-[#2a3c2e] flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">image</span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-bold text-text-main dark:text-white text-sm">{item.name}</p>
                                    <p className="text-xs text-text-light dark:text-text-secondary-dark">{item.date} • {item.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full">
                                    {item.status}
                                </span>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetectPage;
