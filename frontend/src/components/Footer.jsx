import React from 'react';
import { Mic, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '2rem 1rem',
      marginTop: 'auto',
      color: 'var(--color-text-muted)',
      fontSize: '0.875rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="var(--color-primary)" />
          <span>PrepAI &bull; Adaptive AI-Based Mock Interview Platform</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
          <span>Strict Backend Gemini Security</span>
          <span>Web Speech API</span>
          <span>Adaptive Learning Plans</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
          &copy; {new Date().getFullYear()} PrepAI. Designed for tech candidates & career advancement.
        </div>
      </div>
    </footer>
  );
}
