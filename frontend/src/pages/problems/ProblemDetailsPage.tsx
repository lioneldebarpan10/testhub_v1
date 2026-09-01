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
  Code,
  Clock,
  AlertTriangle,
  Zap,
  Lightbulb,
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

  const ApproachSection = ({
    id,
    title,
    icon: Icon,
    badgeColor,
    explanation,
    algorithm,
    code,
  }: {
    id: string;
    title: string;
    icon: any;
    badgeColor: string;
    explanation?: string;
    algorithm?: string;
    code?: string;
  }) => {
    const isExpanded = expandedSections.has(id);
    const hasContent = explanation || algorithm || code;

    if (!hasContent) return null;

    return (
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/40">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900/60 transition"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${badgeColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="font-semibold text-white text-lg">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-gray-800 px-6 py-4 space-y-4 bg-gray-950/40">
            {explanation && (
              <div>
                <h4 className="font-semibold text-white mb-2 text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                  Explanation
                </h4>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                  {explanation}
                </p>
              </div>
            )}

            {algorithm && (
              <div>
                <h4 className="font-semibold text-white mb-2 text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-400" />
                  Algorithm
                </h4>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                  {algorithm}
                </p>
              </div>
            )}

            {code && (
              <div>
                <h4 className="font-semibold text-white mb-2 text-sm flex items-center gap-2">
                  <Code className="h-4 w-4 text-green-400" />
                  Code Implementation
                </h4>
                <pre className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                  <code className="text-gray-200 text-xs leading-relaxed">
                    {code}
                  </code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const ArticleSection = ({
    id,
    title,
    icon: Icon,
    content,
  }: {
    id: string;
    title: string;
    icon: any;
    content?: string;
  }) => {
    const isExpanded = expandedSections.has(id);

    if (!content) return null;

    return (
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/40">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900/60 transition"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-blue-400" />
            <span className="font-semibold text-white">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-gray-800 px-6 py-4 bg-gray-950/40">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {content}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Problem Header */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/30 to-blue-900/10 p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-3">{problem.title}</h1>
            {problem.description && (
              <p className="text-gray-300 leading-relaxed max-w-3xl">{problem.description}</p>
            )}
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

        {/* Tags */}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          {problem.topic && (
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              {problem.topic.name}
            </span>
          )}
          {problem.companies && problem.companies.length > 0 &&
            problem.companies.map((company) => (
              <span
                key={company.id}
                className="rounded-full border border-gray-700 bg-gray-800/80 px-3 py-1 text-gray-200 text-xs"
              >
                {company.name}
              </span>
            ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleSolve("SOLVED")}
          disabled={isSolving}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium transition ${
            problem.progress?.status === "SOLVED"
              ? "bg-green-500/20 text-green-400 border border-green-500"
              : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          }`}
        >
          <Check className="h-4 w-4" />
          {problem.progress?.status === "SOLVED" ? "Solved ✓" : "Mark Solved"}
        </button>

        <button
          onClick={handleBookmark}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium transition border ${
            isBookmarked
              ? "border-yellow-500 bg-yellow-500/20 text-yellow-400"
              : "border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-900/50"
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
            className="flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium border border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-900/50 transition"
          >
            Practice on External Platform
          </a>
        )}
      </div>

      {/* Constraints */}
      {problem.constraints && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-3">Constraints</h3>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {problem.constraints}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Article Sections */}
      {article ? (
        <div className="space-y-6">
          {/* Problem Statement & Examples */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Problem Details</h2>
            
            <ArticleSection
              id="statement"
              icon={AlertCircle}
              title="Problem Statement"
              content={article.statement || problem.description}
            />

            <ArticleSection
              id="examples"
              icon={AlertCircle}
              title="Examples"
              content={article.examples}
            />
          </div>

          {/* Solution Approaches */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Solution Approaches</h2>

            <ApproachSection
              id="bruteForce"
              title="Brute Force Approach"
              icon={AlertTriangle}
              badgeColor="bg-red-500/20"
              explanation={article.bruteForce}
              algorithm={article.algorithm}
              code={article.code}
            />

            <ApproachSection
              id="better"
              title="Better Approach"
              icon={Zap}
              badgeColor="bg-yellow-500/20"
              explanation={article.betterApproach}
              algorithm={article.algorithm}
              code={article.code}
            />

            <ApproachSection
              id="optimal"
              title="Optimal Approach"
              icon={Lightbulb}
              badgeColor="bg-green-500/20"
              explanation={article.optimalApproach}
              algorithm={article.algorithm}
              code={article.code}
            />
          </div>

          {/* Complexity Analysis */}
          {article.complexity && (
            <ArticleSection
              id="complexity"
              icon={Clock}
              title="Complexity Analysis"
              content={article.complexity}
            />
          )}

          {/* Video Solution */}
          {article.videoUrl && (
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Play className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white">Video Explanation</h3>
              </div>
              <a
                href={article.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
              >
                <Play className="h-4 w-4" />
                Watch Solution Video
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-600 mb-3" />
          <p className="text-gray-400 text-lg font-medium">
            No detailed solution article available yet
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Check back soon for a comprehensive solution explanation.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProblemDetailsPage;