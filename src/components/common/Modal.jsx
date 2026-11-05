import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '550px' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{ ...styles.content, maxWidth }}
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button
            onClick={onClose}
            style={styles.closeBtn}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  content: {
    width: '100%',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-xl)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-subtle)'
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease'
  },
  body: {
    padding: '1.5rem',
    overflowY: 'auto'
  }
};
