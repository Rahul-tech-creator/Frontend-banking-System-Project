import React, { useState } from 'react';
import { useBank } from '../../hooks/useBank';
import { formatCurrency } from '../../utils/formatters';
import {
  Repeat,
  Trash2,
  Calendar,
  PlusCircle,
  CheckCircle,
  Play,
  Pause,
  AlertTriangle,
  CreditCard
} from 'lucide-react';

export default function RecurringSection() {
  const {
    recurringPayments,
    accounts,
    addRecurringPayment,
    deleteRecurringPayment,
    toggleRecurringPaymentStatus,
    processRecurringPayment
  } = useBank();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [date, setDate] = useState('');
  const [sourceAccount, setSourceAccount] = useState('Savings');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presets = [
    { name: 'Netflix 4K Premium', amount: '649', frequency: 'Monthly' },
    { name: 'Spotify Music Family', amount: '179', frequency: 'Monthly' },
    { name: 'Apartment House Rent', amount: '18000', frequency: 'Monthly' },
    { name: 'Gym & Fitness Pass', amount: '1500', frequency: 'Monthly' },
    { name: 'AWS Cloud Hosting', amount: '2200', frequency: 'Monthly' }
  ];

  const handleApplyPreset = (p) => {
    setName(p.name);
    setAmount(p.amount);
    setFrequency(p.frequency);
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = addRecurringPayment(name, amount, frequency, date, sourceAccount);
    if (success) {
      setName('');
      setAmount('');
      setDate('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Recurring Payments & Subscriptions</h2>
          <p style={styles.subtitle}>
            Set up automatic scheduled mandates for utilities, rent, and subscriptions with pause, resume, and instant execution controls.
          </p>
        </div>
        <div style={styles.autoDebitBadge}>
          <Repeat size={14} />
          <span>Auto-Debit Engine Active</span>
        </div>
      </div>

      {/* Preset Subscriptions */}
      <div style={styles.presetBar}>
        <span style={styles.presetLabel}>Quick Add Subscription Template:</span>
        <div style={styles.presetChips}>
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              style={styles.presetBtn}
            >
              <PlusCircle size={13} color="var(--primary)" />
              <span>
                {p.name} ({formatCurrency(p.amount)})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.layout}>
        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="paymentName">
              <span>Subscription / Mandate Title</span>
            </label>
            <input
              type="text"
              id="paymentName"
              placeholder="e.g. Netflix, House Rent, Gym"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="recurringSourceAccount">
              <span>Debit From Account</span>
            </label>
            <select
              id="recurringSourceAccount"
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
            <label className="form-label" htmlFor="paymentAmount">
              <span>Amount (₹)</span>
            </label>
            <input
              type="number"
              id="paymentAmount"
              placeholder="Enter mandate amount"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="paymentFrequency">
              <span>Deduction Frequency</span>
            </label>
            <select
              id="paymentFrequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="nextPaymentDate">
              <span>Next Scheduled Execution Date</span>
            </label>
            <input
              type="date"
              id="nextPaymentDate"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={isSubmitting || !name || !amount || !date}
            style={{ marginTop: '0.5rem' }}
          >
            <Repeat size={18} />
            <span>Schedule Recurring Payment</span>
          </button>
        </form>

        {/* Mandate Engine Rules Card */}
        <div style={styles.infoCard}>
          <h4 style={styles.infoTitle}>Automated Debit Rules</h4>
          <ul style={styles.benefitsList}>
            <li>
              <CheckCircle size={15} color="var(--credit)" />
              <span>Full control: Pause, resume, or cancel standing mandates anytime.</span>
            </li>
            <li>
              <CheckCircle size={15} color="var(--credit)" />
              <span>Instant Test Execution: Click "Pay Now" to process the payment immediately and test ledger impact.</span>
            </li>
            <li>
              <CheckCircle size={15} color="var(--credit)" />
              <span>Zero overdraft penalty when accounts are configured with fallback balance.</span>
            </li>
          </ul>

          <div style={styles.mandateStatsBox}>
            <div style={styles.statCol}>
              <span style={styles.statLabel}>Active Mandates</span>
              <strong style={styles.statVal}>
                {recurringPayments.filter((p) => p.status !== 'Paused').length}
              </strong>
            </div>
            <div style={styles.statCol}>
              <span style={styles.statLabel}>Monthly Committed</span>
              <strong style={{ ...styles.statVal, color: 'var(--debit)' }}>
                {formatCurrency(
                  recurringPayments
                    .filter((p) => p.status !== 'Paused')
                    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
                )}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Payments Table */}
      <div style={styles.tableSection}>
        <div style={styles.subHeader}>
          <h3 style={styles.subTitle}>Configured Automated Mandates</h3>
          <span style={styles.countBadge}>
            {recurringPayments.length} Mandate{recurringPayments.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Payment Title</th>
                <th>Debit Account</th>
                <th>Amount</th>
                <th>Frequency</th>
                <th>Next Execution</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recurringPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={32} color="var(--text-muted)" />
                      <span>No active recurring payments configured. Add one above.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                recurringPayments.map((item) => {
                  const isPaused = item.status === 'Paused';

                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        {item.lastExecuted && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                            Last run: {item.lastExecuted}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${item.sourceAccount === 'Current' ? 'badge-current' : 'badge-savings'}`}>
                          {item.sourceAccount || 'Savings'}
                        </span>
                      </td>
                      <td>
                        <strong>{formatCurrency(item.amount)}</strong>
                      </td>
                      <td>{item.frequency}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        {item.date}
                      </td>
                      <td>
                        <span className={`badge ${isPaused ? 'badge-warning' : 'badge-savings'}`}>
                          {isPaused ? 'Paused' : 'Active'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => processRecurringPayment(item.id)}
                            title="Execute / process payment now"
                          >
                            <Play size={12} />
                            <span>Pay Now</span>
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => toggleRecurringPaymentStatus(item.id)}
                            title={isPaused ? 'Resume Mandate' : 'Pause Mandate'}
                          >
                            {isPaused ? <Play size={12} /> : <Pause size={12} />}
                            <span>{isPaused ? 'Resume' : 'Pause'}</span>
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => deleteRecurringPayment(item.id)}
                            title="Delete Mandate"
                          >
                            <Trash2 size={14} color="var(--debit)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
    fontSize: '1.4rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)'
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginTop: '4px'
  },
  autoDebitBadge: {
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
  presetBar: {
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    marginBottom: '1.75rem',
    border: '1px solid var(--border-subtle)'
  },
  presetLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    display: 'block',
    marginBottom: '8px'
  },
  presetChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  presetBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.78rem',
    color: 'var(--text-primary)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px',
    alignItems: 'start',
    marginBottom: '2.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  infoCard: {
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  infoTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  benefitsList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '0.825rem',
    color: 'var(--text-secondary)'
  },
  mandateStatsBox: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-subtle)'
  },
  statCol: {
    backgroundColor: 'var(--bg-surface)',
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)'
  },
  statLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    display: 'block'
  },
  statVal: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--text-primary)'
  },
  tableSection: {
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--border-subtle)'
  },
  subHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  subTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  countBadge: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600
  }
};
