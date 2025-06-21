import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Users, Target, Award, ArrowLeft, Globe, Zap, Shield } from 'lucide-react'

const About = () => {
  const team = [
    {
      name: 'Karthikeya',
      role: 'CEO & Founder',
      bio: 'Visionary leader with expertise in data analytics and business intelligence solutions.',
      image: 'K'
    },
    {
      name: 'Nithya',
      role: 'CTO',
      bio: 'Full-stack engineer passionate about creating scalable and innovative data platforms.',
      image: 'N'
    },
    {
      name: 'Revathi',
      role: 'Head of Product',
      bio: 'Product strategist focused on user experience and data-driven decision making.',
      image: 'R'
    },
    {
      name: 'Rama Krishna',
      role: 'Lead Designer',
      bio: 'UI/UX designer creating beautiful and intuitive data visualization experiences.',
      image: 'RK'
    }
  ]

  const values = [
    {
      icon: Target,
      title: 'Simplicity First',
      description: 'We believe powerful analytics should be simple and accessible to everyone, regardless of technical expertise.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously push the boundaries of what\'s possible in data visualization and analysis.'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Your data security and privacy are our top priorities. We implement industry-leading security measures.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We build for our users and with our users, creating tools that solve real-world problems.'
    }
  ]

  const milestones = [
    { year: '2021', event: 'Company founded with a vision to democratize data analytics' },
    { year: '2022', event: 'Launched beta version with 1,000 early adopters' },
    { year: '2023', event: 'Reached 10,000 active users and $1M ARR' },
    { year: '2024', event: 'Expanded to enterprise customers and launched API' },
    { year: '2025', event: 'Serving 100,000+ users across 150+ countries' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-brown hover:text-brown-dark transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-brown/10 p-2 rounded-lg">
                <BarChart3 className="text-brown" size={24} />
              </div>
              <span className="text-xl font-bold text-brown-dark">Excel Analytics</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brown-light to-brown text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            About Excel Analytics
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make data analysis accessible, beautiful, and powerful for everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that everyone should have access to powerful data visualization tools, 
                regardless of their technical background. Our platform transforms complex Excel data 
                into beautiful, interactive charts that tell compelling stories.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2021, we've helped thousands of businesses, analysts, and individuals 
                turn their data into actionable insights. From small startups to Fortune 500 companies, 
                our users trust us to make their data shine.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brown mb-2">100K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brown mb-2">5M+</div>
                  <div className="text-gray-600">Charts Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brown mb-2">150+</div>
                  <div className="text-gray-600">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brown mb-2">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
                <div className="bg-brown/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-brown" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate people behind Excel Analytics Platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="bg-brown/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-brown font-bold text-xl">{member.image}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-brown font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our company's growth
            </p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="bg-brown text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {milestone.year}
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex-1">
                  <p className="text-gray-700 leading-relaxed">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brown-light to-brown py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Be part of the data visualization revolution. Start creating beautiful charts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-brown-dark font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-brown-dark transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-brown/20 p-2 rounded-lg">
                <BarChart3 className="text-brown" size={24} />
              </div>
              <span className="text-xl font-bold">Excel Analytics Platform</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Excel Analytics Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default About