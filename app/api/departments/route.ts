import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Department from '@/lib/models/Department';
import { authenticateUser, requireRoles } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateUser(request);
    
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    await connectDB();

    const departments = await Department.find({ isActive: true })
      .populate('managerId', 'firstName lastName email')
      .sort({ name: 1 });

    return NextResponse.json({ departments });

  } catch (error) {
    console.error('Departments fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
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

    // Only Admin can create departments
    const roleCheck = requireRoles(['Admin'])(user);
    if (!roleCheck.authorized) {
      return NextResponse.json({ error: roleCheck.error }, { status: 403 });
    }

    await connectDB();

    const departmentData = await request.json();

    const department = new Department(departmentData);
    await department.save();

    const populatedDepartment = await Department.findById(department._id)
      .populate('managerId', 'firstName lastName email');

    return NextResponse.json({
      message: 'Department created successfully',
      department: populatedDepartment,
    }, { status: 201 });

  } catch (error) {
    console.error('Department creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    );
  }
}