import React, { useState } from 'react'
import Sidebar from '@/components/common/Sidebar'
import StatisticCard from '@/components/common/StatisticCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Menu, 
  Users, 
  MapPin, 
  FileCheck, 
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  X,
  Check,
  BarChart3,
  Activity
} from 'lucide-react'

const AdminDashboard = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'verifications', label: 'Verifications', icon: Shield },
    { id: 'pooling', label: 'Land Pooling', icon: MapPin },
    { id: 'transactions', label: 'Transactions', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileCheck },
    { id: 'users', label: 'User Management', icon: Users },
  ]

  const mockVerifications = [
    {
      id: 'VER001',
      farmer: 'Rajesh Kumar',
      landArea: '2.5 acres',
      surveyNo: '123/4A',
      location: 'Village Rampur, Punjab',
      submittedDate: '2024-01-15',
      status: 'pending',
      documents: 4
    },
    {
      id: 'VER002',
      farmer: 'Priya Sharma',
      landArea: '3.2 acres',
      surveyNo: '456/7B',
      location: 'Village Kisan Nagar, Maharashtra',
      submittedDate: '2024-01-14',
      status: 'approved',
      documents: 5
    },
    {
      id: 'VER003',
      farmer: 'Amit Patel',
      landArea: '1.8 acres',
      surveyNo: '789/1C',
      location: 'Village Agri Town, Gujarat',
      submittedDate: '2024-01-13',
      status: 'rejected',
      documents: 3
    }
  ]

  const mockPoolingRequests = [
    {
      id: 'POOL001',
      initiator: 'Rajesh Kumar',
      participants: ['Suresh Singh', 'Mohan Lal', 'Ravi Gupta'],
      totalArea: '12.5 acres',
      location: 'Village Rampur, Punjab',
      status: 'active',
      crop: 'Wheat',
      expectedYield: '45 tons'
    },
    {
      id: 'POOL002',
      initiator: 'Priya Sharma',
      participants: ['Sunita Devi', 'Kavita Patel'],
      totalArea: '8.7 acres',
      location: 'Village Kisan Nagar, Maharashtra',
      status: 'pending',
      crop: 'Cotton',
      expectedYield: '18 tons'
    }
  ]

  const mockTransactions = [
    {
      id: 'TXN001',
      type: 'Token Transfer',
      from: 'Rajesh Kumar',
      to: 'Priya Sharma',
      amount: '500 AGR3',
      status: 'completed',
      timestamp: '2024-01-15 14:30'
    },
    {
      id: 'TXN002',
      type: 'Yield Distribution',
      from: 'Pool Contract',
      to: 'Multiple Farmers',
      amount: '2,500 AGR3',
      status: 'processing',
      timestamp: '2024-01-15 12:15'
    }
  ]

  const handleVerificationAction = (id, action) => {
    console.log(`${action} verification ${id}`)
  }

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-purple-100">Monitor and manage the Agrovardhan platform</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatisticCard
                title="Total Farmers"
                value="12,450"
                subtitle="Registered users"
                trend="up"
                trendValue="+15%"
                icon={Users}
              />
              <StatisticCard
                title="Land Verified"
                value="8,750"
                subtitle="Acres verified"
                trend="up"
                trendValue="+23%"
                icon={MapPin}
              />
              <StatisticCard
                title="Pending Verifications"
                value="45"
                subtitle="Awaiting review"
                icon={Clock}
              />
              <StatisticCard
                title="Active Pools"
                value="156"
                subtitle="Land pools"
                trend="up"
                trendValue="+8%"
                icon={TrendingUp}
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Verifications</CardTitle>
                  <CardDescription>Latest land verification requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockVerifications.slice(0, 3).map((verification) => (
                      <div key={verification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{verification.farmer}</p>
                          <p className="text-sm text-gray-600">{verification.landArea} • {verification.location}</p>
                        </div>
                        <Badge variant={
                          verification.status === 'approved' ? 'default' :
                          verification.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {verification.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Platform performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Server Uptime</span>
                      <span className="text-sm text-green-600">99.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Users</span>
                      <span className="text-sm">2,847</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Blockchain Sync</span>
                      <span className="text-sm text-green-600">Synced</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">API Response Time</span>
                      <span className="text-sm">145ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'verifications':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Land Verifications</h1>
              <div className="flex space-x-2">
                <Button variant="outline">All</Button>
                <Button variant="outline">Pending</Button>
                <Button variant="outline">Approved</Button>
                <Button variant="outline">Rejected</Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Land Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockVerifications.map((verification) => (
                        <tr key={verification.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{verification.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{verification.farmer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {verification.landArea}<br/>
                            <span className="text-gray-500">Survey: {verification.surveyNo}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{verification.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{verification.documents} files</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={
                              verification.status === 'approved' ? 'default' :
                              verification.status === 'rejected' ? 'destructive' : 'secondary'
                            }>
                              {verification.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {verification.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-green-600"
                                    onClick={() => handleVerificationAction(verification.id, 'approve')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-600"
                                    onClick={() => handleVerificationAction(verification.id, 'reject')}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'pooling':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Land Pooling Requests</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockPoolingRequests.map((pool) => (
                <Card key={pool.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{pool.id}</CardTitle>
                        <CardDescription>Initiated by {pool.initiator}</CardDescription>
                      </div>
                      <Badge variant={pool.status === 'active' ? 'default' : 'secondary'}>
                        {pool.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Total Area:</strong> {pool.totalArea}</div>
                        <div><strong>Participants:</strong> {pool.participants.length + 1}</div>
                        <div><strong>Crop:</strong> {pool.crop}</div>
                        <div><strong>Expected Yield:</strong> {pool.expectedYield}</div>
                      </div>
                      <div className="text-sm">
                        <strong>Location:</strong> {pool.location}
                      </div>
                      <div className="text-sm">
                        <strong>Participants:</strong>
                        <div className="mt-1 space-y-1">
                          <div>• {pool.initiator} (Initiator)</div>
                          {pool.participants.map((participant, index) => (
                            <div key={index}>• {participant}</div>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {pool.status === 'pending' && (
                          <Button size="sm">
                            Approve Pool
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 'transactions':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Blockchain Transactions</h1>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.from}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.to}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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
        menuItems={menuItems}
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
                System Status: <span className="text-green-600 font-medium">Operational</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderDashboardContent()}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
