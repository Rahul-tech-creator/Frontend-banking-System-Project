import React, { useState, useEffect } from 'react';
import { useBank } from '../hooks/useBank';
import {
  Sun,
  Moon,
  RotateCcw,
  LogOut,
  Shield,
  Menu,
  X,
  User,
  CreditCard,
  Edit3
} from 'lucide-react';

export default function Header() {
  const {
    user,
    theme,
    toggleTheme,
    resetDemoData,
    logout,
    setIsProfileModalOpen
  } = useBank();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.logoBadge}>
            <span style={{ fontSize: '22px' }}>🏦</span>
          </div>
          <div>
            <div style={styles.brandTitleRow}>
              <h1 style={styles.brandTitle}>MyBank</h1>
              <span style={styles.secureTag}>
                <Shield size={11} /> 256-Bit SSL
              </span>
            </div>
            <p style={styles.brandSubtitle}>Online Banking Portal</p>
          </div>
        </div>

        {/* Desktop User Actions */}
        <div style={styles.desktopActions}>
          {/* Live Clock */}
          <div style={styles.liveClock}>
            <span style={styles.clockDot}></span>
            <span style={styles.clockText}>{currentTime}</span>
          </div>

          {/* Interactive User Info Badge */}
          <button
            style={styles.userInfoBtn}
            onClick={() => setIsProfileModalOpen(true)}
            title="Click to view and edit profile"
          >
            <div style={styles.userAvatar}>
              <User size={15} />
            </div>
            <div style={styles.userMeta}>
              <span style={styles.userName}>
                <strong>{user.name}</strong>
              </span>
              <span style={styles.userId}>
                {user.id} • <span style={{ color: 'var(--primary)' }}>Edit Profile</span>
              </span>
            </div>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={styles.iconBtn}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Reset Demo Data Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={resetDemoData}
            title="Reset demo data to initial defaults"
          >
            <RotateCcw size={14} />
            <span>Reset Demo</span>
          </button>

          {/* Logout Button */}
          <button
            className="btn btn-danger btn-sm"
            onClick={logout}
            title="Logout from session"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          style={styles.mobileToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} className="animate-slide-down">
          <button
            style={{ ...styles.mobileUserRow, background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => {
              setIsProfileModalOpen(true);
              setMobileMenuOpen(false);
            }}
          >
            <div style={styles.userAvatar}>
              <User size={18} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                ID: {user.id} • Tap to view/edit profile
              </p>
            </div>
          </button>

          <div style={styles.mobileActionsList}>
            <button
              style={styles.mobileActionBtn}
              onClick={() => {
                setIsProfileModalOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <User size={16} />
              <span>Customer Profile & KYC</span>
            </button>

            <button
              style={styles.mobileActionBtn}
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              style={styles.mobileActionBtn}
              onClick={() => {
                resetDemoData();
                setMobileMenuOpen(false);
              }}
            >
              <RotateCcw size={16} />
              <span>Reset Demo Data</span>
            </button>

            <button
              style={{ ...styles.mobileActionBtn, color: 'var(--debit)' }}
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-subtle)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow-xs)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0.85rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoBadge: {
    width: '42px',
    height: '42px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--primary-border)'
  },
  brandTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  brandTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--primary)',
    letterSpacing: '-0.02em'
  },
  secureTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'var(--credit)',
    backgroundColor: 'var(--credit-light)',
    padding: '2px 6px',
    borderRadius: 'var(--radius-full)'
  },
  brandSubtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '1px'
  },
  desktopActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  liveClock: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border-subtle)'
  },
  clockDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--credit)',
    animation: 'pulseGlow 2s infinite'
  },
  clockText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: 500
  },
  userInfoBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 10px',
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease'
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    fontSize: '0.8rem',
    color: 'var(--text-primary)'
  },
  userId: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)'
  },
  iconBtn: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-muted)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  mobileToggle: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer'
  },
  mobileDrawer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '1rem 1.5rem',
    backgroundColor: 'var(--bg-surface)',
    borderTop: '1px solid var(--border-subtle)'
  },
  mobileUserRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--border-subtle)'
  },
  mobileActionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  mobileActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-muted)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'left'
  }
};
