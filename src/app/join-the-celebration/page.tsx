'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Utensils, Brush, Mic, HeartHandshake, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { name: 'Visitor', icon: Users, color: '#1F4E79' },
    { name: 'Artist', icon: Brush, color: '#7B241C' },
    { name: 'Stall Exhibitor', icon: Brush, color: '#6C3483' },
    { name: 'Food Vendor', icon: Utensils, color: '#196F3D' },
    { name: 'Media', icon: Mic, color: '#2C2C54' },
    { name: 'Volunteer', icon: HeartHandshake, color: '#0E6251' },
    { name: 'Sponsor', icon: ShieldCheck, color: '#9A7D0A' },
];

export default function JoinTheCelebration() {
    return (
        <main className="cultural-bg min-h-screen">
            <Link href="/" style={{ position: 'fixed', top: '2rem', left: '2rem', zIndex: 100, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 'bold', background: 'white', padding: '0.8rem 1.5rem', borderRadius: '30px', boxShadow: 'var(--shadow)' }}>
                <ArrowLeft size={20} /> Back to Story
            </Link>

            <section id="categories" style={{ padding: '8rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '4rem', marginBottom: '1.5rem', fontFamily: 'Playfair Display', color: 'var(--primary)' }}>Join the Celebration</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>Select your path to participate in the grandest celebration of Indian heritage.</p>
                    <div style={{ width: '80px', height: '4px', background: 'var(--primary)', margin: '2rem auto 0' }}></div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.name}
                            className="premium-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            style={{ borderTop: `6px solid ${cat.color}`, position: 'relative' }}
                        >
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                                <cat.icon size={28} color={cat.color} />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.2rem' }}>{cat.name}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>Participate as a {cat.name.toLowerCase()} and help us showcase the vibrant soul of India.</p>
                            <Link href={`/register?type=${cat.name.replace(/\s+/g, '')}`}>
                                <button className="btn-gold" style={{ width: '100%', padding: '0.8rem', background: cat.color, color: 'white', borderColor: cat.color }}>
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
