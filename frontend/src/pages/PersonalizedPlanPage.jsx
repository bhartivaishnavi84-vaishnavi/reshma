import React from 'react';
import { useInterview } from '../context/InterviewContext';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Target,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PersonalizedPlanPage() {
  const { plan, togglePlanTask } = useInterview();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div className="card" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(99, 102, 241, 0.12) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <Sparkles size={16} />
              <span>AI ADAPTIVE ROADMAP</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
              {plan.targetRole} Preparation Plan
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Tailored {plan.totalDays}-day curriculum &bull; {plan.dailyTimeMinutes} minutes daily &bull; Adaptively recalibrated after every mock interview
            </p>
          </div>

          <Link to="/interview/setup" className="btn btn-primary">
            <Play size={16} />
            <span>Practice Today's Topic</span>
          </Link>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Overall Plan Progress</span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{plan.progressPercentage}% Completed</span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              width: `${plan.progressPercentage}%`,
              height: '100%',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Weak areas badge chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Reinforcement Areas:</span>
          {plan.weakAreas.map((area) => (
            <span key={area} className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Day by Day Plan Schedule */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Curriculum & Daily Action Items</h2>

        {plan.days.map((day, dIdx) => {
          const allCompleted = day.tasks.every((t) => t.completed);
          return (
            <div
              key={day.day}
              className="card"
              style={{
                padding: '1.5rem',
                borderLeft: allCompleted ? '4px solid var(--color-success)' : '4px solid var(--color-primary)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                      Day {day.day}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{day.title}</h3>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                    <strong>Objective:</strong> {day.objective}
                  </p>
                </div>

                {allCompleted && (
                  <span className="badge badge-success">
                    <CheckCircle2 size={13} />
                    <span>Completed</span>
                  </span>
                )}
              </div>

              {/* Tasks Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1rem' }}>
                {day.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => togglePlanTask(dIdx, task.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: task.completed ? 'var(--color-surface-elevated)' : 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {task.completed ? (
                        <CheckCircle2 size={20} color="var(--color-success)" />
                      ) : (
                        <Circle size={20} color="var(--color-text-subtle)" />
                      )}
                      <span style={{
                        fontSize: '0.9rem',
                        color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text)',
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}>
                        {task.text}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      <Clock size={13} />
                      <span>{task.estimatedMinutes}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
