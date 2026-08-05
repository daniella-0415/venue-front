import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';
import "./Signup.css"; 


function Signup() {
    const [name, setName] = useState(''); 
    const [surname, setSurname] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer'); 
    const [loginError, setLoginError] = useState('');

    const auth = getAuth(app);

    const HandleSignup = async (e) => {
        e.preventDefault();
        setLoginError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firebaseUID: firebaseUser.uid, 
                    name: `${name} ${surname}`.trim(),
                    email: email,
                    role: role
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to sync account profile to database.');
            }

            alert("Account registered and synchronized with database successfully!");
            
            setName('');
            setSurname('');
            setEmail('');
            setPassword('');
        }
        catch (error) {
            setLoginError(error.message);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="header">
                    <h2 className="title">Welcome to venue flow</h2>
                    <p className="subtitle">Your next unforgettable event starts here<br />sign in to begin</p>
                </div>

                <form onSubmit={HandleSignup} className="form">
                    <div className="formGroup">
                        <label className="label">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="input"
                        />
                    </div>

                    <div className="formGroup">
                        <label className="label">Surname</label>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                            className="input"
                        />
                    </div>

                    <div className="formGroup">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input"
                        />
                    </div>

                    <div className="formGroup">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                        />
                    </div>

                    <div className="formGroup">
                        <label className="label">Account Role</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            className="input"
                        >
                            <option value="Customer">Customer</option>
                            <option value="Venue Manager">Venue Manager</option>
                            <option value="Administrator">Administrator</option>
                        </select>
                    </div>

                    {loginError && <p className="error">{loginError}</p>}

                    <button type="submit" className="button">Sign Up</button>
                </form>

                <p className="footerText">
                    Already have an account? <span className="link">Log In</span>
                </p>
            </div>
        </div>
    );
}

export default Signup;
