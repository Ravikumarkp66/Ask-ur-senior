import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { auth } from "../firebase";
import Sidebar from "./Sidebar";
import { useTheme } from "../context/ThemeContext";

function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
}

export default function FAQs() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [openIds, setOpenIds] = useState(new Set());
    const { darkMode } = useTheme();

    const toggleOpen = (id) => {
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "faqs"));
                const faqsList = [];
                querySnapshot.forEach((doc) => {
                    faqsList.push({ id: doc.id, ...doc.data() });
                });
                setFaqs(faqsList);
            } catch (error) {
                console.error("Error fetching FAQs:", error);
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

        fetchFaqs();
        checkAdmin();
    }, []);

    const handleAddFAQ = async () => {
        if (!newQuestion || !newAnswer) {
            return alert("Please fill in both question and answer!");
        }

        try {
            await addDoc(collection(db, "faqs"), {
                question: newQuestion,
                answer: newAnswer,
                createdAt: new Date()
            });
            alert("FAQ added successfully!");
            setNewQuestion("");
            setNewAnswer("");
            setShowAddForm(false);
            
            // Refresh FAQs
            const querySnapshot = await getDocs(collection(db, "faqs"));
            const faqsList = [];
            querySnapshot.forEach((doc) => {
                faqsList.push({ id: doc.id, ...doc.data() });
            });
            setFaqs(faqsList);
        } catch (error) {
            alert("Error adding FAQ: " + error.message);
        }
    };

    const bgColor = darkMode ? '#0f0f0f' : '#ffffff';
    const textSubtle = darkMode ? '#94a3b8' : '#64748b';
    const panelBg = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
    const panelBorder = darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)';
    const itemHeaderBg = darkMode ? '#0b0b0b' : '#f3f4f6';
    const itemDivider = darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)';
    const answerBg = darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
    const answerText = darkMode ? '#cbd5e1' : '#334155';

    return (
        <div style={{minHeight: '100vh', display: 'flex', background: bgColor}}>
            <Sidebar onLogout={handleLogout} />
            
            <div style={{flex: 1, overflowY: 'auto'}}>
                <div style={{maxWidth: '800px', margin: '0 auto', padding: '40px 20px'}}>
                <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px', background: 'linear-gradient(135deg, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center'}}>
                    ❓ Frequently Asked Questions
                </h1>

                {isAdmin && (
                    <div style={{marginBottom: '30px', textAlign: 'center'}}>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            style={{
                                background: darkMode ? '#000' : '#111827',
                                color: '#fff',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.15)',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            {showAddForm ? '✖️ Cancel' : '➕ Add New FAQ'}
                        </button>
                    </div>
                )}

                {showAddForm && isAdmin && (
                    <div style={{background: panelBg, padding: '24px', borderRadius: '16px', marginBottom: '30px', border: panelBorder}}>
                        <h3 style={{marginBottom: '15px', color: '#60a5fa'}}>Add New FAQ</h3>
                        <input
                            type="text"
                            placeholder="Question"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            style={{width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: darkMode ? '2px solid rgba(255,255,255,0.2)' : '2px solid rgba(0,0,0,0.12)', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? 'white' : '#111827', fontSize: '16px'}}
                        />
                        <textarea
                            placeholder="Answer"
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            rows={4}
                            style={{width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: darkMode ? '2px solid rgba(255,255,255,0.2)' : '2px solid rgba(0,0,0,0.12)', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? 'white' : '#111827', fontSize: '16px', resize: 'vertical'}}
                        />
                        <button
                            onClick={handleAddFAQ}
                            style={{
                                width: '100%',
                                background: darkMode ? '#000' : '#111827',
                                color: '#fff',
                                padding: '12px',
                                borderRadius: '10px',
                                border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.15)',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Submit FAQ
                        </button>
                    </div>
                )}

                {loading ? (
                    <p style={{textAlign: 'center', color: textSubtle}}>Loading FAQs...</p>
                ) : faqs.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '60px 20px', background: panelBg, borderRadius: '20px'}}>
                        <div style={{fontSize: '4rem', marginBottom: '20px'}}>💡</div>
                        <p style={{color: textSubtle, fontSize: '18px'}}>No FAQs available yet.</p>
                    </div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        {faqs.map((faq, index) => {
                            const open = openIds.has(faq.id);
                            return (
                                <div key={faq.id} style={{borderBottom: itemDivider}}>
                                    <button
                                        onClick={() => toggleOpen(faq.id)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: itemHeaderBg,
                                            color: darkMode ? '#fff' : '#111827',
                                            padding: '18px 16px',
                                            border: 'none',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '18px',
                                            fontWeight: 600
                                        }}
                                    >
                                        <span style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                                            <span style={{opacity: 0.8}}>Q{index + 1}.</span>
                                            {faq.question}
                                        </span>
                                        <span style={{fontSize: '22px', lineHeight: 1}}>{open ? '−' : '+'}</span>
                                    </button>
                                    {open && (
                                        <div style={{background: answerBg, color: answerText, padding: '0 16px 18px 16px', fontSize: '16px', lineHeight: 1.7}}>
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}

