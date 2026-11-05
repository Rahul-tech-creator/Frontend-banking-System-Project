import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import SummaryCards from '../components/dashboard/SummaryCards';
import AccountCard from '../components/dashboard/AccountCard';
import CashflowAnalytics from '../components/dashboard/CashflowAnalytics';
import QuickActionsNav from '../components/dashboard/QuickActionsNav';

import DepositSection from '../components/sections/DepositSection';
import TransferSection from '../components/sections/TransferSection';
import BillPaySection from '../components/sections/BillPaySection';
import LoanSection from '../components/sections/LoanSection';
import RecurringSection from '../components/sections/RecurringSection';
import TransactionsSection from '../components/sections/TransactionsSection';
import StatementSection from '../components/sections/StatementSection';

import { useBank } from '../hooks/useBank';

export default function DashboardPage() {
  const { activeTab } = useBank();

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'deposit':
        return <DepositSection />;
      case 'transfer':
        return <TransferSection />;
      case 'bills':
        return <BillPaySection />;
      case 'loan':
        return <LoanSection />;
      case 'recurring':
        return <RecurringSection />;
      case 'transactions':
        return <TransactionsSection />;
      case 'statement':
        return <StatementSection />;
      default:
        return <DepositSection />;
    }
  };

  return (
    <div style={styles.page}>
      <Header />

      <main style={styles.main}>
        {/* 1. Top Summary Metric Cards */}
        <SummaryCards />

        {/* 2. Dual Account Cards (Savings & Current) */}
        <AccountCard />

        {/* 3. Cashflow & Spending Analytics Bar */}
        <CashflowAnalytics />

        {/* 4. Feature Navigation Tabs */}
        <QuickActionsNav />

        {/* 5. Active Feature Content Section */}
        <div style={styles.activeSectionContainer}>
          {renderActiveSection()}
        </div>
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-app)'
  },
  main: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '24px 20px',
    flex: 1
  },
  activeSectionContainer: {
    marginTop: '8px'
  }
};
