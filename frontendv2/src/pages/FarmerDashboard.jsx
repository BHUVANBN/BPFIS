import React, { useState } from 'react'
import Sidebar from '@/components/common/Sidebar'
import FeatureCard from '@/components/common/FeatureCard'
import StatisticCard from '@/components/common/StatisticCard'
import { FloatingActionButtons } from '@/components/common/FloatingActionButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  MapPin, 
  TrendingUp, 
  FileText, 
  Cloud, 
  Users, 
  Wheat,
  IndianRupee,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { features, farmerProfile, cropPredictions, weatherData } from '@/data/mockData'

const FarmerDashboard = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const iconMap = {
    MapPin,
    TrendingUp,
    FileText,
    Cloud,
    Users,
    Wheat,
    IndianRupee
  }

  const handleFeatureClick = (featureTitle) => {
    switch (featureTitle) {
      case 'Integrate Land':
        setActiveTab('lands')
        break
      case 'Crop & Price Prediction':
        setActiveTab('predictions')
        break
      case 'Government Schemes':
        setActiveTab('schemes')
        break
      case 'Weather Forecasting':
        setActiveTab('weather')
        break
      default:
        console.log(`${featureTitle} clicked`)
    }
  }

  const handleChatClick = () => {
    console.log('AI Assistant clicked')
    // In real app, this would open a chat modal or navigate to chat page
  }

  const handleCallClick = () => {
    console.log('Call support clicked')
    // In real app, this would initiate a call or show contact options
  }

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-green-100">Ready to optimize your farming operations today?</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatisticCard
                title="Total Land"
                value="5.2"
                subtitle="Acres registered"
                icon={MapPin}
              />
              <StatisticCard
                title="Active Crops"
                value="3"
                subtitle="Currently growing"
                icon={Wheat}
              />
              <StatisticCard
                title="This Month"
                value="₹45,000"
                subtitle="Expected income"
                trend="up"
                trendValue="+12%"
                icon={IndianRupee}
              />
              <StatisticCard
                title="Weather Alert"
                value="Sunny"
                subtitle="Next 3 days"
                icon={Cloud}
              />
            </div>

            {/* Main Features */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Farm Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature) => {
                  const IconComponent = iconMap[feature.icon]
                  return (
                    <FeatureCard
                      key={feature.id}
                      icon={IconComponent}
                      title={feature.title}
                      description={feature.description}
                      onClick={() => handleFeatureClick(feature.title)}
                    />
                  )
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Land Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Your land documents have been verified successfully.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      2 hours ago
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      Weather Alert
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Light rain expected tomorrow. Consider covering sensitive crops.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      1 day ago
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case 'lands':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">My Lands</h1>
              <Button>
                <MapPin className="mr-2 h-4 w-4" />
                Add New Land
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plot #1 - Main Field</CardTitle>
                  <CardDescription>2.5 acres • Verified</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Survey No:</strong> 123/4A</p>
                    <p><strong>Location:</strong> Village Rampur, Punjab</p>
                    <p><strong>Current Crop:</strong> Rice</p>
                    <p><strong>Status:</strong> <span className="text-green-600">Active</span></p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plot #2 - North Field</CardTitle>
                  <CardDescription>2.7 acres • Pending Verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Survey No:</strong> 123/5B</p>
                    <p><strong>Location:</strong> Village Rampur, Punjab</p>
                    <p><strong>Current Crop:</strong> Wheat</p>
                    <p><strong>Status:</strong> <span className="text-yellow-600">Pending</span></p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'predictions':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Crop & Price Predictions</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Recommended Crops</h2>
                <div className="space-y-4">
                  {cropPredictions.map((crop) => (
                    <Card key={crop.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{crop.crop}</h3>
                            <p className="text-sm text-gray-600">{crop.season} Season</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{crop.suitability}%</div>
                            <div className="text-sm text-gray-600">{crop.expectedYield}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Price Trends</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                      <p>Price prediction charts will be displayed here</p>
                      <p className="text-sm">Integration with market data APIs</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case 'weather':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Weather Forecast</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>7-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="text-center p-2 rounded-lg bg-gray-50">
                        <div className="font-medium text-sm">{day.day}</div>
                        <div className="text-xs text-gray-600 mt-1">{day.condition}</div>
                        <div className="text-sm font-semibold mt-2">{day.high}°</div>
                        <div className="text-xs text-gray-500">{day.low}°</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{weatherData.current.temperature}°C</div>
                      <div className="text-gray-600">{weatherData.current.condition}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Humidity</span>
                        <span>{weatherData.current.humidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wind Speed</span>
                        <span>{weatherData.current.windSpeed} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rainfall</span>
                        <span>{weatherData.current.rainfall} mm</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600">This feature is under development.</p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderDashboardContent()}
        </main>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActionButtons 
        onChatClick={handleChatClick}
        onCallClick={handleCallClick}
      />
    </div>
  )
}

export default FarmerDashboard
