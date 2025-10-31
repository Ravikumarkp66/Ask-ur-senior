import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ===== ICONS =====
const Icons = {
  Notes: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19a2 2 0 0 0 2 2h12" />
      <path d="M20 22V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v15" />
      <path d="M12 6v12" />
    </svg>
  ),
  PYQs: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  ),
  FAQs: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  ),
  Uploads: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5-5 5 5" />
      <path d="M12 15V5" />
    </svg>
  ),
};

export default function GradientCards() {
  const navigate = useNavigate();
  const [recentTracks, setRecentTracks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentTracks");
      if (saved) setRecentTracks(JSON.parse(saved));
    } catch (error) {
      console.error("Error loading recent tracks:", error);
    }
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
  function Tile({ title, desc, icon, gradient, onClick }) {
    const [hover, setHover] = useState(false);
    return (
      <div
        role="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
        style={{
          minWidth: 260,
          width: 260,
          height: 150,
          flexShrink: 0,
          borderRadius: 16,
          color: "#fff",
          background: gradient,
          boxShadow: "0 12px 24px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.12)",
          cursor: "pointer",
          userSelect: "none",
          transform: hover ? "translateY(-6px) scale(1.04)" : "translateY(0px) scale(1.0)",
          transition: "transform 300ms ease, box-shadow 300ms ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ opacity: 0.95 }}>{icon}</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>{desc}</div>
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
          minWidth: 180,
          height: 70,
          borderRadius: 12,
          background: track.gradient,
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "10px 14px",
          gap: 10,
          transform: hover ? "scale(1.02)" : "scale(1)",
          transition: "transform 200ms ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
      >
        <div style={{ opacity: 0.9 }}>{getIcon(track.iconType)}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{track.title}</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>{track.desc}</div>
        </div>
      </div>
    );
  }

  // ===== STYLES =====
  const wrap = {
    width: "100%",
    padding: "20px 40px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    boxSizing: "border-box",
  };

  const grid = {
    display: "flex",
    gap: 24,
    overflowX: "auto",
    paddingBottom: "16px",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,0.3) transparent",
  };

  const recentSection = {
    width: "100%",
    flexShrink: 0,
  };

  const recentHeader = {
    fontSize: 18,
    fontWeight: 600,
    color: "#fff",
    marginBottom: 12,
    paddingLeft: 0,
  };

  const recentScroll = {
    display: "flex",
    gap: 16,
    overflowX: "auto",
    paddingBottom: "8px",
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
    <section style={wrap}>
      {/* Recent Tracks */}
      {recentTracks.length > 0 && (
        <div style={recentSection}>
          <div style={recentHeader}>Recent Tracks</div>
          <div style={recentScroll}>
            {recentTracks.map((track, index) => (
              <RecentTrack key={index} track={track} onClick={() => navigate(track.route)} />
            ))}
          </div>
        </div>
      )}

      {/* Main Cards Section */}
      <div style={mainCardsSection}>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 16 }}>
          All Sections
        </div>
        <div style={grid}>
          <Tile
            title="Notes"
            desc="50+ Subjects"
            icon={Icons.Notes}
            gradient="linear-gradient(135deg,#0d9488,#06b6d4)"
            onClick={() =>
              handleNavigation("/notes/view", {
                title: "Notes",
                desc: "50+ Subjects",
                iconType: "Notes",
                gradient: "linear-gradient(135deg,#0d9488,#06b6d4)",
                route: "/notes/view",
              })
            }
          />
          <Tile
            title="PYQs"
            desc="300+ Papers"
            icon={Icons.PYQs}
            gradient="linear-gradient(135deg,#4f46e5,#a855f7)"
            onClick={() =>
              handleNavigation("/pyqs/view", {
                title: "PYQs",
                desc: "300+ Papers",
                iconType: "PYQs",
                gradient: "linear-gradient(135deg,#4f46e5,#a855f7)",
                route: "/pyqs/view",
              })
            }
          />
          <Tile
            title="FAQs"
            desc="100+ Common Queries"
            icon={Icons.FAQs}
            gradient="linear-gradient(135deg,#ec4899,#f43f5e)"
            onClick={() =>
              handleNavigation("/faqs", {
                title: "FAQs",
                desc: "100+ Common Queries",
                iconType: "FAQs",
                gradient: "linear-gradient(135deg,#ec4899,#f43f5e)",
                route: "/faqs",
              })
            }
          />
          <Tile
            title="Admin Uploads"
            desc="Manage New Files"
            icon={Icons.Uploads}
            gradient="linear-gradient(135deg,#ef4444,#fb923c)"
            onClick={() =>
              handleNavigation("/admin/upload", {
                title: "Admin Uploads",
                desc: "Manage New Files",
                iconType: "Uploads",
                gradient: "linear-gradient(135deg,#ef4444,#fb923c)",
                route: "/admin/upload",
              })
            }
          />
        </div>
      </div>
    </section>
  );
}
