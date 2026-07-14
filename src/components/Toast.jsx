import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export default function Toast({ id, title, message, type, onClose }) {
    useEffect(() => {
        // Auto-close after 5 seconds
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [id, onClose]);

    const getIcon = () => {
        if (type === 'high') return <AlertCircle className="high" />;
        if (type === 'medium') return <AlertTriangle className="medium" />;
        return <CheckCircle2 className="success" />;
    };

    const getToastClass = () => {
        if (type === 'high') return 'toast toast-high';
        if (type === 'medium') return 'toast toast-warning';
        return 'toast toast-success';
    };

    return (
        <div className={getToastClass()}>
            <div className={`toast-icon ${type}`}>
                {getIcon()}
            </div>
            <div className="toast-content">
                <div className="toast-title">{title}</div>
                <div className="toast-message">{message}</div>
            </div>
            <button className="toast-close" onClick={() => onClose(id)}>
                <X size={16} />
            </button>
        </div>
    );
}
