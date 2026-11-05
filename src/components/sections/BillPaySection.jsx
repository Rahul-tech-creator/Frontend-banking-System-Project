import React, { useState, useEffect } from 'react';
import { useBank } from '../../hooks/useBank';
import { formatCurrency, getCurrentFormattedDate } from '../../utils/formatters';
import { BILL_CATEGORIES } from '../../data/initialData';
import {
  Zap,
  Droplets,
  Wifi,
  Smartphone,
  Flame,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Search,
  Lock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function BillPaySection() {
  const {
    accounts,
    payBill,
    transactions,
    setSelectedReceiptTx,
    preselectedAccount
  } = useBank();

  const [sourceAccount, setSourceAccount] = useState(preselectedAccount || 'Savings');
  const [billType, setBillType] = useState('Electricity');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [billerName, setBillerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [billerVerified, setBillerVerified] = useState(false);

  useEffect(() => {
    if (preselectedAccount && accounts[preselectedAccount]) {
      setSourceAccount(preselectedAccount);
    }
  }, [preselectedAccount, accounts]);

  const currentAcc = accounts[sourceAccount] || accounts.Savings;
  const availableBalance = currentAcc.balance || 0;
  const isFrozen = currentAcc.isFrozen;
  const numAmount = parseFloat(amount) || 0;
  const hasInsufficientFunds = numAmount > availableBalance;

  const currentCategory = BILL_CATEGORIES.find((c) => c.id === billType) || BILL_CATEGORIES[0];

  const getCategoryIcon = (id, size = 18) => {
    switch (id) {
      case 'Electricity':
        return <Zap size={size} />;
      case 'Water':
        return <Droplets size={size} />;
      case 'Internet':
        return <Wifi size={size} />;
      case 'Mobile':
        return <Smartphone size={size} />;
      case 'Gas':
        return <Flame size={size} />;
      default:
        return <Receipt size={size} />;
    }
  };

  // Simulated live fetch from BBPS Gateway
  const handleFetchBill = () => {
    if (!consumerNumber.trim()) return;
    setIsValidating(true);
    setTimeout(() => {
      const generatedBillAmounts = {
        Electricity: 1850,
        Water: 420,
        Internet: 999,
        Mobile: 399,
        Gas: 680
      };
      const suggestedAmount = generatedBillAmounts[billType] || 1200;
      setAmount(suggestedAmount.toString());
      setBillerName(currentCategory.sampleBiller || `${billType} Board`);
      setBillerVerified(true);
      setIsValidating(false);
    }, 350);
  };

  const handleCategoryChange = (id) => {
    setBillType(id);
    setBillerVerified(false);
    const cat = BILL_CATEGORIES.find((c) => c.id === id);
    setBillerName(cat?.sampleBiller || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = payBill(
      sourceAccount,
      billType,
      consumerNumber,
      amount,
      billerName || currentCategory.sampleBiller
    );
    if (success) {
      setConsumerNumber('');
      setAmount('');
      setBillerVerified(false);
    }
    setIsSubmitting(false);
  };

  // Filter utility bill history
  const recentBills = transactions.filter(
    (tx) => tx.type === 'Bill Payment' || tx.category === 'Utilities' || tx.category === 'Recharge'
  );

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Utility Bill Payments</h2>
          <p style={styles.subtitle}>
            Pay your electricity, water, broadband, gas, or mobile bills with instant BBPS confirmation and automated receipts.
          </p>
        </div>
        <div style={styles.bbpsBadge}>
          <CheckCircle2 size={14} color="var(--credit)" />
          <span>BBPS Network Certified</span>
        </div>
      </div>

      {isFrozen && (
        <div style={styles.dangerAlert} className="animate-slide-up">
          <Lock size={16} />
          <span>
            {sourceAccount} Account is locked. Please unfreeze it in Card Controls before processing bill debits.
          </span>
        </div>
      )}

      {/* Category Selection Carousel / Grid */}
      <div style={styles.categoryRow}>
        <span style={styles.categoryLabel}>Select Utility Category:</span>
        <div style={styles.categoryGrid}>
          {BILL_CATEGORIES.map((cat) => {
            const isSelected = billType === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                style={{
                  ...styles.catBtn,
                  ...(isSelected ? styles.catBtnActive : {})
                }}
              >
                <div style={styles.catIconWrap}>{getCategoryIcon(cat.id, 20)}</div>
                <span style={styles.catText}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.layout}>
        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="billSourceAccount">
              <span>Pay From Account</span>
              <span className="form-hint">Available: {formatCurrency(availableBalance)}</span>
            </label>
            <select
              id="billSourceAccount"
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
            <label className="form-label" htmlFor="consumerNumber">
              <span>{billType} Consumer Number / Meter ID</span>
              <span className="form-hint">e.g. {currentCategory.placeholder}</span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                id="consumerNumber"
                placeholder={`Enter ID (e.g. ${currentCategory.placeholder})`}
                value={consumerNumber}
                onChange={(e) => {
                  setConsumerNumber(e.target.value);
                  setBillerVerified(false);
                }}
                required
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleFetchBill}
                disabled={!consumerNumber.trim() || isValidating}
                title="Fetch bill from utility provider"
                style={{ flexShrink: 0 }}
              >
                <Search size={14} />
                <span>{isValidating ? 'Validating...' : 'Fetch Bill'}</span>
              </button>
            </div>
          </div>

          {billerVerified && (
            <div style={styles.verifiedBillerCard} className="animate-slide-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--credit)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> Verified via BBPS Core Switch
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Due: 5 Days</span>
              </div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)' }}>
                {billerName || currentCategory.sampleBiller}
              </p>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="billAmount">
              <span>Bill Amount (₹)</span>
              {hasInsufficientFunds && (
                <span style={{ color: 'var(--debit)', fontSize: '0.75rem', fontWeight: 600 }}>
                  Insufficient Balance!
                </span>
              )}
            </label>
            <input
              type="number"
              id="billAmount"
              placeholder="Enter exact bill amount"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{
                borderColor: hasInsufficientFunds ? 'var(--debit)' : undefined
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={isSubmitting || numAmount <= 0 || hasInsufficientFunds || isFrozen || !consumerNumber}
            style={{ marginTop: '0.5rem' }}
          >
            <CheckCircle2 size={18} />
            <span>Pay {numAmount > 0 ? formatCurrency(numAmount) : ''} {billType} Bill</span>
          </button>
        </form>

        {/* Status / History Panel */}
        <div style={styles.recentPanel}>
          <div style={styles.recentPanelHeader}>
            <h4 style={styles.recentPanelTitle}>Recent Utility Payments</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {recentBills.length} Paid
            </span>
          </div>

          {recentBills.length === 0 ? (
            <div style={styles.emptyBills}>
              <Receipt size={28} color="var(--text-muted)" />
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                No utility bills paid yet in this session.
              </p>
            </div>
          ) : (
            <div style={styles.billsList}>
              {recentBills.slice(0, 5).map((b) => (
                <div key={b.id} style={styles.billItem}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {b.description}
                    </strong>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {b.date} • {b.account} Account
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--debit)' }}>
                      - {formatCurrency(b.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedReceiptTx(b)}
                      style={styles.viewReceiptLink}
                    >
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
  bbpsBadge: {
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
  categoryRow: {
    marginBottom: '1.75rem'
  },
  categoryLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    display: 'block',
    marginBottom: '10px'
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px'
  },
  catBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 10px',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--bg-muted)',
    border: '1.5px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: 'var(--text-secondary)'
  },
  catBtnActive: {
    backgroundColor: 'var(--primary-light)',
    borderColor: 'var(--primary)',
    color: 'var(--primary)',
    boxShadow: '0 2px 6px var(--primary-glow)'
  },
  catIconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  catText: {
    fontSize: '0.8rem',
    fontWeight: 700
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
  verifiedBillerCard: {
    backgroundColor: 'var(--bg-muted)',
    border: '1px solid var(--credit-border)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    marginBottom: '1rem'
  },
  recentPanel: {
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  recentPanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--border-subtle)'
  },
  recentPanelTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  emptyBills: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '2.5rem 1rem'
  },
  billsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  billItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)'
  },
  viewReceiptLink: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontSize: '0.72rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'block'
  }
};
