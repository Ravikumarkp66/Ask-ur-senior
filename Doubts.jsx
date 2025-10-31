import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, query, where, updateDoc, doc } from "firebase/firestore";
import { auth } from "../firebase";
import Sidebar from "./Sidebar";

function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
}

export default function Doubts() {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newDoubt, setNewDoubt] = useState("");
    const [replyText, setReplyText] = useState("");
    const [editingDoubt, setEditingDoubt] = useState(null);
    const [editDoubtText, setEditDoubtText] = useState("");
    const [editingReply, setEditingReply] = useState(null);
    const [editReplyText, setEditReplyText] = useState("");

    useEffect(() => {
        const fetchDoubts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "doubts"));
                const doubtsList = [];
                querySnapshot.forEach((doc) => {
                    doubtsList.push({ id: doc.id, ...doc.data() });
                });
                setDoubts(doubtsList);
            } catch (error) {
                console.error("Error fetching doubts:", error);
            } finally {
                setLoading(false);
            }
        };

        const checkAdmin = () => {
            const user = auth.currentUser;
            const adminEmails = ['mreducator4566@gmail.com', 'ravikumarkp4566@gmail.com'];
            if (user && adminEmails.includes(user.email)) {
                setIsAdmin(true);
            }
        };

        fetchDoubts();
        checkAdmin();
    }, []);

    const handleSubmitDoubt = async () => {
        if (!newDoubt.trim()) {
            return alert("Please enter your doubt!");
        }

        try {
            const user = auth.currentUser;
            await addDoc(collection(db, "doubts"), {
                doubt: newDoubt,
                askedBy: user ? user.email : "Anonymous",
                reply: "",
                repliedBy: "",
                status: "pending",
                createdAt: new Date()
            });
            alert("Doubt submitted! Admin will reply soon.");
            setNewDoubt("");
            setShowForm(false);

            // Refresh doubts
            const querySnapshot = await getDocs(collection(db, "doubts"));
            const doubtsList = [];
            querySnapshot.forEach((doc) => {
                doubtsList.push({ id: doc.id, ...doc.data() });
            });
            setDoubts(doubtsList);
        } catch (error) {
            alert("Error submitting doubt: " + error.message);
        }
    };

    const handleReply = async (doubtId) => {
        if (!replyText.trim()) {
            return alert("Please enter a reply!");
        }

        try {
            const user = auth.currentUser;
            const doubtRef = doc(db, "doubts", doubtId);
            await updateDoc(doubtRef, {
                reply: replyText,
                repliedBy: user ? user.email : "Admin",
                status: "replied"
            });
            alert("Reply posted!");
            setReplyText("");

            // Refresh doubts
            const querySnapshot = await getDocs(collection(db, "doubts"));
            const doubtsList = [];
            querySnapshot.forEach((doc) => {
                doubtsList.push({ id: doc.id, ...doc.data() });
            });
            setDoubts(doubtsList);
        } catch (error) {
            alert("Error posting reply: " + error.message);
        }
    };

    const handleEditDoubt = async (doubtId) => {
        if (!editDoubtText.trim()) {
            return alert("Please enter doubt text!");
        }

        const doubt = doubts.find(d => d.id === doubtId);
        if (!doubt || !auth.currentUser || auth.currentUser.email !== doubt.askedBy) {
            alert("You don't have permission to edit this doubt!");
            return;
        }

        try {
            const doubtRef = doc(db, "doubts", doubtId);
            await updateDoc(doubtRef, {
                doubt: editDoubtText
            });
            alert("Doubt updated!");
            setEditingDoubt(null);
            setEditDoubtText("");

            // Refresh doubts
            const querySnapshot = await getDocs(collection(db, "doubts"));
            const doubtsList = [];
            querySnapshot.forEach((doc) => {
                doubtsList.push({ id: doc.id, ...doc.data() });
            });
            setDoubts(doubtsList);
        } catch (error) {
            alert("Error updating doubt: " + error.message);
        }
    };

    const handleEditReply = async (doubtId) => {
        if (!editReplyText.trim()) {
            return alert("Please enter reply text!");
        }

        try {
            const doubtRef = doc(db, "doubts", doubtId);
            await updateDoc(doubtRef, {
                reply: editReplyText
            });
            alert("Reply updated!");
            setEditingReply(null);
            setEditReplyText("");

            // Refresh doubts
            const querySnapshot = await getDocs(collection(db, "doubts"));
            const doubtsList = [];
            querySnapshot.forEach((doc) => {
                doubtsList.push({ id: doc.id, ...doc.data() });
            });
            setDoubts(doubtsList);
        } catch (error) {
            alert("Error updating reply: " + error.message);
        }
    };

    const theme = localStorage.getItem('theme') || 'dark';
    const bgColor = theme === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: bgColor }}>
            <Sidebar onLogout={handleLogout} />

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
                        💬 Student Doubts
                    </h1>

                    <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            {showForm ? '✖️ Cancel' : '➕ Ask a Doubt'}
                        </button>
                    </div>

                    {showForm && !isAdmin && (
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ marginBottom: '15px', color: '#60a5fa' }}>Ask Your Doubt</h3>
                            <textarea
                                placeholder="Type your question here..."
                                value={newDoubt}
                                onChange={(e) => setNewDoubt(e.target.value)}
                                rows={4}
                                style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '16px', resize: 'vertical' }}
                            />
                            <button
                                onClick={handleSubmitDoubt}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                                    color: 'white',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                Submit Doubt
                            </button>
                        </div>
                    )}

                    {isAdmin && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '2px solid rgba(239,68,68,0.3)', textAlign: 'center' }}>
                            <p style={{ color: '#fca5a5', fontWeight: 'bold', fontSize: '18px' }}>
                                ⚠️ Admin Mode: You can only reply to doubts, not ask them.
                            </p>
                        </div>
                    )}

                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading doubts...</p>
                    ) : doubts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤔</div>
                            <p style={{ color: '#94a3b8', fontSize: '18px' }}>{isAdmin ? 'No doubts available.' : 'No doubts yet. Be the first to ask!'}</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {doubts.map((doubt) => (
                                <div
                                    key={doubt.id}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(10px)',
                                        padding: '24px',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '5px' }}>
                                                Asked by: <span style={{ color: '#60a5fa' }}>{doubt.askedBy}</span>
                                            </p>
                                            {editingDoubt === doubt.id ? (
                                                <textarea
                                                    value={editDoubtText}
                                                    onChange={(e) => setEditDoubtText(e.target.value)}
                                                    rows={3}
                                                    style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '16px', resize: 'vertical' }}
                                                />
                                            ) : (
                                                <p style={{ color: '#f1f5f9', fontSize: '16px', lineHeight: '1.6' }}>
                                                    {doubt.doubt}
                                                </p>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                                            <span style={{
                                                background: doubt.status === 'replied' ? 'linear-gradient(135deg, #22c55e, #059669)' : 'linear-gradient(135deg, #f59e0b, #f97316)',
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {doubt.status === 'replied' ? '✓ Replied' : '⏳ Pending'}
                                            </span>
                                            {!isAdmin && auth.currentUser && auth.currentUser.email === doubt.askedBy && (
                                                <button
                                                    onClick={() => {
                                                        setEditingDoubt(doubt.id);
                                                        setEditDoubtText(doubt.doubt);
                                                    }}
                                                    style={{
                                                        background: 'rgba(59, 130, 246, 0.2)',
                                                        color: '#60a5fa',
                                                        padding: '6px 12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #60a5fa',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    ✏️
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {editingDoubt === doubt.id && (
                                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleEditDoubt(doubt.id)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #22c55e, #059669)',
                                                    color: 'white',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                ✓ Save
                                            </button>
                                            <button
                                                onClick={() => setEditingDoubt(null)}
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.2)',
                                                    color: '#fca5a5',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #fca5a5',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                ✖️ Cancel
                                            </button>
                                        </div>
                                    )}

                                    {doubt.status === 'replied' && doubt.reply && (
                                        <div style={{
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            padding: '15px',
                                            borderRadius: '10px',
                                            marginTop: '15px',
                                            borderLeft: '4px solid #3b82f6'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                                                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                                                    Admin reply:
                                                </p>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => {
                                                            setEditingReply(doubt.id);
                                                            setEditReplyText(doubt.reply);
                                                        }}
                                                        style={{
                                                            background: 'rgba(59, 130, 246, 0.2)',
                                                            color: '#60a5fa',
                                                            padding: '4px 8px',
                                                            borderRadius: '6px',
                                                            border: '1px solid #60a5fa',
                                                            cursor: 'pointer',
                                                            fontSize: '11px'
                                                        }}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                )}
                                            </div>
                                            {editingReply === doubt.id ? (
                                                <div>
                                                    <textarea
                                                        value={editReplyText}
                                                        onChange={(e) => setEditReplyText(e.target.value)}
                                                        rows={3}
                                                        style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', resize: 'vertical' }}
                                                    />
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button
                                                            onClick={() => handleEditReply(doubt.id)}
                                                            style={{
                                                                background: 'linear-gradient(135deg, #22c55e, #059669)',
                                                                color: 'white',
                                                                padding: '6px 12px',
                                                                borderRadius: '6px',
                                                                border: 'none',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            ✓ Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingReply(null)}
                                                            style={{
                                                                background: 'rgba(239, 68, 68, 0.2)',
                                                                color: '#fca5a5',
                                                                padding: '6px 12px',
                                                                borderRadius: '6px',
                                                                border: '1px solid #fca5a5',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            ✖️ Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p style={{ color: '#e0e7ff', fontSize: '15px' }}>
                                                    {doubt.reply}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {isAdmin && doubt.status === 'pending' && (
                                        <div style={{ marginTop: '15px' }}>
                                            <textarea
                                                placeholder="Type your reply..."
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                rows={3}
                                                style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', resize: 'vertical' }}
                                            />
                                            <button
                                                onClick={() => handleReply(doubt.id)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #22c55e, #059669)',
                                                    color: 'white',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

