import api from "./axios";

export const addBookmark = async (problemId: string) => {
  const response = await api.post(
    `/problems/${problemId}/bookmark`
  );

  return response.data;
};

export const removeBookmark = async (problemId: string) => {
  const response = await api.delete(
    `/problems/${problemId}/bookmark`
  );

  return response.data;
};

export const getMyBookmarks = async () => {
  const response = await api.get(
    "/users/me/bookmarks"
  );

  return response.data;
};