import React from 'react';
import { motion } from 'framer-motion';

const SoilGauge = ({ score }) => {
    // Score 0-100
    // Color mapping
    const getColor = (s) => {
        if (s >= 75) return '#4ade80'; // Green
        if (s >= 50) return '#facc15'; // Yellow
        return '#ef4444'; // Red
    };

    const color = getColor(score);

    return (
        <div style={{ position: 'relative', width: '200px', height: '100px', overflow: 'hidden', margin: '0 auto' }}>
            <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                border: '20px solid #e5e7eb',
                borderBottom: 'none',
                position: 'absolute',
                top: 0,
                left: 0
            }}></div>
            <motion.div
                initial={{ rotate: -180 }}
                animate={{ rotate: -180 + (score / 100) * 180 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    border: `20px solid ${color}`,
                    borderBottom: 'none',
                    borderRightColor: 'transparent',
                    borderBottomColor: 'transparent',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', // Half circle clip
                    transformOrigin: '50% 50%'
                }}
            />
            <div style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center'
            }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: color }}>{score.toFixed(0)}%</span>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Health Score</div>
            </div>
        </div>
    );
};

export default SoilGauge;
