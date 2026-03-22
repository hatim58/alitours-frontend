import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, AlertCircle } from 'lucide-react';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setUpdateMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUpdateMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
    } catch (error) {
      setUpdateMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 fade-in">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {updateMessage && (
                <div className={`mb-6 p-4 rounded-lg flex items-start ${
                  updateMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <p>{updateMessage.text}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="label">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      id="name"
                      type="text"
                      className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                      defaultValue={user?.name}
                      {...register('name', { required: 'Name is required' })}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="label">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      className="input pl-10"
                      defaultValue={user?.email}
                      disabled
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="label">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      className={`input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      defaultValue={user?.phone}
                      {...register('phone', {
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit phone number'
                        }
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <hr className="my-8" />

                <h3 className="text-lg font-semibold mb-4">Change Password</h3>

                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="label">Current Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      id="currentPassword"
                      type="password"
                      className={`input pl-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
                      {...register('currentPassword')}
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="label">New Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      className={`input pl-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                      {...register('newPassword', {
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      className={`input pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      {...register('confirmPassword', {
                        validate: value =>
                          !watch('newPassword') || value === watch('newPassword') || 'Passwords do not match'
                      })}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;