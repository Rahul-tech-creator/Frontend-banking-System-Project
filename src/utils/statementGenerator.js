import { formatCurrency, getCurrentFormattedDate } from './formatters';

/**
 * Calculates running balance for an array of transactions against current closing balance
 */
export function calculateRunningBalances(transactions, currentBalance) {
  // Sort oldest to newest to calculate running balance forward
  const sorted = [...transactions].sort((a, b) => a.id - b.id);

  // Calculate opening balance before first transaction
  let balance = currentBalance;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const tx = sorted[i];
    sorted[i] = { ...tx, runningBalance: balance };
    if (tx.transactionType === 'credit') {
      balance -= Number(tx.amount) || 0;
    } else {
      balance += Number(tx.amount) || 0;
    }
  }

  // Return back sorted newest to oldest for display
  return sorted.sort((a, b) => b.id - a.id);
}

/**
 * Generates and triggers download of official text statement file (.txt)
 */
export function downloadTextStatement(accountKey, accountObj, transactions, user = { name: 'Abhi', id: 'CUST1001' }) {
  const currentDate = getCurrentFormattedDate();
  const accTransactions = transactions.filter((tx) => tx.account === accountKey);
  const withRunningBal = calculateRunningBalances(accTransactions, accountObj.balance);

  const totalCredits = accTransactions
    .filter((tx) => tx.transactionType === 'credit')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  const totalDebits = accTransactions
    .filter((tx) => tx.transactionType === 'debit')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  let content = '========================================================================\n';
  content += '                     MYBANK DIGITAL BANKING CORP                        \n';
  content += '                   OFFICIAL CUSTOMER ACCOUNT STATEMENT                  \n';
  content += '========================================================================\n';
  content += `Account Holder   : ${user.name}\n`;
  content += `Customer ID      : ${user.id}\n`;
  content += `Account Number   : ${accountObj.accountNumber} (Full: ${accountObj.fullAccountNumber || accountObj.accountNumber})\n`;
  content += `Account Category : ${accountKey} Account\n`;
  content += `IFSC Code        : ${accountObj.ifsc || 'MYBK0001042'}\n`;
  content += `MICR Code        : 400024012\n`;
  content += `Branch Address   : Central Tower, Bandra Kurla Complex, Mumbai 400051\n`;
  content += `Statement Date   : ${currentDate}\n`;
  content += '------------------------------------------------------------------------\n';
  content += `Total Credits (+) : ${formatCurrency(totalCredits)}\n`;
  content += `Total Debits (-)  : ${formatCurrency(totalDebits)}\n`;
  content += `Closing Balance  : ${formatCurrency(accountObj.balance)}\n`;
  content += '========================================================================\n\n';

  content += 'TRANSACTION LEDGER:\n';
  content += '------------------------------------------------------------------------\n';
  content += 'DATE       | TYPE            | DR / CR      | BALANCE      | DESCRIPTION\n';
  content += '------------------------------------------------------------------------\n';

  if (withRunningBal.length === 0) {
    content += 'No transaction records found for this period.\n';
  } else {
    withRunningBal.forEach((tx) => {
      const sign = tx.transactionType === 'credit' ? '+' : '-';
      const amountStr = `${sign} ₹${Number(tx.amount).toLocaleString('en-IN')}`;
      const balStr = `₹${Number(tx.runningBalance || 0).toLocaleString('en-IN')}`;
      const datePad = (tx.date || '').padEnd(10, ' ');
      const typePad = (tx.type || '').slice(0, 15).padEnd(15, ' ');
      const amtPad = amountStr.padEnd(12, ' ');
      const balPad = balStr.padEnd(12, ' ');
      content += `${datePad} | ${typePad} | ${amtPad} | ${balPad} | ${tx.description}\n`;
    });
  }

  content += '========================================================================\n';
  content += 'Authentication   : Authenticated Computer Generated Copy\n';
  content += 'Core System      : Finacle Digital Switch 2026.4\n';
  content += 'Thank you for banking with MyBank Corporation!\n';
  content += '========================================================================\n';

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const filename = `MyBank_Statement_${accountKey}_${currentDate.replace(/-/g, '')}.txt`;

  downloadBlob(blob, filename);
}

/**
 * Exports transaction history into standard CSV format for Excel/Sheets
 */
export function exportTransactionsCSV(transactions, accountFilter = 'All') {
  const currentDate = getCurrentFormattedDate();
  const filtered = accountFilter === 'All' 
    ? transactions 
    : transactions.filter((t) => t.account === accountFilter);

  const headers = ['Transaction ID', 'Date', 'Type', 'Description', 'Account', 'Direction', 'Amount (INR)', 'Reference'];
  const rows = filtered.map((tx) => [
    tx.id,
    `"${tx.date}"`,
    `"${tx.type}"`,
    `"${(tx.description || '').replace(/"/g, '""')}"`,
    `"${tx.account}"`,
    tx.transactionType.toUpperCase(),
    tx.amount,
    `"${tx.reference || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `MyBank_Transactions_${accountFilter}_${currentDate.replace(/-/g, '')}.csv`;

  downloadBlob(blob, filename);
}

/**
 * Helper to download a Blob file in the browser
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
