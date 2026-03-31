import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [tempUserId, setTempUserId] = useState<number | null>(null);

  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleRedirect = () => {
    if (from && from !== '/') {
      navigate(from);
    } else {
      const stored = localStorage.getItem('user');
      const userData = stored ? JSON.parse(stored) : null;
      if (userData?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/locations');
      }
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        if (result.requires2FA) {
          setRequiresOtp(true);
          setTempUserId(result.userId || null);
          return;
        }
        handleRedirect();
      } else {
        setLoginError(result.message);
      }
    } catch {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUserId || !otpValue) return;

    setIsSubmitting(true);
    setLoginError(null);

    try {
      const result = await verifyOtp(tempUserId, otpValue);
      if (result.success) {
        handleRedirect();
      } else {
        setLoginError(result.message);
      }
    } catch {
      setLoginError('OTP verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 fade-in">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="text-center py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Ali Tours & Travels</h1>
          <p className="text-gray-600 mt-2">Login or register to access exclusive travel deals</p>
        </div>

        {loginError && (
          <div className="mx-6 mt-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{loginError}</span>
          </div>
        )}

        <div className="p-8">
          {requiresOtp ? (
            <form onSubmit={onOtpSubmit} className="space-y-4">
              <div className="text-sm text-gray-700">Enter the 6-digit code sent to your email.</div>
              <input
                id="otp"
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-center text-xl tracking-widest"
                placeholder="000000"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                disabled={isSubmitting || otpValue.length !== 6}
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button
                type="button"
                className="w-full text-gray-500 text-sm hover:underline"
                onClick={() => { setRequiresOtp(false); setOtpValue(''); }}
              >
                Back to login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-gray-500`}
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                  })}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-gray-500 pr-10`}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('rememberMe')} />
                  Remember me
                </label>
                <Link to="/password-reset" className="text-blue-600 hover:underline">Forgot Password?</Link>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Login'}
              </button>

              <div className="text-center text-sm text-gray-600">
                New here? <Link to="/register" className="text-blue-600 hover:underline">Create an account</Link>
              </div>
            </form>
          )}

          <div className="mt-6 border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
            <Phone size={12} className="inline-block mr-1" /> Need help? Call +91 78691-47222
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
