import React, { useState } from 'react';
import { Search, Shield, Download } from 'lucide-react';

export default function AuditLog({ auditLogs, onExportAuditLog }) {
    const [searchVal, setSearchVal] = useState('');
    const [severityVal, setSeverityVal] = useState('ALL');

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

    return (
        <div id="view-audit-log" className="page-view active">
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
            <div className="quantum-card">
                <div className="quantum-card-icon">
                    <Shield fill="#ECFDF5" />
                </div>
                <div>
                    <div className="quantum-card-title">Secured with ML-KEM/Kyber Post-Quantum Cryptography</div>
                    <div className="quantum-card-desc">All system activity logs and compliance logs are signed and sealed using NIST-approved post-quantum algorithms to prevent unauthorized offline modification or future decryption.</div>
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
                                <th>Actor IP</th>
                                <th>Target Profile</th>
                                <th>Action Taken</th>
                                <th>Severity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }} className="text-muted">
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
                                        <tr key={idx}>
                                            <td><code style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.timestamp}</code></td>
                                            <td><code style={{ color: '#059669', fontWeight: '600', fontFamily: 'monospace' }}>{log.sigId}</code></td>
                                            <td>{log.actorIp}</td>
                                            <td>{log.targetProfile}</td>
                                            <td>{log.action}</td>
                                            <td>
                                                <span className={`badge-severity ${badgeClass}`}>{log.severity}</span>
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
