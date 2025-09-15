import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  academicLevel: string;
  coins: number;
  language: 'en' | 'ar';
  isProfileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (userData: Partial<User>) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  updateCoins: (coins: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data for demo
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        phone: '+96512345678',
        academicLevel: 'High School',
        coins: 100,
        language: 'en',
        isProfileComplete: true,
      };

      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signUp = async (userData: Partial<User>): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        academicLevel: userData.academicLevel || '',
        coins: 50, // Starting coins
        language: userData.language || 'en',
        isProfileComplete: false,
      };

      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const updateCoins = async (coins: number): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, coins };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update coins error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signUp,
    logout,
    updateProfile,
    updateCoins,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
