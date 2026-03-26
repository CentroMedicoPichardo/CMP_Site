// src/lib/auth-session.ts
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;
  
  if (!userCookie) return null;
  
  try {
    const user = JSON.parse(decodeURIComponent(userCookie));
    return user;
  } catch {
    return null;
  }
}

export async function getCurrentUserEmail() {
  const user = await getCurrentUser();
  return user?.correo || null;
}