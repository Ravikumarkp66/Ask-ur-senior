import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import SidebarButton from "./SidebarButton";
import ProfileMenu from "./ProfileMenu";
import { useTheme } from "../context/ThemeContext";

// Minimal inline icons (Lucide-like)
const Icon = {
    Home: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11l9-8 9 8"/>
            <path d="M9 22V12h6v10"/>
        </svg>
    ),
    Book: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M20 22H6.5A2.5 2.5 0 0 1 4 19.5V6a2 2 0 0 1 2-2h14z"/>
        </svg>
    ),
    Calendar: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    ),
    Bell: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
    ),
    Upload: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <path d="M7 10l5-5 5 5"/>
            <path d="M12 15V5"/>
        </svg>
    ),
    Sun: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
    ),
    Moon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
    ),
    LogOut: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <path d="M16 17l5-5-5-5"/>
            <path d="M21 12H9"/>
        </svg>
    ),
};

export default function Sidebar({ onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);
    const [pendingDoubts, setPendingDoubts] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const hoverCloseRef = useRef(null);
    // Sidebar is always expanded on Home; collapse disabled
    const collapsed = false;
    const { darkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        const checkAdmin = async () => {
            const user = auth.currentUser;
            const adminEmails = ['mreducator4566@gmail.com', 'ravikumarkp4566@gmail.com'];

            if (user && adminEmails.includes(user.email)) {
                setIsAdmin(true);

                // Fetch pending doubts count
                const q = query(collection(db, "doubts"), where("status", "==", "pending"));
                const querySnapshot = await getDocs(q);
                setPendingDoubts(querySnapshot.size);
            }
        };

        checkAdmin();
    }, []);

    const textColor = darkMode ? '#e5e7eb' : '#1e293b';

    const openMenu = () => {
        if (hoverCloseRef.current) {
            clearTimeout(hoverCloseRef.current);
            hoverCloseRef.current = null;
        }
        setMenuOpen(true);
    };

    const scheduleCloseMenu = () => {
        if (hoverCloseRef.current) clearTimeout(hoverCloseRef.current);
        hoverCloseRef.current = setTimeout(() => setMenuOpen(false), 200);
    };

    return (
        <div style={{
            width: '120px',
            height: '100vh',
            background: darkMode ? '#0f0f0f' : '#ffffff',
            padding: '12px',
            borderRight: darkMode ? '1px solid #1a1a1a' : '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxSizing: 'border-box',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!collapsed && (
                    <button
                        onClick={() => navigate('/')}
                        title="Home"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        <img src="/ASK+.png" alt="ASK+" style={{ height: 35, width: 80, objectFit: 'contain', borderRadius: '16px' }} onError={(e)=>{ e.currentTarget.style.display='none'; }} />
                    </button>
                )}
                {/* Collapse toggle removed */}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <SidebarButton
                    icon={Icon.Home}
                    label={"Home"}
                    onClick={() => navigate("/")}
                    active={location.pathname === '/'}
                    collapsed={false}
                    title={'Home'}
                    darkMode={darkMode}
                />

                <SidebarButton
                    icon={Icon.Calendar}
                    label={"Academic Calendar"}
                    onClick={() => navigate("/calendar")}
                    active={location.pathname === '/calendar'}
                    collapsed={false}
                    title={'Academic Calendar'}
                    darkMode={darkMode}
                />

                <SidebarButton
                    icon={Icon.Bell}
                    label={"Notifications"}
                    onClick={() => navigate("/notifications")}
                    active={location.pathname === '/notifications'}
                    collapsed={false}
                    title={'Notifications'}
                    darkMode={darkMode}
                />
            </div>

            {/* Profile Avatar + Menu */}
            <button
                onClick={() => setMenuOpen((o) => !o)}
                title="Profile"
                style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: darkMode ? '1px solid #1f2937' : '1px solid #e5e7eb',
                    background: 'transparent',
                    padding: 0,
                    cursor: 'pointer',
                    boxShadow: menuOpen ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                    transform: menuOpen ? 'scale(1.03)' : 'scale(1)',
                    transition: 'box-shadow 150ms ease, transform 150ms ease'
                }}
                onMouseEnter={openMenu}
                onMouseLeave={scheduleCloseMenu}
            >
                <img
                    src="/avatar.png"
                    alt="User"
                    onError={(e) => { e.currentTarget.src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=askplus'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </button>

            <ProfileMenu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                onToggleTheme={() => { toggleDarkMode(); setMenuOpen(false); }}
                onUpgrade={() => { alert('Upgrade coming soon!'); setMenuOpen(false); }}
                onLogout={() => { setMenuOpen(false); onLogout?.(); }}
                darkMode={darkMode}
                onMouseEnter={openMenu}
                onMouseLeave={scheduleCloseMenu}
            />
        </div>
    );
}

