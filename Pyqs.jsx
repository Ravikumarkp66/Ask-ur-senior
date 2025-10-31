import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Pyqs() {
    const [pyqs, setPyqs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPyqs = async () => {
            const q = query(collection(db, "resources"), where("category", "==", "pyq"));
            const querySnapshot = await getDocs(q);
            const pyqList = [];
            querySnapshot.forEach((doc) => {
                pyqList.push({ id: doc.id, ...doc.data() });
            });
            setPyqs(pyqList);
        };
        fetchPyqs();
    }, []);

    const handleBrowsePapers = () => {
        navigate("/pyqs/view");
    };

    return (
        <div style={{background: 'linear-gradient(135deg, #9333ea, #db2777)', padding: '32px', borderRadius: '24px', boxShadow: '0 25px 50px rgba(147, 51, 234, 0.25)', border: '1px solid rgba(196, 181, 253, 0.3)', cursor: 'pointer'}} onClick={handleBrowsePapers}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
                <div style={{fontSize: '3rem'}}>📝</div>
                <div style={{background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', color: 'white'}}>
                    {pyqs.length} Papers
                </div>
            </div>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '12px'}}>
                Previous Year Questions
            </h2>
            <p style={{color: '#f3e8ff', marginBottom: '24px'}}>
                Find and download previous year question papers by subject code and year.
            </p>
            <div style={{color: 'white', fontWeight: 'bold'}}>
                Browse Papers →
            </div>
        </div>
    );
}
