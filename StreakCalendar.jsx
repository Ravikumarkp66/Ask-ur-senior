import React, { useState, useEffect } from 'react';
import { useStreakLogic } from '../hooks/useStreakLogic';

export default function StreakCalendar() {
  const { streakData, markTodayAsDone, getCalendarData } = useStreakLogic();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  // Get current month as starting point (October 2025)
  const startDate = new Date(2025, 9, 1); // October 2025 (month is 0-indexed)
  const [selectedDate, setSelectedDate] = useState(startDate);
  
  const calendarData = getCalendarData(selectedDate);
  
  // Generate list of months (3 months back, current, 3 months forward)
  const generateMonthList = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);
      
      const isDisabled = date < startDate || date > new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      
      months.push({
        date: date,
        label: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
        disabled: isDisabled,
        isCurrent: date.getMonth() === startDate.getMonth() && date.getFullYear() === startDate.getFullYear()
      });
    }
    return months;
  };
  
  const monthList = generateMonthList();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMonthPicker && !event.target.closest('.month-picker-container')) {
        setShowMonthPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMonthPicker]);

  const handleMarkDone = () => {
    const result = markTodayAsDone();
    setToastMessage(result.message);
    setShowToast(true);
    
    if (result.milestone) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!calendarData) {
    return (
      <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', width: '320px' }}>
        <div style={{ color: 'white', textAlign: 'center', fontSize: '14px' }}>Loading...</div>
      </div>
    );
  }

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div style={{ position: 'relative' }}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-10px',
                fontSize: '24px',
                animation: `confetti ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              {['🎉', '✨', '🎊', '⭐', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 50,
          background: 'linear-gradient(to right, #f97316, #ef4444)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          fontWeight: 500
        }}>
          {toastMessage}
        </div>
      )}

      {/* Main Calendar Card */}
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '16px',
        padding: '20px',
        width: '320px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>Monthly Streak</h2>
          <button style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '2px solid #4b5563',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '14px' }}>i</span>
          </button>
        </div>

        {/* Month Picker Dropdown */}
        <div className="month-picker-container" style={{ position: 'relative', marginBottom: '16px' }}>
          <button 
            onClick={() => setShowMonthPicker(!showMonthPicker)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%',
              color: 'white', 
              fontWeight: 600, 
              fontSize: '18px',
              backgroundColor: '#252525',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer'
            }}
          >
            <span>{calendarData.monthName} {calendarData.year}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showMonthPicker ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {showMonthPicker && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              backgroundColor: '#1f1f1f',
              border: '1px solid #374151',
              borderRadius: '8px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 10,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}>
              {monthList.map((month, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!month.disabled) {
                      setSelectedDate(month.date);
                      setShowMonthPicker(false);
                    }
                  }}
                  disabled={month.disabled}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    textAlign: 'left',
                    backgroundColor: month.isCurrent ? '#2a2a2a' : 'transparent',
                    color: month.disabled ? '#4b5563' : 'white',
                    border: 'none',
                    cursor: month.disabled ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.2s',
                    opacity: month.disabled ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!month.disabled) {
                      e.target.style.backgroundColor = '#2a2a2a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!month.disabled && !month.isCurrent) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {month.label} {month.isCurrent && '(Current)'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Week Day Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '12px' }}>
          {weekDays.map((day) => (
            <div
              key={day}
              style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#6b7280', padding: '4px 0' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {calendarData.calendar.map((week, weekIdx) => (
            <div key={weekIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {week.map((day, dayIdx) => {
                const getCellStyle = () => {
                  const baseStyle = {
                    position: 'relative',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  };
                  
                  if (!day) return baseStyle;
                  
                  const cellStyle = {
                    ...baseStyle,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  };
                  
                  if (day.status === 'done') {
                    return {
                      ...cellStyle,
                      background: 'linear-gradient(to bottom right, #2a2a2a, #1f1f1f)'
                    };
                  } else if (day.status === 'pending') {
                    return {
                      ...cellStyle,
                      background: 'linear-gradient(to bottom right, #2a2a2a, #1f1f1f)',
                      boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.5)'
                    };
                  } else {
                    return {
                      ...cellStyle,
                      background: 'linear-gradient(to bottom right, #252525, #1a1a1a)',
                      opacity: 0.5
                    };
                  }
                };
                
                return (
                  <div key={dayIdx} style={{ position: 'relative', aspectRatio: '1' }}>
                    {day && (
                      <div
                        onClick={day.status === 'pending' ? handleMarkDone : undefined}
                        style={getCellStyle()}
                      >
                        {day.status === 'done' && (
                          <span style={{ fontSize: '20px' }}>🔥</span>
                        )}
                        {day.status === 'pending' && (
                          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>{day.date}</span>
                        )}
                        {day.status !== 'done' && day.status !== 'pending' && (
                          <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: 600 }}>{day.date}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Streak Info */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#f97316', fontWeight: 'bold' }}>🔥 {streakData.currentStreak}</span>
              <span style={{ color: '#6b7280' }}>day streak</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#6b7280' }}>Best:</span>
              <span style={{ color: 'white', fontWeight: 'bold' }}>{streakData.maxStreak}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
