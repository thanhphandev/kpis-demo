'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { apiClient } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>({});
  const [timeRange, setTimeRange] = useState('30d');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, departmentFilter]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      // Mock analytics data - in real app, this would come from API
      const mockData = {
        overview: {
          totalKPIs: 45,
          completedKPIs: 28,
          averageCompletion: 78,
          onTrackKPIs: 32,
          trend: 12.5
        },
        performanceByDepartment: [
          { name: 'Sales', completed: 12, total: 18, percentage: 67 },
          { name: 'Marketing', completed: 8, total: 12, percentage: 67 },
          { name: 'Operations', completed: 8, total: 15, percentage: 53 },
        ],
        completionTrend: [
          { month: 'Jan', completed: 65, target: 70 },
          { month: 'Feb', completed: 72, target: 75 },
          { month: 'Mar', completed: 68, target: 80 },
          { month: 'Apr', completed: 78, target: 85 },
          { month: 'May', completed: 82, target: 85 },
          { month: 'Jun', completed: 85, target: 90 },
        ],
        statusDistribution: [
          { name: 'Completed', value: 28, color: '#10B981' },
          { name: 'In Progress', value: 12, color: '#F59E0B' },
          { name: 'Overdue', value: 3, color: '#EF4444' },
          { name: 'Not Started', value: 2, color: '#6B7280' },
        ],
        priorityBreakdown: [
          { priority: 'Critical', count: 8, completed: 6 },
          { priority: 'High', count: 15, completed: 12 },
          { priority: 'Medium', count: 18, completed: 8 },
          { priority: 'Low', count: 4, completed: 2 },
        ],
        topPerformers: [
          { name: 'Sarah Johnson', department: 'Sales', completion: 95, kpis: 8 },
          { name: 'Mike Davis', department: 'Marketing', completion: 88, kpis: 6 },
          { name: 'Emily Brown', department: 'Operations', completion: 82, kpis: 7 },
        ]
      };
      
      setAnalyticsData(mockData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const { overview, performanceByDepartment, completionTrend, statusDistribution, priorityBreakdown, topPerformers } = analyticsData;

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total KPIs</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.totalKPIs}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.completedKPIs}</p>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg. Completion</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.averageCompletion}%</p>
                </div>
                <div className="flex items-center text-amber-600">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">On Track</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.onTrackKPIs}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{overview.trend}% from last month
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Completion Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={completionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.1}
                    name="Completed %" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.1}
                    name="Target %" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>KPI Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#10B981" name="Completed" />
                  <Bar dataKey="total" fill="#E5E7EB" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Priority Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>KPIs by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityBreakdown} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="priority" type="category" />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#3B82F6" name="Completed" />
                  <Bar dataKey="count" fill="#E5E7EB" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {performer.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{performer.name}</p>
                      <p className="text-sm text-gray-600">{performer.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{performer.completion}%</p>
                    <p className="text-sm text-gray-600">{performer.kpis} KPIs</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}