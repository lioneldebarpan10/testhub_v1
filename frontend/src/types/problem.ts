export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  description: string;
  constraints?: string;
  examples?: any;
  solution?: string;
  videoUrl?: string;
  externalUrl?: string;
  revision: boolean;
  topicId: string;
  dsaModuleId?: string;
  companies?: Company[];
  progress?: UserProblemProgress;
  topic?: Topic;
  createdAt: string;
  updatedAt: string;
}

export interface ProblemArticle {
  id: string;
  problemId: string;
  statement?: string;
  examples?: string;
  bruteForce?: string;
  betterApproach?: string;
  optimalApproach?: string;
  algorithm?: string;
  code?: string;
  complexity?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  sheetId?: string;
  modules?: DsaModule[];
  problems?: Problem[];
  createdAt: string;
  updatedAt: string;
}

export interface DsaModule {
  id: string;
  title: string;
  order: number;
  description?: string;
  topicId: string;
  problems?: Problem[];
  createdAt: string;
  updatedAt: string;
}

export interface Sheet {
  id: string;
  name: string;
  slug: string;
  description?: string;
  published: boolean;
  order: number;
  topics?: Topic[];
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProblemProgress {
  id: string;
  status: "NOT_STARTED" | "ATTEMPTED" | "SOLVED";
  solvedAt?: string;
  userId: string;
  problemId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  published: boolean;
  modules?: CourseModule[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  order: number;
  courseId: string;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  content?: string;
  videoUrl?: string;
  resources?: any;
  order: number;
  moduleId: string;
  progress?: LessonProgress;
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  id: string;
  completed: boolean;
  completedAt?: string;
  userId: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  problemId: string;
  problem?: Problem;
  createdAt: string;
}