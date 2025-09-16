'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Plus,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { apiClient } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { KPICard } from '@/components/kpi/kpi-card';
import { KPIForm } from '@/components/kpi/kpi-form';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { StatusBadge } from '@/components/ui/status-badge';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>({});
  const [recentKPIs, setRecentKPIs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showKPIForm, setShowKPIForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [dashboardResponse, kpisResponse] = await Promise.all([
        apiClient.getDashboardData(),
        apiClient.getKPIs({ limit: 6 }),
      ]);
      
      setDashboardData(dashboardResponse);
      setRecentKPIs(kpisResponse.kpis || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: 'Total KPIs',
      value: dashboardData.totalKPIs || 0,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completed',
      value: dashboardData.completedKPIs || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'In Progress',
      value: dashboardData.inProgressKPIs || 0,
      icon: BarChart3,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Overdue',
      value: dashboardData.overdueKPIs || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-blue-100">
            Here's an overview of your KPI performance and recent activities.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm text-gray-600">
                    {dashboardData.overallCompletion || 0}%
                  </span>
                </div>
                <Progress value={dashboardData.overallCompletion || 0} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <ProgressCircle 
                      progress={dashboardData.onTrackPercentage || 0} 
                      size={80}
                      className="mx-auto mb-2"
                    />
                    <p className="text-sm font-medium">On Track</p>
                  </div>
                  <div className="text-center">
                    <ProgressCircle 
                      progress={dashboardData.atRiskPercentage || 0} 
                      size={80}
                      className="mx-auto mb-2"
                    />
                    <p className="text-sm font-medium">At Risk</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setShowKPIForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New KPI
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Team Performance
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent KPIs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent KPIs</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentKPIs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentKPIs.map((kpi: any) => (
                  <KPICard 
                    key={kpi._id} 
                    kpi={kpi}
                    onEdit={() => {/* Handle edit */}}
                    onDelete={() => {/* Handle delete */}}
                    onView={() => {/* Handle view */}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No KPIs found</p>
                <Button onClick={() => setShowKPIForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First KPI
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <KPIForm
        open={showKPIForm}
        onClose={() => setShowKPIForm(false)}
        onSuccess={loadDashboardData}
      />
    </DashboardLayout>
  );
}