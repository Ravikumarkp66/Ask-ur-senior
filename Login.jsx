import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const navigate = useNavigate();

    const googleProvider = new GoogleAuthProvider();

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await signInWithPopup(auth, googleProvider);
            const user = auth.currentUser;
            if (user) {
                localStorage.setItem("user", user.email);
                window.location.href = "/";
            }
        } catch (error) {
            alert("Google sign-in failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handlePasswordReset = async () => {
        if (!isValidEmail(resetEmail)) return alert('Please enter a valid email');
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, resetEmail);
        } catch (error) {
            // If the user doesn't exist, or other common errors, don't reveal that info — show a generic message.
            // For invalid-email, show a helpful message.
            if (error && error.code === 'auth/invalid-email') {
                setLoading(false);
                return alert('Please enter a valid email');
            }
            console.error('Password reset error (ignored for privacy):', error);
        } finally {
            setLoading(false);
            setShowReset(false);
            setResetEmail("");
            alert("If this email is registered, you'll receive a password reset link.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            // after successful Firebase login, generate/send OTP and navigate to verify screen
            localStorage.setItem("user", email);
            // 2FA is temporarily disabled — proceed directly to app
            localStorage.setItem("user", email);
            window.location.href = "/";
        } catch (error) {
            alert("Invalid credentials!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #8b5cf6 100%)' }}>
            <form
                onSubmit={handleLogin}
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.2)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px', background: 'linear-gradient(135deg, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: '#9ca3af' }}>Sign in to continue to ASK+</p>
                </div>

                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '15px', marginBottom: '15px', borderRadius: '12px', fontSize: '16px' }}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '15px', marginBottom: '25px', borderRadius: '12px', fontSize: '16px' }}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', background: loading ? '#6b7280' : 'linear-gradient(135deg, #3b82f6, #9333ea)', color: 'white', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer', border: 'none' }}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                    <span style={{ padding: '0 15px', color: '#9ca3af' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    style={{ width: '100%', background: 'white', color: '#1f2937', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#9ca3af' }}>
                    Don't have an account?{" "}
                    <Link to="/signup" style={{ color: '#60a5fa', fontWeight: 'bold', textDecoration: 'none' }}>
                        Create Account
                    </Link>
                </p>
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    {!showReset ? (
                        <button type="button" onClick={() => setShowReset(true)} style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', fontWeight: 'bold' }}>Forgot password?</button>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                style={{ flex: 1, border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.03)', color: 'white', padding: '10px', borderRadius: '10px' }}
                            />
                            <button type="button" onClick={handlePasswordReset} disabled={loading} style={{ background: 'linear-gradient(135deg, #3b82f6, #9333ea)', color: 'white', padding: '10px 12px', borderRadius: '10px', border: 'none' }}>Send</button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Login;
