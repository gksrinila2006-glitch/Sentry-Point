import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Bell, Sun, Moon } from 'lucide-react';

export default function Header({ searchQuery, onSearchChange, onLogout, onTriggerToast, hasUnread }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Listen for Ctrl+K command palette shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                onTriggerToast();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onTriggerToast]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark-theme-override');
    };

    return (
        <header className="header" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', height: '70px', backgroundColor: '#ffffff' }}>
            {/* Global Search */}
            <div className="header-search" style={{ flex: '1', maxWidth: '360px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={16} style={{ color: 'var(--text-muted)', position: 'absolute', left: '12px' }} />
                <input 
                    type="text" 
                    className="search-input" 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search logs, threat profiles... (Ctrl+K)" 
                    style={{ padding: '8px 12px 8px 36px', width: '100%', fontSize: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                />
            </div>
            
            <div className="header-actions flex align-center gap-16" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Quantum Safe Shield Status */}
                <div className="badge-quantum mt-0" style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#10B981', background: '#e6f4ea', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px', margin: 0 }}>
                    <ShieldCheck style={{ strokeWidth: 2.5, width: '15px', height: '15px', color: '#10B981' }} />
                    <span>Quantum Safe Shield Active</span>
                </div>

                {/* Theme Toggle */}
                <button className="btn-icon" onClick={toggleTheme} title="Toggle high-contrast theme overrides" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notifications */}
                <button className="btn-icon" onClick={onTriggerToast} title="Notifications Feed" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', position: 'relative' }}>
                    <Bell size={18} />
                    {hasUnread && <span className="badge-dot" style={{ backgroundColor: 'var(--risk-high)', position: 'absolute', top: 0, right: 0, width: '6px', height: '6px', borderRadius: '50%' }}></span>}
                </button>

                {/* User Profile */}
                <div className="flex align-center gap-8" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="user-avatar-circle" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        GK
                    </div>
                    <div className="text-left text-dark" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-dark)', lineHeight: '1.2' }}>G.K. Srinila</span>
                        <span className="text-muted" style={{ fontSize: '0.65rem', lineHeight: '1' }}>Security Analyst</span>
                    </div>
                </div>

                {/* Logout Button */}
                <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }} onClick={onLogout}>
                    Sign Out
                </button>
            </div>
        </header>
    );
}
