import api from "./axios";

export const getAllCompanies = async () => {
  const response = await api.get("/companies");
  return response.data;
};

export const getCompanyBySlug = async (slug: string) => {
  const response = await api.get(`/companies/${slug}`);
  return response.data;
};

export const createCompany = async (name: string) => {
  const response = await api.post("/companies", { name });
  return response.data;
};

export const updateCompany = async (id: string, data: { name?: string }) => {
  const response = await api.put(`/companies/${id}`, data);
  return response.data;
};

export const deleteCompany = async (id: string) => {
  const response = await api.delete(`/companies/${id}`);
  return response.data;
};
