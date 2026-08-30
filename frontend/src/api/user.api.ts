import api from "./axios";

export interface UserProgress {
  totalSolved: number;
  totalAttempted: number;
  notStarted: number;
  totalProblems: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
  progressPercentage: number;
}

// ====================
// GET MY PROGRESS
// ====================

export const getMyProgress = async () => {
  const response = await api.get("/users/me/progress");
  return response.data;
};

// ====================
// GET BOOKMARKED PROBLEMS
// ====================

export const getBookmarkedProblems = async (page = 1, limit = 20) => {
  const response = await api.get("/users/me/bookmarks", {
    params: { page, limit },
  });
  return response.data;
};

// ====================
// GET USER BY ID
// ====================

export const getUserById = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};
