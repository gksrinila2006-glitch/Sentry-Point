import React, { useState } from 'react';
import { ArrowLeft, Shield, AlertCircle, Clock, Database, Lock, Globe, FileText, Send, UserX, Key, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Investigation({ 
    users, 
    selectedUserId, 
    selectedNodeIndex, 
    onNodeSelect, 
    onAction, 
    onAddNote, 
    onBackToDashboard 
}) {
    const [noteInput, setNoteInput] = useState('');
    const user = users.find(u => u.id === selectedUserId) || users[0];

    const handleNoteSubmit = (e) => {
        e.preventDefault();
        if (!noteInput.trim()) return;
        onAddNote(noteInput.trim());
        setNoteInput('');
    };

    if (!user) {
        return (
            <div className="panel text-center">
                <p className="text-muted">No subject loaded for forensic investigation.</p>
                <button className="btn btn-outline mt-12" onClick={onBackToDashboard}>Return to command center</button>
            </div>
        );
    }

    const currentSnapshot = user.baselineComparisons?.[selectedNodeIndex] || { metrics: [] };

    // Set score colors
    let scoreColorClass = 'score-text-green';
    if (user.riskScore > 70) scoreColorClass = 'score-text-red';
    else if (user.riskScore >= 40) scoreColorClass = 'score-text-amber';

    const getSignalIcon = (type) => {
        if (type === 'database') return <Database size={18} />;
        if (type === 'clock') return <Clock size={18} />;
        if (type === 'lock') return <Lock size={18} />;
        if (type === 'globe') return <Globe size={18} />;
        return <AlertCircle size={18} />;
    };

    return (
        <div id="view-investigations" className="page-view active">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Threat Investigation & Forensic Workspace</h2>
                    <p className="page-subtitle">Review behavioral baseline deviations, security logs, and AI risk justifications</p>
                </div>
                <button className="btn btn-outline" onClick={onBackToDashboard} style={{ width: 'auto' }}>
                    <ArrowLeft size={14} style={{ marginRight: '6px' }} />
                    Back to Command Center
                </button>
            </div>

            {/* Profile Summary Card */}
            <div className="investigation-header-card">
                <div className="investigation-user-profile">
                    <div className="investigation-large-avatar">{user.avatar}</div>
                    <div className="investigation-title-text">
                        <h2>{user.name}</h2>
                        <div className="investigation-meta-tags">
                            <span className="badge-info-pill">{user.role}</span>
                            <span className="badge-info-pill">{user.dept}</span>
                            <span className="badge-info-pill">Clearance: {user.clearance}</span>
                            <span className="badge-info-pill" style={{ color: user.status === 'Suspended' ? 'var(--risk-high)' : 'inherit' }}>
                                Status: <b>{user.status}</b>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="investigation-score-display">
                    <div className={`investigation-big-score ${scoreColorClass}`}>{user.riskScore}</div>
                    <div className="investigation-score-lbl">Risk Index</div>
                </div>
            </div>

            <div className="investigation-grid">
                {/* Left Main Panel */}
                <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Explainability / Contributing Signals */}
                    <div className="panel">
                        <div className="panel-header">
                            <h3 className="panel-title">
                                <AlertCircle size={18} style={{ color: 'var(--color-primary)' }} />
                                AI Anomaly Attribution & Root Cause Analysis
                            </h3>
                            <span className="badge-quantum" style={{ marginTop: 0, padding: '4px 10px', fontSize: '0.7rem', borderColor: '#6EE7B7' }}>
                                Explainable AI (XAI)
                            </span>
                        </div>
                        
                        <div id="explainability-signals-list">
                            {user.contributingSignals.map((sig, index) => (
                                <div key={index} className="explain-card">
                                    <div className={`explain-icon ${sig.severity}`}>
                                        {getSignalIcon(sig.type)}
                                    </div>
                                    <div className="explain-content">
                                        <div className="explain-title">{sig.title}</div>
                                        <div className="explain-desc">{sig.desc}</div>
                                        <span className="explain-tag">{sig.tag}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Behavioral Timeline */}
                    <div className="panel">
                        <div className="panel-header">
                            <h3 className="panel-title">
                                <Clock size={18} style={{ color: 'var(--color-primary)' }} />
                                72-Hour User Behavioral Session Timeline
                            </h3>
                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Click timeline nodes to audit session snapshots</p>
                        </div>
                        
                        <div className="timeline-outer">
                            <div className="timeline-line"></div>
                            <div className="timeline-nodes">
                                {user.timeline.map((node, index) => {
                                    const isActive = index === selectedNodeIndex;
                                    return (
                                        <div 
                                            key={index} 
                                            className={`timeline-node ${node.status} ${isActive ? 'active' : ''}`}
                                            onClick={() => onNodeSelect(index)}
                                        >
                                            <div className="timeline-time">{node.time}</div>
                                            <div className="timeline-dot"></div>
                                            <div className="timeline-title">{node.title}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Baseline vs Current Comparison Section */}
                        <div className="panel-header" style={{ marginTop: '24px', marginBottom: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                            <h4 className="panel-title" style={{ fontSize: '0.95rem' }}>Session Forensic Metric Analysis</h4>
                        </div>
                        
                        <div className="comparison-grid">
                            <div className="comparison-card baseline">
                                <h4>🛡️ AI Baseline Profile</h4>
                                <ul className="comparison-list">
                                    {currentSnapshot.metrics?.length > 0 ? (
                                        currentSnapshot.metrics.map((m, i) => (
                                            <li key={i} className="comparison-row">
                                                <span className="text-muted">{m.name}</span>
                                                <span className="comparison-val">{m.baseline}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="comparison-row">
                                            <span className="text-muted">Status</span>
                                            <span className="comparison-val">Normal Baseline</span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="comparison-card current">
                                <h4>⚡ Current Session Snapshot</h4>
                                <ul className="comparison-list">
                                    {currentSnapshot.metrics?.length > 0 ? (
                                        currentSnapshot.metrics.map((m, i) => {
                                            const isAnomaly = m.status.includes('Anomaly');
                                            return (
                                                <li key={i} className="comparison-row">
                                                    <span className="text-muted">{m.name}</span>
                                                    <span 
                                                        className="comparison-val" 
                                                        style={{ color: isAnomaly ? 'var(--risk-high)' : 'var(--bg-sidebar)' }}
                                                    >
                                                        {m.current}
                                                    </span>
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <li className="comparison-row">
                                            <span className="text-muted">Status</span>
                                            <span className="comparison-val">No anomaly detected</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Incident Actions & Notes */}
                <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Action Control Room */}
                    <div className="panel">
                        <div className="panel-header" style={{ marginBottom: '16px' }}>
                            <h3 className="panel-title">
                                <Shield size={18} style={{ color: 'var(--color-primary)' }} />
                                Mitigation Operations
                            </h3>
                        </div>
                        
                        <div className="action-box">
                            <button 
                                className="btn btn-danger" 
                                onClick={() => onAction('suspend')}
                                style={{ opacity: user.status === 'Suspended' ? 0.6 : 1, cursor: user.status === 'Suspended' ? 'not-allowed' : 'pointer' }}
                                disabled={user.status === 'Suspended'}
                            >
                                <UserX size={16} />
                                {user.status === 'Suspended' ? 'Access Suspended' : 'Suspend User Access'}
                            </button>
                            <button className="btn btn-warning" onClick={() => onAction('mfa')}>
                                <Key size={16} />
                                Trigger Step-Up MFA
                            </button>
                            <button className="btn btn-outline" style={{ borderColor: '#65A30D', color: '#65A30D' }} onClick={() => onAction('dismiss')}>
                                <CheckCircle2 size={16} />
                                Dismiss Alert (False Positive)
                            </button>
                            <button className="btn btn-outline" onClick={() => onAction('escalate')}>
                                <ShieldAlert size={16} />
                                Escalate to Compliance Office
                            </button>
                        </div>
                    </div>

                    {/* Case Files / Audit Notes */}
                    <div className="panel">
                        <div className="panel-header" style={{ marginBottom: '12px' }}>
                            <h3 className="panel-title">
                                <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                                Case Investigation Logs
                            </h3>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '12px' }}>This log provides an immutable record of compliance notes for external audits.</p>
                        
                        <div className="notes-container">
                            <form onSubmit={handleNoteSubmit}>
                                <textarea 
                                    id="investigation-notes-input" 
                                    className="notes-input" 
                                    placeholder="Type case log notes, evidence details, or justification for escalation..." 
                                    rows="4"
                                    value={noteInput}
                                    onChange={(e) => setNoteInput(e.target.value)}
                                ></textarea>
                                <button type="submit" className="btn btn-primary w-full" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                    <Send size={14} style={{ marginRight: '6px' }} />
                                    Submit Log Entry
                                </button>
                            </form>
                            
                            <div className="notes-list">
                                {user.notes?.length === 0 ? (
                                    <p className="text-muted text-center" style={{ fontSize: '0.8rem', padding: '12px 0' }}>No analyst logs recorded.</p>
                                ) : (
                                    user.notes?.map((note, idx) => (
                                        <div key={idx} className="note-item">
                                            <div className="note-header">
                                                <span>By {note.author}</span>
                                                <span>{note.date}</span>
                                            </div>
                                            <div>{note.text}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
