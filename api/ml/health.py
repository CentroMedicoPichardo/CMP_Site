import json
import os
import platform
from http.server import BaseHTTPRequestHandler
from typing import Any

import joblib
import pandas as pd
import sklearn


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


def obtener_diagnostico() -> dict[str, Any]:
    with open(RUTA_METADATA, "r", encoding="utf-8") as archivo:
        metadata = json.load(archivo)

    pipeline = joblib.load(RUTA_PIPELINE)

    return {
        "ok": True,
        "modeloCargado": pipeline is not None,
        "nombreModelo": metadata["nombre_modelo"],
        "algoritmo": metadata["algoritmo"],
        "versionModelo": metadata["version_modelo"],
        "archivoPrincipal": metadata["archivo_principal"],
        "variablesEsperadas": metadata["variables_entrada"],
        "categoriasConocidas": metadata["categorias_conocidas"],
        "valorCategoriaFaltante": metadata[
            "valor_categoria_faltante"
        ],
        "versionesEntrenamiento": metadata["versiones"],
        "versionesEjecucion": {
            "python": platform.python_version(),
            "pandas": pd.__version__,
            "scikit_learn": sklearn.__version__,
            "joblib": joblib.__version__,
        },
        "mensaje": "El modelo de predicción está disponible.",
    }


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

    def do_GET(self) -> None:
        try:
            diagnostico = obtener_diagnostico()
            self.enviar_json(diagnostico, 200)

        except FileNotFoundError:
            self.enviar_json(
                {
                    "ok": False,
                    "modeloCargado": False,
                    "message": (
                        "No se encontraron los archivos "
                        "necesarios del modelo."
                    ),
                },
                500,
            )

        except Exception as error:
            print(
                "Error comprobando la salud del modelo:",
                repr(error),
            )

            self.enviar_json(
                {
                    "ok": False,
                    "modeloCargado": False,
                    "message": (
                        "No fue posible cargar el modelo "
                        "de predicción."
                    ),
                },
                500,
            )