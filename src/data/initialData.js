export const DEFAULT_USER = {
  name: 'Abhi',
  id: 'CUST1001',
  email: 'abhi@mybank.in',
  phone: '+91 98765 43210',
  address: '42, Cyber City, Hitec City, Hyderabad - 500081',
  kycStatus: 'Verified',
  joinedDate: 'January 2024'
};

export const DEFAULT_ACCOUNTS = {
  Savings: {
    id: 'acc_savings',
    name: 'Savings Account',
    accountNumber: '****4521',
    fullAccountNumber: '100245218901',
    ifsc: 'MYBK0001042',
    balance: 45500,
    interestRate: '4.2% p.a.',
    type: 'Savings',
    currency: 'INR',
    isFrozen: false,
    cardDetails: {
      cardType: 'VISA Platinum Debit',
      cardNumber: '4521 8901 2345 6789',
      cvv: '482',
      expiry: '10/29',
      pin: '1234',
      dailyLimit: 50000,
      status: 'Active'
    }
  },
  Current: {
    id: 'acc_current',
    name: 'Current Account',
    accountNumber: '****7823',
    fullAccountNumber: '100278234509',
    ifsc: 'MYBK0001042',
    balance: 82300,
    overdraftLimit: 100000,
    type: 'Current',
    currency: 'INR',
    isFrozen: false,
    cardDetails: {
      cardType: 'MasterCard Business Debit',
      cardNumber: '5412 7823 9012 3456',
      cvv: '719',
      expiry: '08/28',
      pin: '5678',
      dailyLimit: 100000,
      status: 'Active'
    }
  }
};

export const DEFAULT_TRANSACTIONS = [
  {
    id: 1,
    reference: 'REF-SAL-98210',
    date: '01-10-2026',
    type: 'Salary Credit',
    description: 'Monthly Salary Credit',
    account: 'Savings',
    amount: 50000,
    transactionType: 'credit',
    category: 'Salary',
    status: 'Completed',
    recipientOrSender: 'Employer Corp Ltd'
  },
  {
    id: 2,
    reference: 'REF-BIL-19402',
    date: '29-09-2026',
    type: 'Bill Payment',
    description: 'Electricity Bill',
    account: 'Savings',
    amount: 2000,
    transactionType: 'debit',
    category: 'Utilities',
    status: 'Completed',
    recipientOrSender: 'State Electricity Board'
  },
  {
    id: 3,
    reference: 'REF-SHP-88231',
    date: '27-09-2026',
    type: 'Shopping',
    description: 'Shopping Expense',
    account: 'Savings',
    amount: 3500,
    transactionType: 'debit',
    category: 'Shopping',
    status: 'Completed',
    recipientOrSender: 'Amazon India'
  },
  {
    id: 4,
    reference: 'REF-REC-55102',
    date: '25-09-2026',
    type: 'Bill Payment',
    description: 'Mobile Recharge',
    account: 'Current',
    amount: 500,
    transactionType: 'debit',
    category: 'Recharge',
    status: 'Completed',
    recipientOrSender: 'Jio Prepaid Telecom'
  }
];

export const SAVED_BENEFICIARIES = [
  {
    id: 'b1',
    name: 'Rahul Sharma',
    accountNumber: '1234567890',
    bank: 'HDFC Bank',
    ifsc: 'HDFC0001234',
    initials: 'RS',
    color: '#2563eb'
  },
  {
    id: 'b2',
    name: 'Priya Patel',
    accountNumber: '9876543211',
    bank: 'ICICI Bank',
    ifsc: 'ICIC0005678',
    initials: 'PP',
    color: '#7c3aed'
  },
  {
    id: 'b3',
    name: 'Amit Verma',
    accountNumber: '4433221100',
    bank: 'Axis Bank',
    ifsc: 'UTIB0009988',
    initials: 'AV',
    color: '#059669'
  },
  {
    id: 'b4',
    name: 'Sneha Rao',
    accountNumber: '6677889900',
    bank: 'State Bank of India',
    ifsc: 'SBIN0004521',
    initials: 'SR',
    color: '#ea580c'
  }
];

export const BILL_CATEGORIES = [
  { id: 'Electricity', label: 'Electricity', icon: 'Zap', placeholder: 'ELEC99823', sampleBiller: 'State Power Distribution Corp' },
  { id: 'Water', label: 'Water', icon: 'Droplets', placeholder: 'WATR44120', sampleBiller: 'Municipal Water Board' },
  { id: 'Internet', label: 'Internet', icon: 'Wifi', placeholder: 'FIBER88219', sampleBiller: 'Airtel Broadband Ltd' },
  { id: 'Mobile', label: 'Mobile', icon: 'Smartphone', placeholder: '9876543210', sampleBiller: 'Jio Telecom Circle' },
  { id: 'Gas', label: 'Piped Gas', icon: 'Flame', placeholder: 'GAS883491', sampleBiller: 'Indraprastha Gas Limited' }
];

export const LOAN_CATEGORIES = [
  { id: 'Personal Loan', rate: 10.5, maxTenure: 5, minAmount: 10000, maxAmount: 1500000 },
  { id: 'Home Loan', rate: 8.4, maxTenure: 30, minAmount: 500000, maxAmount: 10000000 },
  { id: 'Education Loan', rate: 9.1, maxTenure: 10, minAmount: 50000, maxAmount: 4000000 }
];
