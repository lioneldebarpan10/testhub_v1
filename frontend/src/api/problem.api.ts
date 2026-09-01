import api from "./axios";

export const getAllProblems = async (
  page = 1,
  limit = 20,
  search?: string,
  difficulty?: string,
  topic?: string,
  company?: string
) => {
  const response = await api.get("/problems", {
    params: {
      page,
      limit,
      search,
      difficulty,
      topic,
      company,
    },
  });

  return response.data;
};

export const getProblemBySlug = async (slug: string) => {
  const response = await api.get(`/problems/${slug}`);

  return response.data;
};

export const updateProblemProgress = async (
  problemId: string,
  status: "NOT_STARTED" | "ATTEMPTED" | "SOLVED"
) => {
  const response = await api.post(`/problems/${problemId}/progress`, {
    status,
  });

  return response.data;
};

// ====================
// CREATE PROBLEM (ADMIN)
// ====================

export const createProblem = async (problemData: {
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topicId: string;
  companyIds?: string[];
  constraints?: string;
  examples?: any;
  solution?: string;
  videoUrl?: string;
  externalUrl?: string;
}) => {
  const response = await api.post("/problems", problemData);
  return response.data;
};

// ====================
// UPDATE PROBLEM (ADMIN)
// ====================

export const updateProblem = async (
  id: string,
  problemData: Partial<{
    title: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    topicId: string;
    companyIds?: string[];
    constraints?: string;
    examples?: any;
    solution?: string;
    videoUrl?: string;
    externalUrl?: string;
  }>
) => {
  const response = await api.put(`/problems/${id}`, problemData);
  return response.data;
};

// ====================
// DELETE PROBLEM (ADMIN)
// ====================

export const deleteProblem = async (id: string) => {
  const response = await api.delete(`/problems/${id}`);
  return response.data;
};