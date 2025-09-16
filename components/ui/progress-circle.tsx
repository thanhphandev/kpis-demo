import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressCircle({ 
  progress, 
  size = 60, 
  strokeWidth = 6, 
  className,
  showPercentage = true 
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10B981'; // green
    if (progress >= 60) return '#F59E0B'; // amber  
    if (progress >= 40) return '#EF4444'; // red
    return '#6B7280'; // gray
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor(progress)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {showPercentage && (
        <span className="absolute text-xs font-medium text-gray-700">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}