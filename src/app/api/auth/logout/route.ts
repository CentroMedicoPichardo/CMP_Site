import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Borrar la cookie estableciendo expiración en 0
  cookieStore.set('auth_token', '', {
      httpOnly: true,
      expires: new Date(0), 
      path: '/',
  });

  return NextResponse.json({ message: "Sesión cerrada" });
}