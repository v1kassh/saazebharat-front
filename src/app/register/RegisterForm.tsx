'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

export default function RegisterForm() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'Visitor';
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [registrationId, setRegistrationId] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<any>({
        email: '',
        phone: '',
        category: type,
        fullName: '',
        city: '',
        idType: 'Aadhar',
        artistName: '',
        artForm: '',
        businessName: '',
        gstNumber: '',
        organization: '',
        companyName: '',
        sponsorshipTier: 'Bronze',
    });

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://76.13.245.28/api';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (['Artist', 'Media', 'Sponsor', 'StallExhibitor', 'FoodVendor'].includes(type) && !file) {
            setError('Verification document is required for this category.');
            setLoading(false);
            return;
        }

        try {
            const dataToSend = new FormData();
            Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));
            if (file) dataToSend.append('document', file);

            const { data } = await axios.post(`${backendUrl}/registrations`, dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setRegistrationId(data.registrationId);
            setIsVerifying(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${backendUrl}/registrations/verify-otp`, {
                registrationId,
                otp
            });
            setSuccess(true);
            setIsVerifying(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed. Please check the code.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="cultural-bg min-h-screen flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="premium-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Registration Submitted!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Thank you for registering as a {type}. Our team will review your application and send the entry pass to your email: <strong>{formData.email}</strong>.
                    </p>
                    <Link href="/">
                        <button className="btn-primary">Back to Home</button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="cultural-bg min-h-screen p-4 md:p-12">
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to Home
            </Link>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <span style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Registration
                    </span>
                    <h1 style={{ marginTop: '1rem' }}>Join as {type}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{isVerifying ? 'Check your email for the verification code.' : 'Fill in your details to get your digital pass.'}</p>
                </div>

                {isVerifying ? (
                    <motion.form
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onSubmit={handleVerifyOtp}
                        className="premium-card"
                        style={{ maxWidth: '400px', margin: '0 auto' }}
                    >
                        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Verify Your Email</h2>
                        {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

                        <div className="form-group" style={{ textAlign: 'center' }}>
                            <label>Verification Code</label>
                            <input
                                type="text"
                                name="otp"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="6-digit code"
                                style={{ textAlign: 'center', fontSize: '1.8rem', letterSpacing: '4px', padding: '1rem' }}
                                maxLength={6}
                            />
                        </div>

                        <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : 'Verify & Complete'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsVerifying(false)}
                            style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Change Email / Back
                        </button>
                    </motion.form>
                ) : (
                    <form onSubmit={handleSubmit} className="premium-card">
                        {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>{error}</div>}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label>Full Name / Contact Person</label>
                                <input type="text" name="fullName" required onChange={handleChange} placeholder="Enter your name" />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" required onChange={handleChange} placeholder="example@email.com" />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="phone" required onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" name="city" required onChange={handleChange} placeholder="Your city" />
                            </div>

                            {/* Category Specific Fields */}
                            {type === 'Artist' && (
                                <>
                                    <div className="form-group">
                                        <label>Art Form</label>
                                        <input type="text" name="artForm" required onChange={handleChange} placeholder="e.g. Kathak, Folk Music" />
                                    </div>
                                    <div className="form-group">
                                        <label>Portfolio Link</label>
                                        <input type="url" name="portfolioUrl" onChange={handleChange} placeholder="Instagram/YouTube link" />
                                    </div>
                                </>
                            )}

                            {type === 'StallExhibitor' && (
                                <>
                                    <div className="form-group">
                                        <label>Business Name</label>
                                        <input type="text" name="businessName" required onChange={handleChange} placeholder="Shop/Brand Name" />
                                    </div>
                                    <div className="form-group">
                                        <label>GST Number (Optional)</label>
                                        <input type="text" name="gstNumber" onChange={handleChange} />
                                    </div>
                                </>
                            )}

                            {type === 'Sponsor' && (
                                <div className="form-group">
                                    <label>Sponsorship Tier</label>
                                    <select name="sponsorshipTier" onChange={handleChange}>
                                        <option value="Bronze">Bronze</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Platinum">Platinum</option>
                                    </select>
                                </div>
                            )}

                            <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                <label>Verification Document (ID/Press Card/Portfolio PDF)</label>
                                <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" style={{ padding: '0.6rem' }} />
                                <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Upload a valid document / proof for verification (Max 5MB).</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '3rem' }}>
                            <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                Submit Registration
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <style jsx>{`
        .form-group { margin-bottom: 0rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem; color: #1E293B; }
        input, select { 
          width: 100%; 
          padding: 0.8rem; 
          border-radius: 8px; 
          border: 1px solid #E2E8F0; 
          background: #F8FAFC;
          transition: border-color 0.2s;
        }
        input:focus { border-color: var(--primary); outline: none; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
