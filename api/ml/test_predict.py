import json
import os

from predict import realizar_prediccion


DIRECTORIO_ACTUAL = os.path.dirname(os.path.abspath(__file__))

RUTA_CASOS = os.path.join(
    DIRECTORIO_ACTUAL,
    "models",
    "casos_prueba_modelo_precio_cursos.json",
)


def ejecutar_pruebas() -> None:
    with open(RUTA_CASOS, "r", encoding="utf-8") as archivo:
        contenido = json.load(archivo)

    casos = contenido["casos"]

    aprobados = 0
    fallidos = 0

    print("=" * 70)
    print("PRUEBAS DEL MODELO DE PREDICCIÓN DE PRECIOS")
    print("=" * 70)

    for caso in casos:
        identificador = caso["id_caso"]
        entrada = caso["entrada"]
        esperado = float(caso["prediccion_esperada_redondeada"])
        tolerancia = float(caso["tolerancia_absoluta"])

        try:
            resultado = realizar_prediccion(entrada)
            obtenido = float(resultado["precioSugerido"])

            diferencia = abs(obtenido - esperado)
            aprobado = diferencia <= tolerancia

            if aprobado:
                aprobados += 1
                estado = "APROBADO"
            else:
                fallidos += 1
                estado = "FALLIDO"

            print()
            print(f"Caso: {identificador}")
            print(f"Esperado:   {esperado:.2f}")
            print(f"Obtenido:   {obtenido:.2f}")
            print(f"Diferencia: {diferencia:.6f}")
            print(f"Tolerancia: {tolerancia:.6f}")
            print(f"Resultado:  {estado}")

        except Exception as error:
            fallidos += 1

            print()
            print(f"Caso: {identificador}")
            print("Resultado: ERROR")
            print(f"Detalle: {error}")

    print()
    print("=" * 70)
    print(f"Casos aprobados: {aprobados}")
    print(f"Casos fallidos:  {fallidos}")
    print("=" * 70)

    if fallidos > 0:
        raise SystemExit(
            "Algunas pruebas fallaron. No se debe continuar todavía."
        )

    print("Todos los casos de prueba fueron aprobados.")


if __name__ == "__main__":
    ejecutar_pruebas()