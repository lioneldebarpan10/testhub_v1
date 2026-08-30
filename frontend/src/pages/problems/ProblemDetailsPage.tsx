import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Bookmark,
  Check,
  Loader,
  AlertCircle,
  Play,
} from "lucide-react";
import { getProblemBySlug, updateProblemProgress } from "../../api/problem.api";
import { getArticleByProblemSlug } from "../../api/article.api";
import {
  addBookmark,
  removeBookmark,
} from "../../api/bookmark.api";
import { useAuth } from "../../hooks/useAuth";
import type { Problem, ProblemArticle } from "../../types/problem";

const ProblemDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [article, setArticle] = useState<ProblemArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["statement"])
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSolving, setIsSolving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);

        const [problemRes, articleRes] = await Promise.all([
          getProblemBySlug(slug),
          getArticleByProblemSlug(slug).catch(() => ({ data: null })),
        ]);

        setProblem(problemRes.data);
        if (articleRes?.data) {
          setArticle(articleRes.data);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load problem"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleBookmark = async () => {
    if (!user || !problem) return;

    try {
      if (isBookmarked) {
        await removeBookmark(problem.id);
        setIsBookmarked(false);
      } else {
        await addBookmark(problem.id);
        setIsBookmarked(true);
      }
    } catch (err: any) {
      console.error("Bookmark error:", err);
    }
  };

  const handleSolve = async (status: "SOLVED" | "ATTEMPTED") => {
    if (!user || !problem) return;

    try {
      setIsSolving(true);
      await updateProblemProgress(problem.id, status);
      setProblem((prev) =>
        prev
          ? {
              ...prev,
              progress: {
                ...prev.progress,
                status,
              } as any,
            }
          : null
      );
    } catch (err: any) {
      console.error("Progress error:", err);
    } finally {
      setIsSolving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-red-400">{error || "Problem not found"}</p>
        </div>
      </div>
    );
  }

  const ArticleSection = ({
    id,
    title,
    content,
  }: {
    id: string;
    title: string;
    content?: string;
  }) => {
    const isExpanded = expandedSections.has(id);

    if (!content) return null;

    return (
      <div className="rounded-lg border border-gray-800">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900/50 transition"
        >
          <span className="font-semibold text-white">{title}</span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-gray-800 px-6 py-4 bg-gray-900/30">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Problem Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">{problem.title}</h1>
            <p className="mt-2 text-gray-400">{problem.description}</p>
          </div>
          <span
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-sm ${
              problem.difficulty === "EASY"
                ? "bg-green-500/20 text-green-400"
                : problem.difficulty === "MEDIUM"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleSolve("SOLVED")}
            disabled={isSolving}
            className={`flex items-center gap-2 rounded-lg px-6 py-2 font-medium transition ${
              problem.progress?.status === "SOLVED"
                ? "bg-green-500/20 text-green-400 border border-green-500"
                : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            }`}
          >
            <Check className="h-4 w-4" />
            {problem.progress?.status === "SOLVED" ? "Solved" : "Mark Solved"}
          </button>

          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 rounded-lg px-6 py-2 font-medium transition border ${
              isBookmarked
                ? "border-yellow-500 bg-yellow-500/20 text-yellow-400"
                : "border-gray-700 text-gray-300 hover:border-gray-600"
            }`}
          >
            {isBookmarked ? (
              <>
                <Bookmark className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                Bookmarked
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                Bookmark
              </>
            )}
          </button>

          {problem.externalUrl && (
            <a
              href={problem.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-6 py-2 font-medium border border-gray-700 text-gray-300 hover:border-gray-600 transition"
            >
              Practice on LeetCode
            </a>
          )}
        </div>
      </div>

      {/* Constraints */}
      {problem.constraints && (
        <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-6">
          <h3 className="font-semibold text-white mb-2">Constraints</h3>
          <p className="text-gray-300 whitespace-pre-wrap">
            {problem.constraints}
          </p>
        </div>
      )}

      {/* Articles Section */}
      {article ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Solution Approaches</h2>

          <ArticleSection
            id="statement"
            title="📝 Problem Statement"
            content={article.statement || problem.description}
          />

          <ArticleSection
            id="examples"
            title="📋 Examples"
            content={article.examples}
          />

          <ArticleSection
            id="bruteForce"
            title="🔨 Brute Force Approach"
            content={article.bruteForce}
          />

          <ArticleSection
            id="better"
            title="⚡ Better Approach"
            content={article.betterApproach}
          />

          <ArticleSection
            id="optimal"
            title="🎯 Optimal Approach"
            content={article.optimalApproach}
          />

          <ArticleSection
            id="algorithm"
            title="📚 Algorithm Explanation"
            content={article.algorithm}
          />

          <ArticleSection
            id="code"
            title="💻 Code Implementation"
            content={article.code}
          />

          <ArticleSection
            id="complexity"
            title="⏱️ Complexity Analysis"
            content={article.complexity}
          />

          {article.videoUrl && (
            <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-white">Video Solution</h3>
              </div>
              <a
                href={article.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Watch Video Solution →
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-600 mb-3" />
          <p className="text-gray-400">
            No detailed solution article available for this problem yet.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Try practicing on the external platform for more resources.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProblemDetailsPage;