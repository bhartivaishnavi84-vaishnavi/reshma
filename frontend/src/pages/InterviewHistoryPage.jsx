import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import EmptyState from '../components/EmptyState';
import { History, Mic, FileText, Search, Filter, ArrowUpRight, Play } from 'lucide-react';

export default function InterviewHistoryPage() {
  const { history } = useInterview();
  const [filterMode, setFilterMode] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter((item) => {
    const matchesMode = filterMode === 'All' || item.mode.toLowerCase() === filterMode.toLowerCase();
    const matchesSearch = item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMode && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Interview Practice History</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Review past mock interviews, questions answered, and AI scoring metrics.
          </p>
        </div>

        <Link to="/interview/setup" className="btn btn-primary">
          <Play size={16} />
          <span>New Interview</span>
        </Link>
      </div>

      {/* Filter and Search controls */}
      <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search by role or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text)',
              fontSize: '0.9rem',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} color="var(--color-text-muted)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Mode:</span>
          {['All', 'Text', 'Voice'].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMode(m)}
              className={filterMode === m ? "btn btn-primary" : "btn btn-secondary"}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Table / List */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          title="No interview records found"
          description="Try changing your search filters or start a new mock interview session."
          actionText="Start Mock Interview"
          actionLink="/interview/setup"
        />
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface-elevated)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Date</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Role & Type</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Mode</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Questions</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Score</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.15s' }}>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                      {row.date}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600 }}>{row.role}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{row.type} &bull; {row.difficulty}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className="badge" style={{
                        backgroundColor: row.mode === 'Voice' ? 'rgba(6, 182, 212, 0.15)' : 'var(--color-primary-light)',
                        color: row.mode === 'Voice' ? '#06B6D4' : 'var(--color-primary)'
                      }}>
                        {row.mode === 'Voice' ? <Mic size={12} /> : <FileText size={12} />}
                        {row.mode}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)' }}>
                      {row.questionsCount} questions
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className="badge badge-success" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        {row.score} / 10
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <Link
                        to="/results"
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', gap: '0.3rem' }}
                      >
                        <span>Review</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
