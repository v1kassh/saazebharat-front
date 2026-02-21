'use client';

import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { Search, Filter, RefreshCw, Loader2, Download, X as XIcon, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function RegistrationsAdmin() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', search: '' });

    // Export Modal State
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportRange, setExportRange] = useState({ from: 1, to: 100, category: '' });
    const [exportLoading, setExportLoading] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.saaz-e-bharat.com/api';

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${backendUrl}/registrations`, {
                params: filter,
                headers: { Authorization: `Bearer ${token}` }
            });
            setRegistrations(data.registrations);
        } catch (err) {
            console.error('Failed to fetch registrations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    const handleExportCsv = async () => {
        setExportLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${backendUrl}/registrations/export`, {
                params: exportRange,
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Saaz_e_Bharat_Registrations_${exportRange.category || 'All'}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setShowExportModal(false);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Export failed. Ensure data exists in this range.');
        } finally {
            setExportLoading(false);
        }
    };

    return (
        <div style={{ padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: '#1E293B', fontFamily: 'Playfair Display', fontWeight: 900 }}>Verified Registrations</h1>
                    <p style={{ color: '#64748B' }}>Master list of all OTP-verified participants.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setShowExportModal(true)}
                        style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', background: '#1E293B', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(30, 41, 59, 0.15)' }}
                    >
                        <Download size={18} /> Export CSV
                    </button>
                    <button className="btn-gold" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#F8FAFC', color: '#7B241C', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, border: '1px solid #E2E8F0' }} onClick={fetchData}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh List
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '1.5rem',
                marginBottom: '2rem',
                background: 'white',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or city..."
                        value={filter.search}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }}
                    />
                </div>
                <select
                    value={filter.category}
                    onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', minWidth: '180px' }}
                >
                    <option value="">All Categories</option>
                    {['Visitor', 'Artist', 'StallExhibitor', 'FoodVendor', 'Media', 'Volunteer', 'Sponsor'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="premium-card" style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <tr>
                                <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>PARTICIPANT</th>
                                <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>CATEGORY</th>
                                <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>LOCATION</th>
                                <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>REGISTRATION DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} color="#7B241C" /></td></tr>
                            ) : registrations.length === 0 ? (
                                <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#94A3B8' }}>No verified registrations found.</td></tr>
                            ) : registrations.map((reg: any) => (
                                <tr key={reg._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '1rem' }}>{reg.fullName || reg.artistName || reg.businessName || 'Participant'}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{reg.email} • {reg.phone}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7B241C', background: '#FDF2F2', padding: '4px 12px', borderRadius: '100px' }}>{reg.category}</span>
                                    </td>
                                    <td style={{ padding: '1.2rem', color: '#475569', fontSize: '0.9rem' }}>
                                        {reg.city}, {reg.state}
                                    </td>
                                    <td style={{ padding: '1.2rem', color: '#64748B', fontSize: '0.85rem' }}>
                                        {new Date(reg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Export Selection Modal */}
            <AnimatePresence>
                {showExportModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            style={{ background: 'white', padding: '2.5rem', borderRadius: '30px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: '#F1F5F9', padding: '10px', borderRadius: '12px' }}><FileSpreadsheet size={24} color="#1E293B" /></div>
                                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'Playfair Display', color: '#1E293B' }}>Export Data</h2>
                                </div>
                                <button onClick={() => setShowExportModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><XIcon size={24} /></button>
                            </div>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>Cultural Category</label>
                                    <select
                                        value={exportRange.category}
                                        onChange={(e) => setExportRange({ ...exportRange, category: e.target.value })}
                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', outline: 'none' }}
                                    >
                                        <option value="">All Categories</option>
                                        {['Visitor', 'Artist', 'StallExhibitor', 'FoodVendor', 'Media', 'Volunteer', 'Sponsor'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>From (Serial No)</label>
                                        <input
                                            type="number"
                                            value={exportRange.from}
                                            onChange={(e) => setExportRange({ ...exportRange, from: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>To (Serial No)</label>
                                        <input
                                            type="number"
                                            value={exportRange.to}
                                            onChange={(e) => setExportRange({ ...exportRange, to: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleExportCsv}
                                disabled={exportLoading}
                                style={{
                                    width: '100%',
                                    marginTop: '2.5rem',
                                    padding: '1.2rem',
                                    borderRadius: '16px',
                                    border: 'none',
                                    background: '#7B241C',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 20px rgba(123, 36, 28, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                {exportLoading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                                {exportLoading ? 'Generating Sheet...' : 'Download CSV Report'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default function Page () {
    <Suspense fallback={<div>Loading...</div>}>
        <RegistrationsAdmin />
    </Suspense>
}