import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useBank } from '../../hooks/useBank';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Save,
  FileCheck
} from 'lucide-react';

export default function UserProfileModal() {
  const { user, isProfileModalOpen, setIsProfileModalOpen, updateUserProfile } = useBank();

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [kycStatus, setKycStatus] = useState(user.kycStatus || 'Verified');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      kycStatus
    });
    setIsProfileModalOpen(false);
  };

  return (
    <Modal
      isOpen={isProfileModalOpen}
      onClose={() => setIsProfileModalOpen(false)}
      title="Customer Profile & KYC Records"
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Customer Badge Banner */}
        <div style={styles.banner}>
          <div style={styles.avatarLarge}>
            <User size={32} />
          </div>
          <div>
            <h3 style={styles.profileName}>{user.name}</h3>
            <p style={styles.profileId}>
              Customer ID: <strong>{user.id}</strong> • Member since {user.joinedDate || '2024'}
            </p>
            <div style={styles.kycRow}>
              <span
                style={{
                  ...styles.kycBadge,
                  backgroundColor: kycStatus === 'Verified' ? 'var(--credit-light)' : 'var(--warning-light)',
                  color: kycStatus === 'Verified' ? 'var(--credit)' : 'var(--warning-text)'
                }}
              >
                <ShieldCheck size={13} />
                <span>KYC: {kycStatus}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="form-group">
          <label className="form-label" htmlFor="profileFullName">
            <span>Full Name</span>
          </label>
          <div style={styles.inputWrap}>
            <User size={16} color="var(--text-muted)" style={styles.icon} />
            <input
              type="text"
              id="profileFullName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.iconInput}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="profileEmail">
            <span>Email Address</span>
          </label>
          <div style={styles.inputWrap}>
            <Mail size={16} color="var(--text-muted)" style={styles.icon} />
            <input
              type="text"
              id="profileEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.iconInput}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="profilePhone">
            <span>Registered Mobile Number</span>
          </label>
          <div style={styles.inputWrap}>
            <Phone size={16} color="var(--text-muted)" style={styles.icon} />
            <input
              type="text"
              id="profilePhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.iconInput}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="profileAddress">
            <span>Permanent Communication Address</span>
          </label>
          <div style={styles.inputWrap}>
            <MapPin size={16} color="var(--text-muted)" style={styles.icon} />
            <input
              type="text"
              id="profileAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.iconInput}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="profileKycStatus">
            <span>Identity Verification (KYC)</span>
            <span className="form-hint">Aadhaar & PAN Linked</span>
          </label>
          <select
            id="profileKycStatus"
            value={kycStatus}
            onChange={(e) => setKycStatus(e.target.value)}
          >
            <option value="Verified">Verified (Full Tier-1 Access)</option>
            <option value="Pending Review">Pending Review (Standard Limits)</option>
          </select>
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsProfileModalOpen(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  banner: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px',
    backgroundColor: 'var(--bg-muted)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    marginBottom: '1.25rem'
  },
  avatarLarge: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  profileName: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  profileId: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  kycRow: {
    marginTop: '6px'
  },
  kycBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)'
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none'
  },
  iconInput: {
    paddingLeft: '2.4rem'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-subtle)'
  }
};

