import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="pt-24 pb-16 fade-in">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-8">
          <Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="text-primary-600">Terms of Service</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
          
          <div className="prose max-w-none">
            <p className="mb-6">
              Welcome to Ali Tours & Travels. By accessing and using our website and services, you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. General</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>The use of this website and our services is subject to the terms outlined here.</li>
              <li>These Terms & Conditions apply to all users, including visitors, customers, and third-party service providers.</li>
              <li>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Booking and Payment</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>All bookings are subject to availability and confirmation.</li>
              <li>Prices are subject to change without prior notice.</li>
              <li>Full or partial payment may be required at the time of booking, depending on the package or service.</li>
              <li>Payment can be made via bank transfer, UPI, or any authorized method agreed upon.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Cancellations and Refunds</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Cancellation policies vary depending on the tour package and third-party service providers (airlines, hotels, etc.).</li>
              <li>Refunds, if applicable, will be processed within 7–14 working days, subject to deductions as per our cancellation policy.</li>
              <li>No refund will be given for unused services or last-minute cancellations.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Travel Documents and ID</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Customers are responsible for ensuring they carry valid ID proof and necessary travel documents.</li>
              <li>We are not liable for issues arising from incomplete or invalid travel documents.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Liability Disclaimer</h2>
            <p className="mb-4">While we strive to offer the best travel experience, Ali Tours & Travels shall not be liable for:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Delays or cancellations by airlines, railways, or other transport providers</li>
              <li>Loss or damage of personal belongings</li>
              <li>Natural disasters, accidents, political unrest, or any events beyond our control</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. User Conduct</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>You agree to use our website and services for lawful purposes only.</li>
              <li>You must not post or transmit any material that is harmful, threatening, defamatory, or otherwise objectionable.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Third-Party Services</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>We work with third-party vendors such as hotels, airlines, and transport operators.</li>
              <li>We are not responsible for their services, actions, or delays.</li>
              <li>Disputes with third parties should be resolved directly with the concerned provider, although we will assist wherever possible.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Intellectual Property</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>All content on our website, including text, images, logos, and graphics, is the property of Ali Tours & Travels and protected by copyright laws.</li>
              <li>Unauthorized use of any material is strictly prohibited.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Governing Law</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>These Terms & Conditions are governed by the laws of India.</li>
              <li>Any disputes arising from or related to these terms shall be subject to the jurisdiction of courts in Bilaspur, Chhattisgarh.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
            <p className="mb-4">For any queries or concerns related to these terms, please contact us:</p>
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

export default TermsOfService;