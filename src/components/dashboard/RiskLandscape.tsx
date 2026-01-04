
"use client";
import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Scatter,
  ReferenceArea,
  Cell,
  CartesianGrid
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

const getRiskZone = (prob: number, impact: number) => {
    const score = prob * impact;
    if (score >= 15) return { name: 'Critical', color: 'rgba(255, 59, 59, 0.8)', textColor: '#FF3B3B' };
    if (score >= 10) return { name: 'High', color: 'rgba(255, 165, 0, 0.7)', textColor: '#FFA500' };
    if (score >= 5) return { name: 'Medium', color: 'rgba(212, 175, 55, 0.6)', textColor: '#D4AF37' };
    return { name: 'Low', color: 'rgba(0, 224, 150, 0.5)', textColor: '#00E096' };
};

const CustomShape = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === null || cy === null || !payload) return null;

    const zone = getRiskZone(payload.x, payload.y);
    const size = payload.z * 15 + 10; // Base size + size per risk

    return (
        <g>
            <defs>
                <radialGradient id={`grad-${payload.x}-${payload.y}`}>
                    <stop offset="0%" stopColor={zone.color} stopOpacity="1" />
                    <stop offset="100%" stopColor={zone.color} stopOpacity="0.3" />
                </radialGradient>
                 <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <circle
                cx={cx}
                cy={cy}
                r={size / 2}
                fill={`url(#grad-${payload.x}-${payload.y})`}
                filter="url(#glow)"
                style={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
            />
            <text x={cx} y={cy} textAnchor="middle" dy=".3em" fill="#fff" fontSize="12" fontWeight="bold">
                {payload.z}
            </text>
        </g>
    );
};

const CustomTooltipContent = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const zone = getRiskZone(data.x, data.y);
        return (
            <div className="glass p-4 rounded-lg text-white">
                <h4 style={{ color: zone.textColor, fontWeight: 'bold' }}>{zone.name} Zone</h4>
                <p>{data.z} risk(s) identified</p>
                <p className="text-xs text-gray-400">Impact: {data.y}, Probability: {data.x}</p>
            </div>
        );
    }
    return null;
};


interface RiskLandscapeProps {
    data: { impact: number; probability: number; }[];
}

const RiskLandscape: React.FC<RiskLandscapeProps> = ({ data }) => {
    const { t } = useLanguage();

    const processedData = useMemo(() => {
        const grouped = data.reduce((acc, risk) => {
            const key = `${risk.probability}-${risk.impact}`;
            if (!acc[key]) {
                acc[key] = { x: risk.probability, y: risk.impact, z: 0 };
            }
            acc[key].z += 1;
            return acc;
        }, {} as Record<string, { x: number; y: number; z: number; }>);
        return Object.values(grouped);
    }, [data]);
    
    const impactLabels: Record<number, string> = { 1: "Low", 3: "Medium", 5: "Critical" };
    const probLabels: Record<number, string> = { 1: "Rare", 3: "Likely", 5: "Certain" };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 40,
                }}
            >
                <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3 3" />
                
                {/* Background Zones */}
                <ReferenceArea x1={0} x2={2.5} y1={0} y2={2.5} fill="rgba(0, 224, 150, 0.05)" stroke="rgba(0, 224, 150, 0.1)" />
                <ReferenceArea x1={2.5} x2={5.5} y1={0} y2={2.5} fill="rgba(212, 175, 55, 0.05)" stroke="rgba(212, 175, 55, 0.1)" />
                <ReferenceArea x1={0} x2={2.5} y1={2.5} y2={5.5} fill="rgba(212, 175, 55, 0.05)" stroke="rgba(212, 175, 55, 0.1)" />
                <ReferenceArea x1={2.5} x2={4} y1={2.5} y2={4} fill="rgba(255, 165, 0, 0.05)" stroke="rgba(255, 165, 0, 0.1)" />
                <ReferenceArea x1={4} x2={5.5} y1={2.5} y2={5.5} fill="rgba(255, 59, 59, 0.07)" stroke="rgba(255, 59, 59, 0.1)" />
                <ReferenceArea x1={2.5} x2={5.5} y1={4} y2={5.5} fill="rgba(255, 59, 59, 0.07)" stroke="rgba(255, 59, 59, 0.1)" />

                <XAxis 
                    type="number" 
                    dataKey="x" 
                    name={t('compliance.probability')} 
                    domain={[0.5, 5.5]} 
                    ticks={[1,2,3,4,5]}
                    tickFormatter={(tick) => probLabels[tick] || ''}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#A0A0A0', fontSize: 12 }}
                    label={{ value: t('compliance.probability'), position: 'insideBottom', dy: 30, fill: '#A0A0A0' }}
                />
                <YAxis 
                    type="number" 
                    dataKey="y" 
                    name={t('compliance.impact')} 
                    domain={[0.5, 5.5]}
                    ticks={[1,2,3,4,5]}
                    tickFormatter={(tick) => impactLabels[tick] || ''}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#A0A0A0', fontSize: 12 }}
                    label={{ value: t('compliance.impact'), angle: -90, position: 'insideLeft', dx: -30, fill: '#A0A0A0' }}
                />
                <ZAxis type="number" dataKey="z" range={[100, 1000]} />
                
                <Tooltip cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255, 255, 255, 0.2)' }} content={<CustomTooltipContent />} />
                
                <Scatter data={processedData} shape={<CustomShape />} />

            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default RiskLandscape;
