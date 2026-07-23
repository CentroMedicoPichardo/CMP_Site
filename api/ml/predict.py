import json
import os
from http.server import BaseHTTPRequestHandler
from typing import Any

import joblib
import pandas as pd


# ============================================================
# RUTAS DE LOS ARCHIVOS
# ============================================================

DIRECTORIO_ACTUAL = os.path.dirname(os.path.abspath(__file__))
DIRECTORIO_MODELOS = os.path.join(DIRECTORIO_ACTUAL, "models")

RUTA_PIPELINE = os.path.join(
    DIRECTORIO_MODELOS,
    "pipeline_modelo_precio_cursos.pkl",
)

RUTA_METADATA = os.path.join(
    DIRECTORIO_MODELOS,
    "metadata_modelo_precio_cursos.json",
)


# ============================================================
# CARGA DEL MODELO
# Se realiza una sola vez cuando inicia la función.
# ============================================================

pipeline = joblib.load(RUTA_PIPELINE)

with open(RUTA_METADATA, "r", encoding="utf-8") as archivo:
    metadata = json.load(archivo)


VARIABLES_ENTRADA = metadata["variables_entrada"]
VARIABLES_CATEGORICAS = metadata["variables_categoricas"]
VARIABLES_NUMERICAS = metadata["variables_numericas"]

VALOR_CATEGORIA_FALTANTE = metadata.get(
    "valor_categoria_faltante",
    "Sin dato",
)

MARGEN_ORIENTATIVO = float(
    metadata["margen_orientativo"]["valor"]
)


# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

def normalizar_identificador(valor: Any) -> str:
    """
    Convierte identificadores como 3, 3.0 y '3' al texto '3'.
    Los valores vacíos se convierten en 'Sin dato'.
    """

    if valor is None:
        return VALOR_CATEGORIA_FALTANTE

    texto = str(valor).strip()

    if texto == "":
        return VALOR_CATEGORIA_FALTANTE

    try:
        numero = float(texto)

        if numero.is_integer():
            return str(int(numero))
    except (TypeError, ValueError):
        pass

    return texto


def convertir_entero(
    valor: Any,
    nombre_campo: str,
) -> int:
    """
    Convierte un valor a entero y genera un mensaje claro
    cuando el dato no es válido.
    """

    if valor is None or str(valor).strip() == "":
        raise ValueError(
            f"El campo '{nombre_campo}' es obligatorio."
        )

    try:
        numero = float(valor)
    except (TypeError, ValueError) as error:
        raise ValueError(
            f"El campo '{nombre_campo}' debe ser numérico."
        ) from error

    if not numero.is_integer():
        raise ValueError(
            f"El campo '{nombre_campo}' debe ser un número entero."
        )

    return int(numero)


def preparar_datos(datos_recibidos: dict[str, Any]) -> pd.DataFrame:
    """
    Valida y prepara las siete variables que espera el pipeline.
    """

    campos_faltantes = [
        campo
        for campo in VARIABLES_ENTRADA
        if campo not in datos_recibidos
    ]

    if campos_faltantes:
        raise ValueError(
            "Faltan los siguientes campos: "
            + ", ".join(campos_faltantes)
        )

    categoria_id = normalizar_identificador(
        datos_recibidos.get("categoria_id")
    )

    modalidad_id = normalizar_identificador(
        datos_recibidos.get("modalidad_id")
    )

    ubicacion_id = normalizar_identificador(
        datos_recibidos.get("ubicacion_id")
    )

    anio_inicio = convertir_entero(
        datos_recibidos.get("anio_inicio"),
        "anio_inicio",
    )

    mes_inicio = convertir_entero(
        datos_recibidos.get("mes_inicio"),
        "mes_inicio",
    )

    duracion_dias = convertir_entero(
        datos_recibidos.get("duracion_dias"),
        "duracion_dias",
    )

    cupo_maximo = convertir_entero(
        datos_recibidos.get("cupo_maximo"),
        "cupo_maximo",
    )

    if anio_inicio < 2000:
        raise ValueError(
            "El año de inicio debe ser igual o mayor que 2000."
        )

    if mes_inicio < 1 or mes_inicio > 12:
        raise ValueError(
            "El mes de inicio debe estar entre 1 y 12."
        )

    if duracion_dias < 1:
        raise ValueError(
            "La duración debe ser de al menos un día."
        )

    if cupo_maximo < 1:
        raise ValueError(
            "El cupo máximo debe ser mayor que cero."
        )

    fila = {
        "categoria_id": categoria_id,
        "modalidad_id": modalidad_id,
        "ubicacion_id": ubicacion_id,
        "anio_inicio": anio_inicio,
        "mes_inicio": mes_inicio,
        "duracion_dias": duracion_dias,
        "cupo_maximo": cupo_maximo,
    }

    return pd.DataFrame(
        [fila],
        columns=VARIABLES_ENTRADA,
    )


