import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { Clock, ArrowRight, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InterviewTextPage() {
  const {
    activeInterview,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    recordAnswer,
    completeInterview
  } = useInterview();

  const navigate = useNavigate();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = activeInterview.questions[currentQuestionIndex] || activeInterview.questions[0];
  const currentAnswer = answers[currentQ?.id] || "";
  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;

  const handleAnswerChange = (e) => {
    setErrorMsg('');
    recordAnswer(currentQ.id, e.target.value);
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeInterview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitInterview = () => {
    if (!currentAnswer.trim() && Object.keys(answers).length === 0) {
      setErrorMsg('Please write an answer before finishing the interview.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      completeInterview();
      setIsSubmitting(false);
      navigate('/results');
    }, 800);
  };

  const isLastQuestion = currentQuestionIndex === activeInterview.questions.length - 1;

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Status Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.85rem 1.25rem',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="badge badge-primary">
            {activeInterview.role} &bull; {activeInterview.type}
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Question {currentQuestionIndex + 1} of {activeInterview.questions.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text)', fontWeight: 600, fontSize: '0.95rem' }}>
          <Clock size={16} color="var(--color-primary)" />
          <span>{formatTimer(secondsElapsed)}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
            Category: {currentQ.category}
          </span>
          <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
            {currentQ.difficulty}
          </span>
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '1.5rem' }}>
          {currentQ.text}
        </h2>

        {/* Answer Input */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label className="form-label" htmlFor="answerInput">Your Answer</label>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {wordCount} words
            </span>
          </div>

          <textarea
            id="answerInput"
            className="form-textarea"
            style={{
              minHeight: '220px',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              fontSize: '0.95rem'
            }}
            placeholder="Structure your answer clearly. Highlight conceptual principles, trade-offs, and practical examples..."
            value={currentAnswer}
            onChange={handleAnswerChange}
          />
        </div>

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Navigation Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!isLastQuestion ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                <span>Next Question</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitInterview}
                disabled={isSubmitting}
                style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}
              >
                {isSubmitting ? (
                  <span>Evaluating Answers...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Finish & Get AI Feedback</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
