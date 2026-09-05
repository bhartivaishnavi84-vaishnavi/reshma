import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { JOB_ROLES } from '../mockData';
import { User, Mail, Briefcase, Award, CheckCircle2, Save, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Developer');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Intermediate');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({
      name,
      targetRole,
      experienceLevel
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Candidate Profile & Settings</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Manage your career target, experience level, and personalized interview parameters.
        </p>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              {name.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{name}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{user?.email}</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profileName">Full Name</label>
            <input
              id="profileName"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profileEmail">Email Address</label>
            <input
              id="profileEmail"
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Email address cannot be changed directly.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profileRole">Primary Target Job Role</label>
            <select
              id="profileRole"
              className="form-select"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            >
              {JOB_ROLES.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profileExp">Experience Level</label>
            <select
              id="profileExp"
              className="form-select"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="Beginner">Beginner (0-1 years)</option>
              <option value="Intermediate">Intermediate (1-4 years)</option>
              <option value="Advanced">Senior / Advanced (5+ years)</option>
            </select>
          </div>

          {/* Resume integration status card */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid var(--color-border)',
            margin: '1.5rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={20} color="var(--color-primary)" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  Resume: {user?.resumeFileName || 'Alex_Morgan_Resume_2025.pdf'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Active &bull; Extracted skills applied to mock questions
                </div>
              </div>
            </div>
            <Link to="/resume" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
              Manage Resume
            </Link>
          </div>

          {savedSuccess && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              <CheckCircle2 size={16} />
              <span>Profile settings saved successfully!</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', gap: '0.5rem' }}
          >
            <Save size={16} />
            <span>Save Profile Preferences</span>
          </button>
        </form>
      </div>
    </div>
  );
}
