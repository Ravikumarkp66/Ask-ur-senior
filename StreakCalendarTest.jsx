import React from 'react';

export default function StreakCalendarTest() {
  return (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      borderRadius: '16px', 
      padding: '20px', 
      width: '320px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
        Monthly Streak Test
      </h2>
      <div style={{ color: '#9ca3af', fontSize: '14px' }}>
        If you can see this styled card, Tailwind is the issue.
      </div>
    </div>
  );
}
