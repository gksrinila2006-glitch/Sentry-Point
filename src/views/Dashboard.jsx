import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto'; // Automatically imports Chart.js controllers/elements
import { AlertTriangle, Users, Clock, CheckCircle2, TrendingUp, Radio } from 'lucide-react';

export default function Dashboard({ users, alerts, onInvestigateUser, onDismissAllAlerts }) {
    const trendChartRef = useRef(null);
    const trendChartInstance = useRef(null);
    
    // Canvas Sparkline references
    const alertsSparkRef = useRef(null);
    const usersSparkRef = useRef(null);
    const mttdSparkRef = useRef(null);
    const fpSparkRef = useRef(null);

    // Render Canvas Sparklines
    useEffect(() => {
        const drawSparkline = (canvas, data, strokeColor, fillColor) => {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            // Adjust canvas resolution for sharp display
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

            // Fill gradient area
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

            // Stroke line
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
        };

        drawSparkline(alertsSparkRef.current, [5, 8, 4, 9, 12, 8, alerts.length], '#EF4444', 'rgba(239, 68, 68, 0.25)');
        
        const activeHighUsers = users.filter(u => u.riskScore >= 70 && u.status !== 'Suspended').length;
        drawSparkline(usersSparkRef.current, [2, 3, 2, 4, 3, 3, activeHighUsers], '#F59E0B', 'rgba(245, 158, 11, 0.25)');
        
        drawSparkline(mttdSparkRef.current, [8.2, 7.5, 6.8, 5.2, 5.0, 4.5, 4.2], '#0EA5E9', 'rgba(14, 165, 233, 0.25)');
        drawSparkline(fpSparkRef.current, [4.5, 4.0, 3.8, 3.2, 3.0, 2.9, 2.8], '#10B981', 'rgba(16, 185, 129, 0.25)');

    }, [users, alerts]);

    // Render Chart.js Trend Chart
    useEffect(() => {
        if (trendChartRef.current) {
            const ctx = trendChartRef.current.getContext('2d');
            
            const gradient = ctx.createLinearGradient(0, 0, 0, 280);
            gradient.addColorStop(0, 'rgba(30, 58, 138, 0.25)'); // Navy Blue fade
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            // Destroy previous instance
            if (trendChartInstance.current) {
                trendChartInstance.current.destroy();
            }

            trendChartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jul 01', 'Jul 03', 'Jul 05', 'Jul 07', 'Jul 09', 'Jul 11', 'Jul 13'],
                    datasets: [
                        {
                            label: 'Mean Risk Index',
                            data: [24, 28, 45, 32, 51, 38, 48],
                            borderColor: '#1E3A8A',
                            backgroundColor: gradient,
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Alert Anomalies Blocked',
                            data: [1, 2, 8, 3, 11, 4, alerts.length],
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
                            labels: { font: { family: 'Inter', size: 11 } }
                        }
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 100,
                            grid: { color: '#E2E8F0' },
                            ticks: { font: { family: 'Inter' } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { font: { family: 'Inter' } }
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
    }, [alerts.length]);

    // Sort active users for Heatmap list
    const sortedHeatmapUsers = [...users]
        .filter(u => u.status !== 'Suspended')
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5);

    return (
        <div id="view-dashboard" className="page-view active">
            <div className="page-header">
                <div>
                    <h2 className="page-title">SOC Operations Command Center</h2>
                    <p className="page-subtitle">Real-time insider risk telemetry and user behavioral analysis</p>
                </div>
            </div>
            
            {/* Metrics Row */}
            <div className="metrics-row">
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">Active Alerts</span>
                        <div className="metric-icon active">
                            <AlertTriangle size={18} />
                        </div>
                    </div>
                    <div className="metric-value">{alerts.length}</div>
                    <div className="metric-trend trend-up">
                        <span>+12% vs yesterday</span>
                    </div>
                    <div className="metric-sparkline-box">
                        <canvas ref={alertsSparkRef} className="metric-sparkline-canvas"></canvas>
                    </div>
                </div>
                
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">High-Risk Users</span>
                        <div className="metric-icon warning">
                            <Users size={18} />
                        </div>
                    </div>
                    <div className="metric-value">
                        {users.filter(u => u.riskScore >= 70 && u.status !== 'Suspended').length}
                    </div>
                    <div className="metric-trend trend-stable">
                        <span>Flat compared to avg</span>
                    </div>
                    <div className="metric-sparkline-box">
                        <canvas ref={usersSparkRef} className="metric-sparkline-canvas"></canvas>
                    </div>
                </div>
                
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">Avg. MTTD</span>
                        <div className="metric-icon info">
                            <Clock size={18} />
                        </div>
                    </div>
                    <div className="metric-value">4.2m</div>
                    <div className="metric-trend trend-down">
                        <span>-15% optimization</span>
                    </div>
                    <div className="metric-sparkline-box">
                        <canvas ref={mttdSparkRef} className="metric-sparkline-canvas"></canvas>
                    </div>
                </div>
                
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">False Positive Rate</span>
                        <div className="metric-icon success">
                            <CheckCircle2 size={18} />
                        </div>
                    </div>
                    <div className="metric-value">2.8%</div>
                    <div className="metric-trend trend-down">
                        <span>-0.4% this week</span>
                    </div>
                    <div className="metric-sparkline-box">
                        <canvas ref={fpSparkRef} className="metric-sparkline-canvas"></canvas>
                    </div>
                </div>
            </div>
            
            {/* Dashboard grids */}
            <div className="dashboard-grid">
                
                {/* Left Panel: Trend Chart */}
                <div className="panel">
                    <div className="panel-header">
                        <h3 className="panel-title">
                            <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
                            Risk Score Trend vs Incident Frequency
                        </h3>
                        <div className="badge-info-pill">Last 30 Days</div>
                    </div>
                    <div className="chart-container">
                        <canvas ref={trendChartRef}></canvas>
                    </div>
                </div>
                
                {/* Right Panel: Live Heatmap Grid */}
                <div className="panel">
                    <div className="panel-header">
                        <h3 className="panel-title">
                            <Radio size={18} style={{ color: 'var(--color-primary)' }} />
                            High-Risk Entities Heatmap
                        </h3>
                        <span className="badge-severity critical" style={{ borderRadius: '50px' }}>Real-Time</span>
                    </div>
                    <div className="heatmap-list">
                        {sortedHeatmapUsers.map(user => {
                            let riskColorClass = 'risk-green';
                            if (user.riskScore > 70) riskColorClass = 'risk-red';
                            else if (user.riskScore >= 40) riskColorClass = 'risk-amber';

                            return (
                                <div 
                                    key={user.id} 
                                    className="heatmap-item pointer"
                                    onClick={() => onInvestigateUser(user.id)}
                                >
                                    <div className={`heatmap-risk-bar ${riskColorClass}`}></div>
                                    <div className="heatmap-info">
                                        <div className="heatmap-user">{user.name}</div>
                                        <div className="heatmap-dept">{user.dept} • {user.role}</div>
                                    </div>
                                    <div className="heatmap-score-box">
                                        <div className="heatmap-score">{user.riskScore}</div>
                                        <div className="heatmap-score-label">RISK</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Bottom Panel: Real-time Alert Feed */}
            <div className="panel">
                <div className="panel-header">
                    <h3 className="panel-title">
                        <AlertTriangle size={18} style={{ color: 'var(--color-primary)' }} />
                        Real-Time Flagged Anomalies & Policy Deviations
                    </h3>
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={onDismissAllAlerts}>
                        Dismiss All
                    </button>
                </div>
                
                <div className="activity-feed-wrap">
                    {alerts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🛡️</div>
                            <div className="empty-state-title">No Active Threat Alerts</div>
                            <div className="empty-state-desc">All user access patterns correspond to system security guidelines and normal baseline metrics.</div>
                        </div>
                    ) : (
                        <ul className="activity-feed">
                            {alerts.map(alert => {
                                let sevClass = 'medium';
                                if (alert.severity === 'CRITICAL') sevClass = 'high';
                                else if (alert.severity === 'LOW') sevClass = 'low';

                                return (
                                    <li key={alert.id} className="activity-item">
                                        <div className={`activity-icon-wrap ${sevClass}`}>
                                            <AlertTriangle size={18} />
                                        </div>
                                        <div className="activity-details">
                                            <div className="activity-summary">
                                                <strong>{alert.userName}</strong> ({alert.dept}) — {alert.title}
                                            </div>
                                            <div className="activity-meta">
                                                <span className={`badge-severity ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                                                <span>Risk Index: <b style={{ color: 'var(--bg-sidebar)' }}>{alert.riskScore}</b></span>
                                                <span>• {alert.time}</span>
                                                <span>• Category: <b>{alert.category}</b></span>
                                            </div>
                                        </div>
                                        <a className="activity-action-btn" onClick={() => onInvestigateUser(alert.userId)}>Investigate Case</a>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
