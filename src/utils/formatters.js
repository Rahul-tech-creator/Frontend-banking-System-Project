/**
 * Formats a numeric value into Indian Rupee format (₹45,500)
 */
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN');
}

/**
 * Formats a Date object or string into DD-MM-YYYY format
 */
export function getCurrentFormattedDate(dateInput = new Date()) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/**
 * Generates a unique transaction identifier
 */
export function generateTxId() {
  return Date.now();
}

/**
 * Generates an official looking alphanumeric reference number
 */
export function generateReferenceNumber(prefix = 'MB') {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${random}`;
}

/**
 * Masks account number for secure UI display
 */
export function maskAccountNumber(accNo) {
  if (!accNo) return '****0000';
  if (accNo.startsWith('****')) return accNo;
  const str = String(accNo);
  const last4 = str.slice(-4);
  return `****${last4}`;
}
