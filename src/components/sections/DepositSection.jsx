import React, { useState, useEffect } from 'react';
import { useBank } from '../../hooks/useBank';
import { formatCurrency } from '../../utils/formatters';
import {
  ArrowDownToLine,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Smartphone,
  CreditCard,
  Building,
  Banknote
} from 'lucide-react';

export default function DepositSection() {
  const { accounts, depositMoney, preselectedAccount } = useBank();
  const [accountKey, setAccountKey] = useState(preselectedAccount || 'Savings');
  const [amount, setAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedAccount && accounts[preselectedAccount]) {
      setAccountKey(preselectedAccount);
    }
  }, [preselectedAccount, accounts]);

  const presetAmounts = [1000, 5000, 10000, 25000, 50000];
  const methods = [
    { id: 'UPI', label: 'Instant UPI / QR', icon: <Smartphone size={15} /> },
    { id: 'NetBanking', label: 'Net Banking', icon: <Building size={15} /> },
    { id: 'DebitCard', label: 'Debit Card', icon: <CreditCard size={15} /> },
    { id: 'Cash', label: 'Branch / CDM Deposit', icon: <Banknote size={15} /> }
  ];

  const currentAcc = accounts[accountKey] || accounts.Savings;
  const currentBalance = currentAcc.balance || 0;
  const isFrozen = currentAcc.isFrozen;
  const numAmount = parseFloat(amount) || 0;
  const projectedBalance = currentBalance + numAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = depositMoney(accountKey, amount);
    if (success) {
      setAmount('');
    }
    setIsSubmitting(false);
  };

  const handlePresetClick = (val) => {
    setAmount(val.toString());
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Deposit Money</h2>
          <p style={styles.subtitle}>
            Load funds instantly into your Savings or Current Account via UPI, NetBanking, or Card with zero processing fees.
          </p>
        </div>
        <div style={styles.badgeInstant}>
          <Sparkles size={14} color="var(--primary)" />
          <span>Real-time Settlement</span>
        </div>
      </div>

      {isFrozen && (
        <div style={styles.warningAlert} className="animate-slide-up">
          <AlertTriangle size={16} color="var(--debit)" />
          <span>Note: {accountKey} Account is currently frozen. Deposits will still be securely accepted and credited to ledger balance.</span>
        </div>
      )}

      {/* Payment Channel Selector */}
      <div style={styles.methodSelectorBar}>
        <span style={styles.methodLabel}>Deposit Channel:</span>
        <div style={styles.methodPills}>
          {methods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setDepositMethod(m.id)}
              style={{
                ...styles.methodBtn,
                ...(depositMethod === m.id ? styles.methodBtnActive : {})
              }}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.layout}>
        {/* Form Column */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="depositAccount">
              <span>Target Account</span>
              <span className="form-hint">Current: {formatCurrency(currentBalance)}</span>
            </label>
            <select
              id="depositAccount"
              value={accountKey}
              onChange={(e) => setAccountKey(e.target.value)}
            >
              <option value="Savings">
                Savings Account ({accounts.Savings.accountNumber}) — {formatCurrency(accounts.Savings.balance)}
              </option>
              <option value="Current">
                Current Account ({accounts.Current.accountNumber}) — {formatCurrency(accounts.Current.balance)}
              </option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="depositAmount">
              <span>Deposit Amount (₹)</span>
              <span className="form-hint">Zero Surcharge</span>
            </label>
            <input
              type="number"
              id="depositAmount"
              placeholder="e.g. 10000"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Quick Preset Buttons */}
          <div style={styles.presetSection}>
            <span style={styles.presetLabel}>Quick Amount Chips:</span>
            <div style={styles.presetPills}>
              {presetAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePresetClick(val)}
                  style={{
                    ...styles.presetBtn,
                    ...(numAmount === val ? styles.presetBtnActive : {})
                  }}
                >
                  +{formatCurrency(val)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={isSubmitting || numAmount <= 0}
            style={{ marginTop: '0.75rem' }}
          >
            <ArrowDownToLine size={18} />
            <span>Deposit {numAmount > 0 ? formatCurrency(numAmount) : 'Funds'} via {depositMethod}</span>
          </button>
        </form>

        {/* Live Calculation / Projection Card */}
        <div style={styles.previewCard}>
          <h4 style={styles.previewTitle}>Transaction Review</h4>

          <div style={styles.previewRow}>
            <span style={styles.previewLabel}>Channel</span>
            <span style={styles.previewValue}>{depositMethod}</span>
          </div>

          <div style={styles.previewRow}>
            <span style={styles.previewLabel}>Target Account</span>
            <span style={styles.previewValue}>{accountKey} Account</span>
          </div>

          <div style={styles.previewRow}>
            <span style={styles.previewLabel}>Current Balance</span>
            <span style={styles.previewValue}>{formatCurrency(currentBalance)}</span>
          </div>

          <div style={styles.previewRow}>
            <span style={styles.previewLabel}>Deposit Amount</span>
            <span style={{ ...styles.previewValue, color: 'var(--credit)' }}>
              + {formatCurrency(numAmount)}
            </span>
          </div>

          <div style={styles.previewRow}>
            <span style={styles.previewLabel}>Processing Fee</span>
            <span style={{ ...styles.previewValue, color: 'var(--credit)' }}>
              ₹0.00 (Free)
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.previewRow}>
            <span style={{ ...styles.previewLabel, fontWeight: 700, color: 'var(--text-primary)' }}>
              Projected Balance
            </span>
            <span style={{ ...styles.previewValue, fontSize: '1.25rem', color: 'var(--primary)' }}>
              {formatCurrency(projectedBalance)}
            </span>
          </div>

          <div style={styles.securityNotice}>
            <ShieldCheck size={16} color="var(--credit)" />
            <span>Authenticated core banking simulation. State saved in LocalStorage.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '1.5rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid var(--border-subtle)'
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '4px'
  },
  badgeInstant: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    border: '1px solid var(--primary-border)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: 700
  },
  warningAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: 'var(--warning-light)',
    border: '1px solid var(--warning-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--warning-text)',
    fontSize: '0.825rem',
    marginBottom: '1.25rem'
  },
  methodSelectorBar: {
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    marginBottom: '1.75rem',
    border: '1px solid var(--border-subtle)'
  },
  methodLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    display: 'block',
    marginBottom: '8px'
  },
  methodPills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  methodBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  methodBtnActive: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    borderColor: 'var(--primary)',
    boxShadow: '0 2px 6px var(--primary-glow)'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px',
    alignItems: 'start'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  presetSection: {
    marginBottom: '1.25rem'
  },
  presetLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    display: 'block',
    marginBottom: '8px'
  },
  presetPills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  presetBtn: {
    padding: '6px 12px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-muted)',
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  presetBtnActive: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    borderColor: 'var(--primary)'
  },
  previewCard: {
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  previewTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--border-subtle)'
  },
  previewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem'
  },
  previewLabel: {
    color: 'var(--text-secondary)'
  },
  previewValue: {
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-subtle)',
    margin: '4px 0'
  },
  securityNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-subtle)',
    marginTop: '6px'
  }
};
