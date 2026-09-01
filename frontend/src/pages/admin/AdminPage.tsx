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
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  FolderPlus,
  Edit,
  Settings,
  Building2,
} from "lucide-react";
import { getAdminDashboard } from "../../api/admin.api";
import {
  createCourse,
  getAllCourses,
  deleteCourse,
  updateCourse,
} from "../../api/course.api";
import { createProblem, getAllProblems, updateProblem, deleteProblem } from "../../api/problem.api";
import { saveArticle, getArticle } from "../../api/article.api";
import { getAllTopics, createTopic, updateTopic, deleteTopic } from "../../api/topic.api";
import { getAllCompanies, createCompany, updateCompany, deleteCompany } from "../../api/company.api";
import type { Course, Problem, Sheet, Topic, Company } from "../../types/problem";
import {
  createSheet,
  getAllSheets,
  deleteSheet,
  updateSheet,
} from "../../api/sheet.api";

type SheetTopicDraft = {
  id: string;
  name: string;
  problemIds: string[];
  isOpen: boolean;
};

const AdminPage = () => {

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "courses" | "problems" | "articles" | "sheets" | "topics" | "companies" | "modules"
  >("dashboard");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Edit states
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

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
  const [problemCompanyIds, setProblemCompanyIds] = useState<string[]>([]);

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

  // Form states - Topic
  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [topicOrder, setTopicOrder] = useState(0);

  // Form states - Company
  const [companyName, setCompanyName] = useState("");

  const [sheetName, setSheetName] = useState("");
  const [sheetDescription, setSheetDescription] = useState("");
  const [sheetPublished, setSheetPublished] = useState(false);

  const [sheetTopics, setSheetTopics] = useState<SheetTopicDraft[]>([
    {
      id: Date.now().toString(),
      name: "",
      problemIds: [],
      isOpen: true,
    },
  ]);

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
      const res = await getAllCourses(false, 1, 100);
      setCourses(res.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSheetsData = async () => {
    try {
      setLoading(true);
      const res = await getAllSheets(false, 1, 100);
      setSheets(res.data || []);
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
      const [probRes, topicRes, compRes] = await Promise.all([
        getAllProblems(1, 100),
        getAllTopics(),
        getAllCompanies(),
      ]);
      setProblems(probRes.data || []);
      setTopics(topicRes.data || []);
      setCompanies(compRes.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCompaniesData = async () => {
    try {
      setLoading(true);
      const res = await getAllCompanies();
      setCompanies(res.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "dashboard") loadDashboardData();
    if (activeTab === "courses") loadCoursesData();
    if (activeTab === "sheets") {
      loadSheetsData();
      loadProblemsAndTopics();
    }

    if (
      activeTab === "problems" ||
      activeTab === "articles"
    ) {
      loadProblemsAndTopics();
    }

    if (activeTab === "topics") {
      loadProblemsAndTopics();
    }

    if (activeTab === "companies") {
      loadCompaniesData();
    }

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
      await loadCoursesData();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to post course");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCoursePublished = async (courseId: string, currentPublished: boolean) => {
    try {
      setLoading(true);
      await updateCourse(courseId, { published: !currentPublished });
      setSuccessMessage("Course visibility updated successfully!");
      await loadCoursesData();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to update course visibility");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Delete this course? This action cannot be undone.")) return;

    try {
      setLoading(true);
      await deleteCourse(courseId);
      setSuccessMessage("Course deleted successfully!");
      await loadCoursesData();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to delete course");
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
      
      if (editingProblemId) {
        await updateProblem(editingProblemId, {
          title: problemTitle.trim(),
          description: problemDescription.trim(),
          difficulty: problemDifficulty,
          topicId: problemTopicId,
          companyIds: problemCompanyIds,
          constraints: problemConstraints.trim() || undefined,
          externalUrl: problemExternalUrl.trim() || undefined,
          videoUrl: problemVideoUrl.trim() || undefined,
          solution: problemSolution.trim() || undefined,
        });
        setSuccessMessage("Problem updated successfully!");
        setEditingProblemId(null);
      } else {
        await createProblem({
          title: problemTitle.trim(),
          description: problemDescription.trim(),
          difficulty: problemDifficulty,
          topicId: problemTopicId,
          companyIds: problemCompanyIds,
          constraints: problemConstraints.trim() || undefined,
          externalUrl: problemExternalUrl.trim() || undefined,
          videoUrl: problemVideoUrl.trim() || undefined,
          solution: problemSolution.trim() || undefined,
        });
        setSuccessMessage("Question/Problem posted successfully!");
      }
      
      setProblemTitle("");
      setProblemDescription("");
      setProblemConstraints("");
      setProblemExternalUrl("");
      setProblemVideoUrl("");
      setProblemSolution("");
      setProblemCompanyIds([]);
      loadProblemsAndTopics();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProblem = (problem: Problem) => {
    setProblemTitle(problem.title);
    setProblemDescription(problem.description);
    setProblemDifficulty(problem.difficulty);
    setProblemTopicId(problem.topicId);
    setProblemConstraints(problem.constraints || "");
    setProblemExternalUrl(problem.externalUrl || "");
    setProblemVideoUrl(problem.videoUrl || "");
    setProblemSolution(problem.solution || "");
    setProblemCompanyIds(problem.companies?.map(c => c.id) || []);
    setEditingProblemId(problem.id);
    setActiveTab("problems");
    window.scrollTo(0, 0);
  };

  const handleDeleteProblem = async (problemId: string) => {
    if (!window.confirm("Delete this problem? This action cannot be undone.")) return;

    try {
      setLoading(true);
      await deleteProblem(problemId);
      setSuccessMessage("Problem deleted successfully!");
      await loadProblemsAndTopics();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to delete problem");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    if (!topicName.trim()) {
      setErrorMessage("Topic name is required");
      return;
    }
    try {
      setLoading(true);
      if (editingTopicId) {
        await updateTopic(editingTopicId, {
          name: topicName.trim(),
          description: topicDescription.trim() || undefined,
          order: topicOrder,
        });
        setSuccessMessage("Topic updated successfully!");
        setEditingTopicId(null);
      } else {
        await createTopic(topicName.trim(), "", topicDescription.trim() || undefined, topicOrder);
        setSuccessMessage("Topic created successfully!");
      }
      setTopicName("");
      setTopicDescription("");
      setTopicOrder(0);
      await loadProblemsAndTopics();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to save topic");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTopic = (topic: Topic) => {
    setTopicName(topic.name);
    setTopicDescription(topic.description || "");
    setTopicOrder(topic.order);
    setEditingTopicId(topic.id);
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!window.confirm("Delete this topic? This action cannot be undone.")) return;

    try {
      setLoading(true);
      await deleteTopic(topicId);
      setSuccessMessage("Topic deleted successfully!");
      await loadProblemsAndTopics();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to delete topic");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    if (!companyName.trim()) {
      setErrorMessage("Company name is required");
      return;
    }
    try {
      setLoading(true);
      if (editingCompanyId) {
        await updateCompany(editingCompanyId, {
          name: companyName.trim(),
        });
        setSuccessMessage("Company updated successfully!");
        setEditingCompanyId(null);
      } else {
        await createCompany(companyName.trim());
        setSuccessMessage("Company created successfully!");
      }
      setCompanyName("");
      await loadCompaniesData();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to save company");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompany = (company: Company) => {
    setCompanyName(company.name);
    setEditingCompanyId(company.id);
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!window.confirm("Delete this company? This action cannot be undone.")) return;

    try {
      setLoading(true);
      await deleteCompany(companyId);
      setSuccessMessage("Company deleted successfully!");
      await loadCompaniesData();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to delete company");
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

  // ====================
  // SHEET BUILDER HANDLERS
  // ====================

  const addTopicDrawer = () => {
    setSheetTopics((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        name: "",
        problemIds: [],
        isOpen: true,
      },
    ]);
  };

  const removeTopicDrawer = (topicDraftId: string) => {
    setSheetTopics((prev) =>
      prev.filter((topic) => topic.id !== topicDraftId)
    );
  };

  const toggleTopicDrawer = (topicDraftId: string) => {
    setSheetTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicDraftId
          ? { ...topic, isOpen: !topic.isOpen }
          : topic
      )
    );
  };

  const updateTopicName = (
    topicDraftId: string,
    name: string
  ) => {
    setSheetTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicDraftId
          ? { ...topic, name }
          : topic
      )
    );
  };

  const toggleProblemForTopic = (
    topicDraftId: string,
    problemId: string
  ) => {
    setSheetTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicDraftId) {
          // Remove the problem from other topics so
          // one problem belongs to only one topic
          return {
            ...topic,
            problemIds: topic.problemIds.filter(
              (id) => id !== problemId
            ),
          };
        }

        const alreadySelected =
          topic.problemIds.includes(problemId);

        return {
          ...topic,
          problemIds: alreadySelected
            ? topic.problemIds.filter(
              (id) => id !== problemId
            )
            : [...topic.problemIds, problemId],
        };
      })
    );
  };

  const handleCreateSheet = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!sheetName.trim()) {
      setErrorMessage("Sheet name is required");
      return;
    }

    const validTopics = sheetTopics.filter(
      (topic) => topic.name.trim()
    );

    if (validTopics.length === 0) {
      setErrorMessage(
        "Please add at least one topic to the sheet"
      );
      return;
    }

    try {
      setLoading(true);

      // 1. CREATE THE SHEET
      const sheetResponse = await createSheet(
        sheetName.trim(),
        sheetDescription.trim() || undefined,
        sheetPublished
      );

      const createdSheet =
        sheetResponse.data || sheetResponse;

      const createdSheetId = createdSheet.id;

      if (!createdSheetId) {
        throw new Error(
          "Sheet was created but its ID could not be found"
        );
      }

      // 2. CREATE TOPICS INSIDE THE SHEET
      // 3. ASSIGN EXISTING PROBLEMS TO EACH TOPIC

      for (let index = 0; index < validTopics.length; index++) {
        const topicDraft = validTopics[index];

        const topicResponse = await createTopic(
          topicDraft.name.trim(),
          createdSheetId,
          undefined,
          index + 1
        );

        const createdTopic =
          topicResponse.data || topicResponse;

        const createdTopicId = createdTopic.id;

        if (!createdTopicId) {
          throw new Error(
            `Failed to get ID for topic: ${topicDraft.name}`
          );
        }

        // Assign selected existing problems to this topic
        for (const problemId of topicDraft.problemIds) {
          await updateProblem(problemId, {
            topicId: createdTopicId,
          });
        }
      }

      setSuccessMessage(
        "Sheet created successfully with topics and problems!"
      );

      // Reset Sheet Builder
      setSheetName("");
      setSheetDescription("");
      setSheetPublished(false);

      setSheetTopics([
        {
          id: Date.now().toString(),
          name: "",
          problemIds: [],
          isOpen: true,
        },
      ]);

      await loadSheetsData();
      await loadProblemsAndTopics();
      await loadDashboardData();

    } catch (err: any) {
      console.error("Sheet creation error:", err);

      setErrorMessage(
        err.response?.data?.message ||
        err.message ||
        "Failed to create sheet"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSheetPublished = async (sheetId: string, currentPublished: boolean) => {
    try {
      setLoading(true);
      await updateSheet(sheetId, { published: !currentPublished });
      setSuccessMessage("Sheet visibility updated successfully!");
      await loadSheetsData();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to update sheet visibility");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSheet = async (sheetId: string) => {
    if (!window.confirm("Delete this sheet? This action cannot be undone.")) return;

    try {
      setLoading(true);
      await deleteSheet(sheetId);
      setSuccessMessage("Sheet deleted successfully!");
      await loadSheetsData();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to delete sheet");
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
          { id: "sheets", label: "Create Sheet", icon: <FolderPlus className="h-4 w-4" /> },
          { id: "topics", label: "Topics", icon: <BookOpen className="h-4 w-4" /> },
          { id: "courses", label: "Post Course", icon: <GraduationCap className="h-4 w-4" /> },
          { id: "problems", label: "Post Question", icon: <HelpCircle className="h-4 w-4" /> },
          { id: "articles", label: "Post Article", icon: <FileText className="h-4 w-4" /> },
          { id: "companies", label: "Companies", icon: <Building2 className="h-4 w-4" /> },

        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition whitespace-nowrap ${activeTab === tab.id
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
      {activeTab === "sheets" && (
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header */}
          <div className="rounded-xl border border-gray-850 bg-gray-900/30 p-6">
            <div className="flex items-center gap-3">
              <FolderPlus className="h-6 w-6 text-yellow-400" />

              <div>
                <h2 className="text-xl font-bold text-white">
                  Create DSA Sheet
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Create a sheet, add topics, and assign existing
                  problems to each topic.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-850 bg-gray-900/30 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Existing Sheets</h3>
            </div>
            <div className="space-y-3">
              {sheets.length === 0 ? (
                <p className="text-sm text-gray-500">No sheets created yet.</p>
              ) : (
                sheets.map((sheet) => (
                  <div key={sheet.id} className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{sheet.name}</p>
                      <p className="text-xs text-gray-500">
                        {sheet.published ? "Published" : "Draft"} • {sheet.topics?.length ?? 0} topics
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSheetPublished(sheet.id, sheet.published)}
                        className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-200 hover:border-gray-500"
                      >
                        {sheet.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSheet(sheet.id)}
                        className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <form
            onSubmit={handleCreateSheet}
            className="space-y-6"
          >
            {/* ==================== */}
            {/* SHEET INFORMATION */}
            {/* ==================== */}

            <div className="rounded-xl border border-gray-850 bg-gray-900/30 p-6">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-white">
                <BookOpen className="h-5 w-5 text-yellow-400" />
                Sheet Information
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-400">
                    Sheet Name *
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Striver A2Z DSA Sheet"
                    value={sheetName}
                    onChange={(e) =>
                      setSheetName(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-400">
                    Sheet Description
                  </label>

                  <textarea
                    placeholder="Describe what students will learn from this sheet..."
                    value={sheetDescription}
                    onChange={(e) =>
                      setSheetDescription(e.target.value)
                    }
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="sheetPublished"
                    type="checkbox"
                    checked={sheetPublished}
                    onChange={(e) =>
                      setSheetPublished(e.target.checked)
                    }
                    className="h-4 w-4"
                  />

                  <label
                    htmlFor="sheetPublished"
                    className="cursor-pointer text-sm text-gray-300"
                  >
                    Publish immediately
                  </label>
                </div>
              </div>
            </div>

            {/* ==================== */}
            {/* TOPIC DRAWERS */}
            {/* ==================== */}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Topics & Problems
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Each topic can contain multiple existing problems.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addTopicDrawer}
                  className="flex items-center gap-2 rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-400 transition hover:bg-yellow-400/20"
                >
                  <Plus className="h-4 w-4" />
                  Add Topic
                </button>
              </div>

              {/* Topic Drawers */}
              {sheetTopics.map((topicDraft, topicIndex) => (
                <div
                  key={topicDraft.id}
                  className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/30"
                >
                  {/* Drawer Header */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        toggleTopicDrawer(topicDraft.id)
                      }
                      className="flex flex-1 items-center justify-between p-5 text-left transition hover:bg-gray-900/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/10 text-sm font-bold text-yellow-400">
                          {topicIndex + 1}
                        </div>

                        <div>
                          <p className="font-semibold text-white">
                            {topicDraft.name.trim() ||
                              `Topic ${topicIndex + 1}`}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {
                              topicDraft.problemIds.length
                            } problem
                            {topicDraft.problemIds.length !== 1
                              ? "s"
                              : ""}{" "}
                            selected
                          </p>
                        </div>
                      </div>

                      {topicDraft.isOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {sheetTopics.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeTopicDrawer(topicDraft.id)
                        }
                        className="mr-4 rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Remove topic"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Drawer Content */}
                  {topicDraft.isOpen && (
                    <div className="space-y-5 border-t border-gray-800 p-5">
                      {/* Topic Name */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-400">
                          Topic Name *
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Arrays"
                          value={topicDraft.name}
                          onChange={(e) =>
                            updateTopicName(
                              topicDraft.id,
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
                        />
                      </div>

                      {/* Existing Problems */}
                      <div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-400">
                            Select Existing Problems
                          </label>

                          <p className="mt-1 text-xs text-gray-500">
                            Selected problems will be placed inside
                            this topic.
                          </p>
                        </div>

                        <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-gray-800 bg-gray-950 p-3">
                          {problems.length === 0 ? (
                            <div className="py-6 text-center text-sm text-gray-500">
                              No existing problems found.
                            </div>
                          ) : (
                            problems.map((problem) => {
                              const isSelected =
                                topicDraft.problemIds.includes(
                                  problem.id
                                );

                              return (
                                <label
                                  key={problem.id}
                                  className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition ${isSelected
                                      ? "border-yellow-400/50 bg-yellow-400/10"
                                      : "border-gray-800 hover:border-gray-700 hover:bg-gray-900"
                                    }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() =>
                                        toggleProblemForTopic(
                                          topicDraft.id,
                                          problem.id
                                        )
                                      }
                                      className="h-4 w-4"
                                    />

                                    <div>
                                      <p className="text-sm font-medium text-white">
                                        {problem.title}
                                      </p>

                                      <p className="mt-1 text-xs text-gray-500">
                                        {problem.topic?.name ||
                                          "Unassigned Topic"}
                                      </p>
                                    </div>
                                  </div>

                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${problem.difficulty ===
                                        "EASY"
                                        ? "bg-green-500/10 text-green-400"
                                        : problem.difficulty ===
                                          "MEDIUM"
                                          ? "bg-yellow-500/10 text-yellow-400"
                                          : "bg-red-500/10 text-red-400"
                                      }`}
                                  >
                                    {problem.difficulty}
                                  </span>
                                </label>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ==================== */}
            {/* CREATE BUTTON */}
            {/* ==================== */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Creating Sheet...
                </>
              ) : (
                <>
                  <FolderPlus className="h-5 w-5" />
                  Create Complete Sheet
                </>
              )}
            </button>
          </form>
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
                  <div key={c.id} className="py-3 flex items-center justify-between gap-3">
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCoursePublished(c.id, c.published)}
                        className="rounded-lg border border-gray-700 px-2.5 py-1.5 text-[11px] font-medium text-gray-200 hover:border-gray-500"
                      >
                        {c.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(c.id)}
                        className="rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-medium text-red-300 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
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
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-yellow-400" />
                {editingProblemId ? "Edit DSA Problem" : "Create a DSA Problem"}
              </h3>
              {editingProblemId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProblemId(null);
                    setProblemTitle("");
                    setProblemDescription("");
                    setProblemConstraints("");
                    setProblemExternalUrl("");
                    setProblemVideoUrl("");
                    setProblemSolution("");
                    setProblemCompanyIds([]);
                  }}
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  Clear
                </button>
              )}
            </div>

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
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Companies (Tags)</label>
                <div className="space-y-2">
                  <div className="grid gap-2 max-h-48 overflow-y-auto border border-gray-800 rounded-lg bg-gray-950 p-3">
                    {companies.length === 0 ? (
                      <p className="text-sm text-gray-500">No companies available. Create some in the Companies tab.</p>
                    ) : (
                      companies.map((c) => (
                        <div key={c.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`company-${c.id}`}
                            checked={problemCompanyIds.includes(c.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProblemCompanyIds([...problemCompanyIds, c.id]);
                              } else {
                                setProblemCompanyIds(problemCompanyIds.filter(id => id !== c.id));
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-600"
                          />
                          <label htmlFor={`company-${c.id}`} className="text-sm text-gray-300 cursor-pointer">
                            {c.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  {problemCompanyIds.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {problemCompanyIds.map(id => {
                        const company = companies.find(c => c.id === id);
                        return company ? (
                          <span key={id} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-medium">
                            {company.name}
                            <button
                              type="button"
                              onClick={() => setProblemCompanyIds(problemCompanyIds.filter(cid => cid !== id))}
                              className="hover:text-yellow-400"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
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
                {loading ? <Loader className="h-5 w-5 animate-spin" /> : (editingProblemId ? "Update Problem" : "Post Question")}
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
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span
                          className={`font-semibold ${p.difficulty === "EASY"
                            ? "text-green-400"
                            : p.difficulty === "MEDIUM"
                              ? "text-yellow-400"
                              : "text-red-400"
                            }`}
                        >
                          {p.difficulty}
                        </span>{" "}
                        • {p.topic?.name || "No Topic"}
                        {p.companies && p.companies.length > 0 && (
                          <span className="ml-2">
                            • {p.companies.map(c => c.name).join(", ")}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditProblem(p)}
                        className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-2 py-1 text-[11px] font-medium text-blue-300 hover:bg-blue-500/20"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProblem(p.id)}
                        className="rounded-lg border border-red-500/40 bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "topics" && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Topic Form */}
          <div className="lg:col-span-2 rounded-xl border border-gray-850 bg-gray-900/30 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-yellow-400" />
                {editingTopicId ? "Edit Topic" : "Create Topic"}
              </h3>
              {editingTopicId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTopicId(null);
                    setTopicName("");
                    setTopicDescription("");
                    setTopicOrder(0);
                  }}
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  Clear
                </button>
              )}
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Topic Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Arrays, Linked Lists, Trees..."
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
                <textarea
                  placeholder="Describe this topic..."
                  value={topicDescription}
                  onChange={(e) => setTopicDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Order</label>
                <input
                  type="number"
                  value={topicOrder}
                  onChange={(e) => setTopicOrder(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="h-5 w-5 animate-spin" /> : (editingTopicId ? "Update Topic" : "Create Topic")}
              </button>
            </form>
          </div>

          {/* Topics List */}
          <div className="rounded-xl border border-gray-850 bg-gray-900/30 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-400" />
              All Topics
            </h3>
            <div className="divide-y divide-gray-800 overflow-y-auto max-h-[500px] pr-2">
              {topics.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No topics created yet.</p>
              ) : (
                topics.map((t) => (
                  <div key={t.id} className="py-3 flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{t.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Order: {t.order}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditTopic(t)}
                        className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-2 py-1 text-[11px] font-medium text-blue-300 hover:bg-blue-500/20"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTopic(t.id)}
                        className="rounded-lg border border-red-500/40 bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "companies" && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Company Form */}
          <div className="lg:col-span-2 rounded-xl border border-gray-850 bg-gray-900/30 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-yellow-400" />
                {editingCompanyId ? "Edit Company" : "Create Company"}
              </h3>
              {editingCompanyId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCompanyId(null);
                    setCompanyName("");
                  }}
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  Clear
                </button>
              )}
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Amazon, Microsoft..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="h-5 w-5 animate-spin" /> : (editingCompanyId ? "Update Company" : "Create Company")}
              </button>
            </form>
          </div>

          {/* Companies List */}
          <div className="rounded-xl border border-gray-850 bg-gray-900/30 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              All Companies
            </h3>
            <div className="divide-y divide-gray-800 overflow-y-auto max-h-[500px] pr-2">
              {companies.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No companies created yet.</p>
              ) : (
                companies.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Slug: {c.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditCompany(c)}
                        className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-2 py-1 text-[11px] font-medium text-blue-300 hover:bg-blue-500/20"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCompany(c.id)}
                        className="rounded-lg border border-red-500/40 bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
                    <label className="block text-sm font-medium text-gray-400 mb-1.5 flex items-center gap-2">
                      <span className="inline-block px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs font-semibold">Approach 1</span>
                      Brute Force
                    </label>
                    <textarea
                      placeholder="Explain brute force approach, intuition, and why it works..."
                      value={articleBruteForce}
                      onChange={(e) => setArticleBruteForce(e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">Include explanation, algorithm outline, and complexity notes</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5 flex items-center gap-2">
                      <span className="inline-block px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 text-xs font-semibold">Approach 2</span>
                      Better Approach
                    </label>
                    <textarea
                      placeholder="Explain improved solution, optimization strategies, and why it's better..."
                      value={articleBetterApproach}
                      onChange={(e) => setArticleBetterApproach(e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">Include explanation, algorithm outline, and complexity notes</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5 flex items-center gap-2">
                      <span className="inline-block px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs font-semibold">Approach 3</span>
                      Optimal Approach
                    </label>
                    <textarea
                      placeholder="Explain the most efficient solution, key insights, and trade-offs..."
                      value={articleOptimalApproach}
                      onChange={(e) => setArticleOptimalApproach(e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">Include explanation, algorithm outline, and complexity notes</p>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-5">
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Detailed Algorithm & Code Breakdown
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Algorithm Explanation (Step-by-Step)</label>
                      <textarea
                        placeholder="Provide detailed step-by-step algorithm explanation with diagrams references..."
                        value={articleAlgorithm}
                        onChange={(e) => setArticleAlgorithm(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">💻 Solution Code (Professional Board)</label>
                        <textarea
                          placeholder="```python
def solution(nums):
    # Your optimal code here
    pass
```"
                          value={articleCode}
                          onChange={(e) => setArticleCode(e.target.value)}
                          rows={6}
                          className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white font-mono text-sm outline-none focus:border-yellow-400 transition resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">Format code with language identifier (python, java, cpp, etc.)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">⏱️ Complexity Analysis</label>
                        <textarea
                          placeholder="Time Complexity: O(n log n) - Explain why
Space Complexity: O(n) - Explain trade-offs"
                          value={articleComplexity}
                          onChange={(e) => setArticleComplexity(e.target.value)}
                          rows={6}
                          className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition resize-none"
                        />
                      </div>
                    </div>
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
