import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function authenticateUser(request: NextRequest) {
  const token = extractTokenFromRequest(request);
  
  if (!token) {
    return { user: null, error: 'Authentication token required' };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { user: null, error: 'Invalid or expired token' };
  }

  try {
    await connectDB();
    const user = await User.findById(payload.userId).populate('department');
    
    if (!user || !user.isActive) {
      return { user: null, error: 'User not found or inactive' };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: 'Database error' };
  }
}

export function requireRoles(allowedRoles: string[]) {
  return (user: any) => {
    if (!user || !allowedRoles.includes(user.role)) {
      return { authorized: false, error: 'Insufficient permissions' };
    }
    return { authorized: true, error: null };
  };
}