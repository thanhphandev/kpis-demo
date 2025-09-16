'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Save,
  Camera,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Profile settings
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    department: user?.department?.name || '',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    kpiDeadlines: true,
    kpiThresholds: true,
    teamUpdates: false,
    weeklyReports: true,
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/dd/yyyy',
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd call an API to update the profile
      updateUser(profileData);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd call an API to update notification settings
      toast({
        title: 'Success',
        description: 'Notification settings updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAppearance = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd call an API to update appearance settings
      toast({
        title: 'Success',
        description: 'Appearance settings updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update appearance settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  <Camera className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
                <p className="text-sm text-gray-600 mt-1">
                  JPG, GIF or PNG. Max size of 2MB.
                </p>
              </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    className="pl-10"
                    placeholder="+1 (555) 123-4567"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="department"
                    className="pl-10"
                    value={profileData.department}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={user?.role || ''}
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="kpiDeadlines">KPI Deadlines</Label>
                  <p className="text-sm text-gray-600">Alerts for approaching KPI deadlines</p>
                </div>
                <Switch
                  id="kpiDeadlines"
                  checked={notificationSettings.kpiDeadlines}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, kpiDeadlines: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="kpiThresholds">KPI Thresholds</Label>
                  <p className="text-sm text-gray-600">Alerts when KPIs fall below targets</p>
                </div>
                <Switch
                  id="kpiThresholds"
                  checked={notificationSettings.kpiThresholds}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, kpiThresholds: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="teamUpdates">Team Updates</Label>
                  <p className="text-sm text-gray-600">Notifications about team member activities</p>
                </div>
                <Switch
                  id="teamUpdates"
                  checked={notificationSettings.teamUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, teamUpdates: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <p className="text-sm text-gray-600">Receive weekly performance summaries</p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Save Notifications
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Appearance & Localization</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={appearanceSettings.theme} 
                  onValueChange={(value) => 
                    setAppearanceSettings(prev => ({ ...prev, theme: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={appearanceSettings.language} 
                  onValueChange={(value) => 
                    setAppearanceSettings(prev => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={appearanceSettings.timezone} 
                  onValueChange={(value) => 
                    setAppearanceSettings(prev => ({ ...prev, timezone: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="UTC+0">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select 
                  value={appearanceSettings.dateFormat} 
                  onValueChange={(value) => 
                    setAppearanceSettings(prev => ({ ...prev, dateFormat: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                    <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                    <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveAppearance} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Save Appearance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Password</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Last changed 30 days ago
                </p>
                <Button variant="outline">
                  Change Password
                </Button>
              </div>

              <Separator />

              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">
                  Enable 2FA
                </Button>
              </div>

              <Separator />

              <div>
                <Label>Active Sessions</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Manage your active sessions across devices
                </p>
                <Button variant="outline">
                  View Sessions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}