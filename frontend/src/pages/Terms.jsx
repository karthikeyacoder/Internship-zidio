import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, ArrowLeft, Calendar, Shield, AlertCircle } from 'lucide-react'

const Terms = () => {
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

      {/* Header */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <div className="flex items-center justify-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>Last updated: January 1, 2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield size={16} />
                <span>Version 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="text-amber-800 font-semibold mb-2">Important Notice</h3>
                  <p className="text-amber-700 text-sm">
                    Please read these Terms of Service carefully before using our platform. 
                    By accessing or using Excel Analytics Platform, you agree to be bound by these terms.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  By accessing and using Excel Analytics Platform ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  These Terms of Service may be updated from time to time. We will notify you of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Excel Analytics Platform is a web-based service that allows users to upload Excel files and create interactive charts and visualizations. The Service includes:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>File upload and processing capabilities</li>
                  <li>Chart generation and customization tools</li>
                  <li>Data visualization and analytics features</li>
                  <li>Export and sharing functionality</li>
                  <li>User account management</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  To access certain features of the Service, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Providing accurate and complete information</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  You must be at least 13 years old to create an account. If you are under 18, you must have parental consent to use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Upload malicious files or content that violates any laws</li>
                  <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
                  <li>Use the Service to transmit spam, viruses, or other harmful code</li>
                  <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                  <li>Use automated tools to access the Service without permission</li>
                  <li>Upload content that infringes on intellectual property rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data and Privacy</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use the Service. By using the Service, you agree to the collection and use of information in accordance with our Privacy Policy.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  You retain ownership of any data you upload to the Service. We do not claim ownership of your content, but you grant us a license to use, store, and process your data to provide the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  The Service and its original content, features, and functionality are owned by Excel Analytics Platform and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without our prior written consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Service Availability</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We strive to maintain high availability of the Service, but we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Scheduled maintenance</li>
                  <li>Technical difficulties</li>
                  <li>Force majeure events</li>
                  <li>Third-party service disruptions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  To the maximum extent permitted by law, Excel Analytics Platform shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our total liability to you for any damages arising from or related to these Terms or the Service shall not exceed the amount you have paid us in the twelve (12) months preceding the claim.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  You may terminate your account at any time by contacting us. Upon termination, your right to use the Service will cease immediately, and we may delete your account and data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the courts of California.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="text-gray-600 space-y-2">
                    <li><strong>Email:</strong> legal@excelanalytics.com</li>
                    <li><strong>Address:</strong> 123 Analytics Street, Data City, DC 12345</li>
                    <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                  </ul>
                </div>
              </section>
            </div>
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
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
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

export default Terms