import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import FarmerDashboard from './pages/FarmerDashboard'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ErrorBoundary from './components/common/ErrorBoundary'
import { Toaster } from './components/ui/toaster'
import { useLocalStorage } from './hooks/useLocalStorage'
import './App.css'

// Protected route component
const ProtectedRoute = ({ children, user, userType }) => {
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  
  if (userType && user.type !== userType) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  const [user, setUser] = useLocalStorage('agri3-user', null)
  const navigate = useNavigate()

  // We'll keep handleLogout for the dashboard components
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('agri3-user')
    navigate('/')
  }
  
  // Load user from localStorage on app initialization
  useEffect(() => {
    const storedUser = localStorage.getItem('agri3-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('agri3-user')
      }
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/farmer-dashboard/*" 
            element={
              <ProtectedRoute user={user} userType="farmer">
                <FarmerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller-dashboard/*" 
            element={
              <ProtectedRoute user={user} userType="seller">
                <SellerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard/*" 
            element={
              <ProtectedRoute user={user} userType="admin">
                <AdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </ErrorBoundary>
  )
}

export default App
