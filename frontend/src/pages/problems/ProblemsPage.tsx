import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bookmark,
  Check,
  Loader,
  ExternalLink,
  FileText,
} from "lucide-react";
import { getAllProblems } from "../../api/problem.api";
import { getAllTopics } from "../../api/topic.api";
import { getAllCompanies } from "../../api/company.api";
import {
  addBookmark,
  removeBookmark,
} from "../../api/bookmark.api";
import { useAuth } from "../../hooks/useAuth";
import type { Problem, Topic, Company } from "../../types/problem";

type DifficultyFilter = "ALL" | "EASY" | "MEDIUM" | "HARD";
type StatusFilter = "ALL" | "NOT_STARTED" | "ATTEMPTED" | "SOLVED";

const ProblemsPage = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("ALL");
  const [topicFilter, setTopicFilter] = useState("ALL");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const [problemsRes, topicsRes, companiesRes] = await Promise.all([
          getAllProblems(1, 200),
          getAllTopics(),
          getAllCompanies(),
        ]);

        setProblems(problemsRes.data || []);
        setTopics(topicsRes.data || []);
        setCompanies(companiesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleBookmark = async (
    e: React.MouseEvent,
    problemId: string,
    isBookmarked: boolean
  ) => {
    e.preventDefault();
    if (!user || bookmarkLoading.has(problemId)) return;

    try {
      setBookmarkLoading((prev) => new Set(prev).add(problemId));

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
    } catch (error) {
      console.error("Bookmark error:", error);
    } finally {
      setBookmarkLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(problemId);
        return newSet;
      });
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDifficulty =
      difficulty === "ALL" || problem.difficulty === difficulty;

    const matchesTopic =
      topicFilter === "ALL" || problem.topic?.slug === topicFilter;

    const matchesCompany =
      companyFilter === "ALL" ||
      problem.companies?.some((company) => company.slug === companyFilter);

    const matchesStatus =
      statusFilter === "ALL" || problem.progress?.status === statusFilter;

    const matchesBookmark = !showBookmarkedOnly || bookmarks.has(problem.id);

    return (
      matchesSearch &&
      matchesDifficulty &&
      matchesTopic &&
      matchesCompany &&
      matchesStatus &&
      matchesBookmark
    );
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">Practice Problems</h1>
        <p className="mt-2 text-gray-400">
          Master Data Structures and Algorithms with our curated problem set
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search problems by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-900 pl-12 pr-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DifficultyFilter)}
            className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-600"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-600"
          >
            <option value="ALL">All Topics</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.slug}>
                {topic.name}
              </option>
            ))}
          </select>

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-600"
          >
            <option value="ALL">All Companies</option>
            {companies.map((company) => (
              <option key={company.id} value={company.slug}>
                {company.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-600"
          >
            <option value="ALL">All Status</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="ATTEMPTED">Attempted</option>
            <option value="SOLVED">Solved</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3">
          {(["ALL", "EASY", "MEDIUM", "HARD"] as DifficultyFilter[]).map(
            (item) => (
              <button
                key={item}
                onClick={() => setDifficulty(item)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  difficulty === item
                    ? "bg-blue-600 text-white"
                    : "border border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-900/50"
                }`}
              >
                {item === "ALL"
                  ? "All Difficulties"
                  : item.charAt(0) + item.slice(1).toLowerCase()}
              </button>
            )
          )}
          <button
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition flex items-center gap-2 ${
              showBookmarkedOnly
                ? "bg-yellow-600 text-white"
                : "border border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-900/50"
            }`}
          >
            <Bookmark className="h-4 w-4" />
            Bookmarked
          </button>
        </div>
      </div>

      {/* Problem Count */}
      <div className="text-sm text-gray-400">
        Found <span className="font-semibold text-white">{filteredProblems.length}</span> problem
        {filteredProblems.length !== 1 ? "s" : ""}
      </div>

      {/* Problems Table */}
      <div className="overflow-hidden rounded-lg border border-gray-800">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_2fr_1fr_1fr_100px] gap-4 border-b border-gray-800 bg-gray-900/50 px-6 py-4 text-sm font-semibold text-gray-400">
          <div></div>
          <div>Problem</div>
          <div>Difficulty</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Table Body */}
        {filteredProblems.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400">No problems found matching your criteria.</p>
          </div>
        ) : (
          filteredProblems.map((problem, index) => (
            <Link
              key={problem.id}
              to={`/problems/${problem.slug}`}
              className="grid grid-cols-[40px_2fr_1fr_1fr_100px] gap-4 items-center border-b border-gray-800 px-6 py-4 transition hover:bg-gray-900/30 group"
            >
              {/* Checkbox */}
              <div className="flex items-center">
                <div
                  className={`h-5 w-5 rounded border-2 flex items-center justify-center transition ${
                    problem.progress?.status === "SOLVED"
                      ? "border-green-500 bg-green-500/20"
                      : "border-gray-600 group-hover:border-gray-400"
                  }`}
                >
                  {problem.progress?.status === "SOLVED" && (
                    <Check className="h-3 w-3 text-green-400" />
                  )}
                </div>
              </div>

              {/* Problem Title */}
              <div>
                <p className="font-medium text-white group-hover:text-blue-400 transition">
                  {index + 1}. {problem.title}
                </p>
                {problem.description && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                    {problem.description}
                  </p>
                )}
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    problem.difficulty === "EASY"
                      ? "bg-green-500/20 text-green-400"
                      : problem.difficulty === "MEDIUM"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {problem.difficulty}
                </span>
                {problem.companies && problem.companies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {problem.companies.slice(0, 2).map((company) => (
                      <span
                        key={company.id}
                        className="rounded-full border border-gray-700 bg-gray-800/80 px-2 py-0.5 text-[10px] text-gray-300"
                      >
                        {company.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                {problem.progress?.status === "SOLVED" ? (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-400">
                    <Check className="h-4 w-4" />
                    Solved
                  </span>
                ) : problem.progress?.status === "ATTEMPTED" ? (
                  <span className="text-sm font-medium text-yellow-400">
                    Attempted
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">Not Started</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2" onClick={(e) => e.preventDefault()}>
                {problem.externalUrl && (
                  <a
                    href={problem.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition"
                    title="Practice on external platform"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link
                  to={`/problems/${problem.slug}`}
                  className="p-2 rounded text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition"
                  title="Open article"
                >
                  <FileText className="h-4 w-4" />
                </Link>
                <button
                  onClick={(e) =>
                    handleBookmark(
                      e,
                      problem.id,
                      bookmarks.has(problem.id)
                    )
                  }
                  disabled={bookmarkLoading.has(problem.id)}
                  className="p-2 rounded text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition disabled:opacity-50"
                  title="Bookmark problem"
                >
                  {bookmarks.has(problem.id) ? (
                    <Bookmark className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;