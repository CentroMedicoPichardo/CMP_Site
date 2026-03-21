// src/lib/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface User {
  id: string | number;
  email: string;
  nombre: string;
  rol: string;
}

export interface Session {
  user: User;
}

export async function auth(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user')?.value;
    
    if (!userCookie) {
      console.log('No user cookie found');
      return null;
    }
    
    const user = JSON.parse(userCookie);
    console.log('User from cookie:', user); // Para depurar
    
    return { user };
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return null;
  }
}

export async function requireAuth(redirectTo: string = '/login') {
  const session = await auth();
  
  if (!session) {
    redirect(redirectTo);
  }
  
  return session;
}

export async function requireRole(roles: string | string[], redirectTo: string = '/') {
  const session = await requireAuth();
  
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  if (!allowedRoles.includes(session.user.rol)) {
    redirect(redirectTo);
  }
  
  return session;
}