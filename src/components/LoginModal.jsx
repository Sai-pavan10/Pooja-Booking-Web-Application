import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { showToast } from "./toast-service";
import './loginmodal.css';

export default function LoginModal({ onClose, redirectAfterLogin }) {
  const { login, register, resetPassword } = useAuth();
  const [tab, setTab] = useState("login");
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    fullName: "", email: "", mobile: "", password: "", confirm: ""
  });
  const [resetEmail, setResetEmail] = useState("");

  const setL = field => e => setLoginForm(f => ({ ...f, [field]: e.target.value }));
  const setS = field => e => setSignupForm(f => ({ ...f, [field]: e.target.value }));

  function validateSignup() {
    const { fullName, email, mobile, password, confirm } = signupForm;
    if (!fullName.trim()) return "Full name is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address.";
    if (!/^\d{10}$/.test(mobile)) return "Enter a valid 10-digit mobile number.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      showToast("Welcome back! You're now logged in.", "success");
      setLoading(false);
      onClose();
      if (redirectAfterLogin) {
        window.history.pushState({}, '', redirectAfterLogin);
        window.dispatchEvent(new Event('app:navigate'));
      }
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    const err = validateSignup();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await register(signupForm.fullName, signupForm.email, signupForm.mobile, signupForm.password);
      showToast(`Welcome, ${signupForm.fullName}! Account created.`, "success");
      setLoading(false);
      onClose();
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError("This email is already registered.");
      else setError(err.message || "Unable to create account. Please try again.");
    } finally { setLoading(false); }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
      showToast("Password reset email sent!", "info");
    } catch {
      setError("Could not send reset email. Check the address.");
    } finally { setLoading(false); }
  }

  return (
    <div className="lm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="lm-card">

        {/* Header */}
        <div className="lm-header">
          <div className="lm-diya"></div>
          <h2 className="lm-title">
            {showReset ? "Reset Password" : tab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="lm-sub">
            {showReset ? "Enter your email to receive a reset link"
              : tab === "login" ? "Login to manage your pooja bookings"
              : "Join us to book sacred pooja services"}
          </p>
          <button className="lm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Tabs */}
        {!showReset && (
          <div className="lm-tabs">
            <button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setError(""); }}>
              Login
            </button>
            <button className={tab === "signup" ? "active" : ""} onClick={() => { setTab("signup"); setError(""); }}>
              Sign Up
            </button>
          </div>
        )}

        {error && <div className="lm-error"><span></span> {error}</div>}

        {/* Reset Password Form */}
        {showReset && (
          <div className="lm-body">
            {resetSent ? (
              <div className="lm-reset-success">
                <div className="lm-reset-icon"></div>
                <p>Reset link sent to <strong>{resetEmail}</strong>. Check your inbox.</p>
                <button className="lm-btn" onClick={() => { setShowReset(false); setResetSent(false); }}>
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset}>
                <div className="lm-field">
                  <label>Email Address</label>
                  <input type="email" placeholder="your@email.com" value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)} required />
                </div>
                <button type="submit" className="lm-btn" disabled={loading}>
                  {loading ? <span className="lm-spinner" /> : "Send Reset Link"}
                </button>
                <button type="button" className="lm-link-btn" onClick={() => setShowReset(false)}>
                  ← Back to Login
                </button>
              </form>
            )}
          </div>
        )}

        {/* Login Form */}
        {!showReset && tab === "login" && (
          <div className="lm-body">
            <form onSubmit={handleLogin}>
              <div className="lm-field">
                <label>Email Address</label>
                <input type="email" placeholder="your@email.com" onChange={setL("email")}
                  value={loginForm.email} required />
              </div>
              <div className="lm-field">
                <label>Password</label>
                <input type="password" placeholder="Enter your password" onChange={setL("password")}
                  value={loginForm.password} required />
              </div>
              <button type="button" className="lm-forgot" onClick={() => { setShowReset(true); setError(""); }}>
                Forgot Password?
              </button>
              <button type="submit" className="lm-btn" disabled={loading}>
                {loading ? <span className="lm-spinner" /> : "Login"}
              </button>
            </form>
            <p className="lm-switch">
              Don't have an account?{" "}
              <button onClick={() => { setTab("signup"); setError(""); }}>Create Account</button>
            </p>
          </div>
        )}

        {/* Signup Form */}
        {!showReset && tab === "signup" && (
          <div className="lm-body">
            <form onSubmit={handleSignup}>
              <div className="lm-field">
                <label>Full Name <span>*</span></label>
                <input type="text" placeholder="Your full name" onChange={setS("fullName")}
                  value={signupForm.fullName} required />
              </div>
              <div className="lm-field">
                <label>Email Address <span>*</span></label>
                <input type="email" placeholder="your@email.com" onChange={setS("email")}
                  value={signupForm.email} required />
              </div>
              <div className="lm-field">
                <label>Mobile Number <span>*</span></label>
                <input type="tel" placeholder="10-digit mobile" onChange={setS("mobile")}
                  value={signupForm.mobile} maxLength={10} required />
              </div>
              <div className="lm-field">
                <label>Password <span>*</span></label>
                <input type="password" placeholder="Min 8 characters" onChange={setS("password")}
                  value={signupForm.password} required />
              </div>
              <div className="lm-field">
                <label>Confirm Password <span>*</span></label>
                <input type="password" placeholder="Repeat your password" onChange={setS("confirm")}
                  value={signupForm.confirm} required />
              </div>
              <button type="submit" className="lm-btn" disabled={loading}>
                {loading ? <span className="lm-spinner" /> : "Create Account"}
              </button>
            </form>
            <p className="lm-switch">
              Already have an account?{" "}
              <button onClick={() => { setTab("login"); setError(""); }}>Login</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
