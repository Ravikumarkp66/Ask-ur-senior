import React, { useState } from 'react';

export default function SidebarButton({
    icon,
    label,
    onClick,
    active = false,
    collapsed = false,
    badge = null,
    title = '',
    darkMode = true
}) {
    const [hover, setHover] = useState(false);

    const bg = darkMode
        ? (active ? '#141414' : hover ? '#121212' : 'transparent')
        : (active ? '#e5e7eb' : hover ? '#f3f4f6' : 'transparent');
    const text = darkMode
        ? (active || hover ? '#ffffff' : '#9ca3af')
        : (active || hover ? '#111827' : '#6b7280');
    const iconColor = text;

    return (
        <button
            onClick={onClick}
            title={collapsed ? title || label : ''}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: collapsed ? '0px' : '6px',
                width: '100%',
                overflow: 'hidden',
                justifyContent: 'center',
                padding: collapsed ? '10px 6px' : '12px 8px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                background: bg,
                color: text,
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 180ms ease, color 180ms ease'
            }}
        >
            <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: '3px', borderTopRightRadius: '6px', borderBottomRightRadius: '6px',
                background: active ? '#ff6a00' : 'transparent',
                transition: 'background-color 180ms ease'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '100%' }}>
                <span style={{ fontSize: '20px', color: iconColor, display: 'inline-flex' }}>{icon}</span>
                {!collapsed && (
                    <span style={{ userSelect: 'none', fontSize: '11px', lineHeight: 1.1, textAlign: 'center' }}>{label}</span>
                )}
                {badge != null && !collapsed && (
                    <span style={{ marginTop: '6px', fontSize: '11px', fontWeight: 700, background: '#dc2626', color: '#fff', borderRadius: '9999px', minWidth: '20px', height: '20px', padding: '0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>
                )}
            </div>
        </button>
    );
}
