import api from "./axios";

// ====================
// GET ALL SHEETS
// ====================

export const getAllSheets = async (published = true, page = 1, limit = 10) => {
  const response = await api.get("/sheets", {
    params: {
      published: published.toString(),
      page,
      limit,
    },
  });
  return response.data;
};

// ====================
// GET SHEET BY SLUG
// ====================

export const getSheetBySlug = async (slug: string) => {
  const response = await api.get(`/sheets/${slug}`);
  return response.data;
};

// ====================
// CREATE SHEET (ADMIN)
// ====================

export const createSheet = async (
  name: string,
  description?: string,
  published?: boolean
) => {
  const response = await api.post("/sheets", {
    name,
    description,
    published,
  });
  return response.data;
};

// ====================
// UPDATE SHEET (ADMIN)
// ====================

export const updateSheet = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    published?: boolean;
    order?: number;
  }
) => {
  const response = await api.put(`/sheets/${id}`, data);
  return response.data;
};

// ====================
// DELETE SHEET (ADMIN)
// ====================

export const deleteSheet = async (id: string) => {
  const response = await api.delete(`/sheets/${id}`);
  return response.data;
};
