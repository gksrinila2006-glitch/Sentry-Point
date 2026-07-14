import React from 'react';
import { Search, ShieldAlert, Bell } from 'lucide-react';

export default function Header({ searchQuery, onSearchChange, onLogout, onTriggerToast, hasUnread }) {
    return (
        <header className="header">
            <div className="header-search">
                <Search />
                <input 
                    type="text" 
                    className="search-input" 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search users, databases, events..." 
                />
            </div>
            
            <div className="header-actions">
                <div className="badge-quantum" style={{ marginTop: 0, padding: '4px 10px', fontSize: '0.7rem', borderColor: '#A7F3D0' }}>
                    <ShieldAlert style={{ strokeWidth: 2.5, width: '14px', height: '14px' }} />
                    <span>Quantum Safe Shield Active</span>
                </div>
                
                <button className="btn-icon" onClick={onTriggerToast}>
                    <Bell />
                    {hasUnread && <span className="badge-dot" id="header-noti-badge"></span>}
                </button>
                
                <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={onLogout}>
                    Log Out
                </button>
            </div>
        </header>
    );
}
