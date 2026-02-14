import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendChart = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="nitrogen" stroke="#60a5fa" name="Nitrogen" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="phosphorus" stroke="#f472b6" name="Phosphorus" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="potassium" stroke="#fbbf24" name="Potassium" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendChart;
