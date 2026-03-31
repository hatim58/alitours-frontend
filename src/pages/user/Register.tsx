import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle, Eye, EyeOff, CheckCircle, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToMarketing?: boolean;
}

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (value: string) => {
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 1) return '#ff4d4d';
    if (strength <= 2) return '#ffa64d';
    if (strength <= 3) return '#33cc33';
    return '#009900';
  };

  const getPasswordStrengthWidth = (strength: number) => strength * 25;

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await registerUser(data.name, data.email, data.password, data.phone);
      if (result.success) {
        navigate('/locations');
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 fade-in">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="text-center py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-2">Sign up to explore and book your next trip with Ali Tours & Travels</p>
        </div>

        {errorMessage && (
          <div className="mx-8 mt-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
            <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                type="text"
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
                {...register('name', { required: 'Full name is required' })}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                type="tel"
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Enter your phone number"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: { value: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }
                })}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block mb-2 font-medium text-gray-700">Address</label>
              <input
                id="address"
                type="text"
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 ${errors.address ? 'border-red-500' : ''}`}
                placeholder="Enter your address"
                {...register('address', { required: 'Address is required' })}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Create a strong password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  onChange: (e) => calculatePasswordStrength(e.target.value)
                })}
              />
              <button
                type="button"
                className="absolute right-4 top-11 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              <div className="h-1 mt-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${getPasswordStrengthWidth(passwordStrength)}%`,
                    backgroundColor: getPasswordStrengthColor(passwordStrength)
                  }}
                />
              </div>

              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm your password"
                {...register('confirmPassword', { required: 'Please confirm your password' })}
              />
              <button
                type="button"
                className="absolute right-4 top-11 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                {...register('agreeToTerms', { required: 'You must agree to the terms' })}
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms.message}</p>}

            <button
              type="submit"
              className="w-full bg-gray-700 text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login now</Link>
          </div>

          <div className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
            <Phone size={14} /> Need help? Call +91 78691-47222
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Why sign up?</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500" /> Save traveler profile and bookings</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500" /> Access member-only deals</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500" /> Track booking history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
