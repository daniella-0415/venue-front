import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// Fixed path: points directly to the src/firebase.js file relative to the Components folder
import { app } from '../firebase';
import './Login.css'; 

const auth = getAuth(app);

const Login = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoading(true); 

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const idToken = await firebaseUser.getIdToken();

            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: idToken,
                    email: email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to log in.');
            }

            alert("Logged in successfully!");
        } catch (error) {
            // Strips Firebase prefix error headers for user-friendly UI display
            const friendlyMessage = error.message.replace('Firebase: ', '');
            setLoginError(friendlyMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-wrapper">
                
                <div className="banner-side">
                    <div className="banner-overlay"></div>
                    <div className="banner-content">
                        <h1 className="banner-title">Welcome<br />Back</h1>
                        <p className="banner-subtitle">Log in to keep track of your events and updates.</p>
                    </div>
                    
                    <div className="floating-badge">
                        <div className="badge-avatar"></div>
                        <div className="badge-text">
                            <strong>Secure Access</strong>
                            <span>Your account dashboard is ready.</span>
                        </div>
                    </div>
                </div>

                <div className="form-side">
                    <div className="form-header">
                        <div className="avatar-circle"></div>
                        <div className="header-text-block">
                            <h3>Sign In</h3>
                            <p>Enter your details below</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="actual-form">
                        
                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-with-icon">
                                <span className="field-icon"></span>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-with-icon">
                                <span className="field-icon"></span>
                                <input 
                                    type="password" 
                                    placeholder="Enter your password"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {loginError && <p className="error-message-box">{loginError}</p>}
                        
                        <button type="submit" className="submit-action-btn" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <p className="redirect-footer">
                        Don't have an account?{' '}
                        <span className="highlight-link" onClick={onNavigate}>
                            Sign up
                        </span>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Login;
