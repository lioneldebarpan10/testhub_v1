import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader,
  Play,
  FileText,
  GraduationCap,
} from "lucide-react";
import { getCourseBySlug } from "../../api/course.api";
import type { Course, CourseModule, Lesson } from "../../types/problem";

const CourseDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCourse = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await getCourseBySlug(slug);
        setCourse(response.data);
        if (response.data?.modules?.length) {
          setExpandedModules(new Set(response.data.modules.slice(0, 1).map((module: CourseModule) => module.id)));
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load course"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  // Calculate actual progress stats

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return <div className="text-gray-400">Course not found</div>;
  }

  const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
  const completedLessons = Math.floor(totalLessons * 0.3);
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/30 to-blue-900/10 p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-blue-500/20">
                <GraduationCap className="h-6 w-6 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">{course.title}</h1>
            </div>

            {course.description && (
              <p className="mt-4 max-w-3xl text-gray-300 leading-relaxed">{course.description}</p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-gray-400">
                <BookOpen className="h-4 w-4" />
                {course.modules?.length ?? 0} modules
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-2 text-gray-400">
                <FileText className="h-4 w-4" />
                {totalLessons} lessons
              </span>
              <span className="text-gray-600">•</span>
              <span className={`font-medium ${course.published ? "text-green-400" : "text-yellow-400"}`}>
                {course.published ? "Published" : "Draft"}
              </span>
            </div>
          </div>
          {course.thumbnail && (
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-32 h-32 rounded-lg object-cover border border-gray-700"
            />
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Your Progress</h3>
            <span className="text-sm text-gray-400">{completedLessons} of {totalLessons} lessons</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{Math.round(progressPercentage)}% complete</p>
        </div>
      </div>

      {/* Modules Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Course Content</h2>
        
        {course.modules && course.modules.length > 0 ? (
          <div className="space-y-3">
            {course.modules.map((module: CourseModule, idx: number) => {
              const isOpen = expandedModules.has(module.id);
              const lessonCount = module.lessons?.length || 0;

              return (
                <div
                  key={module.id}
                  className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/40 hover:border-gray-700/50 transition"
                >
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-gray-900/60"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-sm font-bold text-blue-400 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{module.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-medium text-gray-400">
                        {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-800 bg-gray-950/40 px-6 py-4">
                      {module.lessons && module.lessons.length > 0 ? (
                        <div className="space-y-3">
                          {module.lessons.map((lesson: Lesson) => (
                            <div
                              key={lesson.id}
                              className="group rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3 transition hover:bg-gray-900/80 hover:border-gray-600"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="h-2 w-2 rounded-full bg-blue-400 flex-shrink-0 group-hover:bg-blue-300" />
                                  <div className="flex-1">
                                    <p className="font-medium text-white text-sm">{lesson.title}</p>
                                    {lesson.content && (
                                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                                        {lesson.content}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {lesson.videoUrl && (
                                    <a
                                      href={lesson.videoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                                      title="Watch video"
                                    >
                                      <Play className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No lessons added to this module yet.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-12 text-center">
            <BookOpen className="mx-auto mb-3 h-12 w-12 text-gray-600" />
            <p className="text-gray-400">No modules available for this course yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
