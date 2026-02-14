import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

const ImageUpload = ({ onFileSelect }) => {
    const [preview, setPreview] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false
    });

    const clearSelection = (e) => {
        e.stopPropagation();
        setPreview(null);
        onFileSelect(null);
    };

    return (
        <div style={{ width: '100%', marginBottom: '20px' }}>
            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    padding: '40px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? '#f0fdf4' : '#fff',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    minHeight: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ maxHeight: '300px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }}
                        />
                        <button
                            onClick={clearSelection}
                            style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                background: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '50%',
                                padding: '5px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload size={48} color="#64748b" style={{ marginBottom: '15px' }} />
                        <p style={{ fontSize: '1.1rem', color: '#334155', fontWeight: '500' }}>
                            {isDragActive ? "Drop the leaf image here..." : "Drag & drop leaf image, or click to select"}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '5px' }}>
                            Supports JPG, PNG
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
