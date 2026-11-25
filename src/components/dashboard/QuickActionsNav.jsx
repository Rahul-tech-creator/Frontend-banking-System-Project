import React from 'react';
import { useBank } from '../../hooks/useBank';
import {
  ArrowDownToLine,
  SendHorizontal,
  Zap,
  FileText,
  Repeat,
  Clock,
  FileSpreadsheet
} from 'lucide-react';



export default function QuickActionsNav() {
  const { activeTab, setActiveTab, loans, recurringPayments } = useBank();

  
  const tabs = [
    { id: 'deposit', label: 'Deposit Money', icon: <ArrowDownToLine size={16} /> },
    { id: 'transfer', label: 'Fund Transfer', icon: <SendHorizontal size={16} /> },
    { id: 'bills', label: 'Pay Bills', icon: <Zap size={16} /> },
    {
      id: 'loan',
      label: 'Loans & EMI',
      icon: <FileText size={16} />,
      badge: loans.length > 0 ? loans.length : null
    },
    {
      id: 'recurring',
      label: 'Recurring Mandates',
      icon: <Repeat size={16} />,
      badge: recurringPayments.length > 0 ? recurringPayments.length : null
    },
    { id: 'transactions', label: 'Transactions Ledger', icon: <Clock size={16} /> },
    { id: 'statement', label: 'Account Statement', icon: <FileSpreadsheet size={16} /> }
  ];

  return (
    <nav style={styles.navContainer} aria-label="Banking Feature Tabs">
      <div style={styles.scrollWrapper}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tabBtn,
                ...(isActive ? styles.activeTabBtn : {})
              }}
              className="btn"
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    ...styles.tabBadge,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--primary-light)',
                    color: isActive ? '#ffffff' : 'var(--primary)'
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const styles = {
  navContainer: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: 'var(--radius-lg)',
    padding: '6px',
    marginBottom: '24px',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-xs)'
  },
  scrollWrapper: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    padding: '2px'
  },
  tabBtn: {
    flex: 'none',
    padding: '9px 16px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all var(--transition-fast)'
  },
  activeTabBtn: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    boxShadow: '0 2px 8px var(--primary-glow)'
  },
  tabBadge: {
    padding: '1px 6px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.68rem',
    fontWeight: 700
  }
};
