import React from 'react';
import { useBank } from '../../hooks/useBank';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Sparkles } from 'lucide-react';

export default function CashflowAnalytics() {
  const { transactions, totalCredits, totalDebits } = useBank();

  // Aggregate spending by category
  const categoryTotals = transactions.reduce((acc, tx) => {
    const cat = tx.category || tx.type || 'Other';
    if (!acc[cat]) {
      acc[cat] = { total: 0, type: tx.transactionType };
    }
    acc[cat].total += Number(tx.amount) || 0;
    return acc;
  }, {});

  const categories = Object.entries(categoryTotals).map(([name, data]) => ({
    name,
    amount: data.total,
    type: data.type
  }));

  const totalFlow = totalCredits + totalDebits;
  const creditPercent = totalFlow > 0 ? Math.round((totalCredits / totalFlow) * 100) : 50;
  const debitPercent = totalFlow > 0 ? 100 - creditPercent : 50;
  const netSavings = totalCredits - totalDebits;
  const savingsRate = totalCredits > 0 ? Math.max(0, Math.round((netSavings / totalCredits) * 100)) : 0;

  return (
    <div className="card" style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={styles.iconCircle}>
            <PieChart size={18} color="var(--primary)" />
          </div>
          <div>
            <h3 style={styles.title}>Cash Flow & Spending Breakdown</h3>
            <p style={styles.subtitle}>
              Live financial distribution across income, transfers, bills, and lifestyle categories
            </p>
          </div>
        </div>

        <div style={styles.netSavingsBadge}>
          <span style={styles.netLabel}>Net Cash Flow:</span>
          <strong
            style={{
              color: netSavings >= 0 ? 'var(--credit)' : 'var(--debit)',
              fontSize: '0.95rem'
            }}
          >
            {netSavings >= 0 ? '+' : ''} {formatCurrency(netSavings)}
          </strong>
          {totalCredits > 0 && (
            <span style={styles.savingsRateTag}>
              {savingsRate}% Saved
            </span>
          )}
        </div>
      </div>

      {/* Inflow vs Outflow Ratio Bar */}
      <div style={styles.ratioSection}>
        <div style={styles.ratioLabels}>
          <span style={{ ...styles.ratioText, color: 'var(--credit)' }}>
            <TrendingUp size={14} /> Total Inflow: {creditPercent}% ({formatCurrency(totalCredits)})
          </span>
          <span style={{ ...styles.ratioText, color: 'var(--debit)' }}>
            <TrendingDown size={14} /> Total Outflow: {debitPercent}% ({formatCurrency(totalDebits)})
          </span>
        </div>

        <div style={styles.barTrack}>
          <div
            style={{
              ...styles.barSegment,
              width: `${creditPercent}%`,
              backgroundColor: 'var(--credit)'
            }}
            title={`Credits: ${creditPercent}%`}
          />
          <div
            style={{
              ...styles.barSegment,
              width: `${debitPercent}%`,
              backgroundColor: 'var(--debit)'
            }}
            title={`Debits: ${debitPercent}%`}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div style={styles.categoryGrid}>
        {categories.slice(0, 6).map((cat) => {
          const isCredit = cat.type === 'credit';
          const maxBase = isCredit ? totalCredits || 1 : totalDebits || 1;
          const share = Math.min(100, Math.round((cat.amount / maxBase) * 100));

          return (
            <div key={cat.name} style={styles.categoryItem}>
              <div style={styles.categoryHeader}>
                <span style={styles.categoryName}>{cat.name}</span>
                <span style={styles.shareBadge}>{share}%</span>
              </div>
              <div style={styles.catAmountRow}>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: isCredit ? 'var(--credit)' : 'var(--debit)'
                  }}
                >
                  {isCredit ? '+' : '-'} {formatCurrency(cat.amount)}
                </span>
              </div>
              <div style={styles.categoryMiniTrack}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '4px',
                    backgroundColor: isCredit ? 'var(--credit)' : 'var(--debit)',
                    width: `${share}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.4rem',
    marginBottom: '28px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '18px'
  },
  iconCircle: {
    width: '38px',
    height: '38px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '1.05rem',
    fontWeight: 700
  },
  subtitle: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)'
  },
  netSavingsBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    backgroundColor: 'var(--bg-muted)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-full)'
  },
  netLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  savingsRateTag: {
    fontSize: '0.7rem',
    fontWeight: 800,
    backgroundColor: 'var(--credit-light)',
    color: 'var(--credit)',
    padding: '2px 6px',
    borderRadius: 'var(--radius-full)'
  },
  ratioSection: {
    marginBottom: '16px'
  },
  ratioLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px'
  },
  ratioText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.8rem',
    fontWeight: 600
  },
  barTrack: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    display: 'flex'
  },
  barSegment: {
    height: '100%',
    transition: 'width 0.4s ease'
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
    paddingTop: '14px',
    borderTop: '1px solid var(--border-subtle)'
  },
  categoryItem: {
    backgroundColor: 'var(--bg-muted)',
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryName: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-secondary)'
  },
  shareBadge: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: 600
  },
  catAmountRow: {
    display: 'flex',
    alignItems: 'center'
  },
  categoryMiniTrack: {
    width: '100%',
    height: '4px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '2px',
    overflow: 'hidden'
  }
};
