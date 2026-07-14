import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, ToggleLeft, ToggleRight, Trash2, Plus } from 'lucide-react';

export default function Settings({ rules, onToggleRule, onDeleteRule, onAddRule, addToast }) {
    const [threshold, setThreshold] = useState(70);
    const [drift, setDrift] = useState(45);
    
    // Switch state placeholders
    const [siemSync, setSiemSync] = useState(true);
    const [adBlock, setAdBlock] = useState(true);
    const [smsNoti, setSmsNoti] = useState(false);

    return (
        <div id="view-settings" className="page-view active">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Detection Sensitivity & Access Control Policies</h2>
                    <p className="page-subtitle">Configure AI baseline deviation tolerances, real-time response actions, and alerting limits</p>
                </div>
            </div>

            <div className="panel">
                <div className="settings-group">
                    <h3 className="settings-group-title">AI Engine Sensitivity Thresholds</h3>
                    
                    <div className="setting-slider-item">
                        <div className="slider-labels">
                            <span>Anomaly Risk Severity Threshold (High)</span>
                            <span className="slider-val">{threshold}</span>
                        </div>
                        <input 
                            type="range" 
                            className="range-input" 
                            min="50" 
                            max="95" 
                            value={threshold} 
                            onChange={(e) => setThreshold(Number(e.target.value))}
                        />
                        <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                            User risk indexes exceeding this limit will trigger direct Critical Alert and activate live tracking protocols.
                        </p>
                    </div>

                    <div className="setting-slider-item">
                        <div className="slider-labels">
                            <span>AI Behavioral Drift Tolerance</span>
                            <span className="slider-val">{drift}%</span>
                        </div>
                        <input 
                            type="range" 
                            className="range-input" 
                            min="10" 
                            max="80" 
                            value={drift} 
                            onChange={(e) => setDrift(Number(e.target.value))}
                        />
                        <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                            The percentage of baseline deviation allowed before behavioral patterns are classified as anomalies.
                        </p>
                    </div>
                </div>

                <div className="settings-group">
                    <h3 className="settings-group-title">Risk-Based Auto-Mitigation Policies</h3>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '16px' }}>
                        Automated defensive protocols executing when security thresholds are breached.
                    </p>
                    
                    <div>
                        {rules.map(rule => (
                            <div key={rule.id} className="rule-card">
                                <div className="rule-info">
                                    <code className="rule-expression">{rule.expression}</code>
                                    <div className="rule-action-txt">MITIGATION ACTION: <b>{rule.action}</b></div>
                                </div>
                                <div className="flex align-center gap-16">
                                    <label className="switch">
                                        <input 
                                            type="checkbox" 
                                            checked={rule.enabled} 
                                            onChange={() => onToggleRule(rule.id)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                    <button 
                                        className="btn btn-icon" 
                                        style={{ color: 'var(--risk-high)', width: '32px', height: '32px' }} 
                                        onClick={() => onDeleteRule(rule.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button className="btn btn-outline mt-12" onClick={onAddRule} style={{ width: 'auto' }}>
                        <Plus size={14} style={{ marginRight: '6px' }} />
                        Add Auto-Mitigation Policy Rule
                    </button>
                </div>

                <div className="settings-group" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <h3 className="settings-group-title">External Systems Integration</h3>
                    <div className="flex" style={{ flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
                        <div className="flex justify-between align-center">
                            <div>
                                <div className="bold" style={{ fontSize: '0.85rem' }}>Bank SOC SIEM Sync</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Forward alerts automatically to internal bank SIEM systems (QRadar, Splunk)</div>
                            </div>
                            <label className="switch">
                                <input 
                                    type="checkbox" 
                                    checked={siemSync} 
                                    onChange={(e) => {
                                        setSiemSync(e.target.checked);
                                        addToast('Integration Toggled', `SIEM forwarding services ${e.target.checked ? 'activated' : 'deactivated'}.`, 'success');
                                    }}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="flex justify-between align-center">
                            <div>
                                <div className="bold" style={{ fontSize: '0.85rem' }}>Active Directory API Block</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Permit write access to Active Directory to lock user tokens on suspend commands</div>
                            </div>
                            <label className="switch">
                                <input 
                                    type="checkbox" 
                                    checked={adBlock} 
                                    onChange={(e) => {
                                        setAdBlock(e.target.checked);
                                        addToast('Integration Toggled', `Active Directory block execution status updated.`, 'success');
                                    }}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="flex justify-between align-center">
                            <div>
                                <div className="bold" style={{ fontSize: '0.85rem' }}>Compliance Officer SMS Notifications</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Send automated high-severity alerts to compliance team members</div>
                            </div>
                            <label className="switch">
                                <input 
                                    type="checkbox" 
                                    checked={smsNoti} 
                                    onChange={(e) => {
                                        setSmsNoti(e.target.checked);
                                        addToast('Integration Toggled', `SMS notifications for critical alerts ${e.target.checked ? 'enabled' : 'disabled'}.`, 'success');
                                    }}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
