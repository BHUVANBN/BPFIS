import React from 'react'
import Navbar from '@/components/common/Navbar'
import HeroBanner from '@/components/common/HeroBanner'
import FeatureCard from '@/components/common/FeatureCard'
import StatisticCard from '@/components/common/StatisticCard'
import { FloatingActionButtons } from '@/components/common/FloatingActionButton'
import { features, statistics, testimonials } from '@/data/mockData'
import { 
  MapPin, 
  TrendingUp, 
  FileText, 
  Cloud, 
  Users, 
  FileCheck, 
  IndianRupee,
  ArrowRight,
  CheckCircle,
  Star,
  Leaf
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const iconMap = {
  MapPin,
  TrendingUp,
  FileText,
  Cloud,
  Users,
  FileCheck,
  IndianRupee
}

const LandingPage = ({ onNavigateToAuth }) => {
  const handleChatClick = () => {
    console.log('AI Chat clicked')
  }

  const handleCallClick = () => {
    console.log('Call clicked')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigateToAuth={onNavigateToAuth} />
      
      {/* Hero Section */}
      <HeroBanner />

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Empowering Agriculture with Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Agri3 is revolutionizing farming through blockchain, AI, and community collaboration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const IconComponent = iconMap[feature.icon]
              return (
                <FeatureCard
                  key={feature.id}
                  icon={IconComponent}
                  title={feature.title}
                  description={feature.description}
                  onClick={() => console.log(`${feature.title} clicked`)}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Growing Impact Across India
            </h2>
            <p className="text-xl text-gray-600">
              Real numbers from our thriving agricultural community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat) => {
              const IconComponent = iconMap[stat.icon]
              return (
                <StatisticCard
                  key={stat.id}
                  title={stat.title}
                  value={stat.value}
                  subtitle={stat.subtitle}
                  trend={stat.trend}
                  trendValue={stat.trendValue}
                  icon={IconComponent}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Agri3 Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to transform your farming experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Register", description: "Sign up as a farmer or seller on our platform", icon: Users },
              { step: 2, title: "Pool Land", description: "Connect with neighbors to integrate farmland", icon: MapPin },
              { step: 3, title: "Cultivate", description: "Use AI insights for optimal crop selection", icon: TrendingUp },
              { step: 4, title: "Share Profits", description: "Enjoy increased returns through collaboration", icon: IndianRupee }
            ].map((item, index) => (
              <div key={item.step} className="text-center relative">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from farmers, sellers, and administrators
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers already benefiting from Agri3's revolutionary platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
              onClick={onNavigateToAuth}
            >
              <Users className="mr-2 h-5 w-5" />
              Register as Farmer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg"
              onClick={onNavigateToAuth}
            >
              <Leaf className="mr-2 h-5 w-5" />
              Register as Seller
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-4">Agri3</h3>
              <p className="text-gray-400">
                Revolutionizing agriculture through blockchain, AI, and community collaboration.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Agri3. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <FloatingActionButtons 
        onChatClick={handleChatClick}
        onCallClick={handleCallClick}
      />
    </div>
  )
}

export default LandingPage
