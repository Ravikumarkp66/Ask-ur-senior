import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const q = query(collection(db, "resources"), where("category", "==", "notes"));
      const querySnapshot = await getDocs(q);
      const notesList = [];
      querySnapshot.forEach((doc) => {
        notesList.push({ id: doc.id, ...doc.data() });
      });
      setNotes(notesList);
    };
    fetchNotes();
  }, []);

  const handleViewCollection = () => {
    navigate("/notes/view");
  };

  return (
    <div style={{background: 'linear-gradient(135deg, #2563eb, #4338ca)', padding: '32px', borderRadius: '24px', boxShadow: '0 25px 50px rgba(37, 99, 235, 0.25)', border: '1px solid rgba(96, 165, 250, 0.3)', cursor: 'pointer'}} onClick={handleViewCollection}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
        <div style={{fontSize: '3rem'}}>📚</div>
        <div style={{background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', color: 'white'}}>
          {notes.length} Files
        </div>
      </div>
      <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '12px'}}>
        Notes
      </h2>
      <p style={{color: '#dbeafe', marginBottom: '24px'}}>
        Access your study materials, class notes, and resources in one place.
      </p>
      <div style={{color: 'white', fontWeight: 'bold'}}>
        View Collection →
      </div>
    </div>
  );
}
