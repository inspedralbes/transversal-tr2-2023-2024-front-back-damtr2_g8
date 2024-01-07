import pandas as pd
import sys
import json
import matplotlib.pyplot as plt
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

import seaborn as sns
from datetime import datetime

def establecer_conexion():
    uri = "mongodb+srv://a21marsalval_bd:ToniNoRobes2021@tr2.eatpoha.mongodb.net/?retryWrites=true&w=majority"

    client = MongoClient(uri, server_api=ServerApi('1'))
    # Send a ping to confirm a successful connection
    try:
        client.mathbattle.command('ping')
    except Exception as e:
        print(e)
    return client


def obtener_respuestas_correctas_por_usuario_y_dificultad(cursor):
    print()
    pipeline = [
        {"$match": {"id_usuari": {"$in": json.loads(sys.argv[1])}}},
        {"$group": {"_id": "$difficulty", "count": {"$sum": 1}}}
    ]
    return list(cursor.mathbattle.correctAnswers.aggregate(pipeline))

def graficar_respuestas_correctas_por_dificultad(df, filename):
    plt.figure(figsize=(10, 6), facecolor='#f3f1ff')  # Establecer el color de fondo de toda la figura
    
    # Crear un gráfico de barras horizontales con puntas redondas y color personalizado
    plt.pie(df['count'], labels=df['_id'], autopct='%1.1f%%', colors=['#d77676', '#7ed776', '#768ed7'], wedgeprops={'edgecolor': 'black', 'linewidth': 2, 'linestyle': 'solid', 'antialiased': True})
    
    # Obtener la fecha actual
    fecha_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
   
   
    # Utilizar la fecha actual en el título del gráfico
    plt.title(f'Dificultat de les respostes encertades ({fecha_actual})', fontsize=16)
   
    plt.yticks(fontsize=12)
    
    # Eliminar la cuadrícula horizontal
    plt.grid(axis='x', linestyle='--', alpha=0.7)
    
    # Guardar la figura en un archivo
    plt.tight_layout()
    plt.savefig(filename)
    plt.close()
    
    # Obtener la fecha actual
    fecha_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # Utilizar la fecha actual en el título del gráfico
    plt.title(f'Temps Preparacio ({fecha_actual})', fontsize=16)

    plt.yticks(df['data_comanda'], fontsize=12)  # Utiliza las horas como etiquetas en el eje y
    plt.xlabel('Total de Segons', fontsize=14)
    plt.ylabel('Estat Comanda', fontsize=14)

    # Eliminar la cuadrícula horizontal
    plt.grid(axis='x', linestyle='--', alpha=0.7)

    # Guardar la figura en un archivo (reemplaza 'nombre_del_archivo' con el nombre que desees)
    plt.tight_layout()
    plt.savefig(filename)
    plt.close()

def CantidaRestante():
    conexion = establecer_conexion()
    resultados = obtener_respuestas_correctas_por_usuario_y_dificultad(conexion)
    # print(resultados)

    df = pd.DataFrame(resultados, columns=['_id', 'count'])
    df = df.sort_values('_id')
    filename = './stats/producteCantidad.png'
    graficar_respuestas_correctas_por_dificultad(df,filename)

def main():
    CantidaRestante()
   
main()




