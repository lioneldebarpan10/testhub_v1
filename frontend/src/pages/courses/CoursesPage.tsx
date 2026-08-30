import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Loader,
  ChevronRight,
  Layers,
} from "lucide-react";
import { getAllCourses } from "../../api/course.api";
import type { Course } from "../../types/problem";

const CoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getAllCourses(true, 1, 100);
        setCourses(response.data || []);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <GraduationCap className="h-9 w-9 text-blue-400" />
          <h1 className="text-4xl font-bold text-white">Courses</h1>
        </div>
        <p className="mt-2 text-gray-400">
          Follow structured courses with modules and lessons to build solid
          fundamentals.
        </p>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-16 text-center">
          <BookOpen className="mx-auto mb-4 h-14 w-14 text-gray-600" />
          <h2 className="text-xl font-semibold text-white">
            No courses available yet
          </h2>
          <p className="mt-2 text-gray-500">
            Check back soon — courses are being added regularly.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const moduleCount =
              (course as any)._count?.modules ?? course.modules?.length ?? 0;

            return (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.slug}`)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition duration-200 hover:border-blue-500/50 hover:bg-gray-900/80 hover:shadow-lg hover:shadow-blue-500/5"
              >
                {/* Thumbnail / Gradient Banner */}
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-blue-900/40 via-gray-900 to-purple-900/40">
                    <GraduationCap className="h-14 w-14 text-blue-500/60" />
                  </div>
                )}

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition">
                    {course.title}
                  </h3>

                  {course.description && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-400 line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  {/* Footer Row */}
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Layers className="h-4 w-4" />
                      <span>{moduleCount} Modules</span>
                    </div>

                    <span className="flex items-center gap-1 text-sm font-medium text-blue-400 transition group-hover:gap-2">
                      View Course
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;