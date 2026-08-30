import api from "./axios";

// ====================
// GET ALL TOPICS
// ====================

export const getAllTopics = async () => {
  const response = await api.get("/topics");
  return response.data;
};

// ====================
// GET TOPIC BY SLUG
// ====================

export const getTopicBySlug = async (slug: string) => {
  const response = await api.get(`/topics/${slug}`);
  return response.data;
};

// ====================
// CREATE TOPIC (ADMIN)
// ====================

export const createTopic = async (
  name: string,
  sheetId: string,
  description?: string,
  order?: number
) => {
  const response = await api.post("/topics", {
    name,
    sheetId,
    description,
    order,
  });
  return response.data;
};

// ====================
// UPDATE TOPIC (ADMIN)
// ====================

export const updateTopic = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    order?: number;
  }
) => {
  const response = await api.put(`/topics/${id}`, data);
  return response.data;
};

// ====================
// DELETE TOPIC (ADMIN)
// ====================

export const deleteTopic = async (id: string) => {
  const response = await api.delete(`/topics/${id}`);
  return response.data;
};
