// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { usuariosInSeguridad, rolesInSeguridad } from '@/lib/schema/index'; // 👈 Importar correctamente
import { eq } from 'drizzle-orm';
import { otpMemoria, verificarOTP } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
        codigoVerificacion, 
        nombre, 
        apellidoPaterno, 
        apellidoMaterno, 
        edad, 
        sexo, 
        telefono, 
        correo, 
        contrasena 
    } = body;

    console.log("📥 Datos recibidos en registro:", {
      nombre, apellidoPaterno, correo, edad, telefono, codigoVerificacion
    });

    // Validar campos obligatorios
    if (!correo || !codigoVerificacion) {
      return NextResponse.json({ 
        message: "Faltan datos (correo o código de verificación)" 
      }, { status: 400 });
    }

    // Verificar OTP
    const otpValidation = verificarOTP(correo, codigoVerificacion);
    console.log("🔍 Validación OTP:", otpValidation);
    
    if (!otpValidation.valido) {
      return NextResponse.json({ 
        message: otpValidation.mensaje 
      }, { status: 400 });
    }

    // Validar contraseña
    const passRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    
    if (!contrasena || contrasena.length < 8) {
        return NextResponse.json({ 
          message: "La contraseña debe tener al menos 8 caracteres." 
        }, { status: 400 });
    }
    
    if (!passRegex.test(contrasena)) {
        return NextResponse.json({ 
          message: "La contraseña es muy débil (faltan números o símbolos)." 
        }, { status: 400 });
    }
    
    // Validar secuencias (123, abc)
    const secuencias = ["123", "234", "345", "456", "789", "abc", "qwe"];
    if (secuencias.some(s => contrasena.includes(s))) {
         return NextResponse.json({ 
           message: "La contraseña contiene secuencias inseguras." 
         }, { status: 400 });
    }

    const ROL_POR_DEFECTO = 1; // ID del rol cliente

    // Verificar si el usuario ya existe
    const usuariosEncontrados = await db
      .select()
      .from(usuariosInSeguridad)
      .where(eq(usuariosInSeguridad.correo, correo));

    console.log("👥 Usuarios encontrados:", usuariosEncontrados.length);

    if (usuariosEncontrados.length > 0) {
      return NextResponse.json(
        { message: 'El correo ya está registrado en el sistema' }, 
        { status: 409 }
      );
    }

    // Verificar que el Rol exista
    const rolesEncontrados = await db
      .select()
      .from(rolesInSeguridad)
      .where(eq(rolesInSeguridad.id, ROL_POR_DEFECTO));

    console.log("👥 Roles encontrados:", rolesEncontrados.length);

    if (rolesEncontrados.length === 0) {
      return NextResponse.json(
        { message: 'Error de configuración: El Rol "Cliente" (ID 1) no existe.' }, 
        { status: 500 }
      );
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // Crear usuario
    const nuevosUsuarios = await db.insert(usuariosInSeguridad).values({
        nombre,
        apellidoPaterno,
        apellidoMaterno: apellidoMaterno || null,
        edad: Number(edad),
        sexo,
        telefono,
        correo,
        contrasena: hashedPassword,
        rolId: ROL_POR_DEFECTO,
        activo: true
    }).returning(); 

    console.log("✅ Usuario creado:", nuevosUsuarios[0]?.id);

    // Limpiamos el código usado
    otpMemoria.delete(correo);

    const usuarioCreado = nuevosUsuarios[0];
    const { contrasena: _, ...usuarioSinPass } = usuarioCreado;

    return NextResponse.json({
      mensaje: 'Usuario verificado y registrado exitosamente',
      usuario: usuarioSinPass
    }, { status: 201 });

  } catch (error) {
    console.error('Error al registrar:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}