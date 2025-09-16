import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    'Not Started': {
      variant: 'secondary' as const,
      className: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    'In Progress': {
      variant: 'default' as const,
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    },
    'Completed': {
      variant: 'default' as const,
      className: 'bg-green-100 text-green-700 hover:bg-green-200',
    },
    'Overdue': {
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-700 hover:bg-red-200',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {status}
    </Badge>
  );
}