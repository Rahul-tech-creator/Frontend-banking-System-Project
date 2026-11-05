import React from 'react';
import { useBank } from '../../hooks/useBank';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useBank();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={styles.container}>
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            style={{
              ...styles.toast,
              borderLeft: `4px solid ${
                isSuccess
                  ? 'var(--credit)'
                  : isError
                  ? 'var(--debit)'
                  : 'var(--primary)'
              }`
            }}
            className="animate-slide-up"
          >
            <div style={styles.iconContainer}>
              {isSuccess && <CheckCircle2 size={20} color="var(--credit)" />}
              {isError && <AlertCircle size={20} color="var(--debit)" />}
              {!isSuccess && !isError && <Info size={20} color="var(--primary)" />}
            </div>

            <div style={styles.body}>
              <h4 style={styles.title}>{toast.title}</h4>
              {toast.message && <p style={styles.message}>{toast.message}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={styles.closeBtn}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '380px',
    width: 'calc(100% - 40px)',
    pointerEvents: 'none'
  },
  toast: {
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 16px',
    backgroundColor: 'var(--bg-surface-elevated)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border-subtle)',
    transition: 'all 0.2s ease'
  },
  iconContainer: {
    flexShrink: 0,
    marginTop: '2px'
  },
  body: {
    flex: 1
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '2px'
  },
  message: {
    fontSize: '0.825rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.4
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'color 0.15s'
  }
};
