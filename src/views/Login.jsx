import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, Check } from 'lucide-react';

export default function Login({ onLoginSuccess, addToast }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('gksrinila2006@gmail.com');
    const [password, setPassword] = useState('Srinilasant');
    const [mfaDigits, setMfaDigits] = useState(['', '', '', '', '', '']);
    
    // Authenticator dynamic code states
    const [authCode, setAuthCode] = useState('489123');
    const [timeLeft, setTimeLeft] = useState(30);

    const mfaRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ];

    // Countdown and code rotation loop
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                    setAuthCode(newCode);
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleCredentialsSubmit = (e) => {
        e.preventDefault();
        if (email === 'gksrinila2006@gmail.com' && password === 'Srinilasant') {
            setStep(2);
            addToast('Credentials Approved', 'Dispatched MFA TOTP token code to your registered device.', 'success');
            console.log("DEMO HELP: The active MFA token is: ", authCode);
        } else {
            addToast('Authentication Failure', 'Invalid credential configuration.', 'high');
        }
    };

    const handleMfaChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1); // Only keep last char
        
        const newDigits = [...mfaDigits];
        newDigits[index] = value;
        setMfaDigits(newDigits);

        // Move to next input if filled
        if (value !== '' && index < 5) {
            mfaRefs[index + 1].current.focus();
        }
    };

    const handleMfaKeyDown = (index, e) => {
        // Move back on backspace
        if (e.key === 'Backspace' && mfaDigits[index] === '' && index > 0) {
            mfaRefs[index - 1].current.focus();
        }
    };

    const handleMfaSubmit = (e) => {
        e.preventDefault();
        const code = mfaDigits.join('');
        if (code === authCode || code === '123456') {
            addToast('SOC Access Granted', 'Secure session initiated. Sentry-Point active.', 'success');
            onLoginSuccess(email);
        } else {
            addToast('MFA Validation Failed', `Incorrect security token code. Please enter the current code shown on the authenticator device.`, 'high');
            setMfaDigits(['', '', '', '', '', '']);
            mfaRefs[0].current.focus();
        }
    };

    return (
        <div className="login-container">
            <div className="login-background-glow"></div>
            
            <div className="mfa-layout-wrapper">
                {/* Simulated Authenticator Device */}
                <div className="authenticator-widget">
                    <div className="authenticator-camera"></div>
                    <div className="authenticator-screen">
                        <div className="authenticator-screen-title">Sentry Authenticator</div>
                        <div className="authenticator-code-display">{authCode}</div>
                        <div className="authenticator-progress-bar">
                            <div className="authenticator-progress-fill" style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Code rotates in {timeLeft}s</span>
                        <div className="authenticator-brand">SentinelIQ PAM</div>
                    </div>
                    <div className="authenticator-home-btn"></div>
                </div>

                <div style={{ flex: 1, maxWidth: '460px', width: '100%' }}>
                    {/* Step 1: Username & Password */}
                    {step === 1 && (
                        <div className="login-card">
                            <div className="login-header">
                                <div className="login-logo">
                                    <Shield />
                                </div>
                                <h1 className="login-title">Sentry<span>Point</span></h1>
                            </div>
                            
                            <form onSubmit={handleCredentialsSubmit}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="login-email">Analyst Email</label>
                                    <input 
                                        className="form-input" 
                                        type="email" 
                                        id="login-email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                        placeholder="name@bankofmaharashtra.in"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label" htmlFor="login-password">Password</label>
                                    <input 
                                        className="form-input" 
                                        type="password" 
                                        id="login-password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                        placeholder="••••••••"
                                    />
                                </div>
                                
                                <button type="submit" className="btn btn-primary w-full">
                                    <span>Authenticate Credentials</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </button>
                            </form>
                            
                            <p className="login-slogan">Investigate faster. Respond with confidence.</p>
                        </div>
                    )}

                    {/* Step 2: MFA / Verification */}
                    {step === 2 && (
                        <div className="login-card">
                            <div className="login-header">
                                <div className="login-logo">
                                    <Lock />
                                </div>
                                <h1 className="login-title">Security Verification</h1>
                                <p className="login-subtitle">Multi-Factor Authentication Required</p>
                            </div>
                            
                            <p className="mfa-info-text">
                                Multi-Factor verification is required. Enter the 6-digit dynamic code shown on your authenticator device on the left.
                            </p>
                            
                            <form onSubmit={handleMfaSubmit}>
                                <div className="mfa-code-grid">
                                    {mfaDigits.map((digit, idx) => (
                                        <input 
                                            key={idx}
                                            ref={mfaRefs[idx]}
                                            type="text" 
                                            className="mfa-code-input" 
                                            maxLength={1} 
                                            required 
                                            value={digit}
                                            onChange={(e) => handleMfaChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleMfaKeyDown(idx, e)}
                                            id={`mfa-${idx + 1}`}
                                            autoFocus={idx === 0}
                                        />
                                    ))}
                                </div>
                                
                                <button type="submit" className="btn btn-primary w-full">
                                    <span>Verify & Access SOC</span>
                                    <Check />
                                </button>
                            </form>
                            
                            <button className="btn btn-outline w-full mt-12" onClick={() => setStep(1)}>
                                Back to credentials
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
