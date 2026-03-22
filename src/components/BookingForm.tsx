import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Users, MessageSquare, CreditCard, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingContext';
import { usePackages } from '../contexts/PackageContext';
import PaymentButton from './PaymentButton';

interface BookingFormProps {
  packageId: string;
  packageName: string;
  pricePerPerson: number;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  travelDate: string;
  guests: number;
  specialRequests?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  packageId, 
  packageName, 
  pricePerPerson 
}) => {
  const { addBooking } = useBookings();
  const { getPackageById } = usePackages();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingAction, setBookingAction] = useState<'payment' | 'whatsapp' | 'email' | null>(null);
  const { isAuthenticated, user } = useAuth();
  
  // Get the number of guests for price calculation
  const guests = watch('guests', 1);
  
  // Calculate total price
  const totalPrice = pricePerPerson * (guests || 1);
  
  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  // Set maximum date to 1 year from now
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  const handleBookingAction = (action: 'payment' | 'whatsapp' | 'email') => {
    setBookingAction(action);
  };
  
  const onSubmit = async (data: FormData, action: 'payment' | 'whatsapp' | 'email' = bookingAction || 'whatsapp') => {
    setIsSubmitting(true);
    
    try {
      // If user is authenticated, save the booking to the system
      if (isAuthenticated && user) {
        const bookingId = addBooking({
          packageId,
          packageName,
          userId: user.id,
          userName: data.fullName,
          email: data.email,
          phone: data.phone,
          travelDate: data.travelDate,
          guests: Number(data.guests),
          totalPrice: totalPrice,
          status: 'pending',
          specialRequests: data.specialRequests || undefined
        });
      }
      
      if (action === 'whatsapp') {
        // Create WhatsApp message with booking details
      const whatsappMessage = `Hello Ali Tours & Travels,

I would like to book the following tour package:

📦 Package: ${packageName}
👤 Name: ${data.fullName}
📧 Email: ${data.email}
📱 Phone: ${data.phone}
📅 Travel Date: ${new Date(data.travelDate).toLocaleDateString()}
👥 Number of Guests: ${data.guests} ${data.guests === 1 ? 'person' : 'people'}
💰 Total Amount: ₹${totalPrice.toLocaleString()}

${data.specialRequests ? `Special Requests: ${data.specialRequests}` : ''}

Please confirm the availability and provide further booking details.

Thank you!`;
        
      // Encode the message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage);
      
      // Open WhatsApp with pre-filled message
      const whatsappURL = `https://wa.me/917869147222?text=${encodedMessage}`;
      window.open(whatsappURL, '_blank');
      
      } else if (action === 'email') {
        // Create email with booking details
        const emailSubject = `Tour Package Inquiry - ${packageName}`;
        const emailBody = `Hello Ali Tours & Travels,

I would like to inquire about the following tour package:

📦 Package: ${packageName}
👤 Name: ${data.fullName}
📧 Email: ${data.email}
📱 Phone: ${data.phone}
📅 Travel Date: ${new Date(data.travelDate).toLocaleDateString()}
👥 Number of Guests: ${data.guests} ${data.guests === 1 ? 'person' : 'people'}
💰 Total Amount: ₹${totalPrice.toLocaleString()}

${data.specialRequests ? `Special Requests: ${data.specialRequests}\n\n` : ''}Please provide more details about this package and confirm availability.

Thank you!

Best regards,
${data.fullName}`;

        const mailtoURL = `mailto:info@alitourstravels.in?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoURL, '_blank');
      }
      
      // Show success message
      if (isAuthenticated) {
        if (action === 'whatsapp') {
          alert('Booking request sent via WhatsApp and saved to your account!');
        } else if (action === 'email') {
          alert('Email inquiry opened and booking saved to your account!');
        } else if (action === 'payment') {
          alert('Booking saved to your account! Proceeding to payment...');
        }
      } else {
        if (action === 'whatsapp') {
          alert('Booking request sent via WhatsApp!');
        } else if (action === 'email') {
          alert('Email inquiry opened!');
        } else if (action === 'payment') {
          alert('Proceeding to payment...');
        }
      }
      
    } catch (error) {
      alert('There was an error processing your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (response: any) => {
    alert('Payment successful! Your booking is confirmed.');
  };

  const generateOrderId = () => {
    return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
  return bookingAction === null ? (
    // Booking Options Selection
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-center mb-6">Choose Your Booking Option</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Book Now with Payment */}
        <button
          onClick={() => handleBookingAction('payment')}
          className="p-6 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-left group"
        >
          <div className="flex items-center mb-3">
            <div className="bg-primary-600 text-white p-3 rounded-full mr-4">
              <CreditCard size={24} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-primary-600">Book Now & Pay Online</h4>
              <p className="text-sm text-gray-600">Secure online payment with instant confirmation</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            • Instant booking confirmation
            • Secure payment gateway
            • Immediate receipt via email
          </div>
        </button>

        {/* WhatsApp Booking */}
        <button
          onClick={() => handleBookingAction('whatsapp')}
          className="p-6 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors text-left group"
        >
          <div className="flex items-center mb-3">
            <div className="bg-green-600 text-white p-3 rounded-full mr-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-600">Book via WhatsApp</h4>
              <p className="text-sm text-gray-600">Chat with our travel experts directly</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            • Direct communication with our team
            • Personalized assistance
            • Flexible payment options
          </div>
        </button>

        {/* Email Inquiry */}
        <button
          onClick={() => handleBookingAction('email')}
          className="p-6 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-left group"
        >
          <div className="flex items-center mb-3">
            <div className="bg-blue-600 text-white p-3 rounded-full mr-4">
              <Mail size={24} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-600">Send Email Inquiry</h4>
              <p className="text-sm text-gray-600">Get detailed information via email</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            • Detailed package information
            • Written communication record
            • Custom itinerary options
          </div>
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Choose the option that works best for you. All methods provide excellent customer service!
        </p>
      </div>
    </div>
  ) : (
    // Booking Form
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {bookingAction === 'payment' && 'Complete Your Booking'}
            {bookingAction === 'whatsapp' && 'WhatsApp Booking Details'}
            {bookingAction === 'email' && 'Email Inquiry Details'}
          </h3>
          <button
            type="button"
            onClick={() => setBookingAction(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to options
          </button>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="label">Full Name</label>
          <input
            id="fullName"
            type="text"
            className={`input ${errors.fullName ? 'border-red-500' : ''}`}
            defaultValue={isAuthenticated && user ? user.name : ''}
            {...register('fullName', { required: 'Full name is required' })}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="label">Email Address</label>
          <input
            id="email"
            type="email"
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            defaultValue={isAuthenticated && user ? user.email : ''}
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
        
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="label">Phone Number</label>
          <input
            id="phone"
            type="tel"
            className={`input ${errors.phone ? 'border-red-500' : ''}`}
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
        
        {/* Travel Date */}
        <div>
          <label htmlFor="travelDate" className="label flex items-center">
            <Calendar size={16} className="mr-2 text-gray-500" />
            Travel Date
          </label>
          <input
            id="travelDate"
            type="date"
            min={minDate}
            max={maxDateStr}
            className={`input ${errors.travelDate ? 'border-red-500' : ''}`}
            {...register('travelDate', { required: 'Travel date is required' })}
          />
          {errors.travelDate && (
            <p className="text-red-500 text-sm mt-1">{errors.travelDate.message}</p>
          )}
        </div>
        
        {/* Number of Guests */}
        <div>
          <label htmlFor="guests" className="label flex items-center">
            <Users size={16} className="mr-2 text-gray-500" />
            Number of Guests
          </label>
          <select
            id="guests"
            className={`input ${errors.guests ? 'border-red-500' : ''}`}
            {...register('guests', { required: 'Number of guests is required' })}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Person' : 'People'}
              </option>
            ))}
          </select>
          {errors.guests && (
            <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>
          )}
        </div>
        
        {/* Special Requests */}
        <div>
          <label htmlFor="specialRequests" className="label flex items-center">
            <MessageSquare size={16} className="mr-2 text-gray-500" />
            Special Requests (Optional)
          </label>
          <textarea
            id="specialRequests"
            rows={3}
            className="input"
            placeholder="Any special requirements or requests..."
            {...register('specialRequests')}
          ></textarea>
        </div>
        
        {/* Price Calculation */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>Price per person</span>
            <span>₹{pricePerPerson.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Number of guests</span>
            <span>{guests || 1}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2 mt-2">
            <span>Total Price</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            * GST included in the price
          </div>
        </div>
        
        {bookingAction === 'payment' ? (
          <PaymentButton
            amount={totalPrice}
            orderId={generateOrderId()}
            customerName={watch('fullName') || ''}
            customerEmail={watch('email') || ''}
            customerPhone={watch('phone') || ''}
            booking={{
              id: `BK${Date.now()}`,
              packageId,
              packageName,
              userId: user?.id || 'guest',
              userName: watch('fullName') || '',
              email: watch('email') || '',
              phone: watch('phone') || '',
              travelDate: watch('travelDate') || '',
              guests: Number(watch('guests')) || 1,
              totalPrice: totalPrice,
              status: 'pending' as const,
              specialRequests: watch('specialRequests'),
              createdAt: new Date()
            }}
            onSuccess={handlePaymentSuccess}
          />
        ) : (
          <button 
            type="submit" 
            className={`btn w-full flex items-center justify-center ${
              bookingAction === 'whatsapp' ? 'bg-green-600 text-white hover:bg-green-700' :
              bookingAction === 'email' ? 'bg-blue-600 text-white hover:bg-blue-700' :
              'btn-primary'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              bookingAction === 'whatsapp' ? 'Opening WhatsApp...' :
              bookingAction === 'email' ? 'Opening Email...' : 'Processing...'
            ) : (
              <>
                {bookingAction === 'whatsapp' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                )}
                {bookingAction === 'email' && <Mail size={20} className="mr-2" />}
                {bookingAction === 'whatsapp' && 'Send via WhatsApp'}
                {bookingAction === 'email' && 'Send Email Inquiry'}
              </>
            )}
          </button>
        )}
        
        <p className="text-xs text-center text-gray-500 mt-2">
          {bookingAction === 'payment' && 'Secure payment processing with instant confirmation'}
          {bookingAction === 'whatsapp' && 'Your booking details will be formatted and opened in WhatsApp to continue with Ali Tours & Travels'}
          {bookingAction === 'email' && 'Your inquiry will be formatted and opened in your email client to send to Ali Tours & Travels'}
        </p>
      </div>
    </form>
  );
};

export default BookingForm;