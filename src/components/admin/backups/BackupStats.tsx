// src/components/admin/backups/BackupStats.tsx
'use client';

import { Database, HardDrive, Calendar, PieChart } from 'lucide-react';
import type { BackupStats as BackupStatsType } from '@/types/backups';

interface BackupStatsProps {
  stats: BackupStatsType;
}

export function BackupStats({ stats }: BackupStatsProps) {
  const statsCards = [
    {
      title: 'Total de Respaldo',
      value: stats.total,
      icon: Database,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Respaldo Completos',
      value: stats.completos,
      icon: Database,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Respaldo Parciales',
      value: stats.parciales,
      icon: Database,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Espacio Total',
      value: stats.espacioTotal,
      icon: HardDrive,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Último Respaldo',
      value: stats.ultimoBackup ? new Date(stats.ultimoBackup).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Sin respaldos',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Tamaño Promedio',
      value: stats.promedioTamaño,
      icon: PieChart,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 ${card.bgColor} rounded-xl`}>
                <Icon size={20} className={card.textColor} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${card.bgColor} ${card.textColor}`}>
                {card.title}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}