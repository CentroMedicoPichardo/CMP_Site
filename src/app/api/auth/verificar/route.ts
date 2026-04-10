// src/app/api/auth/verificar/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { usuarios, roles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ loggedIn: false });
    }
    
    // Verificar token JWT
    const secret = process.env.JWT_SECRET!;
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, secret);
    } catch (error) {
      return NextResponse.json({ loggedIn: false });
    }
    
    // Obtener usuario de la base de datos
    const usuario = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, decoded.userId),
    });
    
    if (!usuario || !usuario.activo) {
      return NextResponse.json({ loggedIn: false });
    }
    
    // Obtener rol
    const rol = await db.query.roles.findFirst({
      where: eq(roles.id, usuario.rolId),
    });
    
    return NextResponse.json({
      loggedIn: true,
      usuario: {
        id: usuario.id,
        nombre: `${usuario.nombre} ${usuario.apellidoPaterno || ''}`.trim(),
        email: usuario.correo,
        rol: rol?.nombre || 'cliente'
      }
    });
    
  } catch (error) {
    console.error('Error verificando auth:', error);
    return NextResponse.json({ loggedIn: false });
  }
}