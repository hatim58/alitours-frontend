import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Booking, BookingDetails, Customer } from '../../types/management';
import { Calendar, Users, MapPin, IndianRupee, Plane, Train, Hotel, Bus, Map } from 'lucide-react';

interface BookingFormProps {
  onSubmit: (data: Partial<Booking>) => void;
  customers: Customer[];
  booking?: Booking;
  isSubmitting?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, customers, booking, isSubmitting }) => {
  const [bookingType, setBookingType] = useState(booking?.type || 'FLIGHT');
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: booking || {}
  });

  const renderTypeSpecificFields = () => {
    switch (bookingType) {
      case 'FLIGHT':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Airline</label>
                <input
                  type="text"
                  className="input"
                  {...register('details.flightDetails.airline')}
                />
              </div>
              <div>
                <label className="label">Flight Number</label>
                <input
                  type="text"
                  className="input"
                  {...register('details.flightDetails.flightNumber')}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Departure</label>
                <input
                  type="text"
                  className="input"
                  {...register('details.flightDetails.departure')}
                />
              </div>
              <div>
                <label className="label">Arrival</label>
                <input
                  type="text"
                  className="input"
                  {...register('details.flightDetails.arrival')}
                />
              </div>
            </div>
          </>
        );
      // Add similar sections for TRAIN, HOTEL, BUS, and TOUR
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="label">Booking Type</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            type="button"
            className={`p-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
              bookingType === 'FLIGHT' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}
            onClick={() => setBookingType('FLIGHT')}
          >
            <Plane className={bookingType === 'FLIGHT' ? 'text-primary-500' : 'text-gray-500'} />
            <span>Flight</span>
          </button>
          <button
            type="button"
            className={`p-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
              bookingType === 'TRAIN' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}
            onClick={() => setBookingType('TRAIN')}
          >
            <Train className={bookingType === 'TRAIN' ? 'text-primary-500' : 'text-gray-500'} />
            <span>Train</span>
          </button>
          <button
            type="button"
            className={`p-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
              bookingType === 'HOTEL' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}
            onClick={() => setBookingType('HOTEL')}
          >
            <Hotel className={bookingType === 'HOTEL' ? 'text-primary-500' : 'text-gray-500'} />
            <span>Hotel</span>
          </button>
          <button
            type="button"
            className={`p-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
              bookingType === 'BUS' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}
            onClick={() => setBookingType('BUS')}
          >
            <Bus className={bookingType === 'BUS' ? 'text-primary-500' : 'text-gray-500'} />
            <span>Bus</span>
          </button>
          <button
            type="button"
            className={`p-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
              bookingType === 'TOUR' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}
            onClick={() => setBookingType('TOUR')}
          >
            <Map className={bookingType === 'TOUR' ? 'text-primary-500' : 'text-gray-500'} />
            <span>Tour</span>
          </button>
        </div>
      </div>

      <div>
        <label className="label">Customer</label>
        <select
          className={`input ${errors.customerId ? 'border-red-500' : ''}`}
          {...register('customerId', { required: 'Please select a customer' })}
        >
          <option value="">Select Customer</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.phone})
            </option>
          ))}
        </select>
        {errors.customerId && (
          <p className="text-red-500 text-sm mt-1">{errors.customerId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label flex items-center">
            <Calendar size={16} className="mr-2" />
            Travel Date
          </label>
          <input
            type="datetime-local"
            className={`input ${errors.travelDate ? 'border-red-500' : ''}`}
            {...register('travelDate', { required: 'Travel date is required' })}
          />
          {errors.travelDate && (
            <p className="text-red-500 text-sm mt-1">{errors.travelDate.message}</p>
          )}
        </div>

        <div>
          <label className="label flex items-center">
            <IndianRupee size={16} className="mr-2" />
            Amount
          </label>
          <input
            type="number"
            className={`input ${errors.amount ? 'border-red-500' : ''}`}
            {...register('amount', { required: 'Amount is required' })}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>
      </div>

      {renderTypeSpecificFields()}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : booking ? 'Update Booking' : 'Create Booking'}
      </button>
    </form>
  );
};

export default BookingForm;