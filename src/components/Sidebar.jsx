import React from 'react';
import { LayoutDashboard, Shield, Users, FileText, Settings, Activity, BarChart2 } from 'lucide-react';

export default function Sidebar({ currentView, onViewChange, currentUser }) {
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
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">
                    <Shield fill="#0B132B" strokeWidth={2} />
                </div>
                <h1 className="sidebar-title">Sentry<span>Point</span></h1>
            </div>
            
            <ul className="sidebar-menu">
                {menuItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <li key={item.id} className={`sidebar-item ${isActive ? 'active' : ''}`}>
                            <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); onViewChange(item.id); }}>
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
