import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateUser, requireRoles } from '@/lib/middleware/auth';

// In a production environment, you would use a job queue like Bull or Agenda
// For this demo, we'll create a simple scheduled report model

interface ScheduledReport {
  id: string;
  userId: string;
  reportType: string;
  format: 'pdf' | 'excel';
  frequency: 'daily' | 'weekly' | 'monthly';
  filters: any;
  recipients: string[];
  isActive: boolean;
  nextRun: Date;
  createdAt: Date;
}

// Mock scheduled reports storage (in production, use MongoDB)
const scheduledReports: ScheduledReport[] = [];

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateUser(request);
    
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const roleCheck = requireRoles(['Admin', 'Manager'])(user);
    if (!roleCheck.authorized) {
      return NextResponse.json({ error: roleCheck.error }, { status: 403 });
    }

    // Filter reports by user role
    let userReports = scheduledReports.filter(report => {
      if (user.role === 'Admin') return true;
      return report.userId === user.id;
    });

    return NextResponse.json({ reports: userReports });

  } catch (error) {
    console.error('Scheduled reports fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled reports' },
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

    const roleCheck = requireRoles(['Admin', 'Manager'])(user);
    if (!roleCheck.authorized) {
      return NextResponse.json({ error: roleCheck.error }, { status: 403 });
    }

    const {
      reportType,
      format,
      frequency,
      filters = {},
      recipients = []
    } = await request.json();

    // Calculate next run date
    const nextRun = calculateNextRun(frequency);

    const scheduledReport: ScheduledReport = {
      id: `report_${Date.now()}`,
      userId: user.id,
      reportType,
      format,
      frequency,
      filters,
      recipients,
      isActive: true,
      nextRun,
      createdAt: new Date()
    };

    scheduledReports.push(scheduledReport);

    return NextResponse.json({
      message: 'Report scheduled successfully',
      report: scheduledReport
    }, { status: 201 });

  } catch (error) {
    console.error('Report scheduling error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule report' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, error } = await authenticateUser(request);
    
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('id');

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    const reportIndex = scheduledReports.findIndex(report => {
      if (user.role === 'Admin') return report.id === reportId;
      return report.id === reportId && report.userId === user.id;
    });

    if (reportIndex === -1) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    scheduledReports.splice(reportIndex, 1);

    return NextResponse.json({ message: 'Scheduled report deleted successfully' });

  } catch (error) {
    console.error('Report deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete scheduled report' },
      { status: 500 }
    );
  }
}

function calculateNextRun(frequency: string): Date {
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'monthly':
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
}