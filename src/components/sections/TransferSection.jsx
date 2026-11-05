import React, { useState, useEffect } from 'react';
import { useBank } from '../../hooks/useBank';
import { formatCurrency } from '../../utils/formatters';
import {
  SendHorizontal,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Shield,
  Plus,
  Trash2,
  Lock,
  Building,
  UserPlus,
  Zap,
  Clock
} from 'lucide-react';

export default function TransferSection() {
  const {
    accounts,
    transferMoney,
    beneficiaries,
    addBeneficiary,
    deleteBeneficiary,
    preselectedAccount
  } = useBank();

  const [sourceAccount, setSourceAccount] = useState(preselectedAccount || 'Savings');
  const [receiverName, setReceiverName] = useState('');
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [transferMode, setTransferMode] = useState('IMPS');
  const [savePayee, setSavePayee] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Beneficiary Form State
  const [showAddPayee, setShowAddPayee] = useState(false);
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeAcc, setNewPayeeAcc] = useState('');
  const [newPayeeBank, setNewPayeeBank] = useState('');
  const [newPayeeIfsc, setNewPayeeIfsc] = useState('');

  useEffect(() => {
    if (preselectedAccount && accounts[preselectedAccount]) {
      setSourceAccount(preselectedAccount);
    }
  }, [preselectedAccount, accounts]);

  const currentAcc = accounts[sourceAccount] || accounts.Savings;
  const availableBalance = currentAcc.balance || 0;
  const isFrozen = currentAcc.isFrozen;
  const dailyLimit = currentAcc.cardDetails?.dailyLimit || 100000;
  const numAmount = parseFloat(amount) || 0;
  const hasInsufficientFunds = numAmount > availableBalance;
  const exceedsLimit = numAmount > dailyLimit;
  const remainingBalance = Math.max(0, availableBalance - numAmount);

  const transferModes = [
    { id: 'IMPS', label: 'IMPS (Instant 24x7)', icon: <Zap size={14} /> },
    { id: 'NEFT', label: 'NEFT (Hourly Batch)', icon: <Clock size={14} /> },
    { id: 'RTGS', label: 'RTGS (Large Value)', icon: <Building size={14} /> }
  ];

  const handleSelectBeneficiary = (b) => {
    setReceiverName(b.name);
    setReceiverAccount(b.accountNumber);
  };

  const handleAddPayeeSubmit = (e) => {
    e.preventDefault();
    if (
      addBeneficiary({
        name: newPayeeName,
        accountNumber: newPayeeAcc,
        bank: newPayeeBank,
        ifsc: newPayeeIfsc
      })
    ) {
      setReceiverName(newPayeeName);
      setReceiverAccount(newPayeeAcc);
      setNewPayeeName('');
      setNewPayeeAcc('');
      setNewPayeeBank('');
      setNewPayeeIfsc('');
      setShowAddPayee(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = transferMoney(
      sourceAccount,
      receiverName,
      receiverAccount,
      amount,
      remarks ? `${remarks} (${transferMode})` : transferMode,
      savePayee
    );
    if (success) {
      setReceiverName('');
      setReceiverAccount('');
      setAmount('');
      setRemarks('');
      setSavePayee(false);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Fund Transfer</h2>
          <p style={styles.subtitle}>
            Transfer funds securely to any bank account holder instantly via IMPS, NEFT, or RTGS with zero transaction charges.
          </p>
        </div>
        <div style={styles.securityPill}>
          <Shield size={14} color="var(--credit)" />
          <span>256-Bit Encrypted Transfer</span>
        </div>
      </div>

      {isFrozen && (
        <div style={styles.dangerAlert} className="animate-slide-up">
          <Lock size={16} />
          <span>
            {sourceAccount} Account is locked. Outgoing transfers are paused until unlocked in Card Management.
          </span>
        </div>
      )}

      {/* Saved Beneficiaries Strip */}
      <div style={styles.beneficiariesBar}>
        <div style={styles.beneficiariesBarHeader}>
          <span style={styles.beneficiariesLabel}>Verified Payees & Beneficiaries:</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowAddPayee(!showAddPayee)}
          >
            <UserPlus size={14} />
            <span>{showAddPayee ? 'Close Form' : '+ Add New Payee'}</span>
          </button>
        </div>

        {/* Add Payee Inline Panel */}
        {showAddPayee && (
          <form onSubmit={handleAddPayeeSubmit} style={styles.addPayeeForm} className="animate-slide-up">
            <h4 style={styles.formMiniTitle}>Register New Verified Beneficiary</h4>
            <div style={styles.payeeFormGrid}>
              <input
                type="text"
                placeholder="Payee Legal Full Name"
                value={newPayeeName}
                onChange={(e) => setNewPayeeName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Bank Account Number"
                value={newPayeeAcc}
                onChange={(e) => setNewPayeeAcc(e.target.value.replace(/\D/g, ''))}
                required
              />
              <input
                type="text"
                placeholder="Bank Name (e.g. HDFC Bank)"
                value={newPayeeBank}
                onChange={(e) => setNewPayeeBank(e.target.value)}
              />
              <input
                type="text"
                placeholder="IFSC Code (e.g. HDFC0001234)"
                value={newPayeeIfsc}
                onChange={(e) => setNewPayeeIfsc(e.target.value.toUpperCase())}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAddPayee(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Payee
              </button>
            </div>
          </form>
        )}

        <div style={styles.beneficiariesList}>
          {beneficiaries.map((b) => (
            <div key={b.id} style={styles.beneficiaryChipWrapper}>
              <button
                type="button"
                onClick={() => handleSelectBeneficiary(b)}
                style={styles.beneficiaryChip}
                title={`Click to fill details for ${b.name}`}
              >
                <div style={{ ...styles.avatar, backgroundColor: b.color || '#2563eb' }}>
                  {b.initials}
                </div>
                <div style={styles.beneficiaryText}>
                  <span style={styles.bName}>{b.name}</span>
                  <span style={styles.bBank}>{b.bank}</span>
                </div>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBeneficiary(b.id);
                }}
                style={styles.deletePayeeBtn}
                title="Remove saved payee"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer Mode Selector */}
      <div style={styles.transferModeBar}>
        <span style={styles.modeLabel}>Transfer Protocol:</span>
        <div style={styles.modePills}>
          {transferModes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setTransferMode(m.id)}
              style={{
                ...styles.modeBtn,
                ...(transferMode === m.id ? styles.modeBtnActive : {})
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
            <label className="form-label" htmlFor="transferSourceAccount">
              <span>Debit From Account</span>
              <span className="form-hint">Available: {formatCurrency(availableBalance)}</span>
            </label>
            <select
              id="transferSourceAccount"
              value={sourceAccount}
              onChange={(e) => setSourceAccount(e.target.value)}
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
            <label className="form-label" htmlFor="receiverName">
              <span>Beneficiary / Receiver Name</span>
            </label>
            <input
              type="text"
              id="receiverName"
              placeholder="e.g. Rahul Sharma"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="receiverAccount">
              <span>Receiver Account Number</span>
              <span className="form-hint">Digits only</span>
            </label>
            <input
              type="text"
              id="receiverAccount"
              placeholder="e.g. 1234567890"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="transferAmount">
              <span>Transfer Amount (₹)</span>
              {hasInsufficientFunds && (
                <span style={{ color: 'var(--debit)', fontSize: '0.75rem', fontWeight: 600 }}>
                  Insufficient Balance!
                </span>
              )}
              {exceedsLimit && !hasInsufficientFunds && (
                <span style={{ color: 'var(--warning-text)', fontSize: '0.75rem', fontWeight: 600 }}>
                  Exceeds Daily Card Limit ({formatCurrency(dailyLimit)})!
                </span>
              )}
            </label>
            <input
              type="number"
              id="transferAmount"
              placeholder="Enter amount to transfer"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{
                borderColor: hasInsufficientFunds || exceedsLimit ? 'var(--debit)' : undefined
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="transferRemarks">
              <span>Purpose / Remarks (Optional)</span>
              <span className="form-hint">e.g. Rent, Vendor, Consulting</span>
            </label>
            <input
              type="text"
              id="transferRemarks"
              placeholder="Add payment note"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div style={styles.checkboxRow}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={savePayee}
                onChange={(e) => setSavePayee(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span>Remember payee in saved beneficiaries for future 1-click transfers</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={
              isSubmitting ||
              numAmount <= 0 ||
              hasInsufficientFunds ||
              exceedsLimit ||
              isFrozen ||
              !receiverName ||
              !receiverAccount
            }
            style={{ marginTop: '0.75rem' }}
          >
            <SendHorizontal size={18} />
            <span>Transfer {numAmount > 0 ? formatCurrency(numAmount) : 'Funds'} via {transferMode}</span>
          </button>
        </form>

        {/* Live Transfer Review Card */}
        <div style={styles.summaryCard}>
          <h4 style={styles.summaryTitle}>Transfer Details Review</h4>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Protocol</span>
            <span style={styles.summaryValue}>{transferMode}</span>
          </div>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Sender Account</span>
            <span style={styles.summaryValue}>{sourceAccount} Account</span>
          </div>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Beneficiary</span>
            <span style={styles.summaryValue}>{receiverName || 'Not specified'}</span>
          </div>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Account Number</span>
            <span style={{ ...styles.summaryValue, fontFamily: 'var(--font-mono)' }}>
              {receiverAccount || '—'}
            </span>
          </div>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Transfer Amount</span>
            <span style={{ ...styles.summaryValue, color: 'var(--debit)' }}>
              - {formatCurrency(numAmount)}
            </span>
          </div>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Bank Charges</span>
            <span style={{ ...styles.summaryValue, color: 'var(--credit)' }}>
              ₹0.00 (Zero Fee)
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.summaryRow}>
            <span style={{ ...styles.summaryLabel, fontWeight: 700, color: 'var(--text-primary)' }}>
              Remaining Balance
            </span>
            <span
              style={{
                ...styles.summaryValue,
                fontSize: '1.25rem',
                color: hasInsufficientFunds ? 'var(--debit)' : 'var(--primary)'
              }}
            >
              {formatCurrency(remainingBalance)}
            </span>
          </div>

          <div style={styles.speedPill}>
            <CheckCircle size={14} color="var(--credit)" />
            <span>Immediate Core Settlement • Synchronized across LocalStorage</span>
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
  securityPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'var(--credit-light)',
    color: 'var(--credit)',
    border: '1px solid var(--credit-border)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: 700
  },
  dangerAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 14px',
    backgroundColor: 'var(--debit-light)',
    border: '1px solid var(--debit-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--debit)',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '1.25rem'
  },
  beneficiariesBar: {
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-lg)',
    padding: '14px',
    marginBottom: '1.25rem',
    border: '1px solid var(--border-subtle)'
  },
  beneficiariesBarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  beneficiariesLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  addPayeeForm: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    marginBottom: '12px'
  },
  formMiniTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--primary)',
    marginBottom: '8px'
  },
  payeeFormGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '8px'
  },
  beneficiariesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  beneficiaryChipWrapper: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center'
  },
  beneficiaryChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 28px 6px 10px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-full)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease'
  },
  avatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  beneficiaryText: {
    display: 'flex',
    flexDirection: 'column'
  },
  bName: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  bBank: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)'
  },
  deletePayeeBtn: {
    position: 'absolute',
    right: '6px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '3px',
    display: 'flex',
    alignItems: 'center'
  },
  transferModeBar: {
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    marginBottom: '1.75rem',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  modeLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  modePills: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  modeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  modeBtnActive: {
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
  checkboxRow: {
    marginBottom: '1rem'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.825rem',
    color: 'var(--text-secondary)',
    cursor: 'pointer'
  },
  summaryCard: {
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  summaryTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--border-subtle)'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem'
  },
  summaryLabel: {
    color: 'var(--text-secondary)'
  },
  summaryValue: {
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-subtle)',
    margin: '4px 0'
  },
  speedPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-subtle)',
    marginTop: '6px'
  }
};
