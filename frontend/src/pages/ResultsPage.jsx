import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  BookOpen,
  BarChart2
} from 'lucide-react';

export default function ResultsPage() {
  const { evaluationResult, plan, setPlan } = useInterview();
  const navigate = useNavigate();
  const [adaptedNotice, setAdaptedNotice] = useState(false);

  const res = evaluationResult;

  const handleAdaptPlan = () => {
    // Adaptive plan update simulation
    setAdaptedNotice(true);
    setTimeout(() => {
      navigate('/plan');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner with Score */}
      <div className="card" style={{
        padding: '2.5rem',
        background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(99, 102, 241, 0.15) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem'
      }}>
        <div style={{ maxWidth: '520px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Award size={16} />
            <span>AI EVALUATION REPORT</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Interview Performance Report
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {res.generalFeedback}
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-surface-elevated)',
          padding: '1.75rem 2.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Overall Score
          </span>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1.1, margin: '0.25rem 0' }}>
            {res.overallScore}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600 }}>
            Above Benchmark (Good)
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Category Score Breakdown
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {res.categoryBreakdown.map((cat) => (
            <div key={cat.category} style={{ padding: '1rem', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>{cat.category}</span>
                <span style={{ color: cat.score >= 8 ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 700 }}>
                  {cat.score} / 10
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  width: `${(cat.score / 10) * 100}%`,
                  height: '100%',
                  backgroundColor: cat.score >= 8 ? 'var(--color-success)' : 'var(--color-warning)'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Granular Questions Feedback */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Per-Question Detailed Analysis</h2>

        {res.answers.map((item, idx) => (
          <div key={item.questionId} className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                Question {idx + 1}
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                Score: {item.score} / 10 &bull; {item.correctness}
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
              {item.question}
            </h3>

            {/* Candidate answer quote */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--color-primary)',
              fontSize: '0.9rem',
              color: 'var(--color-text-muted)',
              marginBottom: '1.25rem'
            }}>
              <strong>Your Answer:</strong> {item.candidateAnswer}
            </div>

            {/* Strengths & Weaknesses 2-column */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {/* Strengths */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Strengths</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {item.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warning)', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <AlertTriangle size={16} />
                  <span>Areas for Improvement</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {item.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Missing Points & Suggestions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-info)', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <HelpCircle size={16} />
                  <span>Missing Key Concepts</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {item.missing_points.map((mp, i) => (
                    <li key={i}>{mp}</li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FBBF24', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <Lightbulb size={16} />
                  <span>AI Coaching Suggestions</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {item.suggestions.map((sug, i) => (
                    <li key={i}>{sug}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adaptive Plan Action Card */}
      <div className="card" style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-surface-elevated)',
        border: '1px solid var(--color-primary)'
      }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Calibrate Your Prep Plan With These Results
        </h3>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '580px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
          Our adaptive algorithm automatically injects targeted study exercises for your lowest scoring topics (e.g., Database & SQL Optimization) directly into your personalized roadmap.
        </p>

        {adaptedNotice ? (
          <div style={{ color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>Plan dynamically updated! Redirecting to study schedule...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={handleAdaptPlan} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <BookOpen size={16} />
              <span>Update My Prep Plan</span>
            </button>
            <Link to="/performance" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
              <BarChart2 size={16} />
              <span>View Analytics</span>
            </Link>
            <Link to="/interview/setup" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
              <RefreshCw size={16} />
              <span>Practice Another</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
