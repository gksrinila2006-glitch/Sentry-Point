import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { 
    AlertTriangle, Users, Clock, CheckCircle2, TrendingUp, Radio, Shield, 
    Cpu, Layers, AlertCircle, Fingerprint, Server, Play, ShieldAlert, 
    ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2, Info, ArrowRight, Settings
} from 'lucide-react';

export default function Dashboard({ users, alerts, onInvestigateUser, onTriggerScenario, onDismissAllAlerts }) {
    const trendChartRef = useRef(null);
    const trendChartInstance = useRef(null);
    
    // Canvas Sparkline references
    const alertsSparkRef = useRef(null);
    const usersSparkRef = useRef(null);
    const mttdSparkRef = useRef(null);
    const fpSparkRef = useRef(null);

    // Chart Timeframe Filter State
    const [chartTimeframe, setChartTimeframe] = useState('30d');

    // Advanced Simulator States & Modal Toggle
    const [simAttack, setSimAttack] = useState('Privileged Bypass');
    const [showAdvancedModal, setShowAdvancedModal] = useState(false);
    
    // Modal-only configs
    const [simSeverity, setSimSeverity] = useState('CRITICAL');
    const [simTargetUser, setSimTargetUser] = useState(users[0]?.id || 'USR-8204-MOM');
    const [simTargetSystem, setSimTargetSystem] = useState('Core Ledger Server Node-01');
    const [simDesc, setSimDesc] = useState('Direct SSH login bypass detected. Connection originated from unmapped subnet gateway.');

    // Sparklines Drawing
    useEffect(() => {
        const drawSparkline = (canvas, data, strokeColor, fillColor) => {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            const rect = canvas.parentNode.getBoundingClientRect();
            canvas.width = rect.width || 120;
            canvas.height = 40;

            const maxVal = Math.max(...data);
            const minVal = Math.min(...data);
            const padding = 5;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const points = [];
            const stepX = canvas.width / (data.length - 1);
            
            data.forEach((val, i) => {
                const x = i * stepX;
                const divisor = (maxVal - minVal) === 0 ? 1 : (maxVal - minVal);
                const y = canvas.height - padding - (((val - minVal) / divisor) * (canvas.height - padding * 2));
                points.push({ x, y });
            });

            ctx.beginPath();
            ctx.moveTo(points[0].x, canvas.height);
            points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.lineTo(points[points.length - 1].x, canvas.height);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, fillColor);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
        };

        drawSparkline(alertsSparkRef.current, [5, 8, 4, 9, 12, 8, alerts.length], '#dc2626', 'rgba(220, 38, 38, 0.15)');
        const activeHighUsers = users.filter(u => u.riskScore >= 70 && u.status !== 'Suspended').length;
        drawSparkline(usersSparkRef.current, [2, 3, 2, 4, 3, 3, activeHighUsers], '#d97706', 'rgba(217, 119, 6, 0.15)');
        drawSparkline(mttdSparkRef.current, [8.2, 7.5, 6.8, 5.2, 5.0, 4.5, 4.2], '#2563eb', 'rgba(37, 99, 235, 0.15)');
        drawSparkline(fpSparkRef.current, [4.5, 4.0, 3.8, 3.2, 3.0, 2.9, 2.8], '#10b981', 'rgba(16, 185, 129, 0.15)');

    }, [users, alerts]);

    // Trend Chart.js Line Chart
    useEffect(() => {
        if (trendChartRef.current) {
            const ctx = trendChartRef.current.getContext('2d');
            
            const gradient = ctx.createLinearGradient(0, 0, 0, 220);
            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.12)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            if (trendChartInstance.current) {
                trendChartInstance.current.destroy();
            }

            // Set data values dynamically based on selected timeframe filter
            let timeLabels = ['Jul 01', 'Jul 03', 'Jul 05', 'Jul 07', 'Jul 09', 'Jul 11', 'Jul 13'];
            let meanData = [24, 28, 45, 32, 51, 38, 48];
            let alertsData = [1, 2, 8, 3, 11, 4, alerts.length];

            if (chartTimeframe === '24h') {
                timeLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'];
                meanData = [40, 42, 41, 46, 45, 47, 48];
                alertsData = [2, 1, 3, 2, 4, 3, alerts.length];
            } else if (chartTimeframe === '7d') {
                timeLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                meanData = [35, 38, 49, 39, 44, 40, 48];
                alertsData = [3, 2, 6, 3, 9, 4, alerts.length];
            }

            trendChartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timeLabels,
                    datasets: [
                        {
                            label: 'Mean Risk Index',
                            data: meanData,
                            borderColor: '#2563eb',
                            backgroundColor: gradient,
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Alert Anomalies Blocked',
                            data: alertsData,
                            borderColor: '#EF4444',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            fill: false,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: '#475569', font: { family: 'Inter', size: 11 } }
                        }
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 100,
                            grid: { color: 'rgba(15, 23, 42, 0.06)' },
                            ticks: { color: '#475569', font: { family: 'Inter' } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#475569', font: { family: 'Inter' } }
                        }
                    }
                }
            });
        }

        return () => {
            if (trendChartInstance.current) {
                trendChartInstance.current.destroy();
            }
        };
    }, [alerts.length, chartTimeframe]);

    const handleQuickSimulate = (e) => {
        e.preventDefault();
        
        // Match chosen quick scenario options
        if (simAttack === 'Privileged Bypass') {
            onTriggerScenario('sanjay');
        } else if (simAttack === 'Data Exfiltration') {
            onTriggerScenario('rohan');
        } else if (simAttack === 'System Sabotage') {
            onTriggerScenario('amit');
        } else if (simAttack === 'Data Abuse') {
            onTriggerScenario('sneha');
        } else {
            // General fallback
            onTriggerScenario({
                attackType: simAttack,
                severity: 'HIGH',
                targetUserId: 'USR-8204-MOM',
                targetSystem: 'Core Ledger Server Node-01',
                description: 'Quick dashboard simulation trigger.'
            });
        }
    };

    const handleAdvancedSimulateSubmit = (e) => {
        e.preventDefault();
        onTriggerScenario({
            attackType: simAttack,
            severity: simSeverity,
            targetUserId: simTargetUser,
            targetSystem: simTargetSystem,
            description: simDesc
        });
        setShowAdvancedModal(false);
    };

    const sortedHeatmapUsers = [...users]
        .filter(u => u.status !== 'Suspended')
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5);

    const activeAlert = alerts[0] || null;

    return (
        <div id="view-dashboard" className="page-view active flex flex-column gap-24" style={{ padding: '24px 0' }}>
            
            {/* 1. HERO SECTION: Behavioral Risk Correlation Engine */}
            <div className="panel" style={{ padding: '32px', borderRadius: '16px', background: 'linear-gradient(135deg, #ffffff 0%, rgba(37, 99, 235, 0.02) 100%)', textAlign: 'left' }}>
                <div className="flex justify-between align-center flex-wrap gap-16 mb-20">
                    <div>
                        <h3 className="bold" style={{ fontSize: '1.4rem', color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Cpu size={22} className="text-primary" />
                            Behavioral Risk Correlation Engine
                        </h3>
                        <p className="text-muted mt-6" style={{ fontSize: '0.85rem' }}>
                            Continuously learning privileged user behavior to intercept insider anomalies.
                        </p>
                    </div>
                    <div>
                        <span className="badge-quantum" style={{ padding: '6px 12px', fontSize: '0.72rem', borderColor: '#10B981', background: '#e6f4ea', color: '#065f46' }}>
                            Engine Calibrated & Active
                        </span>
                    </div>
                </div>

                <div className="grid grid-5 gap-16" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                    <div style={{ paddingRight: '12px', borderRight: '1px solid var(--border-color)' }}>
                        <div className="text-muted" style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 600 }}>Current Threat</div>
                        <div className="bold mt-6" style={{ fontSize: '0.9rem', color: activeAlert ? 'var(--risk-high)' : 'var(--risk-low)' }}>
                            {activeAlert ? activeAlert.category : 'No threats detected'}
                        </div>
                    </div>
                    <div style={{ paddingRight: '12px', borderRight: '1px solid var(--border-color)' }}>
                        <div className="text-muted" style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 600 }}>Current Risk Score</div>
                        <div className="bold mt-6" style={{ fontSize: '1.1rem', color: activeAlert ? 'var(--risk-high)' : 'var(--text-dark)' }}>
                            {activeAlert ? activeAlert.riskScore : '12'}
                        </div>
                    </div>
                    <div style={{ paddingRight: '12px', borderRight: '1px solid var(--border-color)' }}>
                        <div className="text-muted" style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 600 }}>AI Confidence</div>
                        <div className="bold mt-6" style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>
                            {activeAlert ? '97%' : '99.4%'}
                        </div>
                    </div>
                    <div style={{ paddingRight: '12px', borderRight: '1px solid var(--border-color)' }}>
                        <div className="text-muted" style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 600 }}>Monitoring Status</div>
                        <div className="bold mt-6 text-success" style={{ fontSize: '0.9rem' }}>
                            248 Users Scanned
                        </div>
                    </div>
                    <div>
                        <div className="text-muted" style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 600 }}>Recommended Action</div>
                        <div className="bold mt-6" style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                            {activeAlert ? 'Require MFA / Investigate' : 'Monitor session baselines'}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-20">
                    <button 
                        className="btn btn-primary" 
                        style={{ width: 'auto', padding: '10px 24px', fontSize: '0.85rem' }}
                        onClick={() => onInvestigateUser(activeAlert ? activeAlert.userId : 'USR-8204-MOM')}
                    >
                        Investigate Active Threat Dossier
                        <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                    </button>
                </div>
            </div>

            {/* 2. SECURITY OVERVIEW: KPI Cards */}
            <div className="metrics-row">
                {/* KPI Card 1: Active Alerts */}
                <div className="metric-card" style={{ padding: '20px', borderRadius: '12px', background: '#ffffff', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="flex justify-between align-center mb-8">
                        <span className="text-muted bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Active Alerts</span>
                        <AlertTriangle size={16} className="text-danger" />
                    </div>
                    <div className="bold text-dark" style={{ fontSize: '1.8rem', lineHeight: '1.1' }}>{alerts.length}</div>
                    <div className="text-muted mt-6" style={{ fontSize: '0.75rem' }}>Driven by multi-signal anomalies.</div>
                    <div className="mt-8 text-muted" style={{ fontSize: '0.65rem', marginBottom: '32px' }}>Last updated 1m ago</div>
                    <div className="metric-sparkline-box" style={{ height: '36px' }}>
                        <canvas ref={alertsSparkRef}></canvas>
                    </div>
                </div>

                {/* KPI Card 2: High Risk Users */}
                <div className="metric-card" style={{ padding: '20px', borderRadius: '12px', background: '#ffffff', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="flex justify-between align-center mb-8">
                        <span className="text-muted bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>High Risk Users</span>
                        <Users size={16} className="text-warning" />
                    </div>
                    <div className="bold text-dark" style={{ fontSize: '1.8rem', lineHeight: '1.1' }}>
                        {users.filter(u => u.riskScore >= 70 && u.status !== 'Suspended').length}
                    </div>
                    <div className="text-muted mt-6" style={{ fontSize: '0.75rem' }}>Accounts exceeding risk limits.</div>
                    <div className="mt-8 text-muted" style={{ fontSize: '0.65rem', marginBottom: '32px' }}>Last updated 1m ago</div>
                    <div className="metric-sparkline-box" style={{ height: '36px' }}>
                        <canvas ref={usersSparkRef}></canvas>
                    </div>
                </div>

                {/* KPI Card 3: Average MTTD */}
                <div className="metric-card" style={{ padding: '20px', borderRadius: '12px', background: '#ffffff', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="flex justify-between align-center mb-8">
                        <span className="text-muted bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Average MTTD</span>
                        <Clock size={16} className="text-primary" />
                    </div>
                    <div className="bold text-dark" style={{ fontSize: '1.8rem', lineHeight: '1.1' }}>4.2m</div>
                    <div className="text-muted mt-6" style={{ fontSize: '0.75rem' }}>AI correlation calculation cycle.</div>
                    <div className="mt-8 text-muted" style={{ fontSize: '0.65rem', marginBottom: '32px' }}>Synchronized with ledger</div>
                    <div className="metric-sparkline-box" style={{ height: '36px' }}>
                        <canvas ref={mttdSparkRef}></canvas>
                    </div>
                </div>

                {/* KPI Card 4: False Positive Rate */}
                <div className="metric-card" style={{ padding: '20px', borderRadius: '12px', background: '#ffffff', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="flex justify-between align-center mb-8">
                        <span className="text-muted bold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>False Positive Rate</span>
                        <CheckCircle2 size={16} className="text-success" />
                    </div>
                    <div className="bold text-dark" style={{ fontSize: '1.8rem', lineHeight: '1.1' }}>2.8%</div>
                    <div className="text-muted mt-6" style={{ fontSize: '0.75rem' }}>User feedback loop calibration.</div>
                    <div className="mt-8 text-muted" style={{ fontSize: '0.65rem', marginBottom: '32px' }}>Calibrated 24h</div>
                    <div className="metric-sparkline-box" style={{ height: '36px' }}>
                        <canvas ref={fpSparkRef}></canvas>
                    </div>
                </div>
            </div>

            {/* 3. AI DECISION & RISK ANALYSIS GRID */}
            <div className="dashboard-grid">
                {/* AI Decision Panel */}
                <div className="panel text-left flex flex-column" style={{ padding: '24px', borderRadius: '12px' }}>
                    <div className="panel-header" style={{ marginBottom: '16px' }}>
                        <h3 className="panel-title flex align-center gap-8" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                            <Cpu size={16} className="text-primary" />
                            AI Decision Engine Console
                        </h3>
                        <span className="badge-severity high" style={{ textTransform: 'none' }}>
                            Explainable AI Analysis
                        </span>
                    </div>

                    {activeAlert ? (
                        <div className="flex flex-column gap-16" style={{ flex: 1 }}>
                            <div className="grid grid-2 gap-12 text-center" style={{ backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Risk Score</div>
                                    <div className="bold mt-4 text-danger" style={{ fontSize: '1.3rem' }}>{activeAlert.riskScore}</div>
                                </div>
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Confidence</div>
                                    <div className="bold mt-4 text-primary" style={{ fontSize: '1.3rem' }}>97%</div>
                                </div>
                            </div>

                            <div>
                                <h4 className="bold mb-8" style={{ fontSize: '0.8rem', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detected Signals</h4>
                                <ul className="flex flex-column gap-6" style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                                    <li className="flex align-center gap-6" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                        <span style={{ color: 'var(--risk-high)' }}>•</span> Out-of-Hours Administration Access (02:15 AM)
                                    </li>
                                    <li className="flex align-center gap-6" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                        <span style={{ color: 'var(--risk-high)' }}>•</span> Large Database Query Volume (52,490 Records)
                                    </li>
                                    <li className="flex align-center gap-6" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                        <span style={{ color: 'var(--risk-high)' }}>•</span> Gateway Jump Host SSH Bypass
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="bold mb-8" style={{ fontSize: '0.8rem', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recommended Response</h4>
                                <ul className="flex flex-column gap-6" style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                                    <li className="flex align-center gap-6" style={{ fontSize: '0.78rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                                        <span className="text-primary">•</span> Trigger step-up MFA token verification challenge
                                    </li>
                                    <li className="flex align-center gap-6" style={{ fontSize: '0.78rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                                        <span className="text-primary">•</span> Quarantine active Active Directory session
                                    </li>
                                    <li className="flex align-center gap-6" style={{ fontSize: '0.78rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                                        <span className="text-primary">•</span> Escalate raw session metadata to compliance ledger
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-column align-center justify-center text-center py-32 text-muted">
                            <Shield size={32} style={{ color: 'var(--risk-low)', marginBottom: '8px' }} />
                            <div className="bold text-dark" style={{ fontSize: '0.85rem' }}>No Active Threat Alerts</div>
                            <span style={{ fontSize: '0.72rem' }}>BRCE currently running nominal user behavior analysis.</span>
                        </div>
                    )}
                </div>

                {/* Risk Trend Chart */}
                <div className="panel text-left flex flex-column" style={{ padding: '24px', borderRadius: '12px' }}>
                    <div className="panel-header" style={{ marginBottom: '16px' }}>
                        <h3 className="panel-title flex align-center gap-8" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                            <TrendingUp size={16} className="text-primary" />
                            Behavioral Risk Score Trend Line
                        </h3>
                        <div className="flex gap-4" style={{ background: 'rgba(15,23,42,0.04)', padding: '2px', borderRadius: '6px' }}>
                            <button 
                                className="btn" 
                                style={{ padding: '4px 8px', fontSize: '0.7rem', width: 'auto', background: chartTimeframe === '24h' ? '#ffffff' : 'transparent', color: chartTimeframe === '24h' ? 'var(--color-primary)' : 'var(--text-muted)', boxShadow: chartTimeframe === '24h' ? 'var(--shadow-sm)' : 'none' }}
                                onClick={() => setChartTimeframe('24h')}
                            >
                                24 Hours
                            </button>
                            <button 
                                className="btn" 
                                style={{ padding: '4px 8px', fontSize: '0.7rem', width: 'auto', background: chartTimeframe === '7d' ? '#ffffff' : 'transparent', color: chartTimeframe === '7d' ? 'var(--color-primary)' : 'var(--text-muted)', boxShadow: chartTimeframe === '7d' ? 'var(--shadow-sm)' : 'none' }}
                                onClick={() => setChartTimeframe('7d')}
                            >
                                7 Days
                            </button>
                            <button 
                                className="btn" 
                                style={{ padding: '4px 8px', fontSize: '0.7rem', width: 'auto', background: chartTimeframe === '30d' ? '#ffffff' : 'transparent', color: chartTimeframe === '30d' ? 'var(--color-primary)' : 'var(--text-muted)', boxShadow: chartTimeframe === '30d' ? 'var(--shadow-sm)' : 'none' }}
                                onClick={() => setChartTimeframe('30d')}
                            >
                                30 Days
                            </button>
                        </div>
                    </div>
                    <div className="chart-container" style={{ height: '220px', flex: 1 }}>
                        <canvas ref={trendChartRef}></canvas>
                    </div>
                </div>
            </div>

            {/* 4. THREAT INTELLIGENCE GRID: Live Activity & High Risk Users */}
            <div className="dashboard-grid">
                
                {/* Live Activity Feed */}
                <div className="panel text-left flex flex-column" style={{ padding: '24px', borderRadius: '12px' }}>
                    <div className="panel-header" style={{ marginBottom: '16px' }}>
                        <h3 className="panel-title flex align-center gap-8" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                            <Radio size={16} className="text-primary" />
                            Live Activity Feed
                        </h3>
                    </div>

                    <div className="activity-feed-wrap" style={{ overflowY: 'auto', maxHeight: '320px', flex: 1 }}>
                        {alerts.length === 0 ? (
                            <div className="empty-state py-32 text-center text-muted">
                                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                                <div className="bold text-dark mt-8" style={{ fontSize: '0.85rem' }}>No Active Telemetry Logs</div>
                            </div>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} className="flex flex-column gap-12">
                                <li className="flex align-center justify-between" style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                                    <div className="flex align-center gap-8">
                                        <span className="text-muted bold" style={{ fontFamily: 'monospace' }}>10:31</span>
                                        <span style={{ color: 'var(--text-dark)' }}>Admin login verification completed.</span>
                                    </div>
                                    <span style={{ color: 'var(--risk-low)' }}>● verified</span>
                                </li>
                                <li className="flex align-center justify-between" style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                                    <div className="flex align-center gap-8">
                                        <span className="text-muted bold" style={{ fontFamily: 'monospace' }}>10:32</span>
                                        <span className="bold text-danger">Privilege escalation attempt flagged.</span>
                                    </div>
                                    <span style={{ color: 'var(--risk-high)' }}>● anomaly</span>
                                </li>
                                <li className="flex align-center justify-between" style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                                    <div className="flex align-center gap-8">
                                        <span className="text-muted bold" style={{ fontFamily: 'monospace' }}>10:33</span>
                                        <span style={{ color: 'var(--text-dark)' }}>Core database schema query dispatched.</span>
                                    </div>
                                    <span style={{ color: 'var(--risk-medium)' }}>● warning</span>
                                </li>
                                <li className="flex align-center justify-between" style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                                    <div className="flex align-center gap-8">
                                        <span className="text-muted bold" style={{ fontFamily: 'monospace' }}>10:34</span>
                                        <span className="bold text-danger">User risk index increased to 89.</span>
                                    </div>
                                    <span style={{ color: 'var(--risk-high)' }}>● critical</span>
                                </li>
                                <li className="flex align-center justify-between" style={{ paddingBottom: '8px', fontSize: '0.78rem' }}>
                                    <div className="flex align-center gap-8">
                                        <span className="text-muted bold" style={{ fontFamily: 'monospace' }}>10:35</span>
                                        <span style={{ color: 'var(--text-dark)' }}>Quarantine status assigned to SOC dashboard.</span>
                                    </div>
                                    <span style={{ color: 'var(--color-primary-light)' }}>● assigned</span>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* High Risk Users (Top 5) */}
                <div className="panel text-left flex flex-column" style={{ padding: '24px', borderRadius: '12px' }}>
                    <div className="panel-header" style={{ marginBottom: '16px' }}>
                        <h3 className="panel-title flex align-center gap-8" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                            <Users size={16} className="text-primary" />
                            Top Risk Subject Profiles
                        </h3>
                    </div>

                    <div className="flex flex-column gap-8" style={{ flex: 1 }}>
                        {sortedHeatmapUsers.map(user => {
                            let severityBadge = 'low';
                            if (user.riskScore > 75) severityBadge = 'critical';
                            else if (user.riskScore >= 50) severityBadge = 'high';

                            return (
                                <div 
                                    key={user.id} 
                                    className="heatmap-item pointer flex align-center justify-between"
                                    onClick={() => onInvestigateUser(user.id)}
                                    style={{ padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#ffffff', transition: 'var(--transition)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                >
                                    <div className="flex align-center gap-12" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(37,99,235,0.06)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                            {user.avatar}
                                        </div>
                                        <div style={{ textAlign: 'left' }}>
                                            <div className="bold" style={{ fontSize: '0.8rem', color: 'var(--text-dark)', lineHeight: '1.2' }}>{user.name}</div>
                                            <div className="text-muted" style={{ fontSize: '0.68rem', lineHeight: '1.1' }}>{user.role} • {user.status}</div>
                                        </div>
                                    </div>
                                    <div className="text-right" style={{ textAlign: 'right' }}>
                                        <span className={`badge-severity ${severityBadge}`} style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                                            {user.riskScore} RISK
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* 5. THREAT SIMULATION LAB */}
            <div className="panel text-left" style={{ padding: '24px', borderRadius: '12px' }}>
                <div className="panel-header" style={{ marginBottom: '12px' }}>
                    <h3 className="panel-title flex align-center gap-8" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                        <Radio size={16} className="text-primary" />
                        Threat Simulation Lab
                    </h3>
                </div>
                <div className="flex justify-between align-center flex-wrap gap-16" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ flex: '1', minWidth: '240px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <select className="select-input" value={simAttack} onChange={(e) => setSimAttack(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.85rem', border: '1px solid var(--border-color)', borderRadius: '6px', minWidth: '220px' }}>
                            <option value="Privileged Bypass">SSH Gateway PAM Bypass</option>
                            <option value="Data Exfiltration">Anomalous Core DB Read Volume</option>
                            <option value="System Sabotage">Firewall Core Routing Modification</option>
                            <option value="Data Abuse">Bulk Client Dossier Export</option>
                        </select>
                        <button className="btn btn-outline" style={{ width: 'auto', padding: '8px 12px', fontSize: '0.8rem', color: 'var(--color-primary-light)' }} onClick={() => setShowAdvancedModal(true)}>
                            <Settings size={14} style={{ marginRight: '4px' }} />
                            Configure Lab Parameters
                        </button>
                    </div>
                    <button className="btn btn-primary" onClick={handleQuickSimulate} style={{ width: 'auto', padding: '10px 24px', fontSize: '0.85rem' }}>
                        <Play size={14} style={{ marginRight: '6px' }} />
                        Simulate Attack Vector
                    </button>
                </div>
            </div>

            {/* ADVANCED SIMULATOR MODAL */}
            {showAdvancedModal && (
                <div className="modal-overlay" onClick={() => setShowAdvancedModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)', maxWidth: '480px', width: '100%', padding: '24px', position: 'relative' }}>
                        <div className="modal-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="modal-title" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                                ⚙️ Configure Simulation Parameters
                            </h3>
                            <button className="toast-close" onClick={() => setShowAdvancedModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        
                        <form onSubmit={handleAdvancedSimulateSubmit} className="flex flex-column gap-16" style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                            <div className="form-group mb-0">
                                <label className="form-label" style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Severity Category</label>
                                <select className="select-input w-full" value={simSeverity} onChange={(e) => setSimSeverity(e.target.value)}>
                                    <option value="CRITICAL">CRITICAL</option>
                                    <option value="HIGH">HIGH</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="LOW">LOW</option>
                                </select>
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label" style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Target User Node</label>
                                <select className="select-input w-full" value={simTargetUser} onChange={(e) => setSimTargetUser(e.target.value)}>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label" style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Target Infrastructure Node</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={simTargetSystem} 
                                    onChange={(e) => setSimTargetSystem(e.target.value)} 
                                    placeholder="Node address..." 
                                />
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label" style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Scenario Script Log Notes</label>
                                <textarea 
                                    className="form-input" 
                                    value={simDesc} 
                                    onChange={(e) => setSimDesc(e.target.value)} 
                                    rows="3"
                                    placeholder="Explain the bypass payload sequence..."
                                    style={{ width: '100%', fontFamily: 'inherit', resize: 'none', padding: '10px' }}
                                />
                            </div>

                            <div className="flex gap-8 justify-end mt-12" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" style={{ width: 'auto' }} onClick={() => setShowAdvancedModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
                                    Dispatch Simulation Vector
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
