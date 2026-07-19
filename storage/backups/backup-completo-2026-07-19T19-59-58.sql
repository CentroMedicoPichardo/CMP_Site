--
-- PostgreSQL database dump
--

\restrict 2aVtV07sAo4cWgm7iXes5dPWuhrXznMi5FcAORKoQ094R35EZkX8cty3TGo3Q3d

-- Dumped from database version 17.10 (986efc8)
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY soporte.valoraciones_faq DROP CONSTRAINT IF EXISTS fk_valoracion_usuario;
ALTER TABLE IF EXISTS ONLY soporte.valoraciones_faq DROP CONSTRAINT IF EXISTS fk_valoracion_faq;
ALTER TABLE IF EXISTS ONLY soporte.respuestas_ayuda DROP CONSTRAINT IF EXISTS fk_respuesta_usuario;
ALTER TABLE IF EXISTS ONLY soporte.respuestas_ayuda DROP CONSTRAINT IF EXISTS fk_respuesta_pregunta;
ALTER TABLE IF EXISTS ONLY soporte.preguntas_usuarios DROP CONSTRAINT IF EXISTS fk_pregunta_usuario_usuario;
ALTER TABLE IF EXISTS ONLY soporte.preguntas_usuarios DROP CONSTRAINT IF EXISTS fk_pregunta_usuario_faq;
ALTER TABLE IF EXISTS ONLY soporte.preguntas_usuarios DROP CONSTRAINT IF EXISTS fk_pregunta_usuario_categoria;
ALTER TABLE IF EXISTS ONLY soporte.preguntas_frecuentes DROP CONSTRAINT IF EXISTS fk_pregunta_frecuente_creador;
ALTER TABLE IF EXISTS ONLY soporte.preguntas_frecuentes DROP CONSTRAINT IF EXISTS fk_pregunta_frecuente_categoria;
ALTER TABLE IF EXISTS ONLY seguridad.usuarios DROP CONSTRAINT IF EXISTS usuarios_rol_id_roles_id_fk;
ALTER TABLE IF EXISTS ONLY analitica.segmentos_clientes DROP CONSTRAINT IF EXISTS fk_segmentos_cliente_usuario;
ALTER TABLE IF EXISTS ONLY analitica.segmentos_clientes DROP CONSTRAINT IF EXISTS fk_segmentos_cliente_modelo;
ALTER TABLE IF EXISTS ONLY analitica.recomendaciones_cursos DROP CONSTRAINT IF EXISTS fk_recomendaciones_usuario;
ALTER TABLE IF EXISTS ONLY analitica.recomendaciones_cursos DROP CONSTRAINT IF EXISTS fk_recomendaciones_modelo;
ALTER TABLE IF EXISTS ONLY analitica.recomendaciones_cursos DROP CONSTRAINT IF EXISTS fk_recomendaciones_curso_origen;
ALTER TABLE IF EXISTS ONLY analitica.recomendaciones_cursos DROP CONSTRAINT IF EXISTS fk_recomendaciones_curso;
ALTER TABLE IF EXISTS ONLY analitica.predicciones_precio_cursos DROP CONSTRAINT IF EXISTS fk_predicciones_precio_usuario_decide;
ALTER TABLE IF EXISTS ONLY analitica.predicciones_precio_cursos DROP CONSTRAINT IF EXISTS fk_predicciones_precio_modelo;
ALTER TABLE IF EXISTS ONLY analitica.predicciones_precio_cursos DROP CONSTRAINT IF EXISTS fk_predicciones_precio_curso;
ALTER TABLE IF EXISTS ONLY analitica.modelos_ml DROP CONSTRAINT IF EXISTS fk_modelos_ml_creado_por;
ALTER TABLE IF EXISTS ONLY analitica.dataset_segmentacion_clientes DROP CONSTRAINT IF EXISTS fk_dataset_segmentacion_usuario;
ALTER TABLE IF EXISTS ONLY analitica.dataset_regresion_precio_cursos DROP CONSTRAINT IF EXISTS fk_dataset_regresion_curso;
ALTER TABLE IF EXISTS ONLY analitica.dataset_reglas_asociacion DROP CONSTRAINT IF EXISTS fk_dataset_asociacion_usuario;
ALTER TABLE IF EXISTS ONLY analitica.dataset_reglas_asociacion DROP CONSTRAINT IF EXISTS fk_dataset_asociacion_curso;
ALTER TABLE IF EXISTS ONLY analitica.dataset_reglas_asociacion DROP CONSTRAINT IF EXISTS fk_dataset_asociacion_compra;
ALTER TABLE IF EXISTS ONLY academia.respuestas_encuestas DROP CONSTRAINT IF EXISTS respuestas_encuestas_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY academia.respuestas_encuestas DROP CONSTRAINT IF EXISTS respuestas_encuestas_encuesta_id_fkey;
ALTER TABLE IF EXISTS ONLY academia.publicaciones DROP CONSTRAINT IF EXISTS publicaciones_id_autor_fkey;
ALTER TABLE IF EXISTS ONLY academia.sesiones_curso DROP CONSTRAINT IF EXISTS fk_sesion_ubicacion;
ALTER TABLE IF EXISTS ONLY academia.sesiones_curso DROP CONSTRAINT IF EXISTS fk_sesion_modalidad;
ALTER TABLE IF EXISTS ONLY academia.sesiones_curso DROP CONSTRAINT IF EXISTS fk_sesion_curso;
ALTER TABLE IF EXISTS ONLY academia.resultados_evaluaciones DROP CONSTRAINT IF EXISTS fk_resultado_usuario_califica;
ALTER TABLE IF EXISTS ONLY academia.resultados_evaluaciones DROP CONSTRAINT IF EXISTS fk_resultado_inscripcion;
ALTER TABLE IF EXISTS ONLY academia.resultados_evaluaciones DROP CONSTRAINT IF EXISTS fk_resultado_evaluacion;
ALTER TABLE IF EXISTS ONLY academia.requisitos_aprobacion_curso DROP CONSTRAINT IF EXISTS fk_requisito_aprobacion_curso;
ALTER TABLE IF EXISTS ONLY academia.progreso_curso DROP CONSTRAINT IF EXISTS fk_progreso_inscripcion;
ALTER TABLE IF EXISTS ONLY academia.participantes DROP CONSTRAINT IF EXISTS fk_participante_usuario;
ALTER TABLE IF EXISTS ONLY academia.pagos_cursos DROP CONSTRAINT IF EXISTS fk_pago_usuario_valida;
ALTER TABLE IF EXISTS ONLY academia.pagos_cursos DROP CONSTRAINT IF EXISTS fk_pago_metodo;
ALTER TABLE IF EXISTS ONLY academia.pagos_cursos DROP CONSTRAINT IF EXISTS fk_pago_compra;
ALTER TABLE IF EXISTS ONLY academia.notificaciones_academicas DROP CONSTRAINT IF EXISTS fk_notificacion_usuario_crea;
ALTER TABLE IF EXISTS ONLY academia.notificaciones_academicas DROP CONSTRAINT IF EXISTS fk_notificacion_sesion;
ALTER TABLE IF EXISTS ONLY academia.notificaciones_academicas DROP CONSTRAINT IF EXISTS fk_notificacion_inscripcion;
ALTER TABLE IF EXISTS ONLY academia.notificaciones_academicas DROP CONSTRAINT IF EXISTS fk_notificacion_evaluacion;
ALTER TABLE IF EXISTS ONLY academia.notificaciones_academicas DROP CONSTRAINT IF EXISTS fk_notificacion_curso;
ALTER TABLE IF EXISTS ONLY academia.movimientos_cupos_curso DROP CONSTRAINT IF EXISTS fk_movimiento_cupo_usuario;
ALTER TABLE IF EXISTS ONLY academia.movimientos_cupos_curso DROP CONSTRAINT IF EXISTS fk_movimiento_cupo_curso;
ALTER TABLE IF EXISTS ONLY academia.movimientos_cupos_curso DROP CONSTRAINT IF EXISTS fk_movimiento_cupo_compra;
ALTER TABLE IF EXISTS ONLY academia.inscripciones_cursos DROP CONSTRAINT IF EXISTS fk_inscripcion_usuario;
ALTER TABLE IF EXISTS ONLY academia.inscripciones_cursos DROP CONSTRAINT IF EXISTS fk_inscripcion_participante;
ALTER TABLE IF EXISTS ONLY academia.inscripciones_cursos DROP CONSTRAINT IF EXISTS fk_inscripcion_curso;
ALTER TABLE IF EXISTS ONLY academia.inscripciones_cursos DROP CONSTRAINT IF EXISTS fk_inscripcion_compra_participante;
ALTER TABLE IF EXISTS ONLY academia.historial_estados_compra DROP CONSTRAINT IF EXISTS fk_historial_usuario_responsable;
ALTER TABLE IF EXISTS ONLY academia.historial_estados_compra DROP CONSTRAINT IF EXISTS fk_historial_estado_nuevo;
ALTER TABLE IF EXISTS ONLY academia.historial_estados_curso DROP CONSTRAINT IF EXISTS fk_historial_estado_curso_usuario;
ALTER TABLE IF EXISTS ONLY academia.historial_estados_curso DROP CONSTRAINT IF EXISTS fk_historial_estado_curso;
ALTER TABLE IF EXISTS ONLY academia.historial_estados_compra DROP CONSTRAINT IF EXISTS fk_historial_estado_anterior;
ALTER TABLE IF EXISTS ONLY academia.historial_estados_compra DROP CONSTRAINT IF EXISTS fk_historial_compra;
ALTER TABLE IF EXISTS ONLY academia.evaluaciones_curso DROP CONSTRAINT IF EXISTS fk_evaluacion_sesion;
ALTER TABLE IF EXISTS ONLY academia.evaluaciones_curso DROP CONSTRAINT IF EXISTS fk_evaluacion_curso;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS fk_cursos_ubicacion;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS fk_cursos_modalidad;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS fk_cursos_instructor;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS fk_cursos_categoria;
ALTER TABLE IF EXISTS ONLY academia.comprascursosinacademia DROP CONSTRAINT IF EXISTS fk_compra_usuario;
ALTER TABLE IF EXISTS ONLY academia.compra_participantes DROP CONSTRAINT IF EXISTS fk_compra_participante_persona;
ALTER TABLE IF EXISTS ONLY academia.compra_participantes DROP CONSTRAINT IF EXISTS fk_compra_participante_compra;
ALTER TABLE IF EXISTS ONLY academia.comprascursosinacademia DROP CONSTRAINT IF EXISTS fk_compra_estado;
ALTER TABLE IF EXISTS ONLY academia.comprascursosinacademia DROP CONSTRAINT IF EXISTS fk_compra_curso;
ALTER TABLE IF EXISTS ONLY academia.comprascursosinacademia DROP CONSTRAINT IF EXISTS fk_compra_admin;
ALTER TABLE IF EXISTS ONLY academia.certificados_curso DROP CONSTRAINT IF EXISTS fk_certificado_usuario_revoca;
ALTER TABLE IF EXISTS ONLY academia.certificados_curso DROP CONSTRAINT IF EXISTS fk_certificado_usuario_emite;
ALTER TABLE IF EXISTS ONLY academia.certificados_curso DROP CONSTRAINT IF EXISTS fk_certificado_inscripcion;
ALTER TABLE IF EXISTS ONLY academia.asistencias_curso DROP CONSTRAINT IF EXISTS fk_asistencia_usuario;
ALTER TABLE IF EXISTS ONLY academia.asistencias_curso DROP CONSTRAINT IF EXISTS fk_asistencia_sesion;
ALTER TABLE IF EXISTS ONLY academia.asistencias_curso DROP CONSTRAINT IF EXISTS fk_asistencia_inscripcion;
ALTER TABLE IF EXISTS ONLY academia.encuestas DROP CONSTRAINT IF EXISTS encuestas_contenido_id_fkey;
ALTER TABLE IF EXISTS ONLY academia.academia_infantil DROP CONSTRAINT IF EXISTS academia_infantil_id_autor_fkey;
DROP TRIGGER IF EXISTS trg_audit_usuarios ON seguridad.usuarios;
DROP TRIGGER IF EXISTS trg_audit_servicios ON clinica.servicios;
DROP TRIGGER IF EXISTS trg_audit_nosotros ON clinica.nosotros;
DROP TRIGGER IF EXISTS trg_audit_medicos ON clinica.medicos;
DROP TRIGGER IF EXISTS trg_pagos_cola_analitica ON academia.pagos_cursos;
DROP TRIGGER IF EXISTS trg_cursos_cola_analitica ON academia.cursos;
DROP TRIGGER IF EXISTS trg_compras_cola_analitica ON academia.comprascursosinacademia;
DROP INDEX IF EXISTS soporte.idx_respuestas_pregunta;
DROP INDEX IF EXISTS soporte.idx_respuestas_fecha;
DROP INDEX IF EXISTS soporte.idx_preguntas_usuarios_usuario;
DROP INDEX IF EXISTS soporte.idx_preguntas_usuarios_fecha;
DROP INDEX IF EXISTS soporte.idx_preguntas_usuarios_estado;
DROP INDEX IF EXISTS soporte.idx_preguntas_frecuentes_orden;
DROP INDEX IF EXISTS soporte.idx_preguntas_frecuentes_destacada;
DROP INDEX IF EXISTS soporte.idx_preguntas_frecuentes_categoria;
DROP INDEX IF EXISTS soporte.idx_categorias_ayuda_orden;
DROP INDEX IF EXISTS auditoria.idx_backups_tipo;
DROP INDEX IF EXISTS auditoria.idx_backups_fecha;
DROP INDEX IF EXISTS analitica.uq_segmento_vigente_usuario_modelo;
DROP INDEX IF EXISTS analitica.uq_prediccion_vigente_curso_modelo;
DROP INDEX IF EXISTS analitica.uq_mv_metricas_mensuales_periodo;
DROP INDEX IF EXISTS analitica.uq_mv_indicadores_generales;
DROP INDEX IF EXISTS analitica.idx_segmentos_clientes_usuario;
DROP INDEX IF EXISTS analitica.idx_segmentos_clientes_nombre;
DROP INDEX IF EXISTS analitica.idx_segmentos_clientes_modelo;
DROP INDEX IF EXISTS analitica.idx_segmentos_clientes_fecha;
DROP INDEX IF EXISTS analitica.idx_recomendaciones_usuario_estado;
DROP INDEX IF EXISTS analitica.idx_recomendaciones_usuario;
DROP INDEX IF EXISTS analitica.idx_recomendaciones_modelo;
DROP INDEX IF EXISTS analitica.idx_recomendaciones_expiracion;
DROP INDEX IF EXISTS analitica.idx_recomendaciones_estado;
DROP INDEX IF EXISTS analitica.idx_recomendaciones_curso;
DROP INDEX IF EXISTS analitica.idx_predicciones_precio_modelo;
DROP INDEX IF EXISTS analitica.idx_predicciones_precio_fecha;
DROP INDEX IF EXISTS analitica.idx_predicciones_precio_estado;
DROP INDEX IF EXISTS analitica.idx_predicciones_precio_curso_fecha;
DROP INDEX IF EXISTS analitica.idx_predicciones_precio_curso;
DROP INDEX IF EXISTS analitica.idx_mv_metricas_mensuales_anio_mes;
DROP INDEX IF EXISTS analitica.idx_modelos_ml_tipo;
DROP INDEX IF EXISTS analitica.idx_modelos_ml_fecha_entrenamiento;
DROP INDEX IF EXISTS analitica.idx_modelos_ml_estado;
DROP INDEX IF EXISTS analitica.idx_modelos_ml_activos;
DROP INDEX IF EXISTS analitica.idx_dataset_segmentacion_valor_frecuencia;
DROP INDEX IF EXISTS analitica.idx_dataset_segmentacion_ultima_compra;
DROP INDEX IF EXISTS analitica.idx_dataset_segmentacion_total_gastado;
DROP INDEX IF EXISTS analitica.idx_dataset_segmentacion_recencia;
DROP INDEX IF EXISTS analitica.idx_dataset_segmentacion_conversion;
DROP INDEX IF EXISTS analitica.idx_dataset_segmentacion_compras_validas;
DROP INDEX IF EXISTS analitica.idx_dataset_segmentacion_activos;
DROP INDEX IF EXISTS analitica.idx_dataset_regresion_precio;
DROP INDEX IF EXISTS analitica.idx_dataset_regresion_ocupacion;
DROP INDEX IF EXISTS analitica.idx_dataset_regresion_modalidad;
DROP INDEX IF EXISTS analitica.idx_dataset_regresion_fecha_ocupacion;
DROP INDEX IF EXISTS analitica.idx_dataset_regresion_fecha_inicio;
DROP INDEX IF EXISTS analitica.idx_dataset_regresion_categoria_modalidad;
DROP INDEX IF EXISTS analitica.idx_dataset_regresion_categoria;
DROP INDEX IF EXISTS analitica.idx_dataset_regresion_activos_fecha;
DROP INDEX IF EXISTS analitica.idx_dataset_regresion_activos;
DROP INDEX IF EXISTS analitica.idx_dataset_asociacion_usuario_curso;
DROP INDEX IF EXISTS analitica.idx_dataset_asociacion_usuario;
DROP INDEX IF EXISTS analitica.idx_dataset_asociacion_transaccion;
DROP INDEX IF EXISTS analitica.idx_dataset_asociacion_periodo;
DROP INDEX IF EXISTS analitica.idx_dataset_asociacion_modalidad;
DROP INDEX IF EXISTS analitica.idx_dataset_asociacion_fecha;
DROP INDEX IF EXISTS analitica.idx_dataset_asociacion_estado;
DROP INDEX IF EXISTS analitica.idx_dataset_asociacion_curso;
DROP INDEX IF EXISTS analitica.idx_dataset_asociacion_categoria;
DROP INDEX IF EXISTS analitica.idx_dataset_asociacion_activos;
DROP INDEX IF EXISTS analitica.idx_cola_datasets_pendientes;
DROP INDEX IF EXISTS analitica.idx_cola_datasets_origen_estado;
DROP INDEX IF EXISTS analitica.idx_cola_datasets_origen;
DROP INDEX IF EXISTS analitica.idx_cola_datasets_fecha_programada;
DROP INDEX IF EXISTS analitica.idx_cola_datasets_fallidas;
DROP INDEX IF EXISTS analitica.idx_cola_datasets_estado;
DROP INDEX IF EXISTS analitica.idx_cola_datasets_destino;
DROP INDEX IF EXISTS analitica.idx_cola_datasets_completadas_recientes;
DROP INDEX IF EXISTS academia.uq_resultados_evaluacion_inscripcion;
DROP INDEX IF EXISTS academia.uq_inscripciones_compra_participante;
DROP INDEX IF EXISTS academia.uq_inscripcion_curso_participante;
DROP INDEX IF EXISTS academia.uq_compras_cursos_folio;
DROP INDEX IF EXISTS academia.uq_compra_participantes_participante;
DROP INDEX IF EXISTS academia.uq_compra_participantes_numero_cupo;
DROP INDEX IF EXISTS academia.uq_certificados_inscripcion;
DROP INDEX IF EXISTS academia.uq_certificados_folio;
DROP INDEX IF EXISTS academia.uq_certificados_codigo_verificacion;
DROP INDEX IF EXISTS academia.uq_asistencias_sesion_inscripcion;
DROP INDEX IF EXISTS academia.idx_sesiones_fecha;
DROP INDEX IF EXISTS academia.idx_sesiones_estado;
DROP INDEX IF EXISTS academia.idx_sesiones_curso_ubicacion;
DROP INDEX IF EXISTS academia.idx_sesiones_curso_modalidad;
DROP INDEX IF EXISTS academia.idx_sesiones_curso_fecha;
DROP INDEX IF EXISTS academia.idx_sesiones_curso_estado;
DROP INDEX IF EXISTS academia.idx_sesiones_curso_curso;
DROP INDEX IF EXISTS academia.idx_sesiones_curso;
DROP INDEX IF EXISTS academia.idx_resultados_usuario_califica;
DROP INDEX IF EXISTS academia.idx_resultados_inscripcion;
DROP INDEX IF EXISTS academia.idx_resultados_fecha_entrega;
DROP INDEX IF EXISTS academia.idx_resultados_evaluacion_inscripcion;
DROP INDEX IF EXISTS academia.idx_resultados_evaluacion;
DROP INDEX IF EXISTS academia.idx_resultados_estado;
DROP INDEX IF EXISTS academia.idx_resultados_aprobado;
DROP INDEX IF EXISTS academia.idx_requisitos_aprobacion_vigentes;
DROP INDEX IF EXISTS academia.idx_progreso_ultima_actividad;
DROP INDEX IF EXISTS academia.idx_progreso_inscripcion;
DROP INDEX IF EXISTS academia.idx_progreso_finalizacion;
DROP INDEX IF EXISTS academia.idx_progreso_estado;
DROP INDEX IF EXISTS academia.idx_progreso_avance;
DROP INDEX IF EXISTS academia.idx_progreso_asistencia;
DROP INDEX IF EXISTS academia.idx_progreso_actualizacion;
DROP INDEX IF EXISTS academia.idx_participantes_usuario;
DROP INDEX IF EXISTS academia.idx_participantes_nombre;
DROP INDEX IF EXISTS academia.idx_participantes_correo;
DROP INDEX IF EXISTS academia.idx_participantes_activos;
DROP INDEX IF EXISTS academia.idx_participante_usuario;
DROP INDEX IF EXISTS academia.idx_participante_nombre;
DROP INDEX IF EXISTS academia.idx_pagos_cursos_usuario_valida;
DROP INDEX IF EXISTS academia.idx_pagos_cursos_reportados;
DROP INDEX IF EXISTS academia.idx_pagos_cursos_metodo;
DROP INDEX IF EXISTS academia.idx_pagos_cursos_fecha_reporte;
DROP INDEX IF EXISTS academia.idx_pagos_cursos_estado;
DROP INDEX IF EXISTS academia.idx_pagos_cursos_compra_estado;
DROP INDEX IF EXISTS academia.idx_pagos_cursos_compra;
DROP INDEX IF EXISTS academia.idx_notificaciones_sesion;
DROP INDEX IF EXISTS academia.idx_notificaciones_pendientes;
DROP INDEX IF EXISTS academia.idx_notificaciones_inscripcion;
DROP INDEX IF EXISTS academia.idx_notificaciones_fecha_programada;
DROP INDEX IF EXISTS academia.idx_notificaciones_evaluacion;
DROP INDEX IF EXISTS academia.idx_notificaciones_estado;
DROP INDEX IF EXISTS academia.idx_notificaciones_curso;
DROP INDEX IF EXISTS academia.idx_movimientos_cupos_usuario;
DROP INDEX IF EXISTS academia.idx_movimientos_cupos_tipo;
DROP INDEX IF EXISTS academia.idx_movimientos_cupos_fecha;
DROP INDEX IF EXISTS academia.idx_movimientos_cupos_curso_fecha;
DROP INDEX IF EXISTS academia.idx_movimientos_cupos_curso;
DROP INDEX IF EXISTS academia.idx_movimientos_cupos_compra;
DROP INDEX IF EXISTS academia.idx_instructores_especialidad;
DROP INDEX IF EXISTS academia.idx_instructores_activo;
DROP INDEX IF EXISTS academia.idx_inscripciones_usuario;
DROP INDEX IF EXISTS academia.idx_inscripciones_participante;
DROP INDEX IF EXISTS academia.idx_inscripciones_origen;
DROP INDEX IF EXISTS academia.idx_inscripciones_fecha;
DROP INDEX IF EXISTS academia.idx_inscripciones_estado;
DROP INDEX IF EXISTS academia.idx_inscripciones_curso_estado;
DROP INDEX IF EXISTS academia.idx_inscripciones_curso;
DROP INDEX IF EXISTS academia.idx_inscripciones_compra_participante;
DROP INDEX IF EXISTS academia.idx_historial_usuario_responsable;
DROP INDEX IF EXISTS academia.idx_historial_estados_fecha;
DROP INDEX IF EXISTS academia.idx_historial_estados_curso_usuario;
DROP INDEX IF EXISTS academia.idx_historial_estados_curso_fecha;
DROP INDEX IF EXISTS academia.idx_historial_estados_curso_estado_nuevo;
DROP INDEX IF EXISTS academia.idx_historial_estados_curso_curso;
DROP INDEX IF EXISTS academia.idx_historial_estados_compra_fecha;
DROP INDEX IF EXISTS academia.idx_historial_estados_compra_compra_fecha;
DROP INDEX IF EXISTS academia.idx_historial_estados_compra_compra;
DROP INDEX IF EXISTS academia.idx_historial_estados_compra;
DROP INDEX IF EXISTS academia.idx_historial_estado_nuevo;
DROP INDEX IF EXISTS academia.idx_evaluaciones_tipo;
DROP INDEX IF EXISTS academia.idx_evaluaciones_sesion;
DROP INDEX IF EXISTS academia.idx_evaluaciones_fecha_limite;
DROP INDEX IF EXISTS academia.idx_evaluaciones_estado;
DROP INDEX IF EXISTS academia.idx_evaluaciones_curso_estado;
DROP INDEX IF EXISTS academia.idx_evaluaciones_curso;
DROP INDEX IF EXISTS academia.idx_cursos_modalidad;
DROP INDEX IF EXISTS academia.idx_cursos_instructor;
DROP INDEX IF EXISTS academia.idx_cursos_fechas;
DROP INDEX IF EXISTS academia.idx_cursos_dirigido_a;
DROP INDEX IF EXISTS academia.idx_cursos_categoria;
DROP INDEX IF EXISTS academia.idx_cursos_activo;
DROP INDEX IF EXISTS academia.idx_compras_cursos_usuario_fecha;
DROP INDEX IF EXISTS academia.idx_compras_cursos_usuario;
DROP INDEX IF EXISTS academia.idx_compras_cursos_limite_pago;
DROP INDEX IF EXISTS academia.idx_compras_cursos_fecha;
DROP INDEX IF EXISTS academia.idx_compras_cursos_estado;
DROP INDEX IF EXISTS academia.idx_compras_cursos_curso_estado;
DROP INDEX IF EXISTS academia.idx_compras_cursos_curso;
DROP INDEX IF EXISTS academia.idx_compra_usuario;
DROP INDEX IF EXISTS academia.idx_compra_participantes_participante;
DROP INDEX IF EXISTS academia.idx_compra_participantes_estado;
DROP INDEX IF EXISTS academia.idx_compra_participantes_compra_estado;
DROP INDEX IF EXISTS academia.idx_compra_participantes_compra_cupo;
DROP INDEX IF EXISTS academia.idx_compra_participantes_compra;
DROP INDEX IF EXISTS academia.idx_compra_fecha;
DROP INDEX IF EXISTS academia.idx_compra_estado;
DROP INDEX IF EXISTS academia.idx_compra_curso;
DROP INDEX IF EXISTS academia.idx_certificados_usuario_revoca;
DROP INDEX IF EXISTS academia.idx_certificados_usuario_emite;
DROP INDEX IF EXISTS academia.idx_certificados_inscripcion;
DROP INDEX IF EXISTS academia.idx_certificados_fecha_emision;
DROP INDEX IF EXISTS academia.idx_certificados_estado;
DROP INDEX IF EXISTS academia.idx_certificados_codigo;
DROP INDEX IF EXISTS academia.idx_asistencias_usuario_registra;
DROP INDEX IF EXISTS academia.idx_asistencias_sesion_estado;
DROP INDEX IF EXISTS academia.idx_asistencias_sesion;
DROP INDEX IF EXISTS academia.idx_asistencias_inscripcion;
DROP INDEX IF EXISTS academia.idx_asistencias_fecha_registro;
DROP INDEX IF EXISTS academia.idx_asistencias_estado;
ALTER TABLE IF EXISTS ONLY soporte.valoraciones_faq DROP CONSTRAINT IF EXISTS valoraciones_faq_pkey;
ALTER TABLE IF EXISTS ONLY soporte.valoraciones_faq DROP CONSTRAINT IF EXISTS unique_valoracion_usuario_faq;
ALTER TABLE IF EXISTS ONLY soporte.respuestas_ayuda DROP CONSTRAINT IF EXISTS respuestas_ayuda_pkey;
ALTER TABLE IF EXISTS ONLY soporte.preguntas_usuarios DROP CONSTRAINT IF EXISTS preguntas_usuarios_pkey;
ALTER TABLE IF EXISTS ONLY soporte.preguntas_frecuentes DROP CONSTRAINT IF EXISTS preguntas_frecuentes_pkey;
ALTER TABLE IF EXISTS ONLY soporte.categorias_ayuda DROP CONSTRAINT IF EXISTS categorias_ayuda_pkey;
ALTER TABLE IF EXISTS ONLY soporte.categorias_ayuda DROP CONSTRAINT IF EXISTS categorias_ayuda_nombre_key;
ALTER TABLE IF EXISTS ONLY seguridad.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY seguridad.usuarios DROP CONSTRAINT IF EXISTS usuarios_correo_unique;
ALTER TABLE IF EXISTS ONLY seguridad.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY seguridad.roles DROP CONSTRAINT IF EXISTS roles_nombre_unique;
ALTER TABLE IF EXISTS ONLY seguridad.monitoreo_rendimiento DROP CONSTRAINT IF EXISTS monitoreo_rendimiento_pkey;
ALTER TABLE IF EXISTS ONLY seguridad.estadisticas_consumo DROP CONSTRAINT IF EXISTS estadisticas_consumo_pkey;
ALTER TABLE IF EXISTS ONLY seguridad.cambios_estructura DROP CONSTRAINT IF EXISTS cambios_estructura_pkey;
ALTER TABLE IF EXISTS ONLY seguridad.auditoria_acciones DROP CONSTRAINT IF EXISTS auditoria_acciones_pkey;
ALTER TABLE IF EXISTS ONLY seguridad.alertas_seguridad DROP CONSTRAINT IF EXISTS alertas_seguridad_pkey;
ALTER TABLE IF EXISTS ONLY clinica.servicios DROP CONSTRAINT IF EXISTS servicios_pkey;
ALTER TABLE IF EXISTS ONLY clinica.nosotros DROP CONSTRAINT IF EXISTS nosotros_pkey;
ALTER TABLE IF EXISTS ONLY clinica.medicos DROP CONSTRAINT IF EXISTS medicos_pkey;
ALTER TABLE IF EXISTS ONLY clinica.empresa_info DROP CONSTRAINT IF EXISTS empresa_info_pkey;
ALTER TABLE IF EXISTS ONLY auditoria.intentos_recuperacion DROP CONSTRAINT IF EXISTS intentos_recuperacion_pkey;
ALTER TABLE IF EXISTS ONLY auditoria.backups DROP CONSTRAINT IF EXISTS backups_pkey;
ALTER TABLE IF EXISTS ONLY analitica.modelos_ml DROP CONSTRAINT IF EXISTS uq_modelos_ml_nombre_version;
ALTER TABLE IF EXISTS ONLY analitica.dataset_reglas_asociacion DROP CONSTRAINT IF EXISTS uq_dataset_asociacion_compra;
ALTER TABLE IF EXISTS ONLY analitica.segmentos_clientes DROP CONSTRAINT IF EXISTS segmentos_clientes_pkey;
ALTER TABLE IF EXISTS ONLY analitica.recomendaciones_cursos DROP CONSTRAINT IF EXISTS recomendaciones_cursos_pkey;
ALTER TABLE IF EXISTS ONLY analitica.predicciones_precio_cursos DROP CONSTRAINT IF EXISTS predicciones_precio_cursos_pkey;
ALTER TABLE IF EXISTS ONLY analitica.modelos_ml DROP CONSTRAINT IF EXISTS modelos_ml_pkey;
ALTER TABLE IF EXISTS ONLY analitica.dataset_segmentacion_clientes DROP CONSTRAINT IF EXISTS dataset_segmentacion_clientes_usuario_id_key;
ALTER TABLE IF EXISTS ONLY analitica.dataset_segmentacion_clientes DROP CONSTRAINT IF EXISTS dataset_segmentacion_clientes_pkey;
ALTER TABLE IF EXISTS ONLY analitica.dataset_regresion_precio_cursos DROP CONSTRAINT IF EXISTS dataset_regresion_precio_cursos_pkey;
ALTER TABLE IF EXISTS ONLY analitica.dataset_regresion_precio_cursos DROP CONSTRAINT IF EXISTS dataset_regresion_precio_cursos_curso_id_key;
ALTER TABLE IF EXISTS ONLY analitica.dataset_reglas_asociacion DROP CONSTRAINT IF EXISTS dataset_reglas_asociacion_pkey;
ALTER TABLE IF EXISTS ONLY analitica.cola_actualizacion_datasets DROP CONSTRAINT IF EXISTS cola_actualizacion_datasets_pkey;
ALTER TABLE IF EXISTS ONLY academia.sesiones_curso DROP CONSTRAINT IF EXISTS uq_sesion_numero;
ALTER TABLE IF EXISTS ONLY academia.resultados_evaluaciones DROP CONSTRAINT IF EXISTS uq_resultado_intento;
ALTER TABLE IF EXISTS ONLY academia.requisitos_aprobacion_curso DROP CONSTRAINT IF EXISTS uq_requisito_aprobacion_curso;
ALTER TABLE IF EXISTS ONLY academia.progreso_curso DROP CONSTRAINT IF EXISTS uq_progreso_inscripcion;
ALTER TABLE IF EXISTS ONLY academia.inscripciones_cursos DROP CONSTRAINT IF EXISTS uq_inscripcion_compra_participante;
ALTER TABLE IF EXISTS ONLY academia.compra_participantes DROP CONSTRAINT IF EXISTS uq_compra_participante;
ALTER TABLE IF EXISTS ONLY academia.compra_participantes DROP CONSTRAINT IF EXISTS uq_compra_numero_cupo;
ALTER TABLE IF EXISTS ONLY academia.certificados_curso DROP CONSTRAINT IF EXISTS uq_certificado_inscripcion;
ALTER TABLE IF EXISTS ONLY academia.asistencias_curso DROP CONSTRAINT IF EXISTS uq_asistencia_inscripcion_sesion;
ALTER TABLE IF EXISTS ONLY academia.inscripciones_cursos DROP CONSTRAINT IF EXISTS unique_inscripcion_curso_usuario;
ALTER TABLE IF EXISTS ONLY academia.ubicaciones_cursos DROP CONSTRAINT IF EXISTS ubicaciones_cursos_pkey;
ALTER TABLE IF EXISTS ONLY academia.ubicaciones_cursos DROP CONSTRAINT IF EXISTS ubicaciones_cursos_nombre_ubicacion_key;
ALTER TABLE IF EXISTS ONLY academia.sesiones_curso DROP CONSTRAINT IF EXISTS sesiones_curso_pkey;
ALTER TABLE IF EXISTS ONLY academia.resultados_evaluaciones DROP CONSTRAINT IF EXISTS resultados_evaluaciones_pkey;
ALTER TABLE IF EXISTS ONLY academia.respuestas_encuestas DROP CONSTRAINT IF EXISTS respuestas_encuestas_pkey;
ALTER TABLE IF EXISTS ONLY academia.requisitos_aprobacion_curso DROP CONSTRAINT IF EXISTS requisitos_aprobacion_curso_pkey;
ALTER TABLE IF EXISTS ONLY academia.publicaciones DROP CONSTRAINT IF EXISTS publicaciones_pkey;
ALTER TABLE IF EXISTS ONLY academia.progreso_curso DROP CONSTRAINT IF EXISTS progreso_curso_pkey;
ALTER TABLE IF EXISTS ONLY academia.participantes DROP CONSTRAINT IF EXISTS participantes_pkey;
ALTER TABLE IF EXISTS ONLY academia.pagos_cursos DROP CONSTRAINT IF EXISTS pagos_cursos_pkey;
ALTER TABLE IF EXISTS ONLY academia.notificaciones_academicas DROP CONSTRAINT IF EXISTS notificaciones_academicas_pkey;
ALTER TABLE IF EXISTS ONLY academia.movimientos_cupos_curso DROP CONSTRAINT IF EXISTS movimientos_cupos_curso_pkey;
ALTER TABLE IF EXISTS ONLY academia.modalidades DROP CONSTRAINT IF EXISTS modalidades_pkey;
ALTER TABLE IF EXISTS ONLY academia.modalidades DROP CONSTRAINT IF EXISTS modalidades_nombre_modalidad_key;
ALTER TABLE IF EXISTS ONLY academia.metodos_pago_cursos DROP CONSTRAINT IF EXISTS metodos_pago_cursos_pkey;
ALTER TABLE IF EXISTS ONLY academia.metodos_pago_cursos DROP CONSTRAINT IF EXISTS metodos_pago_cursos_nombre_key;
ALTER TABLE IF EXISTS ONLY academia.instructores DROP CONSTRAINT IF EXISTS instructores_pkey;
ALTER TABLE IF EXISTS ONLY academia.instructores DROP CONSTRAINT IF EXISTS instructores_correo_key;
ALTER TABLE IF EXISTS ONLY academia.inscripciones_cursos DROP CONSTRAINT IF EXISTS inscripciones_cursos_pkey;
ALTER TABLE IF EXISTS ONLY academia.historial_estados_curso DROP CONSTRAINT IF EXISTS historial_estados_curso_pkey;
ALTER TABLE IF EXISTS ONLY academia.historial_estados_compra DROP CONSTRAINT IF EXISTS historial_estados_compra_pkey;
ALTER TABLE IF EXISTS ONLY academia.evaluaciones_curso DROP CONSTRAINT IF EXISTS evaluaciones_curso_pkey;
ALTER TABLE IF EXISTS ONLY academia.estadocomprainacademia DROP CONSTRAINT IF EXISTS estadocomprainacademia_pkey;
ALTER TABLE IF EXISTS ONLY academia.estadocomprainacademia DROP CONSTRAINT IF EXISTS estadocomprainacademia_nombre_key;
ALTER TABLE IF EXISTS ONLY academia.encuestas DROP CONSTRAINT IF EXISTS encuestas_pkey;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS cursos_pkey;
ALTER TABLE IF EXISTS ONLY academia.contenido_saber_pediatrico DROP CONSTRAINT IF EXISTS contenido_saber_pediatrico_pkey;
ALTER TABLE IF EXISTS ONLY academia.comprascursosinacademia DROP CONSTRAINT IF EXISTS comprascursosinacademia_pkey;
ALTER TABLE IF EXISTS ONLY academia.comprascursosinacademia DROP CONSTRAINT IF EXISTS comprascursosinacademia_foliocompra_key;
ALTER TABLE IF EXISTS ONLY academia.compra_participantes DROP CONSTRAINT IF EXISTS compra_participantes_pkey;
ALTER TABLE IF EXISTS ONLY academia.certificados_curso DROP CONSTRAINT IF EXISTS certificados_curso_pkey;
ALTER TABLE IF EXISTS ONLY academia.certificados_curso DROP CONSTRAINT IF EXISTS certificados_curso_folio_certificado_key;
ALTER TABLE IF EXISTS ONLY academia.certificados_curso DROP CONSTRAINT IF EXISTS certificados_curso_codigo_verificacion_key;
ALTER TABLE IF EXISTS ONLY academia.categorias_cursos DROP CONSTRAINT IF EXISTS categorias_cursos_pkey;
ALTER TABLE IF EXISTS ONLY academia.categorias_cursos DROP CONSTRAINT IF EXISTS categorias_cursos_nombre_categoria_key;
ALTER TABLE IF EXISTS ONLY academia.asistencias_curso DROP CONSTRAINT IF EXISTS asistencias_curso_pkey;
ALTER TABLE IF EXISTS ONLY academia.academia_infantil DROP CONSTRAINT IF EXISTS academia_infantil_pkey;
ALTER TABLE IF EXISTS soporte.valoraciones_faq ALTER COLUMN id_valoracion DROP DEFAULT;
ALTER TABLE IF EXISTS soporte.respuestas_ayuda ALTER COLUMN id_respuesta DROP DEFAULT;
ALTER TABLE IF EXISTS soporte.preguntas_usuarios ALTER COLUMN id_pregunta DROP DEFAULT;
ALTER TABLE IF EXISTS soporte.preguntas_frecuentes ALTER COLUMN id_pregunta DROP DEFAULT;
ALTER TABLE IF EXISTS soporte.categorias_ayuda ALTER COLUMN id_categoria DROP DEFAULT;
ALTER TABLE IF EXISTS seguridad.usuarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS seguridad.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS seguridad.monitoreo_rendimiento ALTER COLUMN id_monitoreo DROP DEFAULT;
ALTER TABLE IF EXISTS seguridad.estadisticas_consumo ALTER COLUMN id_estadistica DROP DEFAULT;
ALTER TABLE IF EXISTS seguridad.cambios_estructura ALTER COLUMN id_cambio DROP DEFAULT;
ALTER TABLE IF EXISTS seguridad.auditoria_acciones ALTER COLUMN id_auditoria DROP DEFAULT;
ALTER TABLE IF EXISTS seguridad.alertas_seguridad ALTER COLUMN id_alerta DROP DEFAULT;
ALTER TABLE IF EXISTS clinica.servicios ALTER COLUMN id_servicio DROP DEFAULT;
ALTER TABLE IF EXISTS clinica.nosotros ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS clinica.medicos ALTER COLUMN id_medico DROP DEFAULT;
ALTER TABLE IF EXISTS clinica.empresa_info ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS auditoria.intentos_recuperacion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS auditoria.backups ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS analitica.segmentos_clientes ALTER COLUMN id_segmentacion DROP DEFAULT;
ALTER TABLE IF EXISTS analitica.recomendaciones_cursos ALTER COLUMN id_recomendacion DROP DEFAULT;
ALTER TABLE IF EXISTS analitica.predicciones_precio_cursos ALTER COLUMN id_prediccion DROP DEFAULT;
ALTER TABLE IF EXISTS analitica.modelos_ml ALTER COLUMN id_modelo DROP DEFAULT;
ALTER TABLE IF EXISTS analitica.dataset_segmentacion_clientes ALTER COLUMN id_registro DROP DEFAULT;
ALTER TABLE IF EXISTS analitica.dataset_regresion_precio_cursos ALTER COLUMN id_registro DROP DEFAULT;
ALTER TABLE IF EXISTS analitica.dataset_reglas_asociacion ALTER COLUMN id_registro DROP DEFAULT;
ALTER TABLE IF EXISTS analitica.cola_actualizacion_datasets ALTER COLUMN id_tarea DROP DEFAULT;
ALTER TABLE IF EXISTS academia.ubicaciones_cursos ALTER COLUMN id_ubicacion DROP DEFAULT;
ALTER TABLE IF EXISTS academia.sesiones_curso ALTER COLUMN id_sesion DROP DEFAULT;
ALTER TABLE IF EXISTS academia.resultados_evaluaciones ALTER COLUMN id_resultado DROP DEFAULT;
ALTER TABLE IF EXISTS academia.respuestas_encuestas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS academia.requisitos_aprobacion_curso ALTER COLUMN id_requisito_aprobacion DROP DEFAULT;
ALTER TABLE IF EXISTS academia.publicaciones ALTER COLUMN id_publicacion DROP DEFAULT;
ALTER TABLE IF EXISTS academia.progreso_curso ALTER COLUMN id_progreso DROP DEFAULT;
ALTER TABLE IF EXISTS academia.participantes ALTER COLUMN id_participante DROP DEFAULT;
ALTER TABLE IF EXISTS academia.pagos_cursos ALTER COLUMN id_pago DROP DEFAULT;
ALTER TABLE IF EXISTS academia.notificaciones_academicas ALTER COLUMN id_notificacion DROP DEFAULT;
ALTER TABLE IF EXISTS academia.movimientos_cupos_curso ALTER COLUMN id_movimiento_cupo DROP DEFAULT;
ALTER TABLE IF EXISTS academia.modalidades ALTER COLUMN id_modalidad DROP DEFAULT;
ALTER TABLE IF EXISTS academia.metodos_pago_cursos ALTER COLUMN id_metodo_pago DROP DEFAULT;
ALTER TABLE IF EXISTS academia.instructores ALTER COLUMN id_instructor DROP DEFAULT;
ALTER TABLE IF EXISTS academia.inscripciones_cursos ALTER COLUMN id_inscripcion DROP DEFAULT;
ALTER TABLE IF EXISTS academia.historial_estados_curso ALTER COLUMN id_historial_estado_curso DROP DEFAULT;
ALTER TABLE IF EXISTS academia.historial_estados_compra ALTER COLUMN id_historial_estado DROP DEFAULT;
ALTER TABLE IF EXISTS academia.evaluaciones_curso ALTER COLUMN id_evaluacion DROP DEFAULT;
ALTER TABLE IF EXISTS academia.estadocomprainacademia ALTER COLUMN idestadocompra DROP DEFAULT;
ALTER TABLE IF EXISTS academia.encuestas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS academia.cursos ALTER COLUMN id_curso DROP DEFAULT;
ALTER TABLE IF EXISTS academia.contenido_saber_pediatrico ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS academia.comprascursosinacademia ALTER COLUMN idcompra DROP DEFAULT;
ALTER TABLE IF EXISTS academia.compra_participantes ALTER COLUMN id_compra_participante DROP DEFAULT;
ALTER TABLE IF EXISTS academia.certificados_curso ALTER COLUMN id_certificado DROP DEFAULT;
ALTER TABLE IF EXISTS academia.categorias_cursos ALTER COLUMN id_categoria DROP DEFAULT;
ALTER TABLE IF EXISTS academia.asistencias_curso ALTER COLUMN id_asistencia DROP DEFAULT;
ALTER TABLE IF EXISTS academia.academia_infantil ALTER COLUMN id_guia DROP DEFAULT;
DROP SEQUENCE IF EXISTS soporte.valoraciones_faq_id_valoracion_seq;
DROP TABLE IF EXISTS soporte.valoraciones_faq;
DROP SEQUENCE IF EXISTS soporte.respuestas_ayuda_id_respuesta_seq;
DROP TABLE IF EXISTS soporte.respuestas_ayuda;
DROP SEQUENCE IF EXISTS soporte.preguntas_usuarios_id_pregunta_seq;
DROP TABLE IF EXISTS soporte.preguntas_usuarios;
DROP SEQUENCE IF EXISTS soporte.preguntas_frecuentes_id_pregunta_seq;
DROP TABLE IF EXISTS soporte.preguntas_frecuentes;
DROP SEQUENCE IF EXISTS soporte.categorias_ayuda_id_categoria_seq;
DROP TABLE IF EXISTS soporte.categorias_ayuda;
DROP SEQUENCE IF EXISTS seguridad.usuarios_id_seq;
DROP SEQUENCE IF EXISTS seguridad.roles_id_seq;
DROP TABLE IF EXISTS seguridad.roles;
DROP SEQUENCE IF EXISTS seguridad.monitoreo_rendimiento_id_monitoreo_seq;
DROP TABLE IF EXISTS seguridad.monitoreo_rendimiento;
DROP SEQUENCE IF EXISTS seguridad.estadisticas_consumo_id_estadistica_seq;
DROP TABLE IF EXISTS seguridad.estadisticas_consumo;
DROP SEQUENCE IF EXISTS seguridad.cambios_estructura_id_cambio_seq;
DROP TABLE IF EXISTS seguridad.cambios_estructura;
DROP SEQUENCE IF EXISTS seguridad.auditoria_acciones_id_auditoria_seq;
DROP TABLE IF EXISTS seguridad.auditoria_acciones;
DROP SEQUENCE IF EXISTS seguridad.alertas_seguridad_id_alerta_seq;
DROP TABLE IF EXISTS seguridad.alertas_seguridad;
DROP SEQUENCE IF EXISTS clinica.servicios_id_servicio_seq;
DROP TABLE IF EXISTS clinica.servicios;
DROP SEQUENCE IF EXISTS clinica.nosotros_id_seq;
DROP TABLE IF EXISTS clinica.nosotros;
DROP SEQUENCE IF EXISTS clinica.medicos_id_medico_seq;
DROP TABLE IF EXISTS clinica.medicos;
DROP SEQUENCE IF EXISTS clinica.empresa_info_id_seq;
DROP TABLE IF EXISTS clinica.empresa_info;
DROP SEQUENCE IF EXISTS auditoria.intentos_recuperacion_id_seq;
DROP TABLE IF EXISTS auditoria.intentos_recuperacion;
DROP SEQUENCE IF EXISTS auditoria.backups_id_seq;
DROP TABLE IF EXISTS auditoria.backups;
DROP SEQUENCE IF EXISTS analitica.segmentos_clientes_id_segmentacion_seq;
DROP TABLE IF EXISTS analitica.segmentos_clientes;
DROP SEQUENCE IF EXISTS analitica.recomendaciones_cursos_id_recomendacion_seq;
DROP TABLE IF EXISTS analitica.recomendaciones_cursos;
DROP SEQUENCE IF EXISTS analitica.predicciones_precio_cursos_id_prediccion_seq;
DROP TABLE IF EXISTS analitica.predicciones_precio_cursos;
DROP MATERIALIZED VIEW IF EXISTS analitica.mv_metricas_mensuales_cursos;
DROP MATERIALIZED VIEW IF EXISTS analitica.mv_indicadores_generales;
DROP SEQUENCE IF EXISTS analitica.modelos_ml_id_modelo_seq;
DROP TABLE IF EXISTS analitica.modelos_ml;
DROP SEQUENCE IF EXISTS analitica.dataset_segmentacion_clientes_id_registro_seq;
DROP TABLE IF EXISTS analitica.dataset_segmentacion_clientes;
DROP SEQUENCE IF EXISTS analitica.dataset_regresion_precio_cursos_id_registro_seq;
DROP TABLE IF EXISTS analitica.dataset_regresion_precio_cursos;
DROP SEQUENCE IF EXISTS analitica.dataset_reglas_asociacion_id_registro_seq;
DROP TABLE IF EXISTS analitica.dataset_reglas_asociacion;
DROP SEQUENCE IF EXISTS analitica.cola_actualizacion_datasets_id_tarea_seq;
DROP TABLE IF EXISTS analitica.cola_actualizacion_datasets;
DROP VIEW IF EXISTS academia.vw_metricas_mensuales_cursos;
DROP VIEW IF EXISTS academia.vw_indicadores_generales;
DROP VIEW IF EXISTS academia.vw_detalle_participantes_cursos;
DROP VIEW IF EXISTS academia.vw_alertas_administrativas;
DROP VIEW IF EXISTS academia.vw_seguimiento_academico_cursos;
DROP VIEW IF EXISTS academia.vw_resumen_compras_cursos;
DROP VIEW IF EXISTS academia.vw_ocupacion_cursos;
DROP VIEW IF EXISTS academia.vw_control_pagos_cursos;
DROP TABLE IF EXISTS seguridad.usuarios;
DROP VIEW IF EXISTS academia.vw_agenda_sesiones_cursos;
DROP SEQUENCE IF EXISTS academia.ubicaciones_cursos_id_ubicacion_seq;
DROP TABLE IF EXISTS academia.ubicaciones_cursos;
DROP SEQUENCE IF EXISTS academia.sesiones_curso_id_sesion_seq;
DROP TABLE IF EXISTS academia.sesiones_curso;
DROP SEQUENCE IF EXISTS academia.seq_folio_compra;
DROP SEQUENCE IF EXISTS academia.resultados_evaluaciones_id_resultado_seq;
DROP TABLE IF EXISTS academia.resultados_evaluaciones;
DROP SEQUENCE IF EXISTS academia.respuestas_encuestas_id_seq;
DROP TABLE IF EXISTS academia.respuestas_encuestas;
DROP SEQUENCE IF EXISTS academia.requisitos_aprobacion_curso_id_requisito_aprobacion_seq;
DROP TABLE IF EXISTS academia.requisitos_aprobacion_curso;
DROP SEQUENCE IF EXISTS academia.publicaciones_id_publicacion_seq;
DROP TABLE IF EXISTS academia.publicaciones;
DROP SEQUENCE IF EXISTS academia.progreso_curso_id_progreso_seq;
DROP TABLE IF EXISTS academia.progreso_curso;
DROP SEQUENCE IF EXISTS academia.participantes_id_participante_seq;
DROP TABLE IF EXISTS academia.participantes;
DROP SEQUENCE IF EXISTS academia.pagos_cursos_id_pago_seq;
DROP TABLE IF EXISTS academia.pagos_cursos;
DROP SEQUENCE IF EXISTS academia.notificaciones_academicas_id_notificacion_seq;
DROP TABLE IF EXISTS academia.notificaciones_academicas;
DROP SEQUENCE IF EXISTS academia.movimientos_cupos_curso_id_movimiento_cupo_seq;
DROP TABLE IF EXISTS academia.movimientos_cupos_curso;
DROP SEQUENCE IF EXISTS academia.modalidades_id_modalidad_seq;
DROP TABLE IF EXISTS academia.modalidades;
DROP SEQUENCE IF EXISTS academia.metodos_pago_cursos_id_metodo_pago_seq;
DROP TABLE IF EXISTS academia.metodos_pago_cursos;
DROP SEQUENCE IF EXISTS academia.instructores_id_instructor_seq;
DROP TABLE IF EXISTS academia.instructores;
DROP SEQUENCE IF EXISTS academia.inscripciones_cursos_id_inscripcion_seq;
DROP TABLE IF EXISTS academia.inscripciones_cursos;
DROP SEQUENCE IF EXISTS academia.historial_estados_curso_id_historial_estado_curso_seq;
DROP TABLE IF EXISTS academia.historial_estados_curso;
DROP SEQUENCE IF EXISTS academia.historial_estados_compra_id_historial_estado_seq;
DROP TABLE IF EXISTS academia.historial_estados_compra;
DROP SEQUENCE IF EXISTS academia.evaluaciones_curso_id_evaluacion_seq;
DROP TABLE IF EXISTS academia.evaluaciones_curso;
DROP SEQUENCE IF EXISTS academia.estadocomprainacademia_idestadocompra_seq;
DROP TABLE IF EXISTS academia.estadocomprainacademia;
DROP SEQUENCE IF EXISTS academia.encuestas_id_seq;
DROP TABLE IF EXISTS academia.encuestas;
DROP SEQUENCE IF EXISTS academia.cursos_id_curso_seq;
DROP TABLE IF EXISTS academia.cursos;
DROP SEQUENCE IF EXISTS academia.contenido_saber_pediatrico_id_seq;
DROP TABLE IF EXISTS academia.contenido_saber_pediatrico;
DROP SEQUENCE IF EXISTS academia.comprascursosinacademia_idcompra_seq;
DROP TABLE IF EXISTS academia.comprascursosinacademia;
DROP SEQUENCE IF EXISTS academia.compra_participantes_id_compra_participante_seq;
DROP TABLE IF EXISTS academia.compra_participantes;
DROP SEQUENCE IF EXISTS academia.certificados_curso_id_certificado_seq;
DROP TABLE IF EXISTS academia.certificados_curso;
DROP SEQUENCE IF EXISTS academia.categorias_cursos_id_categoria_seq;
DROP TABLE IF EXISTS academia.categorias_cursos;
DROP SEQUENCE IF EXISTS academia.asistencias_curso_id_asistencia_seq;
DROP TABLE IF EXISTS academia.asistencias_curso;
DROP SEQUENCE IF EXISTS academia.academia_infantil_id_guia_seq;
DROP TABLE IF EXISTS academia.academia_infantil;
DROP FUNCTION IF EXISTS seguridad.fn_auditar_cambios();
DROP FUNCTION IF EXISTS public.contar_filas_en_todas_tablas();
DROP FUNCTION IF EXISTS analitica.registrar_actualizacion_dataset();
DROP FUNCTION IF EXISTS analitica.refrescar_vistas_dashboard();
DROP FUNCTION IF EXISTS analitica.recalcular_todos_datasets(p_limpiar_registros_huerfanos boolean);
DROP FUNCTION IF EXISTS analitica.procesar_cola_actualizacion_datasets(p_limite integer, p_max_intentos smallint);
DROP FUNCTION IF EXISTS analitica.actualizar_dataset_segmentacion_usuario(p_usuario_id integer);
DROP FUNCTION IF EXISTS analitica.actualizar_dataset_regresion_curso(p_curso_id integer);
DROP FUNCTION IF EXISTS analitica.actualizar_dataset_asociacion_compra(p_compra_id bigint);
DROP FUNCTION IF EXISTS academia.validar_pago_curso(p_pago_id bigint, p_usuario_valida integer, p_aprobar boolean, p_motivo_rechazo text, p_observaciones text);
DROP FUNCTION IF EXISTS academia.reportar_pago_curso(p_compra_id bigint, p_metodo_pago_id smallint, p_monto numeric, p_fecha_pago timestamp without time zone, p_referencia character varying, p_ruta_comprobante text, p_nombre_archivo_original character varying, p_tipo_archivo character varying, p_observaciones text);
DROP FUNCTION IF EXISTS academia.generar_inscripciones_compra(p_compra_id bigint, p_usuario_responsable integer, p_observaciones text);
DROP FUNCTION IF EXISTS academia.generar_folio_compra();
DROP FUNCTION IF EXISTS academia.expirar_compras_pendientes(p_limite integer);
DROP FUNCTION IF EXISTS academia.crear_compra_curso(p_usuario_id integer, p_curso_id integer, p_cantidad_cupos smallint, p_descuento numeric, p_horas_limite_pago integer, p_observaciones text);
DROP FUNCTION IF EXISTS academia.cancelar_compra_curso(p_compra_id bigint, p_usuario_responsable integer, p_motivo text);
DROP FUNCTION IF EXISTS academia.agregar_participante_compra(p_compra_id bigint, p_participante_id bigint, p_usuario_id integer, p_nombre character varying, p_apellido_paterno character varying, p_apellido_materno character varying, p_fecha_nacimiento date, p_sexo character varying, p_telefono character varying, p_correo character varying, p_observaciones text);
DROP SCHEMA IF EXISTS soporte;
DROP SCHEMA IF EXISTS seguridad;
DROP SCHEMA IF EXISTS clinica;
DROP SCHEMA IF EXISTS auditoria;
DROP SCHEMA IF EXISTS analitica;
DROP SCHEMA IF EXISTS academia;
--
-- Name: academia; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA academia;


--
-- Name: analitica; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA analitica;


--
-- Name: auditoria; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auditoria;


--
-- Name: clinica; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA clinica;


--
-- Name: seguridad; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA seguridad;


--
-- Name: soporte; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA soporte;


--
-- Name: agregar_participante_compra(bigint, bigint, integer, character varying, character varying, character varying, date, character varying, character varying, character varying, text); Type: FUNCTION; Schema: academia; Owner: -
--

CREATE FUNCTION academia.agregar_participante_compra(p_compra_id bigint, p_participante_id bigint DEFAULT NULL::bigint, p_usuario_id integer DEFAULT NULL::integer, p_nombre character varying DEFAULT NULL::character varying, p_apellido_paterno character varying DEFAULT NULL::character varying, p_apellido_materno character varying DEFAULT NULL::character varying, p_fecha_nacimiento date DEFAULT NULL::date, p_sexo character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_correo character varying DEFAULT NULL::character varying, p_observaciones text DEFAULT NULL::text) RETURNS TABLE(id_compra_participante bigint, id_participante bigint, numero_cupo smallint)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cantidad_cupos SMALLINT;
    v_estado_compra VARCHAR(60);
    v_participantes_activos INTEGER;
    v_numero_cupo SMALLINT;
    v_id_participante BIGINT;
    v_id_compra_participante BIGINT;
BEGIN

    /* 1. VALIDAR COMPRA */

    IF p_compra_id IS NULL THEN
        RAISE EXCEPTION
            'La compra es obligatoria';
    END IF;

    SELECT
        cc.cantidadcupos,
        ec.nombre
    INTO
        v_cantidad_cupos,
        v_estado_compra
    FROM academia.comprascursosinacademia cc
    INNER JOIN academia.estadocomprainacademia ec
        ON ec.idestadocompra = cc.idestadocompra
    WHERE cc.idcompra = p_compra_id
    FOR UPDATE OF cc;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'La compra % no existe',
            p_compra_id;
    END IF;


    /* 2. VALIDAR ESTADO DE LA COMPRA */

    IF v_estado_compra IN (
        'Cancelada',
        'Rechazada',
        'Expirada'
    ) THEN
        RAISE EXCEPTION
            'No se pueden agregar participantes a una compra con estado "%"',
            v_estado_compra;
    END IF;

    IF v_estado_compra = 'Inscripciones generadas' THEN
        RAISE EXCEPTION
            'La compra ya generó sus inscripciones';
    END IF;


    /* 3. VALIDAR CAPACIDAD */

    SELECT COUNT(*)
    INTO v_participantes_activos
    FROM academia.compra_participantes cp
    WHERE cp.id_compra = p_compra_id
      AND cp.estado <> 'Cancelado';

    IF v_participantes_activos >= v_cantidad_cupos THEN
        RAISE EXCEPTION
            'La compra ya tiene asignados todos sus cupos';
    END IF;


    /* 4. REUTILIZAR O CREAR PARTICIPANTE */

    IF p_participante_id IS NOT NULL THEN

        IF p_nombre IS NOT NULL
           OR p_apellido_paterno IS NOT NULL
           OR p_apellido_materno IS NOT NULL
           OR p_fecha_nacimiento IS NOT NULL
           OR p_sexo IS NOT NULL
           OR p_telefono IS NOT NULL
           OR p_correo IS NOT NULL THEN
            RAISE EXCEPTION
                'No envíes datos personales cuando reutilices un participante existente';
        END IF;

        SELECT p.id_participante
        INTO v_id_participante
        FROM academia.participantes p
        WHERE p.id_participante = p_participante_id
          AND p.activo = TRUE;

        IF NOT FOUND THEN
            RAISE EXCEPTION
                'El participante % no existe o está inactivo',
                p_participante_id;
        END IF;

    ELSE

        IF p_nombre IS NULL
           OR LENGTH(TRIM(p_nombre)) = 0 THEN
            RAISE EXCEPTION
                'El nombre del participante es obligatorio';
        END IF;

        IF p_apellido_paterno IS NULL
           OR LENGTH(TRIM(p_apellido_paterno)) = 0 THEN
            RAISE EXCEPTION
                'El apellido paterno es obligatorio';
        END IF;

        IF p_fecha_nacimiento IS NOT NULL
           AND p_fecha_nacimiento > CURRENT_DATE THEN
            RAISE EXCEPTION
                'La fecha de nacimiento no puede ser futura';
        END IF;

        IF p_usuario_id IS NOT NULL
           AND NOT EXISTS (
               SELECT 1
               FROM seguridad.usuarios u
               WHERE u.id = p_usuario_id
           ) THEN
            RAISE EXCEPTION
                'El usuario relacionado % no existe',
                p_usuario_id;
        END IF;

        INSERT INTO academia.participantes (
            usuario_id,
            nombre,
            apellido_paterno,
            apellido_materno,
            fecha_nacimiento,
            sexo,
            telefono,
            correo
        )
        VALUES (
            p_usuario_id,
            TRIM(p_nombre),
            TRIM(p_apellido_paterno),
            NULLIF(TRIM(p_apellido_materno), ''),
            p_fecha_nacimiento,
            p_sexo,
            NULLIF(TRIM(p_telefono), ''),
            NULLIF(TRIM(p_correo), '')
        )
        RETURNING id_participante
        INTO v_id_participante;

    END IF;


    /* 5. EVITAR DUPLICADO EN LA MISMA COMPRA */

    IF EXISTS (
        SELECT 1
        FROM academia.compra_participantes cp
        WHERE cp.id_compra = p_compra_id
          AND cp.id_participante = v_id_participante
    ) THEN
        RAISE EXCEPTION
            'El participante ya está relacionado con esta compra';
    END IF;


	/* 6. OBTENER EL MENOR NÚMERO DE CUPO DISPONIBLE */
	
	SELECT gs.numero_cupo
	INTO v_numero_cupo
	FROM GENERATE_SERIES(
	    1,
	    v_cantidad_cupos
	) AS gs(numero_cupo)
	WHERE NOT EXISTS (
	    SELECT 1
	    FROM academia.compra_participantes cp
	    WHERE cp.id_compra = p_compra_id
	      AND cp.numero_cupo = gs.numero_cupo
	      AND cp.estado <> 'Cancelado'
	)
	ORDER BY gs.numero_cupo
	LIMIT 1;
	
	IF v_numero_cupo IS NULL THEN
	    RAISE EXCEPTION
	        'La compra ya no tiene cupos disponibles';
	END IF;


    /* 7. CREAR RELACIÓN */

    INSERT INTO academia.compra_participantes (
        id_compra,
        id_participante,
        numero_cupo,
        estado,
        observaciones
    )
    VALUES (
        p_compra_id,
        v_id_participante,
        v_numero_cupo,
        'Registrado',
        p_observaciones
    )
    RETURNING id_compra_participante
    INTO v_id_compra_participante;


    /* 8. DEVOLVER RESULTADO */

    RETURN QUERY
    SELECT
        v_id_compra_participante,
        v_id_participante,
        v_numero_cupo;

END;
$$;


--
-- Name: cancelar_compra_curso(bigint, integer, text); Type: FUNCTION; Schema: academia; Owner: -
--

CREATE FUNCTION academia.cancelar_compra_curso(p_compra_id bigint, p_usuario_responsable integer, p_motivo text) RETURNS TABLE(id_compra bigint, folio_compra character varying, estado_anterior character varying, estado_nuevo character varying, cupos_liberados integer, pagos_cancelados integer, participantes_cancelados integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_curso_id INTEGER;
    v_folio_compra VARCHAR(20);
    v_cantidad_cupos INTEGER;

    v_estado_actual_id SMALLINT;
    v_estado_actual_nombre VARCHAR(60);
    v_estado_cancelada_id SMALLINT;

    v_cupo_maximo INTEGER;
    v_cupos_ocupados INTEGER;
    v_cupos_despues INTEGER;
    v_cupos_a_liberar INTEGER;

    v_pagos_aprobados INTEGER;
    v_pagos_cancelados INTEGER := 0;
    v_participantes_cancelados INTEGER := 0;
BEGIN

    /* =====================================================
       1. VALIDAR PARÁMETROS
       ===================================================== */

    IF p_compra_id IS NULL THEN
        RAISE EXCEPTION
            'La compra es obligatoria';
    END IF;

    IF p_usuario_responsable IS NULL THEN
        RAISE EXCEPTION
            'El usuario responsable es obligatorio';
    END IF;

    IF p_motivo IS NULL
       OR LENGTH(TRIM(p_motivo)) = 0 THEN
        RAISE EXCEPTION
            'El motivo de cancelación es obligatorio';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM seguridad.usuarios u
        WHERE u.id = p_usuario_responsable
    ) THEN
        RAISE EXCEPTION
            'El usuario responsable % no existe',
            p_usuario_responsable;
    END IF;


    /* =====================================================
       2. BLOQUEAR Y CONSULTAR LA COMPRA
       ===================================================== */

    SELECT
        cc.idcurso,
        cc.foliocompra,
        cc.cantidadcupos,
        cc.idestadocompra,
        ec.nombre
    INTO
        v_curso_id,
        v_folio_compra,
        v_cantidad_cupos,
        v_estado_actual_id,
        v_estado_actual_nombre
    FROM academia.comprascursosinacademia cc
    INNER JOIN academia.estadocomprainacademia ec
        ON ec.idestadocompra = cc.idestadocompra
    WHERE cc.idcompra = p_compra_id
    FOR UPDATE OF cc;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'La compra % no existe',
            p_compra_id;
    END IF;


    /* =====================================================
       3. VALIDAR ESTADO ACTUAL
       ===================================================== */

    IF v_estado_actual_nombre = 'Cancelada' THEN
        RAISE EXCEPTION
            'La compra ya está cancelada';
    END IF;

    IF v_estado_actual_nombre IN (
        'Rechazada',
        'Expirada'
    ) THEN
        RAISE EXCEPTION
            'La compra no puede cancelarse porque su estado actual es "%"',
            v_estado_actual_nombre;
    END IF;

    IF v_estado_actual_nombre = 'Inscripciones generadas' THEN
        RAISE EXCEPTION
            'La compra ya generó inscripciones y requiere un proceso de reversión académica';
    END IF;

    IF v_estado_actual_nombre = 'Pago validado' THEN
        RAISE EXCEPTION
            'La compra tiene el pago validado y requiere un proceso de devolución';
    END IF;


    /* =====================================================
       4. IMPEDIR CANCELACIÓN CON PAGOS APROBADOS
       ===================================================== */

    SELECT COUNT(*)
    INTO v_pagos_aprobados
    FROM academia.pagos_cursos pc
    WHERE pc.id_compra = p_compra_id
      AND pc.estado = 'Aprobado';

    IF v_pagos_aprobados > 0 THEN
        RAISE EXCEPTION
            'La compra tiene % pago(s) aprobado(s) y no puede cancelarse sin devolución',
            v_pagos_aprobados;
    END IF;


    /* =====================================================
       5. BLOQUEAR EL CURSO
       ===================================================== */

    SELECT
        c.cupo_maximo,
        COALESCE(c.cupos_ocupados, 0)
    INTO
        v_cupo_maximo,
        v_cupos_ocupados
    FROM academia.cursos c
    WHERE c.id_curso = v_curso_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'El curso asociado a la compra no existe';
    END IF;


    /* =====================================================
       6. CALCULAR CUPOS A LIBERAR
       ===================================================== */

    /*
       La reserva completa se realizó al crear la compra.
       GREATEST evita que cupos_ocupados quede en negativo.
    */

    v_cupos_a_liberar :=
        LEAST(
            v_cantidad_cupos,
            v_cupos_ocupados
        );

    v_cupos_despues :=
        GREATEST(
            v_cupos_ocupados - v_cupos_a_liberar,
            0
        );


    /* =====================================================
       7. LIBERAR CUPOS
       ===================================================== */

    UPDATE academia.cursos
    SET cupos_ocupados = v_cupos_despues
    WHERE id_curso = v_curso_id;


    /* =====================================================
       8. REGISTRAR MOVIMIENTO DE CUPOS
       ===================================================== */

    INSERT INTO academia.movimientos_cupos_curso (
        curso_id,
        compra_id,
        tipo_movimiento,
        cantidad,
        cupos_antes,
        cupos_despues,
        usuario_responsable,
        motivo
    )
    VALUES (
        v_curso_id,
        p_compra_id,
        'Liberación',
        v_cupos_a_liberar,
        v_cupos_ocupados,
        v_cupos_despues,
        p_usuario_responsable,
        CONCAT(
            'Cancelación de compra: ',
            TRIM(p_motivo)
        )
    );


    /* =====================================================
       9. CANCELAR PAGOS REPORTADOS
       ===================================================== */

    UPDATE academia.pagos_cursos
    SET
        estado = 'Cancelado',
        observaciones = CASE
            WHEN observaciones IS NULL
              OR LENGTH(TRIM(observaciones)) = 0
            THEN CONCAT(
                'Pago cancelado por cancelación de compra. Motivo: ',
                TRIM(p_motivo)
            )
            ELSE CONCAT(
                observaciones,
                E'\nPago cancelado por cancelación de compra. Motivo: ',
                TRIM(p_motivo)
            )
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id_compra = p_compra_id
      AND estado = 'Reportado';

    GET DIAGNOSTICS
        v_pagos_cancelados = ROW_COUNT;


    /* =====================================================
       10. CANCELAR PARTICIPANTES DE LA COMPRA
       ===================================================== */

    UPDATE academia.compra_participantes
    SET
        estado = 'Cancelado',
        observaciones = CASE
            WHEN observaciones IS NULL
              OR LENGTH(TRIM(observaciones)) = 0
            THEN CONCAT(
                'Cancelado por cancelación de compra. Motivo: ',
                TRIM(p_motivo)
            )
            ELSE CONCAT(
                observaciones,
                E'\nCancelado por cancelación de compra. Motivo: ',
                TRIM(p_motivo)
            )
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id_compra = p_compra_id
      AND estado <> 'Cancelado';

    GET DIAGNOSTICS
        v_participantes_cancelados = ROW_COUNT;


    /* =====================================================
       11. OBTENER ESTADO "CANCELADA"
       ===================================================== */

    SELECT ec.idestadocompra
    INTO v_estado_cancelada_id
    FROM academia.estadocomprainacademia ec
    WHERE ec.nombre = 'Cancelada'
      AND ec.activo = TRUE;

    IF v_estado_cancelada_id IS NULL THEN
        RAISE EXCEPTION
            'No existe el estado activo "Cancelada"';
    END IF;


    /* =====================================================
       12. ACTUALIZAR LA COMPRA
       ===================================================== */

    UPDATE academia.comprascursosinacademia
    SET idestadocompra = v_estado_cancelada_id
    WHERE idcompra = p_compra_id;


    /* =====================================================
       13. REGISTRAR HISTORIAL
       ===================================================== */

    INSERT INTO academia.historial_estados_compra (
        id_compra,
        id_estado_anterior,
        id_estado_nuevo,
        usuario_responsable,
        origen_cambio,
        motivo
    )
    VALUES (
        p_compra_id,
        v_estado_actual_id,
        v_estado_cancelada_id,
        p_usuario_responsable,
        'Administrador',
        CONCAT(
            'Compra cancelada. Motivo: ',
            TRIM(p_motivo),
            '. Cupos liberados: ',
            v_cupos_a_liberar,
            '. Pagos reportados cancelados: ',
            v_pagos_cancelados,
            '. Participantes cancelados: ',
            v_participantes_cancelados
        )
    );


    /* =====================================================
       14. DEVOLVER RESULTADO
       ===================================================== */

    RETURN QUERY
    SELECT
        p_compra_id,
        v_folio_compra,
        v_estado_actual_nombre,
        'Cancelada'::VARCHAR(60),
        v_cupos_a_liberar,
        v_pagos_cancelados,
        v_participantes_cancelados;

END;
$$;


--
-- Name: crear_compra_curso(integer, integer, smallint, numeric, integer, text); Type: FUNCTION; Schema: academia; Owner: -
--

CREATE FUNCTION academia.crear_compra_curso(p_usuario_id integer, p_curso_id integer, p_cantidad_cupos smallint, p_descuento numeric DEFAULT 0, p_horas_limite_pago integer DEFAULT 48, p_observaciones text DEFAULT NULL::text) RETURNS TABLE(id_compra bigint, folio_compra character varying, total_compra numeric, fecha_limite_pago timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cupo_maximo INTEGER;
    v_cupos_ocupados INTEGER;
    v_cupos_disponibles INTEGER;

    v_precio_unitario NUMERIC(10,2);
    v_subtotal NUMERIC(10,2);
    v_total NUMERIC(10,2);

    v_estado_pendiente SMALLINT;

    v_id_compra BIGINT;
    v_folio_compra VARCHAR(20);
    v_fecha_limite_pago TIMESTAMP;
BEGIN

    /* =====================================================
       1. VALIDACIONES DE PARÁMETROS
       ===================================================== */

    IF p_usuario_id IS NULL THEN
        RAISE EXCEPTION
            'El usuario es obligatorio';
    END IF;

    IF p_curso_id IS NULL THEN
        RAISE EXCEPTION
            'El curso es obligatorio';
    END IF;

    IF p_cantidad_cupos IS NULL
       OR p_cantidad_cupos <= 0 THEN
        RAISE EXCEPTION
            'La cantidad de cupos debe ser mayor que cero';
    END IF;

    IF p_descuento IS NULL
       OR p_descuento < 0 THEN
        RAISE EXCEPTION
            'El descuento no puede ser negativo';
    END IF;

    IF p_horas_limite_pago IS NULL
       OR p_horas_limite_pago <= 0 THEN
        RAISE EXCEPTION
            'Las horas límite de pago deben ser mayores que cero';
    END IF;


    /* =====================================================
       2. VALIDAR QUE EL USUARIO EXISTA
       ===================================================== */

    IF NOT EXISTS (
        SELECT 1
        FROM seguridad.usuarios u
        WHERE u.id = p_usuario_id
    ) THEN
        RAISE EXCEPTION
            'El usuario % no existe',
            p_usuario_id;
    END IF;


    /* =====================================================
       3. BLOQUEAR Y CONSULTAR EL CURSO
       ===================================================== */

    SELECT
        c.cupo_maximo,
        COALESCE(c.cupos_ocupados, 0),
        c.costo
    INTO
        v_cupo_maximo,
        v_cupos_ocupados,
        v_precio_unitario
    FROM academia.cursos c
    WHERE c.id_curso = p_curso_id
      AND c.activo = TRUE
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'El curso % no existe o está inactivo',
            p_curso_id;
    END IF;


    /* =====================================================
       4. VALIDAR CONFIGURACIÓN DEL CURSO
       ===================================================== */

    IF v_cupo_maximo IS NULL
       OR v_cupo_maximo <= 0 THEN
        RAISE EXCEPTION
            'El curso no tiene un cupo máximo válido';
    END IF;

    IF v_precio_unitario IS NULL
       OR v_precio_unitario < 0 THEN
        RAISE EXCEPTION
            'El curso no tiene un precio válido';
    END IF;

    v_cupos_disponibles :=
        v_cupo_maximo - v_cupos_ocupados;

    IF p_cantidad_cupos > v_cupos_disponibles THEN
        RAISE EXCEPTION
            'No hay suficientes cupos. Disponibles: %, solicitados: %',
            v_cupos_disponibles,
            p_cantidad_cupos;
    END IF;


    /* =====================================================
       5. CALCULAR IMPORTES
       ===================================================== */

    v_subtotal :=
        v_precio_unitario * p_cantidad_cupos;

    IF p_descuento > v_subtotal THEN
        RAISE EXCEPTION
            'El descuento no puede superar el subtotal';
    END IF;

    v_total :=
        v_subtotal - p_descuento;

    v_fecha_limite_pago :=
        CURRENT_TIMESTAMP
        + MAKE_INTERVAL(hours => p_horas_limite_pago);


    /* =====================================================
       6. OBTENER ESTADO PENDIENTE DE PAGO
       ===================================================== */

    SELECT ec.idestadocompra
    INTO v_estado_pendiente
    FROM academia.estadocomprainacademia ec
    WHERE ec.nombre = 'Pendiente de pago'
      AND ec.activo = TRUE;

    IF v_estado_pendiente IS NULL THEN
        RAISE EXCEPTION
            'No existe el estado activo "Pendiente de pago"';
    END IF;


    /* =====================================================
       7. CREAR LA COMPRA
       ===================================================== */

    INSERT INTO academia.comprascursosinacademia (
        idusuario,
        idcurso,
        idestadocompra,
        cantidadcupos,
        preciounitario,
        subtotal,
        descuento,
        total,
        fechalimitepago,
        observaciones
    )
    VALUES (
        p_usuario_id,
        p_curso_id,
        v_estado_pendiente,
        p_cantidad_cupos,
        v_precio_unitario,
        v_subtotal,
        p_descuento,
        v_total,
        v_fecha_limite_pago,
        p_observaciones
    )
    RETURNING
        idcompra,
        foliocompra
    INTO
        v_id_compra,
        v_folio_compra;


    /* =====================================================
       8. RESERVAR CUPOS
       ===================================================== */

    UPDATE academia.cursos
    SET cupos_ocupados =
        v_cupos_ocupados + p_cantidad_cupos
    WHERE id_curso = p_curso_id;


    /* =====================================================
       9. REGISTRAR MOVIMIENTO DE CUPOS
       ===================================================== */

    INSERT INTO academia.movimientos_cupos_curso (
        curso_id,
        compra_id,
        tipo_movimiento,
        cantidad,
        cupos_antes,
        cupos_despues,
        usuario_responsable,
        motivo
    )
    VALUES (
        p_curso_id,
        v_id_compra,
        'Reserva',
        p_cantidad_cupos,
        v_cupos_ocupados,
        v_cupos_ocupados + p_cantidad_cupos,
        p_usuario_id,
        'Reserva generada al crear la compra'
    );


    /* =====================================================
       10. REGISTRAR HISTORIAL INICIAL
       ===================================================== */

    INSERT INTO academia.historial_estados_compra (
        id_compra,
        id_estado_anterior,
        id_estado_nuevo,
        usuario_responsable,
        origen_cambio,
        motivo
    )
    VALUES (
        v_id_compra,
        NULL,
        v_estado_pendiente,
        p_usuario_id,
        'Usuario',
        'Creación de la compra'
    );


    /* =====================================================
       11. DEVOLVER RESULTADO
       ===================================================== */

    RETURN QUERY
    SELECT
        v_id_compra,
        v_folio_compra,
        v_total,
        v_fecha_limite_pago;

END;
$$;


--
-- Name: expirar_compras_pendientes(integer); Type: FUNCTION; Schema: academia; Owner: -
--

CREATE FUNCTION academia.expirar_compras_pendientes(p_limite integer DEFAULT 100) RETURNS TABLE(compras_expiradas integer, cupos_liberados integer, participantes_cancelados integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_estado_expirada_id SMALLINT;

    v_compra RECORD;

    v_cupos_ocupados INTEGER;
    v_cupos_a_liberar INTEGER;
    v_cupos_despues INTEGER;

    v_total_compras_expiradas INTEGER := 0;
    v_total_cupos_liberados INTEGER := 0;
    v_total_participantes_cancelados INTEGER := 0;
    v_participantes_compra INTEGER := 0;
BEGIN

    /* =====================================================
       1. VALIDAR PARÁMETROS
       ===================================================== */

    IF p_limite IS NULL OR p_limite <= 0 THEN
        RAISE EXCEPTION
            'El límite debe ser mayor que cero';
    END IF;

    IF p_limite > 1000 THEN
        RAISE EXCEPTION
            'El límite máximo por ejecución es 1000';
    END IF;


    /* =====================================================
       2. OBTENER ESTADO "EXPIRADA"
       ===================================================== */

    SELECT ec.idestadocompra
    INTO v_estado_expirada_id
    FROM academia.estadocomprainacademia ec
    WHERE ec.nombre = 'Expirada'
      AND ec.activo = TRUE;

    IF v_estado_expirada_id IS NULL THEN
        RAISE EXCEPTION
            'No existe el estado activo "Expirada"';
    END IF;


    /* =====================================================
       3. LOCALIZAR Y BLOQUEAR COMPRAS VENCIDAS
       ===================================================== */

    FOR v_compra IN

        SELECT
            cc.idcompra,
            cc.foliocompra,
            cc.idcurso,
            cc.cantidadcupos,
            cc.idestadocompra
        FROM academia.comprascursosinacademia cc

        INNER JOIN academia.estadocomprainacademia ec
            ON ec.idestadocompra = cc.idestadocompra

        WHERE ec.nombre = 'Pendiente de pago'
          AND cc.fechalimitepago IS NOT NULL
          AND cc.fechalimitepago < CURRENT_TIMESTAMP

        ORDER BY
            cc.fechalimitepago,
            cc.idcompra

        LIMIT p_limite

        FOR UPDATE OF cc SKIP LOCKED

    LOOP

        /* =================================================
           4. BLOQUEAR EL CURSO
           ================================================= */

        SELECT COALESCE(c.cupos_ocupados, 0)
        INTO v_cupos_ocupados
        FROM academia.cursos c
        WHERE c.id_curso = v_compra.idcurso
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION
                'El curso % asociado a la compra % no existe',
                v_compra.idcurso,
                v_compra.idcompra;
        END IF;


        /* =================================================
           5. CALCULAR CUPOS A LIBERAR
           ================================================= */

        v_cupos_a_liberar :=
            LEAST(
                v_compra.cantidadcupos,
                v_cupos_ocupados
            );

        v_cupos_despues :=
            GREATEST(
                v_cupos_ocupados - v_cupos_a_liberar,
                0
            );


        /* =================================================
           6. ACTUALIZAR CUPOS DEL CURSO
           ================================================= */

        UPDATE academia.cursos
        SET cupos_ocupados = v_cupos_despues
        WHERE id_curso = v_compra.idcurso;


        /* =================================================
           7. REGISTRAR MOVIMIENTO DE CUPOS
           ================================================= */

        INSERT INTO academia.movimientos_cupos_curso (
            curso_id,
            compra_id,
            tipo_movimiento,
            cantidad,
            cupos_antes,
            cupos_despues,
            usuario_responsable,
            motivo
        )
        VALUES (
            v_compra.idcurso,
            v_compra.idcompra,
            'Liberación',
            v_cupos_a_liberar,
            v_cupos_ocupados,
            v_cupos_despues,
            NULL,
            'Liberación automática por vencimiento del plazo de pago'
        );


        /* =================================================
           8. CANCELAR PARTICIPANTES RELACIONADOS
           ================================================= */

        UPDATE academia.compra_participantes
        SET
            estado = 'Cancelado',

            observaciones = CASE
                WHEN observaciones IS NULL
                  OR LENGTH(TRIM(observaciones)) = 0
                THEN
                    'Cancelado automáticamente por expiración de la compra'
                ELSE
                    CONCAT(
                        observaciones,
                        E'\nCancelado automáticamente por expiración de la compra'
                    )
            END,

            updated_at = CURRENT_TIMESTAMP

        WHERE id_compra = v_compra.idcompra
          AND estado <> 'Cancelado';

        GET DIAGNOSTICS
            v_participantes_compra = ROW_COUNT;


        /* =================================================
           9. CAMBIAR COMPRA A "EXPIRADA"
           ================================================= */

        UPDATE academia.comprascursosinacademia
        SET idestadocompra = v_estado_expirada_id
        WHERE idcompra = v_compra.idcompra;


        /* =================================================
           10. REGISTRAR HISTORIAL
           ================================================= */

        INSERT INTO academia.historial_estados_compra (
            id_compra,
            id_estado_anterior,
            id_estado_nuevo,
            usuario_responsable,
            origen_cambio,
            motivo
        )
        VALUES (
            v_compra.idcompra,
            v_compra.idestadocompra,
            v_estado_expirada_id,
            NULL,
            'Sistema',
            CONCAT(
                'Compra expirada automáticamente por vencimiento del plazo de pago. Cupos liberados: ',
                v_cupos_a_liberar,
                '. Participantes cancelados: ',
                v_participantes_compra
            )
        );



        /* =================================================
           12. ACUMULAR RESULTADOS
           ================================================= */

        v_total_compras_expiradas :=
            v_total_compras_expiradas + 1;

        v_total_cupos_liberados :=
            v_total_cupos_liberados
            + v_cupos_a_liberar;

        v_total_participantes_cancelados :=
            v_total_participantes_cancelados
            + v_participantes_compra;

    END LOOP;


    /* =====================================================
       13. DEVOLVER RESUMEN
       ===================================================== */

    RETURN QUERY
    SELECT
        v_total_compras_expiradas,
        v_total_cupos_liberados,
        v_total_participantes_cancelados;

END;
$$;


--
-- Name: generar_folio_compra(); Type: FUNCTION; Schema: academia; Owner: -
--

CREATE FUNCTION academia.generar_folio_compra() RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_consecutivo BIGINT;
    v_anio VARCHAR(4);
    v_folio VARCHAR(20);
BEGIN
    v_consecutivo := NEXTVAL(
        'academia.seq_folio_compra'
    );

    v_anio := TO_CHAR(
        CURRENT_DATE,
        'YYYY'
    );

    v_folio := CONCAT(
        'CMP-',
        v_anio,
        '-',
        LPAD(
            v_consecutivo::TEXT,
            6,
            '0'
        )
    );

    RETURN v_folio;
END;
$$;


--
-- Name: generar_inscripciones_compra(bigint, integer, text); Type: FUNCTION; Schema: academia; Owner: -
--

CREATE FUNCTION academia.generar_inscripciones_compra(p_compra_id bigint, p_usuario_responsable integer, p_observaciones text DEFAULT NULL::text) RETURNS TABLE(id_compra bigint, folio_compra character varying, inscripciones_creadas integer, inscripciones_existentes integer, estado_compra character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_curso_id INTEGER;
    v_folio_compra VARCHAR(20);

    v_estado_actual_id SMALLINT;
    v_estado_actual_nombre VARCHAR(60);

    v_estado_inscripciones_id SMALLINT;

    v_total_participantes INTEGER;
    v_inscripciones_creadas INTEGER := 0;
    v_inscripciones_existentes INTEGER := 0;

    v_registro RECORD;
BEGIN

    /* =====================================================
       1. VALIDAR PARÁMETROS
       ===================================================== */

    IF p_compra_id IS NULL THEN
        RAISE EXCEPTION
            'La compra es obligatoria';
    END IF;

    IF p_usuario_responsable IS NULL THEN
        RAISE EXCEPTION
            'El usuario responsable es obligatorio';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM seguridad.usuarios u
        WHERE u.id = p_usuario_responsable
    ) THEN
        RAISE EXCEPTION
            'El usuario responsable % no existe',
            p_usuario_responsable;
    END IF;


    /* =====================================================
       2. BLOQUEAR Y CONSULTAR LA COMPRA
       ===================================================== */

    SELECT
        cc.idcurso,
        cc.foliocompra,
        cc.idestadocompra,
        ec.nombre
    INTO
        v_curso_id,
        v_folio_compra,
        v_estado_actual_id,
        v_estado_actual_nombre
    FROM academia.comprascursosinacademia cc
    INNER JOIN academia.estadocomprainacademia ec
        ON ec.idestadocompra = cc.idestadocompra
    WHERE cc.idcompra = p_compra_id
    FOR UPDATE OF cc;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'La compra % no existe',
            p_compra_id;
    END IF;


    /* =====================================================
       3. VALIDAR ESTADO DE LA COMPRA
       ===================================================== */

    IF v_estado_actual_nombre = 'Inscripciones generadas' THEN

        RETURN QUERY
        SELECT
            p_compra_id,
            v_folio_compra,
            0,
            (
                SELECT COUNT(*)::INTEGER
                FROM academia.inscripciones_cursos ic
                INNER JOIN academia.compra_participantes cp
                    ON cp.id_compra_participante =
                       ic.compra_participante_id
                WHERE cp.id_compra = p_compra_id
            ),
            v_estado_actual_nombre;

        RETURN;
    END IF;

    IF v_estado_actual_nombre <> 'Pago validado' THEN
        RAISE EXCEPTION
            'La compra debe estar en estado "Pago validado". Estado actual: "%"',
            v_estado_actual_nombre;
    END IF;


    /* =====================================================
       4. CONTAR PARTICIPANTES ACTIVOS
       ===================================================== */

    SELECT COUNT(*)
    INTO v_total_participantes
    FROM academia.compra_participantes cp
    INNER JOIN academia.participantes p
        ON p.id_participante = cp.id_participante
    WHERE cp.id_compra = p_compra_id
      AND cp.estado <> 'Cancelado'
      AND p.activo = TRUE;

    IF v_total_participantes = 0 THEN
        RAISE EXCEPTION
            'La compra no tiene participantes activos registrados';
    END IF;


    /* =====================================================
       5. GENERAR INSCRIPCIONES
       ===================================================== */

    FOR v_registro IN

        SELECT
            cp.id_compra_participante,
            cp.id_participante,
            p.usuario_id,
            cp.numero_cupo
        FROM academia.compra_participantes cp
        INNER JOIN academia.participantes p
            ON p.id_participante = cp.id_participante
        WHERE cp.id_compra = p_compra_id
          AND cp.estado <> 'Cancelado'
          AND p.activo = TRUE
        ORDER BY cp.numero_cupo

    LOOP

        IF EXISTS (
            SELECT 1
            FROM academia.inscripciones_cursos ic
            WHERE ic.compra_participante_id =
                  v_registro.id_compra_participante
        ) THEN

            v_inscripciones_existentes :=
                v_inscripciones_existentes + 1;

        ELSE

            INSERT INTO academia.inscripciones_cursos (
                curso_id,
                usuario_id,
                fecha_inscripcion,
                estado,
                monto_pagado,
                metodo_pago,
                participante_id,
                compra_participante_id,
                origen_inscripcion,
                fecha_confirmacion,
                observaciones
            )
            VALUES (
                v_curso_id,
                v_registro.usuario_id,
                CURRENT_TIMESTAMP,
                'activo',
                NULL,
                NULL,
                v_registro.id_participante,
                v_registro.id_compra_participante,
                'Compra en línea',
                CURRENT_TIMESTAMP,
                COALESCE(
                    p_observaciones,
                    CONCAT(
                        'Inscripción generada desde la compra ',
                        v_folio_compra
                    )
                )
            );

            v_inscripciones_creadas :=
                v_inscripciones_creadas + 1;

        END IF;


        /* Actualizar vínculo de participante */

        UPDATE academia.compra_participantes
        SET
            estado = 'Inscrito',
            updated_at = CURRENT_TIMESTAMP
        WHERE id_compra_participante =
              v_registro.id_compra_participante
          AND estado <> 'Cancelado';

    END LOOP;


    /* =====================================================
       6. OBTENER ESTADO "INSCRIPCIONES GENERADAS"
       ===================================================== */

    SELECT ec.idestadocompra
    INTO v_estado_inscripciones_id
    FROM academia.estadocomprainacademia ec
    WHERE ec.nombre = 'Inscripciones generadas'
      AND ec.activo = TRUE;

    IF v_estado_inscripciones_id IS NULL THEN
        RAISE EXCEPTION
            'No existe el estado activo "Inscripciones generadas"';
    END IF;


    /* =====================================================
       7. ACTUALIZAR LA COMPRA
       ===================================================== */

    UPDATE academia.comprascursosinacademia
    SET idestadocompra =
        v_estado_inscripciones_id
    WHERE idcompra = p_compra_id;


    /* =====================================================
       8. REGISTRAR HISTORIAL
       ===================================================== */

    INSERT INTO academia.historial_estados_compra (
        id_compra,
        id_estado_anterior,
        id_estado_nuevo,
        usuario_responsable,
        origen_cambio,
        motivo
    )
    VALUES (
        p_compra_id,
        v_estado_actual_id,
        v_estado_inscripciones_id,
        p_usuario_responsable,
        'Administrador',
        CONCAT(
            'Inscripciones generadas. Nuevas: ',
            v_inscripciones_creadas,
            '. Existentes: ',
            v_inscripciones_existentes
        )
    );


    /* =====================================================
       9. DEVOLVER RESULTADO
       ===================================================== */

    RETURN QUERY
    SELECT
        p_compra_id,
        v_folio_compra,
        v_inscripciones_creadas,
        v_inscripciones_existentes,
        'Inscripciones generadas'::VARCHAR(60);

END;
$$;


--
-- Name: reportar_pago_curso(bigint, smallint, numeric, timestamp without time zone, character varying, text, character varying, character varying, text); Type: FUNCTION; Schema: academia; Owner: -
--

CREATE FUNCTION academia.reportar_pago_curso(p_compra_id bigint, p_metodo_pago_id smallint, p_monto numeric, p_fecha_pago timestamp without time zone, p_referencia character varying DEFAULT NULL::character varying, p_ruta_comprobante text DEFAULT NULL::text, p_nombre_archivo_original character varying DEFAULT NULL::character varying, p_tipo_archivo character varying DEFAULT NULL::character varying, p_observaciones text DEFAULT NULL::text) RETURNS TABLE(id_pago bigint, id_compra bigint, folio_compra character varying, monto_reportado numeric, saldo_restante numeric, estado_pago character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_folio_compra VARCHAR(20);
    v_total_compra NUMERIC(10,2);
    v_estado_actual_id SMALLINT;
    v_estado_actual_nombre VARCHAR(60);

    v_estado_pago_reportado_id SMALLINT;

    v_metodo_activo BOOLEAN;
    v_requiere_comprobante BOOLEAN;

    v_total_pagos_registrados NUMERIC(10,2);
    v_saldo_disponible NUMERIC(10,2);
    v_saldo_restante NUMERIC(10,2);

    v_id_pago BIGINT;
BEGIN

    /* =====================================================
       1. VALIDAR PARÁMETROS
       ===================================================== */

    IF p_compra_id IS NULL THEN
        RAISE EXCEPTION
            'La compra es obligatoria';
    END IF;

    IF p_metodo_pago_id IS NULL THEN
        RAISE EXCEPTION
            'El método de pago es obligatorio';
    END IF;

    IF p_monto IS NULL OR p_monto <= 0 THEN
        RAISE EXCEPTION
            'El monto reportado debe ser mayor que cero';
    END IF;

    IF p_fecha_pago IS NULL THEN
        RAISE EXCEPTION
            'La fecha del pago es obligatoria';
    END IF;

    IF p_fecha_pago > CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION
            'La fecha del pago no puede ser futura';
    END IF;


    /* =====================================================
       2. BLOQUEAR Y OBTENER LA COMPRA
       ===================================================== */

    SELECT
        cc.foliocompra,
        cc.total,
        cc.idestadocompra,
        ec.nombre
    INTO
        v_folio_compra,
        v_total_compra,
        v_estado_actual_id,
        v_estado_actual_nombre
    FROM academia.comprascursosinacademia cc
    INNER JOIN academia.estadocomprainacademia ec
        ON ec.idestadocompra = cc.idestadocompra
    WHERE cc.idcompra = p_compra_id
    FOR UPDATE OF cc;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'La compra % no existe',
            p_compra_id;
    END IF;


    /* =====================================================
       3. VALIDAR ESTADO DE LA COMPRA
       ===================================================== */

    IF v_estado_actual_nombre IN (
        'Cancelada',
        'Rechazada',
        'Expirada'
    ) THEN
        RAISE EXCEPTION
            'No se puede reportar un pago para una compra con estado "%"',
            v_estado_actual_nombre;
    END IF;

    IF v_estado_actual_nombre = 'Inscripciones generadas' THEN
        RAISE EXCEPTION
            'La compra ya fue completada y generó inscripciones';
    END IF;


    /* =====================================================
       4. VALIDAR MÉTODO DE PAGO
       ===================================================== */

    SELECT
        mp.activo,
        mp.requiere_comprobante
    INTO
        v_metodo_activo,
        v_requiere_comprobante
    FROM academia.metodos_pago_cursos mp
    WHERE mp.id_metodo_pago = p_metodo_pago_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'El método de pago % no existe',
            p_metodo_pago_id;
    END IF;

    IF v_metodo_activo = FALSE THEN
        RAISE EXCEPTION
            'El método de pago seleccionado está inactivo';
    END IF;


    /* =====================================================
       5. VALIDAR COMPROBANTE
       ===================================================== */

    IF v_requiere_comprobante = TRUE
       AND (
           p_ruta_comprobante IS NULL
           OR LENGTH(TRIM(p_ruta_comprobante)) = 0
       ) THEN
        RAISE EXCEPTION
            'El método de pago seleccionado requiere comprobante';
    END IF;

    IF p_nombre_archivo_original IS NOT NULL
       AND (
           p_ruta_comprobante IS NULL
           OR LENGTH(TRIM(p_ruta_comprobante)) = 0
       ) THEN
        RAISE EXCEPTION
            'No puede registrarse un nombre de archivo sin una ruta de comprobante';
    END IF;

    IF p_tipo_archivo IS NOT NULL
       AND (
           p_ruta_comprobante IS NULL
           OR LENGTH(TRIM(p_ruta_comprobante)) = 0
       ) THEN
        RAISE EXCEPTION
            'No puede registrarse un tipo de archivo sin una ruta de comprobante';
    END IF;


    /* =====================================================
       6. CALCULAR SALDO DISPONIBLE
       ===================================================== */

    SELECT
        COALESCE(
            SUM(pc.monto) FILTER (
                WHERE pc.estado IN (
                    'Reportado',
                    'Aprobado'
                )
            ),
            0
        )
    INTO v_total_pagos_registrados
    FROM academia.pagos_cursos pc
    WHERE pc.id_compra = p_compra_id;

    v_saldo_disponible :=
        v_total_compra - v_total_pagos_registrados;

    IF v_saldo_disponible <= 0 THEN
        RAISE EXCEPTION
            'La compra ya no tiene saldo pendiente';
    END IF;

    IF p_monto > v_saldo_disponible THEN
        RAISE EXCEPTION
            'El monto reportado (%) supera el saldo disponible (%)',
            p_monto,
            v_saldo_disponible;
    END IF;

    v_saldo_restante :=
        v_saldo_disponible - p_monto;


    /* =====================================================
       7. REGISTRAR EL PAGO
       ===================================================== */

    INSERT INTO academia.pagos_cursos (
        id_compra,
        id_metodo_pago,
        monto,
        referencia,
        ruta_comprobante,
        nombre_archivo_original,
        tipo_archivo,
        estado,
        fecha_pago,
        fecha_reporte,
        observaciones
    )
    VALUES (
        p_compra_id,
        p_metodo_pago_id,
        p_monto,
        NULLIF(TRIM(p_referencia), ''),
        NULLIF(TRIM(p_ruta_comprobante), ''),
        NULLIF(TRIM(p_nombre_archivo_original), ''),
        NULLIF(TRIM(p_tipo_archivo), ''),
        'Reportado',
        p_fecha_pago,
        CURRENT_TIMESTAMP,
        p_observaciones
    )
    RETURNING pagos_cursos.id_pago
    INTO v_id_pago;


    /* =====================================================
       8. OBTENER ESTADO "PAGO REPORTADO"
       ===================================================== */

    SELECT ec.idestadocompra
    INTO v_estado_pago_reportado_id
    FROM academia.estadocomprainacademia ec
    WHERE ec.nombre = 'Pago reportado'
      AND ec.activo = TRUE;

    IF v_estado_pago_reportado_id IS NULL THEN
        RAISE EXCEPTION
            'No existe el estado activo "Pago reportado"';
    END IF;


    /* =====================================================
       9. ACTUALIZAR ESTADO DE LA COMPRA
       ===================================================== */

    IF v_estado_actual_id <> v_estado_pago_reportado_id THEN

        UPDATE academia.comprascursosinacademia
        SET
            idestadocompra = v_estado_pago_reportado_id,
            fechapago = COALESCE(
                fechapago,
                p_fecha_pago
            )
        WHERE idcompra = p_compra_id;


        /* =================================================
           10. REGISTRAR HISTORIAL DEL CAMBIO
           ================================================= */

        INSERT INTO academia.historial_estados_compra (
            id_compra,
            id_estado_anterior,
            id_estado_nuevo,
            usuario_responsable,
            origen_cambio,
            motivo
        )
        VALUES (
            p_compra_id,
            v_estado_actual_id,
            v_estado_pago_reportado_id,
            NULL,
            'Sistema',
            CONCAT(
                'Pago reportado. ID de pago: ',
                v_id_pago
            )
        );

    END IF;


    /* =====================================================
       11. DEVOLVER RESULTADO
       ===================================================== */

    RETURN QUERY
    SELECT
        v_id_pago,
        p_compra_id,
        v_folio_compra,
        p_monto,
        v_saldo_restante,
        'Reportado'::VARCHAR(30);

END;
$$;


--
-- Name: validar_pago_curso(bigint, integer, boolean, text, text); Type: FUNCTION; Schema: academia; Owner: -
--

CREATE FUNCTION academia.validar_pago_curso(p_pago_id bigint, p_usuario_valida integer, p_aprobar boolean, p_motivo_rechazo text DEFAULT NULL::text, p_observaciones text DEFAULT NULL::text) RETURNS TABLE(id_pago bigint, id_compra bigint, folio_compra character varying, estado_pago character varying, estado_compra character varying, total_compra numeric, total_aprobado numeric, saldo_pendiente numeric)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_compra_id BIGINT;
    v_estado_pago_actual VARCHAR(30);
    v_monto_pago NUMERIC(10,2);

    v_folio_compra VARCHAR(20);
    v_total_compra NUMERIC(10,2);
    v_estado_compra_actual_id SMALLINT;
    v_estado_compra_actual_nombre VARCHAR(60);

    v_estado_pago_reportado_id SMALLINT;
    v_estado_pago_validado_id SMALLINT;

    v_total_aprobado NUMERIC(10,2);
    v_saldo_pendiente NUMERIC(10,2);

    v_nuevo_estado_pago VARCHAR(30);
    v_nuevo_estado_compra_id SMALLINT;
    v_nuevo_estado_compra_nombre VARCHAR(60);
BEGIN

    /* =====================================================
       1. VALIDAR PARÁMETROS
       ===================================================== */

    IF p_pago_id IS NULL THEN
        RAISE EXCEPTION
            'El pago es obligatorio';
    END IF;

    IF p_usuario_valida IS NULL THEN
        RAISE EXCEPTION
            'El usuario que valida es obligatorio';
    END IF;

    IF p_aprobar IS NULL THEN
        RAISE EXCEPTION
            'Debe indicarse si el pago será aprobado o rechazado';
    END IF;

    IF p_aprobar = FALSE
       AND (
           p_motivo_rechazo IS NULL
           OR LENGTH(TRIM(p_motivo_rechazo)) = 0
       ) THEN
        RAISE EXCEPTION
            'Debe indicar el motivo del rechazo';
    END IF;


    /* =====================================================
       2. VALIDAR USUARIO ADMINISTRATIVO
       ===================================================== */

    IF NOT EXISTS (
        SELECT 1
        FROM seguridad.usuarios u
        WHERE u.id = p_usuario_valida
    ) THEN
        RAISE EXCEPTION
            'El usuario validador % no existe',
            p_usuario_valida;
    END IF;


    /* =====================================================
       3. BLOQUEAR Y OBTENER EL PAGO
       ===================================================== */

    SELECT
        pc.id_compra,
        pc.estado,
        pc.monto
    INTO
        v_compra_id,
        v_estado_pago_actual,
        v_monto_pago
    FROM academia.pagos_cursos pc
    WHERE pc.id_pago = p_pago_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'El pago % no existe',
            p_pago_id;
    END IF;


    /* =====================================================
       4. VALIDAR ESTADO DEL PAGO
       ===================================================== */

    IF v_estado_pago_actual <> 'Reportado' THEN
        RAISE EXCEPTION
            'El pago no puede validarse porque su estado actual es "%"',
            v_estado_pago_actual;
    END IF;


    /* =====================================================
       5. BLOQUEAR Y OBTENER LA COMPRA
       ===================================================== */

    SELECT
        cc.foliocompra,
        cc.total,
        cc.idestadocompra,
        ec.nombre
    INTO
        v_folio_compra,
        v_total_compra,
        v_estado_compra_actual_id,
        v_estado_compra_actual_nombre
    FROM academia.comprascursosinacademia cc
    INNER JOIN academia.estadocomprainacademia ec
        ON ec.idestadocompra = cc.idestadocompra
    WHERE cc.idcompra = v_compra_id
    FOR UPDATE OF cc;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'La compra asociada al pago no existe';
    END IF;

    IF v_estado_compra_actual_nombre IN (
        'Cancelada',
        'Rechazada',
        'Expirada',
        'Inscripciones generadas'
    ) THEN
        RAISE EXCEPTION
            'No se puede validar el pago porque la compra tiene estado "%"',
            v_estado_compra_actual_nombre;
    END IF;


    /* =====================================================
       6. RECHAZAR PAGO
       ===================================================== */

    IF p_aprobar = FALSE THEN

        UPDATE academia.pagos_cursos
        SET
            estado = 'Rechazado',
            fecha_validacion = CURRENT_TIMESTAMP,
            usuario_valida = p_usuario_valida,
            motivo_rechazo = TRIM(p_motivo_rechazo),
            observaciones = COALESCE(
                p_observaciones,
                observaciones
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE academia.pagos_cursos.id_pago = p_pago_id;


        /* Calcular pagos aprobados restantes */

        SELECT
            COALESCE(SUM(pc.monto), 0)
        INTO v_total_aprobado
        FROM academia.pagos_cursos pc
        WHERE pc.id_compra = v_compra_id
          AND pc.estado = 'Aprobado';


        v_saldo_pendiente :=
            GREATEST(
                v_total_compra - v_total_aprobado,
                0
            );


        /* Obtener estado Pago reportado */

        SELECT ec.idestadocompra
        INTO v_estado_pago_reportado_id
        FROM academia.estadocomprainacademia ec
        WHERE ec.nombre = 'Pago reportado'
          AND ec.activo = TRUE;

        IF v_estado_pago_reportado_id IS NULL THEN
            RAISE EXCEPTION
                'No existe el estado activo "Pago reportado"';
        END IF;


        /* La compra permanece en Pago reportado */

        IF v_estado_compra_actual_id
           <> v_estado_pago_reportado_id THEN

            UPDATE academia.comprascursosinacademia
            SET idestadocompra =
                v_estado_pago_reportado_id
            WHERE idcompra = v_compra_id;

            INSERT INTO academia.historial_estados_compra (
                id_compra,
                id_estado_anterior,
                id_estado_nuevo,
                usuario_responsable,
                origen_cambio,
                motivo
            )
            VALUES (
                v_compra_id,
                v_estado_compra_actual_id,
                v_estado_pago_reportado_id,
                p_usuario_valida,
                'Administrador',
                CONCAT(
                    'Pago rechazado. ID de pago: ',
                    p_pago_id,
                    '. Motivo: ',
                    TRIM(p_motivo_rechazo)
                )
            );

        END IF;

        v_nuevo_estado_pago := 'Rechazado';
        v_nuevo_estado_compra_nombre := 'Pago reportado';


    /* =====================================================
       7. APROBAR PAGO
       ===================================================== */

    ELSE

        /* Evitar aprobar más dinero que el total */

        SELECT
            COALESCE(SUM(pc.monto), 0)
        INTO v_total_aprobado
        FROM academia.pagos_cursos pc
        WHERE pc.id_compra = v_compra_id
          AND pc.estado = 'Aprobado';

        IF v_total_aprobado + v_monto_pago
           > v_total_compra THEN
            RAISE EXCEPTION
                'El pago no puede aprobarse porque superaría el total de la compra. Total: %, ya aprobado: %, pago actual: %',
                v_total_compra,
                v_total_aprobado,
                v_monto_pago;
        END IF;


        UPDATE academia.pagos_cursos
        SET
            estado = 'Aprobado',
            fecha_validacion = CURRENT_TIMESTAMP,
            usuario_valida = p_usuario_valida,
            motivo_rechazo = NULL,
            observaciones = COALESCE(
                p_observaciones,
                observaciones
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE academia.pagos_cursos.id_pago = p_pago_id;


        v_total_aprobado :=
            v_total_aprobado + v_monto_pago;

        v_saldo_pendiente :=
            GREATEST(
                v_total_compra - v_total_aprobado,
                0
            );


        /* =================================================
           8. COMPRA TOTALMENTE PAGADA
           ================================================= */

        IF v_total_aprobado >= v_total_compra THEN

            SELECT ec.idestadocompra
            INTO v_estado_pago_validado_id
            FROM academia.estadocomprainacademia ec
            WHERE ec.nombre = 'Pago validado'
              AND ec.activo = TRUE;

            IF v_estado_pago_validado_id IS NULL THEN
                RAISE EXCEPTION
                    'No existe el estado activo "Pago validado"';
            END IF;

            v_nuevo_estado_compra_id :=
                v_estado_pago_validado_id;

            v_nuevo_estado_compra_nombre :=
                'Pago validado';


        /* =================================================
           9. COMPRA CON SALDO PENDIENTE
           ================================================= */

        ELSE

            SELECT ec.idestadocompra
            INTO v_estado_pago_reportado_id
            FROM academia.estadocomprainacademia ec
            WHERE ec.nombre = 'Pago reportado'
              AND ec.activo = TRUE;

            IF v_estado_pago_reportado_id IS NULL THEN
                RAISE EXCEPTION
                    'No existe el estado activo "Pago reportado"';
            END IF;

            v_nuevo_estado_compra_id :=
                v_estado_pago_reportado_id;

            v_nuevo_estado_compra_nombre :=
                'Pago reportado';

        END IF;


        /* =================================================
           10. ACTUALIZAR COMPRA
           ================================================= */

        UPDATE academia.comprascursosinacademia
        SET
            idestadocompra =
                v_nuevo_estado_compra_id,

            fechavalidacion =
                CASE
                    WHEN v_nuevo_estado_compra_nombre =
                         'Pago validado'
                    THEN CURRENT_TIMESTAMP
                    ELSE fechavalidacion
                END,

            usuariovalida =
                CASE
                    WHEN v_nuevo_estado_compra_nombre =
                         'Pago validado'
                    THEN p_usuario_valida
                    ELSE usuariovalida
                END

        WHERE idcompra = v_compra_id;


        /* =================================================
           11. REGISTRAR HISTORIAL
           ================================================= */

        IF v_estado_compra_actual_id
           <> v_nuevo_estado_compra_id THEN

            INSERT INTO academia.historial_estados_compra (
                id_compra,
                id_estado_anterior,
                id_estado_nuevo,
                usuario_responsable,
                origen_cambio,
                motivo
            )
            VALUES (
                v_compra_id,
                v_estado_compra_actual_id,
                v_nuevo_estado_compra_id,
                p_usuario_valida,
                'Administrador',
                CASE
                    WHEN v_nuevo_estado_compra_nombre =
                         'Pago validado'
                    THEN CONCAT(
                        'Pago aprobado y compra totalmente cubierta. ID de pago: ',
                        p_pago_id
                    )
                    ELSE CONCAT(
                        'Pago parcial aprobado. ID de pago: ',
                        p_pago_id,
                        '. Saldo pendiente: ',
                        v_saldo_pendiente
                    )
                END
            );

        END IF;

        v_nuevo_estado_pago := 'Aprobado';

    END IF;


    /* =====================================================
       12. DEVOLVER RESULTADO
       ===================================================== */

    RETURN QUERY
    SELECT
        p_pago_id,
        v_compra_id,
        v_folio_compra,
        v_nuevo_estado_pago,
        v_nuevo_estado_compra_nombre,
        v_total_compra,
        v_total_aprobado,
        v_saldo_pendiente;

END;
$$;


--
-- Name: actualizar_dataset_asociacion_compra(bigint); Type: FUNCTION; Schema: analitica; Owner: -
--

CREATE FUNCTION analitica.actualizar_dataset_asociacion_compra(p_compra_id bigint) RETURNS TABLE(compra_id bigint, accion_realizada character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_compra RECORD;
    v_accion VARCHAR(30);
BEGIN

    IF p_compra_id IS NULL THEN
        RAISE EXCEPTION
            'El identificador de la compra es obligatorio';
    END IF;


    /* =====================================================
       1. OBTENER LA COMPRA Y SUS DATOS ANALÍTICOS
       ===================================================== */

    SELECT
        cc.idcompra,
        cc.idusuario,
        cc.idcurso,
        cc.foliocompra,
        cc.fechacompra,
        cc.total,
        cc.cantidadcupos,
        ec.nombre AS estado_compra,
        c.id_categoria,
        c.id_modalidad
    INTO v_compra
    FROM academia.comprascursosinacademia cc

    INNER JOIN academia.estadocomprainacademia ec
        ON ec.idestadocompra = cc.idestadocompra

    INNER JOIN academia.cursos c
        ON c.id_curso = cc.idcurso

    WHERE cc.idcompra = p_compra_id;


    /* =====================================================
       2. SI LA COMPRA YA NO EXISTE
       ===================================================== */

    IF NOT FOUND THEN

        UPDATE analitica.dataset_reglas_asociacion
        SET
            activo_dataset = FALSE,
            fecha_carga = CURRENT_TIMESTAMP
        WHERE compra_id = p_compra_id
          AND activo_dataset = TRUE;

        IF FOUND THEN
            v_accion := 'Desactivado';
        ELSE
            v_accion := 'Sin registro';
        END IF;

        RETURN QUERY
        SELECT
            p_compra_id,
            v_accion;

        RETURN;
    END IF;


    /* =====================================================
       3. COMPRA VÁLIDA PARA EL DATASET
       ===================================================== */

    IF v_compra.estado_compra IN (
        'Pago validado',
        'Inscripciones generadas'
    ) THEN

        INSERT INTO analitica.dataset_reglas_asociacion (
            id_transaccion_analitica,
            usuario_id,
            curso_id,
            compra_id,
            folio_compra,
            fecha_compra,
            anio_compra,
            mes_compra,
            categoria_id,
            modalidad_id,
            precio_pagado,
            cantidad_cupos,
            estado_compra,
            fecha_carga,
            activo_dataset
        )
        VALUES (
            CONCAT(
                'USR-',
                v_compra.idusuario
            ),
            v_compra.idusuario,
            v_compra.idcurso,
            v_compra.idcompra,
            v_compra.foliocompra,
            v_compra.fechacompra,
            EXTRACT(
                YEAR FROM v_compra.fechacompra
            )::SMALLINT,
            EXTRACT(
                MONTH FROM v_compra.fechacompra
            )::SMALLINT,
            v_compra.id_categoria,
            v_compra.id_modalidad,
            v_compra.total,
            v_compra.cantidadcupos,
            v_compra.estado_compra,
            CURRENT_TIMESTAMP,
            TRUE
        )

        ON CONFLICT (compra_id)
        DO UPDATE SET
            id_transaccion_analitica =
                EXCLUDED.id_transaccion_analitica,

            usuario_id =
                EXCLUDED.usuario_id,

            curso_id =
                EXCLUDED.curso_id,

            folio_compra =
                EXCLUDED.folio_compra,

            fecha_compra =
                EXCLUDED.fecha_compra,

            anio_compra =
                EXCLUDED.anio_compra,

            mes_compra =
                EXCLUDED.mes_compra,

            categoria_id =
                EXCLUDED.categoria_id,

            modalidad_id =
                EXCLUDED.modalidad_id,

            precio_pagado =
                EXCLUDED.precio_pagado,

            cantidad_cupos =
                EXCLUDED.cantidad_cupos,

            estado_compra =
                EXCLUDED.estado_compra,

            fecha_carga =
                CURRENT_TIMESTAMP,

            activo_dataset =
                TRUE;

        v_accion := 'Insertado/actualizado';


    /* =====================================================
       4. COMPRA NO VÁLIDA PARA ASOCIACIONES
       ===================================================== */

    ELSE

        UPDATE analitica.dataset_reglas_asociacion
        SET
            estado_compra =
                v_compra.estado_compra,

            fecha_carga =
                CURRENT_TIMESTAMP,

            activo_dataset =
                FALSE

        WHERE compra_id = p_compra_id;

        IF FOUND THEN
            v_accion := 'Desactivado';
        ELSE
            v_accion := 'No aplicable';
        END IF;

    END IF;


    /* =====================================================
       5. DEVOLVER RESULTADO
       ===================================================== */

    RETURN QUERY
    SELECT
        p_compra_id,
        v_accion;

END;
$$;


--
-- Name: actualizar_dataset_regresion_curso(integer); Type: FUNCTION; Schema: analitica; Owner: -
--

CREATE FUNCTION analitica.actualizar_dataset_regresion_curso(p_curso_id integer) RETURNS TABLE(curso_id integer, accion_realizada character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_existe_curso BOOLEAN;
    v_accion VARCHAR(30);
BEGIN

    /* =====================================================
       1. VALIDAR PARÁMETRO
       ===================================================== */

    IF p_curso_id IS NULL THEN
        RAISE EXCEPTION
            'El identificador del curso es obligatorio';
    END IF;


    /* =====================================================
       2. VERIFICAR SI EL CURSO EXISTE
       ===================================================== */

    SELECT EXISTS (
        SELECT 1
        FROM academia.cursos c
        WHERE c.id_curso = p_curso_id
    )
    INTO v_existe_curso;


    /* =====================================================
       3. SI EL CURSO YA NO EXISTE
       ===================================================== */

    IF v_existe_curso = FALSE THEN

        UPDATE analitica.dataset_regresion_precio_cursos dr
        SET
            activo_dataset = FALSE,
            fecha_carga = CURRENT_TIMESTAMP
        WHERE dr.curso_id = p_curso_id
          AND dr.activo_dataset = TRUE;

        IF FOUND THEN
            v_accion := 'Desactivado';
        ELSE
            v_accion := 'Sin registro';
        END IF;

        RETURN QUERY
        SELECT
            p_curso_id,
            v_accion;

        RETURN;
    END IF;


    /* =====================================================
       4. INSERTAR O ACTUALIZAR MÉTRICAS DEL CURSO
       ===================================================== */

    INSERT INTO analitica.dataset_regresion_precio_cursos (
        curso_id,
        titulo_curso,
        categoria_id,
        modalidad_id,
        ubicacion_id,
        fecha_inicio,
        fecha_fin,
        anio_inicio,
        mes_inicio,
        duracion_dias,
        cupo_maximo,
        cupos_ocupados,
        porcentaje_ocupacion,
        total_compras,
        compras_validas,
        cupos_vendidos,
        compradores_unicos,
        ingresos_aprobados,
        precio_historico,
        ingreso_promedio_por_cupo,
        dias_anticipacion_primera_compra,
        dias_anticipacion_ultima_compra,
        fecha_carga,
        activo_dataset
    )
    SELECT
        c.id_curso,

        c.titulo_curso,

        c.id_categoria,

        c.id_modalidad,

        c.id_ubicacion,

        c.fecha_inicio,

        c.fecha_fin,

        CASE
            WHEN c.fecha_inicio IS NULL
                THEN NULL
            ELSE EXTRACT(
                YEAR FROM c.fecha_inicio
            )::SMALLINT
        END,

        CASE
            WHEN c.fecha_inicio IS NULL
                THEN NULL
            ELSE EXTRACT(
                MONTH FROM c.fecha_inicio
            )::SMALLINT
        END,

        CASE
            WHEN c.fecha_inicio IS NULL
              OR c.fecha_fin IS NULL
                THEN NULL
            ELSE c.fecha_fin - c.fecha_inicio
        END,

        COALESCE(c.cupo_maximo, 0),

        COALESCE(c.cupos_ocupados, 0),

        CASE
            WHEN COALESCE(c.cupo_maximo, 0) = 0
                THEN 0
            ELSE ROUND(
                (
                    COALESCE(
                        c.cupos_ocupados,
                        0
                    )::NUMERIC
                    / c.cupo_maximo::NUMERIC
                ) * 100,
                2
            )
        END,

        COUNT(cc.idcompra)::INTEGER,

        COUNT(cc.idcompra) FILTER (
            WHERE ec.nombre IN (
                'Pago validado',
                'Inscripciones generadas'
            )
        )::INTEGER,

        COALESCE(
            SUM(cc.cantidadcupos) FILTER (
                WHERE ec.nombre IN (
                    'Pago validado',
                    'Inscripciones generadas'
                )
            ),
            0
        )::INTEGER,

        COUNT(DISTINCT cc.idusuario) FILTER (
            WHERE ec.nombre IN (
                'Pago validado',
                'Inscripciones generadas'
            )
        )::INTEGER,

        COALESCE(
            SUM(cc.total) FILTER (
                WHERE ec.nombre IN (
                    'Pago validado',
                    'Inscripciones generadas'
                )
            ),
            0
        ),

        COALESCE(c.costo, 0),

        CASE
            WHEN COALESCE(
                SUM(cc.cantidadcupos) FILTER (
                    WHERE ec.nombre IN (
                        'Pago validado',
                        'Inscripciones generadas'
                    )
                ),
                0
            ) = 0
                THEN 0
            ELSE ROUND(
                COALESCE(
                    SUM(cc.total) FILTER (
                        WHERE ec.nombre IN (
                            'Pago validado',
                            'Inscripciones generadas'
                        )
                    ),
                    0
                )
                /
                NULLIF(
                    SUM(cc.cantidadcupos) FILTER (
                        WHERE ec.nombre IN (
                            'Pago validado',
                            'Inscripciones generadas'
                        )
                    ),
                    0
                ),
                2
            )
        END,

        CASE
            WHEN c.fecha_inicio IS NULL
              OR MIN(cc.fechacompra) FILTER (
                    WHERE ec.nombre IN (
                        'Pago validado',
                        'Inscripciones generadas'
                    )
                 ) IS NULL
                THEN NULL
            ELSE GREATEST(
                c.fecha_inicio
                -
                (
                    MIN(cc.fechacompra) FILTER (
                        WHERE ec.nombre IN (
                            'Pago validado',
                            'Inscripciones generadas'
                        )
                    )
                )::DATE,
                0
            )
        END,

        CASE
            WHEN c.fecha_inicio IS NULL
              OR MAX(cc.fechacompra) FILTER (
                    WHERE ec.nombre IN (
                        'Pago validado',
                        'Inscripciones generadas'
                    )
                 ) IS NULL
                THEN NULL
            ELSE GREATEST(
                c.fecha_inicio
                -
                (
                    MAX(cc.fechacompra) FILTER (
                        WHERE ec.nombre IN (
                            'Pago validado',
                            'Inscripciones generadas'
                        )
                    )
                )::DATE,
                0
            )
        END,

        CURRENT_TIMESTAMP,

        TRUE

    FROM academia.cursos c

    LEFT JOIN academia.comprascursosinacademia cc
        ON cc.idcurso = c.id_curso

    LEFT JOIN academia.estadocomprainacademia ec
        ON ec.idestadocompra = cc.idestadocompra

    WHERE c.id_curso = p_curso_id

    GROUP BY
        c.id_curso,
        c.titulo_curso,
        c.id_categoria,
        c.id_modalidad,
        c.id_ubicacion,
        c.fecha_inicio,
        c.fecha_fin,
        c.cupo_maximo,
        c.cupos_ocupados,
        c.costo

    ON CONFLICT (curso_id)
    DO UPDATE SET
        titulo_curso =
            EXCLUDED.titulo_curso,

        categoria_id =
            EXCLUDED.categoria_id,

        modalidad_id =
            EXCLUDED.modalidad_id,

        ubicacion_id =
            EXCLUDED.ubicacion_id,

        fecha_inicio =
            EXCLUDED.fecha_inicio,

        fecha_fin =
            EXCLUDED.fecha_fin,

        anio_inicio =
            EXCLUDED.anio_inicio,

        mes_inicio =
            EXCLUDED.mes_inicio,

        duracion_dias =
            EXCLUDED.duracion_dias,

        cupo_maximo =
            EXCLUDED.cupo_maximo,

        cupos_ocupados =
            EXCLUDED.cupos_ocupados,

        porcentaje_ocupacion =
            EXCLUDED.porcentaje_ocupacion,

        total_compras =
            EXCLUDED.total_compras,

        compras_validas =
            EXCLUDED.compras_validas,

        cupos_vendidos =
            EXCLUDED.cupos_vendidos,

        compradores_unicos =
            EXCLUDED.compradores_unicos,

        ingresos_aprobados =
            EXCLUDED.ingresos_aprobados,

        precio_historico =
            EXCLUDED.precio_historico,

        ingreso_promedio_por_cupo =
            EXCLUDED.ingreso_promedio_por_cupo,

        dias_anticipacion_primera_compra =
            EXCLUDED.dias_anticipacion_primera_compra,

        dias_anticipacion_ultima_compra =
            EXCLUDED.dias_anticipacion_ultima_compra,

        fecha_carga =
            CURRENT_TIMESTAMP,

        activo_dataset =
            TRUE;

    v_accion := 'Insertado/actualizado';

    RETURN QUERY
    SELECT
        p_curso_id,
        v_accion;

END;
$$;


--
-- Name: actualizar_dataset_segmentacion_usuario(integer); Type: FUNCTION; Schema: analitica; Owner: -
--

CREATE FUNCTION analitica.actualizar_dataset_segmentacion_usuario(p_usuario_id integer) RETURNS TABLE(usuario_id integer, accion_realizada character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_existe_usuario BOOLEAN;
    v_total_compras INTEGER;
    v_accion VARCHAR(30);
BEGIN

    IF p_usuario_id IS NULL THEN
        RAISE EXCEPTION
            'El identificador del usuario es obligatorio';
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM seguridad.usuarios u
        WHERE u.id = p_usuario_id
    )
    INTO v_existe_usuario;

    /*
      Si el usuario ya no existe, desactivamos su registro
      analítico sin eliminar el historial.
    */

    IF v_existe_usuario = FALSE THEN

        UPDATE analitica.dataset_segmentacion_clientes
        SET
            activo_dataset = FALSE,
            fecha_carga = CURRENT_TIMESTAMP
        WHERE dataset_segmentacion_clientes.usuario_id =
              p_usuario_id
          AND activo_dataset = TRUE;

        IF FOUND THEN
            v_accion := 'Desactivado';
        ELSE
            v_accion := 'Sin registro';
        END IF;

        RETURN QUERY
        SELECT p_usuario_id, v_accion;

        RETURN;
    END IF;

    /*
      Confirmamos que el usuario tenga al menos una compra.
    */

    SELECT COUNT(*)
    INTO v_total_compras
    FROM academia.comprascursosinacademia cc
    WHERE cc.idusuario = p_usuario_id;

    IF v_total_compras = 0 THEN

        UPDATE analitica.dataset_segmentacion_clientes
        SET
            total_compras = 0,
            total_compras_validas = 0,
            compras_pendientes = 0,
            compras_canceladas = 0,
            compras_rechazadas = 0,
            compras_expiradas = 0,
            cursos_distintos = 0,
            categorias_distintas = 0,
            modalidades_distintas = 0,
            total_cupos_adquiridos = 0,
            total_gastado = 0,
            ticket_promedio = 0,
            cupos_promedio_compra = 0,
            tasa_conversion = 0,
            fecha_primera_compra = NULL,
            fecha_ultima_compra = NULL,
            dias_desde_ultima_compra = NULL,
            antiguedad_cliente_dias = NULL,
            fecha_carga = CURRENT_TIMESTAMP,
            activo_dataset = FALSE
        WHERE dataset_segmentacion_clientes.usuario_id =
              p_usuario_id;

        IF FOUND THEN
            v_accion := 'Desactivado';
        ELSE
            v_accion := 'Sin compras';
        END IF;

        RETURN QUERY
        SELECT p_usuario_id, v_accion;

        RETURN;
    END IF;

    /*
      Recalculamos todas las métricas del usuario.
    */

    INSERT INTO analitica.dataset_segmentacion_clientes (
        usuario_id,
        fecha_primera_compra,
        fecha_ultima_compra,
        dias_desde_ultima_compra,
        antiguedad_cliente_dias,
        total_compras,
        total_compras_validas,
        compras_pendientes,
        compras_canceladas,
        compras_rechazadas,
        compras_expiradas,
        cursos_distintos,
        categorias_distintas,
        modalidades_distintas,
        total_cupos_adquiridos,
        total_gastado,
        ticket_promedio,
        cupos_promedio_compra,
        tasa_conversion,
        fecha_carga,
        activo_dataset
    )
    SELECT
        cc.idusuario,

        MIN(cc.fechacompra) FILTER (
            WHERE ec.nombre IN (
                'Pago validado',
                'Inscripciones generadas'
            )
        ),

        MAX(cc.fechacompra) FILTER (
            WHERE ec.nombre IN (
                'Pago validado',
                'Inscripciones generadas'
            )
        ),

        CASE
            WHEN MAX(cc.fechacompra) FILTER (
                WHERE ec.nombre IN (
                    'Pago validado',
                    'Inscripciones generadas'
                )
            ) IS NULL
                THEN NULL
            ELSE CURRENT_DATE
                 - (
                     MAX(cc.fechacompra) FILTER (
                         WHERE ec.nombre IN (
                             'Pago validado',
                             'Inscripciones generadas'
                         )
                     )
                 )::DATE
        END,

        CASE
            WHEN MIN(cc.fechacompra) FILTER (
                WHERE ec.nombre IN (
                    'Pago validado',
                    'Inscripciones generadas'
                )
            ) IS NULL
                THEN NULL
            ELSE CURRENT_DATE
                 - (
                     MIN(cc.fechacompra) FILTER (
                         WHERE ec.nombre IN (
                             'Pago validado',
                             'Inscripciones generadas'
                         )
                     )
                 )::DATE
        END,

        COUNT(*)::INTEGER,

        COUNT(*) FILTER (
            WHERE ec.nombre IN (
                'Pago validado',
                'Inscripciones generadas'
            )
        )::INTEGER,

        COUNT(*) FILTER (
            WHERE ec.nombre IN (
                'Pendiente de pago',
                'Pago reportado'
            )
        )::INTEGER,

        COUNT(*) FILTER (
            WHERE ec.nombre = 'Cancelada'
        )::INTEGER,

        COUNT(*) FILTER (
            WHERE ec.nombre = 'Rechazada'
        )::INTEGER,

        COUNT(*) FILTER (
            WHERE ec.nombre = 'Expirada'
        )::INTEGER,

        COUNT(DISTINCT cc.idcurso) FILTER (
            WHERE ec.nombre IN (
                'Pago validado',
                'Inscripciones generadas'
            )
        )::INTEGER,

        COUNT(DISTINCT c.id_categoria) FILTER (
            WHERE ec.nombre IN (
                'Pago validado',
                'Inscripciones generadas'
            )
        )::INTEGER,

        COUNT(DISTINCT c.id_modalidad) FILTER (
            WHERE ec.nombre IN (
                'Pago validado',
                'Inscripciones generadas'
            )
        )::INTEGER,

        COALESCE(
            SUM(cc.cantidadcupos) FILTER (
                WHERE ec.nombre IN (
                    'Pago validado',
                    'Inscripciones generadas'
                )
            ),
            0
        )::INTEGER,

        COALESCE(
            SUM(cc.total) FILTER (
                WHERE ec.nombre IN (
                    'Pago validado',
                    'Inscripciones generadas'
                )
            ),
            0
        ),

        COALESCE(
            ROUND(
                AVG(cc.total) FILTER (
                    WHERE ec.nombre IN (
                        'Pago validado',
                        'Inscripciones generadas'
                    )
                ),
                2
            ),
            0
        ),

        COALESCE(
            ROUND(
                AVG(cc.cantidadcupos) FILTER (
                    WHERE ec.nombre IN (
                        'Pago validado',
                        'Inscripciones generadas'
                    )
                ),
                2
            ),
            0
        ),

        CASE
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND(
                (
                    COUNT(*) FILTER (
                        WHERE ec.nombre IN (
                            'Pago validado',
                            'Inscripciones generadas'
                        )
                    )::NUMERIC
                    / COUNT(*)::NUMERIC
                ) * 100,
                2
            )
        END,

        CURRENT_TIMESTAMP,
        TRUE

    FROM academia.comprascursosinacademia cc

    INNER JOIN academia.estadocomprainacademia ec
        ON ec.idestadocompra = cc.idestadocompra

    INNER JOIN academia.cursos c
        ON c.id_curso = cc.idcurso

    WHERE cc.idusuario = p_usuario_id

    GROUP BY cc.idusuario

    ON CONFLICT (usuario_id)
    DO UPDATE SET
        fecha_primera_compra =
            EXCLUDED.fecha_primera_compra,

        fecha_ultima_compra =
            EXCLUDED.fecha_ultima_compra,

        dias_desde_ultima_compra =
            EXCLUDED.dias_desde_ultima_compra,

        antiguedad_cliente_dias =
            EXCLUDED.antiguedad_cliente_dias,

        total_compras =
            EXCLUDED.total_compras,

        total_compras_validas =
            EXCLUDED.total_compras_validas,

        compras_pendientes =
            EXCLUDED.compras_pendientes,

        compras_canceladas =
            EXCLUDED.compras_canceladas,

        compras_rechazadas =
            EXCLUDED.compras_rechazadas,

        compras_expiradas =
            EXCLUDED.compras_expiradas,

        cursos_distintos =
            EXCLUDED.cursos_distintos,

        categorias_distintas =
            EXCLUDED.categorias_distintas,

        modalidades_distintas =
            EXCLUDED.modalidades_distintas,

        total_cupos_adquiridos =
            EXCLUDED.total_cupos_adquiridos,

        total_gastado =
            EXCLUDED.total_gastado,

        ticket_promedio =
            EXCLUDED.ticket_promedio,

        cupos_promedio_compra =
            EXCLUDED.cupos_promedio_compra,

        tasa_conversion =
            EXCLUDED.tasa_conversion,

        fecha_carga =
            CURRENT_TIMESTAMP,

        activo_dataset =
            TRUE;

    v_accion := 'Insertado/actualizado';

    RETURN QUERY
    SELECT p_usuario_id, v_accion;

END;
$$;


--
-- Name: procesar_cola_actualizacion_datasets(integer, smallint); Type: FUNCTION; Schema: analitica; Owner: -
--

CREATE FUNCTION analitica.procesar_cola_actualizacion_datasets(p_limite integer DEFAULT 100, p_max_intentos smallint DEFAULT 3) RETURNS TABLE(tareas_seleccionadas integer, tareas_completadas integer, tareas_fallidas integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_tarea RECORD;

    v_compra_id BIGINT;
    v_usuario_id INTEGER;
    v_curso_id INTEGER;

    v_total_seleccionadas INTEGER := 0;
    v_total_completadas INTEGER := 0;
    v_total_fallidas INTEGER := 0;

    v_mensaje_error TEXT;
BEGIN

    /* =====================================================
       1. VALIDAR PARÁMETROS
       ===================================================== */

    IF p_limite IS NULL OR p_limite <= 0 THEN
        RAISE EXCEPTION
            'El límite debe ser mayor que cero';
    END IF;

    IF p_limite > 1000 THEN
        RAISE EXCEPTION
            'El límite máximo por ejecución es 1000';
    END IF;

    IF p_max_intentos IS NULL
       OR p_max_intentos <= 0 THEN
        RAISE EXCEPTION
            'El máximo de intentos debe ser mayor que cero';
    END IF;


    /* =====================================================
       2. TOMAR TAREAS PENDIENTES
       ===================================================== */

    FOR v_tarea IN

        SELECT
            cad.id_tarea,
            cad.dataset_destino,
            cad.tabla_origen,
            cad.registro_origen_id,
            cad.tipo_operacion,
            cad.prioridad,
            cad.intentos,
            cad.payload
        FROM analitica.cola_actualizacion_datasets cad

        WHERE cad.estado = 'Pendiente'
          AND cad.fecha_programada <= CURRENT_TIMESTAMP
          AND cad.intentos < p_max_intentos

        ORDER BY
            cad.prioridad ASC,
            cad.fecha_programada ASC,
            cad.id_tarea ASC

        LIMIT p_limite

        FOR UPDATE SKIP LOCKED

    LOOP

        v_total_seleccionadas :=
            v_total_seleccionadas + 1;

        /*
          Reiniciamos las variables porque cada tarea puede
          pertenecer a un registro diferente.
        */

        v_compra_id := NULL;
        v_usuario_id := NULL;
        v_curso_id := NULL;
        v_mensaje_error := NULL;


        /* =================================================
           3. MARCAR COMO PROCESANDO
           ================================================= */

        UPDATE analitica.cola_actualizacion_datasets
        SET
            estado = 'Procesando',
            intentos = intentos + 1,
            fecha_inicio_proceso = CURRENT_TIMESTAMP,
            fecha_fin_proceso = NULL,
            ultimo_error = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_tarea = v_tarea.id_tarea;


        /* =================================================
           4. PROCESAR LA TAREA
           ================================================= */

        BEGIN

            /* =============================================
               EVENTOS DE COMPRAS
               ============================================= */

            IF v_tarea.tabla_origen =
               'academia.comprascursosinacademia' THEN

                v_compra_id :=
                    v_tarea.registro_origen_id;

                /*
                  Primero intentamos obtener usuario y curso
                  desde la tabla operativa.
                */

                SELECT
                    cc.idusuario,
                    cc.idcurso
                INTO
                    v_usuario_id,
                    v_curso_id
                FROM academia.comprascursosinacademia cc
                WHERE cc.idcompra = v_compra_id;


                /*
                  Si la compra fue eliminada, recuperamos los
                  identificadores desde el payload del trigger.
                */

                IF NOT FOUND THEN

                    v_usuario_id := COALESCE(
                        NULLIF(
                            v_tarea.payload
                            #>> '{datos_nuevos,idusuario}',
                            ''
                        )::INTEGER,

                        NULLIF(
                            v_tarea.payload
                            #>> '{datos_anteriores,idusuario}',
                            ''
                        )::INTEGER
                    );

                    v_curso_id := COALESCE(
                        NULLIF(
                            v_tarea.payload
                            #>> '{datos_nuevos,idcurso}',
                            ''
                        )::INTEGER,

                        NULLIF(
                            v_tarea.payload
                            #>> '{datos_anteriores,idcurso}',
                            ''
                        )::INTEGER
                    );

                END IF;


                /* Reglas de asociación */

                IF v_tarea.dataset_destino IN (
                    'Todos',
                    'Reglas de asociación'
                ) THEN

                    PERFORM *
                    FROM analitica
                        .actualizar_dataset_asociacion_compra(
                            v_compra_id
                        );

                END IF;


                /* Segmentación del comprador */

                IF v_tarea.dataset_destino IN (
                    'Todos',
                    'Segmentación de clientes'
                )
                AND v_usuario_id IS NOT NULL THEN

                    PERFORM *
                    FROM analitica
                        .actualizar_dataset_segmentacion_usuario(
                            v_usuario_id
                        );

                END IF;


                /* Métricas del curso */

                IF v_tarea.dataset_destino IN (
                    'Todos',
                    'Regresión de precios'
                )
                AND v_curso_id IS NOT NULL THEN

                    PERFORM *
                    FROM analitica
                        .actualizar_dataset_regresion_curso(
                            v_curso_id
                        );

                END IF;


            /* =============================================
               EVENTOS DE PAGOS
               ============================================= */

            ELSIF v_tarea.tabla_origen =
                  'academia.pagos_cursos' THEN

                /*
                  Un pago no contiene directamente usuario ni
                  curso. Primero obtenemos la compra relacionada.
                */

                SELECT pc.id_compra
                INTO v_compra_id
                FROM academia.pagos_cursos pc
                WHERE pc.id_pago =
                      v_tarea.registro_origen_id;


                /*
                  Si el pago fue eliminado, usamos el payload.
                */

                IF NOT FOUND THEN

                    v_compra_id := COALESCE(
                        NULLIF(
                            v_tarea.payload
                            #>> '{datos_nuevos,id_compra}',
                            ''
                        )::BIGINT,

                        NULLIF(
                            v_tarea.payload
                            #>> '{datos_anteriores,id_compra}',
                            ''
                        )::BIGINT
                    );

                END IF;

                IF v_compra_id IS NULL THEN
                    RAISE EXCEPTION
                        'No fue posible identificar la compra relacionada con el pago %',
                        v_tarea.registro_origen_id;
                END IF;


                /* Obtener comprador y curso */

                SELECT
                    cc.idusuario,
                    cc.idcurso
                INTO
                    v_usuario_id,
                    v_curso_id
                FROM academia.comprascursosinacademia cc
                WHERE cc.idcompra = v_compra_id;

                IF NOT FOUND THEN
                    RAISE EXCEPTION
                        'La compra % relacionada con el pago ya no existe',
                        v_compra_id;
                END IF;


                /*
                  Los pagos pueden afectar los tres datasets
                  porque alteran la validez y el valor de la
                  compra.
                */

                IF v_tarea.dataset_destino IN (
                    'Todos',
                    'Reglas de asociación'
                ) THEN

                    PERFORM *
                    FROM analitica
                        .actualizar_dataset_asociacion_compra(
                            v_compra_id
                        );

                END IF;

                IF v_tarea.dataset_destino IN (
                    'Todos',
                    'Segmentación de clientes'
                ) THEN

                    PERFORM *
                    FROM analitica
                        .actualizar_dataset_segmentacion_usuario(
                            v_usuario_id
                        );

                END IF;

                IF v_tarea.dataset_destino IN (
                    'Todos',
                    'Regresión de precios'
                ) THEN

                    PERFORM *
                    FROM analitica
                        .actualizar_dataset_regresion_curso(
                            v_curso_id
                        );

                END IF;


            /* =============================================
               EVENTOS DE CURSOS
               ============================================= */

            ELSIF v_tarea.tabla_origen =
                  'academia.cursos' THEN

                v_curso_id :=
                    v_tarea.registro_origen_id::INTEGER;

                IF v_tarea.dataset_destino IN (
                    'Todos',
                    'Regresión de precios'
                ) THEN

                    PERFORM *
                    FROM analitica
                        .actualizar_dataset_regresion_curso(
                            v_curso_id
                        );

                END IF;


            /* =============================================
               ORIGEN NO SOPORTADO
               ============================================= */

            ELSE

                RAISE EXCEPTION
                    'La tabla de origen "%" todavía no está soportada por el procesador ETL',
                    v_tarea.tabla_origen;

            END IF;


            /* =============================================
               5. MARCAR TAREA COMO COMPLETADA
               ============================================= */

            UPDATE analitica.cola_actualizacion_datasets
            SET
                estado = 'Completada',
                fecha_fin_proceso = CURRENT_TIMESTAMP,
                ultimo_error = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE id_tarea = v_tarea.id_tarea;

            v_total_completadas :=
                v_total_completadas + 1;


        /* =================================================
           6. CAPTURAR ERROR DE LA TAREA
           ================================================= */

        EXCEPTION
            WHEN OTHERS THEN

                GET STACKED DIAGNOSTICS
                    v_mensaje_error = MESSAGE_TEXT;

                UPDATE analitica.cola_actualizacion_datasets
                SET
                    estado = 'Fallida',
                    fecha_fin_proceso = CURRENT_TIMESTAMP,
                    ultimo_error = LEFT(
                        COALESCE(
                            v_mensaje_error,
                            'Error no identificado'
                        ),
                        5000
                    ),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id_tarea = v_tarea.id_tarea;

                v_total_fallidas :=
                    v_total_fallidas + 1;

        END;

    END LOOP;


    /* =====================================================
       7. DEVOLVER RESUMEN
       ===================================================== */

    RETURN QUERY
    SELECT
        v_total_seleccionadas,
        v_total_completadas,
        v_total_fallidas;

END;
$$;


--
-- Name: recalcular_todos_datasets(boolean); Type: FUNCTION; Schema: analitica; Owner: -
--

CREATE FUNCTION analitica.recalcular_todos_datasets(p_limpiar_registros_huerfanos boolean DEFAULT true) RETURNS TABLE(compras_procesadas integer, usuarios_procesados integer, cursos_procesados integer, asociaciones_desactivadas integer, segmentos_desactivados integer, regresiones_desactivadas integer, fecha_inicio timestamp without time zone, fecha_fin timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_compra RECORD;
    v_usuario RECORD;
    v_curso RECORD;

    v_compras_procesadas INTEGER := 0;
    v_usuarios_procesados INTEGER := 0;
    v_cursos_procesados INTEGER := 0;

    v_asociaciones_desactivadas INTEGER := 0;
    v_segmentos_desactivados INTEGER := 0;
    v_regresiones_desactivadas INTEGER := 0;

    v_fecha_inicio TIMESTAMP;
    v_fecha_fin TIMESTAMP;
BEGIN

    /* =====================================================
       1. REGISTRAR INICIO
       ===================================================== */

    v_fecha_inicio := CURRENT_TIMESTAMP;


    /* =====================================================
       2. RECALCULAR DATASET DE REGLAS DE ASOCIACIÓN
       ===================================================== */

    FOR v_compra IN

        SELECT cc.idcompra
        FROM academia.comprascursosinacademia cc
        ORDER BY cc.idcompra

    LOOP

        PERFORM *
        FROM analitica.actualizar_dataset_asociacion_compra(
            v_compra.idcompra
        );

        v_compras_procesadas :=
            v_compras_procesadas + 1;

    END LOOP;


    /* =====================================================
       3. RECALCULAR SEGMENTACIÓN DE CLIENTES
       ===================================================== */

    FOR v_usuario IN

        SELECT DISTINCT cc.idusuario
        FROM academia.comprascursosinacademia cc
        WHERE cc.idusuario IS NOT NULL
        ORDER BY cc.idusuario

    LOOP

        PERFORM *
        FROM analitica.actualizar_dataset_segmentacion_usuario(
            v_usuario.idusuario
        );

        v_usuarios_procesados :=
            v_usuarios_procesados + 1;

    END LOOP;


    /* =====================================================
       4. RECALCULAR DATASET DE REGRESIÓN
       ===================================================== */

    FOR v_curso IN

        SELECT c.id_curso
        FROM academia.cursos c
        ORDER BY c.id_curso

    LOOP

        PERFORM *
        FROM analitica.actualizar_dataset_regresion_curso(
            v_curso.id_curso
        );

        v_cursos_procesados :=
            v_cursos_procesados + 1;

    END LOOP;


    /* =====================================================
       5. DESACTIVAR REGISTROS HUÉRFANOS
       ===================================================== */

    IF p_limpiar_registros_huerfanos = TRUE THEN

        /*
          Compras que ya no existen en la tabla operativa.
        */

        UPDATE analitica.dataset_reglas_asociacion dra
        SET
            activo_dataset = FALSE,
            fecha_carga = CURRENT_TIMESTAMP
        WHERE dra.activo_dataset = TRUE
          AND NOT EXISTS (
              SELECT 1
              FROM academia.comprascursosinacademia cc
              WHERE cc.idcompra = dra.compra_id
          );

        GET DIAGNOSTICS
            v_asociaciones_desactivadas = ROW_COUNT;


        /*
          Usuarios que ya no existen o que ya no tienen compras.
        */

        UPDATE analitica.dataset_segmentacion_clientes dsc
        SET
            activo_dataset = FALSE,
            fecha_carga = CURRENT_TIMESTAMP
        WHERE dsc.activo_dataset = TRUE
          AND (
              NOT EXISTS (
                  SELECT 1
                  FROM seguridad.usuarios u
                  WHERE u.id = dsc.usuario_id
              )
              OR NOT EXISTS (
                  SELECT 1
                  FROM academia.comprascursosinacademia cc
                  WHERE cc.idusuario = dsc.usuario_id
              )
          );

        GET DIAGNOSTICS
            v_segmentos_desactivados = ROW_COUNT;


        /*
          Cursos que ya no existen.
        */

        UPDATE analitica.dataset_regresion_precio_cursos drc
        SET
            activo_dataset = FALSE,
            fecha_carga = CURRENT_TIMESTAMP
        WHERE drc.activo_dataset = TRUE
          AND NOT EXISTS (
              SELECT 1
              FROM academia.cursos c
              WHERE c.id_curso = drc.curso_id
          );

        GET DIAGNOSTICS
            v_regresiones_desactivadas = ROW_COUNT;

    END IF;


    /* =====================================================
       6. REGISTRAR FINALIZACIÓN
       ===================================================== */

    v_fecha_fin := CURRENT_TIMESTAMP;


    /* =====================================================
       7. DEVOLVER RESUMEN
       ===================================================== */

    RETURN QUERY
    SELECT
        v_compras_procesadas,
        v_usuarios_procesados,
        v_cursos_procesados,
        v_asociaciones_desactivadas,
        v_segmentos_desactivados,
        v_regresiones_desactivadas,
        v_fecha_inicio,
        v_fecha_fin;

END;
$$;


--
-- Name: refrescar_vistas_dashboard(); Type: FUNCTION; Schema: analitica; Owner: -
--

CREATE FUNCTION analitica.refrescar_vistas_dashboard() RETURNS TABLE(vista character varying, estado character varying, fecha_refresco timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN

    REFRESH MATERIALIZED VIEW
        analitica.mv_indicadores_generales;

    RETURN QUERY
    SELECT
        'analitica.mv_indicadores_generales'::VARCHAR(100),
        'Refrescada'::VARCHAR(20),
        CURRENT_TIMESTAMP;

    REFRESH MATERIALIZED VIEW
        analitica.mv_metricas_mensuales_cursos;

    RETURN QUERY
    SELECT
        'analitica.mv_metricas_mensuales_cursos'::VARCHAR(100),
        'Refrescada'::VARCHAR(20),
        CURRENT_TIMESTAMP;

END;
$$;


--
-- Name: registrar_actualizacion_dataset(); Type: FUNCTION; Schema: analitica; Owner: -
--

CREATE FUNCTION analitica.registrar_actualizacion_dataset() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_dataset_destino VARCHAR(40);
    v_columna_id VARCHAR(100);
    v_prioridad SMALLINT;

    v_registro_id BIGINT;
    v_datos_anteriores JSONB;
    v_datos_nuevos JSONB;
BEGIN

    /* =====================================================
       1. OBTENER CONFIGURACIÓN DEL TRIGGER
       ===================================================== */

    v_dataset_destino := TG_ARGV[0];
    v_columna_id := TG_ARGV[1];
    v_prioridad := TG_ARGV[2]::SMALLINT;


    /* =====================================================
       2. VALIDAR CONFIGURACIÓN
       ===================================================== */

    IF v_dataset_destino IS NULL
       OR v_dataset_destino NOT IN (
           'Reglas de asociación',
           'Segmentación de clientes',
           'Regresión de precios',
           'Todos'
       ) THEN
        RAISE EXCEPTION
            'Dataset de destino inválido en trigger: %',
            v_dataset_destino;
    END IF;

    IF v_columna_id IS NULL
       OR LENGTH(TRIM(v_columna_id)) = 0 THEN
        RAISE EXCEPTION
            'No se configuró la columna identificadora del trigger';
    END IF;

    IF v_prioridad IS NULL
       OR v_prioridad NOT BETWEEN 1 AND 10 THEN
        RAISE EXCEPTION
            'Prioridad inválida en trigger: %',
            v_prioridad;
    END IF;


    /* =====================================================
       3. CONVERTIR FILAS A JSON
       ===================================================== */

    IF TG_OP = 'INSERT' THEN

        v_datos_nuevos := TO_JSONB(NEW);

        v_registro_id :=
            NULLIF(
                v_datos_nuevos ->> v_columna_id,
                ''
            )::BIGINT;

    ELSIF TG_OP = 'UPDATE' THEN

        v_datos_anteriores := TO_JSONB(OLD);
        v_datos_nuevos := TO_JSONB(NEW);

        v_registro_id :=
            NULLIF(
                v_datos_nuevos ->> v_columna_id,
                ''
            )::BIGINT;

    ELSIF TG_OP = 'DELETE' THEN

        v_datos_anteriores := TO_JSONB(OLD);

        v_registro_id :=
            NULLIF(
                v_datos_anteriores ->> v_columna_id,
                ''
            )::BIGINT;

    ELSE
        RAISE EXCEPTION
            'Operación no soportada por el trigger: %',
            TG_OP;
    END IF;


    /* =====================================================
       4. REGISTRAR TAREA EN LA COLA
       ===================================================== */

    INSERT INTO analitica.cola_actualizacion_datasets (
        dataset_destino,
        tabla_origen,
        registro_origen_id,
        tipo_operacion,
        prioridad,
        estado,
        fecha_evento,
        fecha_programada,
        payload
    )
    VALUES (
        v_dataset_destino,

        CONCAT(
            TG_TABLE_SCHEMA,
            '.',
            TG_TABLE_NAME
        ),

        v_registro_id,

        TG_OP,

        v_prioridad,

        'Pendiente',

        CURRENT_TIMESTAMP,

        CURRENT_TIMESTAMP,

        jsonb_build_object(
            'schema', TG_TABLE_SCHEMA,
            'tabla', TG_TABLE_NAME,
            'operacion', TG_OP,
            'registro_id', v_registro_id,
            'datos_anteriores', v_datos_anteriores,
            'datos_nuevos', v_datos_nuevos,
            'fecha_evento', CURRENT_TIMESTAMP
        )
    );


    /* =====================================================
       5. DEVOLVER FILA
       ===================================================== */

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    RETURN NEW;

END;
$$;


--
-- Name: contar_filas_en_todas_tablas(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.contar_filas_en_todas_tablas() RETURNS TABLE(esquema text, tabla text, filas bigint)
    LANGUAGE plpgsql
    AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
    LOOP
        RETURN QUERY EXECUTE format(
            'SELECT %L, %L, COUNT(*) FROM %I.%I',
            r.schemaname, r.tablename, r.schemaname, r.tablename
        );
    END LOOP;
END;
$$;


--
-- Name: fn_auditar_cambios(); Type: FUNCTION; Schema: seguridad; Owner: -
--

CREATE FUNCTION seguridad.fn_auditar_cambios() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_registro_id INTEGER;
    v_datos_anteriores JSONB;
    v_datos_nuevos JSONB;
    v_ip INET;
    v_nombre_tabla TEXT;
    v_usuario_email TEXT;
BEGIN
    -- Obtener IP del cliente
    BEGIN
        v_ip := inet_client_addr();
    EXCEPTION WHEN OTHERS THEN
        v_ip := NULL;
    END;
    
    -- Obtener el correo del usuario desde la tabla temporal
    BEGIN
        SELECT value INTO v_usuario_email 
        FROM pg_temp.temp_user_context 
        WHERE key = 'current_user_email';
    EXCEPTION WHEN OTHERS THEN
        v_usuario_email := NULL;
    END;
    
    -- Si no hay correo, usar CURRENT_USER
    IF v_usuario_email IS NULL OR v_usuario_email = '' THEN
        v_usuario_email := CURRENT_USER;
    END IF;
    
    -- Resto del código igual...
    v_nombre_tabla := TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME;
    
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF v_nombre_tabla = 'clinica.medicos' THEN
            v_registro_id := NEW.id_medico;
        ELSIF v_nombre_tabla = 'clinica.nosotros' THEN
            v_registro_id := NEW.id;
        ELSIF v_nombre_tabla = 'clinica.servicios' THEN
            v_registro_id := NEW.id_servicio;
        ELSIF v_nombre_tabla = 'seguridad.usuarios' THEN
            v_registro_id := NEW.id;
        ELSIF v_nombre_tabla = 'academia.cursos' THEN
            v_registro_id := NEW.id_curso;
        ELSE
            BEGIN
                v_registro_id := NEW.id;
            EXCEPTION WHEN OTHERS THEN
                v_registro_id := NULL;
            END;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF v_nombre_tabla = 'clinica.medicos' THEN
            v_registro_id := OLD.id_medico;
        ELSIF v_nombre_tabla = 'clinica.nosotros' THEN
            v_registro_id := OLD.id;
        ELSIF v_nombre_tabla = 'clinica.servicios' THEN
            v_registro_id := OLD.id_servicio;
        ELSIF v_nombre_tabla = 'seguridad.usuarios' THEN
            v_registro_id := OLD.id;
        ELSIF v_nombre_tabla = 'academia.cursos' THEN
            v_registro_id := OLD.id_curso;
        ELSE
            BEGIN
                v_registro_id := OLD.id;
            EXCEPTION WHEN OTHERS THEN
                v_registro_id := NULL;
            END;
        END IF;
    END IF;
    
    IF TG_OP = 'INSERT' THEN
        v_datos_anteriores := NULL;
        v_datos_nuevos := row_to_json(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        v_datos_anteriores := row_to_json(OLD);
        v_datos_nuevos := row_to_json(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        v_datos_anteriores := row_to_json(OLD);
        v_datos_nuevos := NULL;
    ELSE
        RETURN COALESCE(NEW, OLD);
    END IF;
    
    INSERT INTO seguridad.auditoria_acciones (
        usuario,
        ip_address,
        accion,
        tabla_afectada,
        registro_id,
        datos_anteriores,
        datos_nuevos,
        aplicacion_origen,
        fecha_hora
    ) VALUES (
        COALESCE(v_usuario_email, CURRENT_USER),
        v_ip,
        TG_OP,
        v_nombre_tabla,
        v_registro_id,
        v_datos_anteriores,
        v_datos_nuevos,
        'TRIGGER_AUDITORIA',
        CURRENT_TIMESTAMP
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academia_infantil; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.academia_infantil (
    id_guia integer NOT NULL,
    titulo_guia character varying(255) NOT NULL,
    descripcion_corta text,
    id_autor integer,
    fecha_publicacion date DEFAULT CURRENT_DATE,
    url_imagen text,
    etiquetas text,
    descripcion_larga text,
    activo boolean DEFAULT true
);


--
-- Name: academia_infantil_id_guia_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.academia_infantil_id_guia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: academia_infantil_id_guia_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.academia_infantil_id_guia_seq OWNED BY academia.academia_infantil.id_guia;


--
-- Name: asistencias_curso; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.asistencias_curso (
    id_asistencia bigint NOT NULL,
    inscripcion_id integer NOT NULL,
    sesion_id bigint NOT NULL,
    estado_asistencia character varying(25) DEFAULT 'Pendiente'::character varying NOT NULL,
    hora_entrada time without time zone,
    hora_salida time without time zone,
    minutos_retardo smallint,
    justificada boolean DEFAULT false NOT NULL,
    motivo_justificacion text,
    comprobante_justificacion text,
    usuario_registra integer,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    observaciones text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_asistencia_estado CHECK (((estado_asistencia)::text = ANY ((ARRAY['Pendiente'::character varying, 'Presente'::character varying, 'Ausente'::character varying, 'Retardo'::character varying, 'Falta justificada'::character varying, 'Salida anticipada'::character varying])::text[]))),
    CONSTRAINT chk_asistencia_horario CHECK (((hora_entrada IS NULL) OR (hora_salida IS NULL) OR (hora_salida >= hora_entrada))),
    CONSTRAINT chk_asistencia_justificacion CHECK ((((estado_asistencia)::text <> 'Falta justificada'::text) OR ((justificada = true) AND (motivo_justificacion IS NOT NULL) AND (length(TRIM(BOTH FROM motivo_justificacion)) > 0)))),
    CONSTRAINT chk_asistencia_retardo CHECK (((minutos_retardo IS NULL) OR (minutos_retardo >= 0))),
    CONSTRAINT chk_asistencia_retardo_minutos CHECK ((((estado_asistencia)::text <> 'Retardo'::text) OR (minutos_retardo IS NOT NULL)))
);


--
-- Name: asistencias_curso_id_asistencia_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.asistencias_curso_id_asistencia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: asistencias_curso_id_asistencia_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.asistencias_curso_id_asistencia_seq OWNED BY academia.asistencias_curso.id_asistencia;


--
-- Name: categorias_cursos; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.categorias_cursos (
    id_categoria integer NOT NULL,
    nombre_categoria character varying(50) NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


--
-- Name: categorias_cursos_id_categoria_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.categorias_cursos_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_cursos_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.categorias_cursos_id_categoria_seq OWNED BY academia.categorias_cursos.id_categoria;


--
-- Name: certificados_curso; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.certificados_curso (
    id_certificado bigint NOT NULL,
    inscripcion_id integer NOT NULL,
    folio_certificado character varying(40) NOT NULL,
    codigo_verificacion character varying(100) NOT NULL,
    fecha_emision timestamp without time zone,
    ruta_archivo text,
    nombre_archivo character varying(255),
    estado character varying(20) DEFAULT 'Generado'::character varying NOT NULL,
    fecha_revocacion timestamp without time zone,
    motivo_revocacion text,
    usuario_emite integer,
    usuario_revoca integer,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_certificado_emitido CHECK ((((estado)::text <> 'Emitido'::text) OR ((fecha_emision IS NOT NULL) AND (ruta_archivo IS NOT NULL) AND (length(TRIM(BOTH FROM ruta_archivo)) > 0)))),
    CONSTRAINT chk_certificado_estado CHECK (((estado)::text = ANY ((ARRAY['Generado'::character varying, 'Emitido'::character varying, 'Revocado'::character varying, 'Anulado'::character varying])::text[]))),
    CONSTRAINT chk_certificado_fecha_revocacion CHECK (((fecha_emision IS NULL) OR (fecha_revocacion IS NULL) OR (fecha_revocacion >= fecha_emision))),
    CONSTRAINT chk_certificado_revocado CHECK ((((estado)::text <> 'Revocado'::text) OR ((fecha_revocacion IS NOT NULL) AND (motivo_revocacion IS NOT NULL) AND (length(TRIM(BOTH FROM motivo_revocacion)) > 0))))
);


--
-- Name: certificados_curso_id_certificado_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.certificados_curso_id_certificado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: certificados_curso_id_certificado_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.certificados_curso_id_certificado_seq OWNED BY academia.certificados_curso.id_certificado;


--
-- Name: compra_participantes; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.compra_participantes (
    id_compra_participante bigint NOT NULL,
    id_compra bigint NOT NULL,
    id_participante bigint NOT NULL,
    numero_cupo smallint NOT NULL,
    estado character varying(20) DEFAULT 'Registrado'::character varying NOT NULL,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_estado_compra_participante CHECK (((estado)::text = ANY ((ARRAY['Registrado'::character varying, 'Confirmado'::character varying, 'Cancelado'::character varying, 'Inscrito'::character varying])::text[]))),
    CONSTRAINT chk_numero_cupo CHECK ((numero_cupo > 0))
);


--
-- Name: compra_participantes_id_compra_participante_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.compra_participantes_id_compra_participante_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compra_participantes_id_compra_participante_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.compra_participantes_id_compra_participante_seq OWNED BY academia.compra_participantes.id_compra_participante;


--
-- Name: comprascursosinacademia; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.comprascursosinacademia (
    idcompra bigint NOT NULL,
    foliocompra character varying(20) DEFAULT academia.generar_folio_compra() NOT NULL,
    idusuario integer NOT NULL,
    idcurso integer NOT NULL,
    idestadocompra smallint NOT NULL,
    cantidadcupos smallint NOT NULL,
    preciounitario numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    descuento numeric(10,2) DEFAULT 0 NOT NULL,
    total numeric(10,2) NOT NULL,
    fechacompra timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fechalimitepago timestamp without time zone NOT NULL,
    fechapago timestamp without time zone,
    fechavalidacion timestamp without time zone,
    usuariovalida integer,
    observaciones text,
    CONSTRAINT chk_cantidad CHECK ((cantidadcupos > 0)),
    CONSTRAINT chk_descuento CHECK (((descuento >= (0)::numeric) AND (descuento <= subtotal))),
    CONSTRAINT chk_precio CHECK ((preciounitario >= (0)::numeric)),
    CONSTRAINT chk_subtotal CHECK ((subtotal >= (0)::numeric)),
    CONSTRAINT chk_total CHECK ((total >= (0)::numeric)),
    CONSTRAINT chk_total_calculado CHECK ((total = (subtotal - descuento)))
);


--
-- Name: comprascursosinacademia_idcompra_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.comprascursosinacademia_idcompra_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprascursosinacademia_idcompra_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.comprascursosinacademia_idcompra_seq OWNED BY academia.comprascursosinacademia.idcompra;


--
-- Name: contenido_saber_pediatrico; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.contenido_saber_pediatrico (
    id integer NOT NULL,
    tipo character varying(20) NOT NULL,
    titulo character varying(255) NOT NULL,
    descripcion text,
    contenido text,
    url_externo text,
    imagen_url text,
    video_url text,
    archivo_url text,
    categoria character varying(50),
    etiquetas text[],
    duracion character varying(20),
    fecha_publicacion date DEFAULT CURRENT_DATE,
    destacado boolean DEFAULT false,
    orden integer DEFAULT 0,
    activo boolean DEFAULT true,
    visualizaciones integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: contenido_saber_pediatrico_id_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.contenido_saber_pediatrico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contenido_saber_pediatrico_id_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.contenido_saber_pediatrico_id_seq OWNED BY academia.contenido_saber_pediatrico.id;


--
-- Name: cursos; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.cursos (
    id_curso integer NOT NULL,
    titulo_curso character varying(200) NOT NULL,
    descripcion text,
    id_instructor integer NOT NULL,
    id_categoria integer NOT NULL,
    id_ubicacion integer,
    id_modalidad integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    horario character varying(50),
    dirigido_a character varying(50),
    cupo_maximo integer NOT NULL,
    costo numeric(10,2) DEFAULT 0.00,
    url_imagen_portada text,
    activo boolean DEFAULT true,
    cupos_ocupados integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_cupos CHECK ((cupos_ocupados <= cupo_maximo)),
    CONSTRAINT check_fechas CHECK ((fecha_fin >= fecha_inicio)),
    CONSTRAINT cursos_costo_check CHECK ((costo >= (0)::numeric)),
    CONSTRAINT cursos_cupo_maximo_check CHECK ((cupo_maximo > 0)),
    CONSTRAINT cursos_cupos_ocupados_check CHECK ((cupos_ocupados >= 0))
);


--
-- Name: cursos_id_curso_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.cursos_id_curso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cursos_id_curso_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.cursos_id_curso_seq OWNED BY academia.cursos.id_curso;


--
-- Name: encuestas; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.encuestas (
    id integer NOT NULL,
    contenido_id integer,
    preguntas jsonb,
    fecha_inicio date,
    fecha_fin date,
    total_participantes integer DEFAULT 0,
    activo boolean DEFAULT true
);


--
-- Name: encuestas_id_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.encuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: encuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.encuestas_id_seq OWNED BY academia.encuestas.id;


--
-- Name: estadocomprainacademia; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.estadocomprainacademia (
    idestadocompra smallint NOT NULL,
    nombre character varying(40) NOT NULL,
    descripcion character varying(250),
    activo boolean DEFAULT true NOT NULL,
    fecharegistro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: estadocomprainacademia_idestadocompra_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.estadocomprainacademia_idestadocompra_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: estadocomprainacademia_idestadocompra_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.estadocomprainacademia_idestadocompra_seq OWNED BY academia.estadocomprainacademia.idestadocompra;


--
-- Name: evaluaciones_curso; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.evaluaciones_curso (
    id_evaluacion bigint NOT NULL,
    curso_id integer NOT NULL,
    sesion_id bigint,
    titulo character varying(150) NOT NULL,
    descripcion text,
    tipo_evaluacion character varying(30) NOT NULL,
    puntaje_maximo numeric(8,2) DEFAULT 100 NOT NULL,
    puntaje_minimo_aprobatorio numeric(8,2) DEFAULT 70 NOT NULL,
    ponderacion numeric(5,2) DEFAULT 0 NOT NULL,
    obligatoria boolean DEFAULT true NOT NULL,
    fecha_apertura timestamp without time zone,
    fecha_limite timestamp without time zone,
    intentos_permitidos smallint DEFAULT 1 NOT NULL,
    estado character varying(20) DEFAULT 'Borrador'::character varying NOT NULL,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_evaluacion_estado CHECK (((estado)::text = ANY ((ARRAY['Borrador'::character varying, 'Publicada'::character varying, 'En aplicación'::character varying, 'Cerrada'::character varying, 'Cancelada'::character varying])::text[]))),
    CONSTRAINT chk_evaluacion_fechas CHECK (((fecha_apertura IS NULL) OR (fecha_limite IS NULL) OR (fecha_limite >= fecha_apertura))),
    CONSTRAINT chk_evaluacion_intentos CHECK ((intentos_permitidos > 0)),
    CONSTRAINT chk_evaluacion_ponderacion CHECK (((ponderacion >= (0)::numeric) AND (ponderacion <= (100)::numeric))),
    CONSTRAINT chk_evaluacion_puntaje_aprobatorio CHECK (((puntaje_minimo_aprobatorio >= (0)::numeric) AND (puntaje_minimo_aprobatorio <= puntaje_maximo))),
    CONSTRAINT chk_evaluacion_puntaje_maximo CHECK ((puntaje_maximo > (0)::numeric)),
    CONSTRAINT chk_evaluacion_tipo CHECK (((tipo_evaluacion)::text = ANY ((ARRAY['Diagnóstica'::character varying, 'Cuestionario'::character varying, 'Examen'::character varying, 'Práctica'::character varying, 'Actividad'::character varying, 'Proyecto'::character varying, 'Evaluación final'::character varying])::text[])))
);


--
-- Name: evaluaciones_curso_id_evaluacion_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.evaluaciones_curso_id_evaluacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evaluaciones_curso_id_evaluacion_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.evaluaciones_curso_id_evaluacion_seq OWNED BY academia.evaluaciones_curso.id_evaluacion;


--
-- Name: historial_estados_compra; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.historial_estados_compra (
    id_historial_estado bigint NOT NULL,
    id_compra bigint NOT NULL,
    id_estado_anterior smallint,
    id_estado_nuevo smallint NOT NULL,
    usuario_responsable integer,
    origen_cambio character varying(20) NOT NULL,
    motivo character varying(250),
    observaciones text,
    fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_historial_estados_diferentes CHECK (((id_estado_anterior IS NULL) OR (id_estado_anterior <> id_estado_nuevo))),
    CONSTRAINT chk_historial_origen CHECK (((origen_cambio)::text = ANY ((ARRAY['Sistema'::character varying, 'Usuario'::character varying, 'Administrador'::character varying])::text[])))
);


--
-- Name: historial_estados_compra_id_historial_estado_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.historial_estados_compra_id_historial_estado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: historial_estados_compra_id_historial_estado_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.historial_estados_compra_id_historial_estado_seq OWNED BY academia.historial_estados_compra.id_historial_estado;


--
-- Name: historial_estados_curso; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.historial_estados_curso (
    id_historial_estado_curso bigint NOT NULL,
    curso_id integer NOT NULL,
    estado_anterior character varying(40),
    estado_nuevo character varying(40) NOT NULL,
    usuario_responsable integer,
    origen_cambio character varying(20) NOT NULL,
    motivo character varying(250),
    observaciones text,
    fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_historial_estado_curso_anterior CHECK (((estado_anterior IS NULL) OR ((estado_anterior)::text = ANY ((ARRAY['Borrador'::character varying, 'Publicado'::character varying, 'Inscripciones abiertas'::character varying, 'Cupo completo'::character varying, 'Inscripciones cerradas'::character varying, 'En curso'::character varying, 'Finalizado'::character varying, 'Cancelado'::character varying])::text[])))),
    CONSTRAINT chk_historial_estado_curso_diferente CHECK (((estado_anterior IS NULL) OR ((estado_anterior)::text <> (estado_nuevo)::text))),
    CONSTRAINT chk_historial_estado_curso_nuevo CHECK (((estado_nuevo)::text = ANY ((ARRAY['Borrador'::character varying, 'Publicado'::character varying, 'Inscripciones abiertas'::character varying, 'Cupo completo'::character varying, 'Inscripciones cerradas'::character varying, 'En curso'::character varying, 'Finalizado'::character varying, 'Cancelado'::character varying])::text[]))),
    CONSTRAINT chk_historial_estado_curso_origen CHECK (((origen_cambio)::text = ANY ((ARRAY['Sistema'::character varying, 'Administrador'::character varying])::text[])))
);


--
-- Name: historial_estados_curso_id_historial_estado_curso_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.historial_estados_curso_id_historial_estado_curso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: historial_estados_curso_id_historial_estado_curso_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.historial_estados_curso_id_historial_estado_curso_seq OWNED BY academia.historial_estados_curso.id_historial_estado_curso;


--
-- Name: inscripciones_cursos; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.inscripciones_cursos (
    id_inscripcion integer NOT NULL,
    curso_id integer NOT NULL,
    usuario_id integer,
    fecha_inscripcion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(20) DEFAULT 'activo'::character varying,
    monto_pagado numeric(10,2),
    metodo_pago character varying(50),
    participante_id bigint,
    compra_participante_id bigint,
    origen_inscripcion character varying(25) DEFAULT 'Sistema anterior'::character varying NOT NULL,
    fecha_confirmacion timestamp without time zone,
    observaciones text,
    CONSTRAINT chk_inscripcion_origen_compra CHECK ((((origen_inscripcion)::text <> 'Compra'::text) OR (compra_participante_id IS NOT NULL))),
    CONSTRAINT chk_origen_inscripcion CHECK (((origen_inscripcion)::text = ANY ((ARRAY['Compra'::character varying, 'Administrativa'::character varying, 'Sistema anterior'::character varying])::text[])))
);


--
-- Name: inscripciones_cursos_id_inscripcion_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.inscripciones_cursos_id_inscripcion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inscripciones_cursos_id_inscripcion_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.inscripciones_cursos_id_inscripcion_seq OWNED BY academia.inscripciones_cursos.id_inscripcion;


--
-- Name: instructores; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.instructores (
    id_instructor integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100),
    especialidad character varying(100) NOT NULL,
    edad integer NOT NULL,
    telefono character varying(20),
    correo character varying(150) NOT NULL,
    direccion text,
    activo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: instructores_id_instructor_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.instructores_id_instructor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: instructores_id_instructor_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.instructores_id_instructor_seq OWNED BY academia.instructores.id_instructor;


--
-- Name: metodos_pago_cursos; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.metodos_pago_cursos (
    id_metodo_pago smallint NOT NULL,
    nombre character varying(60) NOT NULL,
    descripcion character varying(250),
    requiere_comprobante boolean DEFAULT true NOT NULL,
    instrucciones text,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: metodos_pago_cursos_id_metodo_pago_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.metodos_pago_cursos_id_metodo_pago_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: metodos_pago_cursos_id_metodo_pago_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.metodos_pago_cursos_id_metodo_pago_seq OWNED BY academia.metodos_pago_cursos.id_metodo_pago;


--
-- Name: modalidades; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.modalidades (
    id_modalidad integer NOT NULL,
    nombre_modalidad character varying(20) NOT NULL,
    descripcion text
);


--
-- Name: modalidades_id_modalidad_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.modalidades_id_modalidad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: modalidades_id_modalidad_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.modalidades_id_modalidad_seq OWNED BY academia.modalidades.id_modalidad;


--
-- Name: movimientos_cupos_curso; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.movimientos_cupos_curso (
    id_movimiento_cupo bigint NOT NULL,
    curso_id integer NOT NULL,
    compra_id bigint,
    tipo_movimiento character varying(30) NOT NULL,
    cantidad integer NOT NULL,
    cupos_antes integer NOT NULL,
    cupos_despues integer NOT NULL,
    usuario_responsable integer,
    motivo character varying(250) NOT NULL,
    observaciones text,
    fecha_movimiento timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_movimiento_cupo_calculo CHECK (((((tipo_movimiento)::text = ANY ((ARRAY['Reserva'::character varying, 'Inscripción directa'::character varying, 'Ajuste de entrada'::character varying])::text[])) AND (cupos_despues = (cupos_antes + cantidad))) OR (((tipo_movimiento)::text = ANY ((ARRAY['Liberación'::character varying, 'Ajuste de salida'::character varying])::text[])) AND (cupos_despues = (cupos_antes - cantidad))))),
    CONSTRAINT chk_movimiento_cupo_cantidad CHECK ((cantidad > 0)),
    CONSTRAINT chk_movimiento_cupo_compra CHECK ((((tipo_movimiento)::text <> ALL ((ARRAY['Reserva'::character varying, 'Liberación'::character varying])::text[])) OR (compra_id IS NOT NULL))),
    CONSTRAINT chk_movimiento_cupo_tipo CHECK (((tipo_movimiento)::text = ANY ((ARRAY['Reserva'::character varying, 'Liberación'::character varying, 'Inscripción directa'::character varying, 'Ajuste de entrada'::character varying, 'Ajuste de salida'::character varying])::text[]))),
    CONSTRAINT chk_movimiento_cupo_valores CHECK (((cupos_antes >= 0) AND (cupos_despues >= 0)))
);


--
-- Name: movimientos_cupos_curso_id_movimiento_cupo_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.movimientos_cupos_curso_id_movimiento_cupo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: movimientos_cupos_curso_id_movimiento_cupo_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.movimientos_cupos_curso_id_movimiento_cupo_seq OWNED BY academia.movimientos_cupos_curso.id_movimiento_cupo;


--
-- Name: notificaciones_academicas; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.notificaciones_academicas (
    id_notificacion bigint NOT NULL,
    curso_id integer,
    inscripcion_id integer,
    sesion_id bigint,
    evaluacion_id bigint,
    tipo_notificacion character varying(40) NOT NULL,
    titulo character varying(150) NOT NULL,
    mensaje text NOT NULL,
    canal character varying(20) DEFAULT 'Sistema'::character varying NOT NULL,
    estado_envio character varying(20) DEFAULT 'Pendiente'::character varying NOT NULL,
    fecha_programada timestamp without time zone,
    fecha_envio timestamp without time zone,
    fecha_lectura timestamp without time zone,
    intentos_envio smallint DEFAULT 0 NOT NULL,
    ultimo_error text,
    usuario_crea integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_notificacion_canal CHECK (((canal)::text = ANY ((ARRAY['Sistema'::character varying, 'Correo'::character varying, 'WhatsApp'::character varying])::text[]))),
    CONSTRAINT chk_notificacion_destino CHECK (((curso_id IS NOT NULL) OR (inscripcion_id IS NOT NULL))),
    CONSTRAINT chk_notificacion_enviada CHECK ((((estado_envio)::text <> ALL ((ARRAY['Enviada'::character varying, 'Leída'::character varying])::text[])) OR (fecha_envio IS NOT NULL))),
    CONSTRAINT chk_notificacion_estado CHECK (((estado_envio)::text = ANY ((ARRAY['Pendiente'::character varying, 'Procesando'::character varying, 'Enviada'::character varying, 'Fallida'::character varying, 'Cancelada'::character varying, 'Leída'::character varying])::text[]))),
    CONSTRAINT chk_notificacion_fecha_envio CHECK (((fecha_programada IS NULL) OR (fecha_envio IS NULL) OR (fecha_envio >= fecha_programada))),
    CONSTRAINT chk_notificacion_fecha_lectura CHECK (((fecha_envio IS NULL) OR (fecha_lectura IS NULL) OR (fecha_lectura >= fecha_envio))),
    CONSTRAINT chk_notificacion_intentos CHECK ((intentos_envio >= 0)),
    CONSTRAINT chk_notificacion_leida CHECK ((((estado_envio)::text <> 'Leída'::text) OR (fecha_lectura IS NOT NULL))),
    CONSTRAINT chk_notificacion_tipo CHECK (((tipo_notificacion)::text = ANY ((ARRAY['Recordatorio de sesión'::character varying, 'Cambio de sesión'::character varying, 'Evaluación disponible'::character varying, 'Evaluación por vencer'::character varying, 'Resultado publicado'::character varying, 'Curso completado'::character varying, 'Certificado disponible'::character varying, 'Aviso general'::character varying])::text[])))
);


--
-- Name: notificaciones_academicas_id_notificacion_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.notificaciones_academicas_id_notificacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notificaciones_academicas_id_notificacion_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.notificaciones_academicas_id_notificacion_seq OWNED BY academia.notificaciones_academicas.id_notificacion;


--
-- Name: pagos_cursos; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.pagos_cursos (
    id_pago bigint NOT NULL,
    id_compra bigint NOT NULL,
    id_metodo_pago smallint NOT NULL,
    monto numeric(10,2) NOT NULL,
    referencia character varying(100),
    ruta_comprobante text,
    nombre_archivo_original character varying(255),
    tipo_archivo character varying(100),
    estado character varying(20) DEFAULT 'Reportado'::character varying NOT NULL,
    fecha_pago timestamp without time zone NOT NULL,
    fecha_reporte timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_validacion timestamp without time zone,
    usuario_valida integer,
    motivo_rechazo text,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_pago_estado CHECK (((estado)::text = ANY ((ARRAY['Reportado'::character varying, 'En revisión'::character varying, 'Aprobado'::character varying, 'Rechazado'::character varying, 'Cancelado'::character varying])::text[]))),
    CONSTRAINT chk_pago_monto CHECK ((monto > (0)::numeric)),
    CONSTRAINT chk_pago_motivo_rechazo CHECK ((((estado)::text <> 'Rechazado'::text) OR (motivo_rechazo IS NOT NULL))),
    CONSTRAINT chk_pago_validacion CHECK (((fecha_validacion IS NULL) OR (fecha_validacion >= fecha_reporte)))
);


--
-- Name: pagos_cursos_id_pago_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.pagos_cursos_id_pago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pagos_cursos_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.pagos_cursos_id_pago_seq OWNED BY academia.pagos_cursos.id_pago;


--
-- Name: participantes; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.participantes (
    id_participante bigint NOT NULL,
    usuario_id integer,
    nombre character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100),
    fecha_nacimiento date,
    sexo character varying(20),
    telefono character varying(20),
    correo character varying(150),
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_participante_fecha_nacimiento CHECK (((fecha_nacimiento IS NULL) OR (fecha_nacimiento <= CURRENT_DATE))),
    CONSTRAINT chk_participante_sexo CHECK (((sexo IS NULL) OR ((sexo)::text = ANY ((ARRAY['Masculino'::character varying, 'Femenino'::character varying, 'Otro'::character varying, 'Prefiere no indicar'::character varying])::text[]))))
);


--
-- Name: participantes_id_participante_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.participantes_id_participante_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participantes_id_participante_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.participantes_id_participante_seq OWNED BY academia.participantes.id_participante;


--
-- Name: progreso_curso; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.progreso_curso (
    id_progreso bigint NOT NULL,
    inscripcion_id integer NOT NULL,
    sesiones_totales smallint DEFAULT 0 NOT NULL,
    sesiones_completadas smallint DEFAULT 0 NOT NULL,
    porcentaje_avance numeric(5,2) DEFAULT 0 NOT NULL,
    porcentaje_asistencia numeric(5,2) DEFAULT 0 NOT NULL,
    estado_academico character varying(20) DEFAULT 'No iniciado'::character varying NOT NULL,
    fecha_inicio timestamp without time zone,
    fecha_ultima_actividad timestamp without time zone,
    fecha_finalizacion timestamp without time zone,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_progreso_completado CHECK ((((estado_academico)::text <> 'Completado'::text) OR (fecha_finalizacion IS NOT NULL))),
    CONSTRAINT chk_progreso_estado CHECK (((estado_academico)::text = ANY ((ARRAY['No iniciado'::character varying, 'En progreso'::character varying, 'Completado'::character varying, 'No aprobado'::character varying, 'Abandonado'::character varying, 'Suspendido'::character varying])::text[]))),
    CONSTRAINT chk_progreso_fecha_actividad CHECK (((fecha_inicio IS NULL) OR (fecha_ultima_actividad IS NULL) OR (fecha_ultima_actividad >= fecha_inicio))),
    CONSTRAINT chk_progreso_fechas CHECK (((fecha_inicio IS NULL) OR (fecha_finalizacion IS NULL) OR (fecha_finalizacion >= fecha_inicio))),
    CONSTRAINT chk_progreso_porcentaje_asistencia CHECK (((porcentaje_asistencia >= (0)::numeric) AND (porcentaje_asistencia <= (100)::numeric))),
    CONSTRAINT chk_progreso_porcentaje_avance CHECK (((porcentaje_avance >= (0)::numeric) AND (porcentaje_avance <= (100)::numeric))),
    CONSTRAINT chk_progreso_sesiones_completadas CHECK (((sesiones_completadas >= 0) AND (sesiones_completadas <= sesiones_totales))),
    CONSTRAINT chk_progreso_sesiones_totales CHECK ((sesiones_totales >= 0))
);


--
-- Name: progreso_curso_id_progreso_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.progreso_curso_id_progreso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: progreso_curso_id_progreso_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.progreso_curso_id_progreso_seq OWNED BY academia.progreso_curso.id_progreso;


--
-- Name: publicaciones; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.publicaciones (
    id_publicacion integer NOT NULL,
    titulo_noticia character varying(255) NOT NULL,
    resumen_bajada text,
    id_autor integer,
    fecha_publicacion date DEFAULT CURRENT_DATE,
    etiquetas text,
    url_imagen text,
    contenido_completo text,
    activo boolean DEFAULT true
);


--
-- Name: publicaciones_id_publicacion_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.publicaciones_id_publicacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: publicaciones_id_publicacion_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.publicaciones_id_publicacion_seq OWNED BY academia.publicaciones.id_publicacion;


--
-- Name: requisitos_aprobacion_curso; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.requisitos_aprobacion_curso (
    id_requisito_aprobacion bigint NOT NULL,
    curso_id integer NOT NULL,
    porcentaje_asistencia_minima numeric(5,2) DEFAULT 80 NOT NULL,
    calificacion_minima numeric(5,2) DEFAULT 70 NOT NULL,
    porcentaje_avance_minimo numeric(5,2) DEFAULT 100 NOT NULL,
    requiere_evaluaciones_obligatorias boolean DEFAULT true NOT NULL,
    requiere_evaluacion_final boolean DEFAULT false NOT NULL,
    permite_faltas_justificadas boolean DEFAULT true NOT NULL,
    maximo_faltas_injustificadas smallint,
    requiere_pago_validado boolean DEFAULT true NOT NULL,
    emite_certificado boolean DEFAULT true NOT NULL,
    vigente boolean DEFAULT true NOT NULL,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_requisito_asistencia CHECK (((porcentaje_asistencia_minima >= (0)::numeric) AND (porcentaje_asistencia_minima <= (100)::numeric))),
    CONSTRAINT chk_requisito_avance CHECK (((porcentaje_avance_minimo >= (0)::numeric) AND (porcentaje_avance_minimo <= (100)::numeric))),
    CONSTRAINT chk_requisito_calificacion CHECK (((calificacion_minima >= (0)::numeric) AND (calificacion_minima <= (100)::numeric))),
    CONSTRAINT chk_requisito_faltas CHECK (((maximo_faltas_injustificadas IS NULL) OR (maximo_faltas_injustificadas >= 0)))
);


--
-- Name: requisitos_aprobacion_curso_id_requisito_aprobacion_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.requisitos_aprobacion_curso_id_requisito_aprobacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: requisitos_aprobacion_curso_id_requisito_aprobacion_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.requisitos_aprobacion_curso_id_requisito_aprobacion_seq OWNED BY academia.requisitos_aprobacion_curso.id_requisito_aprobacion;


--
-- Name: respuestas_encuestas; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.respuestas_encuestas (
    id integer NOT NULL,
    encuesta_id integer,
    usuario_id integer,
    respuestas jsonb,
    fecha_respuesta timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: respuestas_encuestas_id_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.respuestas_encuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: respuestas_encuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.respuestas_encuestas_id_seq OWNED BY academia.respuestas_encuestas.id;


--
-- Name: resultados_evaluaciones; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.resultados_evaluaciones (
    id_resultado bigint NOT NULL,
    evaluacion_id bigint NOT NULL,
    inscripcion_id integer NOT NULL,
    numero_intento smallint NOT NULL,
    puntaje_obtenido numeric(8,2),
    porcentaje_obtenido numeric(5,2),
    aprobado boolean,
    estado_resultado character varying(20) DEFAULT 'Pendiente'::character varying NOT NULL,
    fecha_inicio timestamp without time zone,
    fecha_entrega timestamp without time zone,
    fecha_calificacion timestamp without time zone,
    usuario_califica integer,
    retroalimentacion text,
    evidencia_url text,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_resultado_calificado CHECK ((((estado_resultado)::text <> 'Calificado'::text) OR ((puntaje_obtenido IS NOT NULL) AND (porcentaje_obtenido IS NOT NULL) AND (aprobado IS NOT NULL) AND (fecha_calificacion IS NOT NULL)))),
    CONSTRAINT chk_resultado_estado CHECK (((estado_resultado)::text = ANY ((ARRAY['Pendiente'::character varying, 'En progreso'::character varying, 'Entregado'::character varying, 'Calificado'::character varying, 'Anulado'::character varying])::text[]))),
    CONSTRAINT chk_resultado_fechas_calificacion CHECK (((fecha_entrega IS NULL) OR (fecha_calificacion IS NULL) OR (fecha_calificacion >= fecha_entrega))),
    CONSTRAINT chk_resultado_fechas_entrega CHECK (((fecha_inicio IS NULL) OR (fecha_entrega IS NULL) OR (fecha_entrega >= fecha_inicio))),
    CONSTRAINT chk_resultado_numero_intento CHECK ((numero_intento > 0)),
    CONSTRAINT chk_resultado_porcentaje CHECK (((porcentaje_obtenido IS NULL) OR ((porcentaje_obtenido >= (0)::numeric) AND (porcentaje_obtenido <= (100)::numeric)))),
    CONSTRAINT chk_resultado_puntaje CHECK (((puntaje_obtenido IS NULL) OR (puntaje_obtenido >= (0)::numeric)))
);


--
-- Name: resultados_evaluaciones_id_resultado_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.resultados_evaluaciones_id_resultado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resultados_evaluaciones_id_resultado_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.resultados_evaluaciones_id_resultado_seq OWNED BY academia.resultados_evaluaciones.id_resultado;


--
-- Name: seq_folio_compra; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.seq_folio_compra
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sesiones_curso; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.sesiones_curso (
    id_sesion bigint NOT NULL,
    curso_id integer NOT NULL,
    numero_sesion smallint NOT NULL,
    titulo character varying(150) NOT NULL,
    descripcion text,
    fecha date NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    modalidad_id integer,
    ubicacion_id integer,
    enlace_virtual text,
    estado character varying(20) DEFAULT 'Programada'::character varying NOT NULL,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_sesion_enlace_virtual CHECK (((enlace_virtual IS NULL) OR (length(TRIM(BOTH FROM enlace_virtual)) > 0))),
    CONSTRAINT chk_sesion_estado CHECK (((estado)::text = ANY ((ARRAY['Programada'::character varying, 'En curso'::character varying, 'Finalizada'::character varying, 'Cancelada'::character varying, 'Reprogramada'::character varying])::text[]))),
    CONSTRAINT chk_sesion_horario CHECK ((hora_fin > hora_inicio)),
    CONSTRAINT chk_sesion_numero CHECK ((numero_sesion > 0))
);


--
-- Name: sesiones_curso_id_sesion_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.sesiones_curso_id_sesion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sesiones_curso_id_sesion_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.sesiones_curso_id_sesion_seq OWNED BY academia.sesiones_curso.id_sesion;


--
-- Name: ubicaciones_cursos; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.ubicaciones_cursos (
    id_ubicacion integer NOT NULL,
    nombre_ubicacion character varying(150) NOT NULL,
    direccion_completa text,
    capacidad_maxima integer,
    activo boolean DEFAULT true
);


--
-- Name: ubicaciones_cursos_id_ubicacion_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.ubicaciones_cursos_id_ubicacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ubicaciones_cursos_id_ubicacion_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.ubicaciones_cursos_id_ubicacion_seq OWNED BY academia.ubicaciones_cursos.id_ubicacion;


--
-- Name: vw_agenda_sesiones_cursos; Type: VIEW; Schema: academia; Owner: -
--

CREATE VIEW academia.vw_agenda_sesiones_cursos AS
 WITH inscripciones_por_curso AS (
         SELECT ic.curso_id,
            count(*) AS total_inscripciones,
            count(*) FILTER (WHERE (ic.participante_id IS NOT NULL)) AS inscripciones_con_participante
           FROM academia.inscripciones_cursos ic
          GROUP BY ic.curso_id
        ), asistencias_por_sesion AS (
         SELECT ac.sesion_id,
            count(*) AS asistencias_generadas,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text = 'Pendiente'::text)) AS asistencias_pendientes,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text = 'Presente'::text)) AS presentes,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text = 'Ausente'::text)) AS ausentes,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text = 'Retardo'::text)) AS retardos,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text = 'Falta justificada'::text)) AS faltas_justificadas,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text = 'Salida anticipada'::text)) AS salidas_anticipadas,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text <> 'Pendiente'::text)) AS asistencias_capturadas
           FROM academia.asistencias_curso ac
          GROUP BY ac.sesion_id
        )
 SELECT sc.id_sesion,
    sc.curso_id,
    c.titulo_curso,
    sc.numero_sesion,
    sc.titulo AS titulo_sesion,
    sc.descripcion AS descripcion_sesion,
    sc.fecha,
    sc.hora_inicio,
    sc.hora_fin,
    sc.modalidad_id,
    m.nombre_modalidad AS modalidad,
    sc.ubicacion_id,
    uc.nombre_ubicacion AS ubicacion,
    sc.enlace_virtual,
    sc.estado AS estado_sesion,
    sc.observaciones,
    COALESCE(ipc.total_inscripciones, (0)::bigint) AS total_inscripciones_curso,
    COALESCE(ipc.inscripciones_con_participante, (0)::bigint) AS inscripciones_con_participante,
    COALESCE(aps.asistencias_generadas, (0)::bigint) AS asistencias_generadas,
    COALESCE(aps.asistencias_capturadas, (0)::bigint) AS asistencias_capturadas,
    COALESCE(aps.asistencias_pendientes, (0)::bigint) AS asistencias_pendientes,
    COALESCE(aps.presentes, (0)::bigint) AS presentes,
    COALESCE(aps.ausentes, (0)::bigint) AS ausentes,
    COALESCE(aps.retardos, (0)::bigint) AS retardos,
    COALESCE(aps.faltas_justificadas, (0)::bigint) AS faltas_justificadas,
    COALESCE(aps.salidas_anticipadas, (0)::bigint) AS salidas_anticipadas,
    GREATEST((COALESCE(ipc.total_inscripciones, (0)::bigint) - COALESCE(aps.asistencias_generadas, (0)::bigint)), (0)::bigint) AS registros_asistencia_no_generados,
        CASE
            WHEN (COALESCE(ipc.total_inscripciones, (0)::bigint) = 0) THEN (0)::numeric
            ELSE round((((COALESCE(aps.asistencias_capturadas, (0)::bigint))::numeric / (ipc.total_inscripciones)::numeric) * (100)::numeric), 2)
        END AS porcentaje_captura_asistencia,
        CASE
            WHEN ((sc.estado)::text = 'Cancelada'::text) THEN 'Sesión cancelada'::text
            WHEN (((sc.estado)::text = 'Finalizada'::text) AND (COALESCE(aps.asistencias_pendientes, (0)::bigint) = 0) AND (COALESCE(aps.asistencias_generadas, (0)::bigint) >= COALESCE(ipc.total_inscripciones, (0)::bigint))) THEN 'Asistencia completa'::text
            WHEN (((sc.estado)::text = 'Finalizada'::text) AND ((COALESCE(aps.asistencias_pendientes, (0)::bigint) > 0) OR (COALESCE(aps.asistencias_generadas, (0)::bigint) < COALESCE(ipc.total_inscripciones, (0)::bigint)))) THEN 'Asistencia incompleta'::text
            WHEN ((sc.estado)::text = 'En curso'::text) THEN 'Sesión en desarrollo'::text
            WHEN ((sc.fecha < CURRENT_DATE) AND ((sc.estado)::text = 'Programada'::text)) THEN 'Sesión vencida sin finalizar'::text
            WHEN ((sc.fecha = CURRENT_DATE) AND ((sc.estado)::text = 'Programada'::text)) THEN 'Programada para hoy'::text
            ELSE 'Pendiente'::text
        END AS situacion_operativa,
    sc.created_at,
    sc.updated_at
   FROM (((((academia.sesiones_curso sc
     JOIN academia.cursos c ON ((c.id_curso = sc.curso_id)))
     LEFT JOIN academia.modalidades m ON ((m.id_modalidad = sc.modalidad_id)))
     LEFT JOIN academia.ubicaciones_cursos uc ON ((uc.id_ubicacion = sc.ubicacion_id)))
     LEFT JOIN inscripciones_por_curso ipc ON ((ipc.curso_id = sc.curso_id)))
     LEFT JOIN asistencias_por_sesion aps ON ((aps.sesion_id = sc.id_sesion)));


--
-- Name: usuarios; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.usuarios (
    id integer NOT NULL,
    nombre text NOT NULL,
    "apellidoPaterno" text NOT NULL,
    "apellidoMaterno" text,
    edad integer NOT NULL,
    sexo text NOT NULL,
    telefono text NOT NULL,
    correo text NOT NULL,
    contrasena text NOT NULL,
    rol_id integer NOT NULL,
    reset_token text,
    reset_token_expiry timestamp without time zone,
    intentos_fallidos integer DEFAULT 0,
    bloqueado_hasta timestamp without time zone,
    version_token integer DEFAULT 1,
    mfa_habilitado boolean DEFAULT false,
    secreto_mfa text,
    activo boolean DEFAULT true
);


--
-- Name: vw_control_pagos_cursos; Type: VIEW; Schema: academia; Owner: -
--

CREATE VIEW academia.vw_control_pagos_cursos AS
 WITH pagos_aprobados_por_compra AS (
         SELECT pc_1.id_compra,
            COALESCE(sum(pc_1.monto) FILTER (WHERE ((pc_1.estado)::text = 'Aprobado'::text)), (0)::numeric) AS total_aprobado,
            COALESCE(sum(pc_1.monto) FILTER (WHERE ((pc_1.estado)::text = 'En revisión'::text)), (0)::numeric) AS total_en_revision,
            count(*) AS total_intentos_pago,
            count(*) FILTER (WHERE ((pc_1.estado)::text = 'Aprobado'::text)) AS pagos_aprobados,
            count(*) FILTER (WHERE ((pc_1.estado)::text = 'En revisión'::text)) AS pagos_en_revision,
            count(*) FILTER (WHERE ((pc_1.estado)::text = 'Rechazado'::text)) AS pagos_rechazados,
            count(*) FILTER (WHERE ((pc_1.estado)::text = 'Cancelado'::text)) AS pagos_cancelados
           FROM academia.pagos_cursos pc_1
          GROUP BY pc_1.id_compra
        )
 SELECT pc.id_pago,
    pc.id_compra,
    cc.foliocompra AS folio_compra,
    cc.idusuario AS comprador_id,
    TRIM(BOTH FROM concat_ws(' '::text, comprador.nombre, comprador."apellidoPaterno", comprador."apellidoMaterno")) AS nombre_comprador,
    comprador.correo AS correo_comprador,
    cc.idcurso AS curso_id,
    c.titulo_curso,
    cc.idestadocompra AS estado_compra_id,
    ec.nombre AS estado_compra,
    pc.id_metodo_pago,
    mp.nombre AS metodo_pago,
    mp.requiere_comprobante,
    pc.monto AS monto_pago,
    pc.referencia,
    pc.ruta_comprobante,
    pc.nombre_archivo_original,
    pc.tipo_archivo,
        CASE
            WHEN ((pc.ruta_comprobante IS NOT NULL) AND (length(TRIM(BOTH FROM pc.ruta_comprobante)) > 0)) THEN true
            ELSE false
        END AS tiene_comprobante,
    pc.estado AS estado_pago,
    pc.fecha_pago,
    pc.fecha_reporte,
    pc.fecha_validacion,
    pc.usuario_valida AS usuario_valida_id,
    TRIM(BOTH FROM concat_ws(' '::text, validador.nombre, validador."apellidoPaterno", validador."apellidoMaterno")) AS nombre_usuario_valida,
    pc.motivo_rechazo,
    pc.observaciones AS observaciones_pago,
    cc.cantidadcupos AS cantidad_cupos,
    cc.preciounitario AS precio_unitario,
    cc.subtotal,
    cc.descuento,
    cc.total AS total_compra,
    COALESCE(papc.total_aprobado, (0)::numeric) AS total_aprobado_compra,
    COALESCE(papc.total_en_revision, (0)::numeric) AS total_en_revision_compra,
    GREATEST((cc.total - COALESCE(papc.total_aprobado, (0)::numeric)), (0)::numeric) AS saldo_pendiente,
    COALESCE(papc.total_intentos_pago, (0)::bigint) AS total_intentos_pago,
    COALESCE(papc.pagos_aprobados, (0)::bigint) AS pagos_aprobados_compra,
    COALESCE(papc.pagos_en_revision, (0)::bigint) AS pagos_en_revision_compra,
    COALESCE(papc.pagos_rechazados, (0)::bigint) AS pagos_rechazados_compra,
    COALESCE(papc.pagos_cancelados, (0)::bigint) AS pagos_cancelados_compra,
        CASE
            WHEN (COALESCE(papc.total_aprobado, (0)::numeric) >= cc.total) THEN 'Compra pagada'::text
            WHEN (COALESCE(papc.total_aprobado, (0)::numeric) > (0)::numeric) THEN 'Pago parcial'::text
            WHEN (COALESCE(papc.pagos_en_revision, (0)::bigint) > 0) THEN 'Pago pendiente de revisión'::text
            ELSE 'Sin pago aprobado'::text
        END AS situacion_financiera_compra,
        CASE
            WHEN (((pc.estado)::text = 'En revisión'::text) AND (mp.requiere_comprobante = true) AND ((pc.ruta_comprobante IS NULL) OR (length(TRIM(BOTH FROM pc.ruta_comprobante)) = 0))) THEN true
            ELSE false
        END AS alerta_comprobante_faltante,
        CASE
            WHEN (((pc.estado)::text = 'Rechazado'::text) AND ((pc.motivo_rechazo IS NULL) OR (length(TRIM(BOTH FROM pc.motivo_rechazo)) = 0))) THEN true
            ELSE false
        END AS alerta_rechazo_sin_motivo,
        CASE
            WHEN (((pc.estado)::text = ANY ((ARRAY['Aprobado'::character varying, 'Rechazado'::character varying])::text[])) AND (pc.fecha_validacion IS NULL)) THEN true
            ELSE false
        END AS alerta_validacion_incompleta,
    cc.fechacompra AS fecha_compra,
    cc.fechalimitepago AS fecha_limite_pago
   FROM (((((((academia.pagos_cursos pc
     JOIN academia.comprascursosinacademia cc ON ((cc.idcompra = pc.id_compra)))
     JOIN seguridad.usuarios comprador ON ((comprador.id = cc.idusuario)))
     JOIN academia.cursos c ON ((c.id_curso = cc.idcurso)))
     JOIN academia.estadocomprainacademia ec ON ((ec.idestadocompra = cc.idestadocompra)))
     JOIN academia.metodos_pago_cursos mp ON ((mp.id_metodo_pago = pc.id_metodo_pago)))
     LEFT JOIN seguridad.usuarios validador ON ((validador.id = pc.usuario_valida)))
     LEFT JOIN pagos_aprobados_por_compra papc ON ((papc.id_compra = pc.id_compra)));


--
-- Name: vw_ocupacion_cursos; Type: VIEW; Schema: academia; Owner: -
--

CREATE VIEW academia.vw_ocupacion_cursos AS
 WITH compras_por_curso AS (
         SELECT cc.idcurso AS curso_id,
            count(*) AS total_compras,
            count(*) FILTER (WHERE ((ec.nombre)::text <> ALL ((ARRAY['Cancelada'::character varying, 'Rechazada'::character varying, 'Expirada'::character varying])::text[]))) AS compras_activas,
            count(*) FILTER (WHERE ((ec.nombre)::text = 'Pendiente de pago'::text)) AS compras_pendientes_pago,
            count(*) FILTER (WHERE ((ec.nombre)::text = 'Pago reportado'::text)) AS compras_pago_reportado,
            count(*) FILTER (WHERE ((ec.nombre)::text = ANY ((ARRAY['Pago validado'::character varying, 'Inscripciones generadas'::character varying])::text[]))) AS compras_aprobadas,
            COALESCE(sum(cc.cantidadcupos) FILTER (WHERE ((ec.nombre)::text <> ALL ((ARRAY['Cancelada'::character varying, 'Rechazada'::character varying, 'Expirada'::character varying])::text[]))), (0)::bigint) AS cupos_comprados_activos,
            COALESCE(sum(cc.total) FILTER (WHERE ((ec.nombre)::text <> ALL ((ARRAY['Cancelada'::character varying, 'Rechazada'::character varying, 'Expirada'::character varying])::text[]))), (0)::numeric) AS importe_compras_activas
           FROM (academia.comprascursosinacademia cc
             JOIN academia.estadocomprainacademia ec ON ((ec.idestadocompra = cc.idestadocompra)))
          GROUP BY cc.idcurso
        ), participantes_por_curso AS (
         SELECT cc.idcurso AS curso_id,
            count(*) FILTER (WHERE ((cp.estado)::text <> 'Cancelado'::text)) AS participantes_registrados,
            count(*) FILTER (WHERE ((cp.estado)::text = 'Inscrito'::text)) AS participantes_convertidos_inscripcion
           FROM (academia.compra_participantes cp
             JOIN academia.comprascursosinacademia cc ON ((cc.idcompra = cp.id_compra)))
          GROUP BY cc.idcurso
        ), inscripciones_por_curso AS (
         SELECT ic.curso_id,
            count(*) AS total_inscripciones,
            count(*) FILTER (WHERE ((ic.estado)::text = 'Activo'::text)) AS inscripciones_activas,
            count(*) FILTER (WHERE ((ic.estado)::text = 'Completado'::text)) AS inscripciones_completadas,
            count(*) FILTER (WHERE ((ic.estado)::text = 'Cancelado'::text)) AS inscripciones_canceladas
           FROM academia.inscripciones_cursos ic
          GROUP BY ic.curso_id
        ), pagos_por_curso AS (
         SELECT cc.idcurso AS curso_id,
            COALESCE(sum(pc.monto) FILTER (WHERE ((pc.estado)::text = 'Aprobado'::text)), (0)::numeric) AS ingresos_aprobados,
            COALESCE(sum(pc.monto) FILTER (WHERE ((pc.estado)::text = 'En revisión'::text)), (0)::numeric) AS monto_en_revision,
            count(*) FILTER (WHERE ((pc.estado)::text = 'En revisión'::text)) AS pagos_en_revision,
            count(*) FILTER (WHERE ((pc.estado)::text = 'Rechazado'::text)) AS pagos_rechazados
           FROM (academia.pagos_cursos pc
             JOIN academia.comprascursosinacademia cc ON ((cc.idcompra = pc.id_compra)))
          GROUP BY cc.idcurso
        )
 SELECT c.id_curso AS curso_id,
    c.titulo_curso,
        CASE
            WHEN (c.activo = true) THEN 'Activo'::text
            ELSE 'Inactivo'::text
        END AS estado_curso,
    c.cupo_maximo,
    COALESCE(c.cupos_ocupados, 0) AS cupos_ocupados,
    GREATEST((c.cupo_maximo - COALESCE(c.cupos_ocupados, 0)), 0) AS cupos_disponibles,
        CASE
            WHEN ((c.cupo_maximo IS NULL) OR (c.cupo_maximo = 0)) THEN (0)::numeric
            ELSE round((((COALESCE(c.cupos_ocupados, 0))::numeric / (c.cupo_maximo)::numeric) * (100)::numeric), 2)
        END AS porcentaje_ocupacion,
    COALESCE(cpc.total_compras, (0)::bigint) AS total_compras,
    COALESCE(cpc.compras_activas, (0)::bigint) AS compras_activas,
    COALESCE(cpc.compras_pendientes_pago, (0)::bigint) AS compras_pendientes_pago,
    COALESCE(cpc.compras_pago_reportado, (0)::bigint) AS compras_pago_reportado,
    COALESCE(cpc.compras_aprobadas, (0)::bigint) AS compras_aprobadas,
    COALESCE(cpc.cupos_comprados_activos, (0)::bigint) AS cupos_comprados_activos,
    COALESCE(ppc.participantes_registrados, (0)::bigint) AS participantes_registrados,
    COALESCE(ppc.participantes_convertidos_inscripcion, (0)::bigint) AS participantes_inscritos_desde_compra,
    COALESCE(ipc.total_inscripciones, (0)::bigint) AS total_inscripciones,
    COALESCE(ipc.inscripciones_activas, (0)::bigint) AS inscripciones_activas,
    COALESCE(ipc.inscripciones_completadas, (0)::bigint) AS inscripciones_completadas,
    COALESCE(ipc.inscripciones_canceladas, (0)::bigint) AS inscripciones_canceladas,
    COALESCE(cpc.importe_compras_activas, (0)::numeric) AS importe_compras_activas,
    COALESCE(pgc.ingresos_aprobados, (0)::numeric) AS ingresos_aprobados,
    COALESCE(pgc.monto_en_revision, (0)::numeric) AS monto_en_revision,
    COALESCE(pgc.pagos_en_revision, (0)::bigint) AS pagos_en_revision,
    COALESCE(pgc.pagos_rechazados, (0)::bigint) AS pagos_rechazados,
        CASE
            WHEN ((c.cupo_maximo IS NULL) OR (c.cupo_maximo = 0)) THEN 'Sin cupo configurado'::text
            WHEN (COALESCE(c.cupos_ocupados, 0) >= c.cupo_maximo) THEN 'Cupo completo'::text
            WHEN (((COALESCE(c.cupos_ocupados, 0))::numeric / (c.cupo_maximo)::numeric) >= 0.80) THEN 'Ocupación alta'::text
            WHEN (((COALESCE(c.cupos_ocupados, 0))::numeric / (c.cupo_maximo)::numeric) >= 0.40) THEN 'Ocupación media'::text
            ELSE 'Ocupación baja'::text
        END AS nivel_ocupacion,
        CASE
            WHEN (COALESCE(c.cupos_ocupados, 0) = COALESCE(cpc.cupos_comprados_activos, (0)::bigint)) THEN true
            ELSE false
        END AS cupos_consistentes_con_compras
   FROM ((((academia.cursos c
     LEFT JOIN compras_por_curso cpc ON ((cpc.curso_id = c.id_curso)))
     LEFT JOIN participantes_por_curso ppc ON ((ppc.curso_id = c.id_curso)))
     LEFT JOIN inscripciones_por_curso ipc ON ((ipc.curso_id = c.id_curso)))
     LEFT JOIN pagos_por_curso pgc ON ((pgc.curso_id = c.id_curso)));


--
-- Name: vw_resumen_compras_cursos; Type: VIEW; Schema: academia; Owner: -
--

CREATE VIEW academia.vw_resumen_compras_cursos AS
 WITH participantes_por_compra AS (
         SELECT cp.id_compra,
            count(*) FILTER (WHERE ((cp.estado)::text <> 'Cancelado'::text)) AS participantes_registrados,
            count(*) FILTER (WHERE ((cp.estado)::text = 'Inscrito'::text)) AS participantes_inscritos
           FROM academia.compra_participantes cp
          GROUP BY cp.id_compra
        ), pagos_por_compra AS (
         SELECT pc.id_compra,
            COALESCE(sum(pc.monto) FILTER (WHERE ((pc.estado)::text = 'Aprobado'::text)), (0)::numeric) AS total_pagado,
            count(*) FILTER (WHERE ((pc.estado)::text = 'En revisión'::text)) AS pagos_en_revision,
            count(*) FILTER (WHERE ((pc.estado)::text = 'Rechazado'::text)) AS pagos_rechazados
           FROM academia.pagos_cursos pc
          GROUP BY pc.id_compra
        )
 SELECT cc.idcompra AS id_compra,
    cc.foliocompra AS folio_compra,
    cc.idusuario AS usuario_comprador_id,
    TRIM(BOTH FROM concat_ws(' '::text, u.nombre, u."apellidoPaterno", u."apellidoMaterno")) AS nombre_comprador,
    u.correo AS correo_comprador,
    cc.idcurso AS curso_id,
    c.titulo_curso,
    cc.idestadocompra AS estado_compra_id,
    ec.nombre AS estado_compra,
    cc.cantidadcupos AS cantidad_cupos,
    COALESCE(ppc.participantes_registrados, (0)::bigint) AS participantes_registrados,
    COALESCE(ppc.participantes_inscritos, (0)::bigint) AS participantes_inscritos,
    (cc.cantidadcupos - COALESCE(ppc.participantes_registrados, (0)::bigint)) AS cupos_sin_asignar,
    cc.preciounitario AS precio_unitario,
    cc.subtotal,
    cc.descuento,
    cc.total,
    COALESCE(ppc2.total_pagado, (0)::numeric) AS total_pagado,
    GREATEST((cc.total - COALESCE(ppc2.total_pagado, (0)::numeric)), (0)::numeric) AS saldo_pendiente,
    COALESCE(ppc2.pagos_en_revision, (0)::bigint) AS pagos_en_revision,
    COALESCE(ppc2.pagos_rechazados, (0)::bigint) AS pagos_rechazados,
        CASE
            WHEN (COALESCE(ppc2.total_pagado, (0)::numeric) >= cc.total) THEN 'Pagada'::text
            WHEN (COALESCE(ppc2.total_pagado, (0)::numeric) > (0)::numeric) THEN 'Pago parcial'::text
            WHEN (COALESCE(ppc2.pagos_en_revision, (0)::bigint) > 0) THEN 'Pago en revisión'::text
            ELSE 'Sin pago aprobado'::text
        END AS situacion_pago,
    cc.fechacompra AS fecha_compra,
    cc.fechalimitepago AS fecha_limite_pago,
    cc.fechapago AS fecha_pago_reportado,
    cc.fechavalidacion AS fecha_validacion,
    cc.usuariovalida AS usuario_valida_id,
    cc.observaciones
   FROM (((((academia.comprascursosinacademia cc
     JOIN seguridad.usuarios u ON ((u.id = cc.idusuario)))
     JOIN academia.cursos c ON ((c.id_curso = cc.idcurso)))
     JOIN academia.estadocomprainacademia ec ON ((ec.idestadocompra = cc.idestadocompra)))
     LEFT JOIN participantes_por_compra ppc ON ((ppc.id_compra = cc.idcompra)))
     LEFT JOIN pagos_por_compra ppc2 ON ((ppc2.id_compra = cc.idcompra)));


--
-- Name: vw_seguimiento_academico_cursos; Type: VIEW; Schema: academia; Owner: -
--

CREATE VIEW academia.vw_seguimiento_academico_cursos AS
 WITH sesiones_por_curso AS (
         SELECT sc.curso_id,
            count(*) AS total_sesiones,
            count(*) FILTER (WHERE ((sc.estado)::text = 'Programada'::text)) AS sesiones_programadas,
            count(*) FILTER (WHERE ((sc.estado)::text = 'En curso'::text)) AS sesiones_en_curso,
            count(*) FILTER (WHERE ((sc.estado)::text = 'Finalizada'::text)) AS sesiones_finalizadas,
            count(*) FILTER (WHERE ((sc.estado)::text = 'Cancelada'::text)) AS sesiones_canceladas,
            min(sc.fecha) AS primera_fecha_sesion,
            max(sc.fecha) AS ultima_fecha_sesion
           FROM academia.sesiones_curso sc
          GROUP BY sc.curso_id
        ), inscripciones_por_curso AS (
         SELECT ic.curso_id,
            count(*) AS total_inscripciones,
            count(*) FILTER (WHERE (ic.participante_id IS NOT NULL)) AS inscripciones_con_participante,
            count(*) FILTER (WHERE ((ic.origen_inscripcion)::text = 'Compra'::text)) AS inscripciones_por_compra,
            count(*) FILTER (WHERE ((ic.origen_inscripcion)::text = 'Administrativa'::text)) AS inscripciones_administrativas,
            count(*) FILTER (WHERE ((ic.origen_inscripcion)::text = 'Sistema anterior'::text)) AS inscripciones_sistema_anterior
           FROM academia.inscripciones_cursos ic
          GROUP BY ic.curso_id
        ), progreso_por_curso AS (
         SELECT ic.curso_id,
            count(*) FILTER (WHERE ((pc.estado_academico)::text = 'No iniciado'::text)) AS participantes_no_iniciados,
            count(*) FILTER (WHERE ((pc.estado_academico)::text = 'En progreso'::text)) AS participantes_en_progreso,
            count(*) FILTER (WHERE ((pc.estado_academico)::text = 'Completado'::text)) AS participantes_completados,
            count(*) FILTER (WHERE ((pc.estado_academico)::text = 'No aprobado'::text)) AS participantes_no_aprobados,
            count(*) FILTER (WHERE ((pc.estado_academico)::text = 'Abandonado'::text)) AS participantes_abandonaron,
            count(*) FILTER (WHERE ((pc.estado_academico)::text = 'Suspendido'::text)) AS participantes_suspendidos,
            round(avg(pc.porcentaje_avance), 2) AS promedio_avance,
            round(avg(pc.porcentaje_asistencia), 2) AS promedio_asistencia
           FROM (academia.inscripciones_cursos ic
             JOIN academia.progreso_curso pc ON ((pc.inscripcion_id = ic.id_inscripcion)))
          GROUP BY ic.curso_id
        ), evaluaciones_por_curso AS (
         SELECT ec.curso_id,
            count(*) AS total_evaluaciones,
            count(*) FILTER (WHERE (ec.obligatoria = true)) AS evaluaciones_obligatorias,
            count(*) FILTER (WHERE ((ec.tipo_evaluacion)::text = 'Evaluación final'::text)) AS evaluaciones_finales,
            count(*) FILTER (WHERE ((ec.estado)::text = 'Publicada'::text)) AS evaluaciones_publicadas,
            count(*) FILTER (WHERE ((ec.estado)::text = 'Cerrada'::text)) AS evaluaciones_cerradas,
            COALESCE(sum(ec.ponderacion), (0)::numeric) AS ponderacion_total
           FROM academia.evaluaciones_curso ec
          WHERE ((ec.estado)::text <> 'Cancelada'::text)
          GROUP BY ec.curso_id
        ), resultados_por_curso AS (
         SELECT ic.curso_id,
            count(*) FILTER (WHERE ((re.estado_resultado)::text = 'Calificado'::text)) AS intentos_calificados,
            count(*) FILTER (WHERE (((re.estado_resultado)::text = 'Calificado'::text) AND (re.aprobado = true))) AS intentos_aprobados,
            count(*) FILTER (WHERE (((re.estado_resultado)::text = 'Calificado'::text) AND (re.aprobado = false))) AS intentos_no_aprobados,
            count(DISTINCT re.inscripcion_id) FILTER (WHERE ((re.estado_resultado)::text = 'Calificado'::text)) AS participantes_evaluados,
            round(avg(re.porcentaje_obtenido) FILTER (WHERE (((re.estado_resultado)::text = 'Calificado'::text) AND (re.porcentaje_obtenido IS NOT NULL))), 2) AS promedio_resultados
           FROM (academia.resultados_evaluaciones re
             JOIN academia.inscripciones_cursos ic ON ((ic.id_inscripcion = re.inscripcion_id)))
          GROUP BY ic.curso_id
        ), certificados_por_curso AS (
         SELECT ic.curso_id,
            count(*) AS total_certificados,
            count(*) FILTER (WHERE ((cert.estado)::text = 'Generado'::text)) AS certificados_generados,
            count(*) FILTER (WHERE ((cert.estado)::text = 'Emitido'::text)) AS certificados_emitidos,
            count(*) FILTER (WHERE ((cert.estado)::text = 'Revocado'::text)) AS certificados_revocados,
            count(*) FILTER (WHERE ((cert.estado)::text = 'Anulado'::text)) AS certificados_anulados
           FROM (academia.certificados_curso cert
             JOIN academia.inscripciones_cursos ic ON ((ic.id_inscripcion = cert.inscripcion_id)))
          GROUP BY ic.curso_id
        )
 SELECT c.id_curso AS curso_id,
    c.titulo_curso,
        CASE
            WHEN (c.activo = true) THEN 'Activo'::text
            ELSE 'Inactivo'::text
        END AS estado_curso,
    c.cupo_maximo,
    COALESCE(c.cupos_ocupados, 0) AS cupos_ocupados,
    COALESCE(spc.total_sesiones, (0)::bigint) AS total_sesiones,
    COALESCE(spc.sesiones_programadas, (0)::bigint) AS sesiones_programadas,
    COALESCE(spc.sesiones_en_curso, (0)::bigint) AS sesiones_en_curso,
    COALESCE(spc.sesiones_finalizadas, (0)::bigint) AS sesiones_finalizadas,
    COALESCE(spc.sesiones_canceladas, (0)::bigint) AS sesiones_canceladas,
    spc.primera_fecha_sesion,
    spc.ultima_fecha_sesion,
    COALESCE(ipc.total_inscripciones, (0)::bigint) AS total_inscripciones,
    COALESCE(ipc.inscripciones_con_participante, (0)::bigint) AS inscripciones_con_participante,
    COALESCE(ipc.inscripciones_por_compra, (0)::bigint) AS inscripciones_por_compra,
    COALESCE(ipc.inscripciones_administrativas, (0)::bigint) AS inscripciones_administrativas,
    COALESCE(ipc.inscripciones_sistema_anterior, (0)::bigint) AS inscripciones_sistema_anterior,
    COALESCE(ppc.participantes_no_iniciados, (0)::bigint) AS participantes_no_iniciados,
    COALESCE(ppc.participantes_en_progreso, (0)::bigint) AS participantes_en_progreso,
    COALESCE(ppc.participantes_completados, (0)::bigint) AS participantes_completados,
    COALESCE(ppc.participantes_no_aprobados, (0)::bigint) AS participantes_no_aprobados,
    COALESCE(ppc.participantes_abandonaron, (0)::bigint) AS participantes_abandonaron,
    COALESCE(ppc.participantes_suspendidos, (0)::bigint) AS participantes_suspendidos,
    COALESCE(ppc.promedio_avance, (0)::numeric) AS promedio_avance,
    COALESCE(ppc.promedio_asistencia, (0)::numeric) AS promedio_asistencia,
    COALESCE(epc.total_evaluaciones, (0)::bigint) AS total_evaluaciones,
    COALESCE(epc.evaluaciones_obligatorias, (0)::bigint) AS evaluaciones_obligatorias,
    COALESCE(epc.evaluaciones_finales, (0)::bigint) AS evaluaciones_finales,
    COALESCE(epc.evaluaciones_publicadas, (0)::bigint) AS evaluaciones_publicadas,
    COALESCE(epc.evaluaciones_cerradas, (0)::bigint) AS evaluaciones_cerradas,
    COALESCE(epc.ponderacion_total, (0)::numeric) AS ponderacion_total,
    COALESCE(rpc.participantes_evaluados, (0)::bigint) AS participantes_evaluados,
    COALESCE(rpc.intentos_calificados, (0)::bigint) AS intentos_calificados,
    COALESCE(rpc.intentos_aprobados, (0)::bigint) AS intentos_aprobados,
    COALESCE(rpc.intentos_no_aprobados, (0)::bigint) AS intentos_no_aprobados,
    COALESCE(rpc.promedio_resultados, (0)::numeric) AS promedio_resultados,
    COALESCE(cpc.total_certificados, (0)::bigint) AS total_certificados,
    COALESCE(cpc.certificados_generados, (0)::bigint) AS certificados_generados,
    COALESCE(cpc.certificados_emitidos, (0)::bigint) AS certificados_emitidos,
    COALESCE(cpc.certificados_revocados, (0)::bigint) AS certificados_revocados,
    COALESCE(cpc.certificados_anulados, (0)::bigint) AS certificados_anulados,
    GREATEST((COALESCE(ppc.participantes_completados, (0)::bigint) - COALESCE(cpc.certificados_emitidos, (0)::bigint)), (0)::bigint) AS completados_sin_certificado,
        CASE
            WHEN (COALESCE(spc.total_sesiones, (0)::bigint) = 0) THEN 'Sin sesiones'::text
            WHEN (COALESCE(spc.sesiones_finalizadas, (0)::bigint) = COALESCE(spc.total_sesiones, (0)::bigint)) THEN 'Sesiones finalizadas'::text
            WHEN (COALESCE(spc.sesiones_en_curso, (0)::bigint) > 0) THEN 'Curso en desarrollo'::text
            WHEN (COALESCE(spc.sesiones_finalizadas, (0)::bigint) > 0) THEN 'Curso iniciado'::text
            ELSE 'Pendiente de inicio'::text
        END AS situacion_academica
   FROM ((((((academia.cursos c
     LEFT JOIN sesiones_por_curso spc ON ((spc.curso_id = c.id_curso)))
     LEFT JOIN inscripciones_por_curso ipc ON ((ipc.curso_id = c.id_curso)))
     LEFT JOIN progreso_por_curso ppc ON ((ppc.curso_id = c.id_curso)))
     LEFT JOIN evaluaciones_por_curso epc ON ((epc.curso_id = c.id_curso)))
     LEFT JOIN resultados_por_curso rpc ON ((rpc.curso_id = c.id_curso)))
     LEFT JOIN certificados_por_curso cpc ON ((cpc.curso_id = c.id_curso)));


--
-- Name: vw_alertas_administrativas; Type: VIEW; Schema: academia; Owner: -
--

CREATE VIEW academia.vw_alertas_administrativas AS
 SELECT 'Compra vencida'::character varying(50) AS tipo_alerta,
    'Crítica'::character varying(20) AS nivel_alerta,
    'Compra'::character varying(30) AS entidad,
    rc.id_compra AS entidad_id,
    (rc.folio_compra)::character varying(150) AS referencia,
    'Compra vencida con saldo pendiente'::character varying(200) AS titulo_alerta,
    concat('La compra ', rc.folio_compra, ' tiene un saldo pendiente de $', rc.saldo_pendiente, ' y su fecha límite de pago fue ', rc.fecha_limite_pago, '.') AS descripcion_alerta,
    rc.fecha_limite_pago AS fecha_referencia,
    concat('/administracion/compras/', rc.id_compra) AS ruta_revision,
    (1)::smallint AS orden_prioridad
   FROM academia.vw_resumen_compras_cursos rc
  WHERE ((rc.saldo_pendiente > (0)::numeric) AND (rc.fecha_limite_pago < CURRENT_TIMESTAMP) AND ((rc.estado_compra)::text <> ALL ((ARRAY['Cancelada'::character varying, 'Rechazada'::character varying, 'Expirada'::character varying])::text[])))
UNION ALL
 SELECT 'Pago pendiente'::character varying(50) AS tipo_alerta,
    'Advertencia'::character varying(20) AS nivel_alerta,
    'Pago'::character varying(30) AS entidad,
    pc.id_pago AS entidad_id,
    (pc.folio_compra)::character varying(150) AS referencia,
    'Pago pendiente de revisión'::character varying(200) AS titulo_alerta,
    concat('Existe un pago de $', pc.monto_pago, ' reportado para la compra ', pc.folio_compra, ' mediante ', pc.metodo_pago, '.') AS descripcion_alerta,
    pc.fecha_reporte AS fecha_referencia,
    concat('/administracion/pagos/', pc.id_pago) AS ruta_revision,
    (2)::smallint AS orden_prioridad
   FROM academia.vw_control_pagos_cursos pc
  WHERE ((pc.estado_pago)::text = 'En revisión'::text)
UNION ALL
 SELECT 'Comprobante faltante'::character varying(50) AS tipo_alerta,
    'Crítica'::character varying(20) AS nivel_alerta,
    'Pago'::character varying(30) AS entidad,
    pc.id_pago AS entidad_id,
    (pc.folio_compra)::character varying(150) AS referencia,
    'Pago sin comprobante requerido'::character varying(200) AS titulo_alerta,
    concat('El método de pago ', pc.metodo_pago, ' requiere comprobante, pero el pago no tiene un archivo asociado.') AS descripcion_alerta,
    pc.fecha_reporte AS fecha_referencia,
    concat('/administracion/pagos/', pc.id_pago) AS ruta_revision,
    (1)::smallint AS orden_prioridad
   FROM academia.vw_control_pagos_cursos pc
  WHERE (pc.alerta_comprobante_faltante = true)
UNION ALL
 SELECT 'Validación incompleta'::character varying(50) AS tipo_alerta,
    'Advertencia'::character varying(20) AS nivel_alerta,
    'Pago'::character varying(30) AS entidad,
    pc.id_pago AS entidad_id,
    (pc.folio_compra)::character varying(150) AS referencia,
    'Pago con validación incompleta'::character varying(200) AS titulo_alerta,
    concat('El pago aparece como ', pc.estado_pago, ', pero no tiene completa la información de validación.') AS descripcion_alerta,
    COALESCE(pc.fecha_validacion, pc.fecha_reporte) AS fecha_referencia,
    concat('/administracion/pagos/', pc.id_pago) AS ruta_revision,
    (2)::smallint AS orden_prioridad
   FROM academia.vw_control_pagos_cursos pc
  WHERE (pc.alerta_validacion_incompleta = true)
UNION ALL
 SELECT 'Inconsistencia de cupos'::character varying(50) AS tipo_alerta,
    'Crítica'::character varying(20) AS nivel_alerta,
    'Curso'::character varying(30) AS entidad,
    (oc.curso_id)::bigint AS entidad_id,
    (oc.titulo_curso)::character varying(150) AS referencia,
    'Los cupos registrados requieren revisión'::character varying(200) AS titulo_alerta,
    concat('El curso tiene ', oc.cupos_ocupados, ' cupos ocupados, pero las compras activas representan ', oc.cupos_comprados_activos, ' cupos.') AS descripcion_alerta,
    NULL::timestamp without time zone AS fecha_referencia,
    concat('/administracion/cursos/', oc.curso_id, '/ocupacion') AS ruta_revision,
    (1)::smallint AS orden_prioridad
   FROM academia.vw_ocupacion_cursos oc
  WHERE (oc.cupos_consistentes_con_compras = false)
UNION ALL
 SELECT 'Cupo completo'::character varying(50) AS tipo_alerta,
    'Informativa'::character varying(20) AS nivel_alerta,
    'Curso'::character varying(30) AS entidad,
    (oc.curso_id)::bigint AS entidad_id,
    (oc.titulo_curso)::character varying(150) AS referencia,
    'Curso sin cupos disponibles'::character varying(200) AS titulo_alerta,
    concat('El curso alcanzó ', oc.cupos_ocupados, ' de ', oc.cupo_maximo, ' cupos.') AS descripcion_alerta,
    NULL::timestamp without time zone AS fecha_referencia,
    concat('/administracion/cursos/', oc.curso_id, '/ocupacion') AS ruta_revision,
    (3)::smallint AS orden_prioridad
   FROM academia.vw_ocupacion_cursos oc
  WHERE ((oc.cupo_maximo > 0) AND (oc.cupos_disponibles = 0))
UNION ALL
 SELECT 'Asistencia incompleta'::character varying(50) AS tipo_alerta,
    'Advertencia'::character varying(20) AS nivel_alerta,
    'Sesión'::character varying(30) AS entidad,
    ag.id_sesion AS entidad_id,
    (concat(ag.titulo_curso, ' - Sesión ', ag.numero_sesion))::character varying(150) AS referencia,
    'Captura de asistencia incompleta'::character varying(200) AS titulo_alerta,
    concat('La sesión tiene ', ag.asistencias_pendientes, ' asistencias pendientes y ', ag.registros_asistencia_no_generados, ' registros que todavía no fueron generados.') AS descripcion_alerta,
    ((ag.fecha)::timestamp without time zone + (ag.hora_inicio)::interval) AS fecha_referencia,
    concat('/administracion/sesiones/', ag.id_sesion, '/asistencia') AS ruta_revision,
    (2)::smallint AS orden_prioridad
   FROM academia.vw_agenda_sesiones_cursos ag
  WHERE (ag.situacion_operativa = 'Asistencia incompleta'::text)
UNION ALL
 SELECT 'Sesión vencida'::character varying(50) AS tipo_alerta,
    'Advertencia'::character varying(20) AS nivel_alerta,
    'Sesión'::character varying(30) AS entidad,
    ag.id_sesion AS entidad_id,
    (concat(ag.titulo_curso, ' - Sesión ', ag.numero_sesion))::character varying(150) AS referencia,
    'Sesión vencida sin finalizar'::character varying(200) AS titulo_alerta,
    concat('La sesión estaba programada para el ', ag.fecha, ' a las ', ag.hora_inicio, ' y todavía aparece como programada.') AS descripcion_alerta,
    ((ag.fecha)::timestamp without time zone + (ag.hora_inicio)::interval) AS fecha_referencia,
    concat('/administracion/sesiones/', ag.id_sesion) AS ruta_revision,
    (2)::smallint AS orden_prioridad
   FROM academia.vw_agenda_sesiones_cursos ag
  WHERE (ag.situacion_operativa = 'Sesión vencida sin finalizar'::text)
UNION ALL
 SELECT 'Ponderación incorrecta'::character varying(50) AS tipo_alerta,
    'Advertencia'::character varying(20) AS nivel_alerta,
    'Curso'::character varying(30) AS entidad,
    (sa.curso_id)::bigint AS entidad_id,
    (sa.titulo_curso)::character varying(150) AS referencia,
    'Las evaluaciones no suman 100%'::character varying(200) AS titulo_alerta,
    concat('La ponderación total configurada es de ', sa.ponderacion_total, '%.') AS descripcion_alerta,
    NULL::timestamp without time zone AS fecha_referencia,
    concat('/administracion/cursos/', sa.curso_id, '/evaluaciones') AS ruta_revision,
    (2)::smallint AS orden_prioridad
   FROM academia.vw_seguimiento_academico_cursos sa
  WHERE ((sa.total_evaluaciones > 0) AND (sa.ponderacion_total <> (100)::numeric))
UNION ALL
 SELECT 'Certificado pendiente'::character varying(50) AS tipo_alerta,
    'Advertencia'::character varying(20) AS nivel_alerta,
    'Curso'::character varying(30) AS entidad,
    (sa.curso_id)::bigint AS entidad_id,
    (sa.titulo_curso)::character varying(150) AS referencia,
    'Participantes completados sin certificado'::character varying(200) AS titulo_alerta,
    concat(sa.completados_sin_certificado, ' participante(s) completaron el curso, pero no tienen certificado emitido.') AS descripcion_alerta,
    NULL::timestamp without time zone AS fecha_referencia,
    concat('/administracion/cursos/', sa.curso_id, '/certificados') AS ruta_revision,
    (2)::smallint AS orden_prioridad
   FROM academia.vw_seguimiento_academico_cursos sa
  WHERE (sa.completados_sin_certificado > 0);


--
-- Name: vw_detalle_participantes_cursos; Type: VIEW; Schema: academia; Owner: -
--

CREATE VIEW academia.vw_detalle_participantes_cursos AS
 WITH resumen_asistencias AS (
         SELECT ac.inscripcion_id,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text <> 'Pendiente'::text)) AS sesiones_registradas,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text = 'Presente'::text)) AS asistencias_presentes,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text = 'Retardo'::text)) AS retardos,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text = 'Ausente'::text)) AS ausencias,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text = 'Falta justificada'::text)) AS faltas_justificadas,
            count(*) FILTER (WHERE ((ac.estado_asistencia)::text = 'Salida anticipada'::text)) AS salidas_anticipadas
           FROM academia.asistencias_curso ac
          GROUP BY ac.inscripcion_id
        ), resumen_evaluaciones AS (
         SELECT re_1.inscripcion_id,
            count(DISTINCT re_1.evaluacion_id) FILTER (WHERE ((re_1.estado_resultado)::text = 'Calificado'::text)) AS evaluaciones_calificadas,
            count(DISTINCT re_1.evaluacion_id) FILTER (WHERE (((re_1.estado_resultado)::text = 'Calificado'::text) AND (re_1.aprobado = true))) AS evaluaciones_aprobadas,
            count(DISTINCT re_1.evaluacion_id) FILTER (WHERE (((re_1.estado_resultado)::text = 'Calificado'::text) AND (re_1.aprobado = false))) AS evaluaciones_no_aprobadas,
            round(avg(re_1.porcentaje_obtenido) FILTER (WHERE (((re_1.estado_resultado)::text = 'Calificado'::text) AND (re_1.porcentaje_obtenido IS NOT NULL))), 2) AS promedio_evaluaciones
           FROM academia.resultados_evaluaciones re_1
          GROUP BY re_1.inscripcion_id
        )
 SELECT ic.id_inscripcion,
    ic.curso_id,
    c.titulo_curso,
    ic.participante_id,
    TRIM(BOTH FROM concat_ws(' '::text, p.nombre, p.apellido_paterno, p.apellido_materno)) AS nombre_participante,
    p.fecha_nacimiento,
    p.sexo,
    p.correo AS correo_participante,
    p.telefono AS telefono_participante,
    ic.compra_participante_id,
    cp.id_compra,
    cc.foliocompra AS folio_compra,
    cc.idusuario AS comprador_id,
    TRIM(BOTH FROM concat_ws(' '::text, u.nombre, u."apellidoPaterno", u."apellidoMaterno")) AS nombre_comprador,
    u.correo AS correo_comprador,
    ic.fecha_inscripcion,
    ic.fecha_confirmacion,
    ic.estado AS estado_inscripcion,
    ic.origen_inscripcion,
    pc.estado_academico,
    COALESCE((pc.sesiones_totales)::integer, 0) AS sesiones_totales,
    COALESCE((pc.sesiones_completadas)::integer, 0) AS sesiones_completadas,
    COALESCE(pc.porcentaje_avance, (0)::numeric) AS porcentaje_avance,
    COALESCE(pc.porcentaje_asistencia, (0)::numeric) AS porcentaje_asistencia,
    pc.fecha_inicio,
    pc.fecha_ultima_actividad,
    pc.fecha_finalizacion,
    COALESCE(ra.sesiones_registradas, (0)::bigint) AS sesiones_con_asistencia_registrada,
    COALESCE(ra.asistencias_presentes, (0)::bigint) AS asistencias_presentes,
    COALESCE(ra.retardos, (0)::bigint) AS retardos,
    COALESCE(ra.ausencias, (0)::bigint) AS ausencias,
    COALESCE(ra.faltas_justificadas, (0)::bigint) AS faltas_justificadas,
    COALESCE(ra.salidas_anticipadas, (0)::bigint) AS salidas_anticipadas,
    COALESCE(re.evaluaciones_calificadas, (0)::bigint) AS evaluaciones_calificadas,
    COALESCE(re.evaluaciones_aprobadas, (0)::bigint) AS evaluaciones_aprobadas,
    COALESCE(re.evaluaciones_no_aprobadas, (0)::bigint) AS evaluaciones_no_aprobadas,
    re.promedio_evaluaciones,
    cert.id_certificado,
    cert.folio_certificado,
    cert.codigo_verificacion,
    cert.estado AS estado_certificado,
    cert.fecha_emision AS fecha_emision_certificado,
    cert.fecha_revocacion AS fecha_revocacion_certificado,
        CASE
            WHEN (cert.id_certificado IS NULL) THEN 'Sin certificado'::character varying
            WHEN ((cert.estado)::text = 'Emitido'::text) THEN 'Certificado vigente'::character varying
            WHEN ((cert.estado)::text = 'Generado'::text) THEN 'Pendiente de emisión'::character varying
            WHEN ((cert.estado)::text = 'Revocado'::text) THEN 'Certificado revocado'::character varying
            WHEN ((cert.estado)::text = 'Anulado'::text) THEN 'Certificado anulado'::character varying
            ELSE cert.estado
        END AS situacion_certificado
   FROM (((((((((academia.inscripciones_cursos ic
     JOIN academia.cursos c ON ((c.id_curso = ic.curso_id)))
     LEFT JOIN academia.participantes p ON ((p.id_participante = ic.participante_id)))
     LEFT JOIN academia.compra_participantes cp ON ((cp.id_compra_participante = ic.compra_participante_id)))
     LEFT JOIN academia.comprascursosinacademia cc ON ((cc.idcompra = cp.id_compra)))
     LEFT JOIN seguridad.usuarios u ON ((u.id = cc.idusuario)))
     LEFT JOIN academia.progreso_curso pc ON ((pc.inscripcion_id = ic.id_inscripcion)))
     LEFT JOIN resumen_asistencias ra ON ((ra.inscripcion_id = ic.id_inscripcion)))
     LEFT JOIN resumen_evaluaciones re ON ((re.inscripcion_id = ic.id_inscripcion)))
     LEFT JOIN academia.certificados_curso cert ON ((cert.inscripcion_id = ic.id_inscripcion)));


--
-- Name: vw_indicadores_generales; Type: VIEW; Schema: academia; Owner: -
--

CREATE VIEW academia.vw_indicadores_generales AS
 WITH indicadores_cursos AS (
         SELECT count(*) AS total_cursos,
            count(*) FILTER (WHERE (c.activo = true)) AS cursos_activos,
            count(*) FILTER (WHERE (c.activo = false)) AS cursos_inactivos,
            COALESCE(sum(c.cupo_maximo), (0)::bigint) AS cupo_maximo_total,
            COALESCE(sum(c.cupos_ocupados), (0)::bigint) AS cupos_ocupados_total,
            COALESCE(sum(GREATEST((c.cupo_maximo - COALESCE(c.cupos_ocupados, 0)), 0)), (0)::bigint) AS cupos_disponibles_total
           FROM academia.cursos c
        ), indicadores_compras AS (
         SELECT count(*) AS total_compras,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Pendiente de pago'::text)) AS compras_pendientes_pago,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Pago reportado'::text)) AS compras_pago_reportado,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Pago validado'::text)) AS compras_pago_validado,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Inscripciones generadas'::text)) AS compras_con_inscripciones,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Cancelada'::text)) AS compras_canceladas,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Rechazada'::text)) AS compras_rechazadas,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Expirada'::text)) AS compras_expiradas,
            COALESCE(sum(rc.total), (0)::numeric) AS importe_total_compras,
            COALESCE(sum(rc.total_pagado), (0)::numeric) AS ingresos_aprobados,
            COALESCE(sum(rc.saldo_pendiente), (0)::numeric) AS saldo_pendiente_total,
            COALESCE(sum(rc.cantidad_cupos), (0)::bigint) AS cupos_comprados,
            COALESCE(sum(rc.participantes_registrados), (0)::numeric) AS participantes_registrados_compras
           FROM academia.vw_resumen_compras_cursos rc
        ), indicadores_pagos AS (
         SELECT count(*) AS total_pagos,
            count(*) FILTER (WHERE ((pc.estado_pago)::text = 'Aprobado'::text)) AS pagos_aprobados,
            count(*) FILTER (WHERE ((pc.estado_pago)::text = 'En revisión'::text)) AS pagos_en_revision,
            count(*) FILTER (WHERE ((pc.estado_pago)::text = 'Rechazado'::text)) AS pagos_rechazados,
            count(*) FILTER (WHERE ((pc.estado_pago)::text = 'Cancelado'::text)) AS pagos_cancelados,
            count(*) FILTER (WHERE (pc.alerta_comprobante_faltante = true)) AS pagos_sin_comprobante,
            COALESCE(sum(pc.monto_pago) FILTER (WHERE ((pc.estado_pago)::text = 'En revisión'::text)), (0)::numeric) AS monto_pagos_en_revision
           FROM academia.vw_control_pagos_cursos pc
        ), indicadores_academicos AS (
         SELECT count(*) AS total_inscripciones,
            count(*) FILTER (WHERE ((vd.estado_academico)::text = 'No iniciado'::text)) AS participantes_no_iniciados,
            count(*) FILTER (WHERE ((vd.estado_academico)::text = 'En progreso'::text)) AS participantes_en_progreso,
            count(*) FILTER (WHERE ((vd.estado_academico)::text = 'Completado'::text)) AS participantes_completados,
            count(*) FILTER (WHERE ((vd.estado_academico)::text = 'No aprobado'::text)) AS participantes_no_aprobados,
            count(*) FILTER (WHERE ((vd.estado_academico)::text = 'Abandonado'::text)) AS participantes_abandonados,
            round(avg(vd.porcentaje_avance), 2) AS promedio_avance_general,
            round(avg(vd.porcentaje_asistencia), 2) AS promedio_asistencia_general,
            count(*) FILTER (WHERE ((vd.estado_certificado)::text = 'Emitido'::text)) AS certificados_emitidos,
            count(*) FILTER (WHERE ((vd.estado_certificado)::text = 'Generado'::text)) AS certificados_generados,
            count(*) FILTER (WHERE ((vd.estado_certificado)::text = 'Revocado'::text)) AS certificados_revocados,
            count(*) FILTER (WHERE (((vd.estado_academico)::text = 'Completado'::text) AND (vd.id_certificado IS NULL))) AS completados_sin_certificado
           FROM academia.vw_detalle_participantes_cursos vd
        ), indicadores_sesiones AS (
         SELECT count(*) AS total_sesiones,
            count(*) FILTER (WHERE ((ag.estado_sesion)::text = 'Programada'::text)) AS sesiones_programadas,
            count(*) FILTER (WHERE ((ag.estado_sesion)::text = 'En curso'::text)) AS sesiones_en_curso,
            count(*) FILTER (WHERE ((ag.estado_sesion)::text = 'Finalizada'::text)) AS sesiones_finalizadas,
            count(*) FILTER (WHERE ((ag.estado_sesion)::text = 'Cancelada'::text)) AS sesiones_canceladas,
            count(*) FILTER (WHERE (ag.situacion_operativa = 'Asistencia incompleta'::text)) AS sesiones_asistencia_incompleta,
            count(*) FILTER (WHERE (ag.fecha = CURRENT_DATE)) AS sesiones_hoy
           FROM academia.vw_agenda_sesiones_cursos ag
        ), indicadores_alertas AS (
         SELECT count(*) AS total_alertas,
            count(*) FILTER (WHERE ((aa.nivel_alerta)::text = 'Crítica'::text)) AS alertas_criticas,
            count(*) FILTER (WHERE ((aa.nivel_alerta)::text = 'Advertencia'::text)) AS alertas_advertencia,
            count(*) FILTER (WHERE ((aa.nivel_alerta)::text = 'Informativa'::text)) AS alertas_informativas
           FROM academia.vw_alertas_administrativas aa
        )
 SELECT ic.total_cursos,
    ic.cursos_activos,
    ic.cursos_inactivos,
    ic.cupo_maximo_total,
    ic.cupos_ocupados_total,
    ic.cupos_disponibles_total,
        CASE
            WHEN (ic.cupo_maximo_total = 0) THEN (0)::numeric
            ELSE round((((ic.cupos_ocupados_total)::numeric / (ic.cupo_maximo_total)::numeric) * (100)::numeric), 2)
        END AS porcentaje_ocupacion_general,
    ico.total_compras,
    ico.compras_pendientes_pago,
    ico.compras_pago_reportado,
    ico.compras_pago_validado,
    ico.compras_con_inscripciones,
    ico.compras_canceladas,
    ico.compras_rechazadas,
    ico.compras_expiradas,
    ico.importe_total_compras,
    ico.ingresos_aprobados,
    ico.saldo_pendiente_total,
    ico.cupos_comprados,
    ico.participantes_registrados_compras,
    ip.total_pagos,
    ip.pagos_aprobados,
    ip.pagos_en_revision,
    ip.pagos_rechazados,
    ip.pagos_cancelados,
    ip.pagos_sin_comprobante,
    ip.monto_pagos_en_revision,
    ia.total_inscripciones,
    ia.participantes_no_iniciados,
    ia.participantes_en_progreso,
    ia.participantes_completados,
    ia.participantes_no_aprobados,
    ia.participantes_abandonados,
    COALESCE(ia.promedio_avance_general, (0)::numeric) AS promedio_avance_general,
    COALESCE(ia.promedio_asistencia_general, (0)::numeric) AS promedio_asistencia_general,
    ia.certificados_emitidos,
    ia.certificados_generados,
    ia.certificados_revocados,
    ia.completados_sin_certificado,
    ises.total_sesiones,
    ises.sesiones_programadas,
    ises.sesiones_en_curso,
    ises.sesiones_finalizadas,
    ises.sesiones_canceladas,
    ises.sesiones_asistencia_incompleta,
    ises.sesiones_hoy,
    ial.total_alertas,
    ial.alertas_criticas,
    ial.alertas_advertencia,
    ial.alertas_informativas,
    CURRENT_TIMESTAMP AS fecha_consulta
   FROM (((((indicadores_cursos ic
     CROSS JOIN indicadores_compras ico)
     CROSS JOIN indicadores_pagos ip)
     CROSS JOIN indicadores_academicos ia)
     CROSS JOIN indicadores_sesiones ises)
     CROSS JOIN indicadores_alertas ial);


--
-- Name: vw_metricas_mensuales_cursos; Type: VIEW; Schema: academia; Owner: -
--

CREATE VIEW academia.vw_metricas_mensuales_cursos AS
 WITH compras_mensuales AS (
         SELECT (date_trunc('month'::text, rc.fecha_compra))::date AS periodo,
            count(*) AS total_compras,
            count(DISTINCT rc.usuario_comprador_id) AS compradores_unicos,
            count(DISTINCT rc.curso_id) AS cursos_con_ventas,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Pendiente de pago'::text)) AS compras_pendientes_pago,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Pago reportado'::text)) AS compras_pago_reportado,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Pago validado'::text)) AS compras_pago_validado,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Inscripciones generadas'::text)) AS compras_con_inscripciones,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Cancelada'::text)) AS compras_canceladas,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Rechazada'::text)) AS compras_rechazadas,
            count(*) FILTER (WHERE ((rc.estado_compra)::text = 'Expirada'::text)) AS compras_expiradas,
            COALESCE(sum(rc.cantidad_cupos), (0)::bigint) AS cupos_comprados,
            COALESCE(sum(rc.participantes_registrados), (0)::numeric) AS participantes_registrados,
            COALESCE(sum(rc.subtotal), (0)::numeric) AS subtotal_compras,
            COALESCE(sum(rc.descuento), (0)::numeric) AS descuentos_aplicados,
            COALESCE(sum(rc.total), (0)::numeric) AS importe_total_compras,
            COALESCE(sum(rc.total_pagado), (0)::numeric) AS ingresos_aprobados_asociados,
            COALESCE(sum(rc.saldo_pendiente), (0)::numeric) AS saldo_pendiente,
            round(avg(rc.total), 2) AS ticket_promedio,
            round(avg(rc.cantidad_cupos), 2) AS cupos_promedio_por_compra
           FROM academia.vw_resumen_compras_cursos rc
          GROUP BY (date_trunc('month'::text, rc.fecha_compra))
        ), pagos_mensuales AS (
         SELECT (date_trunc('month'::text, pc.fecha_reporte))::date AS periodo,
            count(*) AS total_pagos_reportados,
            count(DISTINCT pc.id_compra) AS compras_con_pago_reportado,
            count(*) FILTER (WHERE ((pc.estado_pago)::text = 'Aprobado'::text)) AS pagos_aprobados,
            count(*) FILTER (WHERE ((pc.estado_pago)::text = 'En revisión'::text)) AS pagos_en_revision,
            count(*) FILTER (WHERE ((pc.estado_pago)::text = 'Rechazado'::text)) AS pagos_rechazados,
            count(*) FILTER (WHERE ((pc.estado_pago)::text = 'Cancelado'::text)) AS pagos_cancelados,
            COALESCE(sum(pc.monto_pago), (0)::numeric) AS monto_total_reportado,
            COALESCE(sum(pc.monto_pago) FILTER (WHERE ((pc.estado_pago)::text = 'Aprobado'::text)), (0)::numeric) AS monto_aprobado_en_mes,
            COALESCE(sum(pc.monto_pago) FILTER (WHERE ((pc.estado_pago)::text = 'En revisión'::text)), (0)::numeric) AS monto_en_revision_en_mes,
            COALESCE(sum(pc.monto_pago) FILTER (WHERE ((pc.estado_pago)::text = 'Rechazado'::text)), (0)::numeric) AS monto_rechazado_en_mes,
            round(avg(pc.monto_pago), 2) AS monto_promedio_pago
           FROM academia.vw_control_pagos_cursos pc
          GROUP BY (date_trunc('month'::text, pc.fecha_reporte))
        ), periodos AS (
         SELECT compras_mensuales.periodo
           FROM compras_mensuales
        UNION
         SELECT pagos_mensuales.periodo
           FROM pagos_mensuales
        )
 SELECT (EXTRACT(year FROM p.periodo))::integer AS anio,
    (EXTRACT(month FROM p.periodo))::integer AS mes,
    p.periodo,
    to_char((p.periodo)::timestamp with time zone, 'YYYY-MM'::text) AS periodo_clave,
        CASE (EXTRACT(month FROM p.periodo))::integer
            WHEN 1 THEN 'Enero'::text
            WHEN 2 THEN 'Febrero'::text
            WHEN 3 THEN 'Marzo'::text
            WHEN 4 THEN 'Abril'::text
            WHEN 5 THEN 'Mayo'::text
            WHEN 6 THEN 'Junio'::text
            WHEN 7 THEN 'Julio'::text
            WHEN 8 THEN 'Agosto'::text
            WHEN 9 THEN 'Septiembre'::text
            WHEN 10 THEN 'Octubre'::text
            WHEN 11 THEN 'Noviembre'::text
            WHEN 12 THEN 'Diciembre'::text
            ELSE NULL::text
        END AS nombre_mes,
    COALESCE(cm.total_compras, (0)::bigint) AS total_compras,
    COALESCE(cm.compradores_unicos, (0)::bigint) AS compradores_unicos,
    COALESCE(cm.cursos_con_ventas, (0)::bigint) AS cursos_con_ventas,
    COALESCE(cm.compras_pendientes_pago, (0)::bigint) AS compras_pendientes_pago,
    COALESCE(cm.compras_pago_reportado, (0)::bigint) AS compras_pago_reportado,
    COALESCE(cm.compras_pago_validado, (0)::bigint) AS compras_pago_validado,
    COALESCE(cm.compras_con_inscripciones, (0)::bigint) AS compras_con_inscripciones,
    COALESCE(cm.compras_canceladas, (0)::bigint) AS compras_canceladas,
    COALESCE(cm.compras_rechazadas, (0)::bigint) AS compras_rechazadas,
    COALESCE(cm.compras_expiradas, (0)::bigint) AS compras_expiradas,
    COALESCE(cm.cupos_comprados, (0)::bigint) AS cupos_comprados,
    COALESCE(cm.participantes_registrados, (0)::numeric) AS participantes_registrados,
    COALESCE(cm.subtotal_compras, (0)::numeric) AS subtotal_compras,
    COALESCE(cm.descuentos_aplicados, (0)::numeric) AS descuentos_aplicados,
    COALESCE(cm.importe_total_compras, (0)::numeric) AS importe_total_compras,
    COALESCE(cm.ingresos_aprobados_asociados, (0)::numeric) AS ingresos_aprobados_asociados,
    COALESCE(cm.saldo_pendiente, (0)::numeric) AS saldo_pendiente,
    COALESCE(cm.ticket_promedio, (0)::numeric) AS ticket_promedio,
    COALESCE(cm.cupos_promedio_por_compra, (0)::numeric) AS cupos_promedio_por_compra,
    COALESCE(pm.total_pagos_reportados, (0)::bigint) AS total_pagos_reportados,
    COALESCE(pm.compras_con_pago_reportado, (0)::bigint) AS compras_con_pago_reportado,
    COALESCE(pm.pagos_aprobados, (0)::bigint) AS pagos_aprobados,
    COALESCE(pm.pagos_en_revision, (0)::bigint) AS pagos_en_revision,
    COALESCE(pm.pagos_rechazados, (0)::bigint) AS pagos_rechazados,
    COALESCE(pm.pagos_cancelados, (0)::bigint) AS pagos_cancelados,
    COALESCE(pm.monto_total_reportado, (0)::numeric) AS monto_total_reportado,
    COALESCE(pm.monto_aprobado_en_mes, (0)::numeric) AS monto_aprobado_en_mes,
    COALESCE(pm.monto_en_revision_en_mes, (0)::numeric) AS monto_en_revision_en_mes,
    COALESCE(pm.monto_rechazado_en_mes, (0)::numeric) AS monto_rechazado_en_mes,
    COALESCE(pm.monto_promedio_pago, (0)::numeric) AS monto_promedio_pago,
        CASE
            WHEN (COALESCE(cm.total_compras, (0)::bigint) = 0) THEN (0)::numeric
            ELSE round(((((COALESCE(cm.compras_pago_validado, (0)::bigint) + COALESCE(cm.compras_con_inscripciones, (0)::bigint)))::numeric / (cm.total_compras)::numeric) * (100)::numeric), 2)
        END AS porcentaje_conversion_compra,
        CASE
            WHEN (COALESCE(cm.importe_total_compras, (0)::numeric) = (0)::numeric) THEN (0)::numeric
            ELSE round(((COALESCE(cm.ingresos_aprobados_asociados, (0)::numeric) / cm.importe_total_compras) * (100)::numeric), 2)
        END AS porcentaje_cobranza_asociada
   FROM ((periodos p
     LEFT JOIN compras_mensuales cm ON ((cm.periodo = p.periodo)))
     LEFT JOIN pagos_mensuales pm ON ((pm.periodo = p.periodo)));


--
-- Name: cola_actualizacion_datasets; Type: TABLE; Schema: analitica; Owner: -
--

CREATE TABLE analitica.cola_actualizacion_datasets (
    id_tarea bigint NOT NULL,
    dataset_destino character varying(40) NOT NULL,
    tabla_origen character varying(100) NOT NULL,
    registro_origen_id bigint,
    tipo_operacion character varying(20) NOT NULL,
    prioridad smallint DEFAULT 5 NOT NULL,
    estado character varying(20) DEFAULT 'Pendiente'::character varying NOT NULL,
    intentos smallint DEFAULT 0 NOT NULL,
    fecha_evento timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_programada timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_inicio_proceso timestamp without time zone,
    fecha_fin_proceso timestamp without time zone,
    ultimo_error text,
    payload jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_cola_completada CHECK ((((estado)::text <> 'Completada'::text) OR (fecha_fin_proceso IS NOT NULL))),
    CONSTRAINT chk_cola_dataset_destino CHECK (((dataset_destino)::text = ANY ((ARRAY['Reglas de asociación'::character varying, 'Segmentación de clientes'::character varying, 'Regresión de precios'::character varying, 'Todos'::character varying])::text[]))),
    CONSTRAINT chk_cola_estado CHECK (((estado)::text = ANY ((ARRAY['Pendiente'::character varying, 'Procesando'::character varying, 'Completada'::character varying, 'Fallida'::character varying, 'Cancelada'::character varying])::text[]))),
    CONSTRAINT chk_cola_fallida CHECK ((((estado)::text <> 'Fallida'::text) OR ((ultimo_error IS NOT NULL) AND (length(TRIM(BOTH FROM ultimo_error)) > 0)))),
    CONSTRAINT chk_cola_fechas_proceso CHECK (((fecha_inicio_proceso IS NULL) OR (fecha_fin_proceso IS NULL) OR (fecha_fin_proceso >= fecha_inicio_proceso))),
    CONSTRAINT chk_cola_intentos CHECK ((intentos >= 0)),
    CONSTRAINT chk_cola_prioridad CHECK (((prioridad >= 1) AND (prioridad <= 10))),
    CONSTRAINT chk_cola_procesando CHECK ((((estado)::text <> 'Procesando'::text) OR (fecha_inicio_proceso IS NOT NULL))),
    CONSTRAINT chk_cola_tipo_operacion CHECK (((tipo_operacion)::text = ANY ((ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying, 'RECALCULO'::character varying])::text[])))
);


--
-- Name: cola_actualizacion_datasets_id_tarea_seq; Type: SEQUENCE; Schema: analitica; Owner: -
--

CREATE SEQUENCE analitica.cola_actualizacion_datasets_id_tarea_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cola_actualizacion_datasets_id_tarea_seq; Type: SEQUENCE OWNED BY; Schema: analitica; Owner: -
--

ALTER SEQUENCE analitica.cola_actualizacion_datasets_id_tarea_seq OWNED BY analitica.cola_actualizacion_datasets.id_tarea;


--
-- Name: dataset_reglas_asociacion; Type: TABLE; Schema: analitica; Owner: -
--

CREATE TABLE analitica.dataset_reglas_asociacion (
    id_registro bigint NOT NULL,
    id_transaccion_analitica character varying(100) NOT NULL,
    usuario_id integer NOT NULL,
    curso_id integer NOT NULL,
    compra_id bigint NOT NULL,
    folio_compra character varying(20) NOT NULL,
    fecha_compra timestamp without time zone NOT NULL,
    anio_compra smallint NOT NULL,
    mes_compra smallint NOT NULL,
    categoria_id integer,
    modalidad_id integer,
    precio_pagado numeric(10,2) NOT NULL,
    cantidad_cupos smallint NOT NULL,
    estado_compra character varying(60) NOT NULL,
    fecha_carga timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    activo_dataset boolean DEFAULT true NOT NULL,
    CONSTRAINT chk_dataset_asociacion_anio CHECK ((anio_compra >= 2000)),
    CONSTRAINT chk_dataset_asociacion_cupos CHECK ((cantidad_cupos > 0)),
    CONSTRAINT chk_dataset_asociacion_mes CHECK (((mes_compra >= 1) AND (mes_compra <= 12))),
    CONSTRAINT chk_dataset_asociacion_precio CHECK ((precio_pagado >= (0)::numeric))
);


--
-- Name: dataset_reglas_asociacion_id_registro_seq; Type: SEQUENCE; Schema: analitica; Owner: -
--

CREATE SEQUENCE analitica.dataset_reglas_asociacion_id_registro_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dataset_reglas_asociacion_id_registro_seq; Type: SEQUENCE OWNED BY; Schema: analitica; Owner: -
--

ALTER SEQUENCE analitica.dataset_reglas_asociacion_id_registro_seq OWNED BY analitica.dataset_reglas_asociacion.id_registro;


--
-- Name: dataset_regresion_precio_cursos; Type: TABLE; Schema: analitica; Owner: -
--

CREATE TABLE analitica.dataset_regresion_precio_cursos (
    id_registro bigint NOT NULL,
    curso_id integer NOT NULL,
    titulo_curso character varying(200) NOT NULL,
    categoria_id integer,
    modalidad_id integer,
    ubicacion_id integer,
    fecha_inicio date,
    fecha_fin date,
    anio_inicio smallint,
    mes_inicio smallint,
    duracion_dias integer,
    cupo_maximo integer DEFAULT 0 NOT NULL,
    cupos_ocupados integer DEFAULT 0 NOT NULL,
    porcentaje_ocupacion numeric(5,2) DEFAULT 0 NOT NULL,
    total_compras integer DEFAULT 0 NOT NULL,
    compras_validas integer DEFAULT 0 NOT NULL,
    cupos_vendidos integer DEFAULT 0 NOT NULL,
    compradores_unicos integer DEFAULT 0 NOT NULL,
    ingresos_aprobados numeric(12,2) DEFAULT 0 NOT NULL,
    precio_historico numeric(10,2) NOT NULL,
    ingreso_promedio_por_cupo numeric(12,2) DEFAULT 0 NOT NULL,
    dias_anticipacion_primera_compra integer,
    dias_anticipacion_ultima_compra integer,
    precio_sugerido_modelo numeric(10,2),
    version_modelo character varying(50),
    fecha_prediccion timestamp without time zone,
    fecha_carga timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    activo_dataset boolean DEFAULT true NOT NULL,
    CONSTRAINT chk_dataset_regresion_anio CHECK (((anio_inicio IS NULL) OR (anio_inicio >= 2000))),
    CONSTRAINT chk_dataset_regresion_anticipacion CHECK (((dias_anticipacion_primera_compra IS NULL) OR (dias_anticipacion_primera_compra >= 0))),
    CONSTRAINT chk_dataset_regresion_compras CHECK (((total_compras >= 0) AND (compras_validas >= 0) AND (compradores_unicos >= 0))),
    CONSTRAINT chk_dataset_regresion_cupos CHECK (((cupo_maximo >= 0) AND (cupos_ocupados >= 0) AND (cupos_vendidos >= 0))),
    CONSTRAINT chk_dataset_regresion_duracion CHECK (((duracion_dias IS NULL) OR (duracion_dias >= 0))),
    CONSTRAINT chk_dataset_regresion_mes CHECK (((mes_inicio IS NULL) OR ((mes_inicio >= 1) AND (mes_inicio <= 12)))),
    CONSTRAINT chk_dataset_regresion_montos CHECK (((ingresos_aprobados >= (0)::numeric) AND (precio_historico >= (0)::numeric) AND (ingreso_promedio_por_cupo >= (0)::numeric) AND ((precio_sugerido_modelo IS NULL) OR (precio_sugerido_modelo >= (0)::numeric)))),
    CONSTRAINT chk_dataset_regresion_ocupacion CHECK (((porcentaje_ocupacion >= (0)::numeric) AND (porcentaje_ocupacion <= (100)::numeric))),
    CONSTRAINT chk_dataset_regresion_ultima_compra CHECK (((dias_anticipacion_ultima_compra IS NULL) OR (dias_anticipacion_ultima_compra >= 0)))
);


--
-- Name: dataset_regresion_precio_cursos_id_registro_seq; Type: SEQUENCE; Schema: analitica; Owner: -
--

CREATE SEQUENCE analitica.dataset_regresion_precio_cursos_id_registro_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dataset_regresion_precio_cursos_id_registro_seq; Type: SEQUENCE OWNED BY; Schema: analitica; Owner: -
--

ALTER SEQUENCE analitica.dataset_regresion_precio_cursos_id_registro_seq OWNED BY analitica.dataset_regresion_precio_cursos.id_registro;


--
-- Name: dataset_segmentacion_clientes; Type: TABLE; Schema: analitica; Owner: -
--

CREATE TABLE analitica.dataset_segmentacion_clientes (
    id_registro bigint NOT NULL,
    usuario_id integer NOT NULL,
    fecha_primera_compra timestamp without time zone,
    fecha_ultima_compra timestamp without time zone,
    dias_desde_ultima_compra integer,
    antiguedad_cliente_dias integer,
    total_compras integer DEFAULT 0 NOT NULL,
    total_compras_validas integer DEFAULT 0 NOT NULL,
    compras_pendientes integer DEFAULT 0 NOT NULL,
    compras_canceladas integer DEFAULT 0 NOT NULL,
    compras_rechazadas integer DEFAULT 0 NOT NULL,
    compras_expiradas integer DEFAULT 0 NOT NULL,
    cursos_distintos integer DEFAULT 0 NOT NULL,
    categorias_distintas integer DEFAULT 0 NOT NULL,
    modalidades_distintas integer DEFAULT 0 NOT NULL,
    total_cupos_adquiridos integer DEFAULT 0 NOT NULL,
    total_gastado numeric(12,2) DEFAULT 0 NOT NULL,
    ticket_promedio numeric(12,2) DEFAULT 0 NOT NULL,
    cupos_promedio_compra numeric(8,2) DEFAULT 0 NOT NULL,
    tasa_conversion numeric(5,2) DEFAULT 0 NOT NULL,
    fecha_carga timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    activo_dataset boolean DEFAULT true NOT NULL,
    CONSTRAINT chk_segmentacion_antiguedad CHECK (((antiguedad_cliente_dias IS NULL) OR (antiguedad_cliente_dias >= 0))),
    CONSTRAINT chk_segmentacion_compras CHECK (((total_compras >= 0) AND (total_compras_validas >= 0) AND (compras_pendientes >= 0) AND (compras_canceladas >= 0) AND (compras_rechazadas >= 0) AND (compras_expiradas >= 0))),
    CONSTRAINT chk_segmentacion_conversion CHECK (((tasa_conversion >= (0)::numeric) AND (tasa_conversion <= (100)::numeric))),
    CONSTRAINT chk_segmentacion_cupos CHECK (((total_cupos_adquiridos >= 0) AND (cupos_promedio_compra >= (0)::numeric))),
    CONSTRAINT chk_segmentacion_dias_ultima_compra CHECK (((dias_desde_ultima_compra IS NULL) OR (dias_desde_ultima_compra >= 0))),
    CONSTRAINT chk_segmentacion_montos CHECK (((total_gastado >= (0)::numeric) AND (ticket_promedio >= (0)::numeric))),
    CONSTRAINT chk_segmentacion_variedad CHECK (((cursos_distintos >= 0) AND (categorias_distintas >= 0) AND (modalidades_distintas >= 0)))
);


--
-- Name: dataset_segmentacion_clientes_id_registro_seq; Type: SEQUENCE; Schema: analitica; Owner: -
--

CREATE SEQUENCE analitica.dataset_segmentacion_clientes_id_registro_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dataset_segmentacion_clientes_id_registro_seq; Type: SEQUENCE OWNED BY; Schema: analitica; Owner: -
--

ALTER SEQUENCE analitica.dataset_segmentacion_clientes_id_registro_seq OWNED BY analitica.dataset_segmentacion_clientes.id_registro;


--
-- Name: modelos_ml; Type: TABLE; Schema: analitica; Owner: -
--

CREATE TABLE analitica.modelos_ml (
    id_modelo bigint NOT NULL,
    nombre_modelo character varying(150) NOT NULL,
    tipo_modelo character varying(40) NOT NULL,
    algoritmo character varying(100) NOT NULL,
    version_modelo character varying(50) NOT NULL,
    dataset_origen character varying(100) NOT NULL,
    descripcion text,
    parametros jsonb,
    metricas jsonb,
    ruta_archivo_modelo text,
    fecha_inicio_datos date,
    fecha_fin_datos date,
    cantidad_registros_entrenamiento integer,
    estado character varying(30) DEFAULT 'Entrenado'::character varying NOT NULL,
    es_modelo_activo boolean DEFAULT false NOT NULL,
    fecha_entrenamiento timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_despliegue timestamp with time zone,
    fecha_retiro timestamp with time zone,
    creado_por integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_modelos_ml_despliegue CHECK ((((estado)::text <> 'Desplegado'::text) OR (fecha_despliegue IS NOT NULL))),
    CONSTRAINT chk_modelos_ml_estado CHECK (((estado)::text = ANY ((ARRAY['Entrenando'::character varying, 'Entrenado'::character varying, 'Validado'::character varying, 'Desplegado'::character varying, 'Fallido'::character varying, 'Retirado'::character varying])::text[]))),
    CONSTRAINT chk_modelos_ml_periodo CHECK (((fecha_inicio_datos IS NULL) OR (fecha_fin_datos IS NULL) OR (fecha_fin_datos >= fecha_inicio_datos))),
    CONSTRAINT chk_modelos_ml_registros CHECK (((cantidad_registros_entrenamiento IS NULL) OR (cantidad_registros_entrenamiento >= 0))),
    CONSTRAINT chk_modelos_ml_retirado CHECK ((((estado)::text <> 'Retirado'::text) OR (fecha_retiro IS NOT NULL))),
    CONSTRAINT chk_modelos_ml_tipo CHECK (((tipo_modelo)::text = ANY ((ARRAY['Reglas de asociación'::character varying, 'Segmentación de clientes'::character varying, 'Regresión de precios'::character varying])::text[])))
);


--
-- Name: modelos_ml_id_modelo_seq; Type: SEQUENCE; Schema: analitica; Owner: -
--

CREATE SEQUENCE analitica.modelos_ml_id_modelo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: modelos_ml_id_modelo_seq; Type: SEQUENCE OWNED BY; Schema: analitica; Owner: -
--

ALTER SEQUENCE analitica.modelos_ml_id_modelo_seq OWNED BY analitica.modelos_ml.id_modelo;


--
-- Name: mv_indicadores_generales; Type: MATERIALIZED VIEW; Schema: analitica; Owner: -
--

CREATE MATERIALIZED VIEW analitica.mv_indicadores_generales AS
 SELECT (1)::smallint AS id_resumen,
    total_cursos,
    cursos_activos,
    cursos_inactivos,
    cupo_maximo_total,
    cupos_ocupados_total,
    cupos_disponibles_total,
    porcentaje_ocupacion_general,
    total_compras,
    compras_pendientes_pago,
    compras_pago_reportado,
    compras_pago_validado,
    compras_con_inscripciones,
    compras_canceladas,
    compras_rechazadas,
    compras_expiradas,
    importe_total_compras,
    ingresos_aprobados,
    saldo_pendiente_total,
    cupos_comprados,
    participantes_registrados_compras,
    total_pagos,
    pagos_aprobados,
    pagos_en_revision,
    pagos_rechazados,
    pagos_cancelados,
    pagos_sin_comprobante,
    monto_pagos_en_revision,
    total_inscripciones,
    participantes_no_iniciados,
    participantes_en_progreso,
    participantes_completados,
    participantes_no_aprobados,
    participantes_abandonados,
    promedio_avance_general,
    promedio_asistencia_general,
    certificados_emitidos,
    certificados_generados,
    certificados_revocados,
    completados_sin_certificado,
    total_sesiones,
    sesiones_programadas,
    sesiones_en_curso,
    sesiones_finalizadas,
    sesiones_canceladas,
    sesiones_asistencia_incompleta,
    sesiones_hoy,
    total_alertas,
    alertas_criticas,
    alertas_advertencia,
    alertas_informativas,
    fecha_consulta
   FROM academia.vw_indicadores_generales vig
  WITH NO DATA;


--
-- Name: mv_metricas_mensuales_cursos; Type: MATERIALIZED VIEW; Schema: analitica; Owner: -
--

CREATE MATERIALIZED VIEW analitica.mv_metricas_mensuales_cursos AS
 SELECT anio,
    mes,
    periodo,
    periodo_clave,
    nombre_mes,
    total_compras,
    compradores_unicos,
    cursos_con_ventas,
    compras_pendientes_pago,
    compras_pago_reportado,
    compras_pago_validado,
    compras_con_inscripciones,
    compras_canceladas,
    compras_rechazadas,
    compras_expiradas,
    cupos_comprados,
    participantes_registrados,
    subtotal_compras,
    descuentos_aplicados,
    importe_total_compras,
    ingresos_aprobados_asociados,
    saldo_pendiente,
    ticket_promedio,
    cupos_promedio_por_compra,
    total_pagos_reportados,
    compras_con_pago_reportado,
    pagos_aprobados,
    pagos_en_revision,
    pagos_rechazados,
    pagos_cancelados,
    monto_total_reportado,
    monto_aprobado_en_mes,
    monto_en_revision_en_mes,
    monto_rechazado_en_mes,
    monto_promedio_pago,
    porcentaje_conversion_compra,
    porcentaje_cobranza_asociada
   FROM academia.vw_metricas_mensuales_cursos
  WITH NO DATA;


--
-- Name: predicciones_precio_cursos; Type: TABLE; Schema: analitica; Owner: -
--

CREATE TABLE analitica.predicciones_precio_cursos (
    id_prediccion bigint NOT NULL,
    curso_id integer NOT NULL,
    modelo_id bigint NOT NULL,
    precio_actual numeric(10,2) NOT NULL,
    precio_sugerido numeric(10,2) NOT NULL,
    precio_minimo_estimado numeric(10,2),
    precio_maximo_estimado numeric(10,2),
    variacion_absoluta numeric(10,2),
    variacion_porcentual numeric(8,2),
    nivel_confianza numeric(5,2),
    variables_entrada jsonb,
    explicacion jsonb,
    fecha_prediccion timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estado character varying(30) DEFAULT 'Pendiente de revisión'::character varying NOT NULL,
    decision_administrativa character varying(20),
    motivo_decision text,
    precio_aplicado numeric(10,2),
    usuario_decide integer,
    fecha_decision timestamp with time zone,
    vigente boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_predicciones_aplicada CHECK ((((estado)::text <> 'Aplicada'::text) OR (((decision_administrativa)::text = ANY ((ARRAY['Aceptada'::character varying, 'Modificada'::character varying])::text[])) AND (precio_aplicado IS NOT NULL)))),
    CONSTRAINT chk_predicciones_confianza CHECK (((nivel_confianza IS NULL) OR ((nivel_confianza >= (0)::numeric) AND (nivel_confianza <= (100)::numeric)))),
    CONSTRAINT chk_predicciones_decision CHECK (((decision_administrativa IS NULL) OR ((decision_administrativa)::text = ANY ((ARRAY['Aceptada'::character varying, 'Modificada'::character varying, 'Rechazada'::character varying])::text[])))),
    CONSTRAINT chk_predicciones_decision_completa CHECK (((decision_administrativa IS NULL) OR ((usuario_decide IS NOT NULL) AND (fecha_decision IS NOT NULL)))),
    CONSTRAINT chk_predicciones_estado CHECK (((estado)::text = ANY ((ARRAY['Pendiente de revisión'::character varying, 'Revisada'::character varying, 'Aplicada'::character varying, 'Descartada'::character varying, 'Expirada'::character varying])::text[]))),
    CONSTRAINT chk_predicciones_intervalo CHECK (((precio_minimo_estimado IS NULL) OR (precio_maximo_estimado IS NULL) OR (precio_maximo_estimado >= precio_minimo_estimado))),
    CONSTRAINT chk_predicciones_precio_actual CHECK ((precio_actual >= (0)::numeric)),
    CONSTRAINT chk_predicciones_precio_aplicado CHECK (((precio_aplicado IS NULL) OR (precio_aplicado >= (0)::numeric))),
    CONSTRAINT chk_predicciones_precio_maximo CHECK (((precio_maximo_estimado IS NULL) OR (precio_maximo_estimado >= (0)::numeric))),
    CONSTRAINT chk_predicciones_precio_minimo CHECK (((precio_minimo_estimado IS NULL) OR (precio_minimo_estimado >= (0)::numeric))),
    CONSTRAINT chk_predicciones_precio_sugerido CHECK ((precio_sugerido >= (0)::numeric))
);


--
-- Name: predicciones_precio_cursos_id_prediccion_seq; Type: SEQUENCE; Schema: analitica; Owner: -
--

CREATE SEQUENCE analitica.predicciones_precio_cursos_id_prediccion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: predicciones_precio_cursos_id_prediccion_seq; Type: SEQUENCE OWNED BY; Schema: analitica; Owner: -
--

ALTER SEQUENCE analitica.predicciones_precio_cursos_id_prediccion_seq OWNED BY analitica.predicciones_precio_cursos.id_prediccion;


--
-- Name: recomendaciones_cursos; Type: TABLE; Schema: analitica; Owner: -
--

CREATE TABLE analitica.recomendaciones_cursos (
    id_recomendacion bigint NOT NULL,
    usuario_id integer NOT NULL,
    curso_recomendado_id integer NOT NULL,
    modelo_id bigint NOT NULL,
    curso_origen_id integer,
    regla_origen jsonb,
    soporte numeric(10,6),
    confianza numeric(10,6),
    lift numeric(10,6),
    puntuacion_recomendacion numeric(10,6),
    motivo_recomendacion text,
    fecha_generacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_expiracion timestamp with time zone,
    estado character varying(20) DEFAULT 'Activa'::character varying NOT NULL,
    visible_usuario boolean DEFAULT true NOT NULL,
    fecha_vista timestamp with time zone,
    fecha_aceptacion timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_recomendaciones_aceptacion CHECK (((fecha_aceptacion IS NULL) OR (fecha_aceptacion >= fecha_generacion))),
    CONSTRAINT chk_recomendaciones_confianza CHECK (((confianza IS NULL) OR ((confianza >= (0)::numeric) AND (confianza <= (1)::numeric)))),
    CONSTRAINT chk_recomendaciones_estado CHECK (((estado)::text = ANY ((ARRAY['Activa'::character varying, 'Vista'::character varying, 'Aceptada'::character varying, 'Descartada'::character varying, 'Expirada'::character varying])::text[]))),
    CONSTRAINT chk_recomendaciones_expiracion CHECK (((fecha_expiracion IS NULL) OR (fecha_expiracion >= fecha_generacion))),
    CONSTRAINT chk_recomendaciones_lift CHECK (((lift IS NULL) OR (lift >= (0)::numeric))),
    CONSTRAINT chk_recomendaciones_puntuacion CHECK (((puntuacion_recomendacion IS NULL) OR (puntuacion_recomendacion >= (0)::numeric))),
    CONSTRAINT chk_recomendaciones_soporte CHECK (((soporte IS NULL) OR ((soporte >= (0)::numeric) AND (soporte <= (1)::numeric)))),
    CONSTRAINT chk_recomendaciones_vista CHECK (((fecha_vista IS NULL) OR (fecha_vista >= fecha_generacion)))
);


--
-- Name: recomendaciones_cursos_id_recomendacion_seq; Type: SEQUENCE; Schema: analitica; Owner: -
--

CREATE SEQUENCE analitica.recomendaciones_cursos_id_recomendacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recomendaciones_cursos_id_recomendacion_seq; Type: SEQUENCE OWNED BY; Schema: analitica; Owner: -
--

ALTER SEQUENCE analitica.recomendaciones_cursos_id_recomendacion_seq OWNED BY analitica.recomendaciones_cursos.id_recomendacion;


--
-- Name: segmentos_clientes; Type: TABLE; Schema: analitica; Owner: -
--

CREATE TABLE analitica.segmentos_clientes (
    id_segmentacion bigint NOT NULL,
    usuario_id integer NOT NULL,
    modelo_id bigint NOT NULL,
    numero_segmento integer NOT NULL,
    nombre_segmento character varying(100) NOT NULL,
    descripcion_segmento text,
    distancia_centroide numeric(14,6),
    nivel_confianza numeric(5,2),
    caracteristicas_usuario jsonb,
    fecha_asignacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    vigente boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_segmentos_confianza CHECK (((nivel_confianza IS NULL) OR ((nivel_confianza >= (0)::numeric) AND (nivel_confianza <= (100)::numeric)))),
    CONSTRAINT chk_segmentos_distancia CHECK (((distancia_centroide IS NULL) OR (distancia_centroide >= (0)::numeric))),
    CONSTRAINT chk_segmentos_numero CHECK ((numero_segmento >= 0))
);


--
-- Name: segmentos_clientes_id_segmentacion_seq; Type: SEQUENCE; Schema: analitica; Owner: -
--

CREATE SEQUENCE analitica.segmentos_clientes_id_segmentacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: segmentos_clientes_id_segmentacion_seq; Type: SEQUENCE OWNED BY; Schema: analitica; Owner: -
--

ALTER SEQUENCE analitica.segmentos_clientes_id_segmentacion_seq OWNED BY analitica.segmentos_clientes.id_segmentacion;


--
-- Name: backups; Type: TABLE; Schema: auditoria; Owner: -
--

CREATE TABLE auditoria.backups (
    id integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo character varying(20) NOT NULL,
    "tamaño" character varying(20),
    archivo_url text,
    estado character varying(20) DEFAULT 'exitoso'::character varying
);


--
-- Name: backups_id_seq; Type: SEQUENCE; Schema: auditoria; Owner: -
--

CREATE SEQUENCE auditoria.backups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: backups_id_seq; Type: SEQUENCE OWNED BY; Schema: auditoria; Owner: -
--

ALTER SEQUENCE auditoria.backups_id_seq OWNED BY auditoria.backups.id;


--
-- Name: intentos_recuperacion; Type: TABLE; Schema: auditoria; Owner: -
--

CREATE TABLE auditoria.intentos_recuperacion (
    id integer NOT NULL,
    identificador text NOT NULL,
    conteo integer DEFAULT 0,
    ultimo_intento timestamp without time zone DEFAULT now(),
    bloqueado_hasta timestamp without time zone
);


--
-- Name: intentos_recuperacion_id_seq; Type: SEQUENCE; Schema: auditoria; Owner: -
--

CREATE SEQUENCE auditoria.intentos_recuperacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: intentos_recuperacion_id_seq; Type: SEQUENCE OWNED BY; Schema: auditoria; Owner: -
--

ALTER SEQUENCE auditoria.intentos_recuperacion_id_seq OWNED BY auditoria.intentos_recuperacion.id;


--
-- Name: empresa_info; Type: TABLE; Schema: clinica; Owner: -
--

CREATE TABLE clinica.empresa_info (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    direccion text NOT NULL,
    telefono character varying(20) NOT NULL,
    correo character varying(150) NOT NULL,
    facebook character varying(150),
    instagram character varying(150),
    horario text NOT NULL,
    logo_url text,
    correo_soporte character varying(150),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: empresa_info_id_seq; Type: SEQUENCE; Schema: clinica; Owner: -
--

CREATE SEQUENCE clinica.empresa_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: empresa_info_id_seq; Type: SEQUENCE OWNED BY; Schema: clinica; Owner: -
--

ALTER SEQUENCE clinica.empresa_info_id_seq OWNED BY clinica.empresa_info.id;


--
-- Name: medicos; Type: TABLE; Schema: clinica; Owner: -
--

CREATE TABLE clinica.medicos (
    id_medico integer NOT NULL,
    nombres character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100),
    especialidad character varying(100),
    hospital_clinica character varying(150),
    direccion text,
    url_foto character varying(255),
    activo boolean DEFAULT true
);


--
-- Name: medicos_id_medico_seq; Type: SEQUENCE; Schema: clinica; Owner: -
--

CREATE SEQUENCE clinica.medicos_id_medico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medicos_id_medico_seq; Type: SEQUENCE OWNED BY; Schema: clinica; Owner: -
--

ALTER SEQUENCE clinica.medicos_id_medico_seq OWNED BY clinica.medicos.id_medico;


--
-- Name: nosotros; Type: TABLE; Schema: clinica; Owner: -
--

CREATE TABLE clinica.nosotros (
    id integer NOT NULL,
    mision text NOT NULL,
    vision text NOT NULL,
    valores text[] NOT NULL,
    nuestra_historia text NOT NULL,
    compromiso text NOT NULL,
    url_imagen text DEFAULT '/pediatric-illustration.png'::text
);


--
-- Name: nosotros_id_seq; Type: SEQUENCE; Schema: clinica; Owner: -
--

CREATE SEQUENCE clinica.nosotros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nosotros_id_seq; Type: SEQUENCE OWNED BY; Schema: clinica; Owner: -
--

ALTER SEQUENCE clinica.nosotros_id_seq OWNED BY clinica.nosotros.id;


--
-- Name: servicios; Type: TABLE; Schema: clinica; Owner: -
--

CREATE TABLE clinica.servicios (
    id_servicio integer NOT NULL,
    titulo_servicio character varying(150) NOT NULL,
    descripcion text,
    ubicacion character varying(200),
    url_image text,
    texto_alt character varying(150),
    diseno_tipo character varying(20) DEFAULT 'vertical'::character varying,
    activo boolean DEFAULT true
);


--
-- Name: servicios_id_servicio_seq; Type: SEQUENCE; Schema: clinica; Owner: -
--

CREATE SEQUENCE clinica.servicios_id_servicio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicios_id_servicio_seq; Type: SEQUENCE OWNED BY; Schema: clinica; Owner: -
--

ALTER SEQUENCE clinica.servicios_id_servicio_seq OWNED BY clinica.servicios.id_servicio;


--
-- Name: alertas_seguridad; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.alertas_seguridad (
    id_alerta integer NOT NULL,
    tipo_alerta character varying(50),
    nivel_critico character varying(20),
    mensaje text,
    detalle jsonb,
    fecha_deteccion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion timestamp without time zone,
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying,
    usuario_asignado character varying(100)
);


--
-- Name: alertas_seguridad_id_alerta_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.alertas_seguridad_id_alerta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alertas_seguridad_id_alerta_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.alertas_seguridad_id_alerta_seq OWNED BY seguridad.alertas_seguridad.id_alerta;


--
-- Name: auditoria_acciones; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.auditoria_acciones (
    id_auditoria integer NOT NULL,
    usuario character varying(100),
    ip_address inet,
    accion character varying(50),
    tabla_afectada character varying(100),
    registro_id integer,
    datos_anteriores jsonb,
    datos_nuevos jsonb,
    fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    aplicacion_origen character varying(100),
    session_id character varying(100)
);


--
-- Name: auditoria_acciones_id_auditoria_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.auditoria_acciones_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auditoria_acciones_id_auditoria_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.auditoria_acciones_id_auditoria_seq OWNED BY seguridad.auditoria_acciones.id_auditoria;


--
-- Name: cambios_estructura; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.cambios_estructura (
    id_cambio integer NOT NULL,
    usuario character varying(100),
    fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo_objeto character varying(20),
    nombre_objeto character varying(100),
    sentencia_ddl text,
    cambio_detalle jsonb
);


--
-- Name: cambios_estructura_id_cambio_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.cambios_estructura_id_cambio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cambios_estructura_id_cambio_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.cambios_estructura_id_cambio_seq OWNED BY seguridad.cambios_estructura.id_cambio;


--
-- Name: estadisticas_consumo; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.estadisticas_consumo (
    id_estadistica integer NOT NULL,
    fecha date DEFAULT CURRENT_DATE,
    hora integer,
    total_consultas integer,
    consultas_lentas integer,
    errores_sql integer,
    usuarios_activos integer,
    ancho_banda_mb numeric(10,2),
    operaciones_crud jsonb
);


--
-- Name: estadisticas_consumo_id_estadistica_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.estadisticas_consumo_id_estadistica_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: estadisticas_consumo_id_estadistica_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.estadisticas_consumo_id_estadistica_seq OWNED BY seguridad.estadisticas_consumo.id_estadistica;


--
-- Name: monitoreo_rendimiento; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.monitoreo_rendimiento (
    id_monitoreo integer NOT NULL,
    fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    query_text text,
    tiempo_ejecucion_ms integer,
    cpu_usage_percent numeric(5,2),
    memoria_usage_mb integer,
    conexiones_activas integer,
    deadlocks_detectados integer,
    cache_hit_ratio numeric(5,2),
    tabla_consultada character varying(100)
);


--
-- Name: monitoreo_rendimiento_id_monitoreo_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.monitoreo_rendimiento_id_monitoreo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: monitoreo_rendimiento_id_monitoreo_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.monitoreo_rendimiento_id_monitoreo_seq OWNED BY seguridad.monitoreo_rendimiento.id_monitoreo;


--
-- Name: roles; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.roles (
    id integer NOT NULL,
    nombre text NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.roles_id_seq OWNED BY seguridad.roles.id;


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.usuarios_id_seq OWNED BY seguridad.usuarios.id;


--
-- Name: categorias_ayuda; Type: TABLE; Schema: soporte; Owner: -
--

CREATE TABLE soporte.categorias_ayuda (
    id_categoria integer NOT NULL,
    nombre_categoria character varying(100) NOT NULL,
    descripcion text,
    icono character varying(50),
    orden integer DEFAULT 0,
    activo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: categorias_ayuda_id_categoria_seq; Type: SEQUENCE; Schema: soporte; Owner: -
--

CREATE SEQUENCE soporte.categorias_ayuda_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_ayuda_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: soporte; Owner: -
--

ALTER SEQUENCE soporte.categorias_ayuda_id_categoria_seq OWNED BY soporte.categorias_ayuda.id_categoria;


--
-- Name: preguntas_frecuentes; Type: TABLE; Schema: soporte; Owner: -
--

CREATE TABLE soporte.preguntas_frecuentes (
    id_pregunta integer NOT NULL,
    id_categoria integer NOT NULL,
    pregunta character varying(500) NOT NULL,
    respuesta text NOT NULL,
    orden integer DEFAULT 0,
    veces_util integer DEFAULT 0,
    veces_no_util integer DEFAULT 0,
    activo boolean DEFAULT true,
    es_destacada boolean DEFAULT false,
    tags text[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    creado_por integer
);


--
-- Name: preguntas_frecuentes_id_pregunta_seq; Type: SEQUENCE; Schema: soporte; Owner: -
--

CREATE SEQUENCE soporte.preguntas_frecuentes_id_pregunta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: preguntas_frecuentes_id_pregunta_seq; Type: SEQUENCE OWNED BY; Schema: soporte; Owner: -
--

ALTER SEQUENCE soporte.preguntas_frecuentes_id_pregunta_seq OWNED BY soporte.preguntas_frecuentes.id_pregunta;


--
-- Name: preguntas_usuarios; Type: TABLE; Schema: soporte; Owner: -
--

CREATE TABLE soporte.preguntas_usuarios (
    id_pregunta integer NOT NULL,
    id_usuario integer NOT NULL,
    id_categoria integer,
    titulo character varying(300) NOT NULL,
    descripcion text NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    prioridad character varying(10) DEFAULT 'normal'::character varying,
    es_privada boolean DEFAULT false,
    id_pregunta_faq integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: preguntas_usuarios_id_pregunta_seq; Type: SEQUENCE; Schema: soporte; Owner: -
--

CREATE SEQUENCE soporte.preguntas_usuarios_id_pregunta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: preguntas_usuarios_id_pregunta_seq; Type: SEQUENCE OWNED BY; Schema: soporte; Owner: -
--

ALTER SEQUENCE soporte.preguntas_usuarios_id_pregunta_seq OWNED BY soporte.preguntas_usuarios.id_pregunta;


--
-- Name: respuestas_ayuda; Type: TABLE; Schema: soporte; Owner: -
--

CREATE TABLE soporte.respuestas_ayuda (
    id_respuesta integer NOT NULL,
    id_pregunta integer NOT NULL,
    id_usuario integer NOT NULL,
    contenido text NOT NULL,
    es_respuesta_admin boolean DEFAULT false,
    es_solucion boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: respuestas_ayuda_id_respuesta_seq; Type: SEQUENCE; Schema: soporte; Owner: -
--

CREATE SEQUENCE soporte.respuestas_ayuda_id_respuesta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: respuestas_ayuda_id_respuesta_seq; Type: SEQUENCE OWNED BY; Schema: soporte; Owner: -
--

ALTER SEQUENCE soporte.respuestas_ayuda_id_respuesta_seq OWNED BY soporte.respuestas_ayuda.id_respuesta;


--
-- Name: valoraciones_faq; Type: TABLE; Schema: soporte; Owner: -
--

CREATE TABLE soporte.valoraciones_faq (
    id_valoracion integer NOT NULL,
    id_pregunta_faq integer NOT NULL,
    id_usuario integer NOT NULL,
    es_util boolean NOT NULL,
    comentario text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: valoraciones_faq_id_valoracion_seq; Type: SEQUENCE; Schema: soporte; Owner: -
--

CREATE SEQUENCE soporte.valoraciones_faq_id_valoracion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: valoraciones_faq_id_valoracion_seq; Type: SEQUENCE OWNED BY; Schema: soporte; Owner: -
--

ALTER SEQUENCE soporte.valoraciones_faq_id_valoracion_seq OWNED BY soporte.valoraciones_faq.id_valoracion;


--
-- Name: academia_infantil id_guia; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.academia_infantil ALTER COLUMN id_guia SET DEFAULT nextval('academia.academia_infantil_id_guia_seq'::regclass);


--
-- Name: asistencias_curso id_asistencia; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.asistencias_curso ALTER COLUMN id_asistencia SET DEFAULT nextval('academia.asistencias_curso_id_asistencia_seq'::regclass);


--
-- Name: categorias_cursos id_categoria; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.categorias_cursos ALTER COLUMN id_categoria SET DEFAULT nextval('academia.categorias_cursos_id_categoria_seq'::regclass);


--
-- Name: certificados_curso id_certificado; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.certificados_curso ALTER COLUMN id_certificado SET DEFAULT nextval('academia.certificados_curso_id_certificado_seq'::regclass);


--
-- Name: compra_participantes id_compra_participante; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.compra_participantes ALTER COLUMN id_compra_participante SET DEFAULT nextval('academia.compra_participantes_id_compra_participante_seq'::regclass);


--
-- Name: comprascursosinacademia idcompra; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.comprascursosinacademia ALTER COLUMN idcompra SET DEFAULT nextval('academia.comprascursosinacademia_idcompra_seq'::regclass);


--
-- Name: contenido_saber_pediatrico id; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.contenido_saber_pediatrico ALTER COLUMN id SET DEFAULT nextval('academia.contenido_saber_pediatrico_id_seq'::regclass);


--
-- Name: cursos id_curso; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.cursos ALTER COLUMN id_curso SET DEFAULT nextval('academia.cursos_id_curso_seq'::regclass);


--
-- Name: encuestas id; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.encuestas ALTER COLUMN id SET DEFAULT nextval('academia.encuestas_id_seq'::regclass);


--
-- Name: estadocomprainacademia idestadocompra; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.estadocomprainacademia ALTER COLUMN idestadocompra SET DEFAULT nextval('academia.estadocomprainacademia_idestadocompra_seq'::regclass);


--
-- Name: evaluaciones_curso id_evaluacion; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.evaluaciones_curso ALTER COLUMN id_evaluacion SET DEFAULT nextval('academia.evaluaciones_curso_id_evaluacion_seq'::regclass);


--
-- Name: historial_estados_compra id_historial_estado; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.historial_estados_compra ALTER COLUMN id_historial_estado SET DEFAULT nextval('academia.historial_estados_compra_id_historial_estado_seq'::regclass);


--
-- Name: historial_estados_curso id_historial_estado_curso; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.historial_estados_curso ALTER COLUMN id_historial_estado_curso SET DEFAULT nextval('academia.historial_estados_curso_id_historial_estado_curso_seq'::regclass);


--
-- Name: inscripciones_cursos id_inscripcion; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.inscripciones_cursos ALTER COLUMN id_inscripcion SET DEFAULT nextval('academia.inscripciones_cursos_id_inscripcion_seq'::regclass);


--
-- Name: instructores id_instructor; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.instructores ALTER COLUMN id_instructor SET DEFAULT nextval('academia.instructores_id_instructor_seq'::regclass);


--
-- Name: metodos_pago_cursos id_metodo_pago; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.metodos_pago_cursos ALTER COLUMN id_metodo_pago SET DEFAULT nextval('academia.metodos_pago_cursos_id_metodo_pago_seq'::regclass);


--
-- Name: modalidades id_modalidad; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.modalidades ALTER COLUMN id_modalidad SET DEFAULT nextval('academia.modalidades_id_modalidad_seq'::regclass);


--
-- Name: movimientos_cupos_curso id_movimiento_cupo; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.movimientos_cupos_curso ALTER COLUMN id_movimiento_cupo SET DEFAULT nextval('academia.movimientos_cupos_curso_id_movimiento_cupo_seq'::regclass);


--
-- Name: notificaciones_academicas id_notificacion; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.notificaciones_academicas ALTER COLUMN id_notificacion SET DEFAULT nextval('academia.notificaciones_academicas_id_notificacion_seq'::regclass);


--
-- Name: pagos_cursos id_pago; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.pagos_cursos ALTER COLUMN id_pago SET DEFAULT nextval('academia.pagos_cursos_id_pago_seq'::regclass);


--
-- Name: participantes id_participante; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.participantes ALTER COLUMN id_participante SET DEFAULT nextval('academia.participantes_id_participante_seq'::regclass);


--
-- Name: progreso_curso id_progreso; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.progreso_curso ALTER COLUMN id_progreso SET DEFAULT nextval('academia.progreso_curso_id_progreso_seq'::regclass);


--
-- Name: publicaciones id_publicacion; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.publicaciones ALTER COLUMN id_publicacion SET DEFAULT nextval('academia.publicaciones_id_publicacion_seq'::regclass);


--
-- Name: requisitos_aprobacion_curso id_requisito_aprobacion; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.requisitos_aprobacion_curso ALTER COLUMN id_requisito_aprobacion SET DEFAULT nextval('academia.requisitos_aprobacion_curso_id_requisito_aprobacion_seq'::regclass);


--
-- Name: respuestas_encuestas id; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.respuestas_encuestas ALTER COLUMN id SET DEFAULT nextval('academia.respuestas_encuestas_id_seq'::regclass);


--
-- Name: resultados_evaluaciones id_resultado; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.resultados_evaluaciones ALTER COLUMN id_resultado SET DEFAULT nextval('academia.resultados_evaluaciones_id_resultado_seq'::regclass);


--
-- Name: sesiones_curso id_sesion; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.sesiones_curso ALTER COLUMN id_sesion SET DEFAULT nextval('academia.sesiones_curso_id_sesion_seq'::regclass);


--
-- Name: ubicaciones_cursos id_ubicacion; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.ubicaciones_cursos ALTER COLUMN id_ubicacion SET DEFAULT nextval('academia.ubicaciones_cursos_id_ubicacion_seq'::regclass);


--
-- Name: cola_actualizacion_datasets id_tarea; Type: DEFAULT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.cola_actualizacion_datasets ALTER COLUMN id_tarea SET DEFAULT nextval('analitica.cola_actualizacion_datasets_id_tarea_seq'::regclass);


--
-- Name: dataset_reglas_asociacion id_registro; Type: DEFAULT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_reglas_asociacion ALTER COLUMN id_registro SET DEFAULT nextval('analitica.dataset_reglas_asociacion_id_registro_seq'::regclass);


--
-- Name: dataset_regresion_precio_cursos id_registro; Type: DEFAULT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_regresion_precio_cursos ALTER COLUMN id_registro SET DEFAULT nextval('analitica.dataset_regresion_precio_cursos_id_registro_seq'::regclass);


--
-- Name: dataset_segmentacion_clientes id_registro; Type: DEFAULT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_segmentacion_clientes ALTER COLUMN id_registro SET DEFAULT nextval('analitica.dataset_segmentacion_clientes_id_registro_seq'::regclass);


--
-- Name: modelos_ml id_modelo; Type: DEFAULT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.modelos_ml ALTER COLUMN id_modelo SET DEFAULT nextval('analitica.modelos_ml_id_modelo_seq'::regclass);


--
-- Name: predicciones_precio_cursos id_prediccion; Type: DEFAULT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.predicciones_precio_cursos ALTER COLUMN id_prediccion SET DEFAULT nextval('analitica.predicciones_precio_cursos_id_prediccion_seq'::regclass);


--
-- Name: recomendaciones_cursos id_recomendacion; Type: DEFAULT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.recomendaciones_cursos ALTER COLUMN id_recomendacion SET DEFAULT nextval('analitica.recomendaciones_cursos_id_recomendacion_seq'::regclass);


--
-- Name: segmentos_clientes id_segmentacion; Type: DEFAULT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.segmentos_clientes ALTER COLUMN id_segmentacion SET DEFAULT nextval('analitica.segmentos_clientes_id_segmentacion_seq'::regclass);


--
-- Name: backups id; Type: DEFAULT; Schema: auditoria; Owner: -
--

ALTER TABLE ONLY auditoria.backups ALTER COLUMN id SET DEFAULT nextval('auditoria.backups_id_seq'::regclass);


--
-- Name: intentos_recuperacion id; Type: DEFAULT; Schema: auditoria; Owner: -
--

ALTER TABLE ONLY auditoria.intentos_recuperacion ALTER COLUMN id SET DEFAULT nextval('auditoria.intentos_recuperacion_id_seq'::regclass);


--
-- Name: empresa_info id; Type: DEFAULT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.empresa_info ALTER COLUMN id SET DEFAULT nextval('clinica.empresa_info_id_seq'::regclass);


--
-- Name: medicos id_medico; Type: DEFAULT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.medicos ALTER COLUMN id_medico SET DEFAULT nextval('clinica.medicos_id_medico_seq'::regclass);


--
-- Name: nosotros id; Type: DEFAULT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.nosotros ALTER COLUMN id SET DEFAULT nextval('clinica.nosotros_id_seq'::regclass);


--
-- Name: servicios id_servicio; Type: DEFAULT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.servicios ALTER COLUMN id_servicio SET DEFAULT nextval('clinica.servicios_id_servicio_seq'::regclass);


--
-- Name: alertas_seguridad id_alerta; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.alertas_seguridad ALTER COLUMN id_alerta SET DEFAULT nextval('seguridad.alertas_seguridad_id_alerta_seq'::regclass);


--
-- Name: auditoria_acciones id_auditoria; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.auditoria_acciones ALTER COLUMN id_auditoria SET DEFAULT nextval('seguridad.auditoria_acciones_id_auditoria_seq'::regclass);


--
-- Name: cambios_estructura id_cambio; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.cambios_estructura ALTER COLUMN id_cambio SET DEFAULT nextval('seguridad.cambios_estructura_id_cambio_seq'::regclass);


--
-- Name: estadisticas_consumo id_estadistica; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.estadisticas_consumo ALTER COLUMN id_estadistica SET DEFAULT nextval('seguridad.estadisticas_consumo_id_estadistica_seq'::regclass);


--
-- Name: monitoreo_rendimiento id_monitoreo; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.monitoreo_rendimiento ALTER COLUMN id_monitoreo SET DEFAULT nextval('seguridad.monitoreo_rendimiento_id_monitoreo_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.roles ALTER COLUMN id SET DEFAULT nextval('seguridad.roles_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuarios ALTER COLUMN id SET DEFAULT nextval('seguridad.usuarios_id_seq'::regclass);


--
-- Name: categorias_ayuda id_categoria; Type: DEFAULT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.categorias_ayuda ALTER COLUMN id_categoria SET DEFAULT nextval('soporte.categorias_ayuda_id_categoria_seq'::regclass);


--
-- Name: preguntas_frecuentes id_pregunta; Type: DEFAULT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.preguntas_frecuentes ALTER COLUMN id_pregunta SET DEFAULT nextval('soporte.preguntas_frecuentes_id_pregunta_seq'::regclass);


--
-- Name: preguntas_usuarios id_pregunta; Type: DEFAULT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.preguntas_usuarios ALTER COLUMN id_pregunta SET DEFAULT nextval('soporte.preguntas_usuarios_id_pregunta_seq'::regclass);


--
-- Name: respuestas_ayuda id_respuesta; Type: DEFAULT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.respuestas_ayuda ALTER COLUMN id_respuesta SET DEFAULT nextval('soporte.respuestas_ayuda_id_respuesta_seq'::regclass);


--
-- Name: valoraciones_faq id_valoracion; Type: DEFAULT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.valoraciones_faq ALTER COLUMN id_valoracion SET DEFAULT nextval('soporte.valoraciones_faq_id_valoracion_seq'::regclass);


--
-- Data for Name: academia_infantil; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.academia_infantil (id_guia, titulo_guia, descripcion_corta, id_autor, fecha_publicacion, url_imagen, etiquetas, descripcion_larga, activo) FROM stdin;
\.


--
-- Data for Name: asistencias_curso; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.asistencias_curso (id_asistencia, inscripcion_id, sesion_id, estado_asistencia, hora_entrada, hora_salida, minutos_retardo, justificada, motivo_justificacion, comprobante_justificacion, usuario_registra, fecha_registro, observaciones, updated_at) FROM stdin;
\.


--
-- Data for Name: categorias_cursos; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.categorias_cursos (id_categoria, nombre_categoria, descripcion, activo) FROM stdin;
1	Salud y Pediatría	Cursos sobre cuidado infantil, primeros auxilios, nutrición y desarrollo pediátrico	t
2	Talleres Recreativos	Actividades artísticas, deportivas y recreativas para niños y adolescentes	t
3	Desarrollo Infantil	Cursos sobre psicología infantil, estimulación temprana y manejo de emociones	t
4	Adolescencia	Pláticas y talleres específicos para adolescentes y padres de adolescentes	t
5	Primeros Auxilios	Cursos de emergencias pediátricas y RCP infantil	t
6	Nutrición Pediátrica	Alimentación saludable para bebés, niños y adolescentes	t
\.


--
-- Data for Name: certificados_curso; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.certificados_curso (id_certificado, inscripcion_id, folio_certificado, codigo_verificacion, fecha_emision, ruta_archivo, nombre_archivo, estado, fecha_revocacion, motivo_revocacion, usuario_emite, usuario_revoca, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: compra_participantes; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.compra_participantes (id_compra_participante, id_compra, id_participante, numero_cupo, estado, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: comprascursosinacademia; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.comprascursosinacademia (idcompra, foliocompra, idusuario, idcurso, idestadocompra, cantidadcupos, preciounitario, subtotal, descuento, total, fechacompra, fechalimitepago, fechapago, fechavalidacion, usuariovalida, observaciones) FROM stdin;
\.


--
-- Data for Name: contenido_saber_pediatrico; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.contenido_saber_pediatrico (id, tipo, titulo, descripcion, contenido, url_externo, imagen_url, video_url, archivo_url, categoria, etiquetas, duracion, fecha_publicacion, destacado, orden, activo, visualizaciones, created_at, updated_at) FROM stdin;
10	video	CRECIMIENTO Y DESARROLLO ENARM PEDIATRIA	CRECIMIENTO Y DESARROLLO ENARM PEDIATRIA	\N	https://www.youtube.com/watch?v=L_iQedp8aGM	\N	\N	\N	\N	{}	16:50	2026-04-13	f	0	t	0	2026-04-13 10:01:58.436395	2026-04-16 06:29:51.42
13	video	DUDAS DE PAPÁS PRIMERIZOS	Dudas	\N	https://www.youtube.com/watch?v=-q9CQdJmGEI	\N	\N	\N	\N	{}	11:53	2026-04-16	f	0	t	0	2026-04-16 00:32:09.630095	2026-04-16 00:32:09.630095
14	articulo	Alimentación saludable en niños de 1 a 5 años	Guía básica para asegurar una nutrición adecuada durante la primera infancia.	<p><strong>Importancia de una buena alimentación</strong><br>Durante los primeros años de vida, los niños desarrollan hábitos que influirán en su salud futura. Una dieta balanceada favorece su crecimiento físico y mental.</p><p><strong>Alimentos recomendados</strong></p><ul><li><p>Frutas y verduras frescas</p></li><li><p>Cereales integrales</p></li><li><p>Proteínas (pollo, pescado, huevo, legumbres)</p></li><li><p>Lácteos (leche, yogurt, queso)</p></li><li><p>Agua natural como bebida principal</p></li></ul><p><strong>Alimentos a evitar o limitar</strong></p><ul><li><p>Azúcares refinados</p></li><li><p>Bebidas azucaradas</p></li><li><p>Comida rápida</p></li><li><p>Productos ultraprocesados</p></li></ul><p><strong>Consejos prácticos</strong></p><ul><li><p>Ofrecer porciones pequeñas varias veces al día</p></li><li><p>Evitar forzar al niño a comer</p></li><li><p>Crear horarios de comida regulares</p></li></ul><p></p>	\N	https://res.cloudinary.com/dydfxuywl/image/upload/v1776321332/centro-medico/saber-pediatrico/ujrovsuiomcjthzctm82.jpg	\N	\N	\N	{}	\N	2026-04-16	f	0	t	0	2026-04-16 00:35:36.056142	2026-04-16 00:35:36.056142
15	articulo	Recomendaciones	\N	\N	\N	https://res.cloudinary.com/dydfxuywl/image/upload/v1776321373/centro-medico/saber-pediatrico/z3cnzf4yel58c5jjm0nx.jpg	\N	\N	\N	{}	\N	2026-04-16	f	0	t	0	2026-04-16 00:36:22.121657	2026-04-16 00:36:22.121657
16	articulo	Prevención de infecciones respiratorias en niños	Recomendaciones clave para reducir el riesgo de enfermedades respiratorias comunes.	<p><strong>¿Por qué son frecuentes?</strong><br>Los niños tienen un sistema inmunológico en desarrollo, lo que los hace más propensos a infecciones como gripe o resfriado.</p><p><strong>Medidas preventivas básicas</strong></p><ul><li><p>Lavado frecuente de manos</p></li><li><p>Evitar contacto con personas enfermas</p></li><li><p>Mantener espacios ventilados</p></li><li><p>Uso de cubrebocas en situaciones de riesgo</p></li></ul><p><strong>Signos de alerta</strong></p><ul><li><p>Fiebre persistente</p></li><li><p>Dificultad para respirar</p></li><li><p>Tos intensa o prolongada</p></li><li><p>Decaimiento general</p></li></ul><p><strong>Cuándo acudir al médico</strong></p><ul><li><p>Si los síntomas duran más de 3 días</p></li><li><p>Si hay dificultad para respirar</p></li><li><p>En bebés menores de 1 año con fiebre</p></li></ul><p></p>	\N	https://res.cloudinary.com/dydfxuywl/image/upload/v1776321423/centro-medico/saber-pediatrico/oxt02dpiegbk8pnup4va.jpg	\N	\N	\N	{}	\N	2026-04-16	f	0	t	0	2026-04-16 00:37:10.934749	2026-04-16 00:37:10.934749
17	articulo	Importancia del esquema de vacunación infantil	Explicación sobre el papel de las vacunas en la protección de la salud infantil.	<p><strong>¿Qué son las vacunas?</strong><br>Son sustancias que ayudan al cuerpo a generar defensas contra enfermedades graves.</p><p><strong>Beneficios principales</strong></p><ul><li><p>Prevención de enfermedades contagiosas</p></li><li><p>Reducción de complicaciones graves</p></li><li><p>Protección comunitaria (inmunidad colectiva)</p></li></ul><p><strong>Vacunas esenciales en la infancia</strong></p><ul><li><p>BCG</p></li><li><p>Hepatitis B</p></li><li><p>Pentavalente</p></li><li><p>Triple viral (sarampión, rubéola, paperas)</p></li><li><p>Influenza</p></li></ul><p><strong>Recomendaciones para padres</strong></p><ul><li><p>Seguir el calendario de vacunación</p></li><li><p>No retrasar las vacunas sin indicación médica</p></li><li><p>Consultar ante cualquier reacción</p></li></ul><p></p>	\N	https://res.cloudinary.com/dydfxuywl/image/upload/v1776321460/centro-medico/saber-pediatrico/viiyjeyotkcixeq8bzez.jpg	\N	\N	\N	{}	\N	2026-04-16	f	0	t	0	2026-04-16 00:37:44.131228	2026-04-16 00:37:44.131228
18	documento	Documentos pediátricos COVID-19	Documento	\N	\N	\N	\N	https://www.pediatricrad.info/w3/images/cases/torax/SARS-CoV-2/20200323_COVID_19_Documents_pediatria_Rx_IIS.pdf	\N	{}	\N	2026-04-16	f	0	t	0	2026-04-16 00:38:37.790955	2026-04-16 00:38:37.790955
19	documento	Diagnostico y Tratamiento	Documento	\N	\N	\N	\N	https://platform.who.int/docs/default-source/mca-documents/policy-documents/guideline/cub-ch-20-01-guideline-2016-esp-pediatria-completo.pdf	\N	{}	\N	2026-04-16	f	0	t	0	2026-04-16 00:39:21.616049	2026-04-16 00:39:21.616049
20	documento	Fundamentos de Pediatria	Documento	\N	\N	\N	\N	https://mawil.us/wp-content/uploads/2019/11/fundamentos-de-pediatria.pdf	\N	{}	\N	2026-04-16	f	0	t	0	2026-04-16 00:40:14.170275	2026-04-16 00:40:14.170275
21	encuesta	Test de las 5 Inteligencias Emocionales	Test	\N	https://forms.gle/myrC2LWKkKATeqPQ9	\N	\N	\N	\N	{}	\N	2026-04-16	f	0	t	0	2026-04-16 00:41:53.336792	2026-04-16 00:41:53.336792
12	video	Aprende sobre el recién nacido	Vídeo explicativo sobre Puericultura, en donde podrás conocer de la mano del Dr. Gustavo Cortés (Jefe Departamento Clínica de la Mujer - Bogotá Colombia) lo que es normal o  anormal en un bebé recién nacido.	\N	https://www.youtube.com/watch?v=DcmMI0iYlCk	\N	\N	\N	\N	{}	8:4	2026-04-16	f	0	t	0	2026-04-16 00:31:31.575783	2026-06-23 03:11:12.326
11	video	¿Qué es pediatría?: la importancia del pediatra en la salud infantil	  nutrición para los niños, desarrollo y crecimiento del bebé, salud infantil, fiebre en bebés, fiebre en los niños, y niños con enfermedades.	\N	https://www.youtube.com/watch?v=UoWqOwqzIGg	\N	\N	\N	\N	{}	5:48	2026-04-16	f	0	t	0	2026-04-16 00:30:45.966878	2026-06-23 03:11:31.168
\.


--
-- Data for Name: cursos; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.cursos (id_curso, titulo_curso, descripcion, id_instructor, id_categoria, id_ubicacion, id_modalidad, fecha_inicio, fecha_fin, horario, dirigido_a, cupo_maximo, costo, url_imagen_portada, activo, cupos_ocupados, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: encuestas; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.encuestas (id, contenido_id, preguntas, fecha_inicio, fecha_fin, total_participantes, activo) FROM stdin;
\.


--
-- Data for Name: estadocomprainacademia; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.estadocomprainacademia (idestadocompra, nombre, descripcion, activo, fecharegistro) FROM stdin;
1	Pendiente de pago	La compra fue creada y espera el pago	t	2026-07-18 00:58:13.673444
2	Pago reportado	El usuario indicó que realizó el pago	t	2026-07-18 00:58:13.673444
3	Pago validado	El administrador confirmó el pago	t	2026-07-18 00:58:13.673444
4	Inscripciones generadas	Los participantes ya fueron inscritos	t	2026-07-18 00:58:13.673444
5	Rechazada	El pago fue rechazado	t	2026-07-18 00:58:13.673444
6	Cancelada	La compra fue cancelada	t	2026-07-18 00:58:13.673444
7	Expirada	No se recibió el pago en el tiempo permitido	t	2026-07-18 00:58:13.673444
\.


--
-- Data for Name: evaluaciones_curso; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.evaluaciones_curso (id_evaluacion, curso_id, sesion_id, titulo, descripcion, tipo_evaluacion, puntaje_maximo, puntaje_minimo_aprobatorio, ponderacion, obligatoria, fecha_apertura, fecha_limite, intentos_permitidos, estado, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: historial_estados_compra; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.historial_estados_compra (id_historial_estado, id_compra, id_estado_anterior, id_estado_nuevo, usuario_responsable, origen_cambio, motivo, observaciones, fecha_cambio) FROM stdin;
\.


--
-- Data for Name: historial_estados_curso; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.historial_estados_curso (id_historial_estado_curso, curso_id, estado_anterior, estado_nuevo, usuario_responsable, origen_cambio, motivo, observaciones, fecha_cambio) FROM stdin;
\.


--
-- Data for Name: inscripciones_cursos; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.inscripciones_cursos (id_inscripcion, curso_id, usuario_id, fecha_inscripcion, estado, monto_pagado, metodo_pago, participante_id, compra_participante_id, origen_inscripcion, fecha_confirmacion, observaciones) FROM stdin;
\.


--
-- Data for Name: instructores; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.instructores (id_instructor, nombre, apellido_paterno, apellido_materno, especialidad, edad, telefono, correo, direccion, activo, created_at, updated_at) FROM stdin;
1	María	González	Rodríguez	Pediatría General y Desarrollo Infantil	42	555-0101	dra.maria.gonzalez@pediatria.com	Consultorio 101, Hospital Infantil	t	2026-04-09 21:15:19.50368	2026-04-09 21:15:19.50368
2	Carlos	Martínez	López	Nutrición Pediátrica y Trastornos Alimenticios	38	555-0102	dr.carlos.martinez@nutricion.com	Consultorio 205, Clínica de Nutrición	t	2026-04-09 21:15:19.50368	2026-04-09 21:15:19.50368
3	Ana	Fernández	Castro	Psicología Infantil y Manejo de Emociones	45	555-0103	dra.ana.fernandez@psicologia.com	Consultorio 308, Centro de Salud Mental Infantil	t	2026-04-09 21:15:19.50368	2026-04-09 21:15:19.50368
4	Roberto	Sánchez	Mendoza	Primeros Auxilios y RCP Pediátrica	50	555-0104	dr.roberto.sanchez@emergencias.com	Departamento de Emergencias, Hospital Pediátrico	t	2026-04-09 21:15:19.50368	2026-04-09 21:15:19.50368
5	Laura	Morales	Jiménez	Natación Infantil y Actividades Acuáticas	34	555-0201	laura.morales@deportesinfantiles.com	Alberca Olímpica, Unidad Deportiva	t	2026-04-09 21:15:19.50368	2026-04-09 21:15:19.50368
6	Patricia	Vega	Ortega	Pintura, Dibujo y Manualidades Infantiles	29	555-0202	patricia.vega@arteinfantil.com	Estudio 5, Casa de la Cultura	t	2026-04-09 21:15:19.50368	2026-04-09 21:15:19.50368
7	Fernando	Ruiz	Silva	Música y Movimiento para Niños	36	555-0203	fernando.ruiz@musica.com	Salón de Música, Centro Cultural	t	2026-04-09 21:15:19.50368	2026-04-09 21:15:19.50368
8	Gabriela	Mendoza	Flores	Yoga y Mindfulness para Niños y Adolescentes	41	555-0204	gaby.mendoza@yogainfantil.com	Estudio de Yoga "Pequeños Gurús"	t	2026-04-09 21:15:19.50368	2026-04-09 21:15:19.50368
9	Elena	Torres	Ramírez	Salud Adolescente y Educación Sexual	39	555-0301	dra.elena.torres@adolescentes.com	Consultorio 412, Clínica Juvenil	t	2026-04-09 21:15:19.50368	2026-04-09 21:15:19.50368
10	Javier	Castro	Núñez	Orientación Vocacional y Desarrollo de Habilidades	44	555-0302	javier.castro@orientacion.com	Oficina 7, Centro de Orientación Juvenil	t	2026-04-09 21:15:19.50368	2026-04-09 21:15:19.50368
11	Sofía	Reyes	Aguilar	Prevención de Adicciones y Bullying	37	555-0303	sofia.reyes@prevencion.com	Consultorio 203, Centro de Prevención	t	2026-04-09 21:15:19.50368	2026-04-09 21:15:19.50368
\.


--
-- Data for Name: metodos_pago_cursos; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.metodos_pago_cursos (id_metodo_pago, nombre, descripcion, requiere_comprobante, instrucciones, activo, created_at, updated_at) FROM stdin;
1	Transferencia bancaria	Pago realizado mediante transferencia electrónica a la cuenta del centro médico.	t	Realizar la transferencia y subir una imagen o archivo del comprobante.	t	2026-07-18 22:03:54.657008	2026-07-18 22:03:54.657008
2	Depósito bancario	Pago realizado mediante depósito directo en ventanilla o practicaja.	t	Realizar el depósito y subir una imagen o archivo del comprobante.	t	2026-07-18 22:03:54.657008	2026-07-18 22:03:54.657008
3	Pago en recepción	Pago realizado directamente en las instalaciones del Centro Médico Pichardo.	f	Acudir a recepción para realizar el pago y conservar el recibo entregado.	t	2026-07-18 22:03:54.657008	2026-07-18 22:03:54.657008
4	Efectivo	Pago en efectivo registrado manualmente por el personal autorizado.	f	El pago debe ser registrado y confirmado por un administrador.	t	2026-07-18 22:03:54.657008	2026-07-18 22:03:54.657008
\.


--
-- Data for Name: modalidades; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.modalidades (id_modalidad, nombre_modalidad, descripcion) FROM stdin;
1	presencial	Curso impartido en instalaciones físicas
2	virtual	Curso impartido en línea
3	hibrido	Combinación de clases presenciales y virtuales
\.


--
-- Data for Name: movimientos_cupos_curso; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.movimientos_cupos_curso (id_movimiento_cupo, curso_id, compra_id, tipo_movimiento, cantidad, cupos_antes, cupos_despues, usuario_responsable, motivo, observaciones, fecha_movimiento) FROM stdin;
\.


--
-- Data for Name: notificaciones_academicas; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.notificaciones_academicas (id_notificacion, curso_id, inscripcion_id, sesion_id, evaluacion_id, tipo_notificacion, titulo, mensaje, canal, estado_envio, fecha_programada, fecha_envio, fecha_lectura, intentos_envio, ultimo_error, usuario_crea, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pagos_cursos; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.pagos_cursos (id_pago, id_compra, id_metodo_pago, monto, referencia, ruta_comprobante, nombre_archivo_original, tipo_archivo, estado, fecha_pago, fecha_reporte, fecha_validacion, usuario_valida, motivo_rechazo, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: participantes; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.participantes (id_participante, usuario_id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, telefono, correo, activo, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: progreso_curso; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.progreso_curso (id_progreso, inscripcion_id, sesiones_totales, sesiones_completadas, porcentaje_avance, porcentaje_asistencia, estado_academico, fecha_inicio, fecha_ultima_actividad, fecha_finalizacion, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: publicaciones; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.publicaciones (id_publicacion, titulo_noticia, resumen_bajada, id_autor, fecha_publicacion, etiquetas, url_imagen, contenido_completo, activo) FROM stdin;
\.


--
-- Data for Name: requisitos_aprobacion_curso; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.requisitos_aprobacion_curso (id_requisito_aprobacion, curso_id, porcentaje_asistencia_minima, calificacion_minima, porcentaje_avance_minimo, requiere_evaluaciones_obligatorias, requiere_evaluacion_final, permite_faltas_justificadas, maximo_faltas_injustificadas, requiere_pago_validado, emite_certificado, vigente, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: respuestas_encuestas; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.respuestas_encuestas (id, encuesta_id, usuario_id, respuestas, fecha_respuesta) FROM stdin;
\.


--
-- Data for Name: resultados_evaluaciones; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.resultados_evaluaciones (id_resultado, evaluacion_id, inscripcion_id, numero_intento, puntaje_obtenido, porcentaje_obtenido, aprobado, estado_resultado, fecha_inicio, fecha_entrega, fecha_calificacion, usuario_califica, retroalimentacion, evidencia_url, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sesiones_curso; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.sesiones_curso (id_sesion, curso_id, numero_sesion, titulo, descripcion, fecha, hora_inicio, hora_fin, modalidad_id, ubicacion_id, enlace_virtual, estado, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ubicaciones_cursos; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.ubicaciones_cursos (id_ubicacion, nombre_ubicacion, direccion_completa, capacidad_maxima, activo) FROM stdin;
1	Aula Virtual Zoom	Plataforma en línea - Acceso remoto	100	t
2	Salón de Pediatría	Hospital Pediátrico - Planta baja, consultorios 1-3	25	t
3	Sala de Talleres	Centro Comunitario Infantil - Primer piso	30	t
4	Alberca Semiolímpica	Unidad Deportiva Infantil "Pequeños Atletas"	20	t
5	Estudio de Arte	Casa de la Cultura - Área de talleres creativos	15	t
6	Auditorio Principal	Centro de Convenciones Pediátrico	80	t
7	Gimnasio Multidisciplinario	Centro Deportivo Infantil	35	t
\.


--
-- Data for Name: cola_actualizacion_datasets; Type: TABLE DATA; Schema: analitica; Owner: -
--

COPY analitica.cola_actualizacion_datasets (id_tarea, dataset_destino, tabla_origen, registro_origen_id, tipo_operacion, prioridad, estado, intentos, fecha_evento, fecha_programada, fecha_inicio_proceso, fecha_fin_proceso, ultimo_error, payload, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: dataset_reglas_asociacion; Type: TABLE DATA; Schema: analitica; Owner: -
--

COPY analitica.dataset_reglas_asociacion (id_registro, id_transaccion_analitica, usuario_id, curso_id, compra_id, folio_compra, fecha_compra, anio_compra, mes_compra, categoria_id, modalidad_id, precio_pagado, cantidad_cupos, estado_compra, fecha_carga, activo_dataset) FROM stdin;
\.


--
-- Data for Name: dataset_regresion_precio_cursos; Type: TABLE DATA; Schema: analitica; Owner: -
--

COPY analitica.dataset_regresion_precio_cursos (id_registro, curso_id, titulo_curso, categoria_id, modalidad_id, ubicacion_id, fecha_inicio, fecha_fin, anio_inicio, mes_inicio, duracion_dias, cupo_maximo, cupos_ocupados, porcentaje_ocupacion, total_compras, compras_validas, cupos_vendidos, compradores_unicos, ingresos_aprobados, precio_historico, ingreso_promedio_por_cupo, dias_anticipacion_primera_compra, dias_anticipacion_ultima_compra, precio_sugerido_modelo, version_modelo, fecha_prediccion, fecha_carga, activo_dataset) FROM stdin;
\.


--
-- Data for Name: dataset_segmentacion_clientes; Type: TABLE DATA; Schema: analitica; Owner: -
--

COPY analitica.dataset_segmentacion_clientes (id_registro, usuario_id, fecha_primera_compra, fecha_ultima_compra, dias_desde_ultima_compra, antiguedad_cliente_dias, total_compras, total_compras_validas, compras_pendientes, compras_canceladas, compras_rechazadas, compras_expiradas, cursos_distintos, categorias_distintas, modalidades_distintas, total_cupos_adquiridos, total_gastado, ticket_promedio, cupos_promedio_compra, tasa_conversion, fecha_carga, activo_dataset) FROM stdin;
\.


--
-- Data for Name: modelos_ml; Type: TABLE DATA; Schema: analitica; Owner: -
--

COPY analitica.modelos_ml (id_modelo, nombre_modelo, tipo_modelo, algoritmo, version_modelo, dataset_origen, descripcion, parametros, metricas, ruta_archivo_modelo, fecha_inicio_datos, fecha_fin_datos, cantidad_registros_entrenamiento, estado, es_modelo_activo, fecha_entrenamiento, fecha_despliegue, fecha_retiro, creado_por, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: predicciones_precio_cursos; Type: TABLE DATA; Schema: analitica; Owner: -
--

COPY analitica.predicciones_precio_cursos (id_prediccion, curso_id, modelo_id, precio_actual, precio_sugerido, precio_minimo_estimado, precio_maximo_estimado, variacion_absoluta, variacion_porcentual, nivel_confianza, variables_entrada, explicacion, fecha_prediccion, estado, decision_administrativa, motivo_decision, precio_aplicado, usuario_decide, fecha_decision, vigente, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: recomendaciones_cursos; Type: TABLE DATA; Schema: analitica; Owner: -
--

COPY analitica.recomendaciones_cursos (id_recomendacion, usuario_id, curso_recomendado_id, modelo_id, curso_origen_id, regla_origen, soporte, confianza, lift, puntuacion_recomendacion, motivo_recomendacion, fecha_generacion, fecha_expiracion, estado, visible_usuario, fecha_vista, fecha_aceptacion, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: segmentos_clientes; Type: TABLE DATA; Schema: analitica; Owner: -
--

COPY analitica.segmentos_clientes (id_segmentacion, usuario_id, modelo_id, numero_segmento, nombre_segmento, descripcion_segmento, distancia_centroide, nivel_confianza, caracteristicas_usuario, fecha_asignacion, vigente, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: backups; Type: TABLE DATA; Schema: auditoria; Owner: -
--

COPY auditoria.backups (id, fecha, tipo, "tamaño", archivo_url, estado) FROM stdin;
5	2026-03-08 00:51:12.485741	completo	20.34 KB	backups/backup-1772931073378.sql	exitoso
6	2026-03-22 18:58:47.810508	completo	35.01 KB	backups/backup-completo-2026-03-22T18-57-14.sql	exitoso
7	2026-06-28 18:47:00.996838	completo	226.00 KB	backups/backup-completo-2026-06-29T00-47-08.sql	exitoso
12	2026-07-18 13:42:15.312882	completo	321.26 KB	backups/backup-completo-2026-07-18T19-42-14.sql	completado
13	2026-07-18 14:13:33.456471	completo	328.65 KB	backups/backup-completo-2026-07-18T20-13-32.sql	exitoso
\.


--
-- Data for Name: intentos_recuperacion; Type: TABLE DATA; Schema: auditoria; Owner: -
--

COPY auditoria.intentos_recuperacion (id, identificador, conteo, ultimo_intento, bloqueado_hasta) FROM stdin;
2	jesushfernandezh@gmail.com	1	2025-12-01 00:12:14.964	\N
3	jesushfh123@gmail.com	1	2025-12-01 00:12:46.053	\N
1	jesusf1705dck@gmail.com	3	2025-12-01 00:14:19.72	2025-12-01 03:14:19.72
\.


--
-- Data for Name: empresa_info; Type: TABLE DATA; Schema: clinica; Owner: -
--

COPY clinica.empresa_info (id, nombre, direccion, telefono, correo, facebook, instagram, horario, logo_url, correo_soporte, created_at, updated_at) FROM stdin;
1	Centro Medico Pichardo	Calle alcatraz sin numero centro medico pichardo colonia los prados.	7711408883	centromedicopichardo@gmail.com	https://www.facebook.com/profile.php?id=61574639950614	\N	Lunes - Sabado de 9:30 am - 8:00 pm y Domingos de 10:00 am - 2:00 pm	https://res.cloudinary.com/dydfxuywl/image/upload/v1775607567/centro-medico/empresa/pultzizirc7kjqekykgr.jpg	\N	2026-04-07 13:14:04.091136	2026-07-18 20:02:39.306
\.


--
-- Data for Name: medicos; Type: TABLE DATA; Schema: clinica; Owner: -
--

COPY clinica.medicos (id_medico, nombres, apellido_paterno, apellido_materno, especialidad, hospital_clinica, direccion, url_foto, activo) FROM stdin;
1	ana nelida	antonio	flores	psicologia.	Centro Médico Pichardo	calle alcatraz  sn col los prados centro medico pichardo.	https://res.cloudinary.com/dydfxuywl/image/upload/v1784404382/centro-medico/medicos/lv0ybexqsnyhrbt66tcw.jpg	t
2	Francisco Javier	Moreno	Pichardo	Pediatria.	Centro Médico Pichardo	calle alcatraz sn col los prados centro medico pichardo	https://res.cloudinary.com/dydfxuywl/image/upload/v1784404614/centro-medico/medicos/uwapl2blw1anoyah6fhq.jpg	t
\.


--
-- Data for Name: nosotros; Type: TABLE DATA; Schema: clinica; Owner: -
--

COPY clinica.nosotros (id, mision, vision, valores, nuestra_historia, compromiso, url_imagen) FROM stdin;
1	Proveer atención médica pediátrica de la más alta calidad, centrada en la calidez humana y la prevención.dsfsd	Ser el centro pediátrico de referencia regional, reconocido por la excelencia y el trato humano.sdfds	{Humanidad,Excelencia,Confianza,Innovación,Respeto,Honestidad}	Fundado hace más de una década, el Centro Médico Pichardo nació de la convicción de que los niños merecen cuidado especializado.\n	Nuestro equipo está unido por el mismo juramento: ofrecer lo mejor de nosotros en cada consulta para asegurar su tranquilidad.dfsfs	https://res.cloudinary.com/dydfxuywl/image/upload/v1776321991/centro-medico/quienes-somos/vfpzctr5mm56hr3p5ucd.jpg
\.


--
-- Data for Name: servicios; Type: TABLE DATA; Schema: clinica; Owner: -
--

COPY clinica.servicios (id_servicio, titulo_servicio, descripcion, ubicacion, url_image, texto_alt, diseno_tipo, activo) FROM stdin;
1	consulta pediatrica	horarios de lunes a sabado de 9 a 8 de la noche\ndomingos de 10 a 14 hr	Centro Médico Pichardo	/default-service.jpg	consulta pediatrica	vertical	t
2	cursos para padres	domingo 5 de la tarde , cada semana curso diferente	Centro Médico Pichardo	/default-service.jpg	cursos para padres	vertical	t
\.


--
-- Data for Name: alertas_seguridad; Type: TABLE DATA; Schema: seguridad; Owner: -
--

COPY seguridad.alertas_seguridad (id_alerta, tipo_alerta, nivel_critico, mensaje, detalle, fecha_deteccion, fecha_resolucion, estado, usuario_asignado) FROM stdin;
\.


--
-- Data for Name: auditoria_acciones; Type: TABLE DATA; Schema: seguridad; Owner: -
--

COPY seguridad.auditoria_acciones (id_auditoria, usuario, ip_address, accion, tabla_afectada, registro_id, datos_anteriores, datos_nuevos, fecha_hora, aplicacion_origen, session_id) FROM stdin;
1	jesushfernandezh@gmail.com	127.0.0.1	UPDATE	clinica.servicios	13	{"activo": true, "texto_alt": "Cirugía Pediátrica Ambulatoria", "ubicacion": "Pabellón Quirúrgico A", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1773988731/centro-medico/servicios/wn8aazeb7m8pklfjcqqi.jpg", "descripcion": "Procedimientos quirúrgicos menores con recuperación rápida y cuidados especializados.", "diseno_tipo": "card_highlight", "id_servicio": 13, "titulo_servicio": "Cirugía Pediátrica Prueba"}	{"activo": true, "texto_alt": "Cirugía Pediátrica Ambulatoria", "ubicacion": "Pabellón Quirúrgico A", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1773988731/centro-medico/servicios/wn8aazeb7m8pklfjcqqi.jpg", "descripcion": "Procedimientos quirúrgicos menores con recuperación rápida y cuidados especializados.", "diseno_tipo": "card_highlight", "id_servicio": 13, "titulo_servicio": "Cirugía Pediátrica Prueba 2"}	2026-03-26 21:30:02.466112	TRIGGER_AUDITORIA	\N
2	chavezvargasluisjesus@gmail.com	127.0.0.1	UPDATE	clinica.servicios	11	{"activo": true, "texto_alt": "Médico realizando un ecocardiograma a un niño pequeño", "ubicacion": "Piso 2 - Especialidades", "url_image": "noimage", "descripcion": "Evaluación del corazón infantil, electrocardiogramas y detección de soplos o arritmias.", "diseno_tipo": "card_standard", "id_servicio": 11, "titulo_servicio": "Cardiología Pediátrica prueba"}	{"activo": false, "texto_alt": "Médico realizando un ecocardiograma a un niño pequeño", "ubicacion": "Piso 2 - Especialidades", "url_image": "noimage", "descripcion": "Evaluación del corazón infantil, electrocardiogramas y detección de soplos o arritmias.", "diseno_tipo": "card_standard", "id_servicio": 11, "titulo_servicio": "Cardiología Pediátrica prueba"}	2026-03-26 21:34:41.744767	TRIGGER_AUDITORIA	\N
3	chavezvargasluisjesus@gmail.com	127.0.0.1	UPDATE	clinica.servicios	13	{"activo": true, "texto_alt": "Cirugía Pediátrica Ambulatoria", "ubicacion": "Pabellón Quirúrgico A", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1773988731/centro-medico/servicios/wn8aazeb7m8pklfjcqqi.jpg", "descripcion": "Procedimientos quirúrgicos menores con recuperación rápida y cuidados especializados.", "diseno_tipo": "card_highlight", "id_servicio": 13, "titulo_servicio": "Cirugía Pediátrica Prueba 2"}	{"activo": false, "texto_alt": "Cirugía Pediátrica Ambulatoria", "ubicacion": "Pabellón Quirúrgico A", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1773988731/centro-medico/servicios/wn8aazeb7m8pklfjcqqi.jpg", "descripcion": "Procedimientos quirúrgicos menores con recuperación rápida y cuidados especializados.", "diseno_tipo": "card_highlight", "id_servicio": 13, "titulo_servicio": "Cirugía Pediátrica Prueba 2"}	2026-03-26 21:34:44.982755	TRIGGER_AUDITORIA	\N
4	chavezvargasluisjesus@gmail.com	127.0.0.1	UPDATE	clinica.servicios	1	{"activo": true, "texto_alt": "Pediatra examinando a un niño con un estetoscopio", "ubicacion": "Consultorio 101 - Ala Norte", "url_image": "noimage", "descripcion": "Control de niño sano, seguimiento de crecimiento, desarrollo y vacunación integral.", "diseno_tipo": "card_highlight", "id_servicio": 1, "titulo_servicio": "Consulta Pediátrica General"}	{"activo": false, "texto_alt": "Pediatra examinando a un niño con un estetoscopio", "ubicacion": "Consultorio 101 - Ala Norte", "url_image": "noimage", "descripcion": "Control de niño sano, seguimiento de crecimiento, desarrollo y vacunación integral.", "diseno_tipo": "card_highlight", "id_servicio": 1, "titulo_servicio": "Consulta Pediátrica General"}	2026-03-26 21:34:46.414412	TRIGGER_AUDITORIA	\N
5	chavezvargasluisjesus@gmail.com	127.0.0.1	UPDATE	clinica.servicios	1	{"activo": false, "texto_alt": "Pediatra examinando a un niño con un estetoscopio", "ubicacion": "Consultorio 101 - Ala Norte", "url_image": "noimage", "descripcion": "Control de niño sano, seguimiento de crecimiento, desarrollo y vacunación integral.", "diseno_tipo": "card_highlight", "id_servicio": 1, "titulo_servicio": "Consulta Pediátrica General"}	{"activo": false, "texto_alt": "Pediatra examinando a un niño con un estetoscopio", "ubicacion": "Consultorio 101 - Ala Norte", "url_image": "noimage", "descripcion": "Control de niño sano, seguimiento de crecimiento, desarrollo y vacunación integral.", "diseno_tipo": "card_highlight", "id_servicio": 1, "titulo_servicio": "Consulta Pediátrica General"}	2026-03-26 21:34:46.984146	TRIGGER_AUDITORIA	\N
6	chavezvargasluisjesus@gmail.com	127.0.0.1	UPDATE	clinica.servicios	14	{"activo": true, "texto_alt": "Dermatóloga revisando la piel del brazo de un bebé", "ubicacion": "Consultorio 302", "url_image": "noimage", "descripcion": "Tratamiento de dermatitis atópica, alergias cutáneas, acné juvenil y lunares.", "diseno_tipo": "card_standard", "id_servicio": 14, "titulo_servicio": "Dermatología Infantil"}	{"activo": false, "texto_alt": "Dermatóloga revisando la piel del brazo de un bebé", "ubicacion": "Consultorio 302", "url_image": "noimage", "descripcion": "Tratamiento de dermatitis atópica, alergias cutáneas, acné juvenil y lunares.", "diseno_tipo": "card_standard", "id_servicio": 14, "titulo_servicio": "Dermatología Infantil"}	2026-03-26 21:34:48.948174	TRIGGER_AUDITORIA	\N
7	jesushfernandezh@gmail.com	127.0.0.1	UPDATE	academia.cursos	9	{"costo": 300.00, "activo": true, "horario": "16:00 - 19:00", "id_curso": 9, "categoria": "Salud", "fecha_fin": "2018-11-11", "modalidad": "Presencial", "ubicacion": "Auditorio Principal", "dirigido_a": "Padres", "cupo_maximo": 30, "descripcion": "2efw", "fecha_inicio": "2018-09-12", "titulo_curso": "5 Inteligencias", "id_instructor": 2, "cupos_ocupados": 4, "url_imagen_portada": "/logo.png"}	{"costo": 300.00, "activo": false, "horario": "16:00 - 19:00", "id_curso": 9, "categoria": "Salud", "fecha_fin": "2018-11-11", "modalidad": "Presencial", "ubicacion": "Auditorio Principal", "dirigido_a": "Padres", "cupo_maximo": 30, "descripcion": "2efw", "fecha_inicio": "2018-09-12", "titulo_curso": "5 Inteligencias", "id_instructor": 2, "cupos_ocupados": 4, "url_imagen_portada": "/logo.png"}	2026-03-26 21:40:07.765501	TRIGGER_AUDITORIA	\N
8	neondb_owner	127.0.0.1	INSERT	academia.cursos	1	\N	{"costo": 120.00, "activo": true, "horario": "Sábados 10:00 - 11:30", "id_curso": 1, "categoria": "Inteligencia Lingüística", "fecha_fin": "2026-05-24", "modalidad": "presencial", "ubicacion": "Aula de Psicolingüística, 2do piso", "dirigido_a": "niños", "cupo_maximo": 15, "descripcion": "Taller donde niños aprenderán a identificar y expresar sus emociones a través de cuentos y narraciones. Desarrolla inteligencia lingüística y emocional.", "fecha_inicio": "2026-04-05", "titulo_curso": "Cuentacuentos Terapéuticos: Expresando Emociones", "id_instructor": null, "cupos_ocupados": 8, "url_imagen_portada": "/images/cursos/cuentacuentos.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
9	neondb_owner	127.0.0.1	INSERT	academia.cursos	2	\N	{"costo": 85.00, "activo": true, "horario": "Miércoles 17:00 - 18:30", "id_curso": 2, "categoria": "Inteligencia Lingüística", "fecha_fin": "2026-06-07", "modalidad": "en_linea", "ubicacion": "Plataforma Zoom", "dirigido_a": "adolescentes", "cupo_maximo": 20, "descripcion": "Aprende a expresar tus ideas, emociones y necesidades de manera clara y respetuosa. Mejora tus relaciones familiares y sociales.", "fecha_inicio": "2026-04-12", "titulo_curso": "Taller de Comunicación Asertiva para Adolescentes", "id_instructor": null, "cupos_ocupados": 12, "url_imagen_portada": "/images/cursos/comunicacion.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
10	neondb_owner	127.0.0.1	INSERT	academia.cursos	3	\N	{"costo": 150.00, "activo": true, "horario": "Miércoles 18:00 - 19:30", "id_curso": 3, "categoria": "Inteligencia Lingüística", "fecha_fin": "2026-05-27", "modalidad": "presencial", "ubicacion": "Biblioteca Pediátrica", "dirigido_a": "padres", "cupo_maximo": 12, "descripcion": "Espacio para que padres e hijos compartan lecturas que fomentan la empatía y comprensión emocional. Desarrollo de inteligencia lingüística e interpersonal.", "fecha_inicio": "2026-04-08", "titulo_curso": "Lectura y Empatía: Club de Lectura Familiar", "id_instructor": null, "cupos_ocupados": 5, "url_imagen_portada": "/images/cursos/club_lectura.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
11	neondb_owner	127.0.0.1	INSERT	academia.cursos	4	\N	{"costo": 100.00, "activo": true, "horario": "Lunes 16:00 - 17:30", "id_curso": 4, "categoria": "Inteligencia Lógico-Matemática", "fecha_fin": "2026-05-25", "modalidad": "presencial", "ubicacion": "Laboratorio de Juegos, Planta Baja", "dirigido_a": "niños", "cupo_maximo": 12, "descripcion": "Taller lúdico donde niños descubren conceptos matemáticos a través de juegos, puzzles y actividades prácticas. Desarrolla pensamiento lógico y resolución de problemas.", "fecha_inicio": "2026-04-06", "titulo_curso": "Matemáticas Divertidas: Aprendiendo Jugando", "id_instructor": null, "cupos_ocupados": 10, "url_imagen_portada": "/images/cursos/matematicas.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
12	neondb_owner	127.0.0.1	INSERT	academia.cursos	5	\N	{"costo": 95.00, "activo": true, "horario": "Viernes 16:00 - 18:00", "id_curso": 5, "categoria": "Inteligencia Lógico-Matemática", "fecha_fin": "2026-06-12", "modalidad": "en_linea", "ubicacion": "Plataforma Google Meet", "dirigido_a": "adolescentes", "cupo_maximo": 25, "descripcion": "Curso que desarrolla habilidades de análisis, razonamiento científico y toma de decisiones informadas sobre temas de salud y bienestar.", "fecha_inicio": "2026-04-10", "titulo_curso": "Pensamiento Crítico para Adolescentes: Ciencia y Salud", "id_instructor": null, "cupos_ocupados": 18, "url_imagen_portada": "/images/cursos/pensamiento_critico.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
13	neondb_owner	127.0.0.1	INSERT	academia.cursos	6	\N	{"costo": 180.00, "activo": true, "horario": "Domingos 11:00 - 13:00", "id_curso": 6, "categoria": "Inteligencia Lógico-Matemática", "fecha_fin": "2026-05-10", "modalidad": "presencial", "ubicacion": "Sala de Conferencias", "dirigido_a": "padres", "cupo_maximo": 20, "descripcion": "Taller práctico para padres sobre cómo fomentar el pensamiento lógico en sus hijos y manejar situaciones familiares con razonamiento efectivo.", "fecha_inicio": "2026-04-19", "titulo_curso": "Estrategias de Resolución de Problemas para Padres", "id_instructor": null, "cupos_ocupados": 7, "url_imagen_portada": "/images/cursos/estrategias_padres.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
14	neondb_owner	127.0.0.1	INSERT	academia.cursos	7	\N	{"costo": 130.00, "activo": true, "horario": "Martes 15:30 - 17:00", "id_curso": 7, "categoria": "Inteligencia Espacial", "fecha_fin": "2026-05-26", "modalidad": "presencial", "ubicacion": "Taller de Arte, 3er piso", "dirigido_a": "niños", "cupo_maximo": 10, "descripcion": "Taller donde niños exploran sus emociones y creatividad mediante pintura, dibujo y manualidades. Ideal para procesar experiencias médicas.", "fecha_inicio": "2026-04-07", "titulo_curso": "Arte Terapia: Expresando Emociones a Través del Arte", "id_instructor": null, "cupos_ocupados": 6, "url_imagen_portada": "/images/cursos/arte_terapia.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
15	neondb_owner	127.0.0.1	INSERT	academia.cursos	8	\N	{"costo": 110.00, "activo": true, "horario": "Jueves 17:00 - 18:30", "id_curso": 8, "categoria": "Inteligencia Espacial", "fecha_fin": "2026-06-11", "modalidad": "en_linea", "ubicacion": "Plataforma Microsoft Teams", "dirigido_a": "adolescentes", "cupo_maximo": 15, "descripcion": "Curso introductorio a diseño 3D y modelado digital. Desarrolla inteligencia espacial y creatividad tecnológica.", "fecha_inicio": "2026-04-09", "titulo_curso": "Diseño Creativo en 3D: Modelado Digital para Adolescentes", "id_instructor": null, "cupos_ocupados": 9, "url_imagen_portada": "/images/cursos/diseno_3d.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
16	neondb_owner	127.0.0.1	INSERT	academia.cursos	9	\N	{"costo": 160.00, "activo": true, "horario": "Lunes 18:30 - 20:00", "id_curso": 9, "categoria": "Inteligencia Espacial", "fecha_fin": "2026-05-04", "modalidad": "presencial", "ubicacion": "Sala de Meditación", "dirigido_a": "padres", "cupo_maximo": 15, "descripcion": "Taller familiar que combina creación artística con técnicas de relajación. Fortalece la inteligencia espacial y el bienestar emocional.", "fecha_inicio": "2026-04-13", "titulo_curso": "Mindfulness y Mandalas: Relajación para Padres e Hijos", "id_instructor": null, "cupos_ocupados": 11, "url_imagen_portada": "/images/cursos/mandalas.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
17	neondb_owner	127.0.0.1	INSERT	academia.cursos	10	\N	{"costo": 115.00, "activo": true, "horario": "Miércoles 15:00 - 16:30", "id_curso": 10, "categoria": "Inteligencia Corporal-Cinestésica", "fecha_fin": "2026-05-27", "modalidad": "presencial", "ubicacion": "Gimnasio Pediátrico", "dirigido_a": "niños", "cupo_maximo": 12, "descripcion": "Taller que promueve el desarrollo motor y la conciencia corporal en niños a través de juegos y actividades físicas. Ideal para niños en edad preescolar.", "fecha_inicio": "2026-04-08", "titulo_curso": "Psicomotricidad: Movimiento y Desarrollo Infantil", "id_instructor": null, "cupos_ocupados": 8, "url_imagen_portada": "/images/cursos/psicomotricidad.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
18	neondb_owner	127.0.0.1	INSERT	academia.cursos	11	\N	{"costo": 90.00, "activo": true, "horario": "Sábados 09:00 - 10:30", "id_curso": 11, "categoria": "Inteligencia Corporal-Cinestésica", "fecha_fin": "2026-06-13", "modalidad": "en_linea", "ubicacion": "Clase en Vivo por Zoom", "dirigido_a": "adolescentes", "cupo_maximo": 20, "descripcion": "Curso de yoga adaptado a adolescentes que combina posturas, respiración y técnicas de manejo de estrés. Fortalece cuerpo-mente.", "fecha_inicio": "2026-04-11", "titulo_curso": "Yoga y Bienestar para Adolescentes", "id_instructor": null, "cupos_ocupados": 14, "url_imagen_portada": "/images/cursos/yoga_adolescentes.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
19	neondb_owner	127.0.0.1	INSERT	academia.cursos	12	\N	{"costo": 200.00, "activo": true, "horario": "Sábados 11:00 - 13:00", "id_curso": 12, "categoria": "Inteligencia Corporal-Cinestésica", "fecha_fin": "2026-05-08", "modalidad": "presencial", "ubicacion": "Sala de Estimulación Temprana", "dirigido_a": "padres", "cupo_maximo": 12, "descripcion": "Taller para padres que enseña técnicas de masaje infantil para fortalecer el vínculo afectivo, calmar ansiedad y promover el desarrollo sensorial.", "fecha_inicio": "2026-04-17", "titulo_curso": "Masaje Infantil y Vínculo Afectivo", "id_instructor": null, "cupos_ocupados": 4, "url_imagen_portada": "/images/cursos/masaje_infantil.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
20	neondb_owner	127.0.0.1	INSERT	academia.cursos	13	\N	{"costo": 125.00, "activo": true, "horario": "Jueves 16:00 - 17:30", "id_curso": 13, "categoria": "Inteligencia Interpersonal", "fecha_fin": "2026-05-28", "modalidad": "presencial", "ubicacion": "Sala de Juegos Cooperativos", "dirigido_a": "niños", "cupo_maximo": 12, "descripcion": "Taller donde niños aprenden a compartir, colaborar y manejar sus emociones en grupo. Desarrolla inteligencia interpersonal y empatía.", "fecha_inicio": "2026-04-09", "titulo_curso": "Habilidades Sociales: Jugando y Compartiendo", "id_instructor": null, "cupos_ocupados": 7, "url_imagen_portada": "/images/cursos/habilidades_sociales.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
21	neondb_owner	127.0.0.1	INSERT	academia.cursos	14	\N	{"costo": 105.00, "activo": true, "horario": "Martes 17:30 - 19:00", "id_curso": 14, "categoria": "Inteligencia Interpersonal", "fecha_fin": "2026-06-09", "modalidad": "en_linea", "ubicacion": "Plataforma Zoom", "dirigido_a": "adolescentes", "cupo_maximo": 20, "descripcion": "Curso intensivo que desarrolla habilidades de liderazgo, comunicación efectiva, resolución de conflictos y trabajo colaborativo.", "fecha_inicio": "2026-04-14", "titulo_curso": "Liderazgo y Trabajo en Equipo para Adolescentes", "id_instructor": null, "cupos_ocupados": 13, "url_imagen_portada": "/images/cursos/liderazgo.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
22	neondb_owner	127.0.0.1	INSERT	academia.cursos	15	\N	{"costo": 170.00, "activo": true, "horario": "Lunes 19:00 - 20:30", "id_curso": 15, "categoria": "Inteligencia Intrapersonal", "fecha_fin": "2026-05-25", "modalidad": "presencial", "ubicacion": "Auditorio Principal", "dirigido_a": "padres", "cupo_maximo": 20, "descripcion": "Taller para padres sobre cómo establecer límites saludables, manejo de emociones y fortalecimiento del vínculo familiar.", "fecha_inicio": "2026-04-06", "titulo_curso": "Escuela de Padres: Comunicación y Límites con Amor", "id_instructor": null, "cupos_ocupados": 15, "url_imagen_portada": "/images/cursos/escuela_padres.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
23	neondb_owner	127.0.0.1	INSERT	academia.cursos	16	\N	{"costo": 110.00, "activo": true, "horario": "Viernes 15:00 - 16:30", "id_curso": 16, "categoria": "Inteligencia Emocional", "fecha_fin": "2026-05-29", "modalidad": "presencial", "ubicacion": "Sala de Psicología Infantil", "dirigido_a": "niños", "cupo_maximo": 12, "descripcion": "Curso lúdico donde niños aprenden a identificar, nombrar y gestionar sus emociones básicas: alegría, tristeza, enojo, miedo.", "fecha_inicio": "2026-04-10", "titulo_curso": "Inteligencia Emocional para Niños: Reconociendo Mis Emociones", "id_instructor": null, "cupos_ocupados": 9, "url_imagen_portada": "/images/cursos/emociones_niños.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
24	neondb_owner	127.0.0.1	INSERT	academia.cursos	17	\N	{"costo": 95.00, "activo": true, "horario": "Jueves 18:00 - 19:30", "id_curso": 17, "categoria": "Inteligencia Emocional", "fecha_fin": "2026-06-11", "modalidad": "en_linea", "ubicacion": "Clase Virtual en Vivo", "dirigido_a": "adolescentes", "cupo_maximo": 25, "descripcion": "Curso práctico con técnicas de relajación, mindfulness y herramientas para manejar la presión académica y social.", "fecha_inicio": "2026-04-16", "titulo_curso": "Gestión del Estrés y Ansiedad en Adolescentes", "id_instructor": null, "cupos_ocupados": 17, "url_imagen_portada": "/images/cursos/gestion_estres.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
25	neondb_owner	127.0.0.1	INSERT	academia.cursos	18	\N	{"costo": 250.00, "activo": true, "horario": "Sábados 09:00 - 11:00", "id_curso": 18, "categoria": "Desarrollo Integral", "fecha_fin": "2026-06-20", "modalidad": "presencial", "ubicacion": "Auditorio Principal", "dirigido_a": "padres", "cupo_maximo": 20, "descripcion": "Curso completo para padres sobre desarrollo infantil, estimulación temprana, y cómo potenciar las inteligencias múltiples en casa.", "fecha_inicio": "2026-04-18", "titulo_curso": "Crianza Consciente: Desarrollo Integral de tu Hijo", "id_instructor": null, "cupos_ocupados": 12, "url_imagen_portada": "/images/cursos/crianza_consciente.jpg"}	2026-03-26 21:53:33.377423	TRIGGER_AUDITORIA	\N
26	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-03-26 21:56:18.981622	TRIGGER_AUDITORIA	\N
27	jesushfernandezh@gmail.com	::1	UPDATE	clinica.nosotros	1	{"id": 1, "mision": "Proveer atención médica pediátrica de la más alta calidad, centrada en la calidez humana y la prevención.dsfsd", "vision": "Ser el centro pediátrico de referencia regional, reconocido por la excelencia y el trato humano.sdfds", "valores": ["Humanidad", "Excelencia", "Confianza", "Innovación", "Respeto"], "compromiso": "Nuestro equipo está unido por el mismo juramento: ofrecer lo mejor de nosotros en cada consulta para asegurar su tranquilidad.dfsfs", "url_imagen": "", "nuestra_historia": "Fundado hace más de una década, el Centro Médico Pichardo nació de la convicción de que los niños merecen cuidado especializado.\\n"}	{"id": 1, "mision": "Proveer atención médica pediátrica de la más alta calidad, centrada en la calidez humana y la prevención.dsfsd", "vision": "Ser el centro pediátrico de referencia regional, reconocido por la excelencia y el trato humano.sdfds", "valores": ["Humanidad", "Excelencia", "Confianza", "Innovación", "Respeto", "Honestidad"], "compromiso": "Nuestro equipo está unido por el mismo juramento: ofrecer lo mejor de nosotros en cada consulta para asegurar su tranquilidad.dfsfs", "url_imagen": "", "nuestra_historia": "Fundado hace más de una década, el Centro Médico Pichardo nació de la convicción de que los niños merecen cuidado especializado.\\n"}	2026-03-26 22:06:41.790329	TRIGGER_AUDITORIA	\N
28	jesushfernandezh@gmail.com	::1	UPDATE	seguridad.usuarios	1	{"id": 1, "edad": 30, "sexo": "Masculino", "activo": true, "correo": "admin@test.com", "nombre": "Admin", "rol_id": 1, "telefono": "0000000000", "contrasena": "$2b$10$Pj/8.W.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Principal", "apellidoPaterno": "Sistema", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 1, "edad": 30, "sexo": "Masculino", "activo": true, "correo": "admin@test.com", "nombre": "Admin", "rol_id": 2, "telefono": "0000000000", "contrasena": "$2b$10$Pj/8.W.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Principal", "apellidoPaterno": "Sistema", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-03-26 22:08:35.281739	TRIGGER_AUDITORIA	\N
29	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-03-27 11:37:51.858502	TRIGGER_AUDITORIA	\N
30	chavezvargasluisjesus@gmail.com	127.0.0.1	UPDATE	clinica.medicos	1	{"activo": true, "nombres": "Mariana", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1773956349/centro-medico/medicos/o9scjhh79we4vkxuijjm.png", "direccion": "Av. Central 123", "id_medico": 1, "especialidad": "Psicología Infantil", "apellido_materno": "Sánchez", "apellido_paterno": "Echeverría", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": false, "nombres": "Mariana", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1773956349/centro-medico/medicos/o9scjhh79we4vkxuijjm.png", "direccion": "Av. Central 123", "id_medico": 1, "especialidad": "Psicología Infantil", "apellido_materno": "Sánchez", "apellido_paterno": "Echeverría", "hospital_clinica": "Centro Médico Pichardo"}	2026-03-27 15:15:52.066618	TRIGGER_AUDITORIA	\N
31	chavezvargasluisjesus@gmail.com	127.0.0.1	UPDATE	clinica.medicos	1	{"activo": false, "nombres": "Mariana", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1773956349/centro-medico/medicos/o9scjhh79we4vkxuijjm.png", "direccion": "Av. Central 123", "id_medico": 1, "especialidad": "Psicología Infantil", "apellido_materno": "Sánchez", "apellido_paterno": "Echeverría", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": false, "nombres": "Mariana", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1773956349/centro-medico/medicos/o9scjhh79we4vkxuijjm.png", "direccion": "Av. Central 123", "id_medico": 1, "especialidad": "Psicología Infantil", "apellido_materno": "Sánchez", "apellido_paterno": "Echeverría", "hospital_clinica": "Centro Médico Pichardo"}	2026-03-27 15:15:53.311455	TRIGGER_AUDITORIA	\N
32	neondb_owner	::1	UPDATE	academia.cursos	1	{"costo": 120.00, "activo": true, "horario": "Sábados 10:00 - 11:30", "id_curso": 1, "categoria": "Inteligencia Lingüística", "fecha_fin": "2026-05-24", "modalidad": "presencial", "ubicacion": "Aula de Psicolingüística, 2do piso", "dirigido_a": "niños", "cupo_maximo": 15, "descripcion": "Taller donde niños aprenderán a identificar y expresar sus emociones a través de cuentos y narraciones. Desarrolla inteligencia lingüística y emocional.", "fecha_inicio": "2026-04-05", "titulo_curso": "Cuentacuentos Terapéuticos: Expresando Emociones", "id_instructor": null, "cupos_ocupados": 8, "url_imagen_portada": "/images/cursos/cuentacuentos.jpg"}	{"costo": 120.00, "activo": true, "horario": "Sábados 10:00 - 11:30", "id_curso": 1, "categoria": "Inteligencia Lingüística", "fecha_fin": "2026-05-24", "modalidad": "presencial", "ubicacion": "Aula de Psicolingüística, 2do piso", "dirigido_a": "niños", "cupo_maximo": 15, "descripcion": "Taller donde niños aprenderán a identificar y expresar sus emociones a través de cuentos y narraciones. Desarrolla inteligencia lingüística y emocional.", "fecha_inicio": "2026-04-05", "titulo_curso": "Cuentacuentos Terapéuticos: Expresando Emociones", "id_instructor": null, "cupos_ocupados": 9, "url_imagen_portada": "/images/cursos/cuentacuentos.jpg"}	2026-04-07 13:32:49.573406	TRIGGER_AUDITORIA	\N
33	neondb_owner	::1	UPDATE	academia.cursos	1	{"costo": 120.00, "activo": true, "horario": "Sábados 10:00 - 11:30", "id_curso": 1, "categoria": "Inteligencia Lingüística", "fecha_fin": "2026-05-24", "modalidad": "presencial", "ubicacion": "Aula de Psicolingüística, 2do piso", "dirigido_a": "niños", "cupo_maximo": 15, "descripcion": "Taller donde niños aprenderán a identificar y expresar sus emociones a través de cuentos y narraciones. Desarrolla inteligencia lingüística y emocional.", "fecha_inicio": "2026-04-05", "titulo_curso": "Cuentacuentos Terapéuticos: Expresando Emociones", "id_instructor": null, "cupos_ocupados": 9, "url_imagen_portada": "/images/cursos/cuentacuentos.jpg"}	{"costo": 120.00, "activo": true, "horario": "Sábados 10:00 - 11:30", "id_curso": 1, "categoria": "Inteligencia Lingüística", "fecha_fin": "2026-05-24", "modalidad": "presencial", "ubicacion": "Aula de Psicolingüística, 2do piso", "dirigido_a": "niños", "cupo_maximo": 15, "descripcion": "Taller donde niños aprenderán a identificar y expresar sus emociones a través de cuentos y narraciones. Desarrolla inteligencia lingüística y emocional.", "fecha_inicio": "2026-04-05", "titulo_curso": "Cuentacuentos Terapéuticos: Expresando Emociones", "id_instructor": null, "cupos_ocupados": 15, "url_imagen_portada": "/images/cursos/cuentacuentos.jpg"}	2026-04-07 13:33:30.892374	TRIGGER_AUDITORIA	\N
47	chavezvargasluisjesus@gmail.com	::1	UPDATE	clinica.medicos	6	{"activo": true, "nombres": "Javier", "url_foto": "/Pichardo/jpg", "direccion": "Blvd. Adolfo Ruiz Cortines 789", "id_medico": 6, "especialidad": "Pediatra en Jefe", "apellido_materno": "Pichardo", "apellido_paterno": "Moreno", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": true, "nombres": "Javier", "url_foto": "/Pichardo/jpg", "direccion": "Blvd. Adolfo Ruiz Cortines 789", "id_medico": 6, "especialidad": "Pediatra en Jefe", "apellido_materno": "Pichardo", "apellido_paterno": "Moreno", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-08 16:59:49.727449	TRIGGER_AUDITORIA	\N
34	neondb_owner	::1	UPDATE	academia.cursos	1	{"costo": 120.00, "activo": true, "horario": "Sábados 10:00 - 11:30", "id_curso": 1, "categoria": "Inteligencia Lingüística", "fecha_fin": "2026-05-24", "modalidad": "presencial", "ubicacion": "Aula de Psicolingüística, 2do piso", "dirigido_a": "niños", "cupo_maximo": 15, "descripcion": "Taller donde niños aprenderán a identificar y expresar sus emociones a través de cuentos y narraciones. Desarrolla inteligencia lingüística y emocional.", "fecha_inicio": "2026-04-05", "titulo_curso": "Cuentacuentos Terapéuticos: Expresando Emociones", "id_instructor": null, "cupos_ocupados": 15, "url_imagen_portada": "/images/cursos/cuentacuentos.jpg"}	{"costo": 120.00, "activo": true, "horario": "Sábados 10:00 - 11:30", "id_curso": 1, "categoria": "Inteligencia Lingüística", "fecha_fin": "2026-05-24", "modalidad": "presencial", "ubicacion": "Aula de Psicolingüística, 2do piso", "dirigido_a": "niños", "cupo_maximo": 15, "descripcion": "Taller donde niños aprenderán a identificar y expresar sus emociones a través de cuentos y narraciones. Desarrolla inteligencia lingüística y emocional.", "fecha_inicio": "2026-04-05", "titulo_curso": "Cuentacuentos Terapéuticos: Expresando Emociones", "id_instructor": null, "cupos_ocupados": 14, "url_imagen_portada": "/images/cursos/cuentacuentos.jpg"}	2026-04-07 13:33:48.571249	TRIGGER_AUDITORIA	\N
35	neondb_owner	::1	UPDATE	academia.cursos	18	{"costo": 250.00, "activo": true, "horario": "Sábados 09:00 - 11:00", "id_curso": 18, "categoria": "Desarrollo Integral", "fecha_fin": "2026-06-20", "modalidad": "presencial", "ubicacion": "Auditorio Principal", "dirigido_a": "padres", "cupo_maximo": 20, "descripcion": "Curso completo para padres sobre desarrollo infantil, estimulación temprana, y cómo potenciar las inteligencias múltiples en casa.", "fecha_inicio": "2026-04-18", "titulo_curso": "Crianza Consciente: Desarrollo Integral de tu Hijo", "id_instructor": null, "cupos_ocupados": 12, "url_imagen_portada": "/images/cursos/crianza_consciente.jpg"}	{"costo": 250.00, "activo": true, "horario": "Sábados 09:00 - 11:00", "id_curso": 18, "categoria": "Desarrollo Integral", "fecha_fin": "2026-06-20", "modalidad": "presencial", "ubicacion": "Auditorio Principal", "dirigido_a": "padres", "cupo_maximo": 20, "descripcion": "Curso completo para padres sobre desarrollo infantil, estimulación temprana, y cómo potenciar las inteligencias múltiples en casa.", "fecha_inicio": "2026-04-18", "titulo_curso": "Crianza Consciente: Desarrollo Integral de tu Hijo", "id_instructor": null, "cupos_ocupados": 12, "url_imagen_portada": "https://res.cloudinary.com/dydfxuywl/image/upload/v1775593317/Gemini_Generated_Image_at0oz1at0oz1at0o_rdxeuv.png"}	2026-04-07 14:22:43.480058	TRIGGER_AUDITORIA	\N
36	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-07 18:06:08.973457	TRIGGER_AUDITORIA	\N
37	neondb_owner	::1	UPDATE	seguridad.usuarios	13	{"id": 13, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfh123@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$e4daBPIwI6SeF7BAlAKutuMKyb3cSLs6XNYrOJvdd0l3Xde0J7y.2", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Fernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 13, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfh123@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$e4daBPIwI6SeF7BAlAKutuMKyb3cSLs6XNYrOJvdd0l3Xde0J7y.2", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Fernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-07 21:06:31.719787	TRIGGER_AUDITORIA	\N
38	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-07 21:43:04.643239	TRIGGER_AUDITORIA	\N
39	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-07 22:21:38.357	TRIGGER_AUDITORIA	\N
40	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-08 13:55:21.755418	TRIGGER_AUDITORIA	\N
41	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-08 13:58:30.084567	TRIGGER_AUDITORIA	\N
42	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-08 14:09:21.512495	TRIGGER_AUDITORIA	\N
43	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-08 14:22:54.512326	TRIGGER_AUDITORIA	\N
44	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-08 14:51:53.728471	TRIGGER_AUDITORIA	\N
45	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-08 15:43:37.631565	TRIGGER_AUDITORIA	\N
46	neondb_owner	::1	UPDATE	seguridad.usuarios	16	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-08 16:59:23.444949	TRIGGER_AUDITORIA	\N
48	neondb_owner	::1	UPDATE	seguridad.usuarios	16	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-08 17:14:21.493272	TRIGGER_AUDITORIA	\N
49	chavezvargasluisjesus@gmail.com	::1	INSERT	clinica.medicos	13	\N	{"activo": true, "nombres": "Luis Jesus", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1775690159/centro-medico/medicos/t7znb1qlig4mawtwp8oh.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 13, "especialidad": "Pediatría", "apellido_materno": "Chávez", "apellido_paterno": "Luis", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-08 17:16:34.477843	TRIGGER_AUDITORIA	\N
50	chavezvargasluisjesus@gmail.com	::1	UPDATE	clinica.medicos	13	{"activo": true, "nombres": "Luis Jesus", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1775690159/centro-medico/medicos/t7znb1qlig4mawtwp8oh.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 13, "especialidad": "Pediatría", "apellido_materno": "Chávez", "apellido_paterno": "Luis", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": false, "nombres": "Luis Jesus", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1775690159/centro-medico/medicos/t7znb1qlig4mawtwp8oh.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 13, "especialidad": "Pediatría", "apellido_materno": "Chávez", "apellido_paterno": "Luis", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-08 17:16:56.491427	TRIGGER_AUDITORIA	\N
51	chavezvargasluisjesus@gmail.com	::1	UPDATE	clinica.medicos	13	{"activo": false, "nombres": "Luis Jesus", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1775690159/centro-medico/medicos/t7znb1qlig4mawtwp8oh.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 13, "especialidad": "Pediatría", "apellido_materno": "Chávez", "apellido_paterno": "Luis", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": true, "nombres": "Luis Jesus", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1775690159/centro-medico/medicos/t7znb1qlig4mawtwp8oh.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 13, "especialidad": "Pediatría", "apellido_materno": "Chávez", "apellido_paterno": "Luis", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-08 17:17:07.250587	TRIGGER_AUDITORIA	\N
52	chavezvargasluisjesus@gmail.com	::1	UPDATE	clinica.servicios	16	{"activo": true, "texto_alt": "Doctor midiendo la estatura de un adolescente en la pared", "ubicacion": "Consultorio 210", "url_image": "noimage", "descripcion": "Tratamiento de diabetes infantil, problemas de tiroides y trastornos del crecimiento.", "diseno_tipo": "card_standard", "id_servicio": 16, "titulo_servicio": "Endocrinología y Crecimiento"}	{"activo": false, "texto_alt": "Doctor midiendo la estatura de un adolescente en la pared", "ubicacion": "Consultorio 210", "url_image": "noimage", "descripcion": "Tratamiento de diabetes infantil, problemas de tiroides y trastornos del crecimiento.", "diseno_tipo": "card_standard", "id_servicio": 16, "titulo_servicio": "Endocrinología y Crecimiento"}	2026-04-08 17:17:42.678422	TRIGGER_AUDITORIA	\N
53	chavezvargasluisjesus@gmail.com	::1	UPDATE	academia.cursos	16	{"costo": 110.00, "activo": true, "horario": "Viernes 15:00 - 16:30", "id_curso": 16, "categoria": "Inteligencia Emocional", "fecha_fin": "2026-05-29", "modalidad": "presencial", "ubicacion": "Sala de Psicología Infantil", "dirigido_a": "niños", "cupo_maximo": 12, "descripcion": "Curso lúdico donde niños aprenden a identificar, nombrar y gestionar sus emociones básicas: alegría, tristeza, enojo, miedo.", "fecha_inicio": "2026-04-10", "titulo_curso": "Inteligencia Emocional para Niños: Reconociendo Mis Emociones", "id_instructor": null, "cupos_ocupados": 9, "url_imagen_portada": "/images/cursos/emociones_niños.jpg"}	{"costo": 110.00, "activo": true, "horario": "Viernes 15:00 - 16:30", "id_curso": 16, "categoria": "Inteligencia", "fecha_fin": "2026-05-29", "modalidad": "presencial", "ubicacion": "Sala de Psicología Infantil", "dirigido_a": "niños", "cupo_maximo": 12, "descripcion": "Curso lúdico donde niños aprenden a identificar, nombrar y gestionar sus emociones básicas: alegría, tristeza, enojo, miedo.", "fecha_inicio": "2026-04-10", "titulo_curso": "Inteligencia Emocional para Niños: Reconociendo Mis Emociones", "id_instructor": null, "cupos_ocupados": 9, "url_imagen_portada": "/images/cursos/emociones_niños.jpg"}	2026-04-08 17:19:32.9313	TRIGGER_AUDITORIA	\N
54	chavezvargasluisjesus@gmail.com	::1	UPDATE	academia.cursos	17	{"costo": 95.00, "activo": true, "horario": "Jueves 18:00 - 19:30", "id_curso": 17, "categoria": "Inteligencia Emocional", "fecha_fin": "2026-06-11", "modalidad": "en_linea", "ubicacion": "Clase Virtual en Vivo", "dirigido_a": "adolescentes", "cupo_maximo": 25, "descripcion": "Curso práctico con técnicas de relajación, mindfulness y herramientas para manejar la presión académica y social.", "fecha_inicio": "2026-04-16", "titulo_curso": "Gestión del Estrés y Ansiedad en Adolescentes", "id_instructor": null, "cupos_ocupados": 17, "url_imagen_portada": "/images/cursos/gestion_estres.jpg"}	{"costo": 95.00, "activo": false, "horario": "Jueves 18:00 - 19:30", "id_curso": 17, "categoria": "Inteligencia Emocional", "fecha_fin": "2026-06-11", "modalidad": "en_linea", "ubicacion": "Clase Virtual en Vivo", "dirigido_a": "adolescentes", "cupo_maximo": 25, "descripcion": "Curso práctico con técnicas de relajación, mindfulness y herramientas para manejar la presión académica y social.", "fecha_inicio": "2026-04-16", "titulo_curso": "Gestión del Estrés y Ansiedad en Adolescentes", "id_instructor": null, "cupos_ocupados": 17, "url_imagen_portada": "/images/cursos/gestion_estres.jpg"}	2026-04-08 17:19:50.278926	TRIGGER_AUDITORIA	\N
137	jesushfernandezh@gmail.com	127.0.0.1	INSERT	clinica.medicos	16	\N	{"activo": true, "nombres": "María Fernanda", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320570/centro-medico/medicos/etxx4kz9cbpda4wecvcf.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 16, "especialidad": "Neurología Pediátrica", "apellido_materno": "Ruiz", "apellido_paterno": "López", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-16 00:22:54.156276	TRIGGER_AUDITORIA	\N
55	chavezvargasluisjesus@gmail.com	::1	UPDATE	academia.cursos	16	{"costo": 110.00, "activo": true, "horario": "Viernes 15:00 - 16:30", "id_curso": 16, "categoria": "Inteligencia", "fecha_fin": "2026-05-29", "modalidad": "presencial", "ubicacion": "Sala de Psicología Infantil", "dirigido_a": "niños", "cupo_maximo": 12, "descripcion": "Curso lúdico donde niños aprenden a identificar, nombrar y gestionar sus emociones básicas: alegría, tristeza, enojo, miedo.", "fecha_inicio": "2026-04-10", "titulo_curso": "Inteligencia Emocional para Niños: Reconociendo Mis Emociones", "id_instructor": null, "cupos_ocupados": 9, "url_imagen_portada": "/images/cursos/emociones_niños.jpg"}	{"costo": 110.00, "activo": false, "horario": "Viernes 15:00 - 16:30", "id_curso": 16, "categoria": "Inteligencia", "fecha_fin": "2026-05-29", "modalidad": "presencial", "ubicacion": "Sala de Psicología Infantil", "dirigido_a": "niños", "cupo_maximo": 12, "descripcion": "Curso lúdico donde niños aprenden a identificar, nombrar y gestionar sus emociones básicas: alegría, tristeza, enojo, miedo.", "fecha_inicio": "2026-04-10", "titulo_curso": "Inteligencia Emocional para Niños: Reconociendo Mis Emociones", "id_instructor": null, "cupos_ocupados": 9, "url_imagen_portada": "/images/cursos/emociones_niños.jpg"}	2026-04-08 17:19:52.830924	TRIGGER_AUDITORIA	\N
56	chavezvargasluisjesus@gmail.com	::1	UPDATE	academia.cursos	17	{"costo": 95.00, "activo": false, "horario": "Jueves 18:00 - 19:30", "id_curso": 17, "categoria": "Inteligencia Emocional", "fecha_fin": "2026-06-11", "modalidad": "en_linea", "ubicacion": "Clase Virtual en Vivo", "dirigido_a": "adolescentes", "cupo_maximo": 25, "descripcion": "Curso práctico con técnicas de relajación, mindfulness y herramientas para manejar la presión académica y social.", "fecha_inicio": "2026-04-16", "titulo_curso": "Gestión del Estrés y Ansiedad en Adolescentes", "id_instructor": null, "cupos_ocupados": 17, "url_imagen_portada": "/images/cursos/gestion_estres.jpg"}	{"costo": 95.00, "activo": true, "horario": "Jueves 18:00 - 19:30", "id_curso": 17, "categoria": "Inteligencia Emocional", "fecha_fin": "2026-06-11", "modalidad": "en_linea", "ubicacion": "Clase Virtual en Vivo", "dirigido_a": "adolescentes", "cupo_maximo": 25, "descripcion": "Curso práctico con técnicas de relajación, mindfulness y herramientas para manejar la presión académica y social.", "fecha_inicio": "2026-04-16", "titulo_curso": "Gestión del Estrés y Ansiedad en Adolescentes", "id_instructor": null, "cupos_ocupados": 17, "url_imagen_portada": "/images/cursos/gestion_estres.jpg"}	2026-04-08 17:19:54.520174	TRIGGER_AUDITORIA	\N
57	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	16	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-08 17:25:28.01173	TRIGGER_AUDITORIA	\N
58	chavezvargasluisjesus@gmail.com	127.0.0.1	UPDATE	seguridad.usuarios	16	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-08 17:31:18.611199	TRIGGER_AUDITORIA	\N
59	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	16	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-08 17:31:35.924986	TRIGGER_AUDITORIA	\N
60	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-09 13:23:54.243116	TRIGGER_AUDITORIA	\N
138	jesushfernandezh@gmail.com	127.0.0.1	INSERT	clinica.medicos	17	\N	{"activo": true, "nombres": "Carlos Eduardo", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320629/centro-medico/medicos/ocgpykmtxctksi7t88gq.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 17, "especialidad": "Gastroenterología Pediátrica", "apellido_materno": "Torres", "apellido_paterno": "Martínez", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-16 00:23:54.8	TRIGGER_AUDITORIA	\N
61	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	13	{"id": 13, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfh123@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$e4daBPIwI6SeF7BAlAKutuMKyb3cSLs6XNYrOJvdd0l3Xde0J7y.2", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Fernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 13, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfh123@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$e4daBPIwI6SeF7BAlAKutuMKyb3cSLs6XNYrOJvdd0l3Xde0J7y.2", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Fernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-09 23:43:53.650864	TRIGGER_AUDITORIA	\N
62	neondb_owner	::1	UPDATE	seguridad.usuarios	13	{"id": 13, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfh123@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$e4daBPIwI6SeF7BAlAKutuMKyb3cSLs6XNYrOJvdd0l3Xde0J7y.2", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Fernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 13, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfh123@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$e4daBPIwI6SeF7BAlAKutuMKyb3cSLs6XNYrOJvdd0l3Xde0J7y.2", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Fernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-10 00:29:30.514057	TRIGGER_AUDITORIA	\N
63	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-10 00:45:20.02359	TRIGGER_AUDITORIA	\N
64	neondb_owner	::1	UPDATE	seguridad.usuarios	13	{"id": 13, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfh123@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$e4daBPIwI6SeF7BAlAKutuMKyb3cSLs6XNYrOJvdd0l3Xde0J7y.2", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Fernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 13, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfh123@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$e4daBPIwI6SeF7BAlAKutuMKyb3cSLs6XNYrOJvdd0l3Xde0J7y.2", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Fernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-10 00:46:47.649667	TRIGGER_AUDITORIA	\N
65	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-10 11:38:08.345319	TRIGGER_AUDITORIA	\N
66	neondb_owner	::1	UPDATE	seguridad.usuarios	3	{"id": 3, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$Zw869fxEHny1dVA8zZiqK.S7ry4g5mtPFRQ/pWTKq1MCsoMRRH2Ry", "reset_token": "2eb109f1547fe8556839dedffd4ccd113c73c0bb6cd41ce5c410030ac83a9bdf", "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": "2025-12-01T00:29:20.02"}	{"id": 3, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$Zw869fxEHny1dVA8zZiqK.S7ry4g5mtPFRQ/pWTKq1MCsoMRRH2Ry", "reset_token": "2eb109f1547fe8556839dedffd4ccd113c73c0bb6cd41ce5c410030ac83a9bdf", "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": "2025-12-01T00:29:20.02"}	2026-04-10 11:40:31.397431	TRIGGER_AUDITORIA	\N
146	jesushfernandezh@gmail.com	127.0.0.1	UPDATE	clinica.medicos	15	{"activo": false, "nombres": "Luis Alberto", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320501/centro-medico/medicos/lshy2gkqlnn8dtefcivp.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 15, "especialidad": "Pediatra", "apellido_materno": "Gómez", "apellido_paterno": "Hernández", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": true, "nombres": "Luis Alberto", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320501/centro-medico/medicos/lshy2gkqlnn8dtefcivp.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 15, "especialidad": "Pediatra", "apellido_materno": "Gómez", "apellido_paterno": "Hernández", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-16 08:38:25.54778	TRIGGER_AUDITORIA	\N
67	jesushfernandezh@gmail.com	::1	UPDATE	seguridad.usuarios	16	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-10 11:40:46.459549	TRIGGER_AUDITORIA	\N
68	neondb_owner	::1	UPDATE	seguridad.usuarios	3	{"id": 3, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$Zw869fxEHny1dVA8zZiqK.S7ry4g5mtPFRQ/pWTKq1MCsoMRRH2Ry", "reset_token": "2eb109f1547fe8556839dedffd4ccd113c73c0bb6cd41ce5c410030ac83a9bdf", "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": "2025-12-01T00:29:20.02"}	{"id": 3, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$Zw869fxEHny1dVA8zZiqK.S7ry4g5mtPFRQ/pWTKq1MCsoMRRH2Ry", "reset_token": "2eb109f1547fe8556839dedffd4ccd113c73c0bb6cd41ce5c410030ac83a9bdf", "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": "2025-12-01T00:29:20.02"}	2026-04-10 11:43:48.477391	TRIGGER_AUDITORIA	\N
69	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-10 11:45:11.663022	TRIGGER_AUDITORIA	\N
70	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	16	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-10 13:57:05.608284	TRIGGER_AUDITORIA	\N
71	neondb_owner	::1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-12 13:41:26.347792	TRIGGER_AUDITORIA	\N
72	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-12 13:54:25.692545	TRIGGER_AUDITORIA	\N
147	jesushfernandezh@gmail.com	127.0.0.1	UPDATE	clinica.medicos	16	{"activo": true, "nombres": "María Fernanda", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320570/centro-medico/medicos/etxx4kz9cbpda4wecvcf.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 16, "especialidad": "Neurología Pediátrica", "apellido_materno": "Ruiz", "apellido_paterno": "López", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": true, "nombres": "María Fernanda", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320570/centro-medico/medicos/etxx4kz9cbpda4wecvcf.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 16, "especialidad": "Pediatra", "apellido_materno": "Ruiz", "apellido_paterno": "López", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-16 08:38:46.004581	TRIGGER_AUDITORIA	\N
73	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	16	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 16, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-12 17:20:50.718559	TRIGGER_AUDITORIA	\N
74	neondb_owner	::1	DELETE	seguridad.usuarios	19	{"id": 19, "edad": 20, "sexo": "masculino", "activo": true, "correo": "patofdez4@gmail.com", "nombre": "Pato", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$okqgOFriWtTBu051tzb7n.bCIM8Op414UeSVbWHPInC5FJV95u7Wu", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	\N	2026-04-12 22:56:22.78607	TRIGGER_AUDITORIA	\N
75	neondb_owner	::1	DELETE	seguridad.usuarios	13	{"id": 13, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfh123@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$e4daBPIwI6SeF7BAlAKutuMKyb3cSLs6XNYrOJvdd0l3Xde0J7y.2", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Fernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	\N	2026-04-12 22:56:22.78607	TRIGGER_AUDITORIA	\N
76	neondb_owner	::1	DELETE	seguridad.usuarios	14	{"id": 14, "edad": 18, "sexo": "masculino", "activo": true, "correo": "j@gmail.com", "nombre": "j", "rol_id": 1, "telefono": "1234567890", "contrasena": "$2b$10$icHzpXAZkLRh09v9IgDn/upekYA.IhUzx3m9E5wQQsejJaDsWvSaS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "j", "apellidoPaterno": "j", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	\N	2026-04-12 22:56:22.78607	TRIGGER_AUDITORIA	\N
77	neondb_owner	::1	DELETE	seguridad.usuarios	3	{"id": 3, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$Zw869fxEHny1dVA8zZiqK.S7ry4g5mtPFRQ/pWTKq1MCsoMRRH2Ry", "reset_token": "2eb109f1547fe8556839dedffd4ccd113c73c0bb6cd41ce5c410030ac83a9bdf", "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": "2025-12-01T00:29:20.02"}	\N	2026-04-12 22:56:22.78607	TRIGGER_AUDITORIA	\N
78	neondb_owner	::1	DELETE	seguridad.usuarios	15	{"id": 15, "edad": 20, "sexo": "femenino", "activo": true, "correo": "20230015@uthh.edu.mx", "nombre": "Prueba_ED", "rol_id": 1, "telefono": "7594856452", "contrasena": "$2b$10$ekle/mrRdPOspslN4.JywuwfEKMTAd54sG6mwABM7laIhWEM5EH2a", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Prueba11", "apellidoPaterno": "Prueba1", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	\N	2026-04-12 22:56:22.78607	TRIGGER_AUDITORIA	\N
79	neondb_owner	::1	DELETE	seguridad.usuarios	1	{"id": 1, "edad": 30, "sexo": "Masculino", "activo": true, "correo": "admin@test.com", "nombre": "Admin", "rol_id": 2, "telefono": "0000000000", "contrasena": "$2b$10$Pj/8.W.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Principal", "apellidoPaterno": "Sistema", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	\N	2026-04-12 22:56:22.78607	TRIGGER_AUDITORIA	\N
80	neondb_owner	::1	DELETE	seguridad.usuarios	11	{"id": 11, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	\N	2026-04-12 22:56:22.78607	TRIGGER_AUDITORIA	\N
81	neondb_owner	::1	INSERT	seguridad.usuarios	20	\N	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 1, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-12 22:58:20.315697	TRIGGER_AUDITORIA	\N
82	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 1, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 1, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-12 22:58:28.943928	TRIGGER_AUDITORIA	\N
83	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 1, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-12 22:59:12.0681	TRIGGER_AUDITORIA	\N
84	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-12 22:59:29.861904	TRIGGER_AUDITORIA	\N
85	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 05:46:02.464296	TRIGGER_AUDITORIA	\N
87	neondb_owner	::1	INSERT	seguridad.usuarios	23	\N	{"id": 23, "edad": 29, "sexo": "Femenino", "activo": true, "correo": "laura.mendez@centromedicopichardo.com", "nombre": "Laura", "rol_id": 1, "telefono": "7715554433", "contrasena": "LauraPedi2026", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Ríos", "apellidoPaterno": "Méndez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 06:06:27.409585	TRIGGER_AUDITORIA	\N
88	neondb_owner	::1	INSERT	seguridad.usuarios	24	\N	{"id": 24, "edad": 38, "sexo": "Masculino", "activo": true, "correo": "roberto.salazar@centromedicopichardo.com", "nombre": "Roberto", "rol_id": 1, "telefono": "7716667788", "contrasena": "RobSoporte26", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": true, "apellidoMaterno": "Gómez", "apellidoPaterno": "Salazar", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 06:06:27.409585	TRIGGER_AUDITORIA	\N
89	neondb_owner	::1	UPDATE	seguridad.usuarios	23	{"id": 23, "edad": 29, "sexo": "Femenino", "activo": true, "correo": "laura.mendez@centromedicopichardo.com", "nombre": "Laura", "rol_id": 1, "telefono": "7715554433", "contrasena": "LauraPedi2026", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Ríos", "apellidoPaterno": "Méndez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 23, "edad": 29, "sexo": "Femenino", "activo": true, "correo": "laura.mendez@centromedicopichardo.com", "nombre": "Laura", "rol_id": 1, "telefono": "7715554433", "contrasena": "LauraPedi2026", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Ríos", "apellidoPaterno": "Méndez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	2026-04-13 06:09:39.920078	TRIGGER_AUDITORIA	\N
90	neondb_owner	::1	UPDATE	seguridad.usuarios	23	{"id": 23, "edad": 29, "sexo": "Femenino", "activo": true, "correo": "laura.mendez@centromedicopichardo.com", "nombre": "Laura", "rol_id": 1, "telefono": "7715554433", "contrasena": "LauraPedi2026", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Ríos", "apellidoPaterno": "Méndez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	{"id": 23, "edad": 29, "sexo": "Femenino", "activo": true, "correo": "laura.mendez@centromedicopichardo.com", "nombre": "Laura", "rol_id": 1, "telefono": "7715554433", "contrasena": "LauraPedi2026", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Ríos", "apellidoPaterno": "Méndez", "bloqueado_hasta": null, "intentos_fallidos": 2, "reset_token_expiry": null}	2026-04-13 06:09:47.579012	TRIGGER_AUDITORIA	\N
91	neondb_owner	::1	INSERT	seguridad.usuarios	25	\N	{"id": 25, "edad": 20, "sexo": "masculino", "activo": true, "correo": "20230003@uthh.edu.mx", "nombre": "Luis ", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$n2EbnwB12..dWY92YefHw.Yh0XYjgLM87qqJOBeVVEE3mWtXKwQl.", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 06:11:11.028257	TRIGGER_AUDITORIA	\N
92	neondb_owner	::1	UPDATE	seguridad.usuarios	25	{"id": 25, "edad": 20, "sexo": "masculino", "activo": true, "correo": "20230003@uthh.edu.mx", "nombre": "Luis ", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$n2EbnwB12..dWY92YefHw.Yh0XYjgLM87qqJOBeVVEE3mWtXKwQl.", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 25, "edad": 20, "sexo": "masculino", "activo": true, "correo": "20230003@uthh.edu.mx", "nombre": "Luis ", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$n2EbnwB12..dWY92YefHw.Yh0XYjgLM87qqJOBeVVEE3mWtXKwQl.", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 06:11:27.243987	TRIGGER_AUDITORIA	\N
93	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 06:11:51.730109	TRIGGER_AUDITORIA	\N
94	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 06:12:49.596545	TRIGGER_AUDITORIA	\N
95	neondb_owner	127.0.0.1	INSERT	seguridad.usuarios	26	\N	{"id": 26, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus22@gmail.com", "nombre": "Luis", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$lI.UBXO8danZGHre3k8WIuCvAba7IlUzNMwfaYdsA3bZJjEkD0m2q", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 06:16:10.771508	TRIGGER_AUDITORIA	\N
96	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	26	{"id": 26, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus22@gmail.com", "nombre": "Luis", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$lI.UBXO8danZGHre3k8WIuCvAba7IlUzNMwfaYdsA3bZJjEkD0m2q", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 26, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus22@gmail.com", "nombre": "Luis", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$lI.UBXO8danZGHre3k8WIuCvAba7IlUzNMwfaYdsA3bZJjEkD0m2q", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 06:16:18.75876	TRIGGER_AUDITORIA	\N
97	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 06:16:42.142774	TRIGGER_AUDITORIA	\N
98	neondb_owner	127.0.0.1	INSERT	seguridad.usuarios	27	\N	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 09:12:00.072375	TRIGGER_AUDITORIA	\N
148	jesushfernandezh@gmail.com	127.0.0.1	UPDATE	clinica.medicos	17	{"activo": true, "nombres": "Carlos Eduardo", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320629/centro-medico/medicos/ocgpykmtxctksi7t88gq.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 17, "especialidad": "Gastroenterología Pediátrica", "apellido_materno": "Torres", "apellido_paterno": "Martínez", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": true, "nombres": "Carlos Eduardo", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320629/centro-medico/medicos/ocgpykmtxctksi7t88gq.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 17, "especialidad": "Pediatra", "apellido_materno": "Torres", "apellido_paterno": "Martínez", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-16 08:38:56.436445	TRIGGER_AUDITORIA	\N
99	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 09:12:04.74099	TRIGGER_AUDITORIA	\N
100	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 09:13:29.052744	TRIGGER_AUDITORIA	\N
101	chavezvargasluisjesus@gmail.com	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 09:13:39.628085	TRIGGER_AUDITORIA	\N
102	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 09:13:51.640714	TRIGGER_AUDITORIA	\N
103	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 09:17:07.510226	TRIGGER_AUDITORIA	\N
104	jesushfernandezh@gmail.com	127.0.0.1	INSERT	clinica.medicos	14	\N	{"activo": true, "nombres": "Francisco Javier", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776093395/centro-medico/medicos/xbroogr1fo7lbap0z8mu.jpg", "direccion": "Calle Alcatraz colonia los prados a cien metros de la asociación del jubilado y pensionado sobre la terracería centro médico Pichardo", "id_medico": 14, "especialidad": "Pediatra", "apellido_materno": "Pichardo", "apellido_paterno": "Moreno", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-13 09:18:40.472614	TRIGGER_AUDITORIA	\N
105	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 09:20:33.068443	TRIGGER_AUDITORIA	\N
106	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 09:32:17.465951	TRIGGER_AUDITORIA	\N
107	jesushfernandezh@gmail.com	127.0.0.1	INSERT	clinica.servicios	1	\N	{"activo": true, "texto_alt": "Consulta Pediátrica Integral", "ubicacion": "Centro Médico Pichardo", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776095383/centro-medico/servicios/fzoybjkbmf5l9i2l9yn5.png", "descripcion": "La Consulta Pediátrica Integral es un servicio médico enfocado en la atención preventiva, diagnóstica y de seguimiento de la salud infantil, desde recién nacidos hasta adolescentes. Incluye la evaluación del crecimiento y desarrollo, control de vacunación, detección oportuna de enfermedades, orientación nutricional y asesoramiento a padres sobre el cuidado general del niño. Este servicio busca garantizar un desarrollo saludable mediante revisiones periódicas y atención personalizada por parte de un médico pediatra.", "diseno_tipo": "vertical", "id_servicio": 1, "titulo_servicio": "Consulta Pediátrica Integral"}	2026-04-13 09:49:48.50368	TRIGGER_AUDITORIA	\N
108	jesushfernandezh@gmail.com	::1	INSERT	clinica.servicios	2	\N	{"activo": true, "texto_alt": "Vacunación Infantil", "ubicacion": "Centro Médico Pichardo", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776095546/centro-medico/servicios/dlvolybbj49hk0kdchci.png", "descripcion": "Aplicación de vacunas conforme al esquema nacional e internacional, garantizando la protección contra enfermedades comunes en la infancia y llevando un control actualizado del historial de vacunación.", "diseno_tipo": "vertical", "id_servicio": 2, "titulo_servicio": "Vacunación Infantil"}	2026-04-13 09:52:33.484216	TRIGGER_AUDITORIA	\N
109	jesushfernandezh@gmail.com	127.0.0.1	INSERT	clinica.servicios	3	\N	{"activo": true, "texto_alt": "Urgencias Pediátricas", "ubicacion": "Centro Médico Pichardo", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776096008/centro-medico/servicios/zgxpcoejgfcbdkj1jpk5.png", "descripcion": "Atención inmediata para niños con síntomas agudos como fiebre alta, infecciones, golpes, caídas o cualquier situación que requiera intervención médica rápida.", "diseno_tipo": "vertical", "id_servicio": 3, "titulo_servicio": "Urgencias Pediátricas"}	2026-04-13 10:00:20.028778	TRIGGER_AUDITORIA	\N
110	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 10:01:02.227959	TRIGGER_AUDITORIA	\N
111	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 10:02:39.403575	TRIGGER_AUDITORIA	\N
112	neondb_owner	127.0.0.1	INSERT	seguridad.usuarios	28	\N	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 10:44:01.569802	TRIGGER_AUDITORIA	\N
113	neondb_owner	::1	UPDATE	seguridad.usuarios	28	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 10:45:29.610878	TRIGGER_AUDITORIA	\N
114	neondb_owner	::1	UPDATE	seguridad.usuarios	28	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 10:45:55.274664	TRIGGER_AUDITORIA	\N
115	neondb_owner	::1	UPDATE	seguridad.usuarios	25	{"id": 25, "edad": 20, "sexo": "masculino", "activo": true, "correo": "20230003@uthh.edu.mx", "nombre": "Luis ", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$n2EbnwB12..dWY92YefHw.Yh0XYjgLM87qqJOBeVVEE3mWtXKwQl.", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 25, "edad": 20, "sexo": "masculino", "activo": true, "correo": "20230003@uthh.edu.mx", "nombre": "Luis ", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$n2EbnwB12..dWY92YefHw.Yh0XYjgLM87qqJOBeVVEE3mWtXKwQl.", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 10:46:31.488056	TRIGGER_AUDITORIA	\N
116	neondb_owner	::1	UPDATE	seguridad.usuarios	26	{"id": 26, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus22@gmail.com", "nombre": "Luis", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$lI.UBXO8danZGHre3k8WIuCvAba7IlUzNMwfaYdsA3bZJjEkD0m2q", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 26, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus22@gmail.com", "nombre": "Luis", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$lI.UBXO8danZGHre3k8WIuCvAba7IlUzNMwfaYdsA3bZJjEkD0m2q", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 10:48:36.840679	TRIGGER_AUDITORIA	\N
117	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	26	{"id": 26, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus22@gmail.com", "nombre": "Luis", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$lI.UBXO8danZGHre3k8WIuCvAba7IlUzNMwfaYdsA3bZJjEkD0m2q", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 26, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus22@gmail.com", "nombre": "Luis", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$lI.UBXO8danZGHre3k8WIuCvAba7IlUzNMwfaYdsA3bZJjEkD0m2q", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 10:49:11.546774	TRIGGER_AUDITORIA	\N
118	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 10:49:12.402234	TRIGGER_AUDITORIA	\N
119	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	25	{"id": 25, "edad": 20, "sexo": "masculino", "activo": true, "correo": "20230003@uthh.edu.mx", "nombre": "Luis ", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$n2EbnwB12..dWY92YefHw.Yh0XYjgLM87qqJOBeVVEE3mWtXKwQl.", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 25, "edad": 20, "sexo": "masculino", "activo": true, "correo": "20230003@uthh.edu.mx", "nombre": "Luis ", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$n2EbnwB12..dWY92YefHw.Yh0XYjgLM87qqJOBeVVEE3mWtXKwQl.", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 10:50:13.052215	TRIGGER_AUDITORIA	\N
120	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	2026-04-13 10:51:17.00871	TRIGGER_AUDITORIA	\N
121	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 10:51:22.2287	TRIGGER_AUDITORIA	\N
122	neondb_owner	::1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-13 13:44:47.09727	TRIGGER_AUDITORIA	\N
123	neondb_owner	::1	UPDATE	seguridad.usuarios	28	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	2026-04-15 19:48:35.363067	TRIGGER_AUDITORIA	\N
124	neondb_owner	::1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-15 19:48:42.197816	TRIGGER_AUDITORIA	\N
125	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-15 21:29:55.962198	TRIGGER_AUDITORIA	\N
126	neondb_owner	::1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-15 22:10:10.187691	TRIGGER_AUDITORIA	\N
127	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-15 23:35:10.532184	TRIGGER_AUDITORIA	\N
128	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	28	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-15 23:36:22.902021	TRIGGER_AUDITORIA	\N
129	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-16 00:02:21.876092	TRIGGER_AUDITORIA	\N
130	neondb_owner	::1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-16 00:03:27.60886	TRIGGER_AUDITORIA	\N
131	jesushfernandezh@gmail.com	127.0.0.1	INSERT	clinica.servicios	4	\N	{"activo": true, "texto_alt": "Nutrición Pediátrica", "ubicacion": "Centro Médico Pichardo", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776319903/centro-medico/servicios/elei0kui4v9jf7xqgdrm.png", "descripcion": "Evaluación del estado nutricional del niño y elaboración de planes alimenticios personalizados para promover un crecimiento saludable.", "diseno_tipo": "vertical", "id_servicio": 4, "titulo_servicio": "Nutrición Pediátrica"}	2026-04-16 00:11:47.657493	TRIGGER_AUDITORIA	\N
132	jesushfernandezh@gmail.com	127.0.0.1	INSERT	clinica.servicios	5	\N	{"activo": true, "texto_alt": "Estimulación Temprana", "ubicacion": "Centro Médico Pichardo", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776319972/centro-medico/servicios/ztcpfzrtzxnmov1abkg7.png", "descripcion": "Programas diseñados para favorecer el desarrollo cognitivo, motor y emocional en bebés y niños pequeños.", "diseno_tipo": "vertical", "id_servicio": 5, "titulo_servicio": "Estimulación Temprana"}	2026-04-16 00:12:56.546725	TRIGGER_AUDITORIA	\N
133	jesushfernandezh@gmail.com	127.0.0.1	INSERT	clinica.servicios	6	\N	{"activo": true, "texto_alt": "Psicología Infantil", "ubicacion": "Centro Médico Pichardo", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320063/centro-medico/servicios/fd9v07axcknd56jujjiy.png", "descripcion": "Apoyo emocional y conductual para niños con problemas de aprendizaje, conducta, ansiedad o adaptación.", "diseno_tipo": "vertical", "id_servicio": 6, "titulo_servicio": "Psicología Infantil"}	2026-04-16 00:14:26.754122	TRIGGER_AUDITORIA	\N
134	jesushfernandezh@gmail.com	127.0.0.1	INSERT	clinica.servicios	7	\N	{"activo": true, "texto_alt": "Odontopediatría", "ubicacion": "Centro Médico Pichardo", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320131/centro-medico/servicios/rxtxsw4jomkotio58ok7.png", "descripcion": "Cuidado dental especializado para niños, incluyendo prevención, limpieza y tratamiento de caries.", "diseno_tipo": "vertical", "id_servicio": 7, "titulo_servicio": "Odontopediatría"}	2026-04-16 00:15:42.599915	TRIGGER_AUDITORIA	\N
135	jesushfernandezh@gmail.com	127.0.0.1	INSERT	clinica.servicios	8	\N	{"activo": true, "texto_alt": "Telemedicina Pediátrica", "ubicacion": "Centro Médico Pichardo", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320232/centro-medico/servicios/edoub8spohlbyexptf3a.png", "descripcion": "Consultas médicas a distancia para orientación, seguimiento de tratamientos y atención de casos no urgentes.", "diseno_tipo": "vertical", "id_servicio": 8, "titulo_servicio": "Telemedicina Pediátrica"}	2026-04-16 00:17:18.048148	TRIGGER_AUDITORIA	\N
136	jesushfernandezh@gmail.com	127.0.0.1	INSERT	clinica.medicos	15	\N	{"activo": true, "nombres": "Luis Alberto", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320501/centro-medico/medicos/lshy2gkqlnn8dtefcivp.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 15, "especialidad": "Cardiología Pediátrica", "apellido_materno": "Gómez", "apellido_paterno": "Hernández", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-16 00:21:44.767851	TRIGGER_AUDITORIA	\N
139	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-16 00:46:07.51831	TRIGGER_AUDITORIA	\N
140	jesushfernandezh@gmail.com	127.0.0.1	UPDATE	clinica.nosotros	1	{"id": 1, "mision": "Proveer atención médica pediátrica de la más alta calidad, centrada en la calidez humana y la prevención.dsfsd", "vision": "Ser el centro pediátrico de referencia regional, reconocido por la excelencia y el trato humano.sdfds", "valores": ["Humanidad", "Excelencia", "Confianza", "Innovación", "Respeto", "Honestidad"], "compromiso": "Nuestro equipo está unido por el mismo juramento: ofrecer lo mejor de nosotros en cada consulta para asegurar su tranquilidad.dfsfs", "url_imagen": "", "nuestra_historia": "Fundado hace más de una década, el Centro Médico Pichardo nació de la convicción de que los niños merecen cuidado especializado.\\n"}	{"id": 1, "mision": "Proveer atención médica pediátrica de la más alta calidad, centrada en la calidez humana y la prevención.dsfsd", "vision": "Ser el centro pediátrico de referencia regional, reconocido por la excelencia y el trato humano.sdfds", "valores": ["Humanidad", "Excelencia", "Confianza", "Innovación", "Respeto", "Honestidad"], "compromiso": "Nuestro equipo está unido por el mismo juramento: ofrecer lo mejor de nosotros en cada consulta para asegurar su tranquilidad.dfsfs", "url_imagen": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776321991/centro-medico/quienes-somos/vfpzctr5mm56hr3p5ucd.jpg", "nuestra_historia": "Fundado hace más de una década, el Centro Médico Pichardo nació de la convicción de que los niños merecen cuidado especializado.\\n"}	2026-04-16 00:46:35.800316	TRIGGER_AUDITORIA	\N
141	neondb_owner	::1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-16 08:36:39.712331	TRIGGER_AUDITORIA	\N
142	jesushfernandezh@gmail.com	::1	UPDATE	clinica.medicos	15	{"activo": true, "nombres": "Luis Alberto", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320501/centro-medico/medicos/lshy2gkqlnn8dtefcivp.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 15, "especialidad": "Cardiología Pediátrica", "apellido_materno": "Gómez", "apellido_paterno": "Hernández", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": true, "nombres": "Luis Alberto", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320501/centro-medico/medicos/lshy2gkqlnn8dtefcivp.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 15, "especialidad": "Pediatra", "apellido_materno": "Gómez", "apellido_paterno": "Hernández", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-16 08:37:41.216875	TRIGGER_AUDITORIA	\N
143	jesushfernandezh@gmail.com	::1	UPDATE	clinica.medicos	15	{"activo": true, "nombres": "Luis Alberto", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320501/centro-medico/medicos/lshy2gkqlnn8dtefcivp.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 15, "especialidad": "Pediatra", "apellido_materno": "Gómez", "apellido_paterno": "Hernández", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": false, "nombres": "Luis Alberto", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320501/centro-medico/medicos/lshy2gkqlnn8dtefcivp.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 15, "especialidad": "Pediatra", "apellido_materno": "Gómez", "apellido_paterno": "Hernández", "hospital_clinica": "Centro Médico Pichardo"}	2026-04-16 08:37:42.854939	TRIGGER_AUDITORIA	\N
144	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-16 08:37:53.517255	TRIGGER_AUDITORIA	\N
145	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-16 08:37:54.298982	TRIGGER_AUDITORIA	\N
149	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-16 09:32:26.491816	TRIGGER_AUDITORIA	\N
150	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-04-16 09:58:31.15072	TRIGGER_AUDITORIA	\N
151	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-10 17:54:17.944116	TRIGGER_AUDITORIA	\N
152	neondb_owner	::1	UPDATE	seguridad.usuarios	28	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	2026-06-22 20:54:16.406475	TRIGGER_AUDITORIA	\N
153	neondb_owner	::1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-22 20:54:28.388665	TRIGGER_AUDITORIA	\N
154	neondb_owner	127.0.0.1	DELETE	seguridad.usuarios	28	{"id": 28, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$C8Bg2CHTzgD7Ck0HgT./NO/A5NytJu30Db01liO.kFpEn//eVxaNq", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	\N	2026-06-26 11:07:43.644578	TRIGGER_AUDITORIA	\N
155	neondb_owner	127.0.0.1	INSERT	seguridad.usuarios	29	\N	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-26 12:26:17.444481	TRIGGER_AUDITORIA	\N
156	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-26 12:26:22.769944	TRIGGER_AUDITORIA	\N
157	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 16:42:43.863949	TRIGGER_AUDITORIA	\N
158	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 16:43:31.294655	TRIGGER_AUDITORIA	\N
159	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	2026-06-28 18:40:37.619397	TRIGGER_AUDITORIA	\N
160	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 18:40:42.496342	TRIGGER_AUDITORIA	\N
161	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 18:45:53.527936	TRIGGER_AUDITORIA	\N
162	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 18:49:54.382492	TRIGGER_AUDITORIA	\N
163	neondb_owner	::1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 18:50:12.485701	TRIGGER_AUDITORIA	\N
164	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 19:04:11.786602	TRIGGER_AUDITORIA	\N
165	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 19:05:50.370236	TRIGGER_AUDITORIA	\N
166	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 19:06:56.649766	TRIGGER_AUDITORIA	\N
167	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 19:11:53.277404	TRIGGER_AUDITORIA	\N
168	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 19:17:05.32525	TRIGGER_AUDITORIA	\N
169	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 19:18:03.376695	TRIGGER_AUDITORIA	\N
170	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 19:26:05.384678	TRIGGER_AUDITORIA	\N
173	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	2026-06-28 19:45:40.112946	TRIGGER_AUDITORIA	\N
174	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 2, "reset_token_expiry": null}	2026-06-28 19:45:45.886715	TRIGGER_AUDITORIA	\N
175	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 2, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 19:45:48.184181	TRIGGER_AUDITORIA	\N
171	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 19:30:12.061077	TRIGGER_AUDITORIA	\N
172	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 19:45:23.92013	TRIGGER_AUDITORIA	\N
176	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 19:55:13.334027	TRIGGER_AUDITORIA	\N
177	chavezvargasluisjesus@gmail.com	127.0.0.1	UPDATE	clinica.servicios	1	{"activo": true, "texto_alt": "Consulta Pediátrica Integral", "ubicacion": "Centro Médico Pichardo", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776095383/centro-medico/servicios/fzoybjkbmf5l9i2l9yn5.png", "descripcion": "La Consulta Pediátrica Integral es un servicio médico enfocado en la atención preventiva, diagnóstica y de seguimiento de la salud infantil, desde recién nacidos hasta adolescentes. Incluye la evaluación del crecimiento y desarrollo, control de vacunación, detección oportuna de enfermedades, orientación nutricional y asesoramiento a padres sobre el cuidado general del niño. Este servicio busca garantizar un desarrollo saludable mediante revisiones periódicas y atención personalizada por parte de un médico pediatra.", "diseno_tipo": "vertical", "id_servicio": 1, "titulo_servicio": "Consulta Pediátrica Integral"}	{"activo": true, "texto_alt": "Servicio actualizado", "ubicacion": "Huejutla de Reyes", "url_image": "/default-service.jpg", "descripcion": "Descripción actualizada del servicio", "diseno_tipo": "vertical", "id_servicio": 1, "titulo_servicio": "Servicio actualizado"}	2026-06-28 19:56:10.521259	TRIGGER_AUDITORIA	\N
178	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	2026-06-28 20:02:50.063487	TRIGGER_AUDITORIA	\N
179	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 1, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 20:02:54.772125	TRIGGER_AUDITORIA	\N
180	sistema	127.0.0.1	UPDATE	clinica.medicos	17	{"activo": true, "nombres": "Carlos Eduardo", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320629/centro-medico/medicos/ocgpykmtxctksi7t88gq.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 17, "especialidad": "Pediatra", "apellido_materno": "Torres", "apellido_paterno": "Martínez", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": false, "nombres": "Carlos Eduardo", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320629/centro-medico/medicos/ocgpykmtxctksi7t88gq.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 17, "especialidad": "Pediatra", "apellido_materno": "Torres", "apellido_paterno": "Martínez", "hospital_clinica": "Centro Médico Pichardo"}	2026-06-28 20:04:41.366631	TRIGGER_AUDITORIA	\N
181	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 20:10:08.529036	TRIGGER_AUDITORIA	\N
182	sistema	127.0.0.1	UPDATE	clinica.medicos	17	{"activo": false, "nombres": "Carlos Eduardo", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320629/centro-medico/medicos/ocgpykmtxctksi7t88gq.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 17, "especialidad": "Pediatra", "apellido_materno": "Torres", "apellido_paterno": "Martínez", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": true, "nombres": "Carlos Eduardo", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320629/centro-medico/medicos/ocgpykmtxctksi7t88gq.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 17, "especialidad": "Pediatra", "apellido_materno": "Torres", "apellido_paterno": "Martínez", "hospital_clinica": "Centro Médico Pichardo"}	2026-06-28 20:10:20.601673	TRIGGER_AUDITORIA	\N
183	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 20:17:14.219344	TRIGGER_AUDITORIA	\N
184	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 20:18:52.109123	TRIGGER_AUDITORIA	\N
185	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 20:29:52.165078	TRIGGER_AUDITORIA	\N
186	neondb_owner	::1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 20:41:01.997792	TRIGGER_AUDITORIA	\N
187	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 20:42:15.626806	TRIGGER_AUDITORIA	\N
188	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 21:16:58.742359	TRIGGER_AUDITORIA	\N
189	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 21:46:47.481757	TRIGGER_AUDITORIA	\N
190	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-28 22:24:12.375994	TRIGGER_AUDITORIA	\N
191	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-06-29 15:24:32.185441	TRIGGER_AUDITORIA	\N
192	neondb_owner	::1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-01 17:35:11.999989	TRIGGER_AUDITORIA	\N
193	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-08 16:42:10.404648	TRIGGER_AUDITORIA	\N
194	chavezvargasluisjesus@gmail.com	::1	UPDATE	clinica.servicios	1	{"activo": true, "texto_alt": "Servicio actualizado", "ubicacion": "Huejutla de Reyes", "url_image": "/default-service.jpg", "descripcion": "Descripción actualizada del servicio", "diseno_tipo": "vertical", "id_servicio": 1, "titulo_servicio": "Servicio actualizado"}	{"activo": false, "texto_alt": "Servicio actualizado", "ubicacion": "Huejutla de Reyes", "url_image": "/default-service.jpg", "descripcion": "Descripción actualizada del servicio", "diseno_tipo": "vertical", "id_servicio": 1, "titulo_servicio": "Servicio actualizado"}	2026-07-08 16:42:40.469443	TRIGGER_AUDITORIA	\N
195	chavezvargasluisjesus@gmail.com	::1	UPDATE	clinica.servicios	2	{"activo": true, "texto_alt": "Vacunación Infantil", "ubicacion": "Centro Médico Pichardo", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776095546/centro-medico/servicios/dlvolybbj49hk0kdchci.png", "descripcion": "Aplicación de vacunas conforme al esquema nacional e internacional, garantizando la protección contra enfermedades comunes en la infancia y llevando un control actualizado del historial de vacunación.", "diseno_tipo": "vertical", "id_servicio": 2, "titulo_servicio": "Vacunación Infantil"}	{"activo": false, "texto_alt": "Vacunación Infantil", "ubicacion": "Centro Médico Pichardo", "url_image": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776095546/centro-medico/servicios/dlvolybbj49hk0kdchci.png", "descripcion": "Aplicación de vacunas conforme al esquema nacional e internacional, garantizando la protección contra enfermedades comunes en la infancia y llevando un control actualizado del historial de vacunación.", "diseno_tipo": "vertical", "id_servicio": 2, "titulo_servicio": "Vacunación Infantil"}	2026-07-08 17:16:03.350191	TRIGGER_AUDITORIA	\N
196	neondb_owner	::1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-10 15:11:48.205028	TRIGGER_AUDITORIA	\N
197	neondb_owner	::1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-15 19:04:23.719676	TRIGGER_AUDITORIA	\N
198	neondb_owner	::1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-15 19:08:12.991402	TRIGGER_AUDITORIA	\N
199	neondb_owner	::1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-15 21:09:43.0894	TRIGGER_AUDITORIA	\N
200	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-15 21:28:06.557877	TRIGGER_AUDITORIA	\N
201	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-15 22:48:49.180053	TRIGGER_AUDITORIA	\N
202	neondb_owner	::1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-15 22:52:56.170095	TRIGGER_AUDITORIA	\N
203	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-15 23:34:31.159621	TRIGGER_AUDITORIA	\N
204	neondb_owner	::1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-15 23:43:07.359526	TRIGGER_AUDITORIA	\N
205	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-15 23:56:58.954902	TRIGGER_AUDITORIA	\N
206	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-17 22:48:32.24151	TRIGGER_AUDITORIA	\N
207	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-17 23:38:04.008856	TRIGGER_AUDITORIA	\N
208	neondb_owner	::1	UPDATE	seguridad.usuarios	29	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 29, "edad": 21, "sexo": "masculino", "activo": true, "correo": "jesusf1705dck@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 12:42:29.24605	TRIGGER_AUDITORIA	\N
209	neondb_owner	::1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 12:46:55.754678	TRIGGER_AUDITORIA	\N
210	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 12:49:45.540819	TRIGGER_AUDITORIA	\N
211	neondb_owner	::1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 12:51:33.905853	TRIGGER_AUDITORIA	\N
212	neondb_owner	::1	UPDATE	seguridad.usuarios	20	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 20, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus@gmail.com", "nombre": "Luis Jesus", "rol_id": 2, "telefono": "7717205433", "contrasena": "$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 12:53:22.707243	TRIGGER_AUDITORIA	\N
213	neondb_owner	127.0.0.1	INSERT	seguridad.usuarios	30	\N	{"id": 30, "edad": 20, "sexo": "masculino", "activo": true, "correo": "patofdez4@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$qM0kF05onObulZPaLmBDsO42d3TwWXxAq9aVW4MewTPpcM58a6Myi", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 13:36:24.505756	TRIGGER_AUDITORIA	\N
214	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	30	{"id": 30, "edad": 20, "sexo": "masculino", "activo": true, "correo": "patofdez4@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$qM0kF05onObulZPaLmBDsO42d3TwWXxAq9aVW4MewTPpcM58a6Myi", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 30, "edad": 20, "sexo": "masculino", "activo": true, "correo": "patofdez4@gmail.com", "nombre": "Jesus", "rol_id": 1, "telefono": "7713039166", "contrasena": "$2b$10$qM0kF05onObulZPaLmBDsO42d3TwWXxAq9aVW4MewTPpcM58a6Myi", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 13:36:36.423142	TRIGGER_AUDITORIA	\N
215	neondb_owner	127.0.0.1	INSERT	seguridad.usuarios	31	\N	{"id": 31, "edad": 50, "sexo": "masculino", "activo": true, "correo": "franciscojaviermorenopichardo@gmail.com", "nombre": "francisco javier", "rol_id": 1, "telefono": "7711408883", "contrasena": "$2b$10$faKBsTmYJPoHGUS2Foj3DO1A6h2Y.F77CAwyL4qqLJuTqcbvh1GOy", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "pichardo", "apellidoPaterno": "moreno", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 13:46:22.485265	TRIGGER_AUDITORIA	\N
216	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	27	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 27, "edad": 20, "sexo": "masculino", "activo": true, "correo": "jesushfernandezh@gmail.com", "nombre": "Jesus", "rol_id": 2, "telefono": "7713039166", "contrasena": "$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Hernandez", "apellidoPaterno": "Fernandez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 13:46:32.513787	TRIGGER_AUDITORIA	\N
217	chavezvargasluisjesus@gmail.com	127.0.0.1	UPDATE	seguridad.usuarios	31	{"id": 31, "edad": 50, "sexo": "masculino", "activo": true, "correo": "franciscojaviermorenopichardo@gmail.com", "nombre": "francisco javier", "rol_id": 1, "telefono": "7711408883", "contrasena": "$2b$10$faKBsTmYJPoHGUS2Foj3DO1A6h2Y.F77CAwyL4qqLJuTqcbvh1GOy", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "pichardo", "apellidoPaterno": "moreno", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 31, "edad": 50, "sexo": "masculino", "activo": true, "correo": "franciscojaviermorenopichardo@gmail.com", "nombre": "francisco javier", "rol_id": 2, "telefono": "7711408883", "contrasena": "$2b$10$faKBsTmYJPoHGUS2Foj3DO1A6h2Y.F77CAwyL4qqLJuTqcbvh1GOy", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "pichardo", "apellidoPaterno": "moreno", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 13:46:45.288303	TRIGGER_AUDITORIA	\N
218	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	31	{"id": 31, "edad": 50, "sexo": "masculino", "activo": true, "correo": "franciscojaviermorenopichardo@gmail.com", "nombre": "francisco javier", "rol_id": 2, "telefono": "7711408883", "contrasena": "$2b$10$faKBsTmYJPoHGUS2Foj3DO1A6h2Y.F77CAwyL4qqLJuTqcbvh1GOy", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "pichardo", "apellidoPaterno": "moreno", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 31, "edad": 50, "sexo": "masculino", "activo": true, "correo": "franciscojaviermorenopichardo@gmail.com", "nombre": "francisco javier", "rol_id": 2, "telefono": "7711408883", "contrasena": "$2b$10$faKBsTmYJPoHGUS2Foj3DO1A6h2Y.F77CAwyL4qqLJuTqcbvh1GOy", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "pichardo", "apellidoPaterno": "moreno", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 13:46:49.93201	TRIGGER_AUDITORIA	\N
219	franciscojaviermorenopichardo@gmail.com	127.0.0.1	UPDATE	clinica.medicos	16	{"activo": true, "nombres": "María Fernanda", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320570/centro-medico/medicos/etxx4kz9cbpda4wecvcf.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 16, "especialidad": "Pediatra", "apellido_materno": "Ruiz", "apellido_paterno": "López", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": false, "nombres": "María Fernanda", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320570/centro-medico/medicos/etxx4kz9cbpda4wecvcf.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 16, "especialidad": "Pediatra", "apellido_materno": "Ruiz", "apellido_paterno": "López", "hospital_clinica": "Centro Médico Pichardo"}	2026-07-18 13:47:36.751555	TRIGGER_AUDITORIA	\N
220	franciscojaviermorenopichardo@gmail.com	127.0.0.1	UPDATE	clinica.medicos	16	{"activo": false, "nombres": "María Fernanda", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320570/centro-medico/medicos/etxx4kz9cbpda4wecvcf.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 16, "especialidad": "Pediatra", "apellido_materno": "Ruiz", "apellido_paterno": "López", "hospital_clinica": "Centro Médico Pichardo"}	{"activo": true, "nombres": "María Fernanda", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320570/centro-medico/medicos/etxx4kz9cbpda4wecvcf.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 16, "especialidad": "Pediatra", "apellido_materno": "Ruiz", "apellido_paterno": "López", "hospital_clinica": "Centro Médico Pichardo"}	2026-07-18 13:47:53.496909	TRIGGER_AUDITORIA	\N
221	neondb_owner	127.0.0.1	DELETE	clinica.medicos	15	{"activo": true, "nombres": "Luis Alberto", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320501/centro-medico/medicos/lshy2gkqlnn8dtefcivp.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 15, "especialidad": "Pediatra", "apellido_materno": "Gómez", "apellido_paterno": "Hernández", "hospital_clinica": "Centro Médico Pichardo"}	\N	2026-07-18 13:49:40.472724	TRIGGER_AUDITORIA	\N
222	neondb_owner	127.0.0.1	DELETE	clinica.medicos	16	{"activo": true, "nombres": "María Fernanda", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320570/centro-medico/medicos/etxx4kz9cbpda4wecvcf.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 16, "especialidad": "Pediatra", "apellido_materno": "Ruiz", "apellido_paterno": "López", "hospital_clinica": "Centro Médico Pichardo"}	\N	2026-07-18 13:49:40.472724	TRIGGER_AUDITORIA	\N
223	neondb_owner	127.0.0.1	DELETE	clinica.medicos	17	{"activo": true, "nombres": "Carlos Eduardo", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776320629/centro-medico/medicos/ocgpykmtxctksi7t88gq.png", "direccion": "Av. Central 123, Poza Rica", "id_medico": 17, "especialidad": "Pediatra", "apellido_materno": "Torres", "apellido_paterno": "Martínez", "hospital_clinica": "Centro Médico Pichardo"}	\N	2026-07-18 13:49:40.472724	TRIGGER_AUDITORIA	\N
224	neondb_owner	127.0.0.1	DELETE	clinica.medicos	14	{"activo": true, "nombres": "Francisco Javier", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1776093395/centro-medico/medicos/xbroogr1fo7lbap0z8mu.jpg", "direccion": "Calle Alcatraz colonia los prados a cien metros de la asociación del jubilado y pensionado sobre la terracería centro médico Pichardo", "id_medico": 14, "especialidad": "Pediatra", "apellido_materno": "Pichardo", "apellido_paterno": "Moreno", "hospital_clinica": "Centro Médico Pichardo"}	\N	2026-07-18 13:49:51.939071	TRIGGER_AUDITORIA	\N
225	franciscojaviermorenopichardo@gmail.com	127.0.0.1	INSERT	clinica.medicos	1	\N	{"activo": true, "nombres": "ana nelida", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1784404382/centro-medico/medicos/lv0ybexqsnyhrbt66tcw.jpg", "direccion": "calle alcatraz  sn col los prados centro medico pichardo.", "id_medico": 1, "especialidad": "psicologia.", "apellido_materno": "flores", "apellido_paterno": "antonio", "hospital_clinica": "Centro Médico Pichardo"}	2026-07-18 13:53:07.207793	TRIGGER_AUDITORIA	\N
226	neondb_owner	127.0.0.1	UPDATE	seguridad.usuarios	31	{"id": 31, "edad": 50, "sexo": "masculino", "activo": true, "correo": "franciscojaviermorenopichardo@gmail.com", "nombre": "francisco javier", "rol_id": 2, "telefono": "7711408883", "contrasena": "$2b$10$faKBsTmYJPoHGUS2Foj3DO1A6h2Y.F77CAwyL4qqLJuTqcbvh1GOy", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "pichardo", "apellidoPaterno": "moreno", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 31, "edad": 50, "sexo": "masculino", "activo": true, "correo": "franciscojaviermorenopichardo@gmail.com", "nombre": "francisco javier", "rol_id": 2, "telefono": "7711408883", "contrasena": "$2b$10$faKBsTmYJPoHGUS2Foj3DO1A6h2Y.F77CAwyL4qqLJuTqcbvh1GOy", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "pichardo", "apellidoPaterno": "moreno", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 13:53:53.726847	TRIGGER_AUDITORIA	\N
227	franciscojaviermorenopichardo@gmail.com	127.0.0.1	INSERT	clinica.medicos	2	\N	{"activo": true, "nombres": "Francisco Javier", "url_foto": "https://res.cloudinary.com/dydfxuywl/image/upload/v1784404614/centro-medico/medicos/uwapl2blw1anoyah6fhq.jpg", "direccion": "calle alcatraz sn col los prados centro medico pichardo", "id_medico": 2, "especialidad": "Pediatria.", "apellido_materno": "Pichardo", "apellido_paterno": "Moreno", "hospital_clinica": "Centro Médico Pichardo"}	2026-07-18 13:56:56.698572	TRIGGER_AUDITORIA	\N
228	franciscojaviermorenopichardo@gmail.com	127.0.0.1	INSERT	clinica.servicios	1	\N	{"activo": true, "texto_alt": "consulta pediatrica", "ubicacion": "Centro Médico Pichardo", "url_image": "/default-service.jpg", "descripcion": "horarios de lunes a sabado de 9 a 8 de la noche\\ndomingos de 10 a 14 hr", "diseno_tipo": "vertical", "id_servicio": 1, "titulo_servicio": "consulta pediatrica"}	2026-07-18 13:59:59.208864	TRIGGER_AUDITORIA	\N
229	franciscojaviermorenopichardo@gmail.com	127.0.0.1	INSERT	clinica.servicios	2	\N	{"activo": true, "texto_alt": "cursos para padres", "ubicacion": "Centro Médico Pichardo", "url_image": "/default-service.jpg", "descripcion": "domingo 5 de la tarde , cada semana curso diferente", "diseno_tipo": "vertical", "id_servicio": 2, "titulo_servicio": "cursos para padres"}	2026-07-18 14:00:54.260823	TRIGGER_AUDITORIA	\N
230	franciscojaviermorenopichardo@gmail.com	127.0.0.1	UPDATE	seguridad.usuarios	26	{"id": 26, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus22@gmail.com", "nombre": "Luis", "rol_id": 1, "telefono": "7717205499", "contrasena": "$2b$10$lI.UBXO8danZGHre3k8WIuCvAba7IlUzNMwfaYdsA3bZJjEkD0m2q", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	{"id": 26, "edad": 20, "sexo": "masculino", "activo": true, "correo": "chavezvargasluisjesus22@gmail.com", "nombre": "Luis", "rol_id": 2, "telefono": "7717205499", "contrasena": "$2b$10$lI.UBXO8danZGHre3k8WIuCvAba7IlUzNMwfaYdsA3bZJjEkD0m2q", "reset_token": null, "secreto_mfa": null, "version_token": 1, "mfa_habilitado": false, "apellidoMaterno": "Vargas", "apellidoPaterno": "Chavez", "bloqueado_hasta": null, "intentos_fallidos": 0, "reset_token_expiry": null}	2026-07-18 14:06:03.84108	TRIGGER_AUDITORIA	\N
\.


--
-- Data for Name: cambios_estructura; Type: TABLE DATA; Schema: seguridad; Owner: -
--

COPY seguridad.cambios_estructura (id_cambio, usuario, fecha_cambio, tipo_objeto, nombre_objeto, sentencia_ddl, cambio_detalle) FROM stdin;
\.


--
-- Data for Name: estadisticas_consumo; Type: TABLE DATA; Schema: seguridad; Owner: -
--

COPY seguridad.estadisticas_consumo (id_estadistica, fecha, hora, total_consultas, consultas_lentas, errores_sql, usuarios_activos, ancho_banda_mb, operaciones_crud) FROM stdin;
\.


--
-- Data for Name: monitoreo_rendimiento; Type: TABLE DATA; Schema: seguridad; Owner: -
--

COPY seguridad.monitoreo_rendimiento (id_monitoreo, fecha_hora, query_text, tiempo_ejecucion_ms, cpu_usage_percent, memoria_usage_mb, conexiones_activas, deadlocks_detectados, cache_hit_ratio, tabla_consultada) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: seguridad; Owner: -
--

COPY seguridad.roles (id, nombre) FROM stdin;
1	cliente
2	admin
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: seguridad; Owner: -
--

COPY seguridad.usuarios (id, nombre, "apellidoPaterno", "apellidoMaterno", edad, sexo, telefono, correo, contrasena, rol_id, reset_token, reset_token_expiry, intentos_fallidos, bloqueado_hasta, version_token, mfa_habilitado, secreto_mfa, activo) FROM stdin;
24	Roberto	Salazar	Gómez	38	Masculino	7716667788	roberto.salazar@centromedicopichardo.com	RobSoporte26	1	\N	\N	0	\N	1	t	\N	t
23	Laura	Méndez	Ríos	29	Femenino	7715554433	laura.mendez@centromedicopichardo.com	LauraPedi2026	1	\N	\N	2	\N	1	f	\N	t
29	Jesus	Fernandez	Hernandez	21	masculino	7713039166	jesusf1705dck@gmail.com	$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412	1	\N	\N	0	\N	1	f	\N	t
20	Luis Jesus	Chavez	Vargas	20	masculino	7717205433	chavezvargasluisjesus@gmail.com	$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC	2	\N	\N	0	\N	1	f	\N	t
30	Jesus	Fernandez	Hernandez	20	masculino	7713039166	patofdez4@gmail.com	$2b$10$qM0kF05onObulZPaLmBDsO42d3TwWXxAq9aVW4MewTPpcM58a6Myi	1	\N	\N	0	\N	1	f	\N	t
27	Jesus	Fernandez	Hernandez	20	masculino	7713039166	jesushfernandezh@gmail.com	$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG	2	\N	\N	0	\N	1	f	\N	t
31	francisco javier	moreno	pichardo	50	masculino	7711408883	franciscojaviermorenopichardo@gmail.com	$2b$10$faKBsTmYJPoHGUS2Foj3DO1A6h2Y.F77CAwyL4qqLJuTqcbvh1GOy	2	\N	\N	0	\N	1	f	\N	t
26	Luis	Chavez	Vargas	20	masculino	7717205499	chavezvargasluisjesus22@gmail.com	$2b$10$lI.UBXO8danZGHre3k8WIuCvAba7IlUzNMwfaYdsA3bZJjEkD0m2q	2	\N	\N	0	\N	1	f	\N	t
25	Luis 	Chavez	Vargas	20	masculino	7717205499	20230003@uthh.edu.mx	$2b$10$n2EbnwB12..dWY92YefHw.Yh0XYjgLM87qqJOBeVVEE3mWtXKwQl.	1	\N	\N	0	\N	1	f	\N	t
\.


--
-- Data for Name: categorias_ayuda; Type: TABLE DATA; Schema: soporte; Owner: -
--

COPY soporte.categorias_ayuda (id_categoria, nombre_categoria, descripcion, icono, orden, activo, created_at, updated_at) FROM stdin;
1	Citas Médicas	Preguntas sobre agendamiento, cancelación y modificación de citas	📅	1	t	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
2	Facturación y Pagos	Información sobre costos, métodos de pago y facturación	💳	2	t	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
3	Resultados y Estudios	Consulta de resultados, tiempos de entrega y tipos de estudios	🔬	3	t	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
4	Cuenta y Perfil	Gestión de cuenta, contraseñas y datos personales	👤	4	t	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
5	Telemedicina	Consultas en línea, requisitos técnicos y funcionamiento	💻	5	t	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
6	Emergencias	Qué hacer en caso de emergencia, contactos y protocolos	🚨	6	t	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
7	Recetas y Medicamentos	Recetas electrónicas, surtido y dudas sobre medicamentos	💊	7	t	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
8	Seguro Médico	Convenios, coberturas y reembolsos	🏥	8	t	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
\.


--
-- Data for Name: preguntas_frecuentes; Type: TABLE DATA; Schema: soporte; Owner: -
--

COPY soporte.preguntas_frecuentes (id_pregunta, id_categoria, pregunta, respuesta, orden, veces_util, veces_no_util, activo, es_destacada, tags, created_at, updated_at, creado_por) FROM stdin;
3	1	¿Puedo cancelar o reprogramar una cita?	Sí, puedes cancelar o reprogramar sin costo hasta 24 horas antes de la cita programada. Las cancelaciones con menos de 24 horas o inasistencias pueden generar un cargo administrativo del 30% del valor de la consulta.\\n\\nPara cancelar o reprogramar:\\n- Ingresa a tu cuenta en el portal\\n- Ve a "Mis Citas"\\n- Selecciona la cita y elige "Cancelar" o "Reprogramar"	3	0	0	t	f	{cancelar,reprogramar,cargos,inasistencia}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
4	1	¿Qué documentos debo llevar a la cita?	Para tu primera cita necesitas:\\n\\n✅ Identificación oficial del tutor\\n✅ Acta de nacimiento del paciente\\n✅ Cartilla de vacunación actualizada\\n✅ Estudios previos relacionados (si aplica)\\n✅ Hoja de referencia médica (si fuiste referido)\\n\\nPara citas subsecuentes solo necesitas identificación y cualquier estudio reciente.	4	0	0	t	f	{documentos,"primera cita",requisitos}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
6	2	¿Qué métodos de pago aceptan?	Aceptamos los siguientes métodos de pago:\\n\\n💳 Tarjetas de crédito/débito (Visa, Mastercard, AMEX)\\n💰 Efectivo\\n🏦 Transferencia bancaria\\n📱 Pagos por SPEI\\n🏥 Pago con seguro médico (convenios directos)\\n\\nTambién ofrecemos planes de pago a 3, 6 y 9 meses sin intereses con tarjetas participantes.	2	0	0	t	f	{pago,tarjeta,efectivo,transferencia,"meses sin intereses"}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
8	3	¿En cuánto tiempo entregan los resultados de laboratorio?	Los tiempos de entrega varían según el tipo de estudio:\\n\\n- **Biometría hemática**: 2-4 horas\\n- **Examen general de orina**: 2-4 horas\\n- **Perfil tiroideo**: 24-48 horas\\n- **Cultivos**: 48-72 horas\\n- **Pruebas de alergia**: 3-5 días hábiles\\n- **Estudios genéticos**: 2-4 semanas\\n\\nTodos los resultados se publican en tu cuenta del portal y recibirás una notificación por correo.	1	0	0	t	t	{resultados,laboratorio,tiempos,estudios}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
10	3	¿Pueden enviar los resultados por correo electrónico?	Por políticas de privacidad y protección de datos de salud, no enviamos resultados por correo electrónico convencional. Todos los resultados están disponibles de forma segura en tu cuenta del portal con encriptación SSL.\\n\\nSi necesitas compartir resultados con otro médico, puedes generar un enlace temporal de acceso desde el portal.	3	0	0	t	f	{correo,privacidad,compartir,seguridad}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
11	4	¿Cómo creo una cuenta en el portal?	Para crear tu cuenta:\\n\\n1. Ve a la página de Registro\\n2. Ingresa tu correo electrónico y crea una contraseña segura\\n3. Completa tus datos personales\\n4. Agrega la información de tu(s) hijo(s)\\n5. Verifica tu correo electrónico\\n\\nUna vez verificada, podrás acceder a todos los servicios del portal.	1	0	0	t	t	{registro,cuenta,portal,"crear cuenta"}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
12	4	Olvidé mi contraseña, ¿cómo la recupero?	Para recuperar tu contraseña:\\n\\n1. Ve a la página de "Iniciar Sesión"\\n2. Haz clic en "¿Olvidaste tu contraseña?"\\n3. Ingresa el correo electrónico con el que te registraste\\n4. Recibirás un enlace para restablecer tu contraseña\\n5. El enlace expira en 30 minutos\\n\\nSi no recibes el correo, revisa tu carpeta de spam o contacta a soporte.	2	0	0	t	f	{contraseña,recuperar,olvidé,acceso}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
14	5	¿Qué necesito para una consulta por telemedicina?	Para tu consulta en línea necesitas:\\n\\n📱 Dispositivo con cámara (computadora, tablet o smartphone)\\n🌐 Conexión a internet estable (mínimo 5 Mbps)\\n🔊 Bocinas y micrófono funcionales\\n🖥️ Navegador actualizado (Chrome, Firefox, Safari o Edge)\\n\\nTe recomendamos:\\n- Estar en un lugar iluminado y sin ruido\\n- Tener a la mano medicamentos o estudios recientes\\n- Conectar tu dispositivo a la corriente eléctrica	1	0	0	t	t	{telemedicina,requisitos,"consulta en línea",conexión}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
15	5	¿La telemedicina es segura para mi hijo?	La telemedicina es segura y efectiva para muchos tipos de consultas pediátricas:\\n\\n✅ **Ideal para**:\\n- Seguimiento de tratamientos\\n- Revisión de resultados\\n- Orientación sobre síntomas leves\\n- Consultas de control\\n- Asesoría nutricional\\n\\n❌ **No recomendada para**:\\n- Emergencias médicas\\n- Traumatismos o heridas\\n- Dificultad respiratoria severa\\n- Dolor intenso\\n\\nTodas nuestras videoconsultas cumplen con estándares HIPAA de privacidad.	2	0	0	t	f	{seguridad,telemedicina,privacidad,recomendaciones}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
16	5	¿Cómo ingreso a mi consulta por telemedicina?	El día de tu cita:\\n\\n1. Inicia sesión en el portal\\n2. Ve a "Mis Citas"\\n3. Encuentra la cita de telemedicina\\n4. 15 minutos antes de la hora, aparecerá el botón "Entrar a Consulta"\\n5. Haz clic y serás dirigido a la sala virtual\\n\\nSi tienes problemas de conexión, contáctanos al (55) 1234-5678.	3	0	0	t	f	{acceso,videollamada,"consulta virtual","sala virtual"}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
18	6	¿Tienen servicio de ambulancia?	Sí, contamos con servicio de ambulancia pediátrica especializada las 24 horas. Nuestras ambulancias están equipadas con:\\n\\n🚑 Personal médico pediátrico\\n🚑 Equipo de reanimación neonatal y pediátrica\\n🚑 Monitor de signos vitales\\n🚑 Oxígeno y medicamentos de emergencia\\n\\nPara solicitar el servicio llama al (55) 1234-5678 opción 2.	2	0	0	t	f	{ambulancia,traslado,"emergencia pediátrica"}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
19	7	¿Cómo funcionan las recetas electrónicas?	Nuestras recetas electrónicas son válidas en todas las farmacias de México según la NOM-024-SSA3-2012.\\n\\nAl finalizar tu consulta:\\n1. La receta se genera automáticamente en formato digital\\n2. Aparece en tu cuenta del portal\\n3. Puedes descargarla como PDF o mostrarla desde tu celular en la farmacia\\n4. Incluye un código QR que la farmacia puede escanear\\n\\nLa receta es válida por 30 días naturales desde su emisión.	1	0	0	t	t	{receta,electrónica,medicamentos,QR,farmacia}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
20	7	¿Pueden surtir mis recetas en la farmacia del centro?	Sí, contamos con farmacia dentro del centro médico con horario de 7:00 a 21:00 hrs todos los días.\\n\\nVentajas:\\n💊 Medicamentos pediátricos especializados\\n💊 Dosificaciones exactas según peso del paciente\\n💊 Precios preferenciales para pacientes\\n💊 Entrega a domicilio (costo adicional)\\n\\nTambién ofrecemos servicio de fórmulas magistrales pediátricas.	2	0	0	t	f	{farmacia,surtir,medicamentos,domicilio}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
21	8	¿Con qué seguros médicos tienen convenio?	Tenemos convenio directo con las siguientes aseguradoras:\\n\\n🏥 AXA Seguros\\n🏥 GNP Seguros\\n🏥 MetLife México\\n🏥 Seguros Monterrey\\n🏥 Mapfre México\\n🏥 BBVA Seguros Salud\\n🏥 Plan Seguro\\n\\nSi tu seguro no está en la lista, podemos proporcionarte una factura detallada para que solicites reembolso.	1	0	0	t	t	{seguros,convenios,aseguradoras,cobertura}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
22	8	¿Cómo funciona el pago con seguro médico?	El proceso es simple:\\n\\n1. Al agendar tu cita, indica que pagarás con seguro\\n2. El día de la cita, presenta tu póliza vigente y credencial del seguro\\n3. Verificamos cobertura en línea\\n4. Solo pagas el deducible y coaseguro aplicable (si lo hay)\\n\\nPara saber tu cobertura exacta, contáctanos con anticipación para verificar los detalles de tu póliza.	2	0	0	t	f	{pago,seguro,póliza,deducible,cobertura}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
1	1	¿Cómo agendo una cita para mi hijo?	Puedes agendar una cita de tres formas:\\n\\n1. **En línea**: Ingresando a tu cuenta en nuestro portal y seleccionando "Agendar Cita".\\n2. **Por teléfono**: Llamando al (55) 1234-5678 de lunes a viernes de 8:00 a 18:00 hrs.\\n3. **WhatsApp**: Enviando un mensaje al (55) 8765-4321.\\n\\nNecesitarás tener a la mano el número de expediente de tu hijo.	1	2	0	t	t	{agendar,cita,portal,teléfono}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
2	1	¿Con cuánto tiempo de anticipación debo agendar una cita?	Recomendamos agendar con al menos 48 horas de anticipación para citas generales. Para especialidades como Neurología Pediátrica o Cardiología Infantil, sugerimos agendar con 1-2 semanas de anticipación debido a la alta demanda.\\n\\nEn caso de necesitar una cita urgente, contáctanos directamente por teléfono para evaluar disponibilidad.	2	1	0	t	f	{anticipación,especialidades,urgencia}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
5	2	¿Cuáles son los costos de consulta?	Nuestros costos de consulta varían según la especialidad:\\n\\n- **Consulta general pediátrica**: $800 MXN\\n- **Especialidad** (Cardiología, Neurología, etc.): $1,200 - $1,800 MXN\\n- **Telemedicina**: $600 MXN\\n- **Urgencias pediátricas**: $1,500 MXN\\n\\n*Precios sujetos a cambios. Incluyen IVA.*	1	3	1	t	t	{costos,precios,consulta,especialidades}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
7	2	¿Cómo solicito una factura?	Para solicitar tu factura:\\n\\n1. Ingresa a tu cuenta en el portal\\n2. Ve a "Historial de Pagos"\\n3. Selecciona el pago que deseas facturar\\n4. Haz clic en "Solicitar Factura"\\n5. Ingresa tus datos fiscales\\n\\nLa factura se enviará a tu correo electrónico en un plazo máximo de 48 horas hábiles. También puedes solicitarla directamente en recepción al momento del pago.	3	1	0	t	f	{factura,"datos fiscales",comprobante}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
9	3	¿Cómo interpreto los resultados de laboratorio de mi hijo?	Los resultados de laboratorio incluyen valores de referencia para población pediátrica. Sin embargo, la interpretación debe ser realizada por un médico, ya que los valores normales varían según edad, sexo y condiciones específicas.\\n\\n⚠️ **Importante**: No intentes diagnosticar basándote únicamente en los resultados. Agenda una cita de seguimiento para revisarlos con tu pediatra.	2	0	1	t	f	{interpretación,valores,referencia,diagnóstico}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
13	4	¿Puedo tener varios perfiles de hijos en mi cuenta?	¡Sí! Puedes agregar todos los hijos que necesites en una sola cuenta. Cada perfil es independiente y mantiene su propio historial médico, citas y recetas.\\n\\nPara agregar un nuevo perfil:\\n1. Inicia sesión\\n2. Ve a "Mi Familia" o "Perfiles"\\n3. Haz clic en "Agregar Paciente"\\n4. Completa los datos del nuevo paciente	3	1	0	t	f	{perfiles,hijos,familia,"múltiples pacientes"}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
17	6	¿Qué hago en caso de emergencia con mi hijo?	🚨 **SI ES UNA EMERGENCIA QUE PONE EN RIESGO LA VIDA, LLAMA AL 911 INMEDIATAMENTE**\\n\\nNuestro servicio de urgencias pediátricas está disponible 24/7 en:\\n📍 Av. Pediatría #123, Col. Médica, CDMX\\n📞 (55) 1234-5678 opción 1\\n\\nSeñales de emergencia en niños:\\n⚠️ Dificultad para respirar\\n⚠️ Labios o piel azulados\\n⚠️ Convulsiones\\n⚠️ Pérdida de conciencia\\n⚠️ Sangrado abundante\\n⚠️ Fiebre mayor a 40°C que no cede	1	1	0	t	t	{emergencia,urgencias,911,24/7,dirección}	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229	27
\.


--
-- Data for Name: preguntas_usuarios; Type: TABLE DATA; Schema: soporte; Owner: -
--

COPY soporte.preguntas_usuarios (id_pregunta, id_usuario, id_categoria, titulo, descripcion, estado, prioridad, es_privada, id_pregunta_faq, created_at, updated_at) FROM stdin;
1	23	1	Necesito cambiar horario de cita de mi hija	Buen día, tengo una cita programada para el próximo lunes a las 10:00 am con la Dra. Martínez, pero por cuestiones de trabajo no podré asistir. ¿Puedo cambiarla para el martes en la tarde? Mi hija es Ana López García, número de expediente 1045.	respondida	normal	f	\N	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
2	23	3	No encuentro los resultados de laboratorio de mi bebé	Hola, a mi bebé le hicieron unos análisis el viernes pasado y me dijeron que en 24 horas estarían listos, pero aún no aparecen en el portal. Su nombre es Carlos Mendoza Ruiz, tiene 8 meses. ¿Podrían ayudarme a localizarlos?	respondida	alta	f	\N	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
3	24	5	Problemas con la videollamada de telemedicina	Estoy intentando entrar a mi consulta virtual pero la cámara no se activa. Ya verifiqué los permisos del navegador y todo parece estar bien. ¿Hay alguna configuración especial que necesite? Tengo una MacBook Air con Safari.	pendiente	alta	f	\N	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
4	24	2	Duda sobre cobro de estudio que no me realizaron	En mi último estado de cuenta aparece un cargo por un "perfil tiroideo" que nunca le realizaron a mi hijo. Ya revisé el historial y no encuentro ese estudio. El monto es de $1,250. ¿Cómo puedo solicitar la aclaración?	respondida	normal	f	\N	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
5	23	7	La farmacia no aceptó mi receta electrónica	Fui a la farmacia Guadalajara con la receta electrónica del Dr. Ramírez para el antibiótico de mi hijo, pero me dijeron que el código QR no funcionaba. Intenté descargar el PDF varias veces. ¿Pueden generarme una nueva o decirme qué hacer?	cerrada	urgente	f	\N	2026-07-15 21:24:59.48229	2026-07-15 21:24:59.48229
\.


--
-- Data for Name: respuestas_ayuda; Type: TABLE DATA; Schema: soporte; Owner: -
--

COPY soporte.respuestas_ayuda (id_respuesta, id_pregunta, id_usuario, contenido, es_respuesta_admin, es_solucion, created_at) FROM stdin;
1	1	27	¡Claro que sí! Con gusto te ayudo a reprogramar. He revisado la agenda de la Dra. Martínez y tiene disponibilidad el martes a las 16:30 o 18:00 hrs. ¿Alguno de estos horarios te funciona? También puedo ofrecerte el miércoles a las 9:00 am si lo prefieres.	t	f	2026-07-15 21:24:59.48229
2	1	23	¡Perfecto! El martes a las 16:30 me queda muy bien. Muchas gracias por la ayuda y la rapidez.	f	f	2026-07-15 21:24:59.48229
3	1	27	Excelente, he realizado el cambio de horario. Tu cita queda confirmada para el martes 15 a las 16:30 hrs con la Dra. Martínez. Recibirás un correo de confirmación en breve. Recuerda llegar 15 minutos antes. ¡Saludos!	t	t	2026-07-15 21:24:59.48229
4	2	27	Buenas tardes. He verificado en el sistema y los resultados de Carlos Mendoza Ruiz fueron cargados ayer por la tarde. A veces hay un retraso en la sincronización con el portal. Ya forcé la actualización. Por favor cierra sesión y vuelve a ingresar, ya deberías poder verlos. Si persiste el problema, contáctanos nuevamente.	t	t	2026-07-15 21:24:59.48229
5	3	27	Hola, lamento los inconvenientes. Para Safari en Mac, necesitas hacer lo siguiente:\\n\\n1. Ve a Preferencias de Safari > Sitios web > Cámara\\n2. Asegúrate de que tu sitio esté configurado como "Permitir"\\n3. También verifica en Privacidad > Grabación de pantalla\\n\\nSi el problema persiste, te recomiendo usar Chrome para la consulta de hoy. Estoy a tus órdenes para cualquier otra duda.	t	f	2026-07-15 21:24:59.48229
6	4	27	Buen día. He revisado tu cuenta y efectivamente hay un error en el cargo. El perfil tiroideo corresponde a otro paciente con apellido similar. Procederé a realizar la cancelación del cargo y el reembolso. El monto de $1,250 se verá reflejado en tu tarjeta en 5-7 días hábiles. Te pido una disculpa por la confusión.	t	t	2026-07-15 21:24:59.48229
7	5	27	Hola, qué molestia. Acabo de regenerar tu receta electrónica. Por favor descarga el nuevo PDF desde tu cuenta. Si la farmacia sigue teniendo problemas, diles que se comuniquen directamente a nuestro número de validación: (55) 1234-5678 opción 5. También tenemos convenio con Farmacias del Ahorro, te sugiero intentar ahí.	t	t	2026-07-15 21:24:59.48229
\.


--
-- Data for Name: valoraciones_faq; Type: TABLE DATA; Schema: soporte; Owner: -
--

COPY soporte.valoraciones_faq (id_valoracion, id_pregunta_faq, id_usuario, es_util, comentario, created_at) FROM stdin;
1	1	23	t	Muy claro, me sirvió para agendar por WhatsApp	2026-07-15 21:24:59.48229
2	1	24	t	Excelente información	2026-07-15 21:24:59.48229
3	2	23	t	Justo lo que necesitaba saber	2026-07-15 21:24:59.48229
4	5	24	t	Me ayudó a saber qué documentos llevar	2026-07-15 21:24:59.48229
5	7	23	t	Buena info de precios, deberían actualizar los de especialidades	2026-07-15 21:24:59.48229
6	9	24	f	Los tiempos no coinciden, mis resultados tardaron 5 días	2026-07-15 21:24:59.48229
7	13	23	t	Muy útil lo de los perfiles múltiples	2026-07-15 21:24:59.48229
8	17	24	t	Gracias, muy completo	2026-07-15 21:24:59.48229
\.


--
-- Name: academia_infantil_id_guia_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.academia_infantil_id_guia_seq', 1, false);


--
-- Name: asistencias_curso_id_asistencia_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.asistencias_curso_id_asistencia_seq', 1, false);


--
-- Name: categorias_cursos_id_categoria_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.categorias_cursos_id_categoria_seq', 6, true);


--
-- Name: certificados_curso_id_certificado_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.certificados_curso_id_certificado_seq', 1, false);


--
-- Name: compra_participantes_id_compra_participante_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.compra_participantes_id_compra_participante_seq', 1, false);


--
-- Name: comprascursosinacademia_idcompra_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.comprascursosinacademia_idcompra_seq', 1, false);


--
-- Name: contenido_saber_pediatrico_id_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.contenido_saber_pediatrico_id_seq', 21, true);


--
-- Name: cursos_id_curso_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.cursos_id_curso_seq', 1, false);


--
-- Name: encuestas_id_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.encuestas_id_seq', 1, false);


--
-- Name: estadocomprainacademia_idestadocompra_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.estadocomprainacademia_idestadocompra_seq', 7, true);


--
-- Name: evaluaciones_curso_id_evaluacion_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.evaluaciones_curso_id_evaluacion_seq', 1, false);


--
-- Name: historial_estados_compra_id_historial_estado_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.historial_estados_compra_id_historial_estado_seq', 1, false);


--
-- Name: historial_estados_curso_id_historial_estado_curso_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.historial_estados_curso_id_historial_estado_curso_seq', 1, false);


--
-- Name: inscripciones_cursos_id_inscripcion_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.inscripciones_cursos_id_inscripcion_seq', 1, false);


--
-- Name: instructores_id_instructor_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.instructores_id_instructor_seq', 11, true);


--
-- Name: metodos_pago_cursos_id_metodo_pago_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.metodos_pago_cursos_id_metodo_pago_seq', 4, true);


--
-- Name: modalidades_id_modalidad_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.modalidades_id_modalidad_seq', 3, true);


--
-- Name: movimientos_cupos_curso_id_movimiento_cupo_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.movimientos_cupos_curso_id_movimiento_cupo_seq', 1, false);


--
-- Name: notificaciones_academicas_id_notificacion_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.notificaciones_academicas_id_notificacion_seq', 1, false);


--
-- Name: pagos_cursos_id_pago_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.pagos_cursos_id_pago_seq', 1, false);


--
-- Name: participantes_id_participante_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.participantes_id_participante_seq', 1, false);


--
-- Name: progreso_curso_id_progreso_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.progreso_curso_id_progreso_seq', 1, false);


--
-- Name: publicaciones_id_publicacion_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.publicaciones_id_publicacion_seq', 1, false);


--
-- Name: requisitos_aprobacion_curso_id_requisito_aprobacion_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.requisitos_aprobacion_curso_id_requisito_aprobacion_seq', 1, false);


--
-- Name: respuestas_encuestas_id_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.respuestas_encuestas_id_seq', 1, false);


--
-- Name: resultados_evaluaciones_id_resultado_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.resultados_evaluaciones_id_resultado_seq', 1, false);


--
-- Name: seq_folio_compra; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.seq_folio_compra', 1, false);


--
-- Name: sesiones_curso_id_sesion_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.sesiones_curso_id_sesion_seq', 1, false);


--
-- Name: ubicaciones_cursos_id_ubicacion_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.ubicaciones_cursos_id_ubicacion_seq', 7, true);


--
-- Name: cola_actualizacion_datasets_id_tarea_seq; Type: SEQUENCE SET; Schema: analitica; Owner: -
--

SELECT pg_catalog.setval('analitica.cola_actualizacion_datasets_id_tarea_seq', 1, false);


--
-- Name: dataset_reglas_asociacion_id_registro_seq; Type: SEQUENCE SET; Schema: analitica; Owner: -
--

SELECT pg_catalog.setval('analitica.dataset_reglas_asociacion_id_registro_seq', 1, false);


--
-- Name: dataset_regresion_precio_cursos_id_registro_seq; Type: SEQUENCE SET; Schema: analitica; Owner: -
--

SELECT pg_catalog.setval('analitica.dataset_regresion_precio_cursos_id_registro_seq', 1, false);


--
-- Name: dataset_segmentacion_clientes_id_registro_seq; Type: SEQUENCE SET; Schema: analitica; Owner: -
--

SELECT pg_catalog.setval('analitica.dataset_segmentacion_clientes_id_registro_seq', 1, false);


--
-- Name: modelos_ml_id_modelo_seq; Type: SEQUENCE SET; Schema: analitica; Owner: -
--

SELECT pg_catalog.setval('analitica.modelos_ml_id_modelo_seq', 1, false);


--
-- Name: predicciones_precio_cursos_id_prediccion_seq; Type: SEQUENCE SET; Schema: analitica; Owner: -
--

SELECT pg_catalog.setval('analitica.predicciones_precio_cursos_id_prediccion_seq', 1, false);


--
-- Name: recomendaciones_cursos_id_recomendacion_seq; Type: SEQUENCE SET; Schema: analitica; Owner: -
--

SELECT pg_catalog.setval('analitica.recomendaciones_cursos_id_recomendacion_seq', 1, false);


--
-- Name: segmentos_clientes_id_segmentacion_seq; Type: SEQUENCE SET; Schema: analitica; Owner: -
--

SELECT pg_catalog.setval('analitica.segmentos_clientes_id_segmentacion_seq', 1, false);


--
-- Name: backups_id_seq; Type: SEQUENCE SET; Schema: auditoria; Owner: -
--

SELECT pg_catalog.setval('auditoria.backups_id_seq', 13, true);


--
-- Name: intentos_recuperacion_id_seq; Type: SEQUENCE SET; Schema: auditoria; Owner: -
--

SELECT pg_catalog.setval('auditoria.intentos_recuperacion_id_seq', 3, true);


--
-- Name: empresa_info_id_seq; Type: SEQUENCE SET; Schema: clinica; Owner: -
--

SELECT pg_catalog.setval('clinica.empresa_info_id_seq', 1, true);


--
-- Name: medicos_id_medico_seq; Type: SEQUENCE SET; Schema: clinica; Owner: -
--

SELECT pg_catalog.setval('clinica.medicos_id_medico_seq', 2, true);


--
-- Name: nosotros_id_seq; Type: SEQUENCE SET; Schema: clinica; Owner: -
--

SELECT pg_catalog.setval('clinica.nosotros_id_seq', 1, true);


--
-- Name: servicios_id_servicio_seq; Type: SEQUENCE SET; Schema: clinica; Owner: -
--

SELECT pg_catalog.setval('clinica.servicios_id_servicio_seq', 2, true);


--
-- Name: alertas_seguridad_id_alerta_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.alertas_seguridad_id_alerta_seq', 1, false);


--
-- Name: auditoria_acciones_id_auditoria_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.auditoria_acciones_id_auditoria_seq', 230, true);


--
-- Name: cambios_estructura_id_cambio_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.cambios_estructura_id_cambio_seq', 1, false);


--
-- Name: estadisticas_consumo_id_estadistica_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.estadisticas_consumo_id_estadistica_seq', 1, false);


--
-- Name: monitoreo_rendimiento_id_monitoreo_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.monitoreo_rendimiento_id_monitoreo_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.roles_id_seq', 3, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.usuarios_id_seq', 31, true);


--
-- Name: categorias_ayuda_id_categoria_seq; Type: SEQUENCE SET; Schema: soporte; Owner: -
--

SELECT pg_catalog.setval('soporte.categorias_ayuda_id_categoria_seq', 8, true);


--
-- Name: preguntas_frecuentes_id_pregunta_seq; Type: SEQUENCE SET; Schema: soporte; Owner: -
--

SELECT pg_catalog.setval('soporte.preguntas_frecuentes_id_pregunta_seq', 22, true);


--
-- Name: preguntas_usuarios_id_pregunta_seq; Type: SEQUENCE SET; Schema: soporte; Owner: -
--

SELECT pg_catalog.setval('soporte.preguntas_usuarios_id_pregunta_seq', 5, true);


--
-- Name: respuestas_ayuda_id_respuesta_seq; Type: SEQUENCE SET; Schema: soporte; Owner: -
--

SELECT pg_catalog.setval('soporte.respuestas_ayuda_id_respuesta_seq', 7, true);


--
-- Name: valoraciones_faq_id_valoracion_seq; Type: SEQUENCE SET; Schema: soporte; Owner: -
--

SELECT pg_catalog.setval('soporte.valoraciones_faq_id_valoracion_seq', 8, true);


--
-- Name: academia_infantil academia_infantil_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.academia_infantil
    ADD CONSTRAINT academia_infantil_pkey PRIMARY KEY (id_guia);


--
-- Name: asistencias_curso asistencias_curso_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.asistencias_curso
    ADD CONSTRAINT asistencias_curso_pkey PRIMARY KEY (id_asistencia);


--
-- Name: categorias_cursos categorias_cursos_nombre_categoria_key; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.categorias_cursos
    ADD CONSTRAINT categorias_cursos_nombre_categoria_key UNIQUE (nombre_categoria);


--
-- Name: categorias_cursos categorias_cursos_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.categorias_cursos
    ADD CONSTRAINT categorias_cursos_pkey PRIMARY KEY (id_categoria);


--
-- Name: certificados_curso certificados_curso_codigo_verificacion_key; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.certificados_curso
    ADD CONSTRAINT certificados_curso_codigo_verificacion_key UNIQUE (codigo_verificacion);


--
-- Name: certificados_curso certificados_curso_folio_certificado_key; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.certificados_curso
    ADD CONSTRAINT certificados_curso_folio_certificado_key UNIQUE (folio_certificado);


--
-- Name: certificados_curso certificados_curso_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.certificados_curso
    ADD CONSTRAINT certificados_curso_pkey PRIMARY KEY (id_certificado);


--
-- Name: compra_participantes compra_participantes_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.compra_participantes
    ADD CONSTRAINT compra_participantes_pkey PRIMARY KEY (id_compra_participante);


--
-- Name: comprascursosinacademia comprascursosinacademia_foliocompra_key; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.comprascursosinacademia
    ADD CONSTRAINT comprascursosinacademia_foliocompra_key UNIQUE (foliocompra);


--
-- Name: comprascursosinacademia comprascursosinacademia_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.comprascursosinacademia
    ADD CONSTRAINT comprascursosinacademia_pkey PRIMARY KEY (idcompra);


--
-- Name: contenido_saber_pediatrico contenido_saber_pediatrico_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.contenido_saber_pediatrico
    ADD CONSTRAINT contenido_saber_pediatrico_pkey PRIMARY KEY (id);


--
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id_curso);


--
-- Name: encuestas encuestas_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.encuestas
    ADD CONSTRAINT encuestas_pkey PRIMARY KEY (id);


--
-- Name: estadocomprainacademia estadocomprainacademia_nombre_key; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.estadocomprainacademia
    ADD CONSTRAINT estadocomprainacademia_nombre_key UNIQUE (nombre);


--
-- Name: estadocomprainacademia estadocomprainacademia_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.estadocomprainacademia
    ADD CONSTRAINT estadocomprainacademia_pkey PRIMARY KEY (idestadocompra);


--
-- Name: evaluaciones_curso evaluaciones_curso_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.evaluaciones_curso
    ADD CONSTRAINT evaluaciones_curso_pkey PRIMARY KEY (id_evaluacion);


--
-- Name: historial_estados_compra historial_estados_compra_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.historial_estados_compra
    ADD CONSTRAINT historial_estados_compra_pkey PRIMARY KEY (id_historial_estado);


--
-- Name: historial_estados_curso historial_estados_curso_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.historial_estados_curso
    ADD CONSTRAINT historial_estados_curso_pkey PRIMARY KEY (id_historial_estado_curso);


--
-- Name: inscripciones_cursos inscripciones_cursos_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.inscripciones_cursos
    ADD CONSTRAINT inscripciones_cursos_pkey PRIMARY KEY (id_inscripcion);


--
-- Name: instructores instructores_correo_key; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.instructores
    ADD CONSTRAINT instructores_correo_key UNIQUE (correo);


--
-- Name: instructores instructores_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.instructores
    ADD CONSTRAINT instructores_pkey PRIMARY KEY (id_instructor);


--
-- Name: metodos_pago_cursos metodos_pago_cursos_nombre_key; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.metodos_pago_cursos
    ADD CONSTRAINT metodos_pago_cursos_nombre_key UNIQUE (nombre);


--
-- Name: metodos_pago_cursos metodos_pago_cursos_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.metodos_pago_cursos
    ADD CONSTRAINT metodos_pago_cursos_pkey PRIMARY KEY (id_metodo_pago);


--
-- Name: modalidades modalidades_nombre_modalidad_key; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.modalidades
    ADD CONSTRAINT modalidades_nombre_modalidad_key UNIQUE (nombre_modalidad);


--
-- Name: modalidades modalidades_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.modalidades
    ADD CONSTRAINT modalidades_pkey PRIMARY KEY (id_modalidad);


--
-- Name: movimientos_cupos_curso movimientos_cupos_curso_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.movimientos_cupos_curso
    ADD CONSTRAINT movimientos_cupos_curso_pkey PRIMARY KEY (id_movimiento_cupo);


--
-- Name: notificaciones_academicas notificaciones_academicas_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.notificaciones_academicas
    ADD CONSTRAINT notificaciones_academicas_pkey PRIMARY KEY (id_notificacion);


--
-- Name: pagos_cursos pagos_cursos_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.pagos_cursos
    ADD CONSTRAINT pagos_cursos_pkey PRIMARY KEY (id_pago);


--
-- Name: participantes participantes_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.participantes
    ADD CONSTRAINT participantes_pkey PRIMARY KEY (id_participante);


--
-- Name: progreso_curso progreso_curso_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.progreso_curso
    ADD CONSTRAINT progreso_curso_pkey PRIMARY KEY (id_progreso);


--
-- Name: publicaciones publicaciones_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.publicaciones
    ADD CONSTRAINT publicaciones_pkey PRIMARY KEY (id_publicacion);


--
-- Name: requisitos_aprobacion_curso requisitos_aprobacion_curso_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.requisitos_aprobacion_curso
    ADD CONSTRAINT requisitos_aprobacion_curso_pkey PRIMARY KEY (id_requisito_aprobacion);


--
-- Name: respuestas_encuestas respuestas_encuestas_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.respuestas_encuestas
    ADD CONSTRAINT respuestas_encuestas_pkey PRIMARY KEY (id);


--
-- Name: resultados_evaluaciones resultados_evaluaciones_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.resultados_evaluaciones
    ADD CONSTRAINT resultados_evaluaciones_pkey PRIMARY KEY (id_resultado);


--
-- Name: sesiones_curso sesiones_curso_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.sesiones_curso
    ADD CONSTRAINT sesiones_curso_pkey PRIMARY KEY (id_sesion);


--
-- Name: ubicaciones_cursos ubicaciones_cursos_nombre_ubicacion_key; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.ubicaciones_cursos
    ADD CONSTRAINT ubicaciones_cursos_nombre_ubicacion_key UNIQUE (nombre_ubicacion);


--
-- Name: ubicaciones_cursos ubicaciones_cursos_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.ubicaciones_cursos
    ADD CONSTRAINT ubicaciones_cursos_pkey PRIMARY KEY (id_ubicacion);


--
-- Name: inscripciones_cursos unique_inscripcion_curso_usuario; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.inscripciones_cursos
    ADD CONSTRAINT unique_inscripcion_curso_usuario UNIQUE (curso_id, usuario_id);


--
-- Name: asistencias_curso uq_asistencia_inscripcion_sesion; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.asistencias_curso
    ADD CONSTRAINT uq_asistencia_inscripcion_sesion UNIQUE (inscripcion_id, sesion_id);


--
-- Name: certificados_curso uq_certificado_inscripcion; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.certificados_curso
    ADD CONSTRAINT uq_certificado_inscripcion UNIQUE (inscripcion_id);


--
-- Name: compra_participantes uq_compra_numero_cupo; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.compra_participantes
    ADD CONSTRAINT uq_compra_numero_cupo UNIQUE (id_compra, numero_cupo);


--
-- Name: compra_participantes uq_compra_participante; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.compra_participantes
    ADD CONSTRAINT uq_compra_participante UNIQUE (id_compra, id_participante);


--
-- Name: inscripciones_cursos uq_inscripcion_compra_participante; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.inscripciones_cursos
    ADD CONSTRAINT uq_inscripcion_compra_participante UNIQUE (compra_participante_id);


--
-- Name: progreso_curso uq_progreso_inscripcion; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.progreso_curso
    ADD CONSTRAINT uq_progreso_inscripcion UNIQUE (inscripcion_id);


--
-- Name: requisitos_aprobacion_curso uq_requisito_aprobacion_curso; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.requisitos_aprobacion_curso
    ADD CONSTRAINT uq_requisito_aprobacion_curso UNIQUE (curso_id);


--
-- Name: resultados_evaluaciones uq_resultado_intento; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.resultados_evaluaciones
    ADD CONSTRAINT uq_resultado_intento UNIQUE (evaluacion_id, inscripcion_id, numero_intento);


--
-- Name: sesiones_curso uq_sesion_numero; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.sesiones_curso
    ADD CONSTRAINT uq_sesion_numero UNIQUE (curso_id, numero_sesion);


--
-- Name: cola_actualizacion_datasets cola_actualizacion_datasets_pkey; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.cola_actualizacion_datasets
    ADD CONSTRAINT cola_actualizacion_datasets_pkey PRIMARY KEY (id_tarea);


--
-- Name: dataset_reglas_asociacion dataset_reglas_asociacion_pkey; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_reglas_asociacion
    ADD CONSTRAINT dataset_reglas_asociacion_pkey PRIMARY KEY (id_registro);


--
-- Name: dataset_regresion_precio_cursos dataset_regresion_precio_cursos_curso_id_key; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_regresion_precio_cursos
    ADD CONSTRAINT dataset_regresion_precio_cursos_curso_id_key UNIQUE (curso_id);


--
-- Name: dataset_regresion_precio_cursos dataset_regresion_precio_cursos_pkey; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_regresion_precio_cursos
    ADD CONSTRAINT dataset_regresion_precio_cursos_pkey PRIMARY KEY (id_registro);


--
-- Name: dataset_segmentacion_clientes dataset_segmentacion_clientes_pkey; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_segmentacion_clientes
    ADD CONSTRAINT dataset_segmentacion_clientes_pkey PRIMARY KEY (id_registro);


--
-- Name: dataset_segmentacion_clientes dataset_segmentacion_clientes_usuario_id_key; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_segmentacion_clientes
    ADD CONSTRAINT dataset_segmentacion_clientes_usuario_id_key UNIQUE (usuario_id);


--
-- Name: modelos_ml modelos_ml_pkey; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.modelos_ml
    ADD CONSTRAINT modelos_ml_pkey PRIMARY KEY (id_modelo);


--
-- Name: predicciones_precio_cursos predicciones_precio_cursos_pkey; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.predicciones_precio_cursos
    ADD CONSTRAINT predicciones_precio_cursos_pkey PRIMARY KEY (id_prediccion);


--
-- Name: recomendaciones_cursos recomendaciones_cursos_pkey; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.recomendaciones_cursos
    ADD CONSTRAINT recomendaciones_cursos_pkey PRIMARY KEY (id_recomendacion);


--
-- Name: segmentos_clientes segmentos_clientes_pkey; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.segmentos_clientes
    ADD CONSTRAINT segmentos_clientes_pkey PRIMARY KEY (id_segmentacion);


--
-- Name: dataset_reglas_asociacion uq_dataset_asociacion_compra; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_reglas_asociacion
    ADD CONSTRAINT uq_dataset_asociacion_compra UNIQUE (compra_id);


--
-- Name: modelos_ml uq_modelos_ml_nombre_version; Type: CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.modelos_ml
    ADD CONSTRAINT uq_modelos_ml_nombre_version UNIQUE (nombre_modelo, version_modelo);


--
-- Name: backups backups_pkey; Type: CONSTRAINT; Schema: auditoria; Owner: -
--

ALTER TABLE ONLY auditoria.backups
    ADD CONSTRAINT backups_pkey PRIMARY KEY (id);


--
-- Name: intentos_recuperacion intentos_recuperacion_pkey; Type: CONSTRAINT; Schema: auditoria; Owner: -
--

ALTER TABLE ONLY auditoria.intentos_recuperacion
    ADD CONSTRAINT intentos_recuperacion_pkey PRIMARY KEY (id);


--
-- Name: empresa_info empresa_info_pkey; Type: CONSTRAINT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.empresa_info
    ADD CONSTRAINT empresa_info_pkey PRIMARY KEY (id);


--
-- Name: medicos medicos_pkey; Type: CONSTRAINT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.medicos
    ADD CONSTRAINT medicos_pkey PRIMARY KEY (id_medico);


--
-- Name: nosotros nosotros_pkey; Type: CONSTRAINT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.nosotros
    ADD CONSTRAINT nosotros_pkey PRIMARY KEY (id);


--
-- Name: servicios servicios_pkey; Type: CONSTRAINT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.servicios
    ADD CONSTRAINT servicios_pkey PRIMARY KEY (id_servicio);


--
-- Name: alertas_seguridad alertas_seguridad_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.alertas_seguridad
    ADD CONSTRAINT alertas_seguridad_pkey PRIMARY KEY (id_alerta);


--
-- Name: auditoria_acciones auditoria_acciones_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.auditoria_acciones
    ADD CONSTRAINT auditoria_acciones_pkey PRIMARY KEY (id_auditoria);


--
-- Name: cambios_estructura cambios_estructura_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.cambios_estructura
    ADD CONSTRAINT cambios_estructura_pkey PRIMARY KEY (id_cambio);


--
-- Name: estadisticas_consumo estadisticas_consumo_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.estadisticas_consumo
    ADD CONSTRAINT estadisticas_consumo_pkey PRIMARY KEY (id_estadistica);


--
-- Name: monitoreo_rendimiento monitoreo_rendimiento_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.monitoreo_rendimiento
    ADD CONSTRAINT monitoreo_rendimiento_pkey PRIMARY KEY (id_monitoreo);


--
-- Name: roles roles_nombre_unique; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.roles
    ADD CONSTRAINT roles_nombre_unique UNIQUE (nombre);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_correo_unique; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuarios
    ADD CONSTRAINT usuarios_correo_unique UNIQUE (correo);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: categorias_ayuda categorias_ayuda_nombre_key; Type: CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.categorias_ayuda
    ADD CONSTRAINT categorias_ayuda_nombre_key UNIQUE (nombre_categoria);


--
-- Name: categorias_ayuda categorias_ayuda_pkey; Type: CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.categorias_ayuda
    ADD CONSTRAINT categorias_ayuda_pkey PRIMARY KEY (id_categoria);


--
-- Name: preguntas_frecuentes preguntas_frecuentes_pkey; Type: CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.preguntas_frecuentes
    ADD CONSTRAINT preguntas_frecuentes_pkey PRIMARY KEY (id_pregunta);


--
-- Name: preguntas_usuarios preguntas_usuarios_pkey; Type: CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.preguntas_usuarios
    ADD CONSTRAINT preguntas_usuarios_pkey PRIMARY KEY (id_pregunta);


--
-- Name: respuestas_ayuda respuestas_ayuda_pkey; Type: CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.respuestas_ayuda
    ADD CONSTRAINT respuestas_ayuda_pkey PRIMARY KEY (id_respuesta);


--
-- Name: valoraciones_faq unique_valoracion_usuario_faq; Type: CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.valoraciones_faq
    ADD CONSTRAINT unique_valoracion_usuario_faq UNIQUE (id_pregunta_faq, id_usuario);


--
-- Name: valoraciones_faq valoraciones_faq_pkey; Type: CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.valoraciones_faq
    ADD CONSTRAINT valoraciones_faq_pkey PRIMARY KEY (id_valoracion);


--
-- Name: idx_asistencias_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_asistencias_estado ON academia.asistencias_curso USING btree (estado_asistencia);


--
-- Name: idx_asistencias_fecha_registro; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_asistencias_fecha_registro ON academia.asistencias_curso USING btree (fecha_registro);


--
-- Name: idx_asistencias_inscripcion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_asistencias_inscripcion ON academia.asistencias_curso USING btree (inscripcion_id);


--
-- Name: idx_asistencias_sesion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_asistencias_sesion ON academia.asistencias_curso USING btree (sesion_id);


--
-- Name: idx_asistencias_sesion_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_asistencias_sesion_estado ON academia.asistencias_curso USING btree (sesion_id, estado_asistencia);


--
-- Name: idx_asistencias_usuario_registra; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_asistencias_usuario_registra ON academia.asistencias_curso USING btree (usuario_registra);


--
-- Name: idx_certificados_codigo; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_certificados_codigo ON academia.certificados_curso USING btree (codigo_verificacion);


--
-- Name: idx_certificados_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_certificados_estado ON academia.certificados_curso USING btree (estado);


--
-- Name: idx_certificados_fecha_emision; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_certificados_fecha_emision ON academia.certificados_curso USING btree (fecha_emision);


--
-- Name: idx_certificados_inscripcion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_certificados_inscripcion ON academia.certificados_curso USING btree (inscripcion_id);


--
-- Name: idx_certificados_usuario_emite; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_certificados_usuario_emite ON academia.certificados_curso USING btree (usuario_emite);


--
-- Name: idx_certificados_usuario_revoca; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_certificados_usuario_revoca ON academia.certificados_curso USING btree (usuario_revoca);


--
-- Name: idx_compra_curso; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compra_curso ON academia.comprascursosinacademia USING btree (idcurso);


--
-- Name: idx_compra_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compra_estado ON academia.comprascursosinacademia USING btree (idestadocompra);


--
-- Name: idx_compra_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compra_fecha ON academia.comprascursosinacademia USING btree (fechacompra);


--
-- Name: idx_compra_participantes_compra; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compra_participantes_compra ON academia.compra_participantes USING btree (id_compra);


--
-- Name: idx_compra_participantes_compra_cupo; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compra_participantes_compra_cupo ON academia.compra_participantes USING btree (id_compra, numero_cupo);


--
-- Name: idx_compra_participantes_compra_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compra_participantes_compra_estado ON academia.compra_participantes USING btree (id_compra, estado);


--
-- Name: idx_compra_participantes_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compra_participantes_estado ON academia.compra_participantes USING btree (estado);


--
-- Name: idx_compra_participantes_participante; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compra_participantes_participante ON academia.compra_participantes USING btree (id_participante);


--
-- Name: idx_compra_usuario; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compra_usuario ON academia.comprascursosinacademia USING btree (idusuario);


--
-- Name: idx_compras_cursos_curso; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compras_cursos_curso ON academia.comprascursosinacademia USING btree (idcurso);


--
-- Name: idx_compras_cursos_curso_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compras_cursos_curso_estado ON academia.comprascursosinacademia USING btree (idcurso, idestadocompra);


--
-- Name: idx_compras_cursos_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compras_cursos_estado ON academia.comprascursosinacademia USING btree (idestadocompra);


--
-- Name: idx_compras_cursos_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compras_cursos_fecha ON academia.comprascursosinacademia USING btree (fechacompra);


--
-- Name: idx_compras_cursos_limite_pago; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compras_cursos_limite_pago ON academia.comprascursosinacademia USING btree (fechalimitepago, idcompra) WHERE (fechalimitepago IS NOT NULL);


--
-- Name: idx_compras_cursos_usuario; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compras_cursos_usuario ON academia.comprascursosinacademia USING btree (idusuario);


--
-- Name: idx_compras_cursos_usuario_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_compras_cursos_usuario_fecha ON academia.comprascursosinacademia USING btree (idusuario, fechacompra DESC);


--
-- Name: idx_cursos_activo; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_cursos_activo ON academia.cursos USING btree (activo);


--
-- Name: idx_cursos_categoria; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_cursos_categoria ON academia.cursos USING btree (id_categoria);


--
-- Name: idx_cursos_dirigido_a; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_cursos_dirigido_a ON academia.cursos USING btree (dirigido_a);


--
-- Name: idx_cursos_fechas; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_cursos_fechas ON academia.cursos USING btree (fecha_inicio, fecha_fin);


--
-- Name: idx_cursos_instructor; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_cursos_instructor ON academia.cursos USING btree (id_instructor);


--
-- Name: idx_cursos_modalidad; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_cursos_modalidad ON academia.cursos USING btree (id_modalidad);


--
-- Name: idx_evaluaciones_curso; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_evaluaciones_curso ON academia.evaluaciones_curso USING btree (curso_id);


--
-- Name: idx_evaluaciones_curso_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_evaluaciones_curso_estado ON academia.evaluaciones_curso USING btree (curso_id, estado);


--
-- Name: idx_evaluaciones_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_evaluaciones_estado ON academia.evaluaciones_curso USING btree (estado);


--
-- Name: idx_evaluaciones_fecha_limite; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_evaluaciones_fecha_limite ON academia.evaluaciones_curso USING btree (fecha_limite);


--
-- Name: idx_evaluaciones_sesion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_evaluaciones_sesion ON academia.evaluaciones_curso USING btree (sesion_id);


--
-- Name: idx_evaluaciones_tipo; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_evaluaciones_tipo ON academia.evaluaciones_curso USING btree (tipo_evaluacion);


--
-- Name: idx_historial_estado_nuevo; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_historial_estado_nuevo ON academia.historial_estados_compra USING btree (id_estado_nuevo);


--
-- Name: idx_historial_estados_compra; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_historial_estados_compra ON academia.historial_estados_compra USING btree (id_compra);


--
-- Name: idx_historial_estados_compra_compra; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_historial_estados_compra_compra ON academia.historial_estados_compra USING btree (id_compra);


--
-- Name: idx_historial_estados_compra_compra_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_historial_estados_compra_compra_fecha ON academia.historial_estados_compra USING btree (id_compra, fecha_cambio DESC);


--
-- Name: idx_historial_estados_compra_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_historial_estados_compra_fecha ON academia.historial_estados_compra USING btree (fecha_cambio);


--
-- Name: idx_historial_estados_curso_curso; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_historial_estados_curso_curso ON academia.historial_estados_curso USING btree (curso_id);


--
-- Name: idx_historial_estados_curso_estado_nuevo; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_historial_estados_curso_estado_nuevo ON academia.historial_estados_curso USING btree (estado_nuevo);


--
-- Name: idx_historial_estados_curso_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_historial_estados_curso_fecha ON academia.historial_estados_curso USING btree (fecha_cambio);


--
-- Name: idx_historial_estados_curso_usuario; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_historial_estados_curso_usuario ON academia.historial_estados_curso USING btree (usuario_responsable);


--
-- Name: idx_historial_estados_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_historial_estados_fecha ON academia.historial_estados_compra USING btree (fecha_cambio);


--
-- Name: idx_historial_usuario_responsable; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_historial_usuario_responsable ON academia.historial_estados_compra USING btree (usuario_responsable);


--
-- Name: idx_inscripciones_compra_participante; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_inscripciones_compra_participante ON academia.inscripciones_cursos USING btree (compra_participante_id);


--
-- Name: idx_inscripciones_curso; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_inscripciones_curso ON academia.inscripciones_cursos USING btree (curso_id);


--
-- Name: idx_inscripciones_curso_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_inscripciones_curso_estado ON academia.inscripciones_cursos USING btree (curso_id, estado);


--
-- Name: idx_inscripciones_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_inscripciones_estado ON academia.inscripciones_cursos USING btree (estado);


--
-- Name: idx_inscripciones_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_inscripciones_fecha ON academia.inscripciones_cursos USING btree (fecha_inscripcion DESC);


--
-- Name: idx_inscripciones_origen; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_inscripciones_origen ON academia.inscripciones_cursos USING btree (origen_inscripcion);


--
-- Name: idx_inscripciones_participante; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_inscripciones_participante ON academia.inscripciones_cursos USING btree (participante_id);


--
-- Name: idx_inscripciones_usuario; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_inscripciones_usuario ON academia.inscripciones_cursos USING btree (usuario_id);


--
-- Name: idx_instructores_activo; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_instructores_activo ON academia.instructores USING btree (activo);


--
-- Name: idx_instructores_especialidad; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_instructores_especialidad ON academia.instructores USING btree (especialidad);


--
-- Name: idx_movimientos_cupos_compra; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_movimientos_cupos_compra ON academia.movimientos_cupos_curso USING btree (compra_id);


--
-- Name: idx_movimientos_cupos_curso; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_movimientos_cupos_curso ON academia.movimientos_cupos_curso USING btree (curso_id);


--
-- Name: idx_movimientos_cupos_curso_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_movimientos_cupos_curso_fecha ON academia.movimientos_cupos_curso USING btree (curso_id, fecha_movimiento DESC);


--
-- Name: idx_movimientos_cupos_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_movimientos_cupos_fecha ON academia.movimientos_cupos_curso USING btree (fecha_movimiento);


--
-- Name: idx_movimientos_cupos_tipo; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_movimientos_cupos_tipo ON academia.movimientos_cupos_curso USING btree (tipo_movimiento);


--
-- Name: idx_movimientos_cupos_usuario; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_movimientos_cupos_usuario ON academia.movimientos_cupos_curso USING btree (usuario_responsable);


--
-- Name: idx_notificaciones_curso; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_notificaciones_curso ON academia.notificaciones_academicas USING btree (curso_id);


--
-- Name: idx_notificaciones_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_notificaciones_estado ON academia.notificaciones_academicas USING btree (estado_envio);


--
-- Name: idx_notificaciones_evaluacion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_notificaciones_evaluacion ON academia.notificaciones_academicas USING btree (evaluacion_id);


--
-- Name: idx_notificaciones_fecha_programada; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_notificaciones_fecha_programada ON academia.notificaciones_academicas USING btree (fecha_programada);


--
-- Name: idx_notificaciones_inscripcion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_notificaciones_inscripcion ON academia.notificaciones_academicas USING btree (inscripcion_id);


--
-- Name: idx_notificaciones_pendientes; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_notificaciones_pendientes ON academia.notificaciones_academicas USING btree (fecha_programada) WHERE ((estado_envio)::text = 'Pendiente'::text);


--
-- Name: idx_notificaciones_sesion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_notificaciones_sesion ON academia.notificaciones_academicas USING btree (sesion_id);


--
-- Name: idx_pagos_cursos_compra; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_pagos_cursos_compra ON academia.pagos_cursos USING btree (id_compra);


--
-- Name: idx_pagos_cursos_compra_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_pagos_cursos_compra_estado ON academia.pagos_cursos USING btree (id_compra, estado);


--
-- Name: idx_pagos_cursos_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_pagos_cursos_estado ON academia.pagos_cursos USING btree (estado);


--
-- Name: idx_pagos_cursos_fecha_reporte; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_pagos_cursos_fecha_reporte ON academia.pagos_cursos USING btree (fecha_reporte);


--
-- Name: idx_pagos_cursos_metodo; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_pagos_cursos_metodo ON academia.pagos_cursos USING btree (id_metodo_pago);


--
-- Name: idx_pagos_cursos_reportados; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_pagos_cursos_reportados ON academia.pagos_cursos USING btree (fecha_reporte, id_pago) WHERE ((estado)::text = 'Reportado'::text);


--
-- Name: idx_pagos_cursos_usuario_valida; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_pagos_cursos_usuario_valida ON academia.pagos_cursos USING btree (usuario_valida);


--
-- Name: idx_participante_nombre; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_participante_nombre ON academia.participantes USING btree (apellido_paterno, apellido_materno, nombre);


--
-- Name: idx_participante_usuario; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_participante_usuario ON academia.participantes USING btree (usuario_id);


--
-- Name: idx_participantes_activos; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_participantes_activos ON academia.participantes USING btree (id_participante) WHERE (activo = true);


--
-- Name: idx_participantes_correo; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_participantes_correo ON academia.participantes USING btree (correo);


--
-- Name: idx_participantes_nombre; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_participantes_nombre ON academia.participantes USING btree (apellido_paterno, apellido_materno, nombre);


--
-- Name: idx_participantes_usuario; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_participantes_usuario ON academia.participantes USING btree (usuario_id);


--
-- Name: idx_progreso_actualizacion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_progreso_actualizacion ON academia.progreso_curso USING btree (fecha_ultima_actividad);


--
-- Name: idx_progreso_asistencia; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_progreso_asistencia ON academia.progreso_curso USING btree (porcentaje_asistencia);


--
-- Name: idx_progreso_avance; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_progreso_avance ON academia.progreso_curso USING btree (porcentaje_avance);


--
-- Name: idx_progreso_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_progreso_estado ON academia.progreso_curso USING btree (estado_academico);


--
-- Name: idx_progreso_finalizacion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_progreso_finalizacion ON academia.progreso_curso USING btree (fecha_finalizacion) WHERE (fecha_finalizacion IS NOT NULL);


--
-- Name: idx_progreso_inscripcion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_progreso_inscripcion ON academia.progreso_curso USING btree (inscripcion_id);


--
-- Name: idx_progreso_ultima_actividad; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_progreso_ultima_actividad ON academia.progreso_curso USING btree (fecha_ultima_actividad);


--
-- Name: idx_requisitos_aprobacion_vigentes; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_requisitos_aprobacion_vigentes ON academia.requisitos_aprobacion_curso USING btree (curso_id) WHERE (vigente = true);


--
-- Name: idx_resultados_aprobado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_resultados_aprobado ON academia.resultados_evaluaciones USING btree (aprobado);


--
-- Name: idx_resultados_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_resultados_estado ON academia.resultados_evaluaciones USING btree (estado_resultado);


--
-- Name: idx_resultados_evaluacion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_resultados_evaluacion ON academia.resultados_evaluaciones USING btree (evaluacion_id);


--
-- Name: idx_resultados_evaluacion_inscripcion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_resultados_evaluacion_inscripcion ON academia.resultados_evaluaciones USING btree (evaluacion_id, inscripcion_id);


--
-- Name: idx_resultados_fecha_entrega; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_resultados_fecha_entrega ON academia.resultados_evaluaciones USING btree (fecha_entrega);


--
-- Name: idx_resultados_inscripcion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_resultados_inscripcion ON academia.resultados_evaluaciones USING btree (inscripcion_id);


--
-- Name: idx_resultados_usuario_califica; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_resultados_usuario_califica ON academia.resultados_evaluaciones USING btree (usuario_califica);


--
-- Name: idx_sesiones_curso; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_sesiones_curso ON academia.sesiones_curso USING btree (curso_id);


--
-- Name: idx_sesiones_curso_curso; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_sesiones_curso_curso ON academia.sesiones_curso USING btree (curso_id);


--
-- Name: idx_sesiones_curso_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_sesiones_curso_estado ON academia.sesiones_curso USING btree (estado);


--
-- Name: idx_sesiones_curso_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_sesiones_curso_fecha ON academia.sesiones_curso USING btree (fecha);


--
-- Name: idx_sesiones_curso_modalidad; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_sesiones_curso_modalidad ON academia.sesiones_curso USING btree (modalidad_id);


--
-- Name: idx_sesiones_curso_ubicacion; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_sesiones_curso_ubicacion ON academia.sesiones_curso USING btree (ubicacion_id);


--
-- Name: idx_sesiones_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_sesiones_estado ON academia.sesiones_curso USING btree (estado);


--
-- Name: idx_sesiones_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_sesiones_fecha ON academia.sesiones_curso USING btree (fecha);


--
-- Name: uq_asistencias_sesion_inscripcion; Type: INDEX; Schema: academia; Owner: -
--

CREATE UNIQUE INDEX uq_asistencias_sesion_inscripcion ON academia.asistencias_curso USING btree (sesion_id, inscripcion_id);


--
-- Name: uq_certificados_codigo_verificacion; Type: INDEX; Schema: academia; Owner: -
--

CREATE UNIQUE INDEX uq_certificados_codigo_verificacion ON academia.certificados_curso USING btree (codigo_verificacion) WHERE (codigo_verificacion IS NOT NULL);


--
-- Name: uq_certificados_folio; Type: INDEX; Schema: academia; Owner: -
--

CREATE UNIQUE INDEX uq_certificados_folio ON academia.certificados_curso USING btree (folio_certificado);


--
-- Name: uq_certificados_inscripcion; Type: INDEX; Schema: academia; Owner: -
--

CREATE UNIQUE INDEX uq_certificados_inscripcion ON academia.certificados_curso USING btree (inscripcion_id);


--
-- Name: uq_compra_participantes_numero_cupo; Type: INDEX; Schema: academia; Owner: -
--

CREATE UNIQUE INDEX uq_compra_participantes_numero_cupo ON academia.compra_participantes USING btree (id_compra, numero_cupo);


--
-- Name: uq_compra_participantes_participante; Type: INDEX; Schema: academia; Owner: -
--

CREATE UNIQUE INDEX uq_compra_participantes_participante ON academia.compra_participantes USING btree (id_compra, id_participante);


--
-- Name: uq_compras_cursos_folio; Type: INDEX; Schema: academia; Owner: -
--

CREATE UNIQUE INDEX uq_compras_cursos_folio ON academia.comprascursosinacademia USING btree (foliocompra);


--
-- Name: uq_inscripcion_curso_participante; Type: INDEX; Schema: academia; Owner: -
--

CREATE UNIQUE INDEX uq_inscripcion_curso_participante ON academia.inscripciones_cursos USING btree (curso_id, participante_id) WHERE (participante_id IS NOT NULL);


--
-- Name: uq_inscripciones_compra_participante; Type: INDEX; Schema: academia; Owner: -
--

CREATE UNIQUE INDEX uq_inscripciones_compra_participante ON academia.inscripciones_cursos USING btree (compra_participante_id) WHERE (compra_participante_id IS NOT NULL);


--
-- Name: uq_resultados_evaluacion_inscripcion; Type: INDEX; Schema: academia; Owner: -
--

CREATE UNIQUE INDEX uq_resultados_evaluacion_inscripcion ON academia.resultados_evaluaciones USING btree (evaluacion_id, inscripcion_id);


--
-- Name: idx_cola_datasets_completadas_recientes; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_cola_datasets_completadas_recientes ON analitica.cola_actualizacion_datasets USING btree (fecha_fin_proceso DESC) WHERE ((estado)::text = 'Completada'::text);


--
-- Name: idx_cola_datasets_destino; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_cola_datasets_destino ON analitica.cola_actualizacion_datasets USING btree (dataset_destino);


--
-- Name: idx_cola_datasets_estado; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_cola_datasets_estado ON analitica.cola_actualizacion_datasets USING btree (estado);


--
-- Name: idx_cola_datasets_fallidas; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_cola_datasets_fallidas ON analitica.cola_actualizacion_datasets USING btree (intentos, fecha_fin_proceso DESC) WHERE ((estado)::text = 'Fallida'::text);


--
-- Name: idx_cola_datasets_fecha_programada; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_cola_datasets_fecha_programada ON analitica.cola_actualizacion_datasets USING btree (fecha_programada);


--
-- Name: idx_cola_datasets_origen; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_cola_datasets_origen ON analitica.cola_actualizacion_datasets USING btree (tabla_origen, registro_origen_id);


--
-- Name: idx_cola_datasets_origen_estado; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_cola_datasets_origen_estado ON analitica.cola_actualizacion_datasets USING btree (tabla_origen, registro_origen_id, estado);


--
-- Name: idx_cola_datasets_pendientes; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_cola_datasets_pendientes ON analitica.cola_actualizacion_datasets USING btree (prioridad, fecha_programada, id_tarea) WHERE ((estado)::text = 'Pendiente'::text);


--
-- Name: idx_dataset_asociacion_activos; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_asociacion_activos ON analitica.dataset_reglas_asociacion USING btree (id_transaccion_analitica, curso_id) WHERE (activo_dataset = true);


--
-- Name: idx_dataset_asociacion_categoria; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_asociacion_categoria ON analitica.dataset_reglas_asociacion USING btree (categoria_id);


--
-- Name: idx_dataset_asociacion_curso; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_asociacion_curso ON analitica.dataset_reglas_asociacion USING btree (curso_id);


--
-- Name: idx_dataset_asociacion_estado; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_asociacion_estado ON analitica.dataset_reglas_asociacion USING btree (estado_compra);


--
-- Name: idx_dataset_asociacion_fecha; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_asociacion_fecha ON analitica.dataset_reglas_asociacion USING btree (fecha_compra);


--
-- Name: idx_dataset_asociacion_modalidad; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_asociacion_modalidad ON analitica.dataset_reglas_asociacion USING btree (modalidad_id);


--
-- Name: idx_dataset_asociacion_periodo; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_asociacion_periodo ON analitica.dataset_reglas_asociacion USING btree (anio_compra, mes_compra);


--
-- Name: idx_dataset_asociacion_transaccion; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_asociacion_transaccion ON analitica.dataset_reglas_asociacion USING btree (id_transaccion_analitica);


--
-- Name: idx_dataset_asociacion_usuario; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_asociacion_usuario ON analitica.dataset_reglas_asociacion USING btree (usuario_id);


--
-- Name: idx_dataset_asociacion_usuario_curso; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_asociacion_usuario_curso ON analitica.dataset_reglas_asociacion USING btree (usuario_id, curso_id);


--
-- Name: idx_dataset_regresion_activos; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_regresion_activos ON analitica.dataset_regresion_precio_cursos USING btree (curso_id) WHERE (activo_dataset = true);


--
-- Name: idx_dataset_regresion_activos_fecha; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_regresion_activos_fecha ON analitica.dataset_regresion_precio_cursos USING btree (fecha_inicio DESC) WHERE (activo_dataset = true);


--
-- Name: idx_dataset_regresion_categoria; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_regresion_categoria ON analitica.dataset_regresion_precio_cursos USING btree (categoria_id);


--
-- Name: idx_dataset_regresion_categoria_modalidad; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_regresion_categoria_modalidad ON analitica.dataset_regresion_precio_cursos USING btree (categoria_id, modalidad_id);


--
-- Name: idx_dataset_regresion_fecha_inicio; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_regresion_fecha_inicio ON analitica.dataset_regresion_precio_cursos USING btree (fecha_inicio);


--
-- Name: idx_dataset_regresion_fecha_ocupacion; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_regresion_fecha_ocupacion ON analitica.dataset_regresion_precio_cursos USING btree (fecha_inicio, porcentaje_ocupacion);


--
-- Name: idx_dataset_regresion_modalidad; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_regresion_modalidad ON analitica.dataset_regresion_precio_cursos USING btree (modalidad_id);


--
-- Name: idx_dataset_regresion_ocupacion; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_regresion_ocupacion ON analitica.dataset_regresion_precio_cursos USING btree (porcentaje_ocupacion);


--
-- Name: idx_dataset_regresion_precio; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_regresion_precio ON analitica.dataset_regresion_precio_cursos USING btree (precio_historico);


--
-- Name: idx_dataset_segmentacion_activos; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_segmentacion_activos ON analitica.dataset_segmentacion_clientes USING btree (usuario_id) WHERE (activo_dataset = true);


--
-- Name: idx_dataset_segmentacion_compras_validas; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_segmentacion_compras_validas ON analitica.dataset_segmentacion_clientes USING btree (total_compras_validas);


--
-- Name: idx_dataset_segmentacion_conversion; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_segmentacion_conversion ON analitica.dataset_segmentacion_clientes USING btree (tasa_conversion);


--
-- Name: idx_dataset_segmentacion_recencia; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_segmentacion_recencia ON analitica.dataset_segmentacion_clientes USING btree (dias_desde_ultima_compra);


--
-- Name: idx_dataset_segmentacion_total_gastado; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_segmentacion_total_gastado ON analitica.dataset_segmentacion_clientes USING btree (total_gastado);


--
-- Name: idx_dataset_segmentacion_ultima_compra; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_segmentacion_ultima_compra ON analitica.dataset_segmentacion_clientes USING btree (fecha_ultima_compra);


--
-- Name: idx_dataset_segmentacion_valor_frecuencia; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_dataset_segmentacion_valor_frecuencia ON analitica.dataset_segmentacion_clientes USING btree (total_gastado DESC, total_compras_validas DESC) WHERE (activo_dataset = true);


--
-- Name: idx_modelos_ml_activos; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_modelos_ml_activos ON analitica.modelos_ml USING btree (tipo_modelo, fecha_despliegue DESC) WHERE (es_modelo_activo = true);


--
-- Name: idx_modelos_ml_estado; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_modelos_ml_estado ON analitica.modelos_ml USING btree (estado);


--
-- Name: idx_modelos_ml_fecha_entrenamiento; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_modelos_ml_fecha_entrenamiento ON analitica.modelos_ml USING btree (fecha_entrenamiento DESC);


--
-- Name: idx_modelos_ml_tipo; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_modelos_ml_tipo ON analitica.modelos_ml USING btree (tipo_modelo);


--
-- Name: idx_mv_metricas_mensuales_anio_mes; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_mv_metricas_mensuales_anio_mes ON analitica.mv_metricas_mensuales_cursos USING btree (anio, mes);


--
-- Name: idx_predicciones_precio_curso; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_predicciones_precio_curso ON analitica.predicciones_precio_cursos USING btree (curso_id);


--
-- Name: idx_predicciones_precio_curso_fecha; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_predicciones_precio_curso_fecha ON analitica.predicciones_precio_cursos USING btree (curso_id, fecha_prediccion DESC);


--
-- Name: idx_predicciones_precio_estado; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_predicciones_precio_estado ON analitica.predicciones_precio_cursos USING btree (estado);


--
-- Name: idx_predicciones_precio_fecha; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_predicciones_precio_fecha ON analitica.predicciones_precio_cursos USING btree (fecha_prediccion DESC);


--
-- Name: idx_predicciones_precio_modelo; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_predicciones_precio_modelo ON analitica.predicciones_precio_cursos USING btree (modelo_id);


--
-- Name: idx_recomendaciones_curso; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_recomendaciones_curso ON analitica.recomendaciones_cursos USING btree (curso_recomendado_id);


--
-- Name: idx_recomendaciones_estado; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_recomendaciones_estado ON analitica.recomendaciones_cursos USING btree (estado);


--
-- Name: idx_recomendaciones_expiracion; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_recomendaciones_expiracion ON analitica.recomendaciones_cursos USING btree (fecha_expiracion) WHERE ((estado)::text = 'Activa'::text);


--
-- Name: idx_recomendaciones_modelo; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_recomendaciones_modelo ON analitica.recomendaciones_cursos USING btree (modelo_id);


--
-- Name: idx_recomendaciones_usuario; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_recomendaciones_usuario ON analitica.recomendaciones_cursos USING btree (usuario_id);


--
-- Name: idx_recomendaciones_usuario_estado; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_recomendaciones_usuario_estado ON analitica.recomendaciones_cursos USING btree (usuario_id, estado, puntuacion_recomendacion DESC);


--
-- Name: idx_segmentos_clientes_fecha; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_segmentos_clientes_fecha ON analitica.segmentos_clientes USING btree (fecha_asignacion DESC);


--
-- Name: idx_segmentos_clientes_modelo; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_segmentos_clientes_modelo ON analitica.segmentos_clientes USING btree (modelo_id);


--
-- Name: idx_segmentos_clientes_nombre; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_segmentos_clientes_nombre ON analitica.segmentos_clientes USING btree (nombre_segmento);


--
-- Name: idx_segmentos_clientes_usuario; Type: INDEX; Schema: analitica; Owner: -
--

CREATE INDEX idx_segmentos_clientes_usuario ON analitica.segmentos_clientes USING btree (usuario_id);


--
-- Name: uq_mv_indicadores_generales; Type: INDEX; Schema: analitica; Owner: -
--

CREATE UNIQUE INDEX uq_mv_indicadores_generales ON analitica.mv_indicadores_generales USING btree (id_resumen);


--
-- Name: uq_mv_metricas_mensuales_periodo; Type: INDEX; Schema: analitica; Owner: -
--

CREATE UNIQUE INDEX uq_mv_metricas_mensuales_periodo ON analitica.mv_metricas_mensuales_cursos USING btree (periodo);


--
-- Name: uq_prediccion_vigente_curso_modelo; Type: INDEX; Schema: analitica; Owner: -
--

CREATE UNIQUE INDEX uq_prediccion_vigente_curso_modelo ON analitica.predicciones_precio_cursos USING btree (curso_id, modelo_id) WHERE (vigente = true);


--
-- Name: uq_segmento_vigente_usuario_modelo; Type: INDEX; Schema: analitica; Owner: -
--

CREATE UNIQUE INDEX uq_segmento_vigente_usuario_modelo ON analitica.segmentos_clientes USING btree (usuario_id, modelo_id) WHERE (vigente = true);


--
-- Name: idx_backups_fecha; Type: INDEX; Schema: auditoria; Owner: -
--

CREATE INDEX idx_backups_fecha ON auditoria.backups USING btree (fecha DESC);


--
-- Name: idx_backups_tipo; Type: INDEX; Schema: auditoria; Owner: -
--

CREATE INDEX idx_backups_tipo ON auditoria.backups USING btree (tipo);


--
-- Name: idx_categorias_ayuda_orden; Type: INDEX; Schema: soporte; Owner: -
--

CREATE INDEX idx_categorias_ayuda_orden ON soporte.categorias_ayuda USING btree (orden);


--
-- Name: idx_preguntas_frecuentes_categoria; Type: INDEX; Schema: soporte; Owner: -
--

CREATE INDEX idx_preguntas_frecuentes_categoria ON soporte.preguntas_frecuentes USING btree (id_categoria);


--
-- Name: idx_preguntas_frecuentes_destacada; Type: INDEX; Schema: soporte; Owner: -
--

CREATE INDEX idx_preguntas_frecuentes_destacada ON soporte.preguntas_frecuentes USING btree (es_destacada);


--
-- Name: idx_preguntas_frecuentes_orden; Type: INDEX; Schema: soporte; Owner: -
--

CREATE INDEX idx_preguntas_frecuentes_orden ON soporte.preguntas_frecuentes USING btree (orden);


--
-- Name: idx_preguntas_usuarios_estado; Type: INDEX; Schema: soporte; Owner: -
--

CREATE INDEX idx_preguntas_usuarios_estado ON soporte.preguntas_usuarios USING btree (estado);


--
-- Name: idx_preguntas_usuarios_fecha; Type: INDEX; Schema: soporte; Owner: -
--

CREATE INDEX idx_preguntas_usuarios_fecha ON soporte.preguntas_usuarios USING btree (created_at DESC);


--
-- Name: idx_preguntas_usuarios_usuario; Type: INDEX; Schema: soporte; Owner: -
--

CREATE INDEX idx_preguntas_usuarios_usuario ON soporte.preguntas_usuarios USING btree (id_usuario);


--
-- Name: idx_respuestas_fecha; Type: INDEX; Schema: soporte; Owner: -
--

CREATE INDEX idx_respuestas_fecha ON soporte.respuestas_ayuda USING btree (created_at);


--
-- Name: idx_respuestas_pregunta; Type: INDEX; Schema: soporte; Owner: -
--

CREATE INDEX idx_respuestas_pregunta ON soporte.respuestas_ayuda USING btree (id_pregunta);


--
-- Name: comprascursosinacademia trg_compras_cola_analitica; Type: TRIGGER; Schema: academia; Owner: -
--

CREATE TRIGGER trg_compras_cola_analitica AFTER INSERT OR DELETE OR UPDATE ON academia.comprascursosinacademia FOR EACH ROW EXECUTE FUNCTION analitica.registrar_actualizacion_dataset('Todos', 'idcompra', '2');


--
-- Name: cursos trg_cursos_cola_analitica; Type: TRIGGER; Schema: academia; Owner: -
--

CREATE TRIGGER trg_cursos_cola_analitica AFTER INSERT OR DELETE OR UPDATE OF titulo_curso, id_categoria, id_ubicacion, id_modalidad, fecha_inicio, fecha_fin, cupo_maximo, costo, activo, cupos_ocupados ON academia.cursos FOR EACH ROW EXECUTE FUNCTION analitica.registrar_actualizacion_dataset('Regresión de precios', 'id_curso', '4');


--
-- Name: pagos_cursos trg_pagos_cola_analitica; Type: TRIGGER; Schema: academia; Owner: -
--

CREATE TRIGGER trg_pagos_cola_analitica AFTER INSERT OR DELETE OR UPDATE ON academia.pagos_cursos FOR EACH ROW EXECUTE FUNCTION analitica.registrar_actualizacion_dataset('Todos', 'id_pago', '2');


--
-- Name: medicos trg_audit_medicos; Type: TRIGGER; Schema: clinica; Owner: -
--

CREATE TRIGGER trg_audit_medicos AFTER INSERT OR DELETE OR UPDATE ON clinica.medicos FOR EACH ROW EXECUTE FUNCTION seguridad.fn_auditar_cambios();


--
-- Name: nosotros trg_audit_nosotros; Type: TRIGGER; Schema: clinica; Owner: -
--

CREATE TRIGGER trg_audit_nosotros AFTER INSERT OR DELETE OR UPDATE ON clinica.nosotros FOR EACH ROW EXECUTE FUNCTION seguridad.fn_auditar_cambios();


--
-- Name: servicios trg_audit_servicios; Type: TRIGGER; Schema: clinica; Owner: -
--

CREATE TRIGGER trg_audit_servicios AFTER INSERT OR DELETE OR UPDATE ON clinica.servicios FOR EACH ROW EXECUTE FUNCTION seguridad.fn_auditar_cambios();


--
-- Name: usuarios trg_audit_usuarios; Type: TRIGGER; Schema: seguridad; Owner: -
--

CREATE TRIGGER trg_audit_usuarios AFTER INSERT OR DELETE OR UPDATE ON seguridad.usuarios FOR EACH ROW EXECUTE FUNCTION seguridad.fn_auditar_cambios();


--
-- Name: academia_infantil academia_infantil_id_autor_fkey; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.academia_infantil
    ADD CONSTRAINT academia_infantil_id_autor_fkey FOREIGN KEY (id_autor) REFERENCES clinica.medicos(id_medico);


--
-- Name: encuestas encuestas_contenido_id_fkey; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.encuestas
    ADD CONSTRAINT encuestas_contenido_id_fkey FOREIGN KEY (contenido_id) REFERENCES academia.contenido_saber_pediatrico(id);


--
-- Name: asistencias_curso fk_asistencia_inscripcion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.asistencias_curso
    ADD CONSTRAINT fk_asistencia_inscripcion FOREIGN KEY (inscripcion_id) REFERENCES academia.inscripciones_cursos(id_inscripcion) ON DELETE RESTRICT;


--
-- Name: asistencias_curso fk_asistencia_sesion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.asistencias_curso
    ADD CONSTRAINT fk_asistencia_sesion FOREIGN KEY (sesion_id) REFERENCES academia.sesiones_curso(id_sesion) ON DELETE RESTRICT;


--
-- Name: asistencias_curso fk_asistencia_usuario; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.asistencias_curso
    ADD CONSTRAINT fk_asistencia_usuario FOREIGN KEY (usuario_registra) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: certificados_curso fk_certificado_inscripcion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.certificados_curso
    ADD CONSTRAINT fk_certificado_inscripcion FOREIGN KEY (inscripcion_id) REFERENCES academia.inscripciones_cursos(id_inscripcion) ON DELETE RESTRICT;


--
-- Name: certificados_curso fk_certificado_usuario_emite; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.certificados_curso
    ADD CONSTRAINT fk_certificado_usuario_emite FOREIGN KEY (usuario_emite) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: certificados_curso fk_certificado_usuario_revoca; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.certificados_curso
    ADD CONSTRAINT fk_certificado_usuario_revoca FOREIGN KEY (usuario_revoca) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: comprascursosinacademia fk_compra_admin; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.comprascursosinacademia
    ADD CONSTRAINT fk_compra_admin FOREIGN KEY (usuariovalida) REFERENCES seguridad.usuarios(id);


--
-- Name: comprascursosinacademia fk_compra_curso; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.comprascursosinacademia
    ADD CONSTRAINT fk_compra_curso FOREIGN KEY (idcurso) REFERENCES academia.cursos(id_curso);


--
-- Name: comprascursosinacademia fk_compra_estado; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.comprascursosinacademia
    ADD CONSTRAINT fk_compra_estado FOREIGN KEY (idestadocompra) REFERENCES academia.estadocomprainacademia(idestadocompra);


--
-- Name: compra_participantes fk_compra_participante_compra; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.compra_participantes
    ADD CONSTRAINT fk_compra_participante_compra FOREIGN KEY (id_compra) REFERENCES academia.comprascursosinacademia(idcompra) ON DELETE CASCADE;


--
-- Name: compra_participantes fk_compra_participante_persona; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.compra_participantes
    ADD CONSTRAINT fk_compra_participante_persona FOREIGN KEY (id_participante) REFERENCES academia.participantes(id_participante) ON DELETE RESTRICT;


--
-- Name: comprascursosinacademia fk_compra_usuario; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.comprascursosinacademia
    ADD CONSTRAINT fk_compra_usuario FOREIGN KEY (idusuario) REFERENCES seguridad.usuarios(id);


--
-- Name: cursos fk_cursos_categoria; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.cursos
    ADD CONSTRAINT fk_cursos_categoria FOREIGN KEY (id_categoria) REFERENCES academia.categorias_cursos(id_categoria);


--
-- Name: cursos fk_cursos_instructor; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.cursos
    ADD CONSTRAINT fk_cursos_instructor FOREIGN KEY (id_instructor) REFERENCES academia.instructores(id_instructor);


--
-- Name: cursos fk_cursos_modalidad; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.cursos
    ADD CONSTRAINT fk_cursos_modalidad FOREIGN KEY (id_modalidad) REFERENCES academia.modalidades(id_modalidad);


--
-- Name: cursos fk_cursos_ubicacion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.cursos
    ADD CONSTRAINT fk_cursos_ubicacion FOREIGN KEY (id_ubicacion) REFERENCES academia.ubicaciones_cursos(id_ubicacion);


--
-- Name: evaluaciones_curso fk_evaluacion_curso; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.evaluaciones_curso
    ADD CONSTRAINT fk_evaluacion_curso FOREIGN KEY (curso_id) REFERENCES academia.cursos(id_curso) ON DELETE RESTRICT;


--
-- Name: evaluaciones_curso fk_evaluacion_sesion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.evaluaciones_curso
    ADD CONSTRAINT fk_evaluacion_sesion FOREIGN KEY (sesion_id) REFERENCES academia.sesiones_curso(id_sesion) ON DELETE SET NULL;


--
-- Name: historial_estados_compra fk_historial_compra; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.historial_estados_compra
    ADD CONSTRAINT fk_historial_compra FOREIGN KEY (id_compra) REFERENCES academia.comprascursosinacademia(idcompra) ON DELETE RESTRICT;


--
-- Name: historial_estados_compra fk_historial_estado_anterior; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.historial_estados_compra
    ADD CONSTRAINT fk_historial_estado_anterior FOREIGN KEY (id_estado_anterior) REFERENCES academia.estadocomprainacademia(idestadocompra) ON DELETE RESTRICT;


--
-- Name: historial_estados_curso fk_historial_estado_curso; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.historial_estados_curso
    ADD CONSTRAINT fk_historial_estado_curso FOREIGN KEY (curso_id) REFERENCES academia.cursos(id_curso) ON DELETE RESTRICT;


--
-- Name: historial_estados_curso fk_historial_estado_curso_usuario; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.historial_estados_curso
    ADD CONSTRAINT fk_historial_estado_curso_usuario FOREIGN KEY (usuario_responsable) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: historial_estados_compra fk_historial_estado_nuevo; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.historial_estados_compra
    ADD CONSTRAINT fk_historial_estado_nuevo FOREIGN KEY (id_estado_nuevo) REFERENCES academia.estadocomprainacademia(idestadocompra) ON DELETE RESTRICT;


--
-- Name: historial_estados_compra fk_historial_usuario_responsable; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.historial_estados_compra
    ADD CONSTRAINT fk_historial_usuario_responsable FOREIGN KEY (usuario_responsable) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: inscripciones_cursos fk_inscripcion_compra_participante; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.inscripciones_cursos
    ADD CONSTRAINT fk_inscripcion_compra_participante FOREIGN KEY (compra_participante_id) REFERENCES academia.compra_participantes(id_compra_participante) ON DELETE RESTRICT;


--
-- Name: inscripciones_cursos fk_inscripcion_curso; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.inscripciones_cursos
    ADD CONSTRAINT fk_inscripcion_curso FOREIGN KEY (curso_id) REFERENCES academia.cursos(id_curso) ON DELETE CASCADE;


--
-- Name: inscripciones_cursos fk_inscripcion_participante; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.inscripciones_cursos
    ADD CONSTRAINT fk_inscripcion_participante FOREIGN KEY (participante_id) REFERENCES academia.participantes(id_participante) ON DELETE RESTRICT;


--
-- Name: inscripciones_cursos fk_inscripcion_usuario; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.inscripciones_cursos
    ADD CONSTRAINT fk_inscripcion_usuario FOREIGN KEY (usuario_id) REFERENCES seguridad.usuarios(id) ON DELETE CASCADE;


--
-- Name: movimientos_cupos_curso fk_movimiento_cupo_compra; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.movimientos_cupos_curso
    ADD CONSTRAINT fk_movimiento_cupo_compra FOREIGN KEY (compra_id) REFERENCES academia.comprascursosinacademia(idcompra) ON DELETE RESTRICT;


--
-- Name: movimientos_cupos_curso fk_movimiento_cupo_curso; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.movimientos_cupos_curso
    ADD CONSTRAINT fk_movimiento_cupo_curso FOREIGN KEY (curso_id) REFERENCES academia.cursos(id_curso) ON DELETE RESTRICT;


--
-- Name: movimientos_cupos_curso fk_movimiento_cupo_usuario; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.movimientos_cupos_curso
    ADD CONSTRAINT fk_movimiento_cupo_usuario FOREIGN KEY (usuario_responsable) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: notificaciones_academicas fk_notificacion_curso; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.notificaciones_academicas
    ADD CONSTRAINT fk_notificacion_curso FOREIGN KEY (curso_id) REFERENCES academia.cursos(id_curso) ON DELETE RESTRICT;


--
-- Name: notificaciones_academicas fk_notificacion_evaluacion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.notificaciones_academicas
    ADD CONSTRAINT fk_notificacion_evaluacion FOREIGN KEY (evaluacion_id) REFERENCES academia.evaluaciones_curso(id_evaluacion) ON DELETE SET NULL;


--
-- Name: notificaciones_academicas fk_notificacion_inscripcion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.notificaciones_academicas
    ADD CONSTRAINT fk_notificacion_inscripcion FOREIGN KEY (inscripcion_id) REFERENCES academia.inscripciones_cursos(id_inscripcion) ON DELETE RESTRICT;


--
-- Name: notificaciones_academicas fk_notificacion_sesion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.notificaciones_academicas
    ADD CONSTRAINT fk_notificacion_sesion FOREIGN KEY (sesion_id) REFERENCES academia.sesiones_curso(id_sesion) ON DELETE SET NULL;


--
-- Name: notificaciones_academicas fk_notificacion_usuario_crea; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.notificaciones_academicas
    ADD CONSTRAINT fk_notificacion_usuario_crea FOREIGN KEY (usuario_crea) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: pagos_cursos fk_pago_compra; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.pagos_cursos
    ADD CONSTRAINT fk_pago_compra FOREIGN KEY (id_compra) REFERENCES academia.comprascursosinacademia(idcompra) ON DELETE RESTRICT;


--
-- Name: pagos_cursos fk_pago_metodo; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.pagos_cursos
    ADD CONSTRAINT fk_pago_metodo FOREIGN KEY (id_metodo_pago) REFERENCES academia.metodos_pago_cursos(id_metodo_pago) ON DELETE RESTRICT;


--
-- Name: pagos_cursos fk_pago_usuario_valida; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.pagos_cursos
    ADD CONSTRAINT fk_pago_usuario_valida FOREIGN KEY (usuario_valida) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: participantes fk_participante_usuario; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.participantes
    ADD CONSTRAINT fk_participante_usuario FOREIGN KEY (usuario_id) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: progreso_curso fk_progreso_inscripcion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.progreso_curso
    ADD CONSTRAINT fk_progreso_inscripcion FOREIGN KEY (inscripcion_id) REFERENCES academia.inscripciones_cursos(id_inscripcion) ON DELETE RESTRICT;


--
-- Name: requisitos_aprobacion_curso fk_requisito_aprobacion_curso; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.requisitos_aprobacion_curso
    ADD CONSTRAINT fk_requisito_aprobacion_curso FOREIGN KEY (curso_id) REFERENCES academia.cursos(id_curso) ON DELETE RESTRICT;


--
-- Name: resultados_evaluaciones fk_resultado_evaluacion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.resultados_evaluaciones
    ADD CONSTRAINT fk_resultado_evaluacion FOREIGN KEY (evaluacion_id) REFERENCES academia.evaluaciones_curso(id_evaluacion) ON DELETE RESTRICT;


--
-- Name: resultados_evaluaciones fk_resultado_inscripcion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.resultados_evaluaciones
    ADD CONSTRAINT fk_resultado_inscripcion FOREIGN KEY (inscripcion_id) REFERENCES academia.inscripciones_cursos(id_inscripcion) ON DELETE RESTRICT;


--
-- Name: resultados_evaluaciones fk_resultado_usuario_califica; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.resultados_evaluaciones
    ADD CONSTRAINT fk_resultado_usuario_califica FOREIGN KEY (usuario_califica) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: sesiones_curso fk_sesion_curso; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.sesiones_curso
    ADD CONSTRAINT fk_sesion_curso FOREIGN KEY (curso_id) REFERENCES academia.cursos(id_curso) ON DELETE RESTRICT;


--
-- Name: sesiones_curso fk_sesion_modalidad; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.sesiones_curso
    ADD CONSTRAINT fk_sesion_modalidad FOREIGN KEY (modalidad_id) REFERENCES academia.modalidades(id_modalidad) ON DELETE RESTRICT;


--
-- Name: sesiones_curso fk_sesion_ubicacion; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.sesiones_curso
    ADD CONSTRAINT fk_sesion_ubicacion FOREIGN KEY (ubicacion_id) REFERENCES academia.ubicaciones_cursos(id_ubicacion) ON DELETE RESTRICT;


--
-- Name: publicaciones publicaciones_id_autor_fkey; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.publicaciones
    ADD CONSTRAINT publicaciones_id_autor_fkey FOREIGN KEY (id_autor) REFERENCES clinica.medicos(id_medico);


--
-- Name: respuestas_encuestas respuestas_encuestas_encuesta_id_fkey; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.respuestas_encuestas
    ADD CONSTRAINT respuestas_encuestas_encuesta_id_fkey FOREIGN KEY (encuesta_id) REFERENCES academia.encuestas(id);


--
-- Name: respuestas_encuestas respuestas_encuestas_usuario_id_fkey; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.respuestas_encuestas
    ADD CONSTRAINT respuestas_encuestas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES seguridad.usuarios(id);


--
-- Name: dataset_reglas_asociacion fk_dataset_asociacion_compra; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_reglas_asociacion
    ADD CONSTRAINT fk_dataset_asociacion_compra FOREIGN KEY (compra_id) REFERENCES academia.comprascursosinacademia(idcompra) ON DELETE RESTRICT;


--
-- Name: dataset_reglas_asociacion fk_dataset_asociacion_curso; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_reglas_asociacion
    ADD CONSTRAINT fk_dataset_asociacion_curso FOREIGN KEY (curso_id) REFERENCES academia.cursos(id_curso) ON DELETE RESTRICT;


--
-- Name: dataset_reglas_asociacion fk_dataset_asociacion_usuario; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_reglas_asociacion
    ADD CONSTRAINT fk_dataset_asociacion_usuario FOREIGN KEY (usuario_id) REFERENCES seguridad.usuarios(id) ON DELETE RESTRICT;


--
-- Name: dataset_regresion_precio_cursos fk_dataset_regresion_curso; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_regresion_precio_cursos
    ADD CONSTRAINT fk_dataset_regresion_curso FOREIGN KEY (curso_id) REFERENCES academia.cursos(id_curso) ON DELETE RESTRICT;


--
-- Name: dataset_segmentacion_clientes fk_dataset_segmentacion_usuario; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.dataset_segmentacion_clientes
    ADD CONSTRAINT fk_dataset_segmentacion_usuario FOREIGN KEY (usuario_id) REFERENCES seguridad.usuarios(id) ON DELETE RESTRICT;


--
-- Name: modelos_ml fk_modelos_ml_creado_por; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.modelos_ml
    ADD CONSTRAINT fk_modelos_ml_creado_por FOREIGN KEY (creado_por) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: predicciones_precio_cursos fk_predicciones_precio_curso; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.predicciones_precio_cursos
    ADD CONSTRAINT fk_predicciones_precio_curso FOREIGN KEY (curso_id) REFERENCES academia.cursos(id_curso) ON DELETE RESTRICT;


--
-- Name: predicciones_precio_cursos fk_predicciones_precio_modelo; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.predicciones_precio_cursos
    ADD CONSTRAINT fk_predicciones_precio_modelo FOREIGN KEY (modelo_id) REFERENCES analitica.modelos_ml(id_modelo) ON DELETE RESTRICT;


--
-- Name: predicciones_precio_cursos fk_predicciones_precio_usuario_decide; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.predicciones_precio_cursos
    ADD CONSTRAINT fk_predicciones_precio_usuario_decide FOREIGN KEY (usuario_decide) REFERENCES seguridad.usuarios(id) ON DELETE SET NULL;


--
-- Name: recomendaciones_cursos fk_recomendaciones_curso; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.recomendaciones_cursos
    ADD CONSTRAINT fk_recomendaciones_curso FOREIGN KEY (curso_recomendado_id) REFERENCES academia.cursos(id_curso) ON DELETE RESTRICT;


--
-- Name: recomendaciones_cursos fk_recomendaciones_curso_origen; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.recomendaciones_cursos
    ADD CONSTRAINT fk_recomendaciones_curso_origen FOREIGN KEY (curso_origen_id) REFERENCES academia.cursos(id_curso) ON DELETE SET NULL;


--
-- Name: recomendaciones_cursos fk_recomendaciones_modelo; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.recomendaciones_cursos
    ADD CONSTRAINT fk_recomendaciones_modelo FOREIGN KEY (modelo_id) REFERENCES analitica.modelos_ml(id_modelo) ON DELETE RESTRICT;


--
-- Name: recomendaciones_cursos fk_recomendaciones_usuario; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.recomendaciones_cursos
    ADD CONSTRAINT fk_recomendaciones_usuario FOREIGN KEY (usuario_id) REFERENCES seguridad.usuarios(id) ON DELETE CASCADE;


--
-- Name: segmentos_clientes fk_segmentos_cliente_modelo; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.segmentos_clientes
    ADD CONSTRAINT fk_segmentos_cliente_modelo FOREIGN KEY (modelo_id) REFERENCES analitica.modelos_ml(id_modelo) ON DELETE RESTRICT;


--
-- Name: segmentos_clientes fk_segmentos_cliente_usuario; Type: FK CONSTRAINT; Schema: analitica; Owner: -
--

ALTER TABLE ONLY analitica.segmentos_clientes
    ADD CONSTRAINT fk_segmentos_cliente_usuario FOREIGN KEY (usuario_id) REFERENCES seguridad.usuarios(id) ON DELETE CASCADE;


--
-- Name: usuarios usuarios_rol_id_roles_id_fk; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuarios
    ADD CONSTRAINT usuarios_rol_id_roles_id_fk FOREIGN KEY (rol_id) REFERENCES seguridad.roles(id);


--
-- Name: preguntas_frecuentes fk_pregunta_frecuente_categoria; Type: FK CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.preguntas_frecuentes
    ADD CONSTRAINT fk_pregunta_frecuente_categoria FOREIGN KEY (id_categoria) REFERENCES soporte.categorias_ayuda(id_categoria);


--
-- Name: preguntas_frecuentes fk_pregunta_frecuente_creador; Type: FK CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.preguntas_frecuentes
    ADD CONSTRAINT fk_pregunta_frecuente_creador FOREIGN KEY (creado_por) REFERENCES seguridad.usuarios(id);


--
-- Name: preguntas_usuarios fk_pregunta_usuario_categoria; Type: FK CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.preguntas_usuarios
    ADD CONSTRAINT fk_pregunta_usuario_categoria FOREIGN KEY (id_categoria) REFERENCES soporte.categorias_ayuda(id_categoria);


--
-- Name: preguntas_usuarios fk_pregunta_usuario_faq; Type: FK CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.preguntas_usuarios
    ADD CONSTRAINT fk_pregunta_usuario_faq FOREIGN KEY (id_pregunta_faq) REFERENCES soporte.preguntas_frecuentes(id_pregunta);


--
-- Name: preguntas_usuarios fk_pregunta_usuario_usuario; Type: FK CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.preguntas_usuarios
    ADD CONSTRAINT fk_pregunta_usuario_usuario FOREIGN KEY (id_usuario) REFERENCES seguridad.usuarios(id);


--
-- Name: respuestas_ayuda fk_respuesta_pregunta; Type: FK CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.respuestas_ayuda
    ADD CONSTRAINT fk_respuesta_pregunta FOREIGN KEY (id_pregunta) REFERENCES soporte.preguntas_usuarios(id_pregunta) ON DELETE CASCADE;


--
-- Name: respuestas_ayuda fk_respuesta_usuario; Type: FK CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.respuestas_ayuda
    ADD CONSTRAINT fk_respuesta_usuario FOREIGN KEY (id_usuario) REFERENCES seguridad.usuarios(id);


--
-- Name: valoraciones_faq fk_valoracion_faq; Type: FK CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.valoraciones_faq
    ADD CONSTRAINT fk_valoracion_faq FOREIGN KEY (id_pregunta_faq) REFERENCES soporte.preguntas_frecuentes(id_pregunta) ON DELETE CASCADE;


--
-- Name: valoraciones_faq fk_valoracion_usuario; Type: FK CONSTRAINT; Schema: soporte; Owner: -
--

ALTER TABLE ONLY soporte.valoraciones_faq
    ADD CONSTRAINT fk_valoracion_usuario FOREIGN KEY (id_usuario) REFERENCES seguridad.usuarios(id);


--
-- Name: mv_indicadores_generales; Type: MATERIALIZED VIEW DATA; Schema: analitica; Owner: -
--

REFRESH MATERIALIZED VIEW analitica.mv_indicadores_generales;


--
-- Name: mv_metricas_mensuales_cursos; Type: MATERIALIZED VIEW DATA; Schema: analitica; Owner: -
--

REFRESH MATERIALIZED VIEW analitica.mv_metricas_mensuales_cursos;


--
-- PostgreSQL database dump complete
--

\unrestrict 2aVtV07sAo4cWgm7iXes5dPWuhrXznMi5FcAORKoQ094R35EZkX8cty3TGo3Q3d

