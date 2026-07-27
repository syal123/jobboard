/* The app's routing table - decides which page component to show for each URL (/, /register, /login, /jobs, /dashboard)
and wraps everypage in the Sidebar.*/

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar, { SIDEBAR_WIDTH } from './components/Sidebar'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import JobsPage from './pages/JobsPage'
import DashboardPage from './pages/DashboardPage'

// Decides which page to show based on the current URL (e.g. /jobs shows JobsPage, /login shows LoginPage).
// The Sidebar is placed outside the routes so it stays visible on every page, no matter which one is active.
function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div style={{ marginLeft: SIDEBAR_WIDTH, padding: 16 }}>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
