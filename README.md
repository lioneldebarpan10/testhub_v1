# TestHub 🚀

> A full-stack DSA learning and problem-tracking platform inspired by structured learning sheets and platforms such as Take U Forward.

TestHub is designed to provide a structured way to learn **Data Structures and Algorithms**, practice curated problems, read detailed articles, follow courses, and track personal progress.

The platform is built around the idea that DSA preparation should not be just a random list of questions. Problems are organized into **Sheets → Topics/Data Structures → Modules → Problems**, while courses follow a similar **Course → Modules → Lessons/Problems** structure.

---

## ✨ Core Vision

TestHub aims to provide:

- 📚 Structured DSA sheets
- 🧩 Problems organized by topic and module
- 📝 Detailed articles and explanations for problems
- 🔗 External problem links such as LeetCode
- 🎯 Difficulty-based problem classification
- 🏢 Company tags
- ✅ Personal problem completion tracking
- 🔖 Bookmarking
- 📊 User progress and profile statistics
- 🎓 Structured courses with modules
- 👨‍💼 Complete admin control over platform content

---

# 🏗️ Platform Architecture

The main content architecture of TestHub is:

```text
Sheets
  │
  ├── Data Structure / Topic
  │       │
  │       ├── Module
  │       │      │
  │       │      ├── Problem
  │       │      ├── Problem
  │       │      └── Problem
  │       │
  │       └── Module
  │
  └── More Topics


Courses
  │
  ├── Module
  │      │
  │      ├── Lesson
  │      ├── Lesson
  │      └── Problems / Resources
  │
  └── More Modules
```

---

# 📚 DSA Sheets

A **Sheet** is a curated collection of DSA problems.

Examples of sheets that can exist on the platform:

- Blind 75
- NeetCode-style Sheets
- SDE Preparation Sheets
- Interview Preparation Sheets
- Striver-style Preparation Sheets
- Custom Admin-created Sheets

Each sheet is divided into different:

- Data Structures
- Algorithms
- Topics
- Modules

### Example

```text
Blind 75
│
├── Array
│   ├── Two Sum
│   ├── Best Time to Buy and Sell Stock
│   ├── Contains Duplicate
│   └── Product of Array Except Self
│
├── Binary
│
├── Dynamic Programming
│
├── Graph
│
└── Interval
```

The frontend can display these sections using expandable/collapsible dropdowns.

When a user opens a section such as **Array**, a table of problems is displayed.

---

# 🧩 Problem Table

Each problem row can contain information such as:

| Field | Description |
|---|---|
| Completion Status | Whether the user has completed the problem |
| Problem Title | Name of the problem |
| Article | Link to the detailed platform article |
| Practice Link | External practice link such as LeetCode |
| Difficulty | Easy, Medium, or Hard |
| Company | Associated companies |
| Bookmark | Save the problem for later |
| Revision | Mark the problem for revision |

Example:

```text
☐  Two Sum                    Article   LeetCode   Easy
☐  Contains Duplicate         Article   LeetCode   Easy
☐  Best Time to Buy and Sell  Article   LeetCode   Medium
```

The completion control can change its appearance on hover and visually indicate whether a problem has been completed.

---

# 📝 Problem Articles

Every problem can have a dedicated article written and managed from the admin panel.

A problem article can contain:

```text
Problem Title
│
├── Problem Statement
│
├── Examples
│
├── Brute Force Approach
│
├── Better Approach
│
├── Optimal Approach
│
├── Algorithm Explanation
│
├── Code
│
├── Complexity Analysis
│
└── Video Solution
```

The frontend can present these sections in an accordion/dropdown format.

This allows users to open only the section they want to study.

---

# 🎓 Courses

Courses follow a structured architecture similar to sheets.

```text
Course
│
├── Module 1
│   ├── Lesson 1
│   ├── Lesson 2
│   └── Related Problems
│
├── Module 2
│   ├── Lesson 1
│   ├── Lesson 2
│   └── Related Problems
│
└── Module 3
```

Each course can contain multiple modules, and every module can contain learning content, lessons, resources, and problems.

The same structured learning philosophy used for sheets is applied to courses.

---

# 👤 User Progress Tracking

TestHub tracks a user's learning journey.

A user's profile can display information such as:

## DSA Progress

- Total solved problems
- Easy problems solved
- Medium problems solved
- Hard problems solved
- Overall completion percentage
- Sheet-wise progress
- Topic-wise progress

Example:

```text
Total Solved: 250 / 1121

Easy:   101 / 374
Medium: 96 / 477
Hard:   53 / 253
```

---

## 📈 Progress Visualization

The profile/dashboard can include:

- Overall DSA progress
- Difficulty-wise statistics
- Subject or topic progress
- Sheet progress
- Course progress
- Problem completion history
- Activity heatmap
- Active days
- Maximum streak
- Bookmarked problems

The goal is to give every user a clear view of their DSA preparation journey.

---

# 🔖 Bookmarks

Users can bookmark problems they want to revisit later.

Example flow:

```text
Problem Page
     │
     ▼
Click Bookmark
     │
     ▼
Problem Saved
     │
     ▼
Visible in Bookmarks Page
```

Users can also remove bookmarked problems.

---

# 🔐 Authentication and User Roles

The platform supports authentication and role-based access.

Possible roles include:

```text
USER
ADMIN
```

