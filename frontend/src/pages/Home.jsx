import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { 
  BarChart3, 
  Upload, 
  Download, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp,
  FileSpreadsheet,
  PieChart,
  LineChart,
  Activity,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Menu,
  X
} from 'lucide-react'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const features = [
    {
      icon: Upload,
      title: 'Smart File Upload',
      description: 'Drag & drop Excel files with intelligent parsing and validation',
      color: 'bg-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Interactive Charts',
      description: 'Generate stunning 2D and 3D visualizations with real-time updates',
      color: 'bg-green-500'
    },
    {
      icon: Download,
      title: 'Export & Share',
      description: 'Download charts in multiple formats and share insights instantly',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with advanced sharing and permission controls',
      color: 'bg-orange-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process large datasets instantly with optimized performance',
      color: 'bg-yellow-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with encryption and compliance standards',
      color: 'bg-red-500'
    }
  ]

  const chartTypes = [
    { icon: BarChart3, name: 'Bar Charts', description: 'Compare categories and values' },
    { icon: LineChart, name: 'Line Charts', description: 'Track trends over time' },
    { icon: PieChart, name: 'Pie Charts', description: 'Show proportions and percentages' },
    { icon: Activity, name: 'Scatter Plots', description: 'Analyze correlations and patterns' }
  ]

  const testimonials = [
    {
      name: 'Karthikeya',
      role: 'Data Analyst at TechCorp',
      content: 'This platform transformed how we analyze our quarterly reports. The 3D visualizations are incredible!',
      rating: 5
    },
    {
      name: 'Nithya',
      role: 'Business Intelligence Manager',
      content: 'Finally, a tool that makes Excel data beautiful and meaningful. Our presentations have never looked better.',
      rating: 5
    },
    {
      name: 'Revathi',
      role: 'Marketing Director',
      content: 'The ease of use is outstanding. I can create professional charts in minutes, not hours.',
      rating: 5
    }
  ]

  const stats = [
    { number: '100K+', label: 'Active Users' },
    { number: '5M+', label: 'Charts Created' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ]

  const navItems = [
    { href: '#features', label: 'Features' },
    { href: '#testimonials', label: 'Reviews' },
    { href: '#contact', label: 'Contact' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-brown/10 p-2 rounded-lg">
                <BarChart3 className="text-brown" size={24} />
              </div>
              <span className="text-xl font-bold text-brown-dark">
                Excel Analytics
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="text-gray-700 hover:text-brown transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary flex items-center space-x-2"
                >
                  <BarChart3 size={16} />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-brown transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-brown transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block text-gray-700 hover:text-brown transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      className="block w-full text-center btn-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block text-center text-gray-700 hover:text-brown transition-colors font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full text-center btn-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brown-light via-brown to-brown-dark overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-white text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                Transform Your
                <span className="block text-yellow-300">Excel Data</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
                Upload Excel files and create stunning interactive charts in seconds. 
                Analyze your data with powerful visualization tools and share insights effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="bg-white text-brown-dark font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-base sm:text-lg"
                >
                  <Zap size={20} />
                  <span>Start Analyzing Free</span>
                </Link>
                <button className="border-2 border-white text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-white hover:text-brown-dark transition-colors flex items-center justify-center space-x-2 text-base sm:text-lg">
                  <Play size={20} />
                  <span>Watch Demo</span>
                </button>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-white/80 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} />
                  <span>Free forever plan</span>
                </div>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Sales Analytics</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-32 sm:h-48 bg-gradient-to-br from-brown/10 to-brown/30 rounded-lg flex items-center justify-center">
                    <BarChart3 size={48} className="text-brown" />
                  </div>
                  <div className="mt-4 flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Revenue: $125,430</span>
                    <span className="text-green-600">↗ +12.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brown mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Data Analysis
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to turn your Excel data into meaningful insights and beautiful visualizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
                <div className={`${feature.color} w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chart Types Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Multiple Chart Types
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Create the perfect visualization for your data with our comprehensive chart library
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {chartTypes.map((chart, index) => (
              <div key={index} className="bg-white rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow border border-gray-200">
                <div className="bg-brown/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <chart.icon className="text-brown" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{chart.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{chart.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by Data Professionals
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of users who trust our platform for their data analysis needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={18} />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="bg-brown/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <span className="text-brown font-semibold text-sm sm:text-base">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brown-light to-brown py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Data?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of professionals who trust our platform for their data analysis needs. 
            Start creating beautiful charts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="bg-white text-brown-dark font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-base sm:text-lg"
            >
              <TrendingUp size={20} />
              <span>Start Free Today</span>
            </Link>
            <button className="border-2 border-white text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-white hover:text-brown-dark transition-colors flex items-center justify-center space-x-2 text-base sm:text-lg">
              <Globe size={20} />
              <span>View Live Demo</span>
            </button>
          </div>
          <p className="text-white/70 text-sm mt-6">
            No credit card required • Free forever plan • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-brown/20 p-2 rounded-lg">
                  <BarChart3 className="text-brown" size={24} />
                </div>
                <span className="text-xl font-bold">Excel Analytics Platform</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transform your Excel data into beautiful, interactive charts and gain insights 
                that drive better business decisions.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <Globe size={20} />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <Users size={20} />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <Activity size={20} />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Excel Analytics Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home