// src/components/public/servicios/ServiciosSearchBar.tsx
import { Search } from 'lucide-react';

interface ServiciosSearchBarProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

export function ServiciosSearchBar({ busqueda, setBusqueda }: ServiciosSearchBarProps) {
  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar servicio"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-5 pr-12 py-3.5 bg-white border-2 border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/20 transition-all duration-300 text-gray-700 placeholder-gray-400 text-base shadow-sm"
        />
        <button 
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#F59E0B] rounded-full flex items-center justify-center hover:bg-[#D97706] transition-all duration-300 cursor-pointer group shadow-md"
          onClick={() => console.log('Buscando:', busqueda)}
        >
          <Search size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}