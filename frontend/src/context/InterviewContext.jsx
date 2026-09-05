import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MOCK_ACTIVE_INTERVIEW,
  MOCK_EVALUATION_RESULT,
  MOCK_PERSONALIZED_PLAN,
  MOCK_INTERVIEW_HISTORY,
  MOCK_PERFORMANCE_METRICS
} from '../mockData';
import { interviewAPI, planAPI, performanceAPI } from '../api';

const InterviewContext = createContext(null);

export function InterviewProvider({ children }) {
  const [activeInterview, setActiveInterview] = useState(MOCK_ACTIVE_INTERVIEW);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    1: MOCK_ACTIVE_INTERVIEW.questions[0].sampleAnswer || "",
    2: "",
    3: "",
    4: ""
  });
  const [evaluationResult, setEvaluationResult] = useState(MOCK_EVALUATION_RESULT);
  const [plan, setPlan] = useState(MOCK_PERSONALIZED_PLAN);
  const [history, setHistory] = useState(MOCK_INTERVIEW_HISTORY);
  const [performance, setPerformance] = useState(MOCK_PERFORMANCE_METRICS);

  // Sync plan and history from backend if available
  useEffect(() => {
    const token = localStorage.getItem('prepai_token');
    const userStr = localStorage.getItem('prepai_user');
    if (token && !token.startsWith('mock-') && userStr) {
      try {
        const u = JSON.parse(userStr);
        planAPI.get(u.id)
          .then((pData) => setPlan(pData))
          .catch(() => {});

        performanceAPI.getHistory()
          .then((hData) => setHistory(hData))
          .catch(() => {});

        performanceAPI.getUserPerformance(u.id)
          .then((perfData) => setPerformance(perfData))
          .catch(() => {});
      } catch (e) {}
    }
  }, []);

  const startNewInterview = async (config) => {
    try {
      // Try real backend
      const res = await interviewAPI.start({
        role: config.role,
        interview_type: config.type,
        difficulty: config.difficulty,
        question_count: config.questionCount,
        mode: config.mode,
        use_resume: config.useResume
      });
      if (res && res.id) {
        setActiveInterview({
          id: res.id,
          role: res.role,
          type: res.interview_type,
          difficulty: res.difficulty,
          mode: res.mode,
          totalQuestions: res.questions.length,
          questions: res.questions.map((q) => ({
            id: q.id,
            order: q.order_index,
            category: q.category,
            difficulty: q.difficulty,
            text: q.question_text,
            sampleAnswer: ""
          }))
        });
        setCurrentQuestionIndex(0);
        setAnswers({});
        return;
      }
    } catch (e) {
      console.warn("Backend interview generation fallback to local mock:", e.message);
    }

    // Fallback simulation
    const newSession = {
      id: `int-${Date.now()}`,
      role: config.role || "Software Developer",
      type: config.type || "Technical",
      difficulty: config.difficulty || "Intermediate",
      mode: config.mode || "text",
      totalQuestions: config.questionCount || 4,
      questions: MOCK_ACTIVE_INTERVIEW.questions.slice(0, config.questionCount || 4).map((q, idx) => ({
        ...q,
        order: idx + 1
      }))
    };
    setActiveInterview(newSession);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const recordAnswer = async (questionId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text
    }));

    // If real backend interview is active, send to backend
    if (activeInterview && !activeInterview.id.startsWith('int-mock') && !activeInterview.id.startsWith('int-1')) {
      try {
        await interviewAPI.submitAnswer(activeInterview.id, questionId, {
          answer_text: text,
          audio_duration_seconds: 15
        });
      } catch (e) {
        console.warn("Could not save answer to backend:", e.message);
      }
    }
  };

  const togglePlanTask = async (dayIndex, taskId) => {
    // Find current task completion
    let targetTask = null;
    plan.days.forEach((d) => {
      d.tasks.forEach((t) => {
        if (t.id === taskId) targetTask = t;
      });
    });
    const newStatus = targetTask ? !targetTask.completed : true;

    // Optimistically update UI
    setPlan((prev) => {
      const updatedDays = prev.days.map((day, dIdx) => {
        if (dIdx !== dayIndex) return day;
        return {
          ...day,
          tasks: day.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, completed: !task.completed };
            }
            return task;
          })
        };
      });

      let totalTasks = 0;
      let completedTasks = 0;
      updatedDays.forEach((d) => {
        d.tasks.forEach((t) => {
          totalTasks++;
          if (t.completed) completedTasks++;
        });
      });
      const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

      return {
        ...prev,
        days: updatedDays,
        progressPercentage
      };
    });

    // Sync with backend if not mock ID
    if (!taskId.startsWith('t1-') && !taskId.startsWith('t2-')) {
      try {
        await planAPI.updateTask(taskId, newStatus);
      } catch (e) {
        console.warn("Could not update task on backend:", e.message);
      }
    }
  };

  const completeInterview = async () => {
    if (activeInterview && !activeInterview.id.startsWith('int-mock')) {
      try {
        const completeRes = await interviewAPI.complete(activeInterview.id);
        if (completeRes) {
          setEvaluationResult({
            interviewId: completeRes.interview_id,
            overallScore: completeRes.overall_score,
            durationMinutes: 18,
            completedAt: completeRes.completed_at,
            categoryBreakdown: completeRes.category_breakdown,
            generalFeedback: completeRes.general_feedback,
            answers: completeRes.answers
          });
          return completeRes;
        }
      } catch (e) {
        console.warn("Complete interview API fallback:", e.message);
      }
    }

    const newScore = 8.2;
    const completedSession = {
      id: activeInterview.id,
      date: new Date().toISOString().split('T')[0],
      role: activeInterview.role,
      type: activeInterview.type,
      mode: activeInterview.mode === 'voice' ? 'Voice' : 'Text',
      difficulty: activeInterview.difficulty,
      score: newScore,
      questionsCount: activeInterview.questions.length,
      status: "Completed"
    };

    setHistory((prev) => [completedSession, ...prev]);
    return evaluationResult;
  };

  return (
    <InterviewContext.Provider
      value={{
        activeInterview,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answers,
        recordAnswer,
        evaluationResult,
        setEvaluationResult,
        plan,
        setPlan,
        togglePlanTask,
        history,
        performance,
        startNewInterview,
        completeInterview
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  return useContext(InterviewContext);
}
