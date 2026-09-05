import React from 'react';
import { useInterview } from '../context/InterviewContext';
import {
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BarChart2,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PerformanceDashboardPage() {
  const { performance } = useInterview();

  // SVG Line Chart calculation for trend
  const trendData = performance.trend;
  const maxScore = 10;
  const chartWidth = 500;
  const chartHeight = 180;
  const padding = 30;

  const getCoordinates = (index, score) => {
    const x = padding + (index / (trendData.length - 1 || 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (score / maxScore) * (chartHeight - padding * 2);
    return { x, y };
  };

  const points = trendData.map((d, idx) => getCoordinates(idx, d.score));
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Performance & Analytics Dashboard</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Track your interview readiness, score trajectory over time, and subject strengths.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid-responsive grid-responsive-3">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Overall Average</span>
            <Award size={18} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text)' }}>
            {performance.averageScore} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ 10</span>
          </div>
          <span className="badge badge-success" style={{ marginTop: '0.5rem' }}>
            Ready for Mid-Level Roles
          </span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Completed Sessions</span>
            <Calendar size={18} color="#06B6D4" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text)' }}>
            {performance.interviewsCompleted}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', display: 'block' }}>
            Across 4 different interview types
          </span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Practice Hours</span>
            <Clock size={18} color="var(--color-warning)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text)' }}>
            {performance.practiceHours} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>hrs</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', display: 'block' }}>
            Simulated speaking & technical answers
          </span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Score Trajectory Over Time</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Continuous performance evaluation curve</p>
          </div>
          <span className="badge badge-primary">
            +16.6% Improvement
          </span>
        </div>

        {/* Responsive SVG Chart */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Grid lines */}
            {[2, 4, 6, 8, 10].map((val) => {
              const y = chartHeight - padding - (val / maxScore) * (chartHeight - padding * 2);
              return (
                <g key={val}>
                  <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="var(--color-border)" strokeDasharray="3 3" />
                  <text x={padding - 10} y={y + 4} fill="var(--color-text-subtle)" fontSize="9" textAnchor="end">{val}</text>
                </g>
              );
            })}

            {/* Polyline line */}
            <polyline
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />

            {/* Data points */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="5" fill="var(--color-primary)" stroke="var(--color-surface)" strokeWidth="2" />
                <text x={p.x} y={p.y - 10} fill="var(--color-text)" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {trendData[idx].score}
                </text>
                <text x={p.x} y={chartHeight - 10} fill="var(--color-text-muted)" fontSize="9" textAnchor="middle">
                  {trendData[idx].date}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Topic Mastery Breakdown */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Topic-by-Topic Mastery
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {performance.topics.map((t) => (
            <div key={t.topic} style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.topic}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={t.score >= 8.5 ? "badge badge-success" : t.score >= 7.5 ? "badge badge-primary" : "badge badge-warning"} style={{ fontSize: '0.75rem' }}>
                    {t.status}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                    {t.score} / 10
                  </span>
                </div>
              </div>

              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  width: `${(t.score / 10) * 100}%`,
                  height: '100%',
                  backgroundColor: t.score >= 8.5 ? 'var(--color-success)' : t.score >= 7.5 ? 'var(--color-primary)' : 'var(--color-warning)',
                  borderRadius: 'var(--radius-full)'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
