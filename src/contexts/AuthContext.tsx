import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '../types';
import { safeJsonParse, safeSetLocalStorage } from '../utils/asyncHandler';

interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; requires2FA?: boolean; userId?: number }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (userId: number, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ success: false, message: 'Not implemented' }),
  register: async () => ({ success: false, message: 'Not implemented' }),
  verifyOtp: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {},
});

// Customer database to track all registrations
let customerDatabase: Array<{
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  role: 'user' | 'admin';
  totalBookings: number;
  totalSpent: number;
  lastBooking: string | null;
  status: 'active' | 'inactive';
  address?: string;
  gstNumber?: string;
  notes?: string;
}> = [];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const API_URL = import.meta.env.VITE_API_URL || '';

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = safeJsonParse<UserType | null>(storedUser, null);
      if (parsedUser) {
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = { message: 'Failed to parse response from server' };
      }

      if (response.ok) {
        if (data.requires2FA) {
          return {
            success: true,
            message: data.message,
            requires2FA: true,
            userId: data.userId
          };
        }

        const userData: UserType = {
          id: data._id.toString(),
          name: data.name,
          email: data.email,
          role: data.role.toLowerCase() as 'user' | 'admin',
          token: data.token
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        safeSetLocalStorage('user', userData);
        if (userData.token) {
          localStorage.setItem('token', userData.token); // Dedicated token storage
        }
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: data.message || 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server error. Please try again.' };
    }
  };

  const verifyOtp = async (userId: number, otp: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = { message: 'Failed to parse response from server' };
      }

      if (response.ok) {
        const userData: UserType = {
          id: data._id.toString(),
          name: data.name,
          email: data.email,
          role: data.role.toLowerCase() as 'user' | 'admin',
          token: data.token
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        safeSetLocalStorage('user', userData);
        if (userData.token) {
          localStorage.setItem('token', userData.token); // Dedicated token storage
        }
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: data.message || 'Invalid or expired OTP' };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, message: 'Server error. Please try again.' };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role: 'USER' }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = { message: 'Failed to parse response from server' };
      }

      if (response.ok) {
        const userData: UserType = {
          id: data._id.toString(),
          name: data.name,
          email: data.email,
          role: data.role.toLowerCase(),
          token: data.token
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        safeSetLocalStorage('user', userData);
        if (userData.token) {
          localStorage.setItem('token', userData.token); // Dedicated token storage
        }
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Server error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, verifyOtp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Export customer database for admin access
export const getCustomerDatabase = () => customerDatabase;