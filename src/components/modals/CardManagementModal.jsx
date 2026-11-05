import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useBank } from '../../hooks/useBank';
import { formatCurrency } from '../../utils/formatters';
import {
  CreditCard,
  Lock,
  Unlock,
  KeyRound,
  Sliders,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export default function CardManagementModal() {
  const {
    accounts,
    cardModalAccount,
    setCardModalAccount,
    toggleFreezeCard,
    updateCardPin,
    updateCardLimit
  } = useBank();

  const [showSensitive, setShowSensitive] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);

  if (!cardModalAccount) return null;

  const acc = accounts[cardModalAccount];
  if (!acc) return null;

  const card = acc.cardDetails || {
    cardType: 'Debit Card',
    cardNumber: '4521 8901 2345 6789',
    cvv: '123',
    expiry: '12/28',
    pin: '1234',
    dailyLimit: 50000,
    status: 'Active'
  };

  const isFrozen = acc.isFrozen || card.status === 'Frozen';

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (updateCardPin(cardModalAccount, newPin)) {
      setNewPin('');
      setIsChangingPin(false);
    }
  };

  const handleLimitChange = (e) => {
    updateCardLimit(cardModalAccount, e.target.value);
  };

  return (
    <Modal
      isOpen={Boolean(cardModalAccount)}
      onClose={() => {
        setCardModalAccount(null);
        setIsChangingPin(false);
        setNewPin('');
      }}
      title={`${cardModalAccount} Debit Card Controls`}
      maxWidth="500px"
    >
      <div style={styles.body}>
        {/* Virtual Card Preview */}
        <div
          style={{
            ...styles.cardVisual,
            background:
              cardModalAccount === 'Savings'
                ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
                : 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
            filter: isFrozen ? 'grayscale(0.85) contrast(0.9)' : 'none'
          }}
        >
          <div style={styles.cardTop}>
            <span style={styles.cardType}>{card.cardType}</span>
            <div style={styles.statusBadge}>
              {isFrozen ? (
                <span style={{ color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> FROZEN
                </span>
              ) : (
                <span style={{ color: '#86efac', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} /> ACTIVE
                </span>
              )}
            </div>
          </div>

          <div style={styles.cardNumberDisplay}>
            {showSensitive
              ? card.cardNumber
              : `**** **** **** ${acc.accountNumber.replace('****', '')}`}
          </div>

          <div style={styles.cardBottom}>
            <div>
              <span style={styles.smallLabel}>CVV</span>
              <span style={styles.cardValue}>{showSensitive ? card.cvv : '•••'}</span>
            </div>
            <div>
              <span style={styles.smallLabel}>EXPIRY</span>
              <span style={styles.cardValue}>{card.expiry}</span>
            </div>
            <div>
              <span style={styles.smallLabel}>PIN</span>
              <span style={styles.cardValue}>{showSensitive ? card.pin : '••••'}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSensitive(!showSensitive)}
              style={styles.revealBtn}
              title={showSensitive ? 'Hide Sensitive Info' : 'Show CVV & Full Number'}
            >
              {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showSensitive ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>
        </div>

        {/* Status Warning if Frozen */}
        {isFrozen && (
          <div style={styles.warningAlert} className="animate-slide-up">
            <AlertTriangle size={16} color="var(--debit)" />
            <span>Card is locked. Transfers, ATM withdrawals, and bill payments are blocked.</span>
          </div>
        )}

        {/* Security Controls */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="var(--primary)" />
              <strong style={{ fontSize: '0.9rem' }}>Card Security Lock</strong>
            </div>
            <button
              className={`btn btn-sm ${isFrozen ? 'btn-primary' : 'btn-danger'}`}
              onClick={() => toggleFreezeCard(cardModalAccount)}
            >
              {isFrozen ? <Unlock size={14} /> : <Lock size={14} />}
              <span>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
            </button>
          </div>
          <p style={styles.sectionDesc}>
            Instantly freeze this debit card to block all transactions if misplaced. Unfreeze anytime with zero charges.
          </p>
        </div>

        {/* PIN Management */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KeyRound size={16} color="var(--primary)" />
              <strong style={{ fontSize: '0.9rem' }}>ATM & Online PIN</strong>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsChangingPin(!isChangingPin)}
            >
              {isChangingPin ? 'Cancel' : 'Change PIN'}
            </button>
          </div>

          {isChangingPin ? (
            <form onSubmit={handlePinSubmit} style={styles.pinForm} className="animate-slide-up">
              <input
                type="password"
                maxLength={4}
                placeholder="Enter 4-digit PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                style={{ maxWidth: '180px' }}
                autoFocus
                required
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={newPin.length !== 4}
              >
                Set PIN
              </button>
            </form>
          ) : (
            <p style={styles.sectionDesc}>
              Current PIN: <strong>{showSensitive ? card.pin : '••••'}</strong>. Used for ATM withdrawals and POS terminal payments.
            </p>
          )}
        </div>

        {/* Daily Spending Limit Slider */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={16} color="var(--primary)" />
              <strong style={{ fontSize: '0.9rem' }}>Daily Spending Limit</strong>
            </div>
            <span style={styles.limitValueBadge}>{formatCurrency(card.dailyLimit || 50000)}</span>
          </div>

          <input
            type="range"
            min="5000"
            max="200000"
            step="5000"
            value={card.dailyLimit || 50000}
            onChange={handleLimitChange}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span>Min: ₹5,000</span>
            <span>Max: ₹2,00,000</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

const styles = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  cardVisual: {
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem 1.4rem',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxShadow: 'var(--shadow-md)',
    transition: 'filter 0.3s ease'
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardType: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255, 255, 255, 0.85)'
  },
  statusBadge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.04em'
  },
  cardNumberDisplay: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.2rem',
    letterSpacing: '0.12em',
    color: '#ffffff',
    margin: '4px 0'
  },
  cardBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '8px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)'
  },
  smallLabel: {
    fontSize: '0.6rem',
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'block'
  },
  cardValue: {
    fontSize: '0.85rem',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)'
  },
  revealBtn: {
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    padding: '3px 8px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.7rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer'
  },
  warningAlert: {
    padding: '10px 14px',
    backgroundColor: 'var(--debit-light)',
    border: '1px solid var(--debit-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--debit)',
    fontSize: '0.825rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  section: {
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-md)',
    padding: '14px',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionDesc: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  pinForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '6px'
  },
  limitValueBadge: {
    fontSize: '0.85rem',
    fontWeight: 800,
    color: 'var(--primary)',
    backgroundColor: 'var(--primary-light)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)'
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
    marginTop: '8px'
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: 'var(--text-muted)'
  }
};

