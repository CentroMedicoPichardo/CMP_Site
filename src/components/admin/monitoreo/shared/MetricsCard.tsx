// src/components/admin/monitoreo/shared/MetricsCard.tsx
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  status?: 'good' | 'warning' | 'critical';
  description?: string;
  trend?: { value: number; direction: 'up' | 'down' };
}

export function MetricsCard({ title, value, icon: Icon, status = 'good', description, trend }: MetricsCardProps) {
  const statusColors = {
    good: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    critical: 'text-red-600 bg-red-50'
  };

  const statusBorder = {
    good: 'border-green-200',
    warning: 'border-yellow-200',
    critical: 'border-red-200'
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${statusBorder[status]} hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${statusColors[status]}`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-xs">
          <span className={trend.direction === 'up' ? 'text-red-500' : 'text-green-500'}>
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-gray-400">vs hora anterior</span>
        </div>
      )}
    </div>
  );
}