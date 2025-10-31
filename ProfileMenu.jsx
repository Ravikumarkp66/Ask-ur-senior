import React, { useEffect, useRef } from 'react';

export default function ProfileMenu({ open, onClose, onToggleTheme, onUpgrade, onLogout, darkMode, onMouseEnter, onMouseLeave }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (open && ref.current && !ref.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  const cardStyle = {
    position: 'absolute',
    bottom: '72px',
    left: '12px',
    width: '240px',
    background: darkMode ? '#111316' : '#0b1220',
    border: darkMode ? '1px solid #1f2937' : '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
    padding: '8px 0',
    zIndex: 1000,
    color: '#e5e7eb'
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    cursor: 'pointer'
  };

  const iconWrap = {
    width: 20,
    height: 20,
    display: 'grid',
    placeItems: 'center',
    opacity: 0.9
  };

  const Divider = () => (
    <div style={{ height: 1, background: darkMode ? '#1f2937' : 'rgba(255,255,255,0.08)', margin: '6px 0' }} />
  );

  const IconMoon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
  const IconBolt = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
  const IconLogout = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );

  return (
    <div ref={ref} style={cardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* Change Theme */}
      <div style={rowStyle} onClick={onToggleTheme}>
        <div style={iconWrap}>{IconMoon}</div>
        <div style={{ fontWeight: 600 }}>Change theme</div>
      </div>
      <Divider />

      {/* Upgrade */}
      <div style={rowStyle} onClick={onUpgrade}>
        <div style={iconWrap}>{IconBolt}</div>
        <div style={{ fontWeight: 600 }}>Upgrade</div>
      </div>

      <Divider />

      {/* Logout */}
      <div style={{ ...rowStyle, color: '#fca5a5' }} onClick={onLogout}>
        <div style={iconWrap}>{IconLogout}</div>
        <div style={{ fontWeight: 700 }}>Logout</div>
      </div>
    </div>
  );
}
