import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { showToast } from "./toast-service";
import { useLanguage } from "../i18n";
import './loginmodal.css';

export default function LoginModal({ onClose, redirectAfterLogin }) {
  const { login, register, resetPassword } = useAuth();
  const { content } = useLanguage();
  const auth = content.auth;
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
    if (!fullName.trim()) return auth.fullNameRequired || 'Full name is required.';
    if (!/\S+@\S+\.\S+/.test(email)) return auth.invalidEmail;
    if (!/^\d{10}$/.test(mobile)) return auth.mobileInvalid || 'Enter a valid 10-digit mobile number.';
    if (password.length < 8) return auth.passwordMin;
    if (password !== confirm) return auth.passwordMismatch;
    return null;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      showToast(auth.welcomeBack, "success");
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
      showToast(auth.welcomeCreated.replace('{name}', signupForm.fullName), "success");
      setLoading(false);
      onClose();
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError(auth.emailInUse);
      else setError(err.message || auth.invalidCredentials);
    } finally { setLoading(false); }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
      showToast(auth.resetEmailSent, "info");
    } catch {
      setError(auth.resetError);
    } finally { setLoading(false); }
  }

  return (
    <div className="lm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="lm-card">

        {/* Header */}
        <div className="lm-header">
          <div className="lm-diya"></div>
          <h2 className="lm-title">
            {showReset ? auth.resetPassword : tab === "login" ? auth.welcomeBack : auth.createAccount}
          </h2>
          <p className="lm-sub">
            {showReset ? auth.resetSubtitle : tab === "login" ? auth.loginSubtitle : auth.signupSubtitle}
          </p>
          <button className="lm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Tabs */}
        {!showReset && (
          <div className="lm-tabs">
            <button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setError(""); }}>
              {auth.loginBtn}
            </button>
            <button className={tab === "signup" ? "active" : ""} onClick={() => { setTab("signup"); setError(""); }}>
              {auth.createAccount}
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
                <p>{auth.resetSentNotice.replace('{email}', resetEmail)}</p>
                <button className="lm-btn" onClick={() => { setShowReset(false); setResetSent(false); }}>
                  {auth.backToLogin}
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset}>
                <div className="lm-field">
                  <label>{auth.emailLabel}</label>
                  <input type="email" placeholder="your@email.com" value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)} required />
                </div>
                <button type="submit" className="lm-btn" disabled={loading}>
                  {loading ? <span className="lm-spinner" /> : auth.sendResetLink}
                </button>
                <button type="button" className="lm-link-btn" onClick={() => setShowReset(false)}>
                  ← {auth.backToLogin}
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
                <label>{auth.emailLabel}</label>
                <input type="email" placeholder="your@email.com" onChange={setL("email")}
                  value={loginForm.email} required />
              </div>
              <div className="lm-field">
                <label>{auth.passwordLabel}</label>
                <input type="password" placeholder="Enter your password" onChange={setL("password")}
                  value={loginForm.password} required />
              </div>
              <button type="button" className="lm-forgot" onClick={() => { setShowReset(true); setError(""); }}>
                {auth.forgotPassword}
              </button>
              <button type="submit" className="lm-btn" disabled={loading}>
                {loading ? <span className="lm-spinner" /> : auth.loginBtn}
              </button>
            </form>
            <p className="lm-switch">
              {auth.noAccount}{" "}
              <button onClick={() => { setTab("signup"); setError(""); }}>{auth.createAccount}</button>
            </p>
          </div>
        )}

        {/* Signup Form */}
        {!showReset && tab === "signup" && (
          <div className="lm-body">
            <form onSubmit={handleSignup}>
              <div className="lm-field">
                <label>{auth.fullNameLabel} <span>*</span></label>
                <input type="text" placeholder="Your full name" onChange={setS("fullName")}
                  value={signupForm.fullName} required />
              </div>
              <div className="lm-field">
                <label>{auth.emailLabel} <span>*</span></label>
                <input type="email" placeholder="your@email.com" onChange={setS("email")}
                  value={signupForm.email} required />
              </div>
              <div className="lm-field">
                <label>{auth.mobileLabel} <span>*</span></label>
                <input type="tel" placeholder="10-digit mobile" onChange={setS("mobile")}
                  value={signupForm.mobile} maxLength={10} required />
              </div>
              <div className="lm-field">
                <label>{auth.passwordLabel} <span>*</span></label>
                <input type="password" placeholder="Min 8 characters" onChange={setS("password")}
                  value={signupForm.password} required />
              </div>
              <div className="lm-field">
                <label>{auth.confirmPasswordLabel} <span>*</span></label>
                <input type="password" placeholder="Repeat your password" onChange={setS("confirm")}
                  value={signupForm.confirm} required />
              </div>
              <button type="submit" className="lm-btn" disabled={loading}>
                {loading ? <span className="lm-spinner" /> : auth.signupBtn}
              </button>
            </form>
            <p className="lm-switch">
              {auth.alreadyHaveAccount}{" "}
              <button onClick={() => { setTab("login"); setError(""); }}>{auth.loginBtn}</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
