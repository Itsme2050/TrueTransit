import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('truetransit_token'));

  useEffect(() => {
    const savedUser = localStorage.getItem('truetransit_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('truetransit_user');
      }
    } else if (!token) {
      // Default to guest session for immediate hackathon demonstration
      loginAsGuest();
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('truetransit_token', newToken);
    localStorage.setItem('truetransit_user', JSON.stringify(newUser));
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest-session',
      email: 'guest@truetransit.local',
      fullName: 'Visiting Traveler',
      role: 'USER',
      preferredLanguage: 'en',
    };
    const guestToken = 'guest_jwt_token_demo';
    setToken(guestToken);
    setUser(guestUser);
    localStorage.setItem('truetransit_token', guestToken);
    localStorage.setItem('truetransit_user', JSON.stringify(guestUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('truetransit_token');
    localStorage.removeItem('truetransit_user');
    loginAsGuest();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isGuest: user?.id === 'guest-session',
        isAdmin: user?.role === 'ADMIN' || user?.role === 'MODERATOR',
        login,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
