import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEFAULT_USER,
  DEFAULT_ACCOUNTS,
  DEFAULT_TRANSACTIONS,
  SAVED_BENEFICIARIES,
  LOAN_CATEGORIES
} from '../data/initialData';
import {
  formatCurrency,
  getCurrentFormattedDate,
  generateTxId,
  generateReferenceNumber
} from '../utils/formatters';

const BankContext = createContext(null);

const STORAGE_KEY = 'myBankData_v3';
const THEME_STORAGE_KEY = 'myBankTheme';
const USERS_STORAGE_KEY = 'myBankUsers_v3';

export function BankProvider({ children }) {
  // Load registered users list
  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading users list:', e);
    }
    return [
      {
        username: 'admin',
        password: '1234',
        user: DEFAULT_USER
      }
    ];
  });

  // Current logged in user profile
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) return parsed.user;
      }
    } catch (e) {
      console.error('Error loading user profile:', e);
    }
    return DEFAULT_USER;
  });

  // Load login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.isLoggedIn);
      }
    } catch (e) {
      console.error('Error loading login state:', e);
    }
    return false;
  });

  // Accounts state (ensuring cardDetails and isFrozen defaults exist)
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accounts) {
          // Merge with defaults to guarantee all card properties exist
          return {
            Savings: {
              ...DEFAULT_ACCOUNTS.Savings,
              ...parsed.accounts.Savings,
              cardDetails: {
                ...DEFAULT_ACCOUNTS.Savings.cardDetails,
                ...(parsed.accounts.Savings?.cardDetails || {})
              }
            },
            Current: {
              ...DEFAULT_ACCOUNTS.Current,
              ...parsed.accounts.Current,
              cardDetails: {
                ...DEFAULT_ACCOUNTS.Current.cardDetails,
                ...(parsed.accounts.Current?.cardDetails || {})
              }
            }
          };
        }
      }
    } catch (e) {
      console.error('Error loading accounts:', e);
    }
    return DEFAULT_ACCOUNTS;
  });

  // Transactions ledger state
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.transactions)) return parsed.transactions;
      }
    } catch (e) {
      console.error('Error loading transactions:', e);
    }
    return DEFAULT_TRANSACTIONS;
  });

  // Beneficiaries list state
  const [beneficiaries, setBeneficiaries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.beneficiaries)) return parsed.beneficiaries;
      }
    } catch (e) {
      console.error('Error loading beneficiaries:', e);
    }
    return SAVED_BENEFICIARIES;
  });

  // Loans state
  const [loans, setLoans] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.loans)) return parsed.loans;
      }
    } catch (e) {
      console.error('Error loading loans:', e);
    }
    return [];
  });

  // Recurring payments state
  const [recurringPayments, setRecurringPayments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.recurringPayments)) return parsed.recurringPayments;
      }
    } catch (e) {
      console.error('Error loading recurring payments:', e);
    }
    return [];
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('deposit');

  // Preselected account for contextual actions
  const [preselectedAccount, setPreselectedAccount] = useState('Savings');

  // Card Management Modal state
  const [cardModalAccount, setCardModalAccount] = useState(null);

  // Profile Modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Selected transaction for digital receipt modal
  const [selectedReceiptTx, setSelectedReceiptTx] = useState(null);

  // Custom confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    isDanger: false,
    onConfirm: () => {}
  });

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Theme Management (Light / Dark)
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Sync theme attribute to documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync registered users list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    } catch (e) {
      console.error('Error saving users list:', e);
    }
  }, [usersList]);

  // Sync application state changes to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        isLoggedIn,
        user,
        accounts,
        transactions,
        beneficiaries,
        loans,
        recurringPayments
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }, [isLoggedIn, user, accounts, transactions, beneficiaries, loans, recurringPayments]);

  // Toast Helpers
  const addToast = (title, message = '', type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Confirmation Dialog helper
  const openConfirmDialog = ({ title, message, confirmText = 'Confirm', isDanger = false, onConfirm }) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmText,
      isDanger,
      onConfirm: () => {
        onConfirm();
        closeConfirmDialog();
      }
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // Quick action navigation with account preselection
  const preselectAccountForAction = (accountKey, targetTab) => {
    setPreselectedAccount(accountKey);
    setActiveTab(targetTab);
  };

  // Profile Management
  const updateUserProfile = (updatedFields) => {
    const updatedUser = {
      ...user,
      ...updatedFields
    };
    setUser(updatedUser);
    // Also update in registered users list
    setUsersList((prev) =>
      prev.map((u) => (u.user.id === user.id ? { ...u, user: updatedUser } : u))
    );
    addToast('Profile Updated', 'Your customer personal records have been saved.', 'success');
  };

  // Auth Functions: Login, Register, Logout
  const login = (username, password) => {
    const u = username.trim().toLowerCase();
    const p = password.trim();

    const matched = usersList.find(
      (entry) => entry.username.toLowerCase() === u && entry.password === p
    );

    if (matched) {
      setUser(matched.user);
      setIsLoggedIn(true);
      addToast('Welcome Back!', `Signed in as ${matched.user.name} (${matched.user.id})`, 'success');
      return { success: true };
    } else {
      addToast('Authentication Failed', 'Invalid username or password. Check credentials or register.', 'error');
      return { success: false, message: 'Invalid username or password!' };
    }
  };

  const registerUser = (username, password, fullName, email, phone) => {
    const cleanUser = username.trim();
    const cleanPass = password.trim();
    const cleanName = fullName.trim();

    if (!cleanUser || !cleanPass || !cleanName) {
      addToast('Missing Details', 'Please fill in username, password, and full name.', 'error');
      return { success: false, message: 'All required fields must be filled.' };
    }

    const existing = usersList.find(
      (u) => u.username.toLowerCase() === cleanUser.toLowerCase()
    );
    if (existing) {
      addToast('Username Taken', 'This username already exists. Please pick another one.', 'error');
      return { success: false, message: 'Username is already taken.' };
    }

    const newCustomerId = 'CUST' + Math.floor(1000 + Math.random() * 9000);
    const newUserProfile = {
      name: cleanName,
      id: newCustomerId,
      email: email.trim() || `${cleanUser.toLowerCase()}@mybank.in`,
      phone: phone.trim() || '+91 98000 00000',
      address: 'Registered Online Customer, MyBank Central',
      kycStatus: 'Verified',
      joinedDate: getCurrentFormattedDate()
    };

    const newEntry = {
      username: cleanUser,
      password: cleanPass,
      user: newUserProfile
    };

    setUsersList((prev) => [...prev, newEntry]);
    setUser(newUserProfile);
    setIsLoggedIn(true);
    addToast('Account Registered!', `Welcome to MyBank, ${cleanName}!`, 'success');
    return { success: true };
  };

  const logout = () => {
    openConfirmDialog({
      title: 'Confirm Logout',
      message: 'Are you sure you want to end your secure online banking session?',
      confirmText: 'Logout',
      isDanger: true,
      onConfirm: () => {
        setIsLoggedIn(false);
        addToast('Logged Out', 'You have been safely signed out.', 'info');
      }
    });
  };

  // Card Controls (Freeze / Unfreeze, PIN change, Limit update)
  const toggleFreezeCard = (accountKey) => {
    const current = accounts[accountKey];
    if (!current) return;

    const willFreeze = !current.isFrozen;
    setAccounts((prev) => ({
      ...prev,
      [accountKey]: {
        ...prev[accountKey],
        isFrozen: willFreeze,
        cardDetails: {
          ...prev[accountKey].cardDetails,
          status: willFreeze ? 'Frozen' : 'Active'
        }
      }
    }));

    if (willFreeze) {
      addToast(
        'Card & Account Locked',
        `${accountKey} Account and Debit Card are now frozen for security. Outgoing payments blocked.`,
        'error'
      );
    } else {
      addToast(
        'Card & Account Unlocked',
        `${accountKey} Account is active and ready for online transactions.`,
        'success'
      );
    }
  };

  const updateCardPin = (accountKey, newPin) => {
    if (!/^\d{4}$/.test(newPin)) {
      addToast('Invalid PIN', 'ATM PIN must be exactly 4 numeric digits.', 'error');
      return false;
    }

    setAccounts((prev) => ({
      ...prev,
      [accountKey]: {
        ...prev[accountKey],
        cardDetails: {
          ...prev[accountKey].cardDetails,
          pin: newPin
        }
      }
    }));

    addToast('PIN Updated', `New 4-digit security PIN set for ${accountKey} Card.`, 'success');
    return true;
  };

  const updateCardLimit = (accountKey, newLimit) => {
    const numLimit = Number(newLimit);
    if (isNaN(numLimit) || numLimit <= 0) {
      addToast('Invalid Limit', 'Limit must be greater than ₹0.', 'error');
      return false;
    }

    setAccounts((prev) => ({
      ...prev,
      [accountKey]: {
        ...prev[accountKey],
        cardDetails: {
          ...prev[accountKey].cardDetails,
          dailyLimit: numLimit
        }
      }
    }));

    addToast(
      'Daily Limit Updated',
      `Spending limit for ${accountKey} Card set to ${formatCurrency(numLimit)}.`,
      'success'
    );
    return true;
  };

  // Beneficiaries Management
  const addBeneficiary = ({ name, accountNumber, bank, ifsc }) => {
    const cleanName = name.trim();
    const cleanAcc = accountNumber.trim();
    const cleanBank = bank.trim() || 'Other Bank';
    const cleanIfsc = (ifsc || 'MYBK0009999').trim().toUpperCase();

    if (!cleanName || !cleanAcc) {
      addToast('Validation Error', 'Payee Name and Account Number are required.', 'error');
      return false;
    }

    const words = cleanName.split(' ');
    const initials =
      words.length > 1
        ? (words[0][0] + words[1][0]).toUpperCase()
        : cleanName.slice(0, 2).toUpperCase();

    const colors = ['#2563eb', '#7c3aed', '#059669', '#ea580c', '#db2777', '#0891b2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newBeneficiary = {
      id: 'b_' + Date.now(),
      name: cleanName,
      accountNumber: cleanAcc,
      bank: cleanBank,
      ifsc: cleanIfsc,
      initials,
      color: randomColor
    };

    setBeneficiaries((prev) => [...prev, newBeneficiary]);
    addToast('Payee Saved', `${cleanName} added to your verified beneficiaries list.`, 'success');
    return true;
  };

  const deleteBeneficiary = (id) => {
    const target = beneficiaries.find((b) => b.id === id);
    openConfirmDialog({
      title: 'Remove Beneficiary',
      message: `Are you sure you want to remove "${target?.name || 'this payee'}" from saved beneficiaries?`,
      confirmText: 'Remove Payee',
      isDanger: true,
      onConfirm: () => {
        setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
        addToast('Payee Removed', 'Beneficiary deleted successfully.', 'info');
      }
    });
  };

  // Deposit Money
  const depositMoney = (accountKey, amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast('Invalid Amount', 'Please enter a valid deposit amount greater than ₹0.', 'error');
      return false;
    }

    if (!accounts[accountKey]) {
      addToast('Error', 'Invalid account selected.', 'error');
      return false;
    }

    // Update balance
    setAccounts((prev) => ({
      ...prev,
      [accountKey]: {
        ...prev[accountKey],
        balance: prev[accountKey].balance + numAmount
      }
    }));

    // Record transaction
    const newTx = {
      id: generateTxId(),
      reference: generateReferenceNumber('DEP'),
      date: getCurrentFormattedDate(),
      type: 'Deposit',
      description: `Money Deposit to ${accountKey} Account`,
      account: accountKey,
      amount: numAmount,
      transactionType: 'credit',
      category: 'Deposit',
      status: 'Completed',
      recipientOrSender: 'Self / Cash Deposit'
    };

    setTransactions((prev) => [newTx, ...prev]);
    addToast(
      'Deposit Successful',
      `${formatCurrency(numAmount)} credited to your ${accountKey} Account.`,
      'success'
    );
    return true;
  };

  // Fund Transfer
  const transferMoney = (
    sourceAccount,
    receiverName,
    receiverAccount,
    amount,
    remarks = '',
    saveAsBeneficiary = false,
    beneficiaryBank = 'Bank Transfer'
  ) => {
    const cleanName = receiverName.trim();
    const cleanAcc = receiverAccount.trim();
    const numAmount = parseFloat(amount);

    if (!cleanName || !cleanAcc) {
      addToast('Missing Details', 'Please enter receiver name and account number.', 'error');
      return false;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      addToast('Invalid Amount', 'Please enter a valid transfer amount greater than ₹0.', 'error');
      return false;
    }

    const srcAcc = accounts[sourceAccount];
    if (!srcAcc) {
      addToast('Error', 'Source account not found.', 'error');
      return false;
    }

    if (srcAcc.isFrozen) {
      addToast(
        'Account Locked',
        `Your ${sourceAccount} Account is currently frozen. Please unfreeze it in Card Management before transacting.`,
        'error'
      );
      return false;
    }

    const limit = srcAcc.cardDetails?.dailyLimit || 100000;
    if (numAmount > limit) {
      addToast(
        'Daily Limit Exceeded',
        `Transfer exceeds your daily card/account limit of ${formatCurrency(limit)}. Adjust in Card Management.`,
        'error'
      );
      return false;
    }

    const currentBal = srcAcc.balance || 0;
    if (numAmount > currentBal) {
      addToast(
        'Insufficient Funds',
        `Your ${sourceAccount} Account balance is ${formatCurrency(currentBal)}.`,
        'error'
      );
      return false;
    }

    // Deduct
    setAccounts((prev) => ({
      ...prev,
      [sourceAccount]: {
        ...prev[sourceAccount],
        balance: prev[sourceAccount].balance - numAmount
      }
    }));

    // Record
    const newTx = {
      id: generateTxId(),
      reference: generateReferenceNumber('TRF'),
      date: getCurrentFormattedDate(),
      type: 'Fund Transfer',
      description: remarks
        ? `Transfer to ${cleanName} (${remarks})`
        : `Transfer to ${cleanName} (Acc: ${cleanAcc})`,
      account: sourceAccount,
      amount: numAmount,
      transactionType: 'debit',
      category: 'Transfer',
      status: 'Completed',
      recipientOrSender: cleanName,
      recipientAccount: cleanAcc
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Optionally save as new beneficiary if requested and not already present
    if (saveAsBeneficiary) {
      const alreadySaved = beneficiaries.some(
        (b) => b.accountNumber === cleanAcc
      );
      if (!alreadySaved) {
        addBeneficiary({
          name: cleanName,
          accountNumber: cleanAcc,
          bank: beneficiaryBank,
          ifsc: 'SBIN0001234'
        });
      }
    }

    addToast(
      'Transfer Successful',
      `${formatCurrency(numAmount)} sent to ${cleanName} from ${sourceAccount} Account.`,
      'success'
    );
    return true;
  };

  // Pay Utility Bill
  const payBill = (sourceAccount, billType, consumerNumber, amount, billerName = '') => {
    const cleanConsumerNo = consumerNumber.trim();
    const numAmount = parseFloat(amount);

    if (!cleanConsumerNo) {
      addToast('Missing Details', 'Please enter consumer/meter/account number.', 'error');
      return false;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      addToast('Invalid Amount', 'Please enter a valid bill amount greater than ₹0.', 'error');
      return false;
    }

    const srcAcc = accounts[sourceAccount];
    if (!srcAcc) {
      addToast('Error', 'Source account not found.', 'error');
      return false;
    }

    if (srcAcc.isFrozen) {
      addToast(
        'Account Locked',
        `Your ${sourceAccount} Account is currently frozen. Unfreeze it in Card Management before making payments.`,
        'error'
      );
      return false;
    }

    const availableBal = srcAcc.balance || 0;
    if (numAmount > availableBal) {
      addToast(
        'Insufficient Balance',
        `Your ${sourceAccount} Account balance is ${formatCurrency(availableBal)}.`,
        'error'
      );
      return false;
    }

    // Deduct
    setAccounts((prev) => ({
      ...prev,
      [sourceAccount]: {
        ...prev[sourceAccount],
        balance: prev[sourceAccount].balance - numAmount
      }
    }));

    // Record
    const newTx = {
      id: generateTxId(),
      reference: generateReferenceNumber('BIL'),
      date: getCurrentFormattedDate(),
      type: 'Bill Payment',
      description: `${billType} Bill Payment (${cleanConsumerNo})`,
      account: sourceAccount,
      amount: numAmount,
      transactionType: 'debit',
      category: 'Utilities',
      status: 'Completed',
      recipientOrSender: billerName || `${billType} Utility Board`,
      consumerNumber: cleanConsumerNo
    };

    setTransactions((prev) => [newTx, ...prev]);
    addToast(
      'Bill Paid Successfully',
      `${billType} bill of ${formatCurrency(numAmount)} paid from ${sourceAccount} Account.`,
      'success'
    );
    return true;
  };

  // Loans Lifecycle (Request, Approve & Disburse, Pay EMI, Cancel)
  const requestLoan = (loanType, amount, tenure, destinationAccount = 'Savings') => {
    const numAmount = parseFloat(amount);
    const numTenure = parseInt(tenure, 10);

    if (isNaN(numAmount) || numAmount <= 0) {
      addToast('Invalid Amount', 'Please enter a valid loan amount.', 'error');
      return false;
    }

    if (isNaN(numTenure) || numTenure <= 0) {
      addToast('Invalid Tenure', 'Please enter valid loan tenure in years.', 'error');
      return false;
    }

    const cat = LOAN_CATEGORIES.find((c) => c.id === loanType) || LOAN_CATEGORIES[0];
    const annualRate = cat.rate;
    const monthlyRate = annualRate / (12 * 100);
    const totalMonths = numTenure * 12;

    const monthlyEmi = Math.round(
      (numAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );

    const newLoan = {
      id: 'L' + (loans.length + 101),
      type: loanType,
      amount: numAmount,
      remainingPrincipal: numAmount,
      tenure: `${numTenure} Years`,
      tenureMonths: totalMonths,
      rate: annualRate,
      monthlyEmi,
      totalPaid: 0,
      emisPaid: 0,
      destinationAccount,
      status: 'Pending',
      appliedDate: getCurrentFormattedDate()
    };

    setLoans((prev) => [...prev, newLoan]);
    addToast(
      'Application Submitted',
      `${loanType} for ${formatCurrency(numAmount)} submitted. You can approve & disburse it instantly below.`,
      'success'
    );
    return true;
  };

  // Approve and disburse loan funds into borrower's account
  const approveAndDisburseLoan = (loanId) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return;

    const targetAccount = loan.destinationAccount || 'Savings';

    // Credit money to account
    setAccounts((prev) => ({
      ...prev,
      [targetAccount]: {
        ...prev[targetAccount],
        balance: prev[targetAccount].balance + loan.amount
      }
    }));

    // Add Credit transaction to ledger
    const newTx = {
      id: generateTxId(),
      reference: generateReferenceNumber('LN'),
      date: getCurrentFormattedDate(),
      type: 'Loan Disbursement',
      description: `Disbursement for ${loan.type} (${loan.id})`,
      account: targetAccount,
      amount: loan.amount,
      transactionType: 'credit',
      category: 'Loan',
      status: 'Completed',
      recipientOrSender: 'MyBank Credit Department'
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update loan status to Active
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              status: 'Active',
              disbursedDate: getCurrentFormattedDate(),
              remainingPrincipal: loan.amount
            }
          : l
      )
    );

    addToast(
      'Loan Approved & Disbursed! 🎉',
      `${formatCurrency(loan.amount)} has been credited to your ${targetAccount} Account.`,
      'success'
    );
  };

  // Pay monthly EMI on an active loan
  const payLoanEmi = (loanId, sourceAccount = 'Savings') => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan || loan.status !== 'Active') return;

    const emi = loan.monthlyEmi;
    const srcAcc = accounts[sourceAccount];

    if (srcAcc.isFrozen) {
      addToast(
        'Account Locked',
        `${sourceAccount} Account is frozen. Unfreeze it before paying EMI.`,
        'error'
      );
      return;
    }

    if (srcAcc.balance < emi) {
      addToast(
        'Insufficient Balance',
        `Need ${formatCurrency(emi)} for EMI, but ${sourceAccount} balance is ${formatCurrency(srcAcc.balance)}.`,
        'error'
      );
      return;
    }

    // Deduct EMI from account
    setAccounts((prev) => ({
      ...prev,
      [sourceAccount]: {
        ...prev[sourceAccount],
        balance: prev[sourceAccount].balance - emi
      }
    }));

    // Record Debit transaction
    const newTx = {
      id: generateTxId(),
      reference: generateReferenceNumber('EMI'),
      date: getCurrentFormattedDate(),
      type: 'Loan EMI Payment',
      description: `Monthly EMI repayment for ${loan.type} (${loan.id})`,
      account: sourceAccount,
      amount: emi,
      transactionType: 'debit',
      category: 'Loan EMI',
      status: 'Completed',
      recipientOrSender: 'MyBank Loan Department'
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update loan progress
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          const newEmisPaid = (l.emisPaid || 0) + 1;
          const newTotalPaid = (l.totalPaid || 0) + emi;
          const newRemaining = Math.max(0, (l.remainingPrincipal || l.amount) - (emi * 0.7)); // principal reduction estimate
          const isFinished = newRemaining <= 0 || newEmisPaid >= (l.tenureMonths || 36);

          return {
            ...l,
            emisPaid: newEmisPaid,
            totalPaid: newTotalPaid,
            remainingPrincipal: newRemaining,
            status: isFinished ? 'Fully Repaid' : 'Active'
          };
        }
        return l;
      })
    );

    addToast(
      'EMI Payment Recorded',
      `Monthly EMI of ${formatCurrency(emi)} paid from ${sourceAccount} Account.`,
      'success'
    );
  };

  // Cancel pending loan
  const cancelLoan = (loanId) => {
    openConfirmDialog({
      title: 'Cancel Loan Application',
      message: 'Are you sure you want to withdraw this loan application?',
      confirmText: 'Withdraw Application',
      isDanger: true,
      onConfirm: () => {
        setLoans((prev) => prev.filter((l) => l.id !== loanId));
        addToast('Application Withdrawn', `Loan ${loanId} cancelled.`, 'info');
      }
    });
  };

  // Recurring Payments (Add, Toggle Pause, Process/Execute Now, Delete)
  const addRecurringPayment = (name, amount, frequency, date, sourceAccount = 'Savings') => {
    const cleanName = name.trim();
    const numAmount = parseFloat(amount);

    if (!cleanName) {
      addToast('Missing Name', 'Please enter payment name / subscription title.', 'error');
      return false;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      addToast('Invalid Amount', 'Please enter a valid recurring payment amount.', 'error');
      return false;
    }

    if (!date) {
      addToast('Missing Date', 'Please select next scheduled execution date.', 'error');
      return false;
    }

    const newPayment = {
      id: Date.now(),
      name: cleanName,
      amount: numAmount,
      frequency,
      date,
      sourceAccount,
      status: 'Active',
      lastExecuted: null
    };

    setRecurringPayments((prev) => [...prev, newPayment]);
    addToast(
      'Recurring Payment Scheduled',
      `${cleanName} scheduled for ${formatCurrency(numAmount)} (${frequency}) from ${sourceAccount} Account.`,
      'success'
    );
    return true;
  };

  const toggleRecurringPaymentStatus = (id) => {
    setRecurringPayments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'Active' ? 'Paused' : 'Active';
          addToast(
            nextStatus === 'Active' ? 'Mandate Resumed' : 'Mandate Paused',
            `Automated debit for "${item.name}" is now ${nextStatus.toLowerCase()}.`,
            'info'
          );
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const processRecurringPayment = (id) => {
    const target = recurringPayments.find((item) => item.id === id);
    if (!target) return;

    const sourceAcc = target.sourceAccount || 'Savings';
    const acc = accounts[sourceAcc];

    if (acc.isFrozen) {
      addToast(
        'Debit Blocked',
        `${sourceAcc} Account is frozen. Unfreeze it before executing scheduled debit.`,
        'error'
      );
      return;
    }

    if (acc.balance < target.amount) {
      addToast(
        'Insufficient Balance',
        `Cannot execute ${target.name}. Need ${formatCurrency(target.amount)}, balance is ${formatCurrency(acc.balance)}.`,
        'error'
      );
      return;
    }

    // Deduct
    setAccounts((prev) => ({
      ...prev,
      [sourceAcc]: {
        ...prev[sourceAcc],
        balance: prev[sourceAcc].balance - target.amount
      }
    }));

    // Record Debit transaction
    const newTx = {
      id: generateTxId(),
      reference: generateReferenceNumber('AUT'),
      date: getCurrentFormattedDate(),
      type: 'Auto-Debit',
      description: `Scheduled mandate: ${target.name} (${target.frequency})`,
      account: sourceAcc,
      amount: target.amount,
      transactionType: 'debit',
      category: 'Subscription',
      status: 'Completed',
      recipientOrSender: target.name
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Advance next date
    const cur = new Date(target.date || new Date());
    if (target.frequency === 'Weekly') {
      cur.setDate(cur.getDate() + 7);
    } else if (target.frequency === 'Yearly') {
      cur.setFullYear(cur.getFullYear() + 1);
    } else {
      cur.setMonth(cur.getMonth() + 1);
    }
    const nextFormatted = cur.toISOString().split('T')[0];

    setRecurringPayments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              date: nextFormatted,
              lastExecuted: getCurrentFormattedDate()
            }
          : item
      )
    );

    addToast(
      'Mandate Executed Instantly',
      `${formatCurrency(target.amount)} debited for "${target.name}". Next execution scheduled for ${nextFormatted}.`,
      'success'
    );
  };

  const deleteRecurringPayment = (id) => {
    const target = recurringPayments.find((item) => item.id === id);
    openConfirmDialog({
      title: 'Cancel Recurring Payment',
      message: `Are you sure you want to cancel automated payment mandate for "${target?.name || 'this service'}"?`,
      confirmText: 'Cancel Mandate',
      isDanger: true,
      onConfirm: () => {
        setRecurringPayments((prev) => prev.filter((item) => item.id !== id));
        addToast('Payment Cancelled', 'Recurring mandate cancelled successfully.', 'info');
      }
    });
  };

  // Delete transaction from ledger
  const deleteTransaction = (txId) => {
    const tx = transactions.find((t) => t.id === txId);
    openConfirmDialog({
      title: 'Remove Transaction Record',
      message: `Are you sure you want to remove record "${tx?.description || txId}" from transaction ledger?`,
      confirmText: 'Delete Record',
      isDanger: true,
      onConfirm: () => {
        setTransactions((prev) => prev.filter((t) => t.id !== txId));
        addToast('Transaction Removed', 'Record deleted from ledger.', 'info');
      }
    });
  };

  // Reset Demo Data
  const resetDemoData = () => {
    openConfirmDialog({
      title: 'Reset Demo Data',
      message: 'This will reset all balances, transactions, loans, beneficiaries, and recurring payments to initial state. Are you sure?',
      confirmText: 'Reset Everything',
      isDanger: true,
      onConfirm: () => {
        setUser(DEFAULT_USER);
        setAccounts(DEFAULT_ACCOUNTS);
        setTransactions(DEFAULT_TRANSACTIONS);
        setBeneficiaries(SAVED_BENEFICIARIES);
        setLoans([]);
        setRecurringPayments([]);
        localStorage.removeItem(STORAGE_KEY);
        addToast('Data Reset', 'All accounts, cards, and ledgers restored to defaults.', 'success');
      }
    });
  };

  // Computed metrics
  const totalBalance = (accounts.Savings?.balance || 0) + (accounts.Current?.balance || 0);

  const totalCredits = transactions
    .filter((tx) => tx.transactionType === 'credit')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  const totalDebits = transactions
    .filter((tx) => tx.transactionType === 'debit')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  const totalTransactionsCount = transactions.length;

  return (
    <BankContext.Provider
      value={{
        user,
        updateUserProfile,
        isLoggedIn,
        accounts,
        transactions,
        beneficiaries,
        addBeneficiary,
        deleteBeneficiary,
        loans,
        recurringPayments,
        activeTab,
        setActiveTab,
        preselectedAccount,
        setPreselectedAccount,
        preselectAccountForAction,
        cardModalAccount,
        setCardModalAccount,
        isProfileModalOpen,
        setIsProfileModalOpen,
        selectedReceiptTx,
        setSelectedReceiptTx,
        confirmDialog,
        closeConfirmDialog,
        openConfirmDialog,
        toasts,
        addToast,
        removeToast,
        theme,
        toggleTheme,
        login,
        registerUser,
        logout,
        toggleFreezeCard,
        updateCardPin,
        updateCardLimit,
        depositMoney,
        transferMoney,
        payBill,
        requestLoan,
        approveAndDisburseLoan,
        payLoanEmi,
        cancelLoan,
        addRecurringPayment,
        toggleRecurringPaymentStatus,
        processRecurringPayment,
        deleteRecurringPayment,
        deleteTransaction,
        resetDemoData,
        totalBalance,
        totalCredits,
        totalDebits,
        totalTransactionsCount
      }}
    >
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
}
