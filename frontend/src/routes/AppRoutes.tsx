import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import SheetsPage from "../pages/sheets/SheetsPage";
import SheetDetailsPage from "../pages/sheets/SheetDetailsPage";
import ProblemsPage from "../pages/problems/ProblemsPage";
import CoursesPage from "../pages/courses/CoursesPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProblemDetailsPage from "../pages/problems/ProblemDetailsPage";
import BookmarksPage from "../pages/bookmarks/BookmarksPage";
import ProfilePage from "../pages/profile/ProfilePage";
import AdminPage from "../pages/admin/AdminPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Pages with Navbar + Footer */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />

      <Route
        path="/sheets"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SheetsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/sheets/:slug"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SheetDetailsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/problems"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProblemsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/problems/:slug"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProblemDetailsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookmarks"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BookmarksPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CoursesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <MainLayout>
              <AdminPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Authentication pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;