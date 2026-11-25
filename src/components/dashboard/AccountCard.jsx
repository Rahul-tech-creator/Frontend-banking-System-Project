import React, { useState } from 'react';
import { useBank } from '../../hooks/useBank';
import { formatCurrency } from '../../utils/formatters';
import {
  Copy,
  Check,
  ArrowDownToLine,
  SendHorizontal,
  Wifi,
  Sliders,
  Lock,
  RotateCw,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AccountCard() {
  const {

    accounts,
    user,
    preselectAccountForAction,
    setCardModalAccount,
    addToast
    
  } = useBank();

  const [copiedKey, setCopiedKey] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [showNumber, setShowNumber] = useState({});

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to Clipboard', `Account Number ${text} copied.`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleFlip = (key) => {
    setFlippedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleShowNumber = (key) => {
    setShowNumber((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const accountList = [
    {
      key: 'Savings',
      data: accounts.Savings,
      badgeClass: 'badge-savings',
      bgGradient: 'linear-gradient(135deg, #091a3c 0%, #173679 45%, #2563eb 100%)',
      brand: 'VISA',
      cardType: accounts.Savings.cardDetails?.cardType || 'VISA Platinum Debit'
    },
    {
      key: 'Current',
      data: accounts.Current,
      badgeClass: 'badge-current',
      bgGradient: 'linear-gradient(135deg, #1b0c38 0%, #401878 45%, #7c3aed 100%)',
      brand: 'Mastercard',
      cardType: accounts.Current.cardDetails?.cardType || 'Mastercard Business Debit'
    }
  ];

  return (
    <div style={styles.grid}>
      {accountList.map(({ key, data, badgeClass, bgGradient, brand, cardType }) => {
        const isFrozen = data.isFrozen || data.cardDetails?.status === 'Frozen';
        const isFlipped = Boolean(flippedCards[key]);
        const isRevealed = Boolean(showNumber[key]);
        const fullCardNum = data.cardDetails?.cardNumber || '4521 8901 2345 6789';
        const maskedNum = `•••• •••• •••• ${data.accountNumber.replace('****', '')}`;

        return (
          <div key={key} className="card" style={styles.cardContainer}>
            {/* 3D Realistic Debit Card */}
            <div style={styles.cardPerspective}>
              <div
                style={{
                  ...styles.cardVisual,
                  background: bgGradient,
                  filter: isFrozen ? 'grayscale(0.85) contrast(0.95)' : 'none'
                }}
              >
                {/* Subtle Sheen / Glass Overlay */}
                <div style={styles.glossOverlay}></div>

                {/* FRONT OF CARD */}
                {!isFlipped ? (
                  <div style={styles.cardFront}>
                    {/* Top row: Brand & Frozen / Flip */}
                    <div style={styles.cardTopRow}>
                      <div style={styles.bankNameCol}>
                        <span style={styles.bankCardLogo}>MyBank</span>
                        <span style={styles.bankCardCategory}>{key.toUpperCase()} PRIVILEGE</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isFrozen && (
                          <span style={styles.frozenChip}>
                            <Lock size={11} /> FROZEN
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleFlip(key)}
                          style={styles.flipBtn}
                          title="Flip card to view back & CVV"
                          aria-label="Flip card"
                        >
                          <RotateCw size={12} />
                          <span>Flip</span>
                        </button>
                      </div>
                    </div>

                    {/* Middle: EMV Chip & Contactless Wave */}
                    <div style={styles.chipRow}>
                      <div style={styles.emvChip}>
                        <div style={styles.chipInnerTop}></div>
                        <div style={styles.chipInnerMid}></div>
                        <div style={styles.chipInnerBot}></div>
                      </div>
                      <Wifi size={20} color="rgba(255,255,255,0.75)" style={{ transform: 'rotate(90deg)' }} />
                      <button
                        type="button"
                        onClick={() => toggleShowNumber(key)}
                        style={styles.revealInlineBtn}
                        title={isRevealed ? 'Hide card digits' : 'Show full 16 digits'}
                      >
                        {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>

                    {/* Card Number */}
                    <div style={styles.cardNumberText}>
                      {isRevealed ? fullCardNum : maskedNum}
                    </div>

                    {/* Bottom: Cardholder, Expiry, Logo */}
                    <div style={styles.cardBottomRow}>
                      <div>
                        <span style={styles.cardMicroLabel}>CARDHOLDER</span>
                        <p style={styles.cardHolderName}>{user.name.toUpperCase()}</p>
                      </div>
                      <div>
                        <span style={styles.cardMicroLabel}>EXPIRES</span>
                        <p style={styles.cardExpiryDate}>{data.cardDetails?.expiry || '10/29'}</p>
                      </div>
                      <div style={styles.brandLogoWrap}>
                        {brand === 'VISA' ? (
                          <span style={styles.visaText}>VISA</span>
                        ) : (
                          <div style={styles.mastercardCircles}>
                            <span style={styles.mcCircleRed}></span>
                            <span style={styles.mcCircleYellow}></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* BACK OF CARD */
                  <div style={styles.cardBack}>
                    <div style={styles.magStripe}></div>
                    <div style={styles.backContent}>
                      <div style={styles.signatureRow}>
                        <div style={styles.signatureStrip}>
                          <span style={styles.signatureScript}>{user.name}</span>
                        </div>
                        <div style={styles.cvvBox}>
                          <span style={styles.cvvLabel}>CVV</span>
                          <span style={styles.cvvDigits}>{data.cardDetails?.cvv || '382'}</span>
                        </div>
                      </div>
                      <p style={styles.backDisclaimer}>
                        This debit card is issued by MyBank Corp under license from {brand}. Valid internationally.
                        24x7 Customer Helpline: 1800-425-9900.
                      </p>
                      <div style={styles.backActions}>
                        <span style={styles.chipStatusText}>
                          {isFrozen ? '• Card Frozen' : '• Contactless Enabled'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleFlip(key)}
                          style={styles.flipBtn}
                        >
                          <RotateCw size={12} />
                          <span>Flip to Front</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Details & Quick Actions Body */}
            <div style={styles.detailsBody}>
              <div style={styles.titleRow}>
                <div>
                  <h3 style={styles.accountTitle}>{data.name}</h3>
                  <div style={styles.accNumRow}>
                    <span style={styles.accNumText}>
                      Account: <strong>{data.accountNumber}</strong>
                    </span>
                    <button
                      style={styles.copyBtn}
                      onClick={() => handleCopy(key, data.fullAccountNumber || data.accountNumber)}
                      title="Copy full account number"
                    >
                      {copiedKey === key ? (
                        <Check size={13} color="var(--credit)" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                </div>
                <span className={`badge ${badgeClass}`}>{key}</span>
              </div>

              <div style={styles.balanceBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={styles.balanceLabel}>Available Balance</span>
                  <span style={styles.ifscBadge}>IFSC: {data.ifsc || 'MYBK0001042'}</span>
                </div>
                <h2 style={styles.balanceValue}>{formatCurrency(data.balance)}</h2>
                <div style={styles.cardControlRow}>
                  <span style={{ fontSize: '0.72rem', color: isFrozen ? 'var(--debit)' : 'var(--credit)', fontWeight: 600 }}>
                    {isFrozen ? '• Account Locked' : '• Active & Verified'}
                  </span>
                  <button
                    type="button"
                    style={styles.manageCardBtn}
                    onClick={() => setCardModalAccount(key)}
                  >
                    <Sliders size={12} />
                    <span>Card Controls & PIN</span>
                  </button>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div style={styles.actionRow}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => preselectAccountForAction(key, 'deposit')}
                >
                  <ArrowDownToLine size={14} />
                  <span>Deposit</span>
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => preselectAccountForAction(key, 'transfer')}
                >
                  <SendHorizontal size={14} />
                  <span>Transfer</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '24px',
    marginBottom: '28px'
  },
  cardContainer: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  cardPerspective: {
    padding: '1.25rem',
    backgroundColor: 'var(--bg-muted)',
    borderBottom: '1px solid var(--border-subtle)'
  },
  cardVisual: {
    position: 'relative',
    borderRadius: '16px',
    padding: '1.4rem 1.6rem',
    color: '#ffffff',
    boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.35), 0 4px 8px -2px rgba(0, 0, 0, 0.2)',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    transition: 'filter 0.3s ease'
  },
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.18) 0%, transparent 60%)',
    pointerEvents: 'none'
  },
  cardFront: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    gap: '12px',
    zIndex: 1
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  bankNameCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  bankCardLogo: {
    fontSize: '1.15rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#ffffff'
  },
  bankCardCategory: {
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  frozenChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: 800,
    padding: '2px 7px',
    borderRadius: 'var(--radius-sm)',
    letterSpacing: '0.04em'
  },
  flipBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: '#ffffff',
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.68rem',
    fontWeight: 600,
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'background 0.15s ease'
  },
  chipRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  emvChip: {
    width: '38px',
    height: '28px',
    backgroundColor: '#e6be60',
    borderRadius: '5px',
    border: '1px solid #b38b2a',
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 1px 3px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: '2px'
  },
  chipInnerTop: {
    height: '1px',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  chipInnerMid: {
    height: '1px',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  chipInnerBot: {
    height: '1px',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  revealInlineBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.65)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '2px'
  },
  cardNumberText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.2rem',
    letterSpacing: '0.14em',
    color: '#ffffff',
    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
    fontWeight: 600,
    margin: '4px 0'
  },
  cardBottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  cardMicroLabel: {
    fontSize: '0.58rem',
    letterSpacing: '0.07em',
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'block'
  },
  cardHolderName: {
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: '#ffffff'
  },
  cardExpiryDate: {
    fontSize: '0.85rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: '#ffffff'
  },
  brandLogoWrap: {
    display: 'flex',
    alignItems: 'center'
  },
  visaText: {
    fontSize: '1.35rem',
    fontStyle: 'italic',
    fontWeight: 900,
    letterSpacing: '-0.04em',
    color: '#ffffff'
  },
  mastercardCircles: {
    position: 'relative',
    width: '38px',
    height: '24px'
  },
  mcCircleRed: {
    position: 'absolute',
    left: 0,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#eb001b'
  },
  mcCircleYellow: {
    position: 'absolute',
    right: 0,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#f79e1b',
    opacity: 0.92
  },
  cardBack: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between'
  },
  magStripe: {
    height: '38px',
    backgroundColor: '#111827',
    margin: '-1.4rem -1.6rem 0.5rem -1.6rem'
  },
  backContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  signatureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  signatureStrip: {
    flex: 1,
    height: '30px',
    backgroundColor: '#f8fafc',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    color: '#0f172a'
  },
  signatureScript: {
    fontFamily: 'cursive',
    fontSize: '0.85rem',
    letterSpacing: '0.05em'
  },
  cvvBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2px 8px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '4px'
  },
  cvvLabel: {
    fontSize: '0.55rem',
    color: 'rgba(255,255,255,0.7)'
  },
  cvvDigits: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#ffffff'
  },
  backDisclaimer: {
    fontSize: '0.58rem',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 1.3
  },
  backActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '4px',
    borderTop: '1px solid rgba(255,255,255,0.15)'
  },
  chipStatusText: {
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 600
  },
  detailsBody: {
    padding: '1.25rem 1.4rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    flex: 1
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  accountTitle: {
    fontSize: '1.05rem',
    fontWeight: 700
  },
  accNumRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '2px'
  },
  accNumText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  copyBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '2px',
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '4px'
  },
  balanceBox: {
    backgroundColor: 'var(--bg-muted)',
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)'
  },
  balanceLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  balanceValue: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    margin: '2px 0 6px 0',
    letterSpacing: '-0.02em'
  },
  ifscBadge: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)'
  },
  cardControlRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '6px',
    borderTop: '1px dashed var(--border-subtle)'
  },
  manageCardBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--primary)',
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 4px'
  },
  actionRow: {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto'
  }
};
