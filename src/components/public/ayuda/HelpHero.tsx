// src/components/public/ayuda/HelpHero.tsx
"use client";

import SearchBar from "./SearchBar";

interface HelpHeroProps {
  onSearch: (query: string) => void;
}

export default function HelpHero({ onSearch }: HelpHeroProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Centro de Ayuda
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            Encuentra respuestas a tus preguntas frecuentes
          </p>
          <div className="mt-8 max-w-2xl mx-auto">
            <SearchBar
              placeholder="¿En qué podemos ayudarte?"
              onSearch={onSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}