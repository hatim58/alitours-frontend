import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-24 pb-16 fade-in">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-8">
          <Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="text-primary-600">Privacy Policy</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="mb-6">
              At Ali Tours & Travels, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you interact with our website and services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-4">We may collect the following types of information:</p>

            <h3 className="text-xl font-bold mb-3">a. Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Mobile number</li>
              <li>Address</li>
              <li>Government ID details (if required for booking)</li>
              <li>Payment and billing information (if applicable)</li>
            </ul>

            <h3 className="text-xl font-bold mb-3">b. Non-Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited</li>
              <li>Date and time of visit</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Process bookings and travel arrangements</li>
              <li>Send confirmations, updates, and travel itineraries</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve website functionality and user experience</li>
              <li>Send promotional offers (only if you opt-in)</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Information Sharing</h2>
            <p className="mb-4">We do not sell or rent your personal data. However, we may share your data with:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Trusted third-party service providers (e.g., airlines, hotels) to complete bookings</li>
              <li>Government or regulatory authorities, if required by law</li>
              <li>Website service providers (e.g., analytics, hosting), under strict confidentiality</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies and Tracking</h2>
            <p className="mb-4">We use cookies to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Improve website performance</li>
              <li>Analyze traffic and user behavior</li>
              <li>Remember user preferences</li>
            </ul>
            <p>You may disable cookies via your browser settings, but it may affect site functionality.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security</h2>
            <p className="mb-6">
              We take appropriate technical and organizational measures to safeguard your data against unauthorized access, disclosure, or misuse.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Request access to your personal data</li>
              <li>Correct or delete your information</li>
              <li>Withdraw consent for marketing communication at any time</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact Us</h2>
            <p className="mb-4">For any privacy-related queries, please contact us:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold mb-2">Ali Tours & Travels</p>
              <p>📍 Bohra Complex, Shop No. 3, Near Hirazy Sales, Jwali Poll, Telipara Road, Bilaspur, C.G. 495001, India</p>
              <p>📧 <a href="mailto:info@alitourstravels.in" className="text-primary-600">info@alitourstravels.in</a></p>
              <p>📞 <a href="tel:+917869147222" className="text-primary-600">+91 78691 47222</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;