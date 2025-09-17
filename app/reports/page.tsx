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
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Calendar,
  Filter,
  Eye,
  Share,
  BarChart3,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { ReportGenerator } from '@/components/reports/report-generator';
import { PermissionGuard } from '@/components/rbac/permission-guard';
import { format } from 'date-fns';

export default function ReportsPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [reportType, setReportType] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadScheduledReports();
  }, []);

  const loadScheduledReports = async () => {
    try {
      const response = await fetch('/api/reports/schedule');
      if (response.ok) {
        const data = await response.json();
        setScheduledReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to load scheduled reports:', error);
    }
  };

  const reportTemplates = [
    {
      id: 'kpi-summary',
      title: 'KPI Summary Report',
      description: 'Comprehensive overview of all KPIs with completion rates and trends',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      lastGenerated: '2024-01-15',
      frequency: 'Weekly',
    },
    {
      id: 'department-performance',
      title: 'Department Performance',
      description: 'Performance analysis by department with comparative metrics',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      lastGenerated: '2024-01-14',
      frequency: 'Monthly',
    },
    {
      id: 'team-analytics',
      title: 'Team Analytics',
      description: 'Individual and team performance metrics with goal tracking',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      lastGenerated: '2024-01-13',
      frequency: 'Bi-weekly',
    },
    {
      id: 'trend-analysis',
      title: 'Trend Analysis',
      description: 'Historical performance trends and predictive insights',
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      lastGenerated: '2024-01-12',
      frequency: 'Monthly',
    },
  ];

  const recentReports = [
    {
      id: '1',
      title: 'Q4 2024 KPI Summary',
      type: 'KPI Summary',
      generatedBy: 'John Smith',
      generatedAt: '2024-01-15T10:30:00Z',
      status: 'Ready',
      size: '2.4 MB',
    },
    {
      id: '2',
      title: 'December Department Performance',
      type: 'Department Performance',
      generatedBy: 'Sarah Johnson',
      generatedAt: '2024-01-14T15:45:00Z',
      status: 'Ready',
      size: '1.8 MB',
    },
    {
      id: '3',
      title: 'Sales Team Analytics - Week 2',
      type: 'Team Analytics',
      generatedBy: 'Mike Davis',
      generatedAt: '2024-01-13T09:15:00Z',
      status: 'Ready',
      size: '3.1 MB',
    },
    {
      id: '4',
      title: 'Marketing Trend Analysis',
      type: 'Trend Analysis',
      generatedBy: 'Emily Brown',
      generatedAt: '2024-01-12T14:20:00Z',
      status: 'Processing',
      size: '-',
    },
  ];

  const handleGenerateReport = async (templateId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Report Generated',
        description: 'Your report has been generated successfully and is ready for download.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = (reportId: string) => {
    toast({
      title: 'Download Started',
      description: 'Your report download has started.',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'Processing':
        return <Badge className="bg-amber-100 text-amber-800">Processing</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout title="Reports">
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
              
              <PermissionGuard permission="report:create">
                <Button onClick={() => setShowReportGenerator(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </PermissionGuard>
              
              <PermissionGuard permission="report:export">
                <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
                </Button>
              </PermissionGuard>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card key={template.id} className="relative group hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${template.bgColor}`}>
                            <Icon className={`h-6 w-6 ${template.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{template.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center justify-between">
                          <span>Last Generated:</span>
                          <span>{format(new Date(template.lastGenerated), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Frequency:</span>
                          <Badge variant="outline">{template.frequency}</Badge>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1" 
                          onClick={() => handleGenerateReport(template.id)}
                          disabled={isLoading}
                        >
                          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                          <FileText className="mr-2 h-4 w-4" />
                          Generate
                        </Button>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{report.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>by {report.generatedBy}</span>
                        <span>•</span>
                        <span>{format(new Date(report.generatedAt), 'MMM dd, yyyy HH:mm')}</span>
                        {report.size !== '-' && (
                          <>
                            <span>•</span>
                            <span>{report.size}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(report.status)}
                    {report.status === 'Ready' && (
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Reports */}
        <PermissionGuard permission="report:schedule">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledReports.length > 0 ? (
                <div className="space-y-4">
                  {scheduledReports.map((report: any) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{report.reportType}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{report.frequency}</span>
                            <span>•</span>
                            <span>{report.format.toUpperCase()}</span>
                            <span>•</span>
                            <span>Next: {format(new Date(report.nextRun), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={report.isActive ? 'default' : 'secondary'}>
                          {report.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No scheduled reports</p>
                  <Button onClick={() => setShowReportGenerator(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Your First Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>

      <ReportGenerator
        open={showReportGenerator}
        onClose={() => setShowReportGenerator(false)}
        onSuccess={loadScheduledReports}
      />
    </DashboardLayout>
  );
}