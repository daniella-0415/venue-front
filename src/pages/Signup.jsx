import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase-front';
import "./Signup.css"; 

const auth = getAuth(app);

function Signup() {
    const navigate = useNavigate(); 

    const [fullName, setFullName] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const HandleSignup = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (password !== confirmPassword) {
            setLoginError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firebaseUID: firebaseUser.uid, 
                    name: fullName.trim(),
                    email: email,
                    role: "Customer" 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to sync account profile to database.');
            }

            alert("Account registered and synchronized successfully!");
            
            setFullName('');
            setPassword('');
            setConfirmPassword('');
            
            navigate('/login', { state: { registeredEmail: email } }); 
            setEmail('');
        }
        catch (error) {
            const friendlyMessage = error.message.replace('Firebase: ', '');
            setLoginError(friendlyMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-page-container">
            <div className="signup-wrapper">
                
                <div className="banner-side">
                    <div className="banner-overlay"></div>
                    <div className="banner-content">
                        <h1 className="banner-title">Create Your<br />Account</h1>
                        <p className="banner-subtitle">Join us and discover amazing events tailored for you.</p>
                    </div>
                    
                    <div className="floating-badge">
                        <div className="badge-avatar"></div>
                        <div className="badge-text">
                            <strong>Be part of the experience.</strong>
                            <span>Create your account and never miss out.</span>
                        </div>
                    </div>
                </div>

                <div className="form-side">
                    <div className="form-header">
                        <div className="avatar-circle"></div>
                        <div className="header-text-block">
                            <h3>Sign Up</h3>
                            <p>Enter your details to register</p>
                        </div>
                    </div>

                    <form onSubmit={HandleSignup} className="actual-form">
                        
                        <div className="input-group">
                            <label>Full Name</label>
                            <div className="input-with-icon">
                                <span className="field-icon"></span>
                                <input 
                                    type="text" 
                                    placeholder="Enter your full name"
                                    value={fullName} 
                                    onChange={(e) => setFullName(e.target.value)} 
                                    required 
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a password"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <div className="input-with-icon">
                                <span className="field-icon"></span>
                                <input 
                                    type="password" 
                                    placeholder="Confirm your password"
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required 
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {loginError && <p className="error-message-box">{loginError}</p>}
                        
                        <button type="submit" className="submit-action-btn" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    {/* REDIRECT ANCHOR LINK */}
                    <p className="redirect-footer">
                        Already have an account?{' '}
                        <span className="highlight-link" onClick={() => navigate('/login')} style={{ cursor: "pointer" }}>
                            Sign in
                        </span>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Signup;
