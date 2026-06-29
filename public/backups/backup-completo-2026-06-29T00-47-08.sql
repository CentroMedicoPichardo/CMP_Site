--
-- PostgreSQL database dump
--

\restrict AjQYRrFJScRNjzVz8Ia3u71ZT7u2jd6sS9PcFQ4Edh8kKms8LVS0T9bxFqUpDwo

-- Dumped from database version 17.10 (9f6157c)
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

ALTER TABLE IF EXISTS ONLY seguridad.usuarios DROP CONSTRAINT IF EXISTS usuarios_rol_id_roles_id_fk;
ALTER TABLE IF EXISTS ONLY academia.respuestas_encuestas DROP CONSTRAINT IF EXISTS respuestas_encuestas_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY academia.respuestas_encuestas DROP CONSTRAINT IF EXISTS respuestas_encuestas_encuesta_id_fkey;
ALTER TABLE IF EXISTS ONLY academia.publicaciones DROP CONSTRAINT IF EXISTS publicaciones_id_autor_fkey;
ALTER TABLE IF EXISTS ONLY academia.inscripciones_cursos DROP CONSTRAINT IF EXISTS fk_inscripcion_usuario;
ALTER TABLE IF EXISTS ONLY academia.inscripciones_cursos DROP CONSTRAINT IF EXISTS fk_inscripcion_curso;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS fk_cursos_ubicacion;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS fk_cursos_modalidad;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS fk_cursos_instructor;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS fk_cursos_categoria;
ALTER TABLE IF EXISTS ONLY academia.encuestas DROP CONSTRAINT IF EXISTS encuestas_contenido_id_fkey;
ALTER TABLE IF EXISTS ONLY academia.academia_infantil DROP CONSTRAINT IF EXISTS academia_infantil_id_autor_fkey;
DROP TRIGGER IF EXISTS trg_audit_usuarios ON seguridad.usuarios;
DROP TRIGGER IF EXISTS trg_audit_servicios ON clinica.servicios;
DROP TRIGGER IF EXISTS trg_audit_nosotros ON clinica.nosotros;
DROP TRIGGER IF EXISTS trg_audit_medicos ON clinica.medicos;
DROP INDEX IF EXISTS auditoria.idx_backups_tipo;
DROP INDEX IF EXISTS auditoria.idx_backups_fecha;
DROP INDEX IF EXISTS academia.idx_instructores_especialidad;
DROP INDEX IF EXISTS academia.idx_instructores_activo;
DROP INDEX IF EXISTS academia.idx_inscripciones_usuario;
DROP INDEX IF EXISTS academia.idx_inscripciones_fecha;
DROP INDEX IF EXISTS academia.idx_inscripciones_estado;
DROP INDEX IF EXISTS academia.idx_inscripciones_curso;
DROP INDEX IF EXISTS academia.idx_cursos_modalidad;
DROP INDEX IF EXISTS academia.idx_cursos_instructor;
DROP INDEX IF EXISTS academia.idx_cursos_fechas;
DROP INDEX IF EXISTS academia.idx_cursos_dirigido_a;
DROP INDEX IF EXISTS academia.idx_cursos_categoria;
DROP INDEX IF EXISTS academia.idx_cursos_activo;
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
ALTER TABLE IF EXISTS ONLY academia.inscripciones_cursos DROP CONSTRAINT IF EXISTS unique_inscripcion_curso_usuario;
ALTER TABLE IF EXISTS ONLY academia.ubicaciones_cursos DROP CONSTRAINT IF EXISTS ubicaciones_cursos_pkey;
ALTER TABLE IF EXISTS ONLY academia.ubicaciones_cursos DROP CONSTRAINT IF EXISTS ubicaciones_cursos_nombre_ubicacion_key;
ALTER TABLE IF EXISTS ONLY academia.respuestas_encuestas DROP CONSTRAINT IF EXISTS respuestas_encuestas_pkey;
ALTER TABLE IF EXISTS ONLY academia.publicaciones DROP CONSTRAINT IF EXISTS publicaciones_pkey;
ALTER TABLE IF EXISTS ONLY academia.modalidades DROP CONSTRAINT IF EXISTS modalidades_pkey;
ALTER TABLE IF EXISTS ONLY academia.modalidades DROP CONSTRAINT IF EXISTS modalidades_nombre_modalidad_key;
ALTER TABLE IF EXISTS ONLY academia.instructores DROP CONSTRAINT IF EXISTS instructores_pkey;
ALTER TABLE IF EXISTS ONLY academia.instructores DROP CONSTRAINT IF EXISTS instructores_correo_key;
ALTER TABLE IF EXISTS ONLY academia.inscripciones_cursos DROP CONSTRAINT IF EXISTS inscripciones_cursos_pkey;
ALTER TABLE IF EXISTS ONLY academia.encuestas DROP CONSTRAINT IF EXISTS encuestas_pkey;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS cursos_pkey;
ALTER TABLE IF EXISTS ONLY academia.contenido_saber_pediatrico DROP CONSTRAINT IF EXISTS contenido_saber_pediatrico_pkey;
ALTER TABLE IF EXISTS ONLY academia.categorias_cursos DROP CONSTRAINT IF EXISTS categorias_cursos_pkey;
ALTER TABLE IF EXISTS ONLY academia.categorias_cursos DROP CONSTRAINT IF EXISTS categorias_cursos_nombre_categoria_key;
ALTER TABLE IF EXISTS ONLY academia.academia_infantil DROP CONSTRAINT IF EXISTS academia_infantil_pkey;
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
ALTER TABLE IF EXISTS academia.ubicaciones_cursos ALTER COLUMN id_ubicacion DROP DEFAULT;
ALTER TABLE IF EXISTS academia.respuestas_encuestas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS academia.publicaciones ALTER COLUMN id_publicacion DROP DEFAULT;
ALTER TABLE IF EXISTS academia.modalidades ALTER COLUMN id_modalidad DROP DEFAULT;
ALTER TABLE IF EXISTS academia.instructores ALTER COLUMN id_instructor DROP DEFAULT;
ALTER TABLE IF EXISTS academia.inscripciones_cursos ALTER COLUMN id_inscripcion DROP DEFAULT;
ALTER TABLE IF EXISTS academia.encuestas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS academia.cursos ALTER COLUMN id_curso DROP DEFAULT;
ALTER TABLE IF EXISTS academia.contenido_saber_pediatrico ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS academia.categorias_cursos ALTER COLUMN id_categoria DROP DEFAULT;
ALTER TABLE IF EXISTS academia.academia_infantil ALTER COLUMN id_guia DROP DEFAULT;
DROP SEQUENCE IF EXISTS seguridad.usuarios_id_seq;
DROP TABLE IF EXISTS seguridad.usuarios;
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
DROP SEQUENCE IF EXISTS academia.ubicaciones_cursos_id_ubicacion_seq;
DROP TABLE IF EXISTS academia.ubicaciones_cursos;
DROP SEQUENCE IF EXISTS academia.respuestas_encuestas_id_seq;
DROP TABLE IF EXISTS academia.respuestas_encuestas;
DROP SEQUENCE IF EXISTS academia.publicaciones_id_publicacion_seq;
DROP TABLE IF EXISTS academia.publicaciones;
DROP SEQUENCE IF EXISTS academia.modalidades_id_modalidad_seq;
DROP TABLE IF EXISTS academia.modalidades;
DROP SEQUENCE IF EXISTS academia.instructores_id_instructor_seq;
DROP TABLE IF EXISTS academia.instructores;
DROP SEQUENCE IF EXISTS academia.inscripciones_cursos_id_inscripcion_seq;
DROP TABLE IF EXISTS academia.inscripciones_cursos;
DROP SEQUENCE IF EXISTS academia.encuestas_id_seq;
DROP TABLE IF EXISTS academia.encuestas;
DROP SEQUENCE IF EXISTS academia.cursos_id_curso_seq;
DROP TABLE IF EXISTS academia.cursos;
DROP SEQUENCE IF EXISTS academia.contenido_saber_pediatrico_id_seq;
DROP TABLE IF EXISTS academia.contenido_saber_pediatrico;
DROP SEQUENCE IF EXISTS academia.categorias_cursos_id_categoria_seq;
DROP TABLE IF EXISTS academia.categorias_cursos;
DROP SEQUENCE IF EXISTS academia.academia_infantil_id_guia_seq;
DROP TABLE IF EXISTS academia.academia_infantil;
DROP FUNCTION IF EXISTS seguridad.fn_auditar_cambios();
DROP FUNCTION IF EXISTS public.contar_filas_en_todas_tablas();
DROP SCHEMA IF EXISTS seguridad;
DROP SCHEMA IF EXISTS clinica;
DROP SCHEMA IF EXISTS auditoria;
DROP SCHEMA IF EXISTS academia;
--
-- Name: academia; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA academia;


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
-- Name: inscripciones_cursos; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.inscripciones_cursos (
    id_inscripcion integer NOT NULL,
    curso_id integer NOT NULL,
    usuario_id integer NOT NULL,
    fecha_inscripcion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(20) DEFAULT 'activo'::character varying,
    monto_pagado numeric(10,2),
    metodo_pago character varying(50)
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
-- Name: academia_infantil id_guia; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.academia_infantil ALTER COLUMN id_guia SET DEFAULT nextval('academia.academia_infantil_id_guia_seq'::regclass);


--
-- Name: categorias_cursos id_categoria; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.categorias_cursos ALTER COLUMN id_categoria SET DEFAULT nextval('academia.categorias_cursos_id_categoria_seq'::regclass);


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
-- Name: inscripciones_cursos id_inscripcion; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.inscripciones_cursos ALTER COLUMN id_inscripcion SET DEFAULT nextval('academia.inscripciones_cursos_id_inscripcion_seq'::regclass);


--
-- Name: instructores id_instructor; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.instructores ALTER COLUMN id_instructor SET DEFAULT nextval('academia.instructores_id_instructor_seq'::regclass);


--
-- Name: modalidades id_modalidad; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.modalidades ALTER COLUMN id_modalidad SET DEFAULT nextval('academia.modalidades_id_modalidad_seq'::regclass);


--
-- Name: publicaciones id_publicacion; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.publicaciones ALTER COLUMN id_publicacion SET DEFAULT nextval('academia.publicaciones_id_publicacion_seq'::regclass);


--
-- Name: respuestas_encuestas id; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.respuestas_encuestas ALTER COLUMN id SET DEFAULT nextval('academia.respuestas_encuestas_id_seq'::regclass);


--
-- Name: ubicaciones_cursos id_ubicacion; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.ubicaciones_cursos ALTER COLUMN id_ubicacion SET DEFAULT nextval('academia.ubicaciones_cursos_id_ubicacion_seq'::regclass);


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
-- Data for Name: academia_infantil; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.academia_infantil (id_guia, titulo_guia, descripcion_corta, id_autor, fecha_publicacion, url_imagen, etiquetas, descripcion_larga, activo) FROM stdin;
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
17	Primeros Auxilios Pediátricos	Taller teórico-práctico sobre RCP neonatal, atragantamiento y manejo de quemaduras en casa.	4	5	6	1	2026-04-20	2026-04-25	10:00 - 3:00	Padres	20	250.00	https://res.cloudinary.com/dydfxuywl/image/upload/v1776081230/centro-medico/cursos/yoa08lzguikagbptcrzd.png	t	7	2026-04-09 05:53:57.39789	2026-04-13 05:53:57.39789
18	Introducción a la Alimentación Complementaria (BLW)	Aprende a introducir sólidos de forma segura siguiendo el método Baby Led Weaning.	2	6	6	1	2026-04-16	2026-04-17	09:00 - 12:00	Niños	30	300.00	https://res.cloudinary.com/dydfxuywl/image/upload/v1776081608/centro-medico/cursos/wvzdkg8evjr6z4gvmgk0.png	t	7	2026-04-10 05:55:49.755206	2026-04-13 06:00:37.76609
19	Crianza conciente	Ciranza Conciente	10	3	6	1	2026-04-16	2026-04-20	10:00 - 12:00	Padres	20	250.00	https://res.cloudinary.com/dydfxuywl/image/upload/v1776353590/centro-medico/cursos/eitfb53npg56e9muchlv.png	t	0	2026-04-16 09:33:56.49905	2026-04-16 09:33:56.49905
\.


--
-- Data for Name: encuestas; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.encuestas (id, contenido_id, preguntas, fecha_inicio, fecha_fin, total_participantes, activo) FROM stdin;
\.


--
-- Data for Name: inscripciones_cursos; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.inscripciones_cursos (id_inscripcion, curso_id, usuario_id, fecha_inscripcion, estado, monto_pagado, metodo_pago) FROM stdin;
1	18	25	2026-04-13 10:47:07.967073	activo	300.00	pendiente
3	17	26	2026-04-13 10:49:42.932953	activo	250.00	pendiente
4	18	26	2026-04-13 10:50:02.084201	activo	300.00	pendiente
5	17	25	2026-04-13 10:50:47.546835	activo	250.00	pendiente
6	17	20	2026-04-14 12:12:58.32249	activo	250.00	pendiente
7	18	20	2026-04-14 13:12:58.32249	activo	300.00	pendiente
8	17	23	2026-04-14 14:12:58.32249	activo	250.00	pendiente
9	18	23	2026-04-14 15:12:58.32249	activo	300.00	pendiente
10	17	24	2026-04-14 16:12:58.32249	activo	250.00	pendiente
11	18	24	2026-04-14 17:12:58.32249	activo	300.00	pendiente
12	17	27	2026-04-15 12:12:58.32249	activo	250.00	pendiente
13	18	27	2026-04-15 13:12:58.32249	activo	300.00	pendiente
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
-- Data for Name: modalidades; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.modalidades (id_modalidad, nombre_modalidad, descripcion) FROM stdin;
1	presencial	Curso impartido en instalaciones físicas
2	virtual	Curso impartido en línea
3	hibrido	Combinación de clases presenciales y virtuales
\.


--
-- Data for Name: publicaciones; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.publicaciones (id_publicacion, titulo_noticia, resumen_bajada, id_autor, fecha_publicacion, etiquetas, url_imagen, contenido_completo, activo) FROM stdin;
\.


--
-- Data for Name: respuestas_encuestas; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.respuestas_encuestas (id, encuesta_id, usuario_id, respuestas, fecha_respuesta) FROM stdin;
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
-- Data for Name: backups; Type: TABLE DATA; Schema: auditoria; Owner: -
--

COPY auditoria.backups (id, fecha, tipo, "tamaño", archivo_url, estado) FROM stdin;
5	2026-03-08 00:51:12.485741	completo	20.34 KB	backups/backup-1772931073378.sql	exitoso
6	2026-03-22 18:58:47.810508	completo	35.01 KB	backups/backup-completo-2026-03-22T18-57-14.sql	exitoso
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
1	Centro Medico Pichardo	Calle Patria, Sin Número, Satélite, Anahuac, 43000 Huejutla de Reyes, Hgo.	7711408883	centromedicopichardo@gmail.com	https://www.facebook.com/profile.php?id=61574639950614	\N	Lunes - Sabado de 9:30 am - 8:00 pm y Domingos de 10:00 am - 2:00 pm	https://res.cloudinary.com/dydfxuywl/image/upload/v1775607567/centro-medico/empresa/pultzizirc7kjqekykgr.jpg	\N	2026-04-07 13:14:04.091136	2026-04-08 23:21:54.567
\.


--
-- Data for Name: medicos; Type: TABLE DATA; Schema: clinica; Owner: -
--

COPY clinica.medicos (id_medico, nombres, apellido_paterno, apellido_materno, especialidad, hospital_clinica, direccion, url_foto, activo) FROM stdin;
14	Francisco Javier	Moreno	Pichardo	Pediatra	Centro Médico Pichardo	Calle Alcatraz colonia los prados a cien metros de la asociación del jubilado y pensionado sobre la terracería centro médico Pichardo	https://res.cloudinary.com/dydfxuywl/image/upload/v1776093395/centro-medico/medicos/xbroogr1fo7lbap0z8mu.jpg	t
15	Luis Alberto	Hernández	Gómez	Pediatra	Centro Médico Pichardo	Av. Central 123, Poza Rica	https://res.cloudinary.com/dydfxuywl/image/upload/v1776320501/centro-medico/medicos/lshy2gkqlnn8dtefcivp.png	t
16	María Fernanda	López	Ruiz	Pediatra	Centro Médico Pichardo	Av. Central 123, Poza Rica	https://res.cloudinary.com/dydfxuywl/image/upload/v1776320570/centro-medico/medicos/etxx4kz9cbpda4wecvcf.png	t
17	Carlos Eduardo	Martínez	Torres	Pediatra	Centro Médico Pichardo	Av. Central 123, Poza Rica	https://res.cloudinary.com/dydfxuywl/image/upload/v1776320629/centro-medico/medicos/ocgpykmtxctksi7t88gq.png	t
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
1	Consulta Pediátrica Integral	La Consulta Pediátrica Integral es un servicio médico enfocado en la atención preventiva, diagnóstica y de seguimiento de la salud infantil, desde recién nacidos hasta adolescentes. Incluye la evaluación del crecimiento y desarrollo, control de vacunación, detección oportuna de enfermedades, orientación nutricional y asesoramiento a padres sobre el cuidado general del niño. Este servicio busca garantizar un desarrollo saludable mediante revisiones periódicas y atención personalizada por parte de un médico pediatra.	Centro Médico Pichardo	https://res.cloudinary.com/dydfxuywl/image/upload/v1776095383/centro-medico/servicios/fzoybjkbmf5l9i2l9yn5.png	Consulta Pediátrica Integral	vertical	t
2	Vacunación Infantil	Aplicación de vacunas conforme al esquema nacional e internacional, garantizando la protección contra enfermedades comunes en la infancia y llevando un control actualizado del historial de vacunación.	Centro Médico Pichardo	https://res.cloudinary.com/dydfxuywl/image/upload/v1776095546/centro-medico/servicios/dlvolybbj49hk0kdchci.png	Vacunación Infantil	vertical	t
3	Urgencias Pediátricas	Atención inmediata para niños con síntomas agudos como fiebre alta, infecciones, golpes, caídas o cualquier situación que requiera intervención médica rápida.	Centro Médico Pichardo	https://res.cloudinary.com/dydfxuywl/image/upload/v1776096008/centro-medico/servicios/zgxpcoejgfcbdkj1jpk5.png	Urgencias Pediátricas	vertical	t
4	Nutrición Pediátrica	Evaluación del estado nutricional del niño y elaboración de planes alimenticios personalizados para promover un crecimiento saludable.	Centro Médico Pichardo	https://res.cloudinary.com/dydfxuywl/image/upload/v1776319903/centro-medico/servicios/elei0kui4v9jf7xqgdrm.png	Nutrición Pediátrica	vertical	t
5	Estimulación Temprana	Programas diseñados para favorecer el desarrollo cognitivo, motor y emocional en bebés y niños pequeños.	Centro Médico Pichardo	https://res.cloudinary.com/dydfxuywl/image/upload/v1776319972/centro-medico/servicios/ztcpfzrtzxnmov1abkg7.png	Estimulación Temprana	vertical	t
6	Psicología Infantil	Apoyo emocional y conductual para niños con problemas de aprendizaje, conducta, ansiedad o adaptación.	Centro Médico Pichardo	https://res.cloudinary.com/dydfxuywl/image/upload/v1776320063/centro-medico/servicios/fd9v07axcknd56jujjiy.png	Psicología Infantil	vertical	t
7	Odontopediatría	Cuidado dental especializado para niños, incluyendo prevención, limpieza y tratamiento de caries.	Centro Médico Pichardo	https://res.cloudinary.com/dydfxuywl/image/upload/v1776320131/centro-medico/servicios/rxtxsw4jomkotio58ok7.png	Odontopediatría	vertical	t
8	Telemedicina Pediátrica	Consultas médicas a distancia para orientación, seguimiento de tratamientos y atención de casos no urgentes.	Centro Médico Pichardo	https://res.cloudinary.com/dydfxuywl/image/upload/v1776320232/centro-medico/servicios/edoub8spohlbyexptf3a.png	Telemedicina Pediátrica	vertical	t
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
27	Jesus	Fernandez	Hernandez	20	masculino	7713039166	jesushfernandezh@gmail.com	$2b$10$OFkkMXJJUNYLrimvRmooHeP4PCpTKorSE5NgSiLnt3f0zto4lHlmG	2	\N	\N	0	\N	1	f	\N	t
29	Jesus	Fernandez	Hernandez	21	masculino	7713039166	jesusf1705dck@gmail.com	$2b$10$xJLCGReTaXB3ZMUa1CrmwuCSvLkkHwJbxsd2p5Bjm7cnA.EtM9412	1	\N	\N	0	\N	1	f	\N	t
26	Luis	Chavez	Vargas	20	masculino	7717205499	chavezvargasluisjesus22@gmail.com	$2b$10$lI.UBXO8danZGHre3k8WIuCvAba7IlUzNMwfaYdsA3bZJjEkD0m2q	1	\N	\N	0	\N	1	f	\N	t
25	Luis 	Chavez	Vargas	20	masculino	7717205499	20230003@uthh.edu.mx	$2b$10$n2EbnwB12..dWY92YefHw.Yh0XYjgLM87qqJOBeVVEE3mWtXKwQl.	1	\N	\N	0	\N	1	f	\N	t
20	Luis Jesus	Chavez	Vargas	20	masculino	7717205433	chavezvargasluisjesus@gmail.com	$2b$10$befZrUwPwPSZOj.peNfCOOLL9TWojoNmq7uhj2XVYnyxXwepze8nC	2	\N	\N	0	\N	1	f	\N	t
\.


--
-- Name: academia_infantil_id_guia_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.academia_infantil_id_guia_seq', 1, false);


--
-- Name: categorias_cursos_id_categoria_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.categorias_cursos_id_categoria_seq', 6, true);


--
-- Name: contenido_saber_pediatrico_id_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.contenido_saber_pediatrico_id_seq', 21, true);


--
-- Name: cursos_id_curso_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.cursos_id_curso_seq', 19, true);


--
-- Name: encuestas_id_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.encuestas_id_seq', 1, false);


--
-- Name: inscripciones_cursos_id_inscripcion_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.inscripciones_cursos_id_inscripcion_seq', 14, true);


--
-- Name: instructores_id_instructor_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.instructores_id_instructor_seq', 11, true);


--
-- Name: modalidades_id_modalidad_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.modalidades_id_modalidad_seq', 3, true);


--
-- Name: publicaciones_id_publicacion_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.publicaciones_id_publicacion_seq', 1, false);


--
-- Name: respuestas_encuestas_id_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.respuestas_encuestas_id_seq', 1, false);


--
-- Name: ubicaciones_cursos_id_ubicacion_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.ubicaciones_cursos_id_ubicacion_seq', 7, true);


--
-- Name: backups_id_seq; Type: SEQUENCE SET; Schema: auditoria; Owner: -
--

SELECT pg_catalog.setval('auditoria.backups_id_seq', 6, true);


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

SELECT pg_catalog.setval('clinica.medicos_id_medico_seq', 17, true);


--
-- Name: nosotros_id_seq; Type: SEQUENCE SET; Schema: clinica; Owner: -
--

SELECT pg_catalog.setval('clinica.nosotros_id_seq', 1, true);


--
-- Name: servicios_id_servicio_seq; Type: SEQUENCE SET; Schema: clinica; Owner: -
--

SELECT pg_catalog.setval('clinica.servicios_id_servicio_seq', 8, true);


--
-- Name: alertas_seguridad_id_alerta_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.alertas_seguridad_id_alerta_seq', 1, false);


--
-- Name: auditoria_acciones_id_auditoria_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.auditoria_acciones_id_auditoria_seq', 161, true);


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

SELECT pg_catalog.setval('seguridad.usuarios_id_seq', 29, true);


--
-- Name: academia_infantil academia_infantil_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.academia_infantil
    ADD CONSTRAINT academia_infantil_pkey PRIMARY KEY (id_guia);


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
-- Name: publicaciones publicaciones_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.publicaciones
    ADD CONSTRAINT publicaciones_pkey PRIMARY KEY (id_publicacion);


--
-- Name: respuestas_encuestas respuestas_encuestas_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.respuestas_encuestas
    ADD CONSTRAINT respuestas_encuestas_pkey PRIMARY KEY (id);


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
-- Name: idx_inscripciones_curso; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_inscripciones_curso ON academia.inscripciones_cursos USING btree (curso_id);


--
-- Name: idx_inscripciones_estado; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_inscripciones_estado ON academia.inscripciones_cursos USING btree (estado);


--
-- Name: idx_inscripciones_fecha; Type: INDEX; Schema: academia; Owner: -
--

CREATE INDEX idx_inscripciones_fecha ON academia.inscripciones_cursos USING btree (fecha_inscripcion DESC);


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
-- Name: idx_backups_fecha; Type: INDEX; Schema: auditoria; Owner: -
--

CREATE INDEX idx_backups_fecha ON auditoria.backups USING btree (fecha DESC);


--
-- Name: idx_backups_tipo; Type: INDEX; Schema: auditoria; Owner: -
--

CREATE INDEX idx_backups_tipo ON auditoria.backups USING btree (tipo);


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
-- Name: inscripciones_cursos fk_inscripcion_curso; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.inscripciones_cursos
    ADD CONSTRAINT fk_inscripcion_curso FOREIGN KEY (curso_id) REFERENCES academia.cursos(id_curso) ON DELETE CASCADE;


--
-- Name: inscripciones_cursos fk_inscripcion_usuario; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.inscripciones_cursos
    ADD CONSTRAINT fk_inscripcion_usuario FOREIGN KEY (usuario_id) REFERENCES seguridad.usuarios(id) ON DELETE CASCADE;


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
-- Name: usuarios usuarios_rol_id_roles_id_fk; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuarios
    ADD CONSTRAINT usuarios_rol_id_roles_id_fk FOREIGN KEY (rol_id) REFERENCES seguridad.roles(id);


--
-- PostgreSQL database dump complete
--

\unrestrict AjQYRrFJScRNjzVz8Ia3u71ZT7u2jd6sS9PcFQ4Edh8kKms8LVS0T9bxFqUpDwo

