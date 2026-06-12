# Smart Expense Tracker — Frontend

React + Vite frontend for the Smart Expense Tracker application. Provides a modern UI for managing personal expenses with AI-powered spending insights.

## Live Links

| Service | URL |
|---|---|
| **Frontend** | [https://expense-tracker-frontend.vercel.app](https://expense-tracker-frontend.vercel.app) |
| **Backend** | [https://expensemanager-backend-i4kn.onrender.com](https://expensemanager-backend-i4kn.onrender.com) |

## Dummy Credentials

| Field | Value |
|---|---|
| **Email** | testuser@gmail.com |
| **Password** | Test@1234 |

## Tech Stack

- **React 19** — UI library
- **Vite** — Build tool
- **Redux Toolkit** — State management
- **React Router v7** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **Recharts** — Charting library
- **Framer Motion** — Animations
- **Axios** — HTTP client with auto token refresh interceptor
- **Lucide React** — Icon library

## Project Structure

```
client/
├── public/
├── src/
│   ├── api/
│   │   └── config.js            # Axios instance + interceptor
│   ├── components/
│   │   ├── Categories/
│   │   │   └── CategoryModal.jsx
│   │   ├── Expenses/
│   │   │   └── ExpenseModal.jsx
│   │   └── ui/
│   │       ├── index.jsx         # Card, Button, Input, Badge, Modal
│   │       └── GlobalNotification.jsx
│   ├── layouts/
│   │   └── MainLayout.jsx        # Sidebar + Topbar shell
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Expenses.jsx
│   │   ├── Categories.jsx
│   │   ├── AIInsights.jsx
│   │   └── Profile.jsx
│   ├── store/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── expenseSlice.js
│   │       ├── categorySlice.js
│   │       ├── dashboardSlice.js
│   │       ├── aiSlice.js
│   │       ├── uiSlice.js
│   │       └── userSlice.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── README.md
```

## Local Setup

### Prerequisites

- Node.js >= 18
- npm >= 9

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd client

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend API base URL (e.g. `https://expensemanager-backend-i4kn.onrender.com/api`) |

## Features

- **Authentication**: Register, login, JWT access/refresh token with auto-refresh
- **Expense Management**: Full CRUD with filtering, sorting, pagination
- **Categories**: Custom categories with icons and colors, monthly budget tracking
- **Dashboard**: Monthly summary, category breakdown, 7-day spending trend charts
- **AI Insights**: One-click financial analysis using Gemini AI (predicted spending, risk category, savings recommendation)
- **Profile**: Update name and password
- **Dark Mode**: Toggleable dark/light theme

## AI Usage Disclosure

AI assistance (Claude) was used for:
- Implementing the AI-powered prediction and insight feature on the frontend (AIInsights page UI)
- Styling and UI component patterns

AI was NOT used for:
- State management logic (Redux slices)
- Page component logic (auth, CRUD, routing)
- API service configuration

## Known Limitations

- Backend currently uses **MongoDB** instead of **PostgreSQL + Prisma** (pending migration)
- No CI/CD pipeline configured yet
- No automated tests
- Search functionality in the topbar is UI-only (not wired to backend)
- Notification bell is decorative
- Form validation could be more comprehensive
- No real-time updates — page refresh required to see new data
