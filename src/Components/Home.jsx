import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import "./Home.css";

function Home() {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error.message);
        }
    };

    return (
        <div className="clean-home-container">
            <div className="welcome-message-box">
                <h1 className="welcome-title">Welcome to venue flow</h1>
                <p className="welcome-subtitle">
                    You have successfully logged in as <span className="highlight-email">{userEmail}</span>
                </p>
                <button onClick={handleLogOut} className="clean-logout-btn">
                    Log Out Account
                </button>
            </div>
        </div>
    );
}

export default Home;
