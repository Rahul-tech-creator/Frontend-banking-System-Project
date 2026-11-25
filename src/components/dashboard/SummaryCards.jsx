import React from 'react';
import { useBank } from '../../hooks/useBank';
import { formatCurrency } from '../../utils/formatters';
import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight, ShieldCheck } from 'lucide-react';

export default function SummaryCards() {
  const { totalBalance, totalCredits, totalDebits, totalTransactionsCount } = useBank();

  const cards = [
    {
      id: 'balance',
      label: 'Total Net Worth',
      value: formatCurrency(totalBalance),
      subtext: 'Across Savings & Current',
      trend: 'Live Core Ledger',
      trendPositive: true,
      icon: <Wallet size={20} color="var(--primary)" />,
      iconBg: 'var(--primary-light)',
      borderColor: 'var(--primary)'
    },
    
    {
      id: 'credits',
      label: 'Monthly Inflow',
      value: `+${formatCurrency(totalCredits)}`,
      subtext: 'Deposits, Salary & Credits',
      trend: '+12.4% vs last period',
      trendPositive: true,
      icon: <TrendingUp size={20} color="var(--credit)" />,
      iconBg: 'var(--credit-light)',
      borderColor: 'var(--credit)',
      valueColor: 'var(--credit)'
    },
    {
      id: 'debits',
      label: 'Monthly Outflow',
      value: `-${formatCurrency(totalDebits)}`,
      subtext: 'Transfers, Bills & Spends',
      trend: 'Within budget limits',
      trendPositive: false,
      icon: <TrendingDown size={20} color="var(--debit)" />,
      iconBg: 'var(--debit-light)',
      borderColor: 'var(--debit)',
      valueColor: 'var(--debit)'
    },
    {
      id: 'transactions',
      label: 'Recorded Activities',
      value: totalTransactionsCount,
      subtext: 'Audited ledger items',
      trend: '100% Verified',
      trendPositive: true,
      icon: <ArrowLeftRight size={20} color="#8b5cf6" />,
      iconBg: 'rgba(139, 92, 246, 0.12)',
      borderColor: '#8b5cf6'
    }
  ];

  return (
    <div style={styles.grid}>
      {cards.map((card) => (
        <div
          key={card.id}
          className="card"
          style={{
            ...styles.card,
            borderTop: `3px solid ${card.borderColor}`
          }}
        >
          <div style={styles.header}>
            <span style={styles.label}>{card.label}</span>
            <div style={{ ...styles.iconWrapper, backgroundColor: card.iconBg }}>
              {card.icon}
            </div>
          </div>

          <div style={styles.body}>
            <h3
              style={{
                ...styles.value,
                color: card.valueColor || 'var(--text-primary)'
              }}
            >
              {card.value}
            </h3>
            <div style={styles.bottomRow}>
              <span style={styles.subtext}>{card.subtext}</span>
              <span
                style={{
                  ...styles.trendBadge,
                  backgroundColor: card.trendPositive ? 'var(--credit-light)' : 'var(--bg-muted)',
                  color: card.trendPositive ? 'var(--credit)' : 'var(--text-muted)'
                }}
              >
                {card.trend}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
    marginBottom: '28px'
  },
  card: {
    padding: '1.25rem 1.4rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--text-secondary)'
  },
  iconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  value: {
    fontSize: '1.65rem',
    fontWeight: 800,
    letterSpacing: '-0.03em'
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px'
  },
  subtext: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)'
  },
  trendBadge: {
    fontSize: '0.68rem',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: 'var(--radius-sm)'
  }
};
