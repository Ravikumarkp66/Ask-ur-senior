import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ onLogout }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const { darkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        // Check if user is admin - you can set admin emails here
        const user = auth.currentUser;
        const adminEmails = ['mreducator4566@gmail.com', 'ravikumarkp4566@gmail.com']; // Add your admin emails

        if (user && adminEmails.includes(user.email)) {
            setIsAdmin(true);
        }
    }, []);

    return (
        <nav className="flex items-center justify-between p-5 bg-white/10 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg dark:shadow-2xl border-b border-gray-200/10 dark:border-gray-700/20 transition-all duration-300">
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                🎓 ASK+
            </h1>

            <div className="flex items-center gap-6">
                <button
                    onClick={toggleDarkMode}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all duration-300 ${darkMode
                            ? 'bg-linear-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700'
                            : 'bg-linear-to-r from-indigo-900 to-blue-900 hover:from-indigo-800 hover:to-blue-800'
                        }`}
                >
                    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>

                {isAdmin && (
                    <Link
                        to="/admin/upload"
                        className="bg-linear-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300"
                    >
                        📤 Admin Upload
                    </Link>
                )}

                <button
                    onClick={onLogout}
                    className="bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all duration-300"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
