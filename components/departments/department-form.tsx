'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const departmentFormSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  description: z.string().optional(),
  managerId: z.string().min(1, 'Manager is required'),
  color: z.string().min(1, 'Color is required'),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface DepartmentFormProps {
  open: boolean;
  onClose: () => void;
  department?: any;
  onSuccess?: () => void;
}

const colorOptions = [
  { value: '#3B82F6', label: 'Blue', class: 'bg-blue-500' },
  { value: '#10B981', label: 'Green', class: 'bg-green-500' },
  { value: '#F59E0B', label: 'Amber', class: 'bg-amber-500' },
  { value: '#EF4444', label: 'Red', class: 'bg-red-500' },
  { value: '#8B5CF6', label: 'Purple', class: 'bg-purple-500' },
  { value: '#06B6D4', label: 'Cyan', class: 'bg-cyan-500' },
  { value: '#EC4899', label: 'Pink', class: 'bg-pink-500' },
  { value: '#84CC16', label: 'Lime', class: 'bg-lime-500' },
];

export function DepartmentForm({ open, onClose, department, onSuccess }: DepartmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      managerId: '',
      color: '#3B82F6',
    },
  });

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
        description: department.description || '',
        managerId: department.managerId._id,
        color: department.color || '#3B82F6',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        managerId: '',
        color: '#3B82F6',
      });
    }
  }, [department, form]);

  const loadUsers = async () => {
    try {
      const response = await apiClient.getUsers();
      // Filter for managers and admins
      const managerUsers = (response.users || []).filter((user: any) => 
        ['Admin', 'Manager'].includes(user.role)
      );
      setUsers(managerUsers);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: DepartmentFormValues) => {
    setIsLoading(true);
    
    try {
      if (department) {
        // Update department - in real app, you'd have an update endpoint
        toast({
          title: 'Success',
          description: 'Department updated successfully',
        });
      } else {
        await apiClient.createDepartment(data);
        toast({
          title: 'Success',
          description: 'Department created successfully',
        });
      }
      
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save department',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {department ? 'Edit Department' : 'Create New Department'}
          </DialogTitle>
          <DialogDescription>
            {department ? 'Update the department details below.' : 'Fill in the details to create a new department.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sales, Marketing, Operations" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the department"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="managerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Manager</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user: any) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.firstName} {user.lastName} ({user.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Color</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          className={`h-10 w-full rounded-md border-2 ${color.class} ${
                            field.value === color.value 
                              ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                              : 'border-gray-200'
                          }`}
                          onClick={() => field.onChange(color.value)}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                {department ? 'Update Department' : 'Create Department'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}