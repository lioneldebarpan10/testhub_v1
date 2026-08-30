import { Link } from "react-router-dom";
import {
  Code2,
  GraduationCap,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Master DSA",
    description:
      "Practice structured coding problems across different topics and difficulty levels.",
  },
  {
    icon: GraduationCap,
    title: "Learn Systematically",
    description:
      "Follow structured courses, modules, and lessons designed to strengthen your fundamentals.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description:
      "Monitor your problem-solving journey and learning progress in one place.",
  },
];

const HomePage = () => {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-gray-400">
              Your Complete Learning Platform
            </p>

            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
              Practice.
              <span className="block text-gray-400">
                Learn. Grow.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-400 sm:text-xl">
              Master Data Structures and Algorithms, follow structured
              courses, track your progress, and prepare yourself for
              your next big opportunity.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
              >
                Start Learning
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/problems"
                className="rounded-xl border border-gray-700 px-6 py-3 font-semibold text-white transition hover:border-gray-500 hover:bg-gray-900"
              >
                Explore Problems
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="border-t border-gray-800 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Everything you need to improve
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              One platform for practicing, learning, and tracking your
              journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-gray-800 bg-gray-900/40 p-8 transition hover:border-gray-700 hover:bg-gray-900"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-3xl border border-gray-800 bg-gray-900/50 px-8 py-16 text-center sm:px-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to start your journey?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-gray-400">
            Build consistency, strengthen your problem-solving skills,
            and track your growth with TestHub.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Create Your Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;