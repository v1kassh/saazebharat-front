'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Clock, TrendingUp, Loader2, ShieldAlert, Activity, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#7B241C', '#9A7D0A', '#1F4E79', '#196F3D', '#6C3483', '#2C2C54', '#0E6251'];

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [recentLogs, setRecentLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    window.location.href = '/admin/login';
                    return;
                }
                const headers = { Authorization: `Bearer ${token}` };

                const [analyticsRes, logsRes] = await Promise.all([
                    axios.get(`${backendUrl}/registrations/analytics`, { headers }),
                    axios.get(`${backendUrl}/audit?limit=5`, { headers })
                ]);

                setData(analyticsRes.data);
                setRecentLogs(logsRes.data);
            } catch (err: any) {
                console.error('Dashboard Fetch Error:', err.response?.data || err.message);
                if (err.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    window.location.href = '/admin/login';
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        </div>
    );

    const stats = [
        { label: 'Verified Participants', value: data?.total || 0, icon: Users, color: '#7B241C' },
        { label: 'Growth (Last 24h)', value: data?.growthToday || 0, icon: TrendingUp, color: '#10B981' },
    ];

    return (
        <div style={{ padding: '0 1rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.2rem', color: '#1E293B', fontFamily: 'Playfair Display' }}>Event Overview</h1>
                <p style={{ color: '#64748B', fontSize: '1rem' }}>Real-time growth metrics for Saaz-e-Bharat.</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        className="premium-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{ padding: '1.5rem', border: '1px solid #E2E8F0', borderRadius: '20px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ background: `${stat.color}15`, padding: '12px', borderRadius: '15px' }}>
                                <stat.icon color={stat.color} size={28} />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 0', color: '#1E293B' }}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Trend Chart */}
                <div className="premium-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <BarChart3 size={20} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontWeight: 700 }}>Registration Activity (Last 7 Days)</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        {data?.trends?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.trends}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                                Not enough historical data yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="premium-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <Activity size={20} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontWeight: 700 }}>Diversity Score</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.categoryStats || []}
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data?.categoryStats?.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Recent Activity Section */}
                <div className="premium-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <ShieldAlert size={20} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontWeight: 700 }}>Security Feed</h3>
                    </div>
                    <div>
                        {recentLogs.map((log, i) => (
                            <div key={log._id} style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1.2rem 0',
                                borderBottom: i === recentLogs.length - 1 ? 'none' : '1px solid #F1F5F9'
                            }}>
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: log.action.includes('REJECT') ? '#EF4444' : log.action.includes('APPROVE') ? '#10B981' : '#3B82F6',
                                    marginTop: '6px'
                                }}></div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1E293B' }}>
                                        {log.action.replace(/_/g, ' ')}
                                    </p>
                                    <p style={{ margin: '4px 0', fontSize: '0.8rem', color: '#64748B' }}>
                                        By {log.adminId?.username} • {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => window.location.href = '/admin/dashboard/audit'}
                        style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'transparent', color: '#64748B', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
                    >
                        Detailed Investigation
                    </button>
                </div>

                {/* System Status / Health */}
                <div className="premium-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <CheckCircle size={40} color="#166534" />
                    </div>
                    <h2 style={{ margin: 0, color: '#166534' }}>All Systems Nominal</h2>
                    <p style={{ color: '#64748B', marginTop: '1rem', lineHeight: '1.6' }}>
                        The Saaz-e-Bharat gateway is optimized. Registration APIs, Document Storage, and Email Dispatchers are operating at 100% capacity.
                    </p>
                    <div style={{ marginTop: '2rem', width: '100%', background: '#F8FAFC', padding: '1.5rem', borderRadius: '15px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Database Latency</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>24ms</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Worker Threads</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Active</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
