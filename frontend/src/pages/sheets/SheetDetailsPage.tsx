import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Bookmark,
  Check,
  Loader,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { getSheetBySlug } from "../../api/sheet.api";
import { useAuth } from "../../hooks/useAuth";
import {
  addBookmark,
  removeBookmark,
} from "../../api/bookmark.api";
import {
  updateProblemProgress,
} from "../../api/problem.api";
import type { Sheet, Topic, DsaModule, Problem } from "../../types/problem";

const SheetDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(
    new Set()
  );
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [solving, setSolving] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSheet = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await getSheetBySlug(slug);
        setSheet(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load sheet"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSheet();
  }, [slug]);

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleBookmark = async (problemId: string, isBookmarked: boolean) => {
    if (!user) return;

    try {
      if (isBookmarked) {
        await removeBookmark(problemId);
        setBookmarks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(problemId);
          return newSet;
        });
      } else {
        await addBookmark(problemId);
        setBookmarks((prev) => new Set(prev).add(problemId));
      }
    } catch (err: any) {
      console.error("Bookmark error:", err);
    }
  };

  const handleUpdateProgress = async (
    problemId: string,
    status: "NOT_STARTED" | "ATTEMPTED" | "SOLVED"
  ) => {
    if (!user) return;

    try {
      setSolving((prev) => new Set(prev).add(problemId));

      await updateProblemProgress(problemId, status);

      if (sheet && sheet.topics) {
        const updatedSheet = {
          ...sheet,
          topics: sheet.topics.map((topic) => ({
            ...topic,

            // Update problems directly inside a topic
            problems: topic.problems?.map((problem) =>
              problem.id === problemId
                ? {
                  ...problem,
                  progress: {
                    ...problem.progress,
                    status,
                  } as any,
                }
                : problem
            ),

            // Keep existing module structure working
            modules: topic.modules?.map((mod) => ({
              ...mod,
              problems: mod.problems?.map((problem) =>
                problem.id === problemId
                  ? {
                    ...problem,
                    progress: {
                      ...problem.progress,
                      status,
                    } as any,
                  }
                  : problem
              ),
            })),
          })),
        };

        setSheet(updatedSheet);
      }
    } catch (err: any) {
      console.error("Progress update error:", err);
    } finally {
      setSolving((prev) => {
        const newSet = new Set(prev);
        newSet.delete(problemId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
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

  if (!sheet) {
    return <div className="text-gray-400">Sheet not found</div>;
  }

  // Calculate statistics
  const calculateStats = () => {
    let totalProblems = 0;
    let solvedCount = 0;
    let attemptedCount = 0;
    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;

    sheet.topics?.forEach((topic: Topic) => {
      topic.problems?.forEach((problem: Problem) => {
        totalProblems++;
        if (problem.progress?.status === "SOLVED") solvedCount++;
        if (problem.progress?.status === "ATTEMPTED") attemptedCount++;
        
        if (problem.difficulty === "EASY") easyCount++;
        else if (problem.difficulty === "MEDIUM") mediumCount++;
        else if (problem.difficulty === "HARD") hardCount++;
      });

      topic.modules?.forEach((mod: DsaModule) => {
        mod.problems?.forEach((problem: Problem) => {
          totalProblems++;
          if (problem.progress?.status === "SOLVED") solvedCount++;
          if (problem.progress?.status === "ATTEMPTED") attemptedCount++;
          
          if (problem.difficulty === "EASY") easyCount++;
          else if (problem.difficulty === "MEDIUM") mediumCount++;
          else if (problem.difficulty === "HARD") hardCount++;
        });
      });
    });

    const progressPercentage = totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0;

    return {
      totalProblems,
      solvedCount,
      attemptedCount,
      easyCount,
      mediumCount,
      hardCount,
      progressPercentage,
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/30 to-blue-900/10 p-8">
        <h1 className="text-4xl font-bold text-white mb-3">{sheet.name}</h1>
        {sheet.description && (
          <p className="text-gray-300 leading-relaxed mb-6">{sheet.description}</p>
        )}
        
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          <div className="rounded-lg bg-gray-900/50 border border-gray-700 p-3">
            <p className="text-xs text-gray-500 mb-1">Total Problems</p>
            <p className="text-2xl font-bold text-blue-400">{stats.totalProblems}</p>
          </div>
          <div className="rounded-lg bg-gray-900/50 border border-gray-700 p-3">
            <p className="text-xs text-gray-500 mb-1">Solved</p>
            <p className="text-2xl font-bold text-green-400">{stats.solvedCount}</p>
          </div>
          <div className="rounded-lg bg-gray-900/50 border border-gray-700 p-3">
            <p className="text-xs text-gray-500 mb-1">Attempted</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.attemptedCount}</p>
          </div>
          <div className="rounded-lg bg-gray-900/50 border border-gray-700 p-3">
            <p className="text-xs text-gray-500 mb-1">Topics</p>
            <p className="text-2xl font-bold text-purple-400">{sheet.topics?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
            <span className="text-sm text-gray-400">{stats.solvedCount} / {stats.totalProblems} solved</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{Math.round(stats.progressPercentage)}% complete</p>
        </div>

        {/* Difficulty Distribution */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-400 mb-3">Difficulty Distribution</p>
          <div className="flex gap-2 flex-wrap">
            {stats.easyCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400 border border-green-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Easy ({stats.easyCount})
              </span>
            )}
            {stats.mediumCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400 border border-yellow-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                Medium ({stats.mediumCount})
              </span>
            )}
            {stats.hardCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400 border border-red-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Hard ({stats.hardCount})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Topics</h2>
        {sheet.topics && sheet.topics.length > 0 ? (
          sheet.topics.map((topic: Topic) => (
            <div
              key={topic.id}
              className="rounded-lg border border-gray-800 bg-gray-900/50"
            >
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900/80 transition"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-white">{topic.name}</h3>
                  {topic.description && (
                    <p className="mt-1 text-sm text-gray-400">
                      {topic.description}
                    </p>
                  )}
                </div>
                {expandedTopics.has(topic.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {expandedTopics.has(topic.id) && (
                <div className="border-t border-gray-800 px-6 py-4 space-y-4">

                  {/* ====================================== */}
                  {/* PROBLEMS DIRECTLY INSIDE THE TOPIC */}
                  {/* ====================================== */}

                  {topic.problems && topic.problems.length > 0 && (
                    <div className="space-y-2">

                      <p className="mb-3 text-sm font-medium text-gray-400">
                        Problems
                      </p>

                      {topic.problems.map((problem: Problem) => (
                        <div
                          key={problem.id}
                          className="flex items-center justify-between rounded-lg bg-gray-950/50 px-4 py-3 hover:bg-gray-900/80 transition"
                        >
                          <div className="flex items-center gap-3 flex-1">

                            {/* SOLVED BUTTON */}

                            <button
                              onClick={() => {
                                const newStatus =
                                  problem.progress?.status === "SOLVED"
                                    ? "NOT_STARTED"
                                    : "SOLVED";

                                handleUpdateProgress(
                                  problem.id,
                                  newStatus
                                );
                              }}
                              disabled={solving.has(problem.id)}
                              className={`flex-shrink-0 h-6 w-6 rounded border-2 flex items-center justify-center transition ${problem.progress?.status === "SOLVED"
                                  ? "border-green-500 bg-green-500/20"
                                  : "border-gray-600 hover:border-gray-400"
                                } disabled:opacity-50`}
                            >
                              {problem.progress?.status === "SOLVED" && (
                                <Check className="h-4 w-4 text-green-400" />
                              )}
                            </button>

                            {/* PROBLEM TITLE */}

                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-white truncate">
                                {problem.title}
                              </p>
                            </div>

                            {/* DIFFICULTY */}

                            <span
                              className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${problem.difficulty === "EASY"
                                  ? "bg-green-500/20 text-green-400"
                                  : problem.difficulty === "MEDIUM"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>

                          {/* ACTIONS */}

                          <div className="flex items-center gap-2 ml-4">

                            {problem.externalUrl && (
                              <a
                                href={problem.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded text-gray-400 hover:text-blue-400 transition"
                                title="Practice on external platform"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}

                            <button
                              onClick={() =>
                                handleBookmark(
                                  problem.id,
                                  bookmarks.has(problem.id)
                                )
                              }
                              className="p-1 rounded text-gray-400 hover:text-yellow-400 transition"
                              title="Bookmark for later"
                            >
                              {bookmarks.has(problem.id) ? (
                                <Bookmark className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </button>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ====================================== */}
                  {/* EXISTING MODULE SYSTEM - NOT DELETED */}
                  {/* ====================================== */}

                  {topic.modules && topic.modules.length > 0 && (
                    <div className="space-y-3">

                      {topic.problems &&
                        topic.problems.length > 0 && (
                          <div className="border-t border-gray-800 pt-4" />
                        )}

                      {topic.modules.map((mod: DsaModule) => (
                        <div
                          key={mod.id}
                          className="rounded-lg bg-gray-950/50"
                        >
                          <button
                            onClick={() => toggleModule(mod.id)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-900/50 transition"
                          >
                            <h4 className="font-medium text-gray-300">
                              {mod.title}
                            </h4>

                            {expandedModules.has(mod.id) ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </button>

                          {expandedModules.has(mod.id) && (
                            <div className="border-t border-gray-800 px-4 py-3">
                              <div className="space-y-2">

                                {mod.problems &&
                                  mod.problems.length > 0 ? (
                                  mod.problems.map(
                                    (problem: Problem) => (
                                      <div
                                        key={problem.id}
                                        className="flex items-center justify-between rounded-lg bg-gray-900/50 px-4 py-3"
                                      >
                                        <p className="font-medium text-white">
                                          {problem.title}
                                        </p>

                                        <span
                                          className={`rounded px-2 py-1 text-xs font-medium ${problem.difficulty === "EASY"
                                              ? "bg-green-500/20 text-green-400"
                                              : problem.difficulty === "MEDIUM"
                                                ? "bg-yellow-500/20 text-yellow-400"
                                                : "bg-red-500/20 text-red-400"
                                            }`}
                                        >
                                          {problem.difficulty}
                                        </span>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    No problems in this module yet
                                  </p>
                                )}

                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* EMPTY STATE */}

                  {(!topic.problems ||
                    topic.problems.length === 0) &&
                    (!topic.modules ||
                      topic.modules.length === 0) && (
                      <p className="text-sm text-gray-500">
                        No problems in this topic yet.
                      </p>
                    )}

                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No topics found</div>
        )}
      </div>
    </div>
  );
};

export default SheetDetailsPage;
