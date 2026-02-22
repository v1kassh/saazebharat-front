'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, ArrowRight, Loader2, ShieldCheck, Upload, Check, User, Briefcase, Camera, Music, Store, Utensils, Heart } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

const CATEGORIES = [
    { id: 'Visitor', icon: User, label: 'Visitor' },
    { id: 'Artist', icon: Music, label: 'Artist' },
    { id: 'Stall Exhibitor', icon: Store, label: 'Exhibitor' },
    { id: 'Food Vendor', icon: Utensils, label: 'Food Vendor' },
    { id: 'Media', icon: Camera, label: 'Media' },
    { id: 'Volunteer', icon: Heart, label: 'Volunteer' },
    { id: 'Sponsor', icon: Briefcase, label: 'Sponsor' },
];

export default function RegisterForm() {
    const searchParams = useSearchParams();
    const initialType = searchParams.get('type') || 'Visitor';

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [registrationId, setRegistrationId] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<any>({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        category: initialType,
        // Visitor
        attendanceDay: '',
        interests: [],
        referralSource: '',
        // Artist
        artForm: '',
        performanceType: 'Solo',
        groupSize: 1,
        portfolioUrl: '',
        performanceDescription: '',
        expectedHonorarium: '',
        // Sponsor
        companyName: '',
        industry: '',
        department: '',
        interestedAs: '',
        reasonForJoining: '',
        // Stall Exhibitor
        typeOfStall: '',
        productsToDisplay: '',
        // Food Vendor
        stateCuisine: '',
        foodItems: '',
        // Media
        mediaHouseName: '',
        mediaType: '',
        // Volunteer
        availability: [],
        preferredRole: '',
    });

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.saaz-e-bharat.com/api';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (field: string, option: string) => {
        const currentOptions = [...formData[field]];
        if (currentOptions.includes(option)) {
            setFormData({ ...formData, [field]: currentOptions.filter(i => i !== option) });
        } else {
            setFormData({ ...formData, [field]: [...currentOptions, option] });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.phone || !file) {
                setError('Please fill all required fields and upload ID proof.');
                return;
            }
        }
        setError('');
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const dataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (Array.isArray(formData[key])) {
                    dataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    dataToSend.append(key, formData[key]);
                }
            });
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
            <div className="cultural-bg min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fffcf8', backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="premium-card"
                    style={{
                        textAlign: 'center',
                        maxWidth: '500px',
                        width: '100%',
                        background: 'white',
                        padding: '4rem 2rem',
                        borderRadius: '40px',
                        boxShadow: '0 40px 100px rgba(123, 36, 28, 0.12)',
                        border: '1px solid #F1E4D1'
                    }}
                >
                    <div style={{ width: '100px', height: '100px', background: '#ECFDF5', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <Check size={50} strokeWidth={3} />
                    </div>
                    <h2 style={{ color: '#1E293B', fontSize: '2.2rem', fontFamily: 'Playfair Display', fontWeight: 900, marginBottom: '1.2rem' }}>Application Sent!</h2>
                    <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '2.5rem', fontSize: '1.05rem' }}>
                        Namaste! Your application for <strong>Saaz-e-Bharat</strong> has been received. Please check your email <strong>{formData.email}</strong> for confirmation.
                    </p>
                    <Link href="/">
                        <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1rem' }}>Back to Home</button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="cultural-bg min-h-screen p-4 md:p-12" style={{ backgroundColor: '#fffcf8', backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#7B241C', fontWeight: 700, marginBottom: '2rem', padding: '0.8rem 1.2rem', background: 'white', borderRadius: '100px', boxShadow: '0 4px 15px rgba(123, 36, 28, 0.08)', textDecoration: 'none', fontSize: '0.9rem' }}>
                <ArrowLeft size={18} /> Back to Story
            </Link>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        {[1, 2].map(s => (
                            <div key={s} style={{ width: '40px', height: '4px', background: step >= s ? '#7B241C' : '#E2E8F0', borderRadius: '2px', transition: 'all 0.3s' }} />
                        ))}
                    </div>
                    <motion.h1
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ color: '#7B241C', fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: "'Playfair Display', serif", fontWeight: 900, marginBottom: '1rem' }}
                    >
                        {isVerifying ? 'Verify Identity' : step === 1 ? 'Basic Details' : `${formData.category} Information`}
                    </motion.h1>
                    <p style={{ color: '#64748B', fontSize: '1.1rem' }}>
                        {isVerifying ? "We've sent a code to your email." : step === 1 ? 'Start your journey with Saaz-e-Bharat.' : `Tell us more about your participation as a ${formData.category}.`}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {isVerifying ? (
                        <motion.form key="verify" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onSubmit={handleVerifyOtp} className="premium-card">
                            <div style={{ maxWidth: '450px', margin: '0 auto' }}>
                                <div style={{ width: '80px', height: '80px', background: '#FDF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                    <ShieldCheck size={40} color="#7B241C" />
                                </div>
                                {error && <div className="error-alert">{error}</div>}
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="otp"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="······"
                                        style={{ textAlign: 'center', fontSize: '2.5rem', letterSpacing: '8px', padding: '1.5rem', fontWeight: 800, color: '#7B241C' }}
                                        maxLength={6}
                                    />
                                </div>
                                <button className="btn-primary" style={{ width: '100%', marginTop: '2.5rem', padding: '1.2rem' }} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : 'Confirm & Submit'}
                                </button>
                            </div>
                        </motion.form>
                    ) : step === 1 ? (
                        <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="premium-card">
                            {error && <div className="error-alert">{error}</div>}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Required" />
                                </div>
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Required" />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number *</label>
                                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Required" />
                                </div>
                                <div className="form-group">
                                    <label>Organization / Group Name</label>
                                    <input type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Optional" />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ marginBottom: '1.2rem', display: 'block' }}>Registering As *</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                        {CATEGORIES.map(cat => {
                                            const Icon = cat.icon;
                                            const isActive = formData.category === cat.id;
                                            return (
                                                <div
                                                    key={cat.id}
                                                    onClick={() => setFormData({ ...formData, category: cat.id })}
                                                    style={{
                                                        padding: '0.8rem 1.5rem',
                                                        borderRadius: '16px',
                                                        border: `2px solid ${isActive ? '#7B241C' : '#E2E8F0'}`,
                                                        background: isActive ? '#FDF2F2' : 'white',
                                                        color: isActive ? '#7B241C' : '#64748B',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        fontWeight: 700,
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    <Icon size={18} />
                                                    {cat.label}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                    <label>Valid ID Proof (Accepted: PDF, JPG, PNG, DOC | Max 10MB) *</label>
                                    <div
                                        onClick={() => document.getElementById('file-upload')!.click()}
                                        className="file-upload-zone"
                                    >
                                        <Upload strokeWidth={1.5} size={30} color="#94A3B8" />
                                        <div style={{ fontWeight: 700, color: '#1E293B' }}>{file ? file.name : 'Upload Identity Document'}</div>
                                        <input id="file-upload" type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" style={{ display: 'none' }} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: '3rem', textAlign: 'right' }}>
                                <button onClick={nextStep} className="btn-primary" style={{ padding: '1rem 2.5rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                                    Next: {formData.category} Details <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSubmit} className="premium-card">
                            {error && <div className="error-alert">{error}</div>}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                                {formData.category === 'Visitor' && (
                                    <>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ marginBottom: '1.2rem', display: 'block' }}>Which day will you attend? *</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                                                {['Day 1 (Invite Only – Official Pass Required)', 'Day 2 (Public Entry)', 'Day 3 (Public Entry & Summit Delegates)'].map(day => (
                                                    <div key={day} onClick={() => setFormData({ ...formData, attendanceDay: day })} className={`selection-card ${formData.attendanceDay === day ? 'active' : ''}`}>
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ marginBottom: '1.2rem', display: 'block' }}>Interested In *</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                                {['Cultural Performances', 'Tribal Dance', 'Handloom & Handicrafts', 'Bharat Ki Rasoi (State Food)', 'Viksit Bharat Summit – 2047 Agenda'].map(opt => (
                                                    <div key={opt} onClick={() => handleCheckboxChange('interests', opt)} className={`chip ${formData.interests.includes(opt) ? 'active' : ''}`}>
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label>How did you hear about Saaz-e-Bharat? *</label>
                                            <input type="text" name="referralSource" required value={formData.referralSource} onChange={handleChange} />
                                        </div>
                                    </>
                                )}

                                {formData.category === 'Artist' && (
                                    <>
                                        <div className="form-group">
                                            <label>Art Form (State Folk Dance / Singing) *</label>
                                            <input type="text" name="artForm" required value={formData.artForm} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Performance Type *</label>
                                            <select name="performanceType" value={formData.performanceType} onChange={handleChange} required>
                                                <option value="Solo">Solo</option>
                                                <option value="Group">Group</option>
                                            </select>
                                        </div>
                                        {formData.performanceType === 'Group' && (
                                            <div className="form-group">
                                                <label>Number of Group Members</label>
                                                <input type="number" name="groupSize" value={formData.groupSize} onChange={handleChange} min={2} />
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <label>Previous Performance Link (YouTube / Instagram)</label>
                                            <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="https://" />
                                        </div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label>Short Description of Performance *</label>
                                            <textarea name="performanceDescription" rows={4} value={formData.performanceDescription} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Expected Honorarium (Optional)</label>
                                            <input type="number" name="expectedHonorarium" value={formData.expectedHonorarium} onChange={handleChange} />
                                        </div>
                                    </>
                                )}

                                {formData.category === 'Sponsor' && (
                                    <>
                                        <div className="form-group">
                                            <label>Company Name *</label>
                                            <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Industry *</label>
                                            <input type="text" name="industry" required value={formData.industry} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Department *</label>
                                            <select name="department" value={formData.department} onChange={handleChange} required>
                                                <option value="">Select Department</option>
                                                <option value="CSR">CSR</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Branding">Branding</option>
                                            </select>
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ marginBottom: '1rem', display: 'block' }}>Interested As *</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                                {["Title Sponsor", "Co-Sponsor", "Associate Sponsor", "Media Partner", "CSR Partner"].map(opt => (
                                                    <div key={opt} onClick={() => setFormData({ ...formData, interestedAs: opt })} className={`selection-card ${formData.interestedAs === opt ? 'active' : ''}`} style={{ flex: '1 1 180px' }}>
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label>Why do you want to be part of Saaz-e-Bharat? *</label>
                                            <textarea name="reasonForJoining" rows={4} value={formData.reasonForJoining} onChange={handleChange} required />
                                        </div>
                                    </>
                                )}

                                {formData.category === 'Stall Exhibitor' && (
                                    <>
                                        <div className="form-group">
                                            <label>Type of Stall *</label>
                                            <input type="text" name="typeOfStall" required value={formData.typeOfStall} onChange={handleChange} placeholder="e.g. Handicrafts" />
                                        </div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label>Products to be Displayed *</label>
                                            <textarea name="productsToDisplay" rows={4} value={formData.productsToDisplay} onChange={handleChange} required />
                                        </div>
                                    </>
                                )}

                                {formData.category === 'Food Vendor' && (
                                    <>
                                        <div className="form-group">
                                            <label>State / Cuisine *</label>
                                            <input type="text" name="stateCuisine" required value={formData.stateCuisine} onChange={handleChange} placeholder="e.g. Rajasthani" />
                                        </div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label>Food Items to be Served *</label>
                                            <textarea name="foodItems" rows={4} value={formData.foodItems} onChange={handleChange} required />
                                        </div>
                                    </>
                                )}

                                {formData.category === 'Media' && (
                                    <>
                                        <div className="form-group">
                                            <label>Media House Name *</label>
                                            <input type="text" name="mediaHouseName" required value={formData.mediaHouseName} onChange={handleChange} />
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ marginBottom: '1rem', display: 'block' }}>Media Type *</label>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                {["Print", "Digital", "Television"].map(opt => (
                                                    <div key={opt} onClick={() => setFormData({ ...formData, mediaType: opt })} className={`selection-card ${formData.mediaType === opt ? 'active' : ''}`} style={{ flex: 1 }}>
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {formData.category === 'Volunteer' && (
                                    <>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ marginBottom: '1.2rem', display: 'block' }}>Availability *</label>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                {['Day 1', 'Day 2', 'Day 3'].map(day => (
                                                    <div key={day} onClick={() => handleCheckboxChange('availability', day)} className={`chip ${formData.availability.includes(day) ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center' }}>
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label>Preferred Role *</label>
                                            <input type="text" name="preferredRole" required value={formData.preferredRole} onChange={handleChange} placeholder="e.g. Guest Management" />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" onClick={prevStep} className="btn-secondary" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <button type="submit" className="btn-primary" style={{ padding: '1rem 3rem', display: 'flex', alignItems: 'center', gap: '12px' }} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                    Send Application
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
                .premium-card { background: white; padding: 4rem; border-radius: 40px; border: 1px solid #F1E4D1; box-shadow: 0 40px 100px rgba(123, 36, 28, 0.05); }
                .form-group { display: flex; flex-direction: column; gap: 0.8rem; }
                label { font-weight: 800; font-size: 0.85rem; color: #1E293B; text-transform: uppercase; letter-spacing: 1px; }
                input, select, textarea { width: 100%; padding: 1.2rem; border-radius: 16px; border: 1px solid #E2E8F0; background: #F8FAFC; transition: all 0.3s ease; font-size: 1rem; color: #1E293B; font-weight: 500; }
                input:focus, select:focus, textarea:focus { border-color: #7B241C; outline: none; box-shadow: 0 0 0 4px rgba(123, 36, 28, 0.1); background: white; }
                .btn-primary { background: #7B241C; color: white; border: none; border-radius: 100px; font-weight: 800; cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .btn-primary:hover:not(:disabled) { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(123, 36, 28, 0.3); }
                .btn-secondary { background: #F1F5F9; color: #475569; border: none; border-radius: 100px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .btn-secondary:hover { background: #E2E8F0; }
                .error-alert { background: #FEF2F2; color: #991B1B; padding: 1.2rem; border-radius: 16px; margin-bottom: 2rem; border: 1px solid #FEE2E2; font-weight: 600; }
                .file-upload-zone { padding: 2.5rem; background: #F8FAFC; border-radius: 24px; border: 2px dashed #CBD5E1; text-align: center; cursor: pointer; transition: all 0.3s; display: flex; flex-direction: column; align-items: center; gap: 10px; }
                .file-upload-zone:hover { border-color: #7B241C; }
                .selection-card { padding: 1.2rem; border-radius: 16px; border: 1px solid #E2E8F0; background: white; cursor: pointer; transition: all 0.2s; font-weight: 700; color: #64748B; font-size: 0.9rem; text-align: center; }
                .selection-card.active { border-color: #7B241C; background: #FDF2F2; color: #7B241C; }
                .chip { padding: 0.8rem 1.5rem; border-radius: 100px; border: 1px solid #E2E8F0; background: white; cursor: pointer; transition: all 0.2s; font-weight: 600; color: #64748B; font-size: 0.85rem; }
                .chip.active { border-color: #7B241C; background: #7B241C; color: white; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@400;500;600;700;800&display=swap');
                :global(body) { font-family: 'Outfit', sans-serif; }
            `}</style>
        </div>
    );
}
