import './Login.css'
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const auth = getAuth(app);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firebaseUID: firebaseUser.uid,
                    email: email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to log in.');
            }

            alert("Logged in successfully!");
        } catch (error) {
            setLoginError(error.message);
        }
    };

    return ( 
        <div className="LoginDiv">
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                {loginError && <p className="error-message-box">{loginError}</p>}
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}
 
export default Login;