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

    // Get KPI counts by status
    const [totalKPIs, completedKPIs, inProgressKPIs, overdueKPIs, notStartedKPIs] = await Promise.all([
      KPI.countDocuments({ isActive: true }),
      KPI.countDocuments({ status: 'Completed', isActive: true }),
      KPI.countDocuments({ status: 'In Progress', isActive: true }),
      KPI.countDocuments({ status: 'Overdue', isActive: true }),
      KPI.countDocuments({ status: 'Not Started', isActive: true }),
    ]);

    // Calculate overall completion percentage
    const allKPIs = await KPI.find({ isActive: true }).select('currentValue targetValue');
    let totalProgress = 0;
    let totalTargets = 0;

    allKPIs.forEach(kpi => {
      totalProgress += kpi.currentValue;
      totalTargets += kpi.targetValue;
    });

    const overallCompletion = totalTargets > 0 ? Math.round((totalProgress / totalTargets) * 100) : 0;

    // Calculate on-track vs at-risk percentages
    const onTrackKPIs = completedKPIs + Math.floor(inProgressKPIs * 0.7); // Assume 70% of in-progress are on track
    const atRiskKPIs = overdueKPIs + Math.ceil(inProgressKPIs * 0.3); // Assume 30% of in-progress are at risk
    
    const onTrackPercentage = totalKPIs > 0 ? Math.round((onTrackKPIs / totalKPIs) * 100) : 0;
    const atRiskPercentage = totalKPIs > 0 ? Math.round((atRiskKPIs / totalKPIs) * 100) : 0;

    return NextResponse.json({
      totalKPIs,
      completedKPIs,
      inProgressKPIs,
      overdueKPIs,
      notStartedKPIs,
      overallCompletion,
      onTrackPercentage,
      atRiskPercentage,
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}