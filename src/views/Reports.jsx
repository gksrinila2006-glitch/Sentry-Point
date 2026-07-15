import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { FileText, Download } from 'lucide-react';

export default function Reports({ onSimulateDownload }) {
    const categoryChartRef = useRef(null);
    const deptChartRef = useRef(null);
    
    const categoryChartInstance = useRef(null);
    const deptChartInstance = useRef(null);

    useEffect(() => {
        // 1. Alert Categories Chart
        if (categoryChartRef.current) {
            const ctxCat = categoryChartRef.current.getContext('2d');
            
            if (categoryChartInstance.current) {
                categoryChartInstance.current.destroy();
            }

            categoryChartInstance.current = new Chart(ctxCat, {
                type: 'doughnut',
                data: {
                    labels: ['Data Exfiltration', 'Credential Abuse', 'Privilege Bypass', 'Network Violations', 'Temporal Deviations'],
                    datasets: [{
                        data: [40, 25, 15, 12, 8],
                        backgroundColor: [
                            '#1E3A8A', // Navy
                            '#3B82F6', // Primary Blue
                            '#EF4444', // Red
                            '#F59E0B', // Amber
                            '#0EA5E9'  // Cyan
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { color: '#475569', font: { family: 'Inter', size: 11 } }
                        }
                    }
                }
            });
        }

        // 2. Department Risks Chart
        if (deptChartRef.current) {
            const ctxDept = deptChartRef.current.getContext('2d');
            
            if (deptChartInstance.current) {
                deptChartInstance.current.destroy();
            }

            deptChartInstance.current = new Chart(ctxDept, {
                type: 'bar',
                data: {
                    labels: ['Global Markets', 'IT Administration', 'Wealth Management', 'Retail Branch ops', 'Compliance & Legal'],
                    datasets: [{
                        label: 'Average Department Risk Score',
                        data: [78, 72, 48, 28, 12],
                        backgroundColor: '#2563eb', // Cobalt Blue
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
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
            if (categoryChartInstance.current) {
                categoryChartInstance.current.destroy();
            }
            if (deptChartInstance.current) {
                deptChartInstance.current.destroy();
            }
        };
    }, []);

    const reportPackages = [
        {
            name: 'SentinelIQ_Executive_InsiderRisk_Monthly_Report_June_2026.pdf',
            meta: 'PDF Document • 4.2 MB • Generated on 2026-07-01',
            type: 'pdf'
        },
        {
            name: 'SentryPoint_Regulatory_Compliance_Audit_Trail_Q2_2026.pdf',
            meta: 'PDF Document • 11.8 MB • Generated on 2026-07-10',
            type: 'pdf'
        },
        {
            name: 'SentryPoint_ThreatBaseline_Metrics_Export.csv',
            meta: 'CSV Raw Data • 890 KB • Generated on 2026-07-13',
            type: 'csv'
        }
    ];

    return (
        <div id="view-reports" className="page-view active">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Executive Threat Intelligence Reports</h2>
                    <p className="page-subtitle">Review high-level department risk indices, alert volume statistics, and trend patterns</p>
                </div>
            </div>

            <div className="reports-grid">
                <div className="panel">
                    <div className="panel-header">
                        <h3 className="panel-title">Alert Categories Breakdown</h3>
                    </div>
                    <div className="chart-container">
                        <canvas ref={categoryChartRef}></canvas>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <h3 className="panel-title">Top Risky Departments (Average Risk Index)</h3>
                    </div>
                    <div className="chart-container">
                        <canvas ref={deptChartRef}></canvas>
                    </div>
                </div>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <h3 className="panel-title">Available Exportable Summary Packages</h3>
                </div>
                <div className="download-report-list">
                    {reportPackages.map((pkg, idx) => (
                        <div key={idx} className="download-report-item">
                            <div className="report-file-info">
                                <div className="report-file-icon">
                                    <FileText style={{ color: pkg.type === 'pdf' ? '#EF4444' : '#10B981' }} />
                                </div>
                                <div>
                                    <div className="report-file-name">{pkg.name}</div>
                                    <div className="report-file-meta">{pkg.meta}</div>
                                </div>
                            </div>
                            <button 
                                className="btn btn-outline" 
                                style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'auto' }} 
                                onClick={() => onSimulateDownload(pkg.name)}
                            >
                                <Download size={14} style={{ marginRight: '6px' }} />
                                {pkg.type === 'pdf' ? 'Download Report' : 'Download CSV'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