### USER

A normal user can:

- Browse sheets
- Open topics and modules
- View problems
- Read articles
- Mark problems as completed
- Bookmark problems
- Track personal progress
- Access courses

### ADMIN

An administrator has complete control over content management.

---

# 👨‍💼 Admin Panel

The admin panel is one of the core parts of TestHub.

An authorized administrator can manage the complete learning platform.

## Admin Capabilities

### Sheets

Admin can:

- Create sheets
- Update sheets
- Delete sheets
- Control sheet ordering
- Add topics or categories to sheets
- Add modules
- Add or remove problems from a sheet

### Problems

Admin can manually control:

- Problem title
- Problem slug
- Problem statement
- Difficulty
- Company information
- External problem links
- Article availability
- Related topics
- Sheet placement

### Articles

An authorized admin can write and manage detailed articles for any problem.

Article sections can include:

- Problem Statement
- Examples
- Brute Force Approach
- Better Approach
- Optimal Approach
- Algorithm
- Code
- Complexity Analysis
- Video Solution

### Courses

Admin can:

- Create courses
- Create modules
- Add lessons
- Add resources
- Add problems
- Update content
- Control module ordering

In short, **all sheets, courses, modules, problems, and learning content are manually controlled from the admin side**.

---

# 🖥️ Frontend Architecture

The current frontend is organized approximately as follows:

```text
src/
│
├── api/
│   ├── auth.api.ts
│   ├── axios.ts
│   ├── bookmark.api.ts
│   └── problem.api.ts
│
├── assets/
│
├── components/
│   └── layout/
│       ├── Footer.tsx
│       ├── MainLayout.tsx
│       └── Navbar.tsx
│
├── context/
│
├── hooks/
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── bookmarks/
│   │   └── BookmarksPage.tsx
│   │
│   ├── courses/
│   │   └── CoursesPage.tsx
│   │
│   ├── problems/
│   │   ├── ProblemDetailsPage.tsx
│   │   └── ProblemsPage.tsx
│   │
│   ├── HomePage.tsx
│   └── NotFoundPage.tsx
│
├── routes/
│   └── AppRoutes.tsx
│
├── types/
│   └── problem.ts
│
├── utils/
│
├── App.tsx
├── index.css
└── main.tsx
```

---

# 🔌 Frontend API Layer

The frontend communicates with the backend through Axios.

Example API configuration:

```ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

The API layer can be separated by feature:

```text
auth.api.ts
problem.api.ts
bookmark.api.ts
sheet.api.ts
course.api.ts
user.api.ts
```

---

# ⚙️ Backend Architecture

The backend is based on Express and exposes APIs for major platform resources.

Current API areas include:

```text
/api/auth
/api/admin
/api/topics
/api/companies
/api/problems
/api/users
/api/courses
/api/modules
/api/lessons
```

A health endpoint is also available:

```text
/api/health
```

The backend is responsible for:

- Authentication
- Authorization
- Problem management
- Topic management
- Company management
- Course management
- Module management
- Lesson management
- User data
- Admin operations
- Progress tracking
- Bookmark management

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React

## Backend

- Node.js
- Express
- TypeScript/JavaScript backend setup
- Prisma ORM
- Database integration

---

# 🚀 Getting Started

## Frontend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs locally through Vite.

---

## Backend

Install dependencies:

```bash
npm install
```

Configure environment variables and the database connection.

Start the backend using the project's configured development command.

---

# 🎯 Main Product Goals

TestHub is being built to solve several problems faced by DSA learners:

- Random problem solving without a structured roadmap
- Difficulty tracking progress
- Lack of centralized learning sheets
- Scattered articles and resources
- No unified profile progress system
- Difficulty managing revision
- Lack of customizable learning content

The platform brings these features into one structured ecosystem.

---

# 🗺️ Planned User Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Explore Sheets
 │
 ▼
Select a Sheet
 │
 ▼
Open Topic / Data Structure
 │
 ▼
View Problems
 │
 ├── Read Article
 ├── Open Practice Link
 ├── Mark Completed
 └── Bookmark
 │
 ▼
Progress Updates
 │
 ▼
Profile Dashboard
```

---

# 🗺️ Planned Admin Flow

```text
Admin Login
 │
 ▼
Admin Dashboard
 │
 ├── Manage Sheets
 │
 ├── Manage Topics
 │
 ├── Manage Modules
 │
 ├── Create Problems
 │
 ├── Write Problem Articles
 │
 ├── Add Practice Links
 │
 ├── Manage Companies
 │
 ├── Create Courses
 │
 └── Manage Lessons
```

---

# 🔮 Future Improvements

Potential future features include:

- Advanced search and filtering
- Company-wise problem filtering
- Revision schedules
- Personalized DSA roadmap
- Notes for individual problems
- Code editor integration
- Submission tracking
- Streak tracking
- Leaderboards
- Recommended problems
- Course completion certificates
- Rich text/Markdown article editor for admins
- Image and video embedding in articles
- Notifications and reminders
- Improved analytics dashboard

---

# 📌 Project Philosophy

> **Learn in a structured way. Practice consistently. Track your progress. Improve every day.**

TestHub is intended to become a complete DSA learning ecosystem where users can follow curated sheets, study detailed articles, solve problems, follow courses, and clearly track their preparation journey.

---

## 📄 License

This project is currently under development.
