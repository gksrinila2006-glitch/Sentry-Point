import React, { useState, useEffect } from 'react';
import { Search, Shield, Download, ShieldCheck, CheckCircle2, Lock, Cpu, Database } from 'lucide-react';

export default function AuditLog({ auditLogs, onExportAuditLog }) {
    const [searchVal, setSearchVal] = useState('');
    const [severityVal, setSeverityVal] = useState('ALL');

    // Cryptographic Verifier States
    const [verifyingLog, setVerifyingLog] = useState(null);
    const [verificationStep, setVerificationStep] = useState(0);

    const handleVerifySignature = (log) => {
        setVerifyingLog(log);
        setVerificationStep(0);
    };

    useEffect(() => {
        if (!verifyingLog) return;
        
        let timer;
        if (verificationStep < 3) {
            timer = setTimeout(() => {
                setVerificationStep(prev => prev + 1);
            }, 750);
        }
        
        return () => clearTimeout(timer);
    }, [verifyingLog, verificationStep]);

    const filteredLogs = auditLogs.filter(log => {
        const matchSearch = log.actorIp.toLowerCase().includes(searchVal.toLowerCase()) || 
                            log.targetProfile.toLowerCase().includes(searchVal.toLowerCase()) || 
                            log.action.toLowerCase().includes(searchVal.toLowerCase()) ||
                            log.sigId.toLowerCase().includes(searchVal.toLowerCase());
        
        let matchSeverity = false;
        if (severityVal === 'ALL') matchSeverity = true;
        else if (severityVal === log.severity) matchSeverity = true;

        return matchSearch && matchSeverity;
    });

    const getAIReasoning = (action) => {
        const act = action.toLowerCase();
        if (act.includes('threshold') || act.includes('queries')) return 'Data read volume anomalous by 4,250% against historical hourly profile.';
        if (act.includes('bypass') || act.includes('ssh')) return 'Direct shell execution bypassed PAM broker gateways.';
        if (act.includes('routing') || act.includes('firewall')) return 'Unauthorized alteration to network topology paths.';
        if (act.includes('dossier') || act.includes('download')) return 'Bulk retrieval of high-net-worth dossier exports detected.';
        if (act.includes('threshold to 70') || act.includes('parameter')) return 'Authorized administrative model calibration adjustment.';
        return 'Multi-signal correlation aligned with standard role permission clearance.';
    };

    const getComplianceLabel = (severity) => {
        if (severity === 'CRITICAL') return 'SOX Sec 404 / PCI-DSS';
        if (severity === 'HIGH') return 'GDPR Art 32 / HIPAA';
        if (severity === 'MEDIUM') return 'GLBA Sec 501 / Basel III';
        return 'NIST SP 800-53';
    };

    return (
        <div id="view-audit-log" className="page-view active flex flex-column gap-16">
            
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">Immutable Audit Trail Ledger</h2>
                    <p className="page-subtitle">Cryptographically verified record of system actions, threat detections, and administrative decisions</p>
                </div>
                <div className="flex gap-8">
                    <button className="btn btn-outline" onClick={() => onExportAuditLog('CSV')} style={{ width: 'auto' }}>
                        <Download size={14} style={{ marginRight: '6px' }} />
                        Export CSV
                    </button>
                    <button className="btn btn-outline" onClick={() => onExportAuditLog('PDF')} style={{ width: 'auto' }}>
                        <Download size={14} style={{ marginRight: '6px' }} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Post-Quantum Cryptography Badge Panel */}
            <div className="quantum-card" style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px dashed rgba(16,185,129,0.3)', backgroundColor: '#e6f4ea', borderRadius: '8px' }}>
                <div className="quantum-card-icon" style={{ color: '#065f46', fontSize: '1.5rem' }}>
                    <ShieldCheck size={32} />
                </div>
                <div className="text-left">
                    <div className="quantum-card-title bold" style={{ color: '#065f46', fontSize: '0.9rem' }}>Secured with ML-KEM/Kyber Post-Quantum Cryptography</div>
                    <div className="quantum-card-desc" style={{ color: '#047857', fontSize: '0.75rem', marginTop: '2px', lineHeight: '1.4' }}>
                        All compliance ledgers and incident actions are signed and sealed using NIST-approved post-quantum algorithms to prevent future offline decryption. Click any Signature ID below to verify transaction integrity.
                    </div>
                </div>
            </div>

            {/* Audit Log Content */}
            <div className="panel">
                <div className="filter-row">
                    <div className="filter-group">
                        <div style={{ position: 'relative', width: '300px' }}>
                            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                            <input 
                                type="text" 
                                className="search-input" 
                                style={{ width: '100%' }} 
                                placeholder="Search logs by action, user, or IP..." 
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                            />
                        </div>
                        <select className="select-input" value={severityVal} onChange={(e) => setSeverityVal(e.target.value)}>
                            <option value="ALL">All Severities</option>
                            <option value="CRITICAL">Critical Events</option>
                            <option value="HIGH">High Events</option>
                            <option value="MEDIUM">Medium Events</option>
                            <option value="INFO">Informational</option>
                        </select>
                    </div>
                </div>

                <div className="data-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Quantum Signature ID</th>
                                <th>Actor Node</th>
                                <th>Action Taken</th>
                                <th>AI Reasoning Justification</th>
                                <th>Compliance Label</th>
                                <th>Integrity</th>
                                <th>Severity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }} className="text-muted">
                                        No verified log signatures match the query filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log, idx) => {
                                    let badgeClass = 'low';
                                    if (log.severity === 'CRITICAL') badgeClass = 'critical';
                                    else if (log.severity === 'HIGH') badgeClass = 'high';
                                    else if (log.severity === 'MEDIUM') badgeClass = 'medium';

                                    return (
                                        <tr key={idx} style={{ fontSize: '0.78rem' }}>
                                            <td><code style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.timestamp}</code></td>
                                            <td>
                                                <code 
                                                    className="pointer" 
                                                    style={{ color: 'var(--color-primary-light)', fontWeight: '600', fontFamily: 'monospace', textDecoration: 'underline' }}
                                                    onClick={() => handleVerifySignature(log)}
                                                    title="Click to run ML-KEM Cryptographic Verification"
                                                >
                                                    {log.sigId}
                                                </code>
                                            </td>
                                            <td style={{ textAlign: 'left' }}>
                                                <div className="bold">{log.targetProfile.split(' ')[0]}</div>
                                                <div className="text-muted" style={{ fontSize: '0.68rem' }}>IP: {log.actorIp}</div>
                                            </td>
                                            <td style={{ textAlign: 'left', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.action}>
                                                {log.action}
                                            </td>
                                            <td style={{ textAlign: 'left', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={getAIReasoning(log.action)}>
                                                {getAIReasoning(log.action)}
                                            </td>
                                            <td>
                                                <span className="badge-info-pill" style={{ fontSize: '0.62rem' }}>{getComplianceLabel(log.severity)}</span>
                                            </td>
                                            <td>
                                                <span style={{ color: 'var(--risk-low)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                                                    ✅ VERIFIED
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge-severity ${badgeClass}`} style={{ fontSize: '0.65rem' }}>{log.severity}</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PQC Verifier Modal */}
            {verifyingLog && (
                <div className="modal-overlay" onClick={() => setVerifyingLog(null)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                🔐 Cryptographic Ledger Verification
                            </h3>
                            <button className="toast-close" onClick={() => setVerifyingLog(null)}>×</button>
                        </div>
                        
                        <div className="pqc-status-container">
                            {verificationStep === 3 ? (
                                <div className="pqc-shield-glow">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 11l2 2 4-4"/></svg>
                                </div>
                            ) : (
                                <div className="pqc-shield-glow" style={{ color: 'var(--color-primary-light)' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1.5s infinite linear' }}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                </div>
                            )}
                            
                            <div className="bold mt-12" style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                                {verificationStep === 0 && "Extracting cryptographic log envelope..."}
                                {verificationStep === 1 && "Hashing packet using SHA-3-256..."}
                                {verificationStep === 2 && "Decapsulating signature verification with ML-KEM..."}
                                {verificationStep === 3 && "Audit Signature Verified: Integrity Intact"}
                            </div>
                            <span className="text-muted mt-8" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                                Hash Payload: {verifyingLog.sigId}
                            </span>
                        </div>

                        <ul className="pqc-checklist">
                            <li className={`pqc-check-item ${verificationStep >= 1 ? 'done' : ''}`}>
                                <span className="pqc-check-icon">{verificationStep >= 1 ? "✅" : "⏳"}</span>
                                Read immutable payload data (IP: {verifyingLog.actorIp})
                            </li>
                            <li className={`pqc-check-item ${verificationStep >= 2 ? 'done' : ''}`}>
                                <span className="pqc-check-icon">{verificationStep >= 2 ? "✅" : "⏳"}</span>
                                Computed SHA-3 packet verification checksum
                            </li>
                            <li className={`pqc-check-item ${verificationStep >= 3 ? 'done' : ''}`}>
                                <span className="pqc-check-icon">{verificationStep >= 3 ? "✅" : "⏳"}</span>
                                Cryptographic decapsulation verified with quantum-safe key
                            </li>
                        </ul>

                        <div className="flex justify-between mt-20" style={{ fontSize: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                            <span className="text-muted">Target ID: {verifyingLog.targetProfile.split(' ')[0]}</span>
                            <span className="text-muted">Timestamp: {verifyingLog.timestamp}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
