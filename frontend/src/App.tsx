import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar, { SIDEBAR_WIDTH } from './components/Sidebar'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import JobsPage from './pages/JobsPage'
import DashboardPage from './pages/DashboardPage'

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
