import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function Users({ users, onInvestigateUser, onQuickSuspend, onTogglePrivileged }) {
    const [searchVal, setSearchVal] = useState('');
    const [deptVal, setDeptVal] = useState('ALL');
    const [riskVal, setRiskVal] = useState('ALL');

    const filteredUsers = users.filter(user => {
        // Search filter
        const matchSearch = user.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                            user.id.toLowerCase().includes(searchVal.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchVal.toLowerCase());
        
        // Dept filter
        const matchDept = (deptVal === 'ALL') || (user.dept === deptVal);
        
        // Risk Filter
        let matchRisk = false;
        if (riskVal === 'ALL') matchRisk = true;
        else if (riskVal === 'HIGH' && user.riskScore >= 70) matchRisk = true;
        else if (riskVal === 'MEDIUM' && user.riskScore >= 40 && user.riskScore < 70) matchRisk = true;
        else if (riskVal === 'LOW' && user.riskScore < 40) matchRisk = true;

        return matchSearch && matchDept && matchRisk;
    });

    return (
        <div id="view-users" className="page-view active">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Identity Risk & Baseline Profiler</h2>
                    <p className="page-subtitle">Manage administrative privileges, role permissions, and active behavioral baseline scopes</p>
                </div>
            </div>

            <div className="panel">
                {/* Filters Row */}
                <div className="filter-row">
                    <div className="filter-group">
                        <div style={{ position: 'relative', width: '250px' }}>
                            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                            <input 
                                type="text" 
                                className="search-input" 
                                style={{ width: '100%' }} 
                                placeholder="Filter by Name, ID, or Email..." 
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                            />
                        </div>
                        <select className="select-input" value={deptVal} onChange={(e) => setDeptVal(e.target.value)}>
                            <option value="ALL">All Departments</option>
                            <option value="Global Markets">Global Markets</option>
                            <option value="Retail Branch ops">Retail Branch ops</option>
                            <option value="IT Administration">IT Administration</option>
                            <option value="Wealth Management">Wealth Management</option>
                            <option value="Compliance & Legal">Compliance & Legal</option>
                        </select>
                        <select className="select-input" value={riskVal} onChange={(e) => setRiskVal(e.target.value)}>
                            <option value="ALL">All Risk Levels</option>
                            <option value="HIGH">High (&gt;70)</option>
                            <option value="MEDIUM">Medium (40-70)</option>
                            <option value="LOW">Low (&lt;40)</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="data-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Subject Name & ID</th>
                                <th>Security Role</th>
                                <th>Department</th>
                                <th>Risk Score</th>
                                <th>Privileged Tag</th>
                                <th>Last Active Session</th>
                                <th>System Status</th>
                                <th style={{ textAlign: 'right' }}>Forensic Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }} className="text-muted">
                                        No users matching the filter criteria found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => {
                                    let riskClass = 'low';
                                    if (user.riskScore >= 70) riskClass = 'high';
                                    else if (user.riskScore >= 40) riskClass = 'medium';

                                    let statusStyle = { color: '#16A34A', fontWeight: '600' };
                                    if (user.status === 'Suspended') statusStyle = { color: '#DC2626', fontWeight: '600' };
                                    else if (user.status === 'MFA-Challenged') statusStyle = { color: '#D97706', fontWeight: '600' };

                                    return (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="td-user">
                                                    <div className="td-avatar">{user.avatar}</div>
                                                    <div>
                                                        <div className="td-user-name">{user.name}</div>
                                                        <div className="td-user-id">{user.id} • {user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{user.role}</td>
                                            <td>{user.dept}</td>
                                            <td>
                                                <span className={`badge-risk ${riskClass}`}>{user.riskScore}</span>
                                            </td>
                                            <td>
                                                <label className="switch">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={user.privileged} 
                                                        onChange={() => onTogglePrivileged(user.id)}
                                                    />
                                                    <span className="slider"></span>
                                                </label>
                                            </td>
                                            <td>{user.lastActive}</td>
                                            <td>
                                                <span style={statusStyle}>{user.status}</span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button 
                                                    className="btn btn-outline" 
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem', marginRight: '4px', width: 'auto' }} 
                                                    onClick={() => onInvestigateUser(user.id)}
                                                >
                                                    Investigate
                                                </button>
                                                {user.status !== 'Suspended' && (
                                                    <button 
                                                        className="btn btn-danger" 
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }} 
                                                        onClick={() => onQuickSuspend(user.id)}
                                                    >
                                                        Suspend
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
