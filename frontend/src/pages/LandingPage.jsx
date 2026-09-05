import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  BrainCircuit,
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Award
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 1rem 4rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(99, 102, 241, 0.25), transparent 70%)'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            backgroundColor: 'var(--color-primary-light)',
            color: '#A5B4FC',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <Sparkles size={16} />
            <span>Next-Generation AI Mock Interview Platform</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #FFFFFF 20%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Ace Your Next Tech Interview with Real-Time AI Coaching
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--color-text-muted)',
            marginBottom: '2.5rem',
            lineHeight: 1.6
          }}>
            Practice role-specific technical, behavioral, and system design interviews by voice or text. Receive instant scoring, granular critique, and adaptive daily prep roadmaps tailored to your weaknesses.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              <span>Start Free Practice</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/interview/setup" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
              <span>Explore Interview Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Engineered for Job Seekers & Developers
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to transform anxiety into interview mastery.
          </p>
        </div>

        <div className="grid-responsive grid-responsive-3">
          <div className="card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <BrainCircuit size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Gemini-Powered Scoring
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Get detailed 0–10 evaluations, strengths, weaknesses, and missing key points for every answer you provide.
            </p>
          </div>

          <div className="card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              color: '#06B6D4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Mic size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Real-Time Voice Interviews
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Speak naturally via Web Speech API with live transcript editing, or switch smoothly to text mode anytime.
            </p>
          </div>

          <div className="card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Adaptive Preparation Plan
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Your study roadmap automatically updates when the AI detects weak topics, scheduling focused exercises.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Supported Banner */}
      <section style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: '3rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '1.5rem' }}>
            Supported Roles & Specializations
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {['Software Developer', 'Data Analyst', 'Data Scientist', 'Web Developer', 'Python Developer', 'Java Developer', 'Business Analyst', 'ML Engineer'].map((role) => (
              <span key={role} style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                color: 'var(--color-text)'
              }}>
                {role}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section style={{ padding: '5rem 1rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div className="card" style={{
          padding: '3.5rem 2rem',
          background: 'linear-gradient(180deg, var(--color-surface) 0%, rgba(99, 102, 241, 0.1) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.3)'
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Accelerate Your Career?
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '520px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
            Create an account in seconds, configure your mock interview parameters, and start practicing with AI today.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2.25rem', fontSize: '1rem' }}>
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
