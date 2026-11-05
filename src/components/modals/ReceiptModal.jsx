import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useBank } from '../../hooks/useBank';
import { formatCurrency } from '../../utils/formatters';
import {
  Printer,
  CheckCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';

export default function ReceiptModal() {
  const { selectedReceiptTx, setSelectedReceiptTx, user, addToast } = useBank();
  const [copied, setCopied] = useState(false);

  if (!selectedReceiptTx) return null;

  const tx = selectedReceiptTx;
  const isCredit = tx.transactionType === 'credit';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    const ref = tx.reference || `TXN-${tx.id}`;
    navigator.clipboard.writeText(ref);
    setCopied(true);
    addToast('Copied Reference', `${ref} copied to clipboard.`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={Boolean(selectedReceiptTx)}
      onClose={() => setSelectedReceiptTx(null)}
      title="Official Transaction Receipt"
      maxWidth="500px"
    >
      <div style={styles.receiptBody} className="printable-receipt">
        {/* Top Header */}
        <div style={styles.topHeader}>
          <div style={styles.bankBadge}>
            <span style={styles.bankIcon}>🏦</span>
            <div>
              <span style={styles.bankTitle}>MyBank Online</span>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Digital Payment Switch</p>
            </div>
          </div>
          <div style={styles.statusBadge}>
            <ShieldCheck size={14} color="var(--credit)" />
            <span>Success</span>
          </div>
        </div>

        {/* Amount Section */}
        <div style={styles.amountSection}>
          <span style={styles.amountLabel}>Total Transaction Amount</span>
          <h2
            style={{
              ...styles.amountValue,
              color: isCredit ? 'var(--credit)' : 'var(--debit)'
            }}
          >
            {isCredit ? '+' : '-'} {formatCurrency(tx.amount)}
          </h2>
          <div style={styles.typeBadge}>
            {isCredit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
            <span>{tx.type}</span>
          </div>
        </div>

        {/* Detailed Grid */}
        <div style={styles.receiptGrid}>
          <div style={styles.receiptRow}>
            <span style={styles.label}>Reference Number</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ ...styles.value, fontFamily: 'var(--font-mono)' }}>
                {tx.reference || `TXN-${tx.id}`}
              </span>
              <button
                type="button"
                onClick={handleCopyRef}
                style={styles.copyBtn}
                title="Copy reference number"
              >
                {copied ? <Check size={12} color="var(--credit)" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div style={styles.receiptRow}>
            <span style={styles.label}>Transaction Date</span>
            <span style={styles.value}>{tx.date}</span>
          </div>

          <div style={styles.receiptRow}>
            <span style={styles.label}>Account Utilized</span>
            <span style={styles.value}>{tx.account} Account</span>
          </div>

          <div style={styles.receiptRow}>
            <span style={styles.label}>Description</span>
            <span style={styles.value}>{tx.description}</span>
          </div>

          {tx.category && (
            <div style={styles.receiptRow}>
              <span style={styles.label}>Category</span>
              <span style={styles.value}>{tx.category}</span>
            </div>
          )}

          {tx.recipientOrSender && (
            <div style={styles.receiptRow}>
              <span style={styles.label}>Counterparty</span>
              <span style={styles.value}>{tx.recipientOrSender}</span>
            </div>
          )}

          {tx.recipientAccount && (
            <div style={styles.receiptRow}>
              <span style={styles.label}>Recipient Account</span>
              <span style={{ ...styles.value, fontFamily: 'var(--font-mono)' }}>
                {tx.recipientAccount}
              </span>
            </div>
          )}

          {tx.consumerNumber && (
            <div style={styles.receiptRow}>
              <span style={styles.label}>Consumer ID</span>
              <span style={{ ...styles.value, fontFamily: 'var(--font-mono)' }}>
                {tx.consumerNumber}
              </span>
            </div>
          )}

          <div style={styles.receiptRow}>
            <span style={styles.label}>Initiated By</span>
            <span style={styles.value}>
              {user.name} ({user.id})
            </span>
          </div>
        </div>

        {/* Bank Seal / Watermark info */}
        <div style={styles.watermarkCard}>
          <CheckCircle size={16} color="var(--credit)" />
          <span>Electronic Fund Transfer system authorized. Certified by MyBank Digital Core Switch.</span>
        </div>

        {/* Footer actions */}
        <div style={styles.footerActions} className="no-print">
          <button className="btn btn-secondary" onClick={() => setSelectedReceiptTx(null)}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

const styles = {
  receiptBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.75rem',
    borderBottom: '1px dashed var(--border-subtle)'
  },
  bankBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  bankIcon: {
    fontSize: '22px'
  },
  bankTitle: {
    fontWeight: 800,
    fontSize: '1rem',
    color: 'var(--primary)',
    display: 'block'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'var(--credit-light)',
    color: 'var(--credit)',
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  amountSection: {
    textAlign: 'center',
    padding: '1.2rem',
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)'
  },
  amountLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  amountValue: {
    fontSize: '2rem',
    fontWeight: 800,
    margin: '4px 0 8px 0',
    letterSpacing: '-0.02em'
  },
  typeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'var(--bg-surface)',
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-subtle)'
  },
  receiptGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem'
  },
  label: {
    color: 'var(--text-secondary)'
  },
  value: {
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  copyBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center'
  },
  watermarkCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: 'var(--credit-light)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--credit)',
    fontSize: '0.75rem',
    fontWeight: 500,
    border: '1px solid var(--credit-border)'
  },
  footerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--border-subtle)'
  }
};
