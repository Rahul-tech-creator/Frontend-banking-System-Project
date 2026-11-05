import React from 'react';
import { useBank } from './hooks/useBank';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ToastContainer from './components/common/ToastContainer';
import ReceiptModal from './components/modals/ReceiptModal';
import ConfirmDialog from './components/common/ConfirmDialog';
import CardManagementModal from './components/modals/CardManagementModal';
import UserProfileModal from './components/modals/UserProfileModal';

export default function App() {
  const { isLoggedIn } = useBank();

  return (
    <>
      {isLoggedIn ? <DashboardPage /> : <LoginPage />}

      {/* Global Overlays & Modals */}
      <ToastContainer />
      <ReceiptModal />
      <CardManagementModal />
      <UserProfileModal />
      <ConfirmDialog />
    </>
  );
}
