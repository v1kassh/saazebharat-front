'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Clock, User, Info, RefreshCw, ChevronDown, ChevronUp, Search, Calendar, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('ALL');
    const [expandedLog, setExpandedLog] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://76.13.245.28/api';

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${backendUrl}/audit?limit=200`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(data);
        } catch (err) {
            console.error('Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getActionColor = (action: string) => {
        if (action.includes('REJECT')) return '#EF4444';
        if (action.includes('APPROVE') || action.includes('UPLOAD') || action.includes('CREATE')) return '#10B981';
        if (action.includes('LOGIN')) return '#3B82F6';
        if (action.includes('UPDATE')) return '#F59E0B';
        return '#64748B';
    };

    const actionTypes = ['ALL', ...Array.from(new Set(logs.map((l: any) => l.action)))];

    const filteredLogs = logs.filter((log: any) => {
        const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.adminId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.adminId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterAction === 'ALL' || log.action === filterAction;
        return matchesSearch && matchesFilter;
    });

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', color: '#1E293B', fontFamily: 'Playfair Display', marginBottom: '0.5rem' }}>Security Audit Logs</h1>
                    <p style={{ color: '#64748B', fontSize: '1rem' }}>Immutable record of all administrative power actions.</p>
                </div>
                <button className="btn-gold" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px' }} onClick={fetchLogs}>
                    <RefreshCw size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Filters Bar */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: '1rem',
                marginBottom: '2rem',
                background: 'white',
                padding: '1rem',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search logs by action or admin..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Filter size={18} color="#64748B" />
                    <select
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', minWidth: '200px' }}
                    >
                        {actionTypes.map(type => (
                            <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <tr>
                                <th style={{ padding: '1.2rem', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>TICKET / EVENT</th>
                                <th style={{ padding: '1.2rem', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>ADMINISTRATOR</th>
                                <th style={{ padding: '1.2rem', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>IP ADDRESS</th>
                                <th style={{ padding: '1.2rem', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>ACTION</th>
                                <th style={{ padding: '1.2rem', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center' }}>
                                    <RefreshCw className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                                    <div style={{ color: '#94A3B8' }}>Deciphering audit trails...</div>
                                </td></tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: '#94A3B8' }}>No logs found matching your criteria.</td></tr>
                            ) : filteredLogs.map((log: any) => (
                                <React.Fragment key={log._id}>
                                    <tr
                                        onClick={() => setExpandedLog(expandedLog === log._id ? null : log._id)}
                                        style={{
                                            borderBottom: '1px solid #F1F5F9',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                        }}
                                        className="hover-row"
                                    >
                                        <td style={{ padding: '1.2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Calendar size={16} color="#94A3B8" />
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{new Date(log.createdAt).toLocaleDateString()}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{new Date(log.createdAt).toLocaleTimeString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                                                    {(log.adminId?.username || 'S')[0]}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.adminId?.username || 'System'}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{log.adminId?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem', fontFamily: 'monospace', color: '#64748B', fontSize: '0.85rem' }}>
                                            {log.ipAddress}
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                background: `${getActionColor(log.action)}15`,
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                color: getActionColor(log.action),
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {log.action.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                            {expandedLog === log._id ? <ChevronUp size={18} color="#94A3B8" /> : <ChevronDown size={18} color="#94A3B8" />}
                                        </td>
                                    </tr>
                                    <AnimatePresence>
                                        {expandedLog === log._id && (
                                            <tr>
                                                <td colSpan={5} style={{ padding: 0, background: '#F8FAFC' }}>
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        style={{ overflow: 'hidden' }}
                                                    >
                                                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #E2E8F0' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                                                <Info size={16} color="var(--primary)" />
                                                                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>Technical Payload Details</span>
                                                            </div>
                                                            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                                                    {JSON.stringify(log.details, null, 2)}
                                                                </pre>
                                                            </div>
                                                            <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem' }}>
                                                                <div>
                                                                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Source Resource</span>
                                                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{log.resourceModel} ID: {log.resourceId || 'N/A'}</div>
                                                                </div>
                                                                <div>
                                                                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Log Signature</span>
                                                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748B' }}>{log._id}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .hover-row:hover { background: #F8FAFC ! from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
