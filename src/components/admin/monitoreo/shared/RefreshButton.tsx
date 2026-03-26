// src/components/admin/monitoreo/shared/RefreshButton.tsx
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => void;
  loading: boolean;
}

export function RefreshButton({ onRefresh, loading }: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-[#0A3D62] text-white rounded-xl hover:bg-[#1A4F7A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
      <span className="text-sm font-medium">Actualizar</span>
    </button>
  );
}