import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';

// Views
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Investigation from './views/Investigation';
import Users from './views/Users';
import AuditLog from './views/AuditLog';
import Reports from './views/Reports';
import Settings from './views/Settings';

export default function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedUserId, setSelectedUserId] = useState('USR-8204-MOM');
    const [selectedNodeIndex, setSelectedNodeIndex] = useState(3);
    const [globalSearchQuery, setGlobalSearchQuery] = useState('');
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
    const [toasts, setToasts] = useState([]);

    // ----------------------------------------------------
    // INITIAL MOCK DATABASE STATES
    // ----------------------------------------------------
    const [users, setUsers] = useState([
        {
            id: 'USR-8204-MOM',
            name: 'Rohan Deshmukh',
            email: 'rohan.deshmukh@mahabank.co.in',
            dept: 'Global Markets',
            role: 'Treasury Admin',
            clearance: 'L4 (High-Privilege - DB Write)',
            riskScore: 82,
            privileged: true,
            lastActive: '5 mins ago',
            status: 'Active',
            avatar: 'RD',
            notes: [
                { author: 'System Sentinel', date: '2026-07-13 14:10', text: 'Behavioral alert triggered: Unusual database query size detected on Core Customer Database.' },
                { author: 'System Sentinel', date: '2026-07-13 14:14', text: 'Alert severity escalated to Critical based on off-hours connection from unauthorized network subnet.' }
            ],
            contributingSignals: [
                { type: 'database', title: 'Data Volume Anomaly', desc: 'Queried 52,490 customer PII records from Core database (historical hourly baseline is 12 records).', severity: 'red', tag: 'Data Access' },
                { type: 'clock', title: 'Off-Hours Login Spike', desc: 'Active administrative session initiated at 02:14 AM (typical work window: 09:00 AM - 06:30 PM).', severity: 'amber', tag: 'Temporal Anomaly' },
                { type: 'lock', title: 'Privilege Escalation Attempt', desc: 'Attempted to modify database replication scheme on MASTER node without secondary approver signoff.', severity: 'red', tag: 'Privilege Misuse' },
                { type: 'globe', title: 'Tor Exit Node Geolocation', desc: 'Connection originating from IP 185.220.101.4 (Known Tor Exit node - Hamburg, DE).', severity: 'amber', tag: 'Network Anomaly' }
            ],
            timeline: [
                { time: 'Yesterday 09:12 AM', title: 'Shift Login', status: 'normal', risk: 12 },
                { time: 'Yesterday 03:30 PM', title: 'Database Fetch', status: 'normal', risk: 15 },
                { time: 'Today 02:14 AM', title: 'Off-Hours Session', status: 'warning', risk: 52 },
                { time: 'Today 02:15 AM', title: 'Mass PII Query', status: 'anomaly', risk: 82 }
            ],
            baselineComparisons: [
                {
                    metrics: [
                        { name: 'Data Transferred', baseline: '14 MB', current: '12 MB', status: 'Normal' },
                        { name: 'DB Rows Queried', baseline: '4 records', current: '1 record', status: 'Normal' },
                        { name: 'Concurrent Sessions', baseline: '1', current: '1', status: 'Normal' },
                        { name: 'Connection Subnet', baseline: '10.144.*.* (Intranet)', current: '10.144.12.89', status: 'Normal' }
                    ]
                },
                {
                    metrics: [
                        { name: 'Data Transferred', baseline: '140 MB', current: '98 MB', status: 'Normal' },
                        { name: 'DB Rows Queried', baseline: '45 records', current: '30 records', status: 'Normal' },
                        { name: 'Concurrent Sessions', baseline: '1', current: '1', status: 'Normal' },
                        { name: 'Connection Subnet', baseline: '10.144.*.* (Intranet)', current: '10.144.12.89', status: 'Normal' }
                    ]
                },
                {
                    metrics: [
                        { name: 'Data Transferred', baseline: '0 MB (None)', current: '42 MB', status: 'Anomaly' },
                        { name: 'DB Rows Queried', baseline: '0 records', current: '10 records', status: 'Warning' },
                        { name: 'Concurrent Sessions', baseline: '0', current: '1', status: 'Anomaly' },
                        { name: 'Connection Subnet', baseline: '10.144.*.* (Intranet)', current: '185.220.101.4 (Tor VPN)', status: 'Anomaly' }
                    ]
                },
                {
                    metrics: [
                        { name: 'Data Transferred', baseline: '12 MB', current: '4.8 GB', status: 'Critical Anomaly' },
                        { name: 'DB Rows Queried', baseline: '12 records', current: '52,490 records', status: 'Critical Anomaly' },
                        { name: 'Concurrent Sessions', baseline: '1', current: '2', status: 'Warning' },
                        { name: 'Connection Subnet', baseline: '10.144.*.* (Intranet)', current: '185.220.101.4 (Tor VPN)', status: 'Critical Anomaly' }
                    ]
                }
            ]
        },
        {
            id: 'USR-3012-IT',
            name: 'Sanjay Mehta',
            email: 'sanjay.mehta@mahabank.co.in',
            dept: 'IT Administration',
            role: 'System Administrator',
            clearance: 'L4 (Root Access - Server OS)',
            riskScore: 68,
            privileged: true,
            lastActive: '12 mins ago',
            status: 'Active',
            avatar: 'SM',
            notes: [
                { author: 'System Sentinel', date: '2026-07-13 18:30', text: 'SSH connection detected directly to Primary Ledger server bypassing the jump-host gateway.' }
            ],
            contributingSignals: [
                { type: 'lock', title: 'Gateway Bypass', desc: 'Connected to Core Server IP 10.144.20.11 via SSH without using the CyberArk Privileged Access Manager jump-host.', severity: 'red', tag: 'Access Anomaly' },
                { type: 'database', title: 'File Copy from Server', desc: 'Copied shadow config files from /etc/pam.d/ to home directory.', severity: 'amber', tag: 'Suspicious Execution' }
            ],
            timeline: [
                { time: 'Today 08:00 AM', title: 'Shift Commenced', status: 'normal', risk: 8 },
                { time: 'Today 12:45 PM', title: 'Jump Host SSH', status: 'normal', risk: 14 },
                { time: 'Today 06:14 PM', title: 'Direct OS Root SSH', status: 'warning', risk: 48 },
                { time: 'Today 06:30 PM', title: 'PAM Bypass Alert', status: 'anomaly', risk: 68 }
            ],
            baselineComparisons: [
                { metrics: [{ name: 'PAM Broker Active', baseline: 'Yes', current: 'Yes', status: 'Normal' }] },
                { metrics: [{ name: 'PAM Broker Active', baseline: 'Yes', current: 'Yes', status: 'Normal' }] },
                { metrics: [{ name: 'PAM Broker Active', baseline: 'Yes', current: 'No (Direct Connection)', status: 'Anomaly' }] },
                { metrics: [{ name: 'PAM Broker Active', baseline: 'Yes', current: 'No (PAM Bypass)', status: 'Critical Anomaly' }] }
            ]
        },
        {
            id: 'USR-4819-WLM',
            name: 'Sneha Kulkarni',
            email: 'sneha.kulkarni@mahabank.co.in',
            dept: 'Wealth Management',
            role: 'Relationship Manager',
            clearance: 'L2 (Client Portfolio View)',
            riskScore: 75,
            privileged: false,
            lastActive: '1 hour ago',
            status: 'Active',
            avatar: 'SK',
            notes: [
                { author: 'System Sentinel', date: '2026-07-13 19:15', text: 'High volume download of client portfolio files. Marked for investigation.' }
            ],
            contributingSignals: [
                { type: 'database', title: 'Data Query Spike', desc: 'Downloaded 120 Client Profile Dossiers containing asset balances and banking credentials details (Daily baseline: 8).', severity: 'red', tag: 'Dossier Access' },
                { type: 'globe', title: 'New Remote IP Location', desc: 'Accessed records while roaming outside Mumbai operations circle via mobile broadband.', severity: 'amber', tag: 'Geographical Anomaly' }
            ],
            timeline: [
                { time: 'Today 09:30 AM', title: 'Mobile Login', status: 'normal', risk: 10 },
                { time: 'Today 02:30 PM', title: '12 Client Profiles Viewed', status: 'normal', risk: 20 },
                { time: 'Today 07:05 PM', title: 'Mass Profile Bulk Query', status: 'warning', risk: 55 },
                { time: 'Today 07:15 PM', title: 'Dossier Download Burst', status: 'anomaly', risk: 75 }
            ],
            baselineComparisons: [
                { metrics: [{ name: 'Files Exported', baseline: '0', current: '0', status: 'Normal' }] },
                { metrics: [{ name: 'Files Exported', baseline: '1', current: '1', status: 'Normal' }] },
                { metrics: [{ name: 'Files Exported', baseline: '2', current: '15', status: 'Warning' }] },
                { metrics: [{ name: 'Files Exported', baseline: '4', current: '120 Files', status: 'Critical Anomaly' }] }
            ]
        },
        {
            id: 'USR-9021-RET',
            name: 'Priya Sharma',
            email: 'priya.sharma@mahabank.co.in',
            dept: 'Retail Branch ops',
            role: 'Teller / Customer Service',
            clearance: 'L1 (Basic Access)',
            riskScore: 34,
            privileged: false,
            lastActive: '3 mins ago',
            status: 'Active',
            avatar: 'PS',
            notes: [],
            contributingSignals: [
                { type: 'lock', title: 'Unusual Password Reset', desc: 'Triggered self-service password reset twice within 20 minutes from a new workstation.', severity: 'amber', tag: 'Auth Behavior' }
            ],
            timeline: [
                { time: 'Today 08:45 AM', title: 'Login', status: 'normal', risk: 5 },
                { time: 'Today 03:10 PM', title: 'Pass Reset #1', status: 'normal', risk: 15 },
                { time: 'Today 03:30 PM', title: 'Pass Reset #2', status: 'warning', risk: 34 }
            ],
            baselineComparisons: [
                { metrics: [{ name: 'Workstation Address', baseline: 'WS-MUMB-201', current: 'WS-MUMB-201', status: 'Normal' }] },
                { metrics: [{ name: 'Workstation Address', baseline: 'WS-MUMB-201', current: 'WS-MUMB-305', status: 'Warning' }] },
                { metrics: [{ name: 'Workstation Address', baseline: 'WS-MUMB-201', current: 'WS-MUMB-305', status: 'Warning' }] }
            ]
        },
        {
            id: 'USR-5561-IT',
            name: 'Amit Shinde',
            email: 'amit.shinde@mahabank.co.in',
            dept: 'IT Administration',
            role: 'Network Engineer',
            clearance: 'L3 (Router & Switch Config)',
            riskScore: 89,
            privileged: true,
            lastActive: 'Just now',
            status: 'Active',
            avatar: 'AS',
            notes: [
                { author: 'System Sentinel', date: '2026-07-13 20:01', text: 'Alert triggered for direct modification of Cisco core firewall configuration routing table.' }
            ],
            contributingSignals: [
                { type: 'lock', title: 'Config Bypass Blocked', desc: 'Attempted to modify core routing table entries to map private VLAN traffic to outside cloud server gateway.', severity: 'red', tag: 'Firewall Policy Violation' },
                { type: 'database', title: 'Bulk Config Script Run', desc: 'Uploaded automated script to modify SSH encryption ciphers on 24 regional gateway switches.', severity: 'red', tag: 'Configuration Anomaly' }
            ],
            timeline: [
                { time: 'Today 06:00 PM', title: 'Network Command Session', status: 'normal', risk: 20 },
                { time: 'Today 07:45 PM', title: 'Switch Script Deploy', status: 'warning', risk: 55 },
                { time: 'Today 08:01 PM', title: 'Core Routing Table Alter', status: 'anomaly', risk: 89 }
            ],
            baselineComparisons: [
                { metrics: [{ name: 'Routing Rules Modified', baseline: '0', current: '0', status: 'Normal' }] },
                { metrics: [{ name: 'Routing Rules Modified', baseline: '0', current: '2 switch maps', status: 'Warning' }] },
                { metrics: [{ name: 'Routing Rules Modified', baseline: '0', current: 'Alter Core FW config', status: 'Critical Anomaly' }] }
            ]
        }
    ]);

    const [alerts, setAlerts] = useState([
        {
            id: 'ALT-1090',
            userId: 'USR-8204-MOM',
            userName: 'Rohan Deshmukh',
            dept: 'Global Markets',
            title: 'Anomalous Database Query Volume (52,490 Customer PII records)',
            riskScore: 82,
            severity: 'CRITICAL',
            time: '15 mins ago',
            icon: 'database',
            category: 'Data Exfiltration'
        },
        {
            id: 'ALT-1091',
            userId: 'USR-5561-IT',
            userName: 'Amit Shinde',
            dept: 'IT Administration',
            title: 'Blocked modification of core routing tables on bank central firewall',
            riskScore: 89,
            severity: 'CRITICAL',
            time: '24 mins ago',
            icon: 'lock',
            category: 'System Sabotage'
        },
        {
            id: 'ALT-1092',
            userId: 'USR-4819-WLM',
            userName: 'Sneha Kulkarni',
            dept: 'Wealth Management',
            title: 'Bulk download of premium client profiles (120 dossier exports)',
            riskScore: 75,
            severity: 'HIGH',
            time: '1 hour ago',
            icon: 'database',
            category: 'Data Abuse'
        },
        {
            id: 'ALT-1093',
            userId: 'USR-3012-IT',
            userName: 'Sanjay Mehta',
            dept: 'IT Administration',
            title: 'Direct SSH connection to Core Ledger server bypassing PAM Broker',
            riskScore: 68,
            severity: 'MEDIUM',
            time: '1 hour ago',
            icon: 'lock',
            category: 'Privileged Bypass'
        }
    ]);

    const [auditLogs, setAuditLogs] = useState([
        {
            timestamp: '2026-07-13 20:18:22',
            sigId: 'ML-KEM-768#b2f5a89e02',
            actorIp: '10.144.12.89',
            targetProfile: 'USR-8204-MOM (Rohan Deshmukh)',
            action: 'Policy Engine triggered ALERT ALT-1090: Customer record queries exceeded hourly threshold.',
            severity: 'CRITICAL'
        },
        {
            timestamp: '2026-07-13 20:01:05',
            sigId: 'ML-KEM-768#a109fe228c',
            actorIp: '10.144.40.5',
            targetProfile: 'USR-5561-IT (Amit Shinde)',
            action: 'AD Integration blocked CLI update on routing tables for Central FW.',
            severity: 'CRITICAL'
        },
        {
            timestamp: '2026-07-13 19:15:30',
            sigId: 'ML-KEM-768#ffd29b380a',
            actorIp: '172.16.2.22',
            targetProfile: 'USR-4819-WLM (Sneha Kulkarni)',
            action: 'Dossier retrieval alerts flagged on system log.',
            severity: 'HIGH'
        },
        {
            timestamp: '2026-07-13 18:30:12',
            sigId: 'ML-KEM-768#cc90de1245',
            actorIp: '10.144.20.11',
            targetProfile: 'USR-3012-IT (Sanjay Mehta)',
            action: 'Direct console login bypassed CyberArk security Broker.',
            severity: 'MEDIUM'
        },
        {
            timestamp: '2026-07-13 18:02:11',
            sigId: 'ML-KEM-768#ee4411ba82',
            actorIp: 'System Engine',
            targetProfile: 'Policy Settings',
            action: 'Analyst gksrinila2006@gmail.com updated AI anomaly severity threshold to 70.',
            severity: 'INFO'
        }
    ]);

    const [rules, setRules] = useState([
        { id: 'R1', expression: 'IF (RiskIndex > 80) AND (Target.Role == "Privileged")', action: 'Trigger Step-Up MFA Challenge', enabled: true },
        { id: 'R2', expression: 'IF (DeviationPct > 60%) AND (Connection == "Tor VPN")', action: 'Suspend Token Access Immediately', enabled: true },
        { id: 'R3', expression: 'IF (System == "Core Ledger") AND (PrivilegedAccess == "Direct SSH")', action: 'Block Connection & Alert Analyst', enabled: true }
    ]);

    // ----------------------------------------------------
    // TOAST NOTIFICATIONS HANDLING
    // ----------------------------------------------------
    const addToast = (title, message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, title, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // ----------------------------------------------------
    // AUDIT LOG MANAGEMENT
    // ----------------------------------------------------
    const addAuditEntry = (ip, target, action, severity) => {
        const now = new Date();
        const dateString = now.getFullYear() + '-' + 
            String(now.getMonth() + 1).padStart(2, '0') + '-' + 
            String(now.getDate()).padStart(2, '0') + ' ' + 
            String(now.getHours()).padStart(2, '0') + ':' + 
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');

        const randHex = Math.random().toString(16).substring(2, 10);
        const sigId = `ML-KEM-768#${randHex}`;

        setAuditLogs(prev => [
            {
                timestamp: dateString,
                sigId: sigId,
                actorIp: ip,
                targetProfile: target,
                action: action,
                severity: severity
            },
            ...prev
        ]);
    };

    // ----------------------------------------------------
    // REAL-TIME ALERTS SIMULATOR
    // ----------------------------------------------------
    useEffect(() => {
        if (!currentUser) return;

        const interval = setInterval(() => {
            const scenarios = [
                {
                    title: 'New privilege authorization request',
                    desc: 'User Sanjay Mehta requested ledger replication credentials.',
                    type: 'medium',
                    username: 'Sanjay Mehta',
                    userId: 'USR-3012-IT',
                    severity: 'MEDIUM'
                },
                {
                    title: 'Unauthorized remote SSH connection attempt',
                    desc: 'Network firewall blocked routing update from external gateway.',
                    type: 'high',
                    username: 'Amit Shinde',
                    userId: 'USR-5561-IT',
                    severity: 'CRITICAL'
                },
                {
                    title: 'Customer PII Table Access Threshold Exceeded',
                    desc: 'User Sneha Kulkarni viewed 35 database records in short burst.',
                    type: 'high',
                    username: 'Sneha Kulkarni',
                    userId: 'USR-4819-WLM',
                    severity: 'HIGH'
                }
            ];

            const chosen = scenarios[Math.floor(Math.random() * scenarios.length)];
            
            // Prevent duplicate triggers
            setAlerts(prevAlerts => {
                const exists = prevAlerts.some(a => a.title === chosen.title && a.userId === chosen.userId);
                if (exists) return prevAlerts;

                const newAlertId = `ALT-${Math.floor(Math.random() * 1000) + 1000}`;
                const userObj = users.find(u => u.id === chosen.userId);

                // Add to audit trail
                addAuditEntry(
                    '10.144.12.89', 
                    `${chosen.userId} (${chosen.username})`, 
                    `AI Engine triggered real-time event warning: ${chosen.title}`, 
                    chosen.severity
                );

                // Send Toast
                addToast(`Real-Time Alert: ${chosen.title}`, chosen.desc, chosen.type);
                setHasUnreadNotifications(true);

                return [
                    {
                        id: newAlertId,
                        userId: chosen.userId,
                        userName: chosen.username,
                        dept: userObj ? userObj.dept : 'IT Operations',
                        title: chosen.title,
                        riskScore: userObj ? userObj.riskScore : 50,
                        severity: chosen.severity,
                        time: 'Just now',
                        icon: chosen.severity === 'CRITICAL' ? 'lock' : 'database',
                        category: 'AI Telemetry Realtime'
                    },
                    ...prevAlerts
                ];
            });
        }, 45000); // 45 seconds

        return () => clearInterval(interval);
    }, [currentUser, users]);

    // ----------------------------------------------------
    // USER ACTIONS IMPLEMENTATION
    // ----------------------------------------------------
    const handleLoginSuccess = (email) => {
        setCurrentUser({ email, role: 'SOC Lead Analyst' });
        setCurrentView('dashboard');
        addAuditEntry('10.144.12.89', 'System Gateway', 'User logged in successfully under analyst authorization.', 'INFO');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentView('dashboard');
        addToast('Secure Session Closed', 'You have successfully logged out.', 'success');
    };

    const handleInvestigationAction = (actionType) => {
        setUsers(prevUsers => {
            return prevUsers.map(u => {
                if (u.id === selectedUserId) {
                    if (actionType === 'suspend') {
                        // Clear active alerts for this user
                        setAlerts(prev => prev.filter(a => a.userId !== u.id));
                        addAuditEntry('10.144.12.89', `${u.id} (${u.name})`, 'Suspended user active token access via Active Directory API integration.', 'CRITICAL');
                        addToast('User Suspended', `Access tokens blocked for ${u.name}. Security policies applied.`, 'high');
                        
                        setTimeout(() => setCurrentView('dashboard'), 1000);
                        return { ...u, status: 'Suspended', riskScore: 0 };
                    } 
                    
                    if (actionType === 'mfa') {
                        addAuditEntry('10.144.12.89', `${u.id} (${u.name})`, 'Dispatched out-of-band Step-up MFA security challenge.', 'HIGH');
                        addToast('MFA Step-Up Issued', `Prompted ${u.name} for hardware security token authentication.`, 'success');
                        return { ...u, status: 'MFA-Challenged' };
                    } 
                    
                    if (actionType === 'dismiss') {
                        setAlerts(prev => prev.filter(a => a.userId !== u.id));
                        addAuditEntry('10.144.12.89', `${u.id} (${u.name})`, 'Dismissed threat alerts. Recalibrated AI detection thresholds.', 'INFO');
                        addToast('Alert Dismissed', `Threat flags resolved for ${u.name}. Baseline updated.`, 'success');
                        
                        setTimeout(() => setCurrentView('dashboard'), 1000);
                        return { ...u, status: 'Active', riskScore: 12 };
                    } 
                    
                    if (actionType === 'escalate') {
                        addAuditEntry('10.144.12.89', `${u.id} (${u.name})`, 'Escalated incident summary dossier to CISO and Banking Compliance office.', 'HIGH');
                        addToast('Case Escalated', 'Incident report exported and routed to Compliance and Legal Officers.', 'success');
                        return u;
                    }
                }
                return u;
            });
        });
    };

    const handleAddNote = (noteText) => {
        setUsers(prevUsers => {
            return prevUsers.map(u => {
                if (u.id === selectedUserId) {
                    const now = new Date();
                    const dateString = now.getFullYear() + '-' + 
                        String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(now.getDate()).padStart(2, '0') + ' ' + 
                        String(now.getHours()).padStart(2, '0') + ':' + 
                        String(now.getMinutes()).padStart(2, '0');

                    const newNotes = [
                        { author: currentUser.email, date: dateString, text: noteText },
                        ...(u.notes || [])
                    ];

                    addAuditEntry(
                        '10.144.12.89',
                        `${u.id} (${u.name})`,
                        `Analyst added manual forensic note: "${noteText}"`,
                        'INFO'
                    );
                    addToast('Audit Log Added', 'Your forensic analysis note has been appended to the ledger.', 'success');
                    
                    return { ...u, notes: newNotes };
                }
                return u;
            });
        });
    };

    const handleTogglePrivileged = (userId) => {
        setUsers(prevUsers => {
            return prevUsers.map(u => {
                if (u.id === userId) {
                    const newPrivState = !u.privileged;
                    addToast('Access Privilege Changed', `${u.name} privileged status toggled. Updates applied in AD index.`, 'success');
                    addAuditEntry('10.144.12.89', `${u.id} (${u.name})`, `Analyst updated account privileged status to: ${newPrivState ? 'TRUE' : 'FALSE'}.`, 'HIGH');
                    return { ...u, privileged: newPrivState };
                }
                return u;
            });
        });
    };

    const handleQuickSuspend = (userId) => {
        setUsers(prevUsers => {
            return prevUsers.map(u => {
                if (u.id === userId) {
                    setAlerts(prev => prev.filter(a => a.userId !== u.id));
                    addAuditEntry('10.144.12.89', `${u.id} (${u.name})`, 'Suspended user active token access via Users Management Panel.', 'CRITICAL');
                    addToast('User Suspended', `Terminated Active Directory tokens for ${u.name}.`, 'high');
                    return { ...u, status: 'Suspended', riskScore: 0 };
                }
                return u;
            });
        });
    };

    const handleExportAuditLog = (format) => {
        addToast('Export Triggered', `Compiling cryptographically signed ${format} ledger payload...`, 'success');
        setTimeout(() => {
            addToast('Export Success', `Sentry-Point verified audit logs saved locally as SentryPoint_AuditTrail_Export.${format.toLowerCase()}`, 'success');
        }, 1500);
    };

    const handleSimulateDownload = (filename) => {
        addToast('Download Dispatched', `Starting secure download: ${filename}`, 'success');
    };

    const handleToggleRule = (ruleId) => {
        setRules(prevRules => {
            return prevRules.map(r => {
                if (r.id === ruleId) {
                    const nextState = !r.enabled;
                    addToast('Mitigation Policy Toggled', `Rule execution state updated in AI policy engine.`, 'success');
                    addAuditEntry('10.144.12.89', 'Security Policy Settings', `Auto-mitigation rule ${r.id} execution state changed to: ${nextState ? 'ENABLED' : 'DISABLED'}`, 'HIGH');
                    return { ...r, enabled: nextState };
                }
                return r;
            });
        });
    };

    const handleDeleteRule = (ruleId) => {
        setRules(prevRules => prevRules.filter(r => r.id !== ruleId));
        addToast('Policy Removed', `Mitigation rule deleted from AI processing sequence.`, 'success');
        addAuditEntry('10.144.12.89', 'Security Policy Settings', `Deleted auto-mitigation rule ${ruleId} from active sequence.`, 'HIGH');
    };

    const handleAddRule = () => {
        const nextId = 'R' + (rules.length + 1);
        const newRule = {
            id: nextId,
            expression: 'IF (AlertCategory == "Data Exfiltration") AND (UserClearance < L4)',
            action: 'Lock Workstation Terminal',
            enabled: true
        };
        
        setRules(prev => [...prev, newRule]);
        addToast('Rule Appended', 'Successfully added and compiled new auto-mitigation policy.', 'success');
        addAuditEntry('10.144.12.89', 'Security Policy Settings', `Added compiled rule: ${newRule.expression} -> ACTION: ${newRule.action}`, 'HIGH');
    };

    const handleTriggerHealthCheck = () => {
        addToast('System Telemetry Health Check', 'All ML-KEM post-quantum security ledgers are synchronized. AI behavior nodes scanning.', 'success');
        setHasUnreadNotifications(false);
    };

    const handleInvestigateUser = (userId) => {
        setSelectedUserId(userId);
        const userObj = users.find(u => u.id === userId);
        setSelectedNodeIndex(userObj ? userObj.timeline.length - 1 : 0);
        setCurrentView('investigations');
    };

    // ----------------------------------------------------
    // RENDERING SHELL ROUTING
    // ----------------------------------------------------
    if (!currentUser) {
        return (
            <>
                <Login onLoginSuccess={handleLoginSuccess} addToast={addToast} />
                <div className="toast-container">
                    {toasts.map(t => (
                        <Toast key={t.id} {...t} onClose={removeToast} />
                    ))}
                </div>
            </>
        );
    }

    return (
        <>
            <div className="app-shell">
                <Sidebar 
                    currentView={currentView} 
                    onViewChange={setCurrentView} 
                    currentUser={currentUser} 
                />
                
                <div className="main-content">
                    <Header 
                        searchQuery={globalSearchQuery}
                        onSearchChange={setGlobalSearchQuery}
                        onLogout={handleLogout}
                        onTriggerToast={handleTriggerHealthCheck}
                        hasUnread={hasUnreadNotifications}
                    />
                    
                    <main className="page-container">
                        {currentView === 'dashboard' && (
                            <Dashboard 
                                users={users}
                                alerts={alerts}
                                onInvestigateUser={handleInvestigateUser}
                                onDismissAllAlerts={() => {
                                    setAlerts([]);
                                    setHasUnreadNotifications(false);
                                    addToast('Telemetry Cleared', 'Dismissed all system notifications and telemetry highlights.', 'success');
                                }}
                            />
                        )}
                        
                        {currentView === 'investigations' && (
                            <Investigation 
                                users={users}
                                selectedUserId={selectedUserId}
                                selectedNodeIndex={selectedNodeIndex}
                                onNodeSelect={setSelectedNodeIndex}
                                onAction={handleInvestigationAction}
                                onAddNote={handleAddNote}
                                onBackToDashboard={() => setCurrentView('dashboard')}
                            />
                        )}
                        
                        {currentView === 'users' && (
                            <Users 
                                users={users}
                                onInvestigateUser={handleInvestigateUser}
                                onQuickSuspend={handleQuickSuspend}
                                onTogglePrivileged={handleTogglePrivileged}
                            />
                        )}
                        
                        {currentView === 'audit-log' && (
                            <AuditLog 
                                auditLogs={auditLogs}
                                onExportAuditLog={handleExportAuditLog}
                            />
                        )}
                        
                        {currentView === 'reports' && (
                            <Reports 
                                onSimulateDownload={handleSimulateDownload}
                            />
                        )}
                        
                        {currentView === 'settings' && (
                            <Settings 
                                rules={rules}
                                onToggleRule={handleToggleRule}
                                onDeleteRule={handleDeleteRule}
                                onAddRule={handleAddRule}
                                addToast={addToast}
                            />
                        )}
                    </main>
                </div>
            </div>

            {/* Toasts Render Container */}
            <div className="toast-container">
                {toasts.map(t => (
                    <Toast key={t.id} {...t} onClose={removeToast} />
                ))}
            </div>
        </>
    );
}
