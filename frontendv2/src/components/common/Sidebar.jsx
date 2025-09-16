import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  MapPin, 
  TrendingUp, 
  FileText, 
  Cloud, 
  User, 
  History, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const Sidebar = ({ isOpen, onToggle, activeTab, onTabChange, user, onLogout, menuItems }) => {
  // Default menu items for farmers (fallback)
  const defaultMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'lands', label: 'My Lands', icon: MapPin },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'schemes', label: 'Govt Schemes', icon: FileText },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'history', label: 'History', icon: History },
  ]

  const items = menuItems || defaultMenuItems

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-green-600">Agrovardhan</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b bg-green-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600 capitalize">{user?.type}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <Button
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      activeTab === item.id && "bg-green-600 text-white"
                    )}
                    onClick={() => {
                      onTabChange(item.id)
                      if (window.innerWidth < 1024) onToggle()
                    }}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
