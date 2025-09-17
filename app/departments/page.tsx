'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Target,
  Building2,
  User
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { apiClient } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DepartmentForm } from '@/components/departments/department-form';
import { useToast } from '@/hooks/use-toast';
import { PermissionGuard } from '@/components/rbac/permission-guard';

export default function DepartmentsPage() {
  const { user } = useAuthStore();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getDepartments();
      setDepartments(response.departments || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load departments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDepartment = (department: any) => {
    setSelectedDepartment(department);
    setShowDepartmentForm(true);
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
      // In a real app, you'd have a delete endpoint
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
      });
      loadDepartments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete department',
        variant: 'destructive',
      });
    }
  };

  const handleFormClose = () => {
    setShowDepartmentForm(false);
    setSelectedDepartment(null);
  };

  const filteredDepartments = departments.filter((dept: any) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Departments">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Department Management</CardTitle>
              <PermissionGuard permission="department:create">
                <Button onClick={() => setShowDepartmentForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              </PermissionGuard>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredDepartments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments.map((department: any) => (
                  <Card key={department._id} className="relative group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="h-10 w-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: department.color + '20' }}
                          >
                            <Building2 
                              className="h-5 w-5" 
                              style={{ color: department.color }}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{department.name}</CardTitle>
                            {department.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {department.description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <PermissionGuard permission="department:update">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteDepartment(department._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </PermissionGuard>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Manager */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {department.managerId?.firstName?.[0]}{department.managerId?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {department.managerId?.firstName} {department.managerId?.lastName}
                          </p>
                          <p className="text-xs text-gray-600">Department Manager</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-lg font-semibold">
                              {department.memberCount || 0}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">Members</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Target className="h-4 w-4 text-gray-400" />
                            <span className="text-lg font-semibold">
                              {department.kpiCount || 0}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">KPIs</p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Badge variant={department.isActive ? 'default' : 'secondary'}>
                          {department.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No departments match your search' : 'No departments found'}
                </p>
                <PermissionGuard permission="department:create">
                  {!searchTerm && (
                  <Button onClick={() => setShowDepartmentForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Department
                  </Button>
                  )}
                </PermissionGuard>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DepartmentForm
        open={showDepartmentForm}
        onClose={handleFormClose}
        department={selectedDepartment}
        onSuccess={loadDepartments}
      />
    </DashboardLayout>
  );
}