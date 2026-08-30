import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Loader } from "lucide-react";
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
          {sheets.map((sheet) => (
            <div
              key={sheet.id}
              onClick={() => handleSelectSheet(sheet.slug)}
              className="group cursor-pointer rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition hover:border-blue-500/50 hover:bg-gray-900/80"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {sheet.name}
                  </h3>
                  {sheet.description && (
                    <p className="mt-2 text-sm text-gray-400">
                      {sheet.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-600 transition group-hover:text-blue-400" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  {sheet.topics?.length || 0} Topics
                </span>
                <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                  Get Started
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SheetsPage;