def realizar_prediccion(
    datos_recibidos: dict[str, Any],
) -> dict[str, Any]:
    """
    Ejecuta el pipeline y genera el resultado utilizado
    por la aplicación.
    """

    datos = preparar_datos(datos_recibidos)

    prediccion = float(pipeline.predict(datos)[0])

    if prediccion < 0:
        prediccion = 0.0

    precio_sugerido = round(prediccion, 2)

    precio_minimo = round(
        max(0, prediccion - MARGEN_ORIENTATIVO),
        2,
    )

    precio_maximo = round(
        prediccion + MARGEN_ORIENTATIVO,
        2,
    )

    return {
        "ok": True,
        "precioSugerido": precio_sugerido,
        "precioMinimoEstimado": precio_minimo,
        "precioMaximoEstimado": precio_maximo,
        "margenOrientativo": round(
            MARGEN_ORIENTATIVO,
            2,
        ),
        "modelo": metadata["nombre_modelo"],
        "algoritmo": metadata["algoritmo"],
        "version": metadata["version_modelo"],
        "variablesEntrada": datos.iloc[0].to_dict(),
        "aviso": (
            "El rango es orientativo y está basado en el "
            "error absoluto promedio observado en prueba. "
            "No es un intervalo de confianza formal."
        ),
    }


# ============================================================
# FUNCIÓN HTTP PARA VERCEL
# ============================================================

class handler(BaseHTTPRequestHandler):
    def enviar_json(
        self,
        contenido: dict[str, Any],
        codigo_estado: int,
    ) -> None:
        respuesta = json.dumps(
            contenido,
            ensure_ascii=False,
        ).encode("utf-8")

        self.send_response(codigo_estado)
        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8",
        )
        self.send_header(
            "Content-Length",
            str(len(respuesta)),
        )
        self.end_headers()
        self.wfile.write(respuesta)

    def do_POST(self) -> None:
        try:
            longitud = int(
                self.headers.get("Content-Length", "0")
            )

            cuerpo = self.rfile.read(longitud)

            if not cuerpo:
                self.enviar_json(
                    {
                        "ok": False,
                        "message": (
                            "No se recibieron datos para realizar "
                            "la predicción."
                        ),
                    },
                    400,
                )
                return

            try:
                datos_recibidos = json.loads(
                    cuerpo.decode("utf-8")
                )
            except json.JSONDecodeError:
                self.enviar_json(
                    {
                        "ok": False,
                        "message": (
                            "El cuerpo de la solicitud debe ser "
                            "un JSON válido."
                        ),
                    },
                    400,
                )
                return

            if not isinstance(datos_recibidos, dict):
                self.enviar_json(
                    {
                        "ok": False,
                        "message": (
                            "Los datos deben enviarse como un "
                            "objeto JSON."
                        ),
                    },
                    400,
                )
                return

            resultado = realizar_prediccion(
                datos_recibidos
            )

            self.enviar_json(resultado, 200)

        except ValueError as error:
            self.enviar_json(
                {
                    "ok": False,
                    "message": str(error),
                },
                400,
            )

        except Exception as error:
            print(
                "Error interno realizando la predicción:",
                repr(error),
            )

            self.enviar_json(
                {
                    "ok": False,
                    "message": (
                        "No fue posible calcular el precio "
                        "sugerido."
                    ),
                },
                500,
            )

    def do_GET(self) -> None:
        self.enviar_json(
            {
                "ok": True,
                "message": (
                    "La función de predicción de precios "
                    "está disponible."
                ),
                "metodoPermitido": "POST",
                "modelo": metadata["nombre_modelo"],
                "version": metadata["version_modelo"],
            },
            200,
        )