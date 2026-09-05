import React from 'react';

export default function LoadingState({ message = "Loading information...", isSkeleton = false }) {
  if (isSkeleton) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }} role="status" aria-label={message}>
        <div style={{ height: '32px', width: '45%', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ height: '120px', width: '100%', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ height: '80px', width: '80%', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 0.8; }
            100% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '1rem',
        color: 'var(--color-text-muted)'
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <p style={{ fontSize: '0.95rem' }}>{message}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
