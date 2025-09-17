import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import KPI from '@/lib/models/KPI';
import { authenticateUser, requireRoles } from '@/lib/middleware/auth';
import { ReportGenerator, ReportData } from '@/lib/reports/generator';

export async function POST(request: NextRequest) {
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

    const { 
      reportType, 
      format, 
      filters = {},
      includeCharts = false 
    } = await request.json();

    // Build query based on filters and user role
    let query: any = { isActive: true };

    // Role-based filtering
    if (user.role === 'Manager' && user.department) {
      query.departmentId = user.department;
    }

    // Apply additional filters
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.department) query.departmentId = filters.department;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
    }

    // Fetch KPI data
    const kpis = await KPI.find(query)
      .populate('assignedTo', 'firstName lastName email')
      .populate('departmentId', 'name color')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate completion percentages
    const kpisWithCompletion = kpis.map(kpi => ({
      ...kpi,
      completionPercentage: kpi.targetValue > 0 ? Math.min((kpi.currentValue / kpi.targetValue) * 100, 100) : 0,
    }));

    // Generate summary data
    const totalKPIs = kpisWithCompletion.length;
    const completedKPIs = kpisWithCompletion.filter(kpi => kpi.status === 'Completed').length;
    const overallCompletion = totalKPIs > 0 
      ? Math.round(kpisWithCompletion.reduce((sum, kpi) => sum + kpi.completionPercentage, 0) / totalKPIs)
      : 0;

    // Department breakdown
    const departmentMap = new Map();
    kpisWithCompletion.forEach(kpi => {
      const deptName = kpi.departmentId?.name || 'No Department';
      if (!departmentMap.has(deptName)) {
        departmentMap.set(deptName, { kpis: 0, totalCompletion: 0 });
      }
      const dept = departmentMap.get(deptName);
      dept.kpis += 1;
      dept.totalCompletion += kpi.completionPercentage;
    });

    const departmentBreakdown = Array.from(departmentMap.entries()).map(([name, data]) => ({
      name,
      kpis: data.kpis,
      completion: Math.round(data.totalCompletion / data.kpis)
    }));

    // Prepare report data
    const reportData: ReportData = {
      title: getReportTitle(reportType),
      subtitle: `Generated for ${user.role}: ${user.firstName} ${user.lastName}`,
      generatedBy: `${user.firstName} ${user.lastName}`,
      generatedAt: new Date(),
      data: kpisWithCompletion,
      summary: {
        totalKPIs,
        completedKPIs,
        overallCompletion,
        departmentBreakdown
      }
    };

    // Add charts if requested
    if (includeCharts) {
      reportData.charts = [
        {
          type: 'pie',
          title: 'KPI Status Distribution',
          data: [
            { name: 'Completed', value: kpisWithCompletion.filter(k => k.status === 'Completed').length },
            { name: 'In Progress', value: kpisWithCompletion.filter(k => k.status === 'In Progress').length },
            { name: 'Overdue', value: kpisWithCompletion.filter(k => k.status === 'Overdue').length },
            { name: 'Not Started', value: kpisWithCompletion.filter(k => k.status === 'Not Started').length },
          ]
        },
        {
          type: 'bar',
          title: 'Department Performance',
          data: departmentBreakdown,
          xKey: 'name',
          yKey: 'completion'
        }
      ];
    }

    // Generate report
    const reportBlob = await ReportGenerator.generateReport(format, reportData);
    const buffer = Buffer.from(await reportBlob.arrayBuffer());

    // Set appropriate headers
    const filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    const contentType = format === 'pdf' 
      ? 'application/pdf' 
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

function getReportTitle(reportType: string): string {
  switch (reportType) {
    case 'kpi-summary':
      return 'KPI Summary Report';
    case 'department-performance':
      return 'Department Performance Report';
    case 'team-analytics':
      return 'Team Analytics Report';
    case 'trend-analysis':
      return 'Trend Analysis Report';
    default:
      return 'KPI Report';
  }
}