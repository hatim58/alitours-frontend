import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '../types';
import { safeJsonParse, safeSetLocalStorage } from '../utils/asyncHandler';

interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ success: false, message: 'Not implemented' }),
  register: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {},
});

// Sample user data (in a real app, this would come from a backend)
const sampleUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'info@alitourstravels.in',
    password: 'Yaalimadad@53',
    phone: '+91 9876543210',
    role: 'admin' as const,
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
    phone: '+91 9876543211',
    role: 'user' as const,
  },
];

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
}> = [
  {
    id: 'CUST001',
    name: 'Test User',
    email: 'user@example.com',
    phone: '+91 9876543211',
    registrationDate: '2024-01-15',
    role: 'user',
    totalBookings: 2,
    totalSpent: 75000,
    lastBooking: '2024-03-20',
    status: 'active',
    address: '123 Test Street, Test City, 123456',
    notes: 'Demo customer account'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
    // In a real app, this would be an API call
    const foundUser = sampleUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData: UserType = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        role: foundUser.role,
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      safeSetLocalStorage('user', userData);

      return { success: true, message: 'Login successful' };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const register = async (name: string, email: string, password: string, phone?: string, address?: string) => {
    // Check if user already exists
    const userExists = sampleUsers.some(u => u.email === email);

    if (userExists) {
      return { success: false, message: 'Email already in use' };
    }

    // Generate customer ID
    const customerId = `CUST${String(customerDatabase.length + 1).padStart(3, '0')}`;

    // In a real app, this would create a new user in the database
    const newUser: UserType = {
      id: customerId,
      name,
      email,
      phone,
      role: 'user'
    };

    // Add to our sample users (in memory only - this won't persist on page refresh in this demo)
    sampleUsers.push({...newUser, password});

    // Add to customer database for admin tracking
    customerDatabase.push({
      id: customerId,
      name,
      email,
      phone: phone || '',
      address: address || '',
      registrationDate: new Date().toISOString().split('T')[0],
      role: 'user',
      totalBookings: 0,
      totalSpent: 0,
      lastBooking: null,
      status: 'active',
      notes: 'New customer registration'
    });
    
    // Log the user in
    setUser(newUser);
    setIsAuthenticated(true);
    safeSetLocalStorage('user', newUser);

    return { success: true, message: 'Registration successful' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Export customer database for admin access
export const getCustomerDatabase = () => customerDatabase;