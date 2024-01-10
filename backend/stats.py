import pandas as pd
import sys
import json
import matplotlib.pyplot as plt
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from datetime import datetime


def establecer_conexion():
    uri = "mongodb+srv://a21marsalval_bd:ToniNoRobes2021@tr2.eatpoha.mongodb.net/?retryWrites=true&w=majority"

    client = MongoClient(uri, server_api=ServerApi("1"))
    # Send a ping to confirm a successful connection
    try:
        client.mathbattle.command("ping")
    except Exception as e:
        print(e)
    return client


def obtener_respuestas_correctas_por_usuario_y_dificultad(cursor):
    print()
    pipeline = [
        {"$match": {"id_usuari": {"$in": json.loads(sys.argv[1])}}},
        {"$group": {"_id": "$difficulty", "count": {"$sum": 1}}},
    ]
    return list(cursor.mathbattle.correctAnswers.aggregate(pipeline))


def obtener_puntos_de_respuestas_correctas_por_usuario(cursor):
    print()
    pipeline = [
        {"$match": {"id_usuari": {"$in": json.loads(sys.argv[1])}}},
        {
            "$group": {
                "_id": "$id_usuari",
                "puntos": {
                    "$sum": {
                        "$switch": {
                            "branches": [
                                {"case": {"$eq": ["$difficulty", "fàcil"]}, "then": 10},
                                {"case": {"$eq": ["$difficulty", "mitjà"]}, "then": 15},
                                {"case": {"$eq": ["$difficulty", "difícil"]}, "then": 20},
                            ],
                            "default": 0,
                        }
                    }
                },
            }
        },
    ]
    return list(cursor.mathbattle.correctAnswers.aggregate(pipeline))


def graficar_respuestas_correctas_por_dificultad(df, filename):
    plt.figure(
        figsize=(10, 6), facecolor="#f3f1ff"
    )  # Establecer el color de fondo de toda la figura

    # Crear un gráfico de barras horizontales con puntas redondas y color personalizado
    plt.pie(
        df["count"],
        labels=df["_id"],
        autopct="%1.1f%%",
        colors=["#d77676", "#7ed776", "#768ed7"],
        wedgeprops={
            "edgecolor": "black",
            "linewidth": 2,
            "linestyle": "solid",
            "antialiased": True,
        },
    )

    # Obtener la fecha actual
    fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Utilizar la fecha actual en el título del gráfico
    plt.title(
        f"Dificultat de les respostes encertades de {sys.argv[2]} ({fecha_actual})",
        fontsize=16,
    )

    plt.yticks(fontsize=12)

    # Eliminar la cuadrícula horizontal
    plt.grid(axis="x", linestyle="--", alpha=0.7)

    # Guardar la figura en un archivo
    plt.tight_layout()
    plt.savefig(filename)
    plt.close()


def graficar_puntos_por_usuario(df, filename):
    plt.figure(figsize=(10, 6))  # Establecer el tamaño de la figura

    # Crear un gráfico de barras con los puntos de cada usuario
    plt.bar(df["_id"], df["puntos"])

    # Obtener la fecha actual
    fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Utilizar la fecha actual en el título del gráfico
    plt.title(f"Puntos totales de cada usuario ({fecha_actual})", fontsize=16)

    plt.xlabel("id_usuari", fontsize=12)
    plt.ylabel("Puntos totales", fontsize=12)
    plt.xticks(df["_id"])
    # Guardar la figura en un archivo
    plt.tight_layout()
    plt.savefig(filename)
    plt.close()


def dificultatRespostes():
    conexion = establecer_conexion()
    resultados = obtener_respuestas_correctas_por_usuario_y_dificultad(conexion)

    df = pd.DataFrame(resultados, columns=["_id", "count"])
    df = df.sort_values("_id")
    filename = "./stats/dificultatRespostes_{sys.argv[2]}.png"
    graficar_respuestas_correctas_por_dificultad(df, filename)


def puntsRespostes():
    conexion = establecer_conexion()
    resultados = obtener_puntos_de_respuestas_correctas_por_usuario(conexion)
    print(resultados)

    df = pd.DataFrame(resultados, columns=["_id", "puntos"])
    df = df.sort_values("_id")
    filename = "./stats/puntsRespostes_{sys.argv[2]}.png"
    graficar_puntos_por_usuario(df, filename)


def main():
    dificultatRespostes()
    puntsRespostes()


main()
