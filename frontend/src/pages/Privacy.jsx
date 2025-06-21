import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, ArrowLeft, Calendar, Shield, Lock, Eye, Database, Users } from 'lucide-react'

const Privacy = () => {
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
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>Last updated: January 1, 2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield size={16} />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Privacy at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Encryption</h3>
              <p className="text-gray-600 text-sm">All data is encrypted in transit and at rest using industry-standard encryption.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Data Sharing</h3>
              <p className="text-gray-600 text-sm">We never sell or share your personal data with third parties for marketing purposes.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Control</h3>
              <p className="text-gray-600 text-sm">You have full control over your data and can delete it at any time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                  <li>Name and email address</li>
                  <li>Password (encrypted and never stored in plain text)</li>
                  <li>Profile information you choose to provide</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Data</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We automatically collect certain information when you use our service:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                  <li>IP address and browser information</li>
                  <li>Pages visited and features used</li>
                  <li>Time spent on the platform</li>
                  <li>Device and operating system information</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">File Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  When you upload Excel files, we process and store the data to provide our visualization services. 
                  This data is associated with your account and is only accessible to you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Provide and maintain our service</li>
                  <li>Process your Excel files and generate visualizations</li>
                  <li>Communicate with you about your account and our service</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                  <li>Send you important updates and notifications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Sharing and Disclosure</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We work with trusted third-party service providers who help us operate our platform, such as:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                  <li>Cloud hosting providers (AWS, Google Cloud)</li>
                  <li>Email service providers</li>
                  <li>Analytics and monitoring services</li>
                  <li>Payment processors (for paid plans)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
                <p className="text-gray-600 leading-relaxed">
                  We may disclose your information if required by law, court order, or government request, 
                  or to protect our rights, property, or safety, or that of our users or the public.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your data:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Lock className="text-brown" size={20} />
                      <h3 className="font-semibold text-gray-900">Encryption</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      All data is encrypted using AES-256 encryption at rest and TLS 1.3 in transit.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Shield className="text-brown" size={20} />
                      <h3 className="font-semibold text-gray-900">Access Control</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Strict access controls ensure only authorized personnel can access systems.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Database className="text-brown" size={20} />
                      <h3 className="font-semibold text-gray-900">Regular Backups</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Automated backups ensure your data is safe and can be recovered if needed.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Eye className="text-brown" size={20} />
                      <h3 className="font-semibold text-gray-900">Monitoring</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      24/7 monitoring and intrusion detection systems protect against threats.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You have the following rights regarding your personal data:
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-brown pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Access and Portability</h3>
                    <p className="text-gray-600 text-sm">
                      You can request a copy of all personal data we have about you in a machine-readable format.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-brown pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Correction</h3>
                    <p className="text-gray-600 text-sm">
                      You can update your personal information at any time through your account settings.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-brown pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Deletion</h3>
                    <p className="text-gray-600 text-sm">
                      You can delete your account and all associated data at any time. This action is irreversible.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-brown pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Objection</h3>
                    <p className="text-gray-600 text-sm">
                      You can object to certain processing of your data, such as marketing communications.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We retain your data for as long as necessary to provide our services and comply with legal obligations:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Account data:</strong> Retained while your account is active</li>
                  <li><strong>File data:</strong> Retained until you delete files or close your account</li>
                  <li><strong>Usage logs:</strong> Retained for up to 2 years for security and analytics</li>
                  <li><strong>Communication records:</strong> Retained for up to 3 years for support purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. International Data Transfers</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our servers are located in the United States. If you are accessing our service from outside the US, 
                  your data may be transferred to and processed in the United States. We ensure appropriate safeguards 
                  are in place for international data transfers in compliance with applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect 
                  personal information from children under 13. If you are a parent or guardian and believe your 
                  child has provided us with personal information, please contact us to have it removed.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Posting the new Privacy Policy on this page</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Sending you an email notification (for significant changes)</li>
                  <li>Displaying a prominent notice on our platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="text-gray-600 space-y-2">
                    <li><strong>Email:</strong> privacy@excelanalytics.com</li>
                    <li><strong>Data Protection Officer:</strong> dpo@excelanalytics.com</li>
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
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
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

export default Privacy