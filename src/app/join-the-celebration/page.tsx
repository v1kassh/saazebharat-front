'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Utensils, Brush, Mic, HeartHandshake, ShieldCheck, ArrowLeft, Store, Camera } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { name: 'Visitor', icon: Users, color: '#1F4E79', id: 'Visitor' },
    { name: 'Artist', icon: Mic, color: '#7B241C', id: 'Artist' },
    { name: 'Stall Exhibitor', icon: Store, color: '#6C3483', id: 'Stall Exhibitor' },
    { name: 'Food Vendor', icon: Utensils, color: '#196F3D', id: 'Food Vendor' },
    { name: 'Media', icon: Camera, color: '#2C2C54', id: 'Media' },
    { name: 'Volunteer', icon: HeartHandshake, color: '#0E6251', id: 'Volunteer' },
    { name: 'Sponsor', icon: ShieldCheck, color: '#9A7D0A', id: 'Sponsor' },
];

export default function JoinTheCelebration() {
    return (
        <main className="cultural-bg" style={{ minHeight: '100vh', paddingBottom: 'var(--space-5)' }}>
            <Link href="/" style={{
                position: 'fixed',
                top: 'var(--space-4)',
                left: 'var(--space-4)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary)',
                fontWeight: 'bold',
                background: 'white',
                padding: '0.6rem 1.2rem',
                borderRadius: '30px',
                boxShadow: 'var(--shadow)',
                fontSize: 'var(--small)',
                textDecoration: 'none'
            }}>
                <ArrowLeft size={18} /> Back to Story
            </Link>

            <section className="container" style={{ paddingTop: '8rem' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
                    <h1 style={{ color: 'var(--primary)', marginBottom: 'var(--space-3)' }}>Join the Celebration</h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                        Select your path to participate in the grandest celebration of Indian heritage.
                    </p>
                    <div style={{ width: '80px', height: '4px', background: 'var(--primary)', margin: 'var(--space-4) auto 0' }}></div>
                </div>

                <div className="responsive-grid">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.name}
                            className="premium-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            style={{
                                borderTop: `6px solid ${cat.color}`,
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                padding: 'var(--space-4)'
                            }}
                        >
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: `${cat.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--space-4)'
                            }}>
                                <cat.icon size={28} color={cat.color} />
                            </div>
                            <h3 style={{ marginBottom: 'var(--space-3)' }}>{cat.name}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)', lineHeight: '1.6', flexGrow: 1 }}>
                                Participate as a {cat.name.toLowerCase()} and help us showcase the vibrant soul of India.
                            </p>
                            <Link href={`/register?type=${cat.id}`} style={{ textDecoration: 'none' }}>
                                <button className="btn-primary" style={{
                                    width: '100%',
                                    background: cat.color,
                                    borderColor: cat.color,
                                    borderRadius: '12px'
                                }}>
                                    Register as {cat.name}
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
