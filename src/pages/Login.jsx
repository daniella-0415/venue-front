import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom"; 
import { app } from "../firebase-front";
import "./Login.css";

const auth = getAuth(app);

function Login() {
  const navigate = useNavigate();
  const location = useLocation(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.registeredEmail) {
      setEmail(location.state.registeredEmail);
    }
  }, [location.state]);

  async function handleLogin(e) {
    e.preventDefault();

    setLoginError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      localStorage.setItem("venueflowToken", idToken);

      try {
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: idToken,
            email: firebaseUser.email,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem(
            "venueflowUser",
            JSON.stringify(data.user || firebaseUser)
          );
        } else {
          console.warn("Backend API login endpoint failed. Using fallback user context.");
          localStorage.setItem("venueflowUser", JSON.stringify(firebaseUser));
        }
      } catch (backendError) {
        console.error("Backend connection failed. Authenticated via client fallback:", backendError);
        localStorage.setItem("venueflowUser", JSON.stringify(firebaseUser));
      }

      navigate("/events");

    } catch (error) {
      console.error("Firebase Auth authentication error:", error);

      let message = error.message;

      if (message.includes("Firebase:")) {
        message = message.replace("Firebase: ", "");
      }

      setLoginError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page-container">
      <div className="login-wrapper">
        
        <div className="banner-side">
          <div className="banner-overlay"></div>
          <div className="banner-content">
            <h1 className="banner-title">
              Welcome
              <br />
              Back
            </h1>
            <p className="banner-subtitle">
              Log in to keep track of your events and bookings.
            </p>
          </div>
          <div className="floating-badge">
            <div className="badge-avatar"></div>
            <div className="badge-text">
              <strong>Secure Access</strong>
              <span>Your VenueFlow account is ready.</span>
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
            {/* EMAIL INPUT */}
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

            {loginError && (
              <p className="error-message-box">
                {loginError}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="submit-action-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="redirect-footer">
            Don't have an account?{" "}
            <span
              className="highlight-link"
              onClick={() => navigate("/signup")}
              style={{ cursor: "pointer" }}
            >
              Sign up
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
