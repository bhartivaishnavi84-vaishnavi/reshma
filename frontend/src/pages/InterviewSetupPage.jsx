import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';
import { JOB_ROLES, INTERVIEW_TYPES, DIFFICULTY_LEVELS } from '../mockData';
import { Play, Mic, FileText, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';

export default function InterviewSetupPage() {
  const { user } = useAuth();
  const { startNewInterview } = useInterview();
  const navigate = useNavigate();

  const [role, setRole] = useState(user?.targetRole || 'Software Developer');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [questionCount, setQuestionCount] = useState(4);
  const [mode, setMode] = useState('text'); // 'text' | 'voice'
  const [useResume, setUseResume] = useState(user?.resumeUploaded || false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStart = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      startNewInterview({
        role,
        type: interviewType,
        difficulty,
        questionCount: parseInt(questionCount, 10),
        mode,
        useResume
      });
      setIsGenerating(false);
      if (mode === 'voice') {
        navigate('/interview/voice');
      } else {
        navigate('/interview/text');
      }
    }, 600);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Configure Your Mock Interview</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
          Personalize role, interview focus, and delivery mode. Gemini AI generates custom evaluation questions.
        </p>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleStart}>
          {/* Job Role */}
          <div className="form-group">
            <label className="form-label" htmlFor="role">Target Job Role</label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {JOB_ROLES.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name} ({r.category})
                </option>
              ))}
            </select>
          </div>

          {/* Interview Type Selection */}
          <div className="form-group">
            <label className="form-label">Interview Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.25rem' }}>
              {INTERVIEW_TYPES.map((type) => {
                const isSelected = interviewType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setInterviewType(type.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-surface-elevated)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        {type.label}
                      </span>
                      {isSelected && <CheckCircle2 size={16} color="var(--color-primary)" />}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
                      {type.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty & Count Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="difficulty">Difficulty Level</label>
              <select
                id="difficulty"
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {DIFFICULTY_LEVELS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="questionCount">Question Count</label>
              <select
                id="questionCount"
                className="form-select"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
              >
                <option value={3}>3 Questions (~15 mins)</option>
                <option value={4}>4 Questions (~20 mins)</option>
                <option value={5}>5 Questions (~25 mins)</option>
                <option value={6}>6 Questions (~30 mins)</option>
                <option value={8}>8 Questions (~40 mins)</option>
              </select>
            </div>
          </div>

          {/* Interview Delivery Mode */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Interview Delivery Mode</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div
                onClick={() => setMode('text')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${mode === 'text' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: mode === 'text' ? 'var(--color-primary-light)' : 'var(--color-surface-elevated)',
                  cursor: 'pointer'
                }}
              >
                <FileText size={22} color={mode === 'text' ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Text-Based</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Type your answers with code formatting</div>
                </div>
              </div>

              <div
                onClick={() => setMode('voice')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${mode === 'voice' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: mode === 'voice' ? 'var(--color-primary-light)' : 'var(--color-surface-elevated)',
                  cursor: 'pointer'
                }}
              >
                <Mic size={22} color={mode === 'voice' ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Voice-Based</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Speak via microphone with Web Speech API</div>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Tailoring Checkbox */}
          <div style={{
            margin: '1.5rem 0',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <input
              type="checkbox"
              id="useResume"
              checked={useResume}
              onChange={(e) => setUseResume(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
            />
            <label htmlFor="useResume" style={{ fontSize: '0.875rem', cursor: 'pointer', color: 'var(--color-text)' }}>
              Incorporate my uploaded resume to generate personalized, project-specific interview questions.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem' }}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span>Generating AI Questions...</span>
            ) : (
              <>
                <Play size={18} />
                <span>Begin {mode === 'voice' ? 'Voice' : 'Text'} Interview</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
