import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import {
  Mic,
  MicOff,
  Clock,
  ArrowRight,
  ArrowLeft,
  Send,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Volume2
} from 'lucide-react';

export default function InterviewVoicePage() {
  const {
    activeInterview,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    recordAnswer,
    completeInterview
  } = useInterview();

  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);

  const recognitionRef = useRef(null);

  const currentQ = activeInterview.questions[currentQuestionIndex] || activeInterview.questions[0];

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setFallbackMode(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript((prev) => {
          const updated = prev ? `${prev} ${currentText}` : currentText;
          recordAnswer(currentQ.id, updated);
          return updated;
        });
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition event:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      setSpeechSupported(false);
      setFallbackMode(true);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [currentQ.id]);

  // Load existing answer for current question
  useEffect(() => {
    setTranscript(answers[currentQ.id] || '');
  }, [currentQuestionIndex, currentQ.id]);

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

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      setFallbackMode(true);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start speech recognition:", e);
      }
    }
  };

  const handleTranscriptChange = (e) => {
    setTranscript(e.target.value);
    recordAnswer(currentQ.id, e.target.value);
  };

  const handleNext = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (currentQuestionIndex < activeInterview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitInterview = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge badge-info">
            <Mic size={14} />
            <span>Voice Interview &bull; {activeInterview.role}</span>
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

      {/* Unsupported / Fallback Banner */}
      {!speechSupported && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-warning-bg)',
          color: 'var(--color-warning)',
          fontSize: '0.875rem',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <AlertTriangle size={18} />
          <span>
            Web Speech API is not supported in this browser. Falling back seamlessly to text mode. You can type your responses below.
          </span>
        </div>
      )}

      {/* Main Question Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
            {currentQ.category}
          </span>
          <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
            {currentQ.difficulty}
          </span>
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '1.75rem' }}>
          {currentQ.text}
        </h2>

        {/* Voice Control Bar */}
        {speechSupported && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--color-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={toggleListening}
                className={isListening ? "btn btn-danger" : "btn btn-primary"}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '0.75rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: isListening ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none'
                }}
              >
                {isListening ? (
                  <>
                    <MicOff size={18} />
                    <span>Stop Speaking</span>
                  </>
                ) : (
                  <>
                    <Mic size={18} />
                    <span>Start Speaking</span>
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isListening ? 'var(--color-danger)' : 'var(--color-text-subtle)',
                    animation: isListening ? 'blink 1s infinite' : 'none'
                  }}
                />
                <span style={{ fontSize: '0.85rem', color: isListening ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: 500 }}>
                  {isListening ? "Listening live..." : "Microphone paused. Click to speak."}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFallbackMode(!fallbackMode)}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            >
              <FileText size={14} />
              <span>{fallbackMode ? "Hide Editor" : "Edit Text"}</span>
            </button>
          </div>
        )}

        {/* Live Transcript / Editable Text Area */}
        <div className="form-group">
          <label className="form-label" htmlFor="transcript">
            {speechSupported ? "Live Speech Transcript (Editable)" : "Type Your Answer"}
          </label>
          <textarea
            id="transcript"
            className="form-textarea"
            style={{
              minHeight: '180px',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              fontSize: '0.95rem'
            }}
            placeholder={
              speechSupported
                ? "Click 'Start Speaking' and speak your response. Your words will appear here in real-time. You can also edit and polish your transcript..."
                : "Type your full response here..."
            }
            value={transcript}
            onChange={handleTranscriptChange}
          />
        </div>

        {/* Navigation Buttons */}
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

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
