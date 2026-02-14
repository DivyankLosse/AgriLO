import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DiseaseBar = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        cursor={{ fill: '#f1f5f9' }}
                    />
                    <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={30}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.count > 2 ? '#ef4444' : '#f87171'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DiseaseBar;
