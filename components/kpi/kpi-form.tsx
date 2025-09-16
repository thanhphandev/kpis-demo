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

const kpiFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  targetValue: z.number().min(0, 'Target value must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  assignedTo: z.string().min(1, 'Assignee is required'),
  departmentId: z.string().min(1, 'Department is required'),
  category: z.string().optional(),
});

type KPIFormValues = z.infer<typeof kpiFormSchema>;

interface KPIFormProps {
  open: boolean;
  onClose: () => void;
  kpi?: any;
  onSuccess?: () => void;
}

export function KPIForm({ open, onClose, kpi, onSuccess }: KPIFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const { toast } = useToast();

  const form = useForm<KPIFormValues>({
    resolver: zodResolver(kpiFormSchema),
    defaultValues: {
      title: '',
      description: '',
      targetValue: 0,
      unit: '',
      deadline: '',
      priority: 'Medium',
      assignedTo: '',
      departmentId: '',
      category: '',
    },
  });

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  useEffect(() => {
    if (kpi) {
      form.reset({
        title: kpi.title,
        description: kpi.description || '',
        targetValue: kpi.targetValue,
        unit: kpi.unit,
        deadline: kpi.deadline.split('T')[0],
        priority: kpi.priority,
        assignedTo: kpi.assignedTo._id,
        departmentId: kpi.departmentId._id,
        category: kpi.category || '',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        targetValue: 0,
        unit: '',
        deadline: '',
        priority: 'Medium',
        assignedTo: '',
        departmentId: '',
        category: '',
      });
    }
  }, [kpi, form]);

  const loadData = async () => {
    try {
      const [usersData, departmentsData] = await Promise.all([
        apiClient.getUsers(),
        apiClient.getDepartments(),
      ]);
      setUsers(usersData.users || []);
      setDepartments(departmentsData.departments || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load form data',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: KPIFormValues) => {
    setIsLoading(true);
    
    try {
      if (kpi) {
        await apiClient.updateKPI(kpi._id, data);
        toast({
          title: 'Success',
          description: 'KPI updated successfully',
        });
      } else {
        await apiClient.createKPI(data);
        toast({
          title: 'Success',
          description: 'KPI created successfully',
        });
      }
      
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save KPI',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {kpi ? 'Edit KPI' : 'Create New KPI'}
          </DialogTitle>
          <DialogDescription>
            {kpi ? 'Update the KPI details below.' : 'Fill in the details to create a new KPI.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter KPI title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter KPI description" 
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
                name="targetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., %, $, units" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user: any) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.firstName} {user.lastName}
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
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept: any) => (
                          <SelectItem key={dept._id} value={dept._id}>
                            {dept.name}
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
                name="category"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Category (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sales, Marketing, Operations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                {kpi ? 'Update KPI' : 'Create KPI'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}