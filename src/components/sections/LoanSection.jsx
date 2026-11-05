import React, { useState } from 'react';
import { useBank } from '../../hooks/useBank';
import { formatCurrency } from '../../utils/formatters';
import { LOAN_CATEGORIES } from '../../data/initialData';
import {
  FileText,
  Calculator,
  Clock,
  CheckCircle2,
  Percent,
  Sparkles,
  CreditCard,
  Ban,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function LoanSection() {
  const {
    loans,
    accounts,
    requestLoan,
    approveAndDisburseLoan,
    payLoanEmi,
    cancelLoan
  } = useBank();

  const [loanType, setLoanType] = useState('Personal Loan');
  const [amount, setAmount] = useState('150000');
  const [tenure, setTenure] = useState('3');
  const [destinationAccount, setDestinationAccount] = useState('Savings');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCategory = LOAN_CATEGORIES.find((c) => c.id === loanType) || LOAN_CATEGORIES[0];

  // Real-time EMI Calculation
  const principal = parseFloat(amount) || 0;
  const annualRate = currentCategory.rate;
  const monthlyRate = annualRate / (12 * 100);
  const totalMonths = (parseInt(tenure, 10) || 1) * 12;

  let emi = 0;
  let totalPayable = 0;
  let totalInterest = 0;

  if (principal > 0 && totalMonths > 0) {
    emi = Math.round(
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
    totalPayable = emi * totalMonths;
    totalInterest = Math.max(0, totalPayable - principal);
  }

  const principalRatio = totalPayable > 0 ? Math.round((principal / totalPayable) * 100) : 70;
  const interestRatio = 100 - principalRatio;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = requestLoan(loanType, amount, tenure, destinationAccount);
    if (success) {
      setAmount('150000');
      setTenure('3');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Loan Application & EMI Management</h2>
          <p style={styles.subtitle}>
            Apply for personal, home, or education credit facilities. Disburse funds directly into your account and manage EMI repayments.
          </p>
        </div>
        <div style={styles.badgePreApproved}>
          <Percent size={14} />
          <span>Interest from {currentCategory.rate}% p.a.</span>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Loan Request Form with Sliders */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="loanTypeSelect">
              <span>Loan Facility Type</span>
              <span className="form-hint">Annual Interest: {currentCategory.rate}% p.a.</span>
            </label>
            <select
              id="loanTypeSelect"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
            >
              <option value="Personal Loan">Personal Loan (10.5% p.a. • Instant Disbursement)</option>
              <option value="Home Loan">Home Loan (8.4% p.a. • Up to 30 Years)</option>
              <option value="Education Loan">Education Loan (9.1% p.a. • Moratorium Period)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="loanDisburseAccount">
              <span>Disburse Loan Funds Into</span>
            </label>
            <select
              id="loanDisburseAccount"
              value={destinationAccount}
              onChange={(e) => setDestinationAccount(e.target.value)}
            >
              <option value="Savings">Savings Account ({accounts.Savings.accountNumber})</option>
              <option value="Current">Current Account ({accounts.Current.accountNumber})</option>
            </select>
          </div>

          {/* Amount Slider & Input */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="loanAmount" style={{ margin: 0 }}>
                <span>Required Principal Amount</span>
              </label>
              <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                {formatCurrency(principal)}
              </strong>
            </div>
            <input
              type="range"
              min={currentCategory.minAmount || 10000}
              max={currentCategory.maxAmount || 1500000}
              step="10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ marginTop: '8px', marginBottom: '4px' }}
            />
            <div style={styles.sliderRangeLabels}>
              <span>Min: {formatCurrency(currentCategory.minAmount || 10000)}</span>
              <span>Max: {formatCurrency(currentCategory.maxAmount || 1500000)}</span>
            </div>
          </div>

          {/* Tenure Slider & Input */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="loanTenure" style={{ margin: 0 }}>
                <span>Repayment Tenure</span>
              </label>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {tenure} Years ({totalMonths} Months)
              </strong>
            </div>
            <input
              type="range"
              min="1"
              max={currentCategory.maxTenure || 7}
              step="1"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              style={{ marginTop: '8px', marginBottom: '4px' }}
            />
            <div style={styles.sliderRangeLabels}>
              <span>1 Year</span>
              <span>{currentCategory.maxTenure || 7} Years</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={isSubmitting || principal <= 0}
            style={{ marginTop: '0.75rem' }}
          >
            <FileText size={18} />
            <span>Apply & Simulate {formatCurrency(principal)}</span>
          </button>
        </form>

        {/* Real-time EMI Calculator & Breakdown Card */}
        <div style={styles.calculatorCard}>
          <div style={styles.calcHeader}>
            <div style={styles.calcIconWrap}>
              <Calculator size={20} color="var(--primary)" />
            </div>
            <div>
              <h4 style={styles.calcTitle}>Real-time EMI Breakdown</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated monthly outflow</p>
            </div>
          </div>

          <div style={styles.emiHighlightBox}>
            <span style={styles.emiLabel}>Estimated Monthly EMI</span>
            <h2 style={styles.emiValue}>
              {formatCurrency(emi)}{' '}
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>/ month</span>
            </h2>
          </div>

          <div style={styles.calcRow}>
            <span style={styles.calcLabel}>Principal Borrowed</span>
            <span style={styles.calcVal}>{formatCurrency(principal)}</span>
          </div>

          <div style={styles.calcRow}>
            <span style={styles.calcLabel}>Interest Rate</span>
            <span style={styles.calcVal}>{annualRate}% p.a.</span>
          </div>

          <div style={styles.calcRow}>
            <span style={styles.calcLabel}>Total Interest</span>
            <span style={{ ...styles.calcVal, color: 'var(--warning-text)' }}>
              {formatCurrency(totalInterest)}
            </span>
          </div>

          {/* Ratio bar */}
          <div style={styles.amortRatioWrap}>
            <div style={styles.ratioLabels}>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                Principal: {principalRatio}%
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--warning-text)', fontWeight: 600 }}>
                Interest: {interestRatio}%
              </span>
            </div>
            <div style={styles.ratioBar}>
              <div style={{ ...styles.ratioSegment, width: `${principalRatio}%`, backgroundColor: 'var(--primary)' }} />
              <div style={{ ...styles.ratioSegment, width: `${interestRatio}%`, backgroundColor: 'var(--warning)' }} />
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.calcRow}>
            <span style={{ ...styles.calcLabel, fontWeight: 700, color: 'var(--text-primary)' }}>
              Total Payable Amount
            </span>
            <span style={{ ...styles.calcVal, fontSize: '1.15rem', color: 'var(--primary)' }}>
              {formatCurrency(totalPayable)}
            </span>
          </div>
        </div>
      </div>

      {/* Loan Applications Table */}
      <div style={styles.applicationsSection}>
        <div style={styles.subHeader}>
          <div>
            <h3 style={styles.subTitle}>My Loan Facilities & Applications</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Instant disbursement available for pending loans • Live EMI repayments
            </p>
          </div>
          <span style={styles.countBadge}>
            {loans.length} Application{loans.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Category</th>
                <th>Principal</th>
                <th>Monthly EMI</th>
                <th>Tenure</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <FileText size={32} color="var(--text-muted)" />
                      <span>No loan applications submitted yet. Apply above for instant simulation.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                loans.map((loan) => {
                  const isPending = loan.status === 'Pending';
                  const isActive = loan.status === 'Active';
                  const isRepaid = loan.status === 'Fully Repaid';

                  return (
                    <tr key={loan.id}>
                      <td>
                        <strong style={{ fontFamily: 'var(--font-mono)' }}>{loan.id}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{loan.type}</strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                            Applied: {loan.appliedDate}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{formatCurrency(loan.amount)}</strong>
                          {isActive && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>
                              Balance: {formatCurrency(loan.remainingPrincipal || loan.amount)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong>{formatCurrency(loan.monthlyEmi || 0)}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                          / month
                        </span>
                      </td>
                      <td>{loan.tenure}</td>
                      <td>
                        {isPending && (
                          <span className="badge badge-warning">
                            <Clock size={12} /> Pending Review
                          </span>
                        )}
                        {isActive && (
                          <span className="badge badge-savings">
                            <Sparkles size={12} /> Active ({loan.emisPaid || 0} Paid)
                          </span>
                        )}
                        {isRepaid && (
                          <span className="badge badge-current" style={{ backgroundColor: 'var(--credit-light)', color: 'var(--credit)' }}>
                            <CheckCircle2 size={12} /> Fully Repaid
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {isPending && (
                            <>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => approveAndDisburseLoan(loan.id)}
                                title="Approve & disburse money into account"
                              >
                                <Sparkles size={13} />
                                <span>Disburse Now</span>
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => cancelLoan(loan.id)}
                                title="Withdraw application"
                              >
                                <Ban size={13} color="var(--debit)" />
                              </button>
                            </>
                          )}
                          {isActive && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => payLoanEmi(loan.id, loan.destinationAccount || 'Savings')}
                              title="Pay monthly EMI installment"
                            >
                              <CreditCard size={13} color="var(--credit)" />
                              <span>Pay EMI</span>
                            </button>
                          )}
                          {isRepaid && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--credit)', fontWeight: 600 }}>
                              ✓ Closed
                            </span>
                          )}
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
  badgePreApproved: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'var(--warning-light)',
    color: 'var(--warning-text)',
    border: '1px solid var(--warning-border)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: 700
  },
  sliderRangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: 'var(--text-muted)'
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
  calculatorCard: {
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  calcHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px'
  },
  calcIconWrap: {
    width: '38px',
    height: '38px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  calcTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  emiHighlightBox: {
    backgroundColor: 'var(--bg-surface)',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    textAlign: 'center',
    margin: '4px 0'
  },
  emiLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  emiValue: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: 'var(--primary)',
    marginTop: '2px'
  },
  calcRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem'
  },
  calcLabel: {
    color: 'var(--text-secondary)'
  },
  calcVal: {
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  amortRatioWrap: {
    marginTop: '4px',
    marginBottom: '4px'
  },
  ratioLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px'
  },
  ratioBar: {
    width: '100%',
    height: '6px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--bg-subtle)',
    overflow: 'hidden',
    display: 'flex'
  },
  ratioSegment: {
    height: '100%'
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-subtle)',
    margin: '4px 0'
  },
  applicationsSection: {
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
