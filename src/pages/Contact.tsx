import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, MessageSquare, Send, Calendar, User } from 'lucide-react';
import LocationMap from '../components/LocationMap';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Create WhatsApp message
    const whatsappMessage = `Hello Ali Tours & Travels,

I'm interested in your services. Here are my details:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${data.subject}

Message: ${data.message}

Please get back to me at your earliest convenience.

Thank you!`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Open WhatsApp with pre-filled message
    const whatsappURL = `https://wa.me/917869147222?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    
    // Reset form and show success state
    reset();
    setIsSubmitting(false);
  };
  
  return (
    <div className="pt-24 pb-16 fade-in">
      {/* Header */}
      <div className="bg-primary-600 py-16 mb-12">
        <div className="container text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="max-w-2xl mx-auto">
            Looking for the perfect getaway?
From tour details to custom plans, we’re here to make your travel smooth and special.
          </p>
        </div>
      </div>
      
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <MapPin className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Our Location</h4>
                    <p className="text-gray-600">
                      Bohra Complex Shop No 2 Near Hirazy Sales Telipara Road Bilaspur C.G 495001
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Phone className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Phone Numbers</h4>
                    <div className="space-y-1">
                      <a href="tel:+917869147222" className="text-gray-600 hover:text-primary-600 transition-colors block">
                        +91 78691-47222
                      </a>
                      <a href="tel:+919111917200" className="text-gray-600 hover:text-primary-600 transition-colors block">
                        +91 91119-17200
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Mail className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email Address</h4>
                    <a href="mailto:info@alitourstravels.in" className="text-gray-600 hover:text-primary-600 transition-colors">
                      info@alitourstravels.in
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Calendar className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Business Hours</h4>
                    <p className="text-gray-600">
                      Monday to Saturday: 9:00 AM - 7:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* WhatsApp Quick Contact */}
            <div className="bg-green-50 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Quick Connect on WhatsApp</h3>
              <p className="text-gray-600 mb-6">
                Get instant responses to your queries by connecting with us on WhatsApp.
              </p>
              <a 
                href="https://wa.me/917869147222?text=Hello,%20I'm%20interested%20in%20your%20Andaman%20tour%20packages." 
                className="bg-green-500 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Chat with Us on WhatsApp
              </a>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
              <p className="text-sm text-gray-600 mb-6">
                Fill out the form below and we'll redirect you to WhatsApp to continue the conversation.
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="label flex items-center">
                      <User size={16} className="mr-2 text-gray-500" />
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`input ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Your full name"
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="label flex items-center">
                      <Mail size={16} className="mr-2 text-gray-500" />
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`input ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Your email address"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="label flex items-center">
                      <Phone size={16} className="mr-2 text-gray-500" />
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={`input ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="Your phone number"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit phone number'
                        }
                      })}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="label flex items-center">
                      <MessageSquare size={16} className="mr-2 text-gray-500" />
                      Subject
                    </label>
                    <select
                      id="subject"
                      className={`input ${errors.subject ? 'border-red-500' : ''}`}
                      {...register('subject', { required: 'Subject is required' })}
                    >
                      <option value="">Select a subject</option>
                      <option value="Tour Inquiry">Tour Package Inquiry</option>
                      <option value="Booking Question">Booking Question</option>
                      <option value="Custom Tour">Custom Tour Request</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Message */}
                <div>
                  <label htmlFor="message" className="label flex items-center">
                    <MessageSquare size={16} className="mr-2 text-gray-500" />
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className={`input ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="How can we help you?"
                    {...register('message', { required: 'Message is required' })}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Opening WhatsApp...'
                  ) : (
                    <>
                      <svg width="20\" height="20\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" className="mr-2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      Send via WhatsApp
                    </>
                  )}
                </button>
                
                <p className="text-xs text-center text-gray-500 mt-2">
                  By clicking 'Send via WhatsApp', your message will be formatted and opened in WhatsApp to continue the conversation.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="container mt-16">
        <LocationMap />
      </div>
    </div>
  );
};

export default Contact;