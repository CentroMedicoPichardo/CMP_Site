// src/app/api/saber-pediatrico/upload/route.ts
import { NextResponse } from 'next/server';
import { withUserEmail, getUserEmailFromRequest } from '@/lib/db-with-user';

export async function POST(request: Request) {
  try {
    const userEmail = getUserEmailFromRequest(request);
    const body = await request.json();
    const { url, tipo, publicId } = body;

    console.log("========== UPLOAD SABER PEDIÁTRICO ==========");
    console.log("📧 Email usuario:", userEmail);
    console.log("📁 Tipo:", tipo);
    console.log("🔗 URL recibida:", url);

    if (!url) {
      return NextResponse.json({ error: "No se recibió ninguna URL" }, { status: 400 });
    }

    // Aquí solo validamos que la URL sea de Cloudinary (opcional)
    const isValidCloudinaryUrl = url.includes('res.cloudinary.com');
    
    if (!isValidCloudinaryUrl) {
      console.warn("⚠️ La URL no parece ser de Cloudinary:", url);
    }

    return NextResponse.json({
      success: true,
      url: url,
      publicId: publicId || null,
      message: "URL registrada correctamente"
    });
  } catch (error: any) {
    console.error("Error en upload:", error);
    return NextResponse.json(
      { error: "Error al procesar la URL", details: error.message },
      { status: 500 }
    );
  }
}