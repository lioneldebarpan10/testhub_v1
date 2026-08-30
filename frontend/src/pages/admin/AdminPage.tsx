import { useState, useEffect } from "react";
import {
  Shield,
  Layers,
  GraduationCap,
  PlusCircle,
  BookOpen,
  CheckCircle2,
  FileText,
  AlertCircle,
  Loader,
  HelpCircle,
} from "lucide-react";
import { getAdminDashboard } from "../../api/admin.api";
import { createCourse, getAllCourses } from "../../api/course.api";
import { createProblem, getAllProblems } from "../../api/problem.api";
import { saveArticle, getArticle } from "../../api/article.api";
import { getAllTopics } from "../../api/topic.api";
import type { Course, Problem, Topic } from "../../types/problem";

const AdminPage = () => {
  // Tabs: 'dashboard' | 'courses' | 'problems' | 'articles'
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "problems" | "articles">("dashboard");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  // Form states - Course
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState("");
  const [coursePublished, setCoursePublished] = useState(false);

  // Form states - Problem
  const [problemTitle, setProblemTitle] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [problemDifficulty, setProblemDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [problemTopicId, setProblemTopicId] = useState("");
  const [problemConstraints, setProblemConstraints] = useState("");
  const [problemExternalUrl, setProblemExternalUrl] = useState("");
  const [problemVideoUrl, setProblemVideoUrl] = useState("");
  const [problemSolution, setProblemSolution] = useState("");

  // Form states - Article
  const [articleProblemId, setArticleProblemId] = useState("");
  const [articleStatement, setArticleStatement] = useState("");
  const [articleExamples, setArticleExamples] = useState("");
  const [articleBruteForce, setArticleBruteForce] = useState("");
  const [articleBetterApproach, setArticleBetterApproach] = useState("");
  const [articleOptimalApproach, setArticleOptimalApproach] = useState("");
  const [articleAlgorithm, setArticleAlgorithm] = useState("");
  const [articleCode, setArticleCode] = useState("");
  const [articleComplexity, setArticleComplexity] = useState("");
  const [articleVideoUrl, setArticleVideoUrl] = useState("");

  // Load Dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboard();
      setStats(res.data);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  // Load Courses data
  const loadCoursesData = async () => {
    try {
      setLoading(true);
      const res = await getAllCourses(false, 1, 100); // include unpublished
      setCourses(res.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load Problems & Topics data
  const loadProblemsAndTopics = async () => {
    try {
      setLoading(true);
      const [probRes, topicRes] = await Promise.all([
        getAllProblems(1, 100),
        getAllTopics(),
      ]);
      setProblems(probRes.data || []);
      setTopics(topicRes.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "dashboard") loadDashboardData();
    if (activeTab === "courses") loadCoursesData();
    if (activeTab === "problems") loadProblemsAndTopics();
    if (activeTab === "articles") loadProblemsAndTopics();
    setSuccessMessage("");
    setErrorMessage("");
  }, [activeTab]);

  // Load existing article if any when selected problem changes
  useEffect(() => {
    if (articleProblemId) {
      const fetchExistingArticle = async () => {
        try {
          const res = await getArticle(articleProblemId);
          if (res.success && res.data) {
            const art = res.data;
            setArticleStatement(art.statement || "");
            setArticleExamples(art.examples || "");
            setArticleBruteForce(art.bruteForce || "");
            setArticleBetterApproach(art.betterApproach || "");
            setArticleOptimalApproach(art.optimalApproach || "");
            setArticleAlgorithm(art.algorithm || "");
            setArticleCode(art.code || "");
            setArticleComplexity(art.complexity || "");
            setArticleVideoUrl(art.videoUrl || "");
          } else {
            clearArticleFormExceptProblem();
          }
        } catch (err) {
          clearArticleFormExceptProblem();
        }
      };
      fetchExistingArticle();
    } else {
      clearArticleFormExceptProblem();
    }
  }, [articleProblemId]);

  const clearArticleFormExceptProblem = () => {
    setArticleStatement("");
    setArticleExamples("");
    setArticleBruteForce("");
    setArticleBetterApproach("");
    setArticleOptimalApproach("");
    setArticleAlgorithm("");
    setArticleCode("");
    setArticleComplexity("");
    setArticleVideoUrl("");
  };

  // Handlers
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    if (!courseTitle.trim()) {
      setErrorMessage("Course title is required");
      return;
    }
    try {
      setLoading(true);
      await createCourse(
        courseTitle.trim(),
        courseDescription.trim() || undefined,
        courseThumbnail.trim() || undefined,
        coursePublished
      );
      setSuccessMessage("Course posted successfully!");
      setCourseTitle("");
      setCourseDescription("");
      setCourseThumbnail("");
      setCoursePublished(false);
      loadCoursesData();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to post course");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    if (!problemTitle.trim() || !problemDescription.trim() || !problemTopicId) {
      setErrorMessage("Title, Description, and Topic are required");
      return;
    }
    try {
      setLoading(true);
      await createProblem({
        title: problemTitle.trim(),
        description: problemDescription.trim(),
        difficulty: problemDifficulty,
        topicId: problemTopicId,
        constraints: problemConstraints.trim() || undefined,
        externalUrl: problemExternalUrl.trim() || undefined,
        videoUrl: problemVideoUrl.trim() || undefined,
        solution: problemSolution.trim() || undefined,
      });
      setSuccessMessage("Question/Problem posted successfully!");
      setProblemTitle("");
      setProblemDescription("");
      setProblemConstraints("");
      setProblemExternalUrl("");
      setProblemVideoUrl("");
      setProblemSolution("");
      loadProblemsAndTopics();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    if (!articleProblemId) {
      setErrorMessage("Please select a problem");
      return;
    }
    try {
      setLoading(true);
      await saveArticle(articleProblemId, {
        statement: articleStatement.trim() || undefined,
        examples: articleExamples.trim() || undefined,
        bruteForce: articleBruteForce.trim() || undefined,
        betterApproach: articleBetterApproach.trim() || undefined,
        optimalApproach: articleOptimalApproach.trim() || undefined,
        algorithm: articleAlgorithm.trim() || undefined,
        code: articleCode.trim() || undefined,
        complexity: articleComplexity.trim() || undefined,
        videoUrl: articleVideoUrl.trim() || undefined,
      });
      setSuccessMessage("Problem Solution Article saved successfully!");
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Admin Control Panel</h1>
          </div>
          <p className="mt-2 text-gray-400">
            Publish courses, write detailed problem articles, and post coding questions.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-850 gap-2 overflow-x-auto pb-px">
        {[
          { id: "dashboard", label: "Overview", icon: <Layers className="h-4 w-4" /> },
          { id: "courses", label: "Post Course", icon: <GraduationCap className="h-4 w-4" /> },
          { id: "problems", label: "Post Question", icon: <HelpCircle className="h-4 w-4" /> },
          { id: "articles", label: "Post Article", icon: <FileText className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition whitespace-nowrap ${
              activeTab === tab.id
                ? "border-yellow-400 text-yellow-400"
                : "border-transparent text-gray-400 hover:border-gray-700 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400 text-sm">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {loading && !stats ? (
            <div className="flex h-48 items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
          ) : (
            stats && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Users", value: stats.totalUsers, color: "text-blue-400" },
                  { label: "DSA Problems", value: stats.totalProblems, color: "text-purple-400" },
                  { label: "DSA Topics", value: stats.totalTopics, color: "text-green-400" },
                  { label: "Company Tags", value: stats.totalCompanies, color: "text-yellow-400" },
                  { label: "Total Courses", value: stats.totalCourses, color: "text-pink-400" },
                  { label: "Course Modules", value: stats.totalModules, color: "text-indigo-400" },
                  { label: "Lessons", value: stats.totalLessons, color: "text-cyan-400" },
                  { label: "Total Solved Problems", value: stats.totalSolvedProblems, color: "text-emerald-400" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 transition hover:bg-gray-900/60"
                  >
                    <p className="text-sm font-medium text-gray-400">{item.label}</p>
                    <p className={`mt-2 text-3xl font-extrabold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {activeTab === "courses" && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Post Form */}
          <div className="lg:col-span-2 rounded-xl border border-gray-850 bg-gray-900/30 p-6 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-yellow-400" />
              Create a New Course
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Course Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Master Competitive Programming"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
                <textarea
                  placeholder="Provide a comprehensive course description..."
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Thumbnail Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/thumbnail.png"
                  value={courseThumbnail}
                  onChange={(e) => setCourseThumbnail(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="coursePublished"
                  checked={coursePublished}
                  onChange={(e) => setCoursePublished(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-gray-800 bg-gray-950 text-yellow-400 focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="coursePublished" className="text-sm font-medium text-gray-300 select-none">
                  Publish immediately (visible to all users)
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="h-5 w-5 animate-spin" /> : "Post Course"}
              </button>
            </form>
          </div>

          {/* List panel */}
          <div className="rounded-xl border border-gray-850 bg-gray-900/30 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-400" />
              Existing Courses
            </h3>
            <div className="divide-y divide-gray-800 overflow-y-auto max-h-96 pr-2">
              {courses.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No courses listed yet.</p>
              ) : (
                courses.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{c.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {c.published ? (
                          <span className="text-green-500 font-medium">Published</span>
                        ) : (
                          <span className="text-gray-500">Draft</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "problems" && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Post Question Form */}
          <div className="lg:col-span-2 rounded-xl border border-gray-850 bg-gray-900/30 p-6 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-yellow-400" />
              Create a DSA Problem
            </h3>

            <form onSubmit={handleCreateProblem} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Problem Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Longest Substring Without Repeating Characters"
                    value={problemTitle}
                    onChange={(e) => setProblemTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Topic / Category *</label>
                  <select
                    value={problemTopicId}
                    onChange={(e) => setProblemTopicId(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                    required
                  >
                    <option value="">-- Select a Topic --</option>
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Problem Description *</label>
                <textarea
                  placeholder="Explain the problem statements, goals, and setup..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Difficulty *</label>
                  <select
                    value={problemDifficulty}
                    onChange={(e) => setProblemDifficulty(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                    required
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Constraints</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 <= nums.length <= 10^5"
                    value={problemConstraints}
                    onChange={(e) => setProblemConstraints(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">LeetCode / External URL</label>
                  <input
                    type="url"
                    placeholder="https://leetcode.com/problems/..."
                    value={problemExternalUrl}
                    onChange={(e) => setProblemExternalUrl(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Video Explanation Link</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={problemVideoUrl}
                    onChange={(e) => setProblemVideoUrl(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Initial Solution Snippet (Optional)</label>
                <textarea
                  placeholder="class Solution { ... }"
                  value={problemSolution}
                  onChange={(e) => setProblemSolution(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white font-mono text-sm outline-none focus:border-yellow-400 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="h-5 w-5 animate-spin" /> : "Post Question"}
              </button>
            </form>
          </div>

          {/* List panel */}
          <div className="rounded-xl border border-gray-850 bg-gray-900/30 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-400" />
              Recent Problems
            </h3>
            <div className="divide-y divide-gray-800 overflow-y-auto max-h-[500px] pr-2">
              {problems.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No problems created yet.</p>
              ) : (
                problems.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span
                          className={`font-semibold ${
                            p.difficulty === "EASY"
                              ? "text-green-400"
                              : p.difficulty === "MEDIUM"
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {p.difficulty}
                        </span>{" "}
                        • {p.topic?.name || "No Topic"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "articles" && (
        <div className="rounded-xl border border-gray-850 bg-gray-900/30 p-6 space-y-6 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-yellow-400" />
            Write or Update Solution Article
          </h3>

          <form onSubmit={handleSaveArticle} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Select a Problem *</label>
              <select
                value={articleProblemId}
                onChange={(e) => setArticleProblemId(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                required
              >
                <option value="">-- Select a Problem --</option>
                {problems.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.difficulty.toLowerCase()})
                  </option>
                ))}
              </select>
            </div>

            {articleProblemId && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Problem Statement</label>
                  <textarea
                    placeholder="Enter the problem statement..."
                    value={articleStatement}
                    onChange={(e) => setArticleStatement(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Examples</label>
                  <textarea
                    placeholder="Provide example input/output and explanation..."
                    value={articleExamples}
                    onChange={(e) => setArticleExamples(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Brute Force Approach</label>
                    <textarea
                      placeholder="Explain brute force idea..."
                      value={articleBruteForce}
                      onChange={(e) => setArticleBruteForce(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Better Approach</label>
                    <textarea
                      placeholder="Explain improved solution..."
                      value={articleBetterApproach}
                      onChange={(e) => setArticleBetterApproach(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Optimal Approach</label>
                    <textarea
                      placeholder="Explain the most efficient solution..."
                      value={articleOptimalApproach}
                      onChange={(e) => setArticleOptimalApproach(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Algorithm Explanation</label>
                  <textarea
                    placeholder="Step by step details of the algorithm..."
                    value={articleAlgorithm}
                    onChange={(e) => setArticleAlgorithm(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Solution Code</label>
                    <textarea
                      placeholder="Paste clean optimal code..."
                      value={articleCode}
                      onChange={(e) => setArticleCode(e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white font-mono text-sm outline-none focus:border-yellow-400 transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Complexity Analysis</label>
                    <textarea
                      placeholder="Time: O(N) / Space: O(1)..."
                      value={articleComplexity}
                      onChange={(e) => setArticleComplexity(e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Video Walkthrough URL</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={articleVideoUrl}
                    onChange={(e) => setArticleVideoUrl(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader className="h-5 w-5 animate-spin" /> : "Save Article"}
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
