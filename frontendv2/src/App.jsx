import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import FarmerDashboard from './pages/FarmerDashboard'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ErrorBoundary from './components/common/ErrorBoundary'
import { Toaster } from './components/ui/toaster'
import { useLocalStorage } from './hooks/useLocalStorage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [user, setUser] = useLocalStorage('agri3-user', null)

  const handleLogin = (userData) => {
    setUser(userData)
    const roleOrType = userData.type || userData.role
    if (roleOrType === 'farmer') {
      setCurrentPage('farmer-dashboard')
    } else if (roleOrType === 'seller' || roleOrType === 'supplier') {
      setCurrentPage('seller-dashboard')
    } else if (roleOrType === 'admin') {
      setCurrentPage('admin-dashboard')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('landing')
  }

  const navigateToAuth = () => {
    setCurrentPage('auth')
  }

  const navigateToLanding = () => {
    setCurrentPage('landing')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigateToAuth={navigateToAuth} />
      case 'auth':
        return <AuthPage onLogin={handleLogin} onBack={navigateToLanding} />
      case 'farmer-dashboard':
        return <FarmerDashboard user={user} onLogout={handleLogout} />
      case 'seller-dashboard':
        return <SellerDashboard user={user} onLogout={handleLogout} />
      case 'admin-dashboard':
        return <AdminDashboard user={user} onLogout={handleLogout} />
      default:
        return <LandingPage onNavigateToAuth={navigateToAuth} />
    }
  }

  return (
    <ErrorBoundary>
      <div className="App">
        {renderCurrentPage()}
        <Toaster />
      </div>
    </ErrorBoundary>
  )
}

export default App
