import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp } from '../helpers/otp';
import { auth } from '../firebase';

export default function VerifyOtp() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code || code.length !== 6) return alert('Enter a 6-digit code');
        try {
            setLoading(true);
            await verifyOtp(code);
            alert('Verified successfully!');
            // after verification navigate to home
            navigate('/');
        } catch (err) {
            alert(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const resend = async () => {
        try {
            setLoading(true);
            // call sendOtp again
            const { sendOtp } = await import('../helpers/otp');
            await sendOtp();
            alert('OTP resent. Check your email.');
        } catch (err) {
            console.error('resend error', err);
            alert('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    // if not logged in, redirect to login
    if (!auth.currentUser) {
        navigate('/login');
        return null;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
            <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', padding: 30, borderRadius: 12, width: '100%', maxWidth: 420 }}>
                <h2 style={{ marginBottom: 12, color: 'white' }}>Verify your email</h2>
                <p style={{ marginBottom: 18, color: '#9ca3af' }}>Enter the 6-digit code sent to your email.</p>
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" style={{ width: '100%', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'white' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit" disabled={loading} style={{ flex: 1, padding: 12, borderRadius: 8, background: 'linear-gradient(135deg, #22c55e, #059669)', color: 'white', border: 'none' }}>Verify</button>
                    <button type="button" onClick={resend} disabled={loading} style={{ padding: 12, borderRadius: 8, background: 'transparent', color: '#60a5fa', border: '1px solid rgba(255,255,255,0.06)' }}>Resend</button>
                </div>
            </form>
        </div>
    );
}
