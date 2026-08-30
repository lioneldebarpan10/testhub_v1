import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  Target,
  Flame,
  Bookmark,
  Loader,
  TrendingUp,
  Code2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getMyProgress, type UserProgress } from "../../api/user.api";
import { formatDate } from "../../utils/formatDate";

// ── Difficulty Progress Bar ──────────────────────────────────────────────────

type DifficultyBarProps = {
  label: string;
  solved: number;
  total: number;
  colorClass: string;
  bgClass: string;
  textClass: string;
};

const DifficultyBar = ({
  label,
  solved,
  total,
  colorClass,
  bgClass,
  textClass,
}: DifficultyBarProps) => {
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className={`font-medium ${textClass}`}>{label}</span>
        <span className="text-gray-400">
          {solved} / {total}
        </span>
      </div>
      <div className={`h-2 w-full overflow-hidden rounded-full ${bgClass}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ── Stat Card ────────────────────────────────────────────────────────────────

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
};

const StatCard = ({ icon, label, value, sub, accent = "text-blue-400" }: StatCardProps) => (
  <div className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-5">
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-0.5 text-2xl font-bold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-500">{sub}</p>}
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────

const ProfilePage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await getMyProgress();
        setProgress(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load progress"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (!user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">

      {/* ── Profile Header ── */}
      <div className="flex flex-col gap-6 rounded-2xl border border-gray-800 bg-gray-900/50 p-8 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                <span
                  className={`capitalize ${
                    user.role === "ADMIN"
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {user.role.toLowerCase()}
                </span>
              </span>
              {user.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDate(user.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Link
            to="/bookmarks"
            className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            <Bookmark className="h-4 w-4" />
            Bookmarks
          </Link>
          <Link
            to="/sheets"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            <Code2 className="h-4 w-4" />
            Practice
          </Link>
        </div>
      </div>

      {/* ── Progress Section ── */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="text-center">
            <Loader className="mx-auto mb-3 h-7 w-7 animate-spin text-blue-500" />
            <p className="text-sm text-gray-400">Loading progress...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : progress ? (
        <>
          {/* ── Overall Stats Grid ── */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              DSA Progress
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<CheckCircle className="h-5 w-5" />}
                label="Total Solved"
                value={`${progress.totalSolved} / ${progress.totalProblems}`}
                sub={`${progress.progressPercentage}% complete`}
                accent="text-green-400"
              />
              <StatCard
                icon={<Target className="h-5 w-5" />}
                label="Attempted"
                value={progress.totalAttempted}
                sub="Problems in progress"
                accent="text-yellow-400"
              />
              <StatCard
                icon={<Flame className="h-5 w-5" />}
                label="Not Started"
                value={progress.notStarted}
                sub="Problems remaining"
                accent="text-orange-400"
              />
              <StatCard
                icon={<Code2 className="h-5 w-5" />}
                label="Total Problems"
                value={progress.totalProblems}
                sub="On the platform"
                accent="text-purple-400"
              />
            </div>
          </div>

          {/* ── Overall Progress Ring ── */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              {/* Circular Progress */}
              <div className="relative flex flex-shrink-0 items-center justify-center">
                <svg
                  className="h-36 w-36 -rotate-90 drop-shadow-lg"
                  viewBox="0 0 120 120"
                >
                  {/* Background ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#1f2937"
                    strokeWidth="10"
                    fill="none"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#progressGradient)"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 50 * (1 - progress.progressPercentage / 100)
                    }`}
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">
                    {progress.progressPercentage}%
                  </span>
                  <span className="text-xs text-gray-400">solved</span>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="flex-1 space-y-4">
                <h3 className="text-base font-semibold text-white">
                  Difficulty Breakdown
                </h3>
                <DifficultyBar
                  label="Easy"
                  solved={progress.easySolved}
                  total={progress.easyTotal}
                  colorClass="bg-green-500"
                  bgClass="bg-green-500/20"
                  textClass="text-green-400"
                />
                <DifficultyBar
                  label="Medium"
                  solved={progress.mediumSolved}
                  total={progress.mediumTotal}
                  colorClass="bg-yellow-500"
                  bgClass="bg-yellow-500/20"
                  textClass="text-yellow-400"
                />
                <DifficultyBar
                  label="Hard"
                  solved={progress.hardSolved}
                  total={progress.hardTotal}
                  colorClass="bg-red-500"
                  bgClass="bg-red-500/20"
                  textClass="text-red-400"
                />
              </div>
            </div>
          </div>

          {/* ── Solve Summary Table ── */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="mb-4 text-base font-semibold text-white">
              Solve Summary
            </h3>
            <div className="overflow-hidden rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900 text-left text-gray-400">
                    <th className="px-5 py-3">Difficulty</th>
                    <th className="px-5 py-3">Solved</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">%</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Easy",
                      solved: progress.easySolved,
                      total: progress.easyTotal,
                      cls: "text-green-400",
                    },
                    {
                      label: "Medium",
                      solved: progress.mediumSolved,
                      total: progress.mediumTotal,
                      cls: "text-yellow-400",
                    },
                    {
                      label: "Hard",
                      solved: progress.hardSolved,
                      total: progress.hardTotal,
                      cls: "text-red-400",
                    },
                  ].map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-gray-800 last:border-0 hover:bg-gray-900/60 transition"
                    >
                      <td className={`px-5 py-3 font-medium ${row.cls}`}>
                        {row.label}
                      </td>
                      <td className="px-5 py-3 text-white">{row.solved}</td>
                      <td className="px-5 py-3 text-gray-400">{row.total}</td>
                      <td className="px-5 py-3 text-gray-400">
                        {row.total === 0
                          ? "0%"
                          : `${Math.round((row.solved / row.total) * 100)}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}

      {/* ── Quick Links ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            to: "/sheets",
            icon: <Code2 className="h-5 w-5" />,
            title: "DSA Sheets",
            desc: "Practice structured problems",
            accent: "from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40",
            iconColor: "text-blue-400",
          },
          {
            to: "/courses",
            icon: <User className="h-5 w-5" />,
            title: "Courses",
            desc: "Follow structured learning paths",
            accent: "from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40",
            iconColor: "text-purple-400",
          },
          {
            to: "/bookmarks",
            icon: <Bookmark className="h-5 w-5" />,
            title: "Bookmarks",
            desc: "Review saved problems",
            accent: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40",
            iconColor: "text-yellow-400",
          },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-start gap-4 rounded-xl border bg-gradient-to-br p-5 transition ${item.accent}`}
          >
            <div
              className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-800 ${item.iconColor}`}
            >
              {item.icon}
            </div>
            <div>
              <p className="font-semibold text-white">{item.title}</p>
              <p className="mt-0.5 text-sm text-gray-400">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
