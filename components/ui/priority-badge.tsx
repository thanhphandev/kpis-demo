import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const priorityConfig = {
    'Low': {
      className: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    },
    'Medium': {
      className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    },
    'High': {
      className: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    },
    'Critical': {
      className: 'bg-red-100 text-red-700 hover:bg-red-200',
    },
  };

  const config = priorityConfig[priority];

  return (
    <Badge className={cn(config.className, className)}>
      {priority}
    </Badge>
  );
}