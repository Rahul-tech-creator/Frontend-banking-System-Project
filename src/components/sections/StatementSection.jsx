import React, { useState, useMemo } from 'react';
import { useBank } from '../../hooks/useBank';
import { formatCurrency, getCurrentFormattedDate } from '../../utils/formatters';
import {
  downloadTextStatement,
  exportTransactionsCSV,
  calculateRunningBalances
} from '../../utils/statementGenerator';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  Calendar,
  Building,
  User,
  CreditCard,
  Filter,
  ShieldCheck
} from 'lucide-react';

export default function StatementSection() {
  const { accounts, transactions, user, addToast, preselectedAccount } = useBank();
  const [selectedAccount, setSelectedAccount] = useState(preselectedAccount || 'Savings');
  const [dateRange, setDateRange] = useState('all'); // 'all', '30days', '90days', 'year'

  const accObj = accounts[selectedAccount] || accounts.Savings;
  const currentDate = getCurrentFormattedDate();

  // Filter transactions for this specific account & date range
  const filteredAccTransactions = useMemo(() => {
    let list = transactions.filter((tx) => tx.account === selectedAccount);

    if (dateRange !== 'all') {
      const now = new Date();
      let cutoffDays = 30;
      if (dateRange === '90days') cutoffDays = 90;
      if (dateRange === 'year') cutoffDays = 365;

      const cutoffTime = now.getTime() - cutoffDays * 24 * 60 * 60 * 1000;

      list = list.filter((tx) => {
        if (!tx.date) return true;
        const parts = tx.date.split('-');
        if (parts.length === 3) {
          const txDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          if (!isNaN(txDate.getTime())) {
            return txDate.getTime() >= cutoffTime;
          }
        }
        return true;
      });
    }

    return calculateRunningBalances(list, accObj.balance);
  }, [transactions, selectedAccount, dateRange, accObj.balance]);

  const totalCredits = filteredAccTransactions
    .filter((tx) => tx.transactionType === 'credit')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  const totalDebits = filteredAccTransactions
    .filter((tx) => tx.transactionType === 'debit')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  const handleDownloadTxt = () => {
    downloadTextStatement(selectedAccount, accObj, filteredAccTransactions, user);
    addToast(
      'Statement Downloaded',
      `Official text statement for ${selectedAccount} Account saved.`,
      'success'
    );
  };

  const handleExportCSV = () => {
    exportTransactionsCSV(filteredAccTransactions, selectedAccount);
    addToast('CSV Exported', `Transaction records exported for ${selectedAccount} Account.`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Official Account Statement</h2>
          <p style={styles.subtitle}>
            Authenticated digital banking ledger with live running balance, branch credentials, and export controls.
          </p>
        </div>
        <div style={styles.actionsBar}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <FileSpreadsheet size={15} color="var(--credit)" />
            <span>CSV</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleDownloadTxt}>
            <Download size={15} />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* Account Selector & Date Range Filter Strip */}
      <div style={styles.selectorStrip}>
        <div style={styles.selectorGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="stmtAccountSelect" style={styles.selectorLabel}>
              Account:
            </label>
            <select
              id="stmtAccountSelect"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              style={{ width: 'auto', minWidth: '220px', margin: 0 }}
            >
              <option value="Savings">
                Savings Account ({accounts.Savings.accountNumber})
              </option>
              <option value="Current">
                Current Account ({accounts.Current.accountNumber})
              </option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="stmtDateRangeSelect" style={styles.selectorLabel}>
              Period:
            </label>
            <select
              id="stmtDateRangeSelect"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ width: 'auto', margin: 0 }}
            >
              <option value="all">All Available Records</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">Past 12 Months</option>
            </select>
          </div>
        </div>

        <div style={styles.statusIndicator}>
          <span style={styles.statusDot}></span>
          <span>Verified e-Statement Generation</span>
        </div>
      </div>

      {/* Official Statement Document Card */}
      <div style={styles.statementCard} id="printable-statement">
        {/* Bank Seal & Letterhead */}
        <div style={styles.letterhead}>
          <div style={styles.letterheadBrand}>
            <span style={{ fontSize: '28px' }}>🏦</span>
            <div>
              <h3 style={styles.bankName}>MyBank Digital Banking Corporation</h3>
              <p style={styles.branchText}>
                BKC Corporate Tower, Bandra Kurla Complex, Mumbai 400051 • MICR: 400024012
              </p>
            </div>
          </div>
          <div style={styles.generatedDate}>
            <Calendar size={14} color="var(--text-muted)" />
            <span>Generated: {currentDate}</span>
          </div>
        </div>

        {/* Account Details 4-Column Grid */}
        <div style={styles.metaGrid}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Account Holder</span>
            <p style={styles.metaValue}>{user.name}</p>
            <span style={styles.metaSub}>Customer ID: {user.id}</span>
          </div>

          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Account Number</span>
            <p style={{ ...styles.metaValue, fontFamily: 'var(--font-mono)' }}>
              {accObj.accountNumber}
            </p>
            <span style={styles.metaSub}>IFSC: {accObj.ifsc || 'MYBK0001042'}</span>
          </div>

          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Account Type</span>
            <p style={styles.metaValue}>{selectedAccount} Account</p>
            <span style={styles.metaSub}>Currency: INR (₹)</span>
          </div>

          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Current Ledger Balance</span>
            <p style={{ ...styles.metaValue, fontSize: '1.25rem', color: 'var(--primary)' }}>
              {formatCurrency(accObj.balance)}
            </p>
            <span style={styles.metaSub}>Live Balance</span>
          </div>
        </div>

        {/* Flow Ledger Summary */}
        <div style={styles.flowSummaryRow}>
          <div style={styles.flowBox}>
            <span style={styles.flowLabel}>Total Inflow (Credits)</span>
            <strong style={{ ...styles.flowVal, color: 'var(--credit)' }}>
              +{formatCurrency(totalCredits)}
            </strong>
          </div>
          <div style={styles.flowBox}>
            <span style={styles.flowLabel}>Total Outflow (Debits)</span>
            <strong style={{ ...styles.flowVal, color: 'var(--debit)' }}>
              -{formatCurrency(totalDebits)}
            </strong>
          </div>
          <div style={styles.flowBox}>
            <span style={styles.flowLabel}>Transactions Recorded</span>
            <strong style={styles.flowVal}>{filteredAccTransactions.length} Items</strong>
          </div>
        </div>

        {/* Statement Transactions Table with Running Balance Column */}
        <div style={styles.statementTableSection}>
          <div style={styles.tableTitleRow}>
            <h4 style={styles.tableTitle}>Statement Transactions & Running Ledger</h4>
            <span style={styles.txCount}>
              {filteredAccTransactions.length} Record{filteredAccTransactions.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Narration & Reference</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                  <th style={{ textAlign: 'right' }}>Running Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted" style={{ padding: '2.5rem' }}>
                      <FileText size={28} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                      <p>No transaction records found for this period and account.</p>
                    </td>
                  </tr>
                ) : (
                  filteredAccTransactions.map((tx) => {
                    const isCredit = tx.transactionType === 'credit';
                    return (
                      <tr key={tx.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                          {tx.date}
                        </td>
                        <td>
                          <strong>{tx.type}</strong>
                        </td>
                        <td>
                          <div>
                            <span>{tx.description}</span>
                            {tx.reference && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>
                                Ref: {tx.reference}
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          style={{ textAlign: 'right', whiteSpace: 'nowrap' }}
                          className={isCredit ? 'text-credit' : 'text-debit'}
                        >
                          <strong>
                            {isCredit ? '+ ' : '- '}
                            {formatCurrency(tx.amount)}
                          </strong>
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                          {formatCurrency(tx.runningBalance || 0)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statement Footer Note */}
        <div style={styles.statementFooter}>
          <p>
            This document is an authenticated computer-generated account statement issued by MyBank Core Financial Switch.
            Certified secure. No physical signature is required. For discrepancies, contact support@mybank.in within 30 days.
          </p>
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
  actionsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  selectorStrip: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '1.75rem',
    backgroundColor: 'var(--bg-muted)',
    padding: '12px 16px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)'
  },
  selectorGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  selectorLabel: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: 'var(--credit)',
    fontWeight: 600
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--credit)'
  },
  statementCard: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.75rem',
    boxShadow: 'var(--shadow-xs)'
  },
  letterhead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
    paddingBottom: '1.25rem',
    borderBottom: '2px solid var(--border-subtle)',
    marginBottom: '1.5rem'
  },
  letterheadBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  bankName: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--primary)'
  },
  branchText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  generatedDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-muted)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)'
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '16px',
    backgroundColor: 'var(--bg-muted)',
    padding: '1.25rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    marginBottom: '1.25rem'
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  metaLabel: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  metaValue: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  metaSub: {
    fontSize: '0.72rem',
    color: 'var(--text-secondary)'
  },
  flowSummaryRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '1.5rem'
  },
  flowBox: {
    padding: '10px 14px',
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)'
  },
  flowLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    display: 'block'
  },
  flowVal: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--text-primary)'
  },
  statementTableSection: {
    marginBottom: '1.5rem'
  },
  tableTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  tableTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  txCount: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600
  },
  statementFooter: {
    padding: '12px 14px',
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    border: '1px solid var(--border-subtle)'
  }
};
