// src/components/public/auth/LoginLayout.tsx
import React from 'react';

interface LoginLayoutProps {
  children: React.ReactNode;
}

export function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <main className="min-h-screen bg-white flex flex-col lg:flex-row">
      {children}
    </main>
  );
}