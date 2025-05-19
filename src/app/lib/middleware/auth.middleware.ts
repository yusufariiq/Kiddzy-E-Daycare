// middleware/auth.middleware.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
}

export interface AuthResult {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  role?: string;
  error?: string;
  status?: number;
}

export const verifyAuth = async (request: NextRequest): Promise<AuthResult> => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return {
        isAuthenticated: false,
        error: 'Access denied. No token provided.',
        status: 401
      };
    }
    
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    const decoded = jwt.verify(token, secret) as DecodedToken;
    
    return {
      isAuthenticated: true,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error: any) {
    
    if (error.name === 'TokenExpiredError') {
      return {
        isAuthenticated: false,
        error: 'Token expired',
        status: 401
      };
    }
    
    return {
      isAuthenticated: false,
      error: 'Invalid token.',
      status: 401
    };
  }
};

export const verifyAdmin = async (request: NextRequest): Promise<AuthResult> => {
  const authResult = await verifyAuth(request);
  
  if (!authResult.isAuthenticated) {
    return authResult;
  }
  
  if (authResult.role !== 'admin') {
    return {
      isAuthenticated: false,
      error: 'Access denied. Admin privileges required.',
      status: 403
    };
  }
  
  return authResult;
};