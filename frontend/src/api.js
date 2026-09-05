import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor to inject JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prepai_token');
    if (token && !token.startsWith('mock-')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for uniform error parsing
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customMessage = error.response?.data?.error?.message ||
                          error.response?.data?.detail ||
                          error.message ||
                          'Network communication failed.';
    return Promise.reject(new Error(customMessage));
  }
);

export const authAPI = {
  register: (userData) => client.post('/api/register', userData),
  login: (credentials) => client.post('/api/login', credentials),
  getMe: () => client.get('/api/me'),
};

export const interviewAPI = {
  start: (params) => client.post('/api/interview/start', params),
  get: (id) => client.get(`/api/interview/${id}`),
  submitAnswer: (id, questionId, data) => client.post(`/api/interview/${id}/answer?question_id=${questionId}`, data),
  complete: (id) => client.post(`/api/interview/${id}/complete`),
};

export const aiAPI = {
  generateQuestions: (params) => client.post('/api/ai/generate-questions', params),
  evaluateAnswer: (data) => client.post('/api/ai/evaluate-answer', data),
  generatePlan: (params) => client.post('/api/ai/generate-plan', params),
  recommendations: (params) => client.post('/api/ai/recommendations', params),
};

export const planAPI = {
  create: (params) => client.post('/api/plans', params),
  get: (userId) => client.get(`/api/plans/${userId}`),
  updateTask: (taskId, isCompleted) => client.put(`/api/plans/tasks/${taskId}`, { is_completed: isCompleted }),
};

export const performanceAPI = {
  getHistory: () => client.get('/api/interviews/history'),
  getUserPerformance: (userId) => client.get(`/api/performance/${userId}`),
};

export const resumeAPI = {
  upload: (formData) =>
    client.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default client;
