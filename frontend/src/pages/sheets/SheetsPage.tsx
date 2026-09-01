import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  ChevronRight, 
  Loader,
  Zap,
} from "lucide-react";
import { getAllSheets } from "../../api/sheet.api";
import type { Sheet } from "../../types/problem";

const SheetsPage = () => {
  const navigate = useNavigate();
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setLoading(true);
        const response = await getAllSheets(true, 1, 100);
        setSheets(response.data || []);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load sheets"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  const handleSelectSheet = (slug: string) => {
    navigate(`/sheets/${slug}`);
  };

  const calculateSheetStats = (sheet: Sheet) => {
    const topics = sheet.topics || [];
    let totalProblems = 0;
    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;
    let solvedCount = 0;

    topics.forEach((topic: any) => {
      const problems = topic.problems || [];
      totalProblems += problems.length;
      
      problems.forEach((problem: any) => {
        if (problem.difficulty === "EASY") easyCount++;
        else if (problem.difficulty === "MEDIUM") mediumCount++;
        else if (problem.difficulty === "HARD") hardCount++;
        
        if (problem.progress?.status === "SOLVED") solvedCount++;
      });
    });

    const progressPercentage = totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0;

    return {
      topicCount: topics.length,
      totalProblems,
      easyCount,
      mediumCount,
      hardCount,
      solvedCount,
      progressPercentage,
    };
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Loading sheets...</p>
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
      <div>
        <h1 className="text-4xl font-bold text-white">DSA Sheets</h1>
        <p className="mt-2 text-gray-400">
          Choose a structured sheet and practice problems organized by topic
        </p>
      </div>

      {sheets.length === 0 ? (
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-400">No sheets available yet</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sheets.map((sheet) => {
            const stats = calculateSheetStats(sheet);

            return (
              <div
                key={sheet.id}
                className="group cursor-pointer overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition hover:border-blue-500/50 hover:bg-gray-900/80"
              >
                {/* Card Header */}
                <div className="border-b border-gray-800 bg-gradient-to-r from-blue-950/20 to-blue-900/10 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">
                        {sheet.name}
                      </h3>
                      {sheet.description && (
                        <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                          {sheet.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-600 transition group-hover:text-blue-400 flex-shrink-0" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-5">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-700 bg-gray-900/30 p-3">
                      <p className="text-xs text-gray-500 mb-1">Topics</p>
                      <p className="text-2xl font-bold text-blue-400">{stats.topicCount}</p>
                    </div>
                    <div className="rounded-lg border border-gray-700 bg-gray-900/30 p-3">
                      <p className="text-xs text-gray-500 mb-1">Problems</p>
                      <p className="text-2xl font-bold text-purple-400">{stats.totalProblems}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-gray-400">Progress</p>
                      <p className="text-xs text-gray-500">
                        {stats.solvedCount} / {stats.totalProblems}
                      </p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${stats.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Difficulty Distribution */}
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-2">Difficulty</p>
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

                  {/* Start Learning Button */}
                  <button
                    onClick={() => handleSelectSheet(sheet.slug)}
                    className="w-full mt-4 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium text-sm transition hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center gap-2 group/btn"
                  >
                    <Zap className="h-4 w-4 group-hover/btn:scale-110 transition" />
                    Start Learning
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SheetsPage;
