import React, { useState } from 'react';
import { useBank } from '../hooks/useBank';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  UserPlus,
  Mail,
  Phone
} from 'lucide-react';

export default function LoginPage() {
  const { login, registerUser, theme, toggleTheme } = useBank();
  const [activeAuthMode, setActiveAuthMode] = useState('login'); // 'login' or 'register'

  // Login inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register inputs
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = login(username, password);
      if (!res.success) {
        setErrorMessage(res.message || 'Invalid username or password!');
      }
      setIsLoading(false);
    }, 250);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = registerUser(
        regUsername,
        regPassword,
        regFullName,
        regEmail,
        regPhone
      );
      if (!res.success) {
        setErrorMessage(res.message || 'Registration failed!');
      }
      setIsLoading(false);
    }, 300);
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('1234');
    setErrorMessage('');
  };

  return (
    <div style={styles.page}>
      {/* Top Bar with Theme Toggle */}
      <div style={styles.topBar}>
        <div style={styles.topBrand}>
          <span style={{ fontSize: '20px' }}>🏦</span>
          <span style={styles.topBrandText}>MyBank Portal</span>
        </div>
        <button
          onClick={toggleTheme}
          style={styles.themeBtn}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div style={styles.cardContainer} className="animate-scale-in">
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.logoWrap}>
              <span style={{ fontSize: '32px' }}>🏦</span>
            </div>
            <h1 style={styles.title}>MyBank</h1>
            <p style={styles.subtitle}>Secure Online Banking Simulation</p>
          </div>

          {/* Mode Tabs */}
          <div style={styles.tabBar}>
            <button
              type="button"
              style={{
                ...styles.modeTab,
                ...(activeAuthMode === 'login' ? styles.activeModeTab : {})
              }}
              onClick={() => {
                setActiveAuthMode('login');
                setErrorMessage('');
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              style={{
                ...styles.modeTab,
                ...(activeAuthMode === 'register' ? styles.activeModeTab : {})
              }}
              onClick={() => {
                setActiveAuthMode('register');
                setErrorMessage('');
              }}
            >
              Register New Account
            </button>
          </div>

          {errorMessage && (
            <div style={styles.errorBox} className="animate-slide-up">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          {activeAuthMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={styles.form}>
              <div className="form-group">
                <label className="form-label" htmlFor="loginUsername">
                  <span>Username</span>
                </label>
                <div style={styles.inputWrapper}>
                  <User size={18} color="var(--text-muted)" style={styles.inputIcon} />
                  <input
                    type="text"
                    id="loginUsername"
                    placeholder="Enter username (admin)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.iconInput}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="loginPassword">
                  <span>Password</span>
                </label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} color="var(--text-muted)" style={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="loginPassword"
                    placeholder="Enter password (1234)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...styles.iconInput, paddingRight: '2.5rem' }}
                    required
                  />
                  <button
                    type="button"
                    style={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={isLoading}
                style={{ marginTop: '0.5rem' }}
              >
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Banking Portal'}</span>
                <ArrowRight size={18} />
              </button>

              {/* Demo Hint & Quick Fill */}
              <div style={styles.demoCard}>
                <div style={styles.demoHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <KeyRound size={15} color="var(--primary)" />
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                      Demo Account
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickFill}
                    style={styles.quickFillBtn}
                  >
                    <Sparkles size={12} />
                    <span>Auto-fill</span>
                  </button>
                </div>
                <p style={styles.demoText}>
                  Username: <code>admin</code> &nbsp;|&nbsp; Password: <code>1234</code>
                </p>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} style={styles.form}>
              <div className="form-group">
                <label className="form-label" htmlFor="regFullName">
                  <span>Full Legal Name</span>
                </label>
                <div style={styles.inputWrapper}>
                  <User size={18} color="var(--text-muted)" style={styles.inputIcon} />
                  <input
                    type="text"
                    id="regFullName"
                    placeholder="e.g. John Doe"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    style={styles.iconInput}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regUsername">
                  <span>Desired Username</span>
                </label>
                <div style={styles.inputWrapper}>
                  <UserPlus size={18} color="var(--text-muted)" style={styles.inputIcon} />
                  <input
                    type="text"
                    id="regUsername"
                    placeholder="Choose a username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    style={styles.iconInput}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regPassword">
                  <span>Password</span>
                </label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} color="var(--text-muted)" style={styles.inputIcon} />
                  <input
                    type="password"
                    id="regPassword"
                    placeholder="Create a strong password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={styles.iconInput}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regEmail">
                  <span>Email (Optional)</span>
                </label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} color="var(--text-muted)" style={styles.inputIcon} />
                  <input
                    type="email"
                    id="regEmail"
                    placeholder="john@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={styles.iconInput}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regPhone">
                  <span>Phone Number (Optional)</span>
                </label>
                <div style={styles.inputWrapper}>
                  <Phone size={18} color="var(--text-muted)" style={styles.inputIcon} />
                  <input
                    type="tel"
                    id="regPhone"
                    placeholder="+91 98765 00000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={styles.iconInput}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={isLoading}
                style={{ marginTop: '0.5rem' }}
              >
                <span>{isLoading ? 'Creating Account...' : 'Open Account Instantly'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* Security Assurance */}
          <div style={styles.securityRow}>
            <ShieldCheck size={14} color="var(--credit)" />
            <span>Encrypted Frontend Simulation • Data Stored in LocalStorage</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-app)',
    backgroundImage: `radial-gradient(var(--border-subtle) 1px, transparent 1px)`,
    backgroundSize: '24px 24px'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 2rem'
  },
  topBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 700,
    color: 'var(--primary)',
    fontSize: '1rem'
  },
  topBrandText: {
    fontWeight: 800,
    letterSpacing: '-0.02em'
  },
  themeBtn: {
    width: '38px',
    height: '38px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-xs)'
  },
  cardContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 1.5rem 3rem'
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-xl)',
    padding: '2.2rem 2rem',
    textAlign: 'center'
  },
  header: {
    marginBottom: '1.25rem'
  },
  logoWrap: {
    width: '60px',
    height: '60px',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--primary-light)',
    border: '1px solid var(--primary-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 10px'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: 'var(--primary)',
    marginBottom: '2px'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)'
  },
  tabBar: {
    display: 'flex',
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-md)',
    padding: '4px',
    marginBottom: '1.25rem',
    border: '1px solid var(--border-subtle)'
  },
  modeTab: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  activeModeTab: {
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--primary)',
    fontWeight: 700,
    boxShadow: 'var(--shadow-xs)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none'
  },
  iconInput: {
    paddingLeft: '2.4rem'
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center'
  },
  errorBox: {
    padding: '10px 14px',
    backgroundColor: 'var(--debit-light)',
    border: '1px solid var(--debit-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--debit)',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '1rem',
    textAlign: 'center'
  },
  demoCard: {
    backgroundColor: 'var(--bg-muted)',
    border: '1px dashed var(--border-strong)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    marginTop: '1.25rem',
    textAlign: 'left'
  },
  demoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  quickFillBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    border: '1px solid var(--primary-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.72rem',
    fontWeight: 700,
    cursor: 'pointer'
  },
  demoText: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  securityRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '1.5rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  }
};
