import React, { useState, useMemo } from 'react';
import { useBank } from '../../hooks/useBank';
import { formatCurrency } from '../../utils/formatters';
import { exportTransactionsCSV } from '../../utils/statementGenerator';
import {
  Search,
  X,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  FileSpreadsheet,
  Trash2,
  Calendar
} from 'lucide-react';

export default function TransactionsSection() {
  const { transactions, setSelectedReceiptTx, deleteTransaction } = useBank();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'credit', 'debit'
  const [accountFilter, setAccountFilter] = useState('all'); // 'all', 'Savings', 'Current'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'amount-desc', 'amount-asc'

  // Filter & Search Logic
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter by type (credit / debit)
    if (filterType !== 'all') {
      result = result.filter((tx) => tx.transactionType === filterType);
    }

    // Filter by account
    if (accountFilter !== 'all') {
      result = result.filter((tx) => tx.account === accountFilter);
    }

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((tx) => {
        const descMatch = (tx.description || '').toLowerCase().includes(q);
        const typeMatch = (tx.type || '').toLowerCase().includes(q);
        const accMatch = (tx.account || '').toLowerCase().includes(q);
        const amtMatch = String(tx.amount || '').includes(q);
        const refMatch = (tx.reference || '').toLowerCase().includes(q);
        const recMatch = (tx.recipientOrSender || '').toLowerCase().includes(q);
        return descMatch || typeMatch || accMatch || amtMatch || refMatch || recMatch;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'amount-desc') return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      if (sortBy === 'amount-asc') return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      if (sortBy === 'oldest') return a.id - b.id;
      return b.id - a.id; // default newest
    });

    return result;
  }, [transactions, filterType, accountFilter, searchQuery, sortBy]);

  const handleExportCSV = () => {
    exportTransactionsCSV(filteredTransactions, accountFilter);
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Transaction History</h2>
          <p style={styles.subtitle}>
            Audit all incoming and outgoing account activities with printable digital receipts and Excel export.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
          <FileSpreadsheet size={15} color="var(--credit)" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div style={styles.controlsBar}>
        {/* Search Input */}
        <div style={styles.searchBox}>
          <Search size={16} color="var(--text-muted)" style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by description, reference, person, or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={styles.clearSearchBtn}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div style={styles.filtersGroup}>
          {/* Type Pills */}
          <div style={styles.pillGroup}>
            {['all', 'credit', 'debit'].map((t) => (
              <button
                key={t}
                className={`btn btn-sm ${filterType === t ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterType(t)}
                style={{ textTransform: 'capitalize' }}
              >
                {t === 'credit' && <ArrowDownLeft size={13} />}
                {t === 'debit' && <ArrowUpRight size={13} />}
                <span>{t}</span>
              </button>
            ))}
          </div>

          {/* Account Filter */}
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            style={styles.selectFilter}
          >
            <option value="all">All Accounts</option>
            <option value="Savings">Savings Only</option>
            <option value="Current">Current Only</option>
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.selectFilter}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="amount-desc">Sort: Highest Amount</option>
            <option value="amount-asc">Sort: Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Summary Info Row */}
      <div style={styles.summaryBar}>
        <span style={styles.countText}>
          Showing <strong>{filteredTransactions.length}</strong> of {transactions.length} transactions
        </span>
        <span style={styles.receiptHint}>
          💡 Tip: Click any row to view & print full official receipt
        </span>
      </div>

      {/* Transactions Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type / Category</th>
              <th>Description & Reference</th>
              <th>Account</th>
              <th>Amount</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted" style={{ padding: '3rem 1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Search size={32} color="var(--text-muted)" />
                    <span>No transactions match your search or filter criteria.</span>
                    {(searchQuery || filterType !== 'all' || accountFilter !== 'all') && (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: '8px' }}
                        onClick={() => {
                          setSearchQuery('');
                          setFilterType('all');
                          setAccountFilter('all');
                        }}
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const isCredit = tx.transactionType === 'credit';
                return (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedReceiptTx(tx)}
                    style={{ cursor: 'pointer' }}
                    title="Click to view digital receipt"
                  >
                    <td style={{ whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      {tx.date}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isCredit ? 'var(--credit-light)' : 'var(--debit-light)',
                            color: isCredit ? 'var(--credit)' : 'var(--debit)'
                          }}
                        >
                          {isCredit ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                        </span>
                        <strong>{tx.type}</strong>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{tx.description}</p>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {tx.reference && (
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{tx.reference}</span>
                          )}
                          {tx.recipientOrSender && <span>• {tx.recipientOrSender}</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${tx.account === 'Savings' ? 'badge-savings' : 'badge-current'}`}>
                        {tx.account}
                      </span>
                    </td>
                    <td className={isCredit ? 'text-credit' : 'text-debit'}>
                      <strong>
                        {isCredit ? '+ ' : '- '}
                        {formatCurrency(tx.amount)}
                      </strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReceiptTx(tx);
                          }}
                          title="View Digital Receipt"
                        >
                          <Receipt size={15} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTransaction(tx.id);
                          }}
                          title="Delete Record"
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
  controlsBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  searchBox: {
    position: 'relative',
    flex: '1',
    minWidth: '260px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  searchInput: {
    paddingLeft: '2.4rem',
    paddingRight: '2rem',
    margin: 0
  },
  clearSearchBtn: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '2px'
  },
  filtersGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px'
  },
  pillGroup: {
    display: 'flex',
    gap: '4px'
  },
  selectFilter: {
    width: 'auto',
    padding: '0.5rem 2rem 0.5rem 0.85rem',
    fontSize: '0.825rem',
    margin: 0
  },
  summaryBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  countText: {
    fontWeight: 500
  },
  receiptHint: {
    fontSize: '0.75rem',
    fontStyle: 'italic'
  }
};
