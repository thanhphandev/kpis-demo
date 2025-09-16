'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Target,
  Calendar,
  User,
  Building2
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { apiClient } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { KPICard } from '@/components/kpi/kpi-card';
import { KPIForm } from '@/components/kpi/kpi-form';
import { useToast } from '@/hooks/use-toast';

export default function KPIsPage() {
  const { user } = useAuthStore();
  const [kpis, setKPIs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showKPIForm, setShowKPIForm] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadKPIs();
  }, [statusFilter, priorityFilter, pagination.currentPage]);

  const loadKPIs = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: pagination.currentPage,
        limit: 12,
      };
      
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      
      const response = await apiClient.getKPIs(params);
      setKPIs(response.kpis || []);
      setPagination(response.pagination || pagination);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load KPIs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditKPI = (kpi: any) => {
    setSelectedKPI(kpi);
    setShowKPIForm(true);
  };

  const handleDeleteKPI = async (kpi: any) => {
    if (!confirm('Are you sure you want to delete this KPI?')) return;
    
    try {
      await apiClient.deleteKPI(kpi._id);
      toast({
        title: 'Success',
        description: 'KPI deleted successfully',
      });
      loadKPIs();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete KPI',
        variant: 'destructive',
      });
    }
  };

  const handleFormClose = () => {
    setShowKPIForm(false);
    setSelectedKPI(null);
  };

  const filteredKPIs = kpis.filter((kpi: any) =>
    kpi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kpi.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: 'Total KPIs',
      value: pagination.totalCount,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completed',
      value: kpis.filter((kpi: any) => kpi.status === 'Completed').length,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'In Progress',
      value: kpis.filter((kpi: any) => kpi.status === 'In Progress').length,
      icon: Target,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Overdue',
      value: kpis.filter((kpi: any) => kpi.status === 'Overdue').length,
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <DashboardLayout title="KPIs">
      <div className="space-y-6">
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

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>KPI Management</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                {['Admin', 'Manager'].includes(user?.role || '') && (
                  <Button onClick={() => setShowKPIForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create KPI
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search KPIs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priority</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredKPIs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredKPIs.map((kpi: any) => (
                    <KPICard
                      key={kpi._id}
                      kpi={kpi}
                      onEdit={handleEditKPI}
                      onDelete={handleDeleteKPI}
                      onView={() => {/* Handle view */}}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600">
                      Showing {((pagination.currentPage - 1) * 12) + 1} to{' '}
                      {Math.min(pagination.currentPage * 12, pagination.totalCount)} of{' '}
                      {pagination.totalCount} results
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasPrev}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasNext}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter || priorityFilter
                    ? 'No KPIs match your filters'
                    : 'No KPIs found'
                  }
                </p>
                {['Admin', 'Manager'].includes(user?.role || '') && (
                  <Button onClick={() => setShowKPIForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First KPI
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <KPIForm
        open={showKPIForm}
        onClose={handleFormClose}
        kpi={selectedKPI}
        onSuccess={loadKPIs}
      />
    </DashboardLayout>
  );
}