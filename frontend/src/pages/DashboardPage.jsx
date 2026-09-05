import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';
import EmptyState from '../components/EmptyState';
import {
  Play,
  BookOpen,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Mic,
  Calendar,
  FileText
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { plan, history, performance } = useInterview();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(99, 102, 241, 0.12) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <span>TARGET ROLE: {user?.targetRole || 'Software Developer'}</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
              Welcome back, {user?.name || 'Alex'}!
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Your current prep milestone is <strong>{plan?.progressPercentage || 57}% completed</strong>. Ready for your next mock interview?
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/interview/setup" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              <Play size={16} />
              <span>Start Interview</span>
            </Link>
            <Link to="/plan" className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>
              <BookOpen size={16} />
              <span>View Prep Plan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-responsive grid-responsive-4">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Average Score</span>
            <Award size={18} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
            {performance.averageScore} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ 10</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.25rem' }}>
            +0.8 from last week
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Interviews Practiced</span>
            <Clock size={18} color="#06B6D4" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
            {performance.interviewsCompleted}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {performance.practiceHours} hours total speaking time
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Top Strength</span>
            <CheckCircle2 size={18} color="var(--color-success)" />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '0.25rem' }}>
            {performance.strongestTopic}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.25rem' }}>
            Consistent 8.8+ ratings
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Focus Area</span>
            <TrendingUp size={18} color="var(--color-warning)" />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '0.25rem' }}>
            {performance.weakestTopic}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: '0.25rem' }}>
            Scheduled in today's plan
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Today's Adaptive Plan Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Adaptive Prep Plan</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Day 4 of {plan.totalDays} &bull; {plan.dailyTimeMinutes} min/day</p>
            </div>
            <Link to="/plan" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Full Plan <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
              <span>Completion progress</span>
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{plan.progressPercentage}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${plan.progressPercentage}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Upcoming Tasks:</div>
            {plan.days.slice(3, 5).map((d) => (
              <div key={d.day} style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  Day {d.day}: {d.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  {d.objective}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Interviews Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Interviews</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Last 4 mock sessions</p>
            </div>
            <Link to="/history" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              History <ArrowRight size={14} />
            </Link>
          </div>

          {history.length === 0 ? (
            <EmptyState
              title="No interviews completed yet"
              description="Start your first AI mock interview to generate historical data and AI evaluations."
              actionText="Start Mock Interview"
              actionLink="/interview/setup"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--color-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      padding: '0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: item.mode === 'Voice' ? 'rgba(6, 182, 212, 0.15)' : 'var(--color-primary-light)',
                      color: item.mode === 'Voice' ? '#06B6D4' : 'var(--color-primary)'
                    }}>
                      {item.mode === 'Voice' ? <Mic size={16} /> : <FileText size={16} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.role}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {item.type} &bull; {item.date}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
                      {item.score} / 10
                    </span>
                    <Link to="/results" className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
