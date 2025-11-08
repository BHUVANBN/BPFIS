import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Building2, Phone, Mail } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { sendOTP, verifyUser } from '@/lib/endpoints'

const AuthPage = ({ onLogin }) => {
  const [userType, setUserType] = useState('farmer')
  const [authMode, setAuthMode] = useState('login')
  const [otpMode, setOtpMode] = useState(false)
  const [otp, setOtp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    password: '',
    serviceType: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!otpMode) {
      try {
        setSubmitting(true)
        await sendOTP(formData.phone)
        setOtpMode(true)
      } catch {
        toast({ title: 'Failed to send OTP', variant: 'destructive' })
      } finally {
        setSubmitting(false)
      }
      return
    }
    try {
      setSubmitting(true)
      const role = userType === 'seller' ? 'supplier' : 'farmer'
      const payload = {
        phone: formData.phone,
        otp,
        role,
        name: role === 'farmer' ? formData.name : formData.companyName,
        email: formData.email || undefined,
      }
      const { data } = await verifyUser(payload)
      localStorage.setItem('agri3-token', data.token)
      localStorage.setItem('agri3-user', JSON.stringify(data.user))
      onLogin(data.user)
    } catch {
      toast({ title: 'Authentication failed', description: 'Please check the OTP and try again', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      companyName: '',
      phone: '',
      email: '',
      password: '',
      serviceType: ''
    })
    setOtp('')
    setOtpMode(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Agrovardhan</h1>
          <p className="text-gray-600">Join the agricultural revolution</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {authMode === 'login' 
                ? 'Sign in to your account' 
                : 'Join thousands of farmers and sellers'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Auth Mode Toggle */}
            <div className="flex mb-6">
              <Button
                variant={authMode === 'login' ? 'default' : 'ghost'}
                className="flex-1 rounded-r-none"
                onClick={() => {
                  setAuthMode('login')
                  resetForm()
                }}
              >
                Login
              </Button>
              <Button
                variant={authMode === 'register' ? 'default' : 'ghost'}
                className="flex-1 rounded-l-none"
                onClick={() => {
                  setAuthMode('register')
                  resetForm()
                }}
              >
                Register
              </Button>
            </div>

            {/* User Type Selection for Registration */}
            {authMode === 'register' && (
              <Tabs value={userType} onValueChange={setUserType} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="farmer" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Farmer
                  </TabsTrigger>
                  <TabsTrigger value="seller" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Seller
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name/Company Name */}
              {authMode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor={userType === 'farmer' ? 'name' : 'companyName'}>
                    {userType === 'farmer' ? 'Full Name' : 'Company Name'}
                  </Label>
                  <Input
                    id={userType === 'farmer' ? 'name' : 'companyName'}
                    name={userType === 'farmer' ? 'name' : 'companyName'}
                    type="text"
                    placeholder={userType === 'farmer' ? 'Enter your full name' : 'Enter company name'}
                    value={userType === 'farmer' ? formData.name : formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="pl-10"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={submitting || otpMode}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email {authMode === 'register' && userType === 'farmer' && '(Optional)'}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange}
                    required={authMode === 'login' || userType === 'seller'}
                  />
                </div>
              </div>

              {/* Service Type for Sellers */}
              {authMode === 'register' && userType === 'seller' && (
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Product/Service Type</Label>
                  <Input
                    id="serviceType"
                    name="serviceType"
                    type="text"
                    placeholder="e.g., Seeds, Fertilizers, Equipment"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              {/* OTP (shown after sending) */}
              {otpMode && (
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="4-6 digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {otpMode ? 'Verify OTP' : 'Send OTP'}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 text-center space-y-2">
              {authMode === 'login' && (
                <Button variant="link" className="text-sm text-gray-600">
                  Forgot your password?
                </Button>
              )}
              
              <div className="text-sm text-gray-600">
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-green-600"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login')
                    resetForm()
                  }}
                >
                  {authMode === 'login' ? 'Sign up' : 'Sign in'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          By continuing, you agree to our{' '}
          <Button variant="link" className="p-0 h-auto text-sm">
            Terms of Service
          </Button>{' '}
          and{' '}
          <Button variant="link" className="p-0 h-auto text-sm">
            Privacy Policy
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
