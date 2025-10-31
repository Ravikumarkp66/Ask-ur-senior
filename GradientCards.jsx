import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import StreakCalendar from "./StreakCalendar";
import StreakCalendarTest from "./StreakCalendarTest";

// ===== ICONS =====
const Icons = {
  Notes: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      <path d="M8 7h8"></path>
      <path d="M8 11h8"></path>
      <path d="M8 15h6"></path>
    </svg>
  ),
  PYQs: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <path d="M14 2v6h6"></path>
      <path d="M16 13H8"></path>
      <path d="M16 17H8"></path>
      <path d="M10 9H8"></path>
    </svg>
  ),
  FAQs: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  Uploads: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  ),
  Contribute: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14"></path>
      <path d="M5 12h14"></path>
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  ),
  Doubts: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
    </svg>
  ),
};

export default function GradientCards() {
  const navigate = useNavigate();
  const [recentTracks, setRecentTracks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load from localStorage and check admin status
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentTracks");
      if (saved) setRecentTracks(JSON.parse(saved));
    } catch (error) {
      console.error("Error loading recent tracks:", error);
    }
    
    // Check if user is admin
    const checkAdmin = () => {
      const user = auth.currentUser;
      const adminEmails = ['mreducator4566@gmail.com', 'ravikumarkp4566@gmail.com'];
      if (user && adminEmails.includes(user.email)) {
        setIsAdmin(true);
      }
    };
    
    checkAdmin();
    setIsLoaded(true);
  }, []);

  // Save tracks
  const addToRecentTracks = (track) => {
    const trackToStore = {
      title: track.title,
      desc: track.desc,
      gradient: track.gradient,
      route: track.route,
      iconType: track.iconType,
    };
    const newTracks = [trackToStore, ...recentTracks.filter((t) => t.title !== trackToStore.title)].slice(0, 5);
    setRecentTracks(newTracks);
    localStorage.setItem("recentTracks", JSON.stringify(newTracks));
  };

  const handleNavigation = (route, trackInfo) => {
    addToRecentTracks(trackInfo);
    navigate(route);
  };

  // ===== TILE CARD =====
  function Tile({ title, desc, icon, gradient, onClick, stats }) {
    const [hover, setHover] = useState(false);
    return (
      <div
        role="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
        style={{
          flexShrink: 0,
          width: "340px",
          height: "auto",
          borderRadius: "16px",
          color: "#fff",
          background: gradient,
          boxShadow: hover ? "0 12px 24px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
          cursor: "pointer",
          userSelect: "none",
          transform: hover ? "translateY(-8px) scale(1.03)" : "translateY(0) scale(1)",
          transition: "transform 250ms ease-out, box-shadow 250ms ease-out",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Title */}
        <div style={{ fontSize: "26px", fontWeight: 700, marginBottom: "24px" }}>{title}</div>
        
        {/* Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>{stat.icon}</span>
              <span style={{ fontSize: "17px", fontWeight: 600 }}>{stat.count}</span>
              <span style={{ fontSize: "17px", opacity: 0.9 }}>{stat.label}</span>
            </div>
          ))}
        </div>
        
        {/* Large Icon at Bottom Right */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
          <div style={{ width: "140px", height: "140px", opacity: 0.25 }}>
            {icon}
          </div>
        </div>
      </div>
    );
  }

  // ===== RECENT TRACK CARD =====
  function RecentTrack({ track, onClick }) {
    const [hover, setHover] = useState(false);
    const getIcon = (type) => Icons[type] || Icons.Notes;
    return (
      <div
        style={{
          minWidth: 240,
          height: 100,
          borderRadius: 16,
          background: track.gradient,
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "16px 20px",
          gap: 16,
          transform: hover ? "scale(1.03)" : "scale(1)",
          transition: "transform 200ms ease, box-shadow 200ms ease",
          boxShadow: hover ? "0 8px 20px rgba(0,0,0,0.35)" : "0 4px 12px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
      >
        <div style={{ opacity: 0.95, fontSize: "32px" }}>{getIcon(track.iconType)}</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{track.title}</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{track.desc}</div>
        </div>
      </div>
    );
  }

  // ===== STYLES =====
  const wrap = {
    minHeight: "100vh",
    padding: "24px",
    boxSizing: "border-box",
  };

  const grid = {
    display: "flex",
    gap: 40,
    overflowX: "auto",
    paddingBottom: "20px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };

  const recentSection = {
    width: "100%",
    flexShrink: 0,
  };

  const recentHeader = {
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 16,
    paddingLeft: 0,
  };

  const recentScroll = {
    display: "flex",
    gap: 20,
    overflowX: "auto",
    paddingBottom: "12px",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,0.3) transparent",
  };

  const mainCardsSection = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };

  // ===== RENDER =====
  if (!isLoaded) {
    return (
      <section style={wrap}>
        <div style={{ color: "#fff" }}>Loading...</div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 min-h-screen p-6 box-border">
      {/* Main Container - Side by Side Layout */}
      <div style={{ 
        display: 'flex', 
        gap: '24px',
        alignItems: 'flex-start'
      }}>
        {/* Left Side - Cards Section */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
            All Sections
          </div>
          <div style={grid} className="hide-scrollbar">
          <Tile
            title="Notes"
            desc="50+ Subjects"
            icon={Icons.Notes}
            gradient="linear-gradient(137deg, rgb(5, 52, 57) 0.76%, rgb(5, 58, 61) 12.77%, rgb(12, 129, 141) 100%)"
            stats={[
              { icon: "📚", count: "50+", label: "Subjects" },
              { icon: "🧩", count: "Stream-wise", label: "Organization" },
              { icon: "📄", count: "300+", label: "PDFs" }
            ]}
            onClick={() =>
              handleNavigation("/notes/view", {
                title: "Notes",
                desc: "50+ Subjects",
                iconType: "Notes",
                gradient: "linear-gradient(137deg, rgb(5, 52, 57) 0.76%, rgb(5, 58, 61) 12.77%, rgb(12, 129, 141) 100%)",
                route: "/notes/view",
              })
            }
          />
          <Tile
            title="PYQs"
            desc="300+ Papers"
            icon={Icons.PYQs}
            gradient="linear-gradient(137deg, rgb(75, 30, 90) 0.76%, rgb(85, 35, 100) 12.77%, rgb(120, 60, 180) 100%)"
            stats={[
              { icon: "📘", count: "50+", label: "Subjects" },
              { icon: "🧭", count: "Stream-wise", label: "Sets" },
              { icon: "🧾", count: "300+", label: "Papers" }
            ]}
            onClick={() =>
              handleNavigation("/pyqs/view", {
                title: "PYQs",
                desc: "300+ Papers",
                iconType: "PYQs",
                gradient: "linear-gradient(137deg, rgb(75, 30, 90) 0.76%, rgb(85, 35, 100) 12.77%, rgb(120, 60, 180) 100%)",
                route: "/pyqs/view",
              })
            }
          />
          <Tile
            title="FAQs"
            desc="100+ Common Queries"
            icon={Icons.FAQs}
            gradient="linear-gradient(137deg, rgb(120, 20, 60) 0.76%, rgb(140, 30, 70) 12.77%, rgb(200, 50, 100) 100%)"
            stats={[
              { icon: "💬", count: "College", label: "Doubts" },
              { icon: "❓", count: "100+", label: "Queries" },
              { icon: "📘", count: "Rules &", label: "Regulations" }
            ]}
            onClick={() =>
              handleNavigation("/faqs", {
                title: "FAQs",
                desc: "100+ Common Queries",
                iconType: "FAQs",
                gradient: "linear-gradient(137deg, rgb(120, 20, 60) 0.76%, rgb(140, 30, 70) 12.77%, rgb(200, 50, 100) 100%)",
                route: "/faqs",
              })
            }
          />
          {isAdmin ? (
            <Tile
              title="Upload"
              desc="Manage New Files"
              icon={Icons.Uploads}
              gradient="linear-gradient(137deg, rgb(100, 30, 20) 0.76%, rgb(120, 40, 25) 12.77%, rgb(200, 80, 50) 100%)"
              stats={[
                { icon: "📤", count: "Upload", label: "New Files" },
                { icon: "📝", count: "Update &", label: "Add FAQs" },
                { icon: "📚", count: "Manage", label: "Notes & PYQs" }
              ]}
              onClick={() =>
                handleNavigation("/admin/upload", {
                  title: "Upload",
                  desc: "Manage New Files",
                  iconType: "Uploads",
                  gradient: "linear-gradient(137deg, rgb(100, 30, 20) 0.76%, rgb(120, 40, 25) 12.77%, rgb(200, 80, 50) 100%)",
                  route: "/admin/upload",
                })
              }
            />
          ) : (
            <Tile
              title="Contribute"
              desc="Contribute to ASK+ by uploading your study materials!!"
              icon={Icons.Contribute}
              gradient="linear-gradient(137deg, rgb(100, 30, 20) 0.76%, rgb(120, 40, 25) 12.77%, rgb(200, 80, 50) 100%)"
              stats={[
                { icon: "📝", count: "Upload", label: "Question Papers" },
                { icon: "📋", count: "Quiz", label: "Papers" },
                { icon: "✍️", count: "Handwritten", label: "Notes" }
              ]}
              onClick={() =>
                handleNavigation("/admin/upload", {
                  title: "Contribute",
                  desc: "Contribute to ASK+ by uploading your study materials!!",
                  iconType: "Contribute",
                  gradient: "linear-gradient(137deg, rgb(100, 30, 20) 0.76%, rgb(120, 40, 25) 12.77%, rgb(200, 80, 50) 100%)",
                  route: "/admin/upload",
                })
              }
            />
          )}
          <Tile
            title="Doubts"
            desc="Ask Your Questions"
            icon={Icons.Doubts}
            gradient="linear-gradient(137deg, rgb(60, 60, 120) 0.76%, rgb(80, 80, 140) 12.77%, rgb(120, 120, 200) 100%)"
            stats={[
              { icon: "💬", count: "Ask", label: "Questions" },
              { icon: "🎓", count: "Get", label: "Answers" },
              { icon: "📚", count: "Learn", label: "Together" }
            ]}
            onClick={() =>
              handleNavigation("/doubts", {
                title: "Doubts",
                desc: "Ask Your Questions",
                iconType: "Doubts",
                gradient: "linear-gradient(137deg, rgb(60, 60, 120) 0.76%, rgb(80, 80, 140) 12.77%, rgb(120, 120, 200) 100%)",
                route: "/doubts",
              })
            }
          />
        </div>
        </div>
        
        {/* Right Side - Streak Calendar (Sticky) */}
        <div style={{ 
          position: 'sticky',
          top: '24px',
          flexShrink: 0,
          alignSelf: 'flex-start'
        }}>
          <StreakCalendar />
        </div>
      </div>
    </section>
  );
}
