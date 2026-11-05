import React from 'react';
import Modal from './Modal';
import { useBank } from '../../hooks/useBank';
import { AlertTriangle, HelpCircle } from 'lucide-react';

export default function ConfirmDialog() {
  const { confirmDialog, closeConfirmDialog } = useBank();
  const { isOpen, title, message, confirmText, isDanger, onConfirm } = confirmDialog;

  return (
    <Modal isOpen={isOpen} onClose={closeConfirmDialog} title={title} maxWidth="450px">
      <div style={styles.container}>
        <div style={styles.iconWrapper}>
          {isDanger ? (
            <div style={{ ...styles.iconCircle, backgroundColor: 'var(--debit-light)', color: 'var(--debit)' }}>
              <AlertTriangle size={28} />
            </div>
          ) : (
            <div style={{ ...styles.iconCircle, backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <HelpCircle size={28} />
            </div>
          )}
        </div>

        <p style={styles.message}>{message}</p>

        <div style={styles.actions}>
          <button className="btn btn-secondary" onClick={closeConfirmDialog}>
            Cancel
          </button>
          <button
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
    padding: '0.5rem 0'
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  iconCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    maxWidth: '380px'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginTop: '1rem',
    justifyContent: 'flex-end'
  }
};
