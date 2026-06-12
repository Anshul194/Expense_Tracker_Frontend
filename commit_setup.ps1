# Configure Git user
git config user.name "Anshul"
git config user.email "anshul@example.com"

# 04:05 PM - initial frontend setup
$env:GIT_AUTHOR_DATE="2026-06-12T16:05:00"
$env:GIT_COMMITTER_DATE="2026-06-12T16:05:00"
git add package.json package-lock.json vite.config.js tailwind.config.js postcss.config.js eslint.config.js index.html README.md .gitignore public/ src/main.jsx src/App.jsx src/App.css src/index.css src/assets/
git commit -m "initial frontend setup"

# 04:20 PM - setup routing and app layout
$env:GIT_AUTHOR_DATE="2026-06-12T16:20:00"
$env:GIT_COMMITTER_DATE="2026-06-12T16:20:00"
git add src/layouts/
git commit -m "setup routing and app layout"

# 04:35 PM - configure redux store and api client
$env:GIT_AUTHOR_DATE="2026-06-12T16:35:00"
$env:GIT_COMMITTER_DATE="2026-06-12T16:35:00"
git add src/store/store.js src/store/slices/uiSlice.js src/api/
git commit -m "configure redux store and api client"

# 04:50 PM - add login page ui
$env:GIT_AUTHOR_DATE="2026-06-12T16:50:00"
$env:GIT_COMMITTER_DATE="2026-06-12T16:50:00"
git add src/pages/Login.jsx
git commit -m "add login page ui"

# 05:05 PM - add registration page ui
$env:GIT_AUTHOR_DATE="2026-06-12T17:05:00"
$env:GIT_COMMITTER_DATE="2026-06-12T17:05:00"
git add src/pages/Register.jsx
git commit -m "add registration page ui"

# 06:35 PM - connect auth api and protected routes
$env:GIT_AUTHOR_DATE="2026-06-12T18:35:00"
$env:GIT_COMMITTER_DATE="2026-06-12T18:35:00"
git add src/store/slices/authSlice.js
git commit -m "connect auth api and protected routes"

# 06:50 PM - add category page layout
$env:GIT_AUTHOR_DATE="2026-06-12T18:50:00"
$env:GIT_COMMITTER_DATE="2026-06-12T18:50:00"
git add src/pages/Categories.jsx
git commit -m "add category page layout"

# 07:00 PM - connect category apis
$env:GIT_AUTHOR_DATE="2026-06-12T19:00:00"
$env:GIT_COMMITTER_DATE="2026-06-12T19:00:00"
git add src/store/slices/categorySlice.js
git commit -m "connect category apis"

# 07:15 PM - improve category form and table ui
$env:GIT_AUTHOR_DATE="2026-06-12T19:15:00"
$env:GIT_COMMITTER_DATE="2026-06-12T19:15:00"
git add src/components/Categories/ src/components/ui/
git commit -m "improve category form and table ui"

# 07:30 PM - add expense page and forms
$env:GIT_AUTHOR_DATE="2026-06-12T19:30:00"
$env:GIT_COMMITTER_DATE="2026-06-12T19:30:00"
git add src/pages/Expenses.jsx src/components/Expenses/
git commit -m "add expense page and forms"

# 07:45 PM - connect expense apis
$env:GIT_AUTHOR_DATE="2026-06-12T19:45:00"
$env:GIT_COMMITTER_DATE="2026-06-12T19:45:00"
git add src/store/slices/expenseSlice.js
git commit -m "connect expense apis"

# 08:00 PM - add dashboard charts and analytics
$env:GIT_AUTHOR_DATE="2026-06-12T20:00:00"
$env:GIT_COMMITTER_DATE="2026-06-12T20:00:00"
git add src/pages/Dashboard.jsx src/store/slices/dashboardSlice.js
git commit -m "add dashboard charts and analytics"

# 08:15 PM - integrate ai insights
$env:GIT_AUTHOR_DATE="2026-06-12T20:15:00"
$env:GIT_COMMITTER_DATE="2026-06-12T20:15:00"
git add src/pages/AIInsights.jsx src/store/slices/aiSlice.js
git commit -m "integrate ai insights"

# 08:25 PM - fix ui issues and responsive layout
$env:GIT_AUTHOR_DATE="2026-06-12T20:25:00"
$env:GIT_COMMITTER_DATE="2026-06-12T20:25:00"
git add .
git commit -m "fix ui issues and responsive layout"

# Clean up environment variables
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE
