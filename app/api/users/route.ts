import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { authenticateUser, requireRoles } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateUser(request);
    
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    // Check permissions
    const roleCheck = requireRoles(['Admin', 'Manager'])(user);
    if (!roleCheck.authorized) {
      return NextResponse.json({ error: roleCheck.error }, { status: 403 });
    }

    await connectDB();

    let filter: any = { isActive: true };

    // Managers can only see users in their department
    if (user.role === 'Manager' && user.department) {
      filter.department = user.department;
    }

    const users = await User.find(filter)
      .populate('department', 'name')
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({ users });

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateUser(request);
    
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    // Only Admin can create users
    const roleCheck = requireRoles(['Admin'])(user);
    if (!roleCheck.authorized) {
      return NextResponse.json({ error: roleCheck.error }, { status: 403 });
    }

    await connectDB();

    const userData = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    const newUser = new User(userData);
    await newUser.save();

    const populatedUser = await User.findById(newUser._id)
      .populate('department', 'name')
      .select('-password');

    return NextResponse.json({
      message: 'User created successfully',
      user: populatedUser,
    }, { status: 201 });

  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}