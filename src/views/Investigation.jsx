import React, { useState } from 'react';
import { 
    ArrowLeft, Shield, AlertCircle, Clock, Database, Lock, Globe, FileText, 
    Send, UserX, Key, ShieldAlert, CheckCircle2, ChevronRight, Activity, Cpu, Server, ShieldCheck, Fingerprint
} from 'lucide-react';

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
    let riskLabel = 'LOW RISK';
    if (user.riskScore > 75) {
        scoreColorClass = 'score-text-red';
        riskLabel = 'CRITICAL THREAT';
    } else if (user.riskScore >= 40) {
        scoreColorClass = 'score-text-amber';
        riskLabel = 'ELEVATED DRIFT';
    }

    const getSignalIcon = (type) => {
        if (type === 'database') return <Database size={18} />;
        if (type === 'clock') return <Clock size={18} />;
        if (type === 'lock') return <Lock size={18} />;
        if (type === 'globe') return <Globe size={18} />;
        return <AlertCircle size={18} />;
    };

    // Risk Journey Stages based on risk score severity
    const journeyStages = [
        { name: '1. Auth Commenced', desc: 'Active Directory token issued', status: 'done', icon: <Fingerprint size={14} /> },
        { 
            name: '2. Gateway Routing', 
            desc: user.riskScore > 60 ? 'Direct root SSH bypass' : 'Verified jump-host path', 
            status: user.riskScore > 60 ? 'warning' : 'done',
            icon: <Server size={14} />
        },
        { 
            name: '3. DB Queries', 
            desc: user.riskScore > 80 ? 'Anomalous volume read' : 'Standard schema query', 
            status: user.riskScore > 80 ? 'danger' : user.riskScore > 40 ? 'warning' : 'done',
            icon: <Database size={14} />
        },
        { 
            name: '4. BRCE Heuristics', 
            desc: user.riskScore > 50 ? 'AI correlated anomalies' : 'Baseline matching', 
            status: user.riskScore > 50 ? 'danger' : 'done',
            icon: <Cpu size={14} />
        },
        { 
            name: '5. Adaptive Control', 
            desc: user.status === 'Suspended' ? 'Quarantined AD account' : 'Step-up MFA challenged', 
            status: user.status === 'Suspended' ? 'danger' : 'warning',
            icon: <ShieldAlert size={14} />
        },
        { 
            name: '6. PQC Sealed', 
            desc: 'Ledger hashes signature verified', 
            status: 'done', 
            icon: <ShieldCheck size={14} style={{ color: 'var(--risk-low)' }} /> 
        }
    ];

    return (
        <div id="view-investigations" className="page-view active flex flex-column gap-16">
            
            {/* Header Tier */}
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
            <div className="investigation-header-card" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="investigation-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="investigation-large-avatar" style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(37,99,235,0.08)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        {user.avatar}
                    </div>
                    <div className="investigation-title-text text-left">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)', margin: '0 0 6px 0' }}>{user.name}</h2>
                        <div className="investigation-meta-tags flex flex-wrap gap-8">
                            <span className="badge-info-pill">{user.role}</span>
                            <span className="badge-info-pill">{user.dept}</span>
                            <span className="badge-info-pill">Clearance: {user.clearance}</span>
                            <span className="badge-info-pill" style={{ color: user.status === 'Suspended' ? 'var(--risk-high)' : 'var(--risk-low)' }}>
                                Status: <b>{user.status}</b>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="investigation-score-display text-right">
                    <span className={`badge-severity ${user.riskScore > 75 ? 'critical' : user.riskScore > 40 ? 'high' : 'low'}`} style={{ fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px' }}>
                        {user.riskScore} RISK
                    </span>
                    <div className="investigation-score-lbl mt-4" style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{riskLabel}</div>
                </div>
            </div>

            {/* Risk Journey Map Centerpiece */}
            <div className="panel text-left">
                <div className="panel-header" style={{ marginBottom: '16px' }}>
                    <h3 className="panel-title flex align-center gap-8" style={{ fontSize: '0.9rem' }}>
                        <Activity size={16} className="text-primary" />
                        Forensic Entity Risk Journey Tracker
                    </h3>
                    <span className="badge-info-pill">Zero Trust Verification Sequence</span>
                </div>

                <div className="flex justify-between align-center flex-wrap gap-8" style={{ width: '100%' }}>
                    {journeyStages.map((stage, idx) => {
                        let dotColor = '#cbd5e1';
                        let textColor = 'var(--text-muted)';
                        if (stage.status === 'done') {
                            dotColor = 'var(--risk-low)';
                            textColor = 'var(--text-dark)';
                        } else if (stage.status === 'warning') {
                            dotColor = 'var(--risk-medium)';
                            textColor = 'var(--text-dark)';
                        } else if (stage.status === 'danger') {
                            dotColor = 'var(--risk-high)';
                            textColor = 'var(--text-dark)';
                        }

                        return (
                            <React.Fragment key={idx}>
                                <div className="flex flex-column align-center text-center" style={{ flex: '1', minWidth: '120px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: dotColor, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${dotColor}`, marginBottom: '6px' }}>
                                        {stage.icon}
                                    </div>
                                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: textColor }}>{stage.name}</span>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.2' }}>{stage.desc}</span>
                                </div>
                                {idx < journeyStages.length - 1 && (
                                    <ChevronRight size={16} style={{ color: '#cbd5e1' }} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="investigation-grid">
                {/* Left Main Panel */}
                <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Explainability / Contributing Signals */}
                    <div className="panel text-left">
                        <div className="panel-header">
                            <h3 className="panel-title flex align-center gap-8">
                                <AlertCircle size={18} style={{ color: 'var(--color-primary)' }} />
                                AI Anomaly Attribution & Root Cause Analysis
                            </h3>
                            <span className="badge-quantum" style={{ marginTop: 0, padding: '4px 10px', fontSize: '0.7rem', borderColor: '#6EE7B7' }}>
                                Explainable AI (XAI)
                            </span>
                        </div>
                        
                        <div id="explainability-signals-list" className="flex flex-column gap-12 mt-12">
                            {user.contributingSignals?.map((sig, index) => (
                                <div key={index} className="explain-card" style={{ display: 'flex', gap: '12px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#f8fafc' }}>
                                    <div className={`explain-icon ${sig.severity}`} style={{ width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {getSignalIcon(sig.type)}
                                    </div>
                                    <div className="explain-content text-left">
                                        <div className="explain-title bold" style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>{sig.title}</div>
                                        <div className="explain-desc text-muted mt-2" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>{sig.desc}</div>
                                        <span className="badge-info-pill mt-6 inline-block" style={{ fontSize: '0.62rem' }}>{sig.tag}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Behavioral Timeline */}
                    <div className="panel text-left">
                        <div className="panel-header">
                            <h3 className="panel-title flex align-center gap-8">
                                <Clock size={18} style={{ color: 'var(--color-primary)' }} />
                                72-Hour User Behavioral Session Timeline
                            </h3>
                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Click nodes to audit historical telemetry records</p>
                        </div>
                        
                        <div className="timeline-outer mt-16">
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
                        
                        <div className="baseline-comparison-section">
                            {currentSnapshot.metrics?.length > 0 ? (
                                currentSnapshot.metrics.map((m, i) => {
                                    const isAnomaly = m.status.includes('Anomaly') || m.status.includes('Critical') || m.status.includes('Warning');
                                    
                                    // Map metric values to approximate width percentages
                                    let fillPct = 15;
                                    let fillClass = '';
                                    
                                    if (m.current.toLowerCase().includes('gb') || m.current.includes('52,490') || m.current.includes('PAM Bypass') || m.current.includes('Direct Connection') || m.current.includes('120 Files') || m.current.includes('Alter')) {
                                        fillPct = 100;
                                        fillClass = 'anomaly';
                                    } else if (m.status.toLowerCase().includes('warning') || m.current.includes('15') || m.current.includes('2 switch maps') || m.current.includes('305')) {
                                        fillPct = 70;
                                        fillClass = 'warning';
                                    } else if (m.current.includes('Normal') || m.current.includes('Yes') || m.current === '1' || m.current.includes('12 MB') || m.current.includes('30 records')) {
                                        fillPct = 35;
                                    }
                                    
                                    return (
                                        <div key={i} className="baseline-row-visual">
                                            <div className="baseline-label-row">
                                                <span className="bold" style={{ color: 'var(--text-dark)' }}>{m.name}</span>
                                                <span style={{ fontSize: '0.8rem' }}>
                                                    Baseline: <strong style={{ color: 'var(--text-muted)' }}>{m.baseline}</strong> vs Current: <strong style={{ color: isAnomaly ? 'var(--risk-high)' : 'var(--risk-low)' }}>{m.current}</strong>
                                                </span>
                                            </div>
                                            <div className="baseline-bar-container">
                                                <div className="baseline-bar-marker" style={{ left: '30%' }} title="Baseline Target"></div>
                                                <div className={`baseline-bar-fill ${fillClass}`} style={{ width: `${fillPct}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>All baseline metrics match standard security clearance scopes.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Incident Actions & Notes */}
                <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Action Control Room */}
                    <div className="panel text-left">
                        <div className="panel-header" style={{ marginBottom: '16px' }}>
                            <h3 className="panel-title flex align-center gap-8">
                                <Shield size={18} style={{ color: 'var(--color-primary)' }} />
                                Mitigation Operations
                            </h3>
                        </div>
                        
                        <div className="action-box flex flex-column gap-8">
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
                            <button className="btn btn-outline" style={{ borderColor: '#10B981', color: '#10B981' }} onClick={() => onAction('dismiss')}>
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
                    <div className="panel text-left">
                        <div className="panel-header" style={{ marginBottom: '12px' }}>
                            <h3 className="panel-title flex align-center gap-8">
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
                            
                            <div className="notes-list mt-12 flex flex-column gap-8">
                                {user.notes?.length === 0 ? (
                                    <p className="text-muted text-center" style={{ fontSize: '0.8rem', padding: '12px 0' }}>No analyst logs recorded.</p>
                                ) : (
                                    user.notes?.map((note, idx) => (
                                        <div key={idx} className="note-item" style={{ padding: '10px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                                            <div className="note-header flex justify-between text-muted mb-4" style={{ fontSize: '0.65rem' }}>
                                                <span>By {note.author}</span>
                                                <span>{note.date}</span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dark)', lineHeight: '1.3' }}>{note.text}</div>
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
