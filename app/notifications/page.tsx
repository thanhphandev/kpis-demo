'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Target,
  Calendar,
  User,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/lib/store/auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      // Mock notifications data
      const mockNotifications = [
        {
          id: '1',
          type: 'KPI_OVERDUE',
          title: 'KPI Overdue',
          message: 'Monthly Revenue Target is now overdue. Current progress: 75%',
          isRead: false,
          priority: 'High',
          createdAt: '2024-01-15T10:30:00Z',
          relatedKPI: {
            id: 'kpi1',
            title: 'Monthly Revenue Target'
          }
        },
        {
          id: '2',
          type: 'KPI_THRESHOLD',
          title: 'KPI Below Target',
          message: 'Customer Satisfaction Score has dropped below 85%. Current: 82%',
          isRead: false,
          priority: 'Medium',
          createdAt: '2024-01-15T09:15:00Z',
          relatedKPI: {
            id: 'kpi2',
            title: 'Customer Satisfaction Score'
          }
        },
        {
          id: '3',
          type: 'KPI_COMPLETED',
          title: 'KPI Completed',
          message: 'Sales Conversion Rate target has been achieved! Great work!',
          isRead: true,
          priority: 'Low',
          createdAt: '2024-01-14T16:45:00Z',
          relatedKPI: {
            id: 'kpi3',
            title: 'Sales Conversion Rate'
          }
        },
        {
          id: '4',
          type: 'ASSIGNMENT',
          title: 'New KPI Assignment',
          message: 'You have been assigned a new KPI: Website Traffic Growth',
          isRead: false,
          priority: 'Medium',
          createdAt: '2024-01-14T14:20:00Z',
          relatedKPI: {
            id: 'kpi4',
            title: 'Website Traffic Growth'
          }
        },
        {
          id: '5',
          type: 'SYSTEM',
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur on January 20th from 2-4 AM EST',
          isRead: true,
          priority: 'Low',
          createdAt: '2024-01-13T11:00:00Z',
        },
      ];
      
      setNotifications(mockNotifications);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map((notif: any) => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      
      toast({
        title: 'Success',
        description: 'Notification marked as read',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map((notif: any) => ({ ...notif, isRead: true }))
      );
      
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.filter((notif: any) => notif.id !== notificationId)
      );
      
      toast({
        title: 'Success',
        description: 'Notification deleted',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'KPI_OVERDUE':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'KPI_THRESHOLD':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'KPI_COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'ASSIGNMENT':
        return <Target className="h-5 w-5 text-blue-600" />;
      case 'SYSTEM':
        return <Info className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const filteredNotifications = notifications.filter((notif: any) => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((notif: any) => !notif.isRead).length;

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-100 text-red-800">
                      {unreadCount} unread
                    </Badge>
                  )}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
                {unreadCount > 0 && (
                  <Button variant="outline" onClick={handleMarkAllAsRead}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification: any) => (
                  <div 
                    key={notification.id} 
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                            </span>
                            {notification.relatedKPI && (
                              <span className="flex items-center space-x-1">
                                <Target className="h-3 w-3" />
                                <span>{notification.relatedKPI.title}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {getPriorityBadge(notification.priority)}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.isRead && (
                              <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Mark as Read
                              </DropdownMenuItem>
                            )}
                            {notification.relatedKPI && (
                              <DropdownMenuItem>
                                <Target className="mr-2 h-4 w-4" />
                                View KPI
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {filter === 'unread' 
                    ? 'No unread notifications' 
                    : filter === 'read' 
                    ? 'No read notifications'
                    : 'No notifications found'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}