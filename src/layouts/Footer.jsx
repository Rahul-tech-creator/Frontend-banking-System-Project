import React from 'react';
import { ShieldCheck, Lock, Activity, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.topRow}>
          <div style={styles.brandCol}>
            <div style={styles.brandRow}>
              <span style={{ fontSize: '18px' }}>🏦</span>
              <strong style={{ color: 'var(--text-primary)' }}>MyBank Digital Banking Portal</strong>
            </div>
            <p style={styles.desc}>
              Next-generation modern online banking simulation engineered with React, Vite, and accessible web standards.
            </p>
          </div>

          <div style={styles.securityBadges}>
            <div style={styles.badgeItem}>
              <Lock size={14} color="var(--credit)" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div style={styles.badgeItem}>
              <ShieldCheck size={14} color="var(--primary)" />
              <span>Multi-Factor Security</span>
            </div>
            <div style={styles.badgeItem}>
              <Activity size={14} color="var(--credit)" />
              <span>99.99% Core Switch Uptime</span>
            </div>
          </div>
        </div>

        <div style={styles.bottomRow}>
          <p style={styles.disclaimer}>
            © {new Date().getFullYear()} MyBank Corporation. For academic demonstration & portfolio presentation.
          </p>
          <p style={styles.signature}>
            Crafted with modern React Architecture
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: 'var(--bg-surface)',
    borderTop: '1px solid var(--border-subtle)',
    marginTop: '3.5rem',
    padding: '2.5rem 1.5rem 1.5rem'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid var(--border-subtle)'
  },
  brandCol: {
    maxWidth: '450px'
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px'
  },
  desc: {
    fontSize: '0.825rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5
  },
  securityBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px'
  },
  badgeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'var(--bg-muted)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-secondary)'
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },
  disclaimer: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  signature: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }
};
