import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase';
import "./Signup.css"; 

const auth = getAuth(app);

function Signup({ onNavigate }) {
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

            const idToken = await firebaseUser.getIdToken();

            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: idToken,
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
            
            // Clean out old strings
            setFullName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            
            onNavigate();
        }
        catch (error) {
            setLoginError(error.message);
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
                            <h3>Join Us</h3>
                            <p>It's quick and easy</p>
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
                            <label>Email</label>
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
                                    placeholder="Create your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <div className="input-with-icon">
                                <span className="field-icon"></span>
                                <input
                                    type="password"
                                    placeholder="Create your password"
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

                    <p className="redirect-footer">
                        Already have an account?{' '}
                        <span className="highlight-link" onClick={onNavigate} style={{ cursor: 'pointer' }}>
                            Log in
                        </span>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Signup;
