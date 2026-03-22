import React from 'react';
import { useForm } from 'react-hook-form';
import { Customer } from '../../types/management';
import { User, Mail, Phone, MapPin, Building } from 'lucide-react';

interface CustomerFormProps {
  onSubmit: (data: Partial<Customer>) => void;
  customer?: Customer;
  isSubmitting?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, customer, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: customer || {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="label flex items-center">
          <User size={16} className="mr-2 text-gray-500" />
          Customer Name
        </label>
        <input
          id="name"
          type="text"
          className={`input ${errors.name ? 'border-red-500' : ''}`}
          {...register('name', { required: 'Customer name is required' })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="label flex items-center">
          <Mail size={16} className="mr-2 text-gray-500" />
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className={`input ${errors.email ? 'border-red-500' : ''}`}
          {...register('email', {
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

      <div>
        <label htmlFor="phone" className="label flex items-center">
          <Phone size={16} className="mr-2 text-gray-500" />
          Phone Number
        </label>
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

      <div>
        <label htmlFor="address" className="label flex items-center">
          <MapPin size={16} className="mr-2 text-gray-500" />
          Address
        </label>
        <textarea
          id="address"
          className={`input ${errors.address ? 'border-red-500' : ''}`}
          rows={3}
          {...register('address', { required: 'Address is required' })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="gstNumber" className="label flex items-center">
          <Building size={16} className="mr-2 text-gray-500" />
          GST Number (Optional)
        </label>
        <input
          id="gstNumber"
          type="text"
          className="input"
          {...register('gstNumber')}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : customer ? 'Update Customer' : 'Add Customer'}
      </button>
    </form>
  );
};

export default CustomerForm;