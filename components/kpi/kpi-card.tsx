'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { 
  Calendar, 
  User, 
  Target, 
  TrendingUp,
  Edit,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface KPICardProps {
  kpi: {
    _id: string;
    title: string;
    description?: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
    assignedTo: any;
    completionPercentage: number;
  };
  onEdit?: (kpi: any) => void;
  onDelete?: (kpi: any) => void;
  onView?: (kpi: any) => void;
}

export function KPICard({ kpi, onEdit, onDelete, onView }: KPICardProps) {
  const completionPercentage = Math.min((kpi.currentValue / kpi.targetValue) * 100, 100);
  const isOverdue = new Date(kpi.deadline) < new Date() && kpi.status !== 'Completed';

  return (
    <Card className="relative group hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {kpi.title}
            </CardTitle>
            {kpi.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {kpi.description}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(kpi)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(kpi)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(kpi)}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2 mt-3">
          <StatusBadge status={kpi.status} />
          <PriorityBadge priority={kpi.priority} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <ProgressCircle 
              progress={completionPercentage} 
              size={40} 
              strokeWidth={4}
              showPercentage={false}
            />
          </div>
          
          <Progress 
            value={completionPercentage} 
            className="h-2"
          />
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>{kpi.currentValue.toLocaleString()} {kpi.unit}</span>
            <span>Target: {kpi.targetValue.toLocaleString()} {kpi.unit}</span>
          </div>
        </div>

        {/* Meta Information */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{kpi.assignedTo?.firstName} {kpi.assignedTo?.lastName}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
              Due: {format(new Date(kpi.deadline), 'MMM dd, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>{Math.round(completionPercentage)}% Complete</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}