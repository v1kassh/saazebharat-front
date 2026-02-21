'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, Shield, Mail, Calendar, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamManagement() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '', role: 'admin' });
    const [actionLoading, setActionLoading] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${backendUrl}/admins`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdmins(data);
        } catch (err) {
            console.error('Failed to fetch admins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${backendUrl}/admins/create`, newAdmin, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddModal(false);
            setNewAdmin({ username: '', email: '', password: '', role: 'admin' });
            fetchAdmins();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create admin');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAdmin = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove ${email} from the team?`)) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${backendUrl}/admins/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAdmins();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete admin');
        }
    };

    return (
        <div style={{ padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', color: '#1E293B', fontFamily: 'Playfair Display', marginBottom: '0.5rem' }}>Team Management</h1>
                    <p style={{ color: '#64748B' }}>Manage administrative access and system permissions.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-gold" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px' }} onClick={fetchAdmins}>
                        <RefreshCw size={18} style={{ marginRight: '8px' }} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button className="btn-primary" style={{ background: 'var(--primary)', padding: '0.8rem 1.5rem' }} onClick={() => setShowAddModal(true)}>
                        <UserPlus size={18} style={{ marginRight: '8px' }} /> Add Admin
                    </button>
                </div>
            </div>

            <div className="premium-card" style={{ padding: 0 }}>
                <div style={{ padding: '1.2rem', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Shield size={20} color="var(--primary)" />
                    <span style={{ fontWeight: 600 }}>Active Administrators</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <tr>
                                <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>IDENTITY</th>
                                <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>ROLE</th>
                                <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>JOINED</th>
                                <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>LAST LOGIN</th>
                                <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} color="var(--primary)" /></td></tr>
                            ) : admins.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center' }}>No administrators found.</td></tr>
                            ) : admins.map((admin: any) => (
                                <tr key={admin._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {(admin.username || 'A')[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#1E293B' }}>{admin.username || 'System Administrator'}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Mail size={12} /> {admin.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            background: admin.role === 'super_admin' ? '#FEE2E2' : '#E0F2FE',
                                            color: admin.role === 'super_admin' ? '#991B1B' : '#075985',
                                            textTransform: 'uppercase'
                                        }}>
                                            {admin.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem', fontSize: '0.85rem', color: '#64748B' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={14} />
                                            {new Date(admin.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem', fontSize: '0.85rem', color: '#64748B' }}>
                                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <button
                                            onClick={() => handleDeleteAdmin(admin._id, admin.email)}
                                            className="action-btn"
                                            style={{ background: '#FEE2E2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '8px', padding: '8px' }}
                                            title="Remove Admin"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Admin Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '500px' }}
                        >
                            <h2 style={{ fontSize: '1.5rem', color: '#1E293B', marginBottom: '0.5rem' }}>Add New Administrator</h2>
                            <p style={{ color: '#64748B', marginBottom: '2rem', fontSize: '0.9rem' }}>Created users will need to set up MFA on their first login.</p>

                            <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newAdmin.username}
                                        onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={newAdmin.email}
                                        onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Temporary Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newAdmin.password}
                                        onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Access Role</label>
                                    <select
                                        value={newAdmin.role}
                                        onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}
                                    >
                                        <option value="admin">Standard Admin (Limited Audit)</option>
                                        <option value="super_admin">Super Admin (Full Access)</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        {actionLoading ? 'Creating...' : 'Grant Access'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .action-btn { cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .action-btn:hover { background: #EF4444 !important; color: white !important; transform: scale(1.05); }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
