import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import KPI from '@/lib/models/KPI';
import { authenticateUser } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateUser(request);
    
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const department = searchParams.get('department');

    // Build filter based on user role
    let filter: any = { isActive: true };

    // Role-based filtering
    if (user.role === 'Staff') {
      filter.assignedTo = user.id;
    } else if (user.role === 'Manager' && user.department) {
      filter.departmentId = user.department;
    }

    // Additional filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (department) filter.departmentId = department;

    const skip = (page - 1) * limit;

    const [kpis, totalCount] = await Promise.all([
      KPI.find(filter)
        .populate('assignedTo', 'firstName lastName email')
        .populate('departmentId', 'name color')
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      KPI.countDocuments(filter),
    ]);

    // Calculate completion percentage for each KPI
    const kpisWithCompletion = kpis.map(kpi => ({
      ...kpi,
      completionPercentage: kpi.targetValue > 0 ? Math.min((kpi.currentValue / kpi.targetValue) * 100, 100) : 0,
    }));

    return NextResponse.json({
      kpis: kpisWithCompletion,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('KPIs fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KPIs' },
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

    // Only Admin and Manager can create KPIs
    if (!['Admin', 'Manager'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();

    const kpiData = await request.json();

    const kpi = new KPI({
      ...kpiData,
      createdBy: user.id,
    });

    await kpi.save();

    const populatedKPI = await KPI.findById(kpi._id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('departmentId', 'name color')
      .populate('createdBy', 'firstName lastName');

    return NextResponse.json({
      message: 'KPI created successfully',
      kpi: populatedKPI,
    }, { status: 201 });

  } catch (error) {
    console.error('KPI creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create KPI' },
      { status: 500 }
    );
  }
}