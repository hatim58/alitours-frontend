import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, AlertCircle, Phone, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

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

const Login: React.FC = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { register: registerFieldSignup, handleSubmit: handleSubmitSignup, watch, formState: { errors: signupErrors } } = useForm<RegisterFormData>();
  
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';
  const password = watch('password');

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        navigate(from === '/' ? '/dashboard' : from);
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      const result = await registerUser(
        data.name, 
        data.email, 
        data.password, 
        data.phone, 
        data.address
      );
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 1) return '#ff4d4d';
    if (strength <= 2) return '#ffa64d';
    if (strength <= 3) return '#33cc33';
    return '#009900';
  };

  const getPasswordStrengthWidth = (strength: number) => {
    return strength * 25;
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 fade-in">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="text-center py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Ali Tours & Travels</h1>
          <p className="text-gray-600 mt-2">Login or create an account to access exclusive travel deals</p>
        </div>

        {/* Error Message */}
        {loginError && (
          <div className="mx-8 mt-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
            <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{loginError}</p>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Login Section */}
          <div className="flex-1 p-8 border-r border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Login to Your Account</h2>
            
            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block mb-2 font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                  {...registerField('email', { 
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
              
              <div className="relative">
                <label htmlFor="login-password" className="block mb-2 font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                  {...registerField('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-4 top-11 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    {...registerField('rememberMe')}
                  />
                  <span className="text-sm">Remember me</span>
                </label>
                <Link to="/password-reset" className="text-blue-600 hover:underline text-sm">
                  Forgot Password?
                </Link>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Login'}
              </button>
            </form>
            
            <div className="relative text-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative bg-white px-4">
                <span className="text-gray-500 text-sm">Or login with</span>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Signup Section */}
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-semibold mb-6">Create New Account</h2>
            
            <form onSubmit={handleSubmitSignup(onSignupSubmit)} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block mb-2 font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 ${signupErrors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                  {...registerFieldSignup('name', { required: 'Full name is required' })}
                />
                {signupErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{signupErrors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="signup-email" className="block mb-2 font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 ${signupErrors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                  {...registerFieldSignup('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {signupErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{signupErrors.email.message}</p>
                )}
              </div>
              
              <div className="relative">
                <label htmlFor="signup-password" className="block mb-2 font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="signup-password"
                  type={showSignupPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 pr-12 ${signupErrors.password ? 'border-red-500' : ''}`}
                  placeholder="Create a strong password"
                  {...registerFieldSignup('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    },
                    onChange: (e) => {
                      const strength = calculatePasswordStrength(e.target.value);
                      setPasswordStrength(strength);
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-4 top-11 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                
                {/* Password Strength Indicator */}
                <div className="h-1 mt-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${getPasswordStrengthWidth(passwordStrength)}%`,
                      backgroundColor: getPasswordStrengthColor(passwordStrength)
                    }}
                  />
                </div>
                
                {signupErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{signupErrors.password.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="signup-phone" className="block mb-2 font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="signup-phone"
                  type="tel"
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 ${signupErrors.phone ? 'border-red-500' : ''}`}
                  placeholder="Enter your phone number"
                  {...registerFieldSignup('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                />
                {signupErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{signupErrors.phone.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="signup-address" className="block mb-2 font-medium text-gray-700">
                  Address
                </label>
                <input
                  id="signup-address"
                  type="text"
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 ${signupErrors.address ? 'border-red-500' : ''}`}
                  placeholder="Enter your address"
                  {...registerFieldSignup('address', { required: 'Address is required' })}
                />
                {signupErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{signupErrors.address.message}</p>
                )}
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newsletter"
                  className="mr-2"
                  {...registerFieldSignup('agreeToMarketing')}
                />
                <label htmlFor="newsletter" className="text-sm text-gray-700">
                  Subscribe to travel deals newsletter
                </label>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 mr-2"
                  {...registerFieldSignup('agreeToTerms', { required: 'You must agree to the terms' })}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms-of-service" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {signupErrors.agreeToTerms && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.agreeToTerms.message}</p>
              )}
              
              <button 
                type="submit" 
                className="w-full bg-gray-700 text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="text-center text-sm text-gray-600 mt-4">
              By creating an account, you agree to our{' '}
              <Link to="/terms-of-service" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </div>
            
            {/* Benefits Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Create an account to:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-sm">Save your travel preferences</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-sm">Access exclusive member-only deals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-sm">Track your booking history</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-sm">Get personalized travel recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Demo Credentials */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2 font-medium">Demo Credentials for Testing:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div>
                <span className="font-medium">Admin:</span> info@alitourstravels.in / Yaalimadad@53
              </div>
              <div>
                <span className="font-medium">User:</span> user@example.com / password123
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-300">
              <div className="flex items-center justify-center text-xs text-gray-400">
                <Phone size={12} className="mr-1" />
                <span>Need help? Call +91 78691-47222</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;