import api from "./axios";

// ====================
// GET ALL COURSES
// ====================

export const getAllCourses = async (published = true, page = 1, limit = 10) => {
  const response = await api.get("/courses", {
    params: {
      published: published.toString(),
      page,
      limit,
    },
  });
  return response.data;
};

// ====================
// GET COURSE BY SLUG
// ====================

export const getCourseBySlug = async (slug: string) => {
  const response = await api.get(`/courses/${slug}`);
  return response.data;
};

// ====================
// GET COURSE BY ID
// ====================

export const getCourseById = async (id: string) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

// ====================
// CREATE COURSE (ADMIN)
// ====================

export const createCourse = async (
  title: string,
  description?: string,
  thumbnail?: string,
  published?: boolean
) => {
  const response = await api.post("/courses", {
    title,
    description,
    thumbnail,
    published,
  });
  return response.data;
};

// ====================
// UPDATE COURSE (ADMIN)
// ====================

export const updateCourse = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    thumbnail?: string;
    published?: boolean;
  }
) => {
  const response = await api.put(`/courses/${id}`, data);
  return response.data;
};

// ====================
// DELETE COURSE (ADMIN)
// ====================

export const deleteCourse = async (id: string) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};
