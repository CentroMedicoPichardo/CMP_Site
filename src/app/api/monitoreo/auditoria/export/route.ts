// src/app/api/monitoreo/auditoria/export/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fields = searchParams.get('fields')?.split(',') || [];
    const tabla = searchParams.get('tabla');
    const accion = searchParams.get('accion');
    const fechaInicio = searchParams.get('fecha_inicio');
    const fechaFin = searchParams.get('fecha_fin');

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No se seleccionaron campos' }, { status: 400 });
    }

    // Mapeo de campos a nombres en la base de datos
    const fieldMap: Record<string, string> = {
      fecha_hora: 'fecha_hora',
      usuario: 'usuario',
      ip_address: 'ip_address',
      accion: 'accion',
      tabla_afectada: 'tabla_afectada',
      registro_id: 'registro_id',
      datos_anteriores: 'datos_anteriores',
      datos_nuevos: 'datos_nuevos',
    };

    // Construir SELECT con casting para JSON
    const selectParts = fields.map(f => {
      const dbField = fieldMap[f] || f;
      if (f === 'datos_anteriores' || f === 'datos_nuevos') {
        return `${dbField}::text as ${dbField}`;
      }
      return dbField;
    });
    const selectClause = selectParts.join(', ');

    // Construir condiciones WHERE
    const whereParts: string[] = [];
    if (tabla && tabla !== '') {
      whereParts.push(`tabla_afectada = '${tabla.replace(/'/g, "''")}'`);
    }
    if (accion && accion !== '') {
      whereParts.push(`accion = '${accion.replace(/'/g, "''")}'`);
    }
    if (fechaInicio && fechaInicio !== '') {
      whereParts.push(`fecha_hora >= '${fechaInicio}'`);
    }
    if (fechaFin && fechaFin !== '') {
      whereParts.push(`fecha_hora <= '${fechaFin}'`);
    }

    const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

    const query = `
      SELECT ${selectClause}
      FROM seguridad.auditoria_acciones
      ${whereClause}
      ORDER BY fecha_hora DESC
      LIMIT 10000
    `;

    console.log('🔍 Ejecutando consulta:', query);

    // Ejecutar la consulta con SQL puro
    const result = await db.execute(sql.raw(query));

    // Drizzle devuelve un array directamente, no tiene propiedad rows
    const rows = Array.isArray(result) ? result : (result as any).rows || [];

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No hay datos para exportar' }, { status: 404 });
    }

    // Generar CSV
    const headerMap: Record<string, string> = {
      fecha_hora: 'Fecha y Hora',
      usuario: 'Usuario',
      ip_address: 'Dirección IP',
      accion: 'Acción',
      tabla_afectada: 'Tabla Afectada',
      registro_id: 'ID del Registro',
      datos_anteriores: 'Datos Anteriores',
      datos_nuevos: 'Datos Nuevos',
    };

    const headers = fields.map(f => headerMap[f] || f);

    // Formatear filas CSV
    const csvRows = rows.map((row: any) => {
      return fields.map(field => {
        const dbField = fieldMap[field] || field;
        let value = row[dbField];
        
        // Formatear JSON para datos_anteriores y datos_nuevos
        if ((field === 'datos_anteriores' || field === 'datos_nuevos') && value) {
          if (typeof value === 'object') {
            value = JSON.stringify(value);
          }
        }
        
        // Formatear fecha
        if (field === 'fecha_hora' && value) {
          const date = new Date(value);
          value = date.toLocaleString('es-MX');
        }
        
        // Manejar null/undefined
        if (value === null || value === undefined) {
          return '';
        }
        
        // Convertir a string y escapar
        let strValue = String(value);
        strValue = strValue.replace(/"/g, '""');
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          strValue = `"${strValue}"`;
        }
        
        return strValue;
      }).join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="auditoria_${new Date().toISOString().slice(0, 19)}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error exportando auditoría:', error);
    return NextResponse.json(
      { error: 'Error al exportar datos', details: error.message },
      { status: 500 }
    );
  }
}