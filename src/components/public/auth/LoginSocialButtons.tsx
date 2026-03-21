// src/components/public/auth/LoginSocialButtons.tsx
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export function LoginSocialButtons() {
  return (
    <div className="flex gap-4">
      {/* Botón Google */}
      <button
        type="button"
        className="flex-1 group relative flex items-center justify-center gap-3 py-4 bg-white border-2 border-[#FFC300] rounded-xl hover:bg-gradient-to-r hover:from-[#FFC300] hover:to-[#FFD700] transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#FFC300]/30 hover:-translate-y-0.5 overflow-hidden"
      >
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        <FcGoogle size={24} className="group-hover:scale-110 transition-transform duration-300" />
        <span className="text-sm font-semibold text-gray-700 group-hover:text-[#0A3D62] transition-colors duration-300">
          Google
        </span>
      </button>
      
      {/* Botón Facebook */}
      <button
        type="button"
        className="flex-1 group relative flex items-center justify-center gap-3 py-4 bg-white border-2 border-[#FFC300] rounded-xl hover:bg-gradient-to-r hover:from-[#FFC300] hover:to-[#FFD700] transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#FFC300]/30 hover:-translate-y-0.5 overflow-hidden"
      >
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        <FaFacebook size={24} className="text-blue-600 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-sm font-semibold text-gray-700 group-hover:text-[#0A3D62] transition-colors duration-300">
          Facebook
        </span>
      </button>
    </div>
  );
}