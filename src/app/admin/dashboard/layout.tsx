'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, FileText, Settings, LogOut, BarChart3, ScanQrCode, Menu, X, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Registrations', icon: Users, path: '/admin/dashboard/registrations' },
    { name: 'Content CMS', icon: FileText, path: '/admin/dashboard/content' },
    { name: 'Team Management', icon: Users, path: '/admin/dashboard/team', superOnly: true },
    { name: 'Security Audit', icon: Shield, path: '/admin/dashboard/audit' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [admin, setAdmin] = useState<any>(null);

    useEffect(() => {
        const user = localStorage.getItem('adminUser');
        if (user) setAdmin(JSON.parse(user));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
    };

    const pathname = usePathname();

    return (
        <div className="admin-layout" style={{ display: 'flex', height: '100vh', background: '#F8FAFC' }}>
            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? '280px' : '80px',
                background: 'var(--primary)',
                color: 'white',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
            }}>
                <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center' }}>
                    {isSidebarOpen && <h2 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'Playfair Display' }}>Saaz-e-Bharat</h2>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav style={{ flex: 1, padding: '1rem' }}>
                    {menuItems.filter(item => !item.superOnly || admin?.role === 'super_admin').map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.name} href={item.path} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                borderRadius: '12px',
                                marginBottom: '0.5rem',
                                color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                                background: isActive ? 'white' : 'transparent',
                                gap: '12px',
                                transition: 'all 0.2s',
                                fontWeight: isActive ? 700 : 500,
                                boxShadow: isActive ? '0 10px 15px rgba(0,0,0,0.1)' : 'none'
                            }} className="nav-item">
                                <item.icon size={20} />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={handleLogout} style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        gap: '12px',
                        cursor: 'pointer'
                    }}>
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <header style={{
                    height: '70px',
                    background: 'white',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{admin?.email || 'Admin'}</p>
                            <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'capitalize' }}>{admin?.role?.replace('_', ' ')}</span>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            {admin?.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    {children}
                </main>
            </div>

            <style jsx global>{`
        .nav-item:hover {
          background: rgba(255,255,255,0.1);
          color: white !important;
        }
      `}</style>
        </div>
    );
}
