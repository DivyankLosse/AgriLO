import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const NPKChart = ({ nitrogen, phosphorus, potassium }) => {
    const data = [
        { name: 'Nitrogen (N)', value: nitrogen, color: '#60a5fa' },
        { name: 'Phosphorus (P)', value: phosphorus, color: '#f472b6' },
        { name: 'Potassium (K)', value: potassium, color: '#fbbf24' },
    ];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis label={{ value: 'mg/kg', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default NPKChart;
