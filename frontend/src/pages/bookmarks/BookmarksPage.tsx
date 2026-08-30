import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";

import { getMyBookmarks } from "../../api/bookmark.api";

type BookmarkItem = {
  id: string;
  problemId: string;
  problem: {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
  };
};

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState<
    BookmarkItem[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await getMyBookmarks();

        setBookmarks(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch bookmarks:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="px-6 py-20 text-center text-gray-400">
        Loading bookmarks...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}

      <div className="mb-10">
        <div className="flex items-center gap-3">
          <Bookmark size={28} />

          <h1 className="text-4xl font-bold text-white">
            My Bookmarks
          </h1>
        </div>

        <p className="mt-3 text-gray-400">
          Problems you saved for later.
        </p>
      </div>

      {/* Empty State */}

      {bookmarks.length === 0 ? (
        <div className="rounded-xl border border-gray-800 px-6 py-16 text-center">
          <Bookmark
            size={40}
            className="mx-auto text-gray-600"
          />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No bookmarks yet
          </h2>

          <p className="mt-2 text-gray-400">
            Bookmark problems to access them quickly later.
          </p>

          <Link
            to="/problems"
            className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-gray-200"
          >
            Explore Problems
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-800">
          {/* Table Header */}

          <div className="grid grid-cols-[1fr_150px] border-b border-gray-800 bg-gray-900 px-6 py-4 text-sm font-medium text-gray-400">
            <div>Problem</div>

            <div>Difficulty</div>
          </div>

          {/* Bookmarks */}

          {bookmarks.map((bookmark) => (
            <Link
              key={bookmark.id}
              to={`/problems/${bookmark.problem.slug}`}
              className="grid grid-cols-[1fr_150px] items-center border-b border-gray-800 px-6 py-5 transition hover:bg-gray-900/60 last:border-b-0"
            >
              <div className="font-medium text-white">
                {bookmark.problem.title}
              </div>

              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    bookmark.problem.difficulty === "EASY"
                      ? "bg-green-500/10 text-green-400"
                      : bookmark.problem.difficulty ===
                          "MEDIUM"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {bookmark.problem.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;