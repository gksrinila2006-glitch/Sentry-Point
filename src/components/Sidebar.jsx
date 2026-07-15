import React from 'react';
import { LayoutDashboard, Shield, Users, FileText, Settings, Activity, BarChart2 } from 'lucide-react';

export default function Sidebar({ currentView, onViewChange, currentUser, collapsed, onToggleCollapse }) {
    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'investigations', name: 'Investigations', icon: Activity },
        { id: 'users', name: 'Users & Roles', icon: Users },
        { id: 'audit-log', name: 'Audit Log', icon: FileText },
        { id: 'reports', name: 'Reports', icon: BarChart2 },
        { id: 'settings', name: 'Settings', icon: Settings },
    ];

    const getInitials = (email) => {
        if (!email) return 'AN';
        const parts = email.split('@')[0].split(/[._-]/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return email.substring(0, 2).toUpperCase();
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-brand" style={{ position: 'relative' }}>
                <div className="sidebar-logo">
                    <Shield fill="#0B132B" strokeWidth={2} />
                </div>
                {!collapsed && <h1 className="sidebar-title">Sentry<span>Point</span></h1>}
                <button 
                    className="sidebar-collapse-btn-inner" 
                    onClick={onToggleCollapse} 
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--text-light-muted)', 
                        cursor: 'pointer', 
                        marginLeft: 'auto', 
                        fontSize: '0.8rem',
                        display: collapsed ? 'none' : 'block'
                    }}
                    title="Collapse Sidebar"
                >
                    ◀
                </button>
            </div>
            
            {collapsed && (
                <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <button 
                        onClick={onToggleCollapse} 
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'var(--text-light-muted)', 
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                        }}
                        title="Expand Sidebar"
                    >
                        ▶
                    </button>
                </div>
            )}
            
            <ul className="sidebar-menu">
                {menuItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <li key={item.id} className={`sidebar-item ${isActive ? 'active' : ''}`}>
                            <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); onViewChange(item.id); }} title={item.name}>
                                <Icon />
                                <span>{item.name}</span>
                            </a>
                        </li>
                    );
                })}
            </ul>
            
            <div className="sidebar-footer">
                <div className="analyst-profile">
                    <div className="analyst-avatar" id="avatar-initials">
                        {currentUser ? getInitials(currentUser.email) : 'AN'}
                    </div>
                    <div className="analyst-info">
                        <div className="analyst-name" id="profile-name">
                            {currentUser ? currentUser.email : 'guest@bankofmaharashtra.in'}
                        </div>
                        <div className="analyst-role">SOC Lead Analyst</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
