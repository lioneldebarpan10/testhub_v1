import api from "./axios";

export interface ProblemArticle {
  id: string;
  problemId: string;
  statement?: string;
  examples?: string;
  bruteForce?: string;
  betterApproach?: string;
  optimalApproach?: string;
  algorithm?: string;
  code?: string;
  complexity?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ====================
// GET ARTICLE BY PROBLEM SLUG
// ====================

export const getArticleByProblemSlug = async (problemSlug: string) => {
  const response = await api.get(`/articles/problem/${problemSlug}`);
  return response.data;
};

// ====================
// GET ARTICLE BY PROBLEM ID (ADMIN)
// ====================

export const getArticle = async (problemId: string) => {
  const response = await api.get(`/articles/${problemId}`);
  return response.data;
};

// ====================
// CREATE OR UPDATE ARTICLE (ADMIN)
// ====================

export const saveArticle = async (
  problemId: string,
  articleData: Partial<ProblemArticle>
) => {
  const response = await api.post(`/articles/${problemId}`, articleData);
  return response.data;
};

// ====================
// DELETE ARTICLE (ADMIN)
// ====================

export const deleteArticle = async (problemId: string) => {
  const response = await api.delete(`/articles/${problemId}`);
  return response.data;
};
