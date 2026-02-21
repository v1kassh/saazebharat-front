'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Shield, Lock, User, CheckCircle } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('login'); // login, otp_setup, otp_verify
    const [qrCode, setQrCode] = useState('');
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.saaz-e-bharat.com/api';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post(`${backendUrl}/admins/login`, { email, password });
            if (data.status === 'otp_setup_required') {
                setUserId(data.userId);
                setQrCode(data.qrCode);
                setStep('otp_setup');
            } else if (data.status === 'otp_required') {
                setUserId(data.userId);
                setStep('otp_verify');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post(`${backendUrl}/admins/verify-otp`, {
                userId,
                token: otp
            });
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.admin));
            window.location.href = '/admin/dashboard';
        } catch (err: any) {
            setError(err.response?.data?.message || 'OTP verification failed');
        }
    };

    return (
        <div className="cultural-bg min-h-screen flex items-center justify-center p-4">
            <motion.div
                className="premium-card"
                style={{ width: '400px' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Shield color="white" size={32} />
                    </div>
                    <h1 style={{ color: 'var(--primary)' }}>Admin Central</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Secure access to Saaz-e-Bharat systems</p>
                </div>

                {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

                <AnimatePresence mode="wait">
                    {step === 'login' && (
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleLogin}
                        >
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        placeholder="admin@saazebharat.com"
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <button className="btn-primary" style={{ width: '100%' }}>Authenticate</button>
                        </motion.form>
                    )}

                    {step === 'otp_setup' && (
                        <motion.div
                            key="otp_setup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ textAlign: 'center' }}
                        >
                            <p style={{ marginBottom: '1rem', fontWeight: 600 }}>Scan with Authenticator App</p>
                            <img src={qrCode} alt="OTP QR Code" style={{ background: 'white', padding: '10px', borderRadius: '10px', marginBottom: '1rem' }} />
                            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Enter 6-digit code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px' }}
                                    maxLength={6}
                                />
                            </div>
                            <button className="btn-primary" style={{ width: '100%' }} onClick={handleVerifyOTP}>Verify & Finish Setup</button>
                        </motion.div>
                    )}

                    {step === 'otp_verify' && (
                        <motion.div
                            key="otp_verify"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
                                <p style={{ fontWeight: 600 }}>OTP Verification Required</p>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Enter 6-digit code from App</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px' }}
                                    maxLength={6}
                                />
                            </div>
                            <button className="btn-primary" style={{ width: '100%' }} onClick={handleVerifyOTP}>Sign In</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <style jsx>{`
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .p-4 { padding: 1rem; }
      `}</style>
        </div>
    );
}
