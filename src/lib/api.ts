// Base API URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },

  // User endpoints
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    PREFERENCES: `${API_BASE_URL}/user/preferences`,
    STATISTICS: `${API_BASE_URL}/user/statistics`,
  },

  // Exam endpoints
  EXAM: {
    LIST: `${API_BASE_URL}/exams`,
    DETAIL: (examId: string) => `${API_BASE_URL}/exams/${examId}`,
    SUBMIT: (examId: string) => `${API_BASE_URL}/exams/${examId}/submit`,
    RESULTS: (examId: string) => `${API_BASE_URL}/exams/${examId}/results`,
  },

  // Question endpoints
  QUESTION: {
    BANK: `${API_BASE_URL}/questions/bank`,
    PRACTICE: `${API_BASE_URL}/questions/practice`,
    FAVORITE: `${API_BASE_URL}/questions/favorites`,
    BY_SUBJECT: (subjectId: string) => `${API_BASE_URL}/questions/subject/${subjectId}`,
  },

  // Leaderboard endpoints
  LEADERBOARD: {
    GLOBAL: `${API_BASE_URL}/leaderboard/global`,
    BY_SUBJECT: (subjectId: string) => `${API_BASE_URL}/leaderboard/subject/${subjectId}`,
    BY_EXAM: (examId: string) => `${API_BASE_URL}/leaderboard/exam/${examId}`,
  },

  // Doubts forum endpoints
  FORUM: {
    QUESTIONS: `${API_BASE_URL}/forum/questions`,
    QUESTION_DETAIL: (questionId: string) => `${API_BASE_URL}/forum/questions/${questionId}`,
    ANSWERS: (questionId: string) => `${API_BASE_URL}/forum/questions/${questionId}/answers`,
  },
};

export default API_ENDPOINTS;
