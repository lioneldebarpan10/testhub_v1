import api from "./axios";

// ====================
// GET MODULES BY COURSE
// ====================

export const getModulesByCourse = async (courseId: string) => {
  const response = await api.get(`/modules/course/${courseId}`);
  return response.data;
};

// ====================
// GET LESSONS BY MODULE
// ====================

export const getLessonsByModule = async (moduleId: string) => {
  const response = await api.get(`/modules/${moduleId}/lessons`);
  return response.data;
};

// ====================
// CREATE MODULE (ADMIN)
// ====================

export const createModule = async (data: {
  title: string;
  courseId: string;
  order: number;
  description?: string;
}) => {
  const response = await api.post("/modules", data);
  return response.data;
};

// ====================
// UPDATE MODULE (ADMIN)
// ====================

export const updateModule = async (
  id: string,
  data: {
    title?: string;
    order?: number;
    description?: string;
  }
) => {
  const response = await api.put(`/modules/${id}`, data);
  return response.data;
};

// ====================
// DELETE MODULE (ADMIN)
// ====================

export const deleteModule = async (id: string) => {
  const response = await api.delete(`/modules/${id}`);
  return response.data;
};
