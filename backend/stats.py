import pandas as pd
import matplotlib.pyplot as plt
import mysql.connector
from pymongo import MongoClient
import seaborn as sns
from datetime import datetime

def establecer_conexion():
    """Establece la conexión a la base de datos y devuelve el cursor."""
    conexion = mysql.connector.connect(
        host='dam.inspedralbes.cat',
        user='a22tomybanog_Projecte1',
        password='Projecte1',
        database='a22tomybanog_Projecte1'
    )
    # client = MongoClient(
    #     host='dam.inspedralbes.cat',
    #     user='a22tomybanog_Projecte1',
    #     password='Projecte1',
    #     database='a22tomybanog_Projecte1'
    # )
    return conexion, conexion.cursor()


def obtener_productos_ordenados_cantidad(cursor):
    """Obtiene los productos ordenados por cantidad."""
    consulta = """
    SELECT id, nom, quantitat
    FROM Producte
    ORDER BY quantitat ASC
   
    """
    cursor.execute(consulta)
    #si pongo fetchone coge solo el primero
    return cursor.fetchall()

def graficoCantidad(df, filename):
    """Crea un gráfico de barras horizontales a partir de un DataFrame."""
    plt.figure(figsize=(10, 6), facecolor='#f3f1ff')  # Establecer el color de fondo de toda la figura
    
    # Crear un gráfico de barras horizontales con puntas redondas y color personalizado
    plt.barh(df['nom'], df['quantitat'], color='#9094e9', capstyle='round')
    
    # Obtener la fecha actual
    fecha_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
   
    sns.set(style="whitegrid", rc={'axes.facecolor': '#f3f1ff'})
   
    # Utilizar la fecha actual en el título del gráfico
    plt.title(f'Unitats restants productes ({fecha_actual})', fontsize=16)
   
    plt.yticks(fontsize=12)
    plt.xlabel('Quantitat', fontsize=14)
    plt.ylabel('Productes', fontsize=14)
    
    # Eliminar la cuadrícula horizontal
    plt.grid(axis='x', linestyle='--', alpha=0.7)
    
    # Guardar la figura en un archivo
    plt.tight_layout()
    plt.savefig(filename)
    plt.close()
    """Crea un gráfico de barras horizontales a partir de un DataFrame."""
   
    plt.figure(figsize=(10, 6), facecolor='#f3f1ff')
    
    plt.barh("", "", color='#9094e9', capstyle='round')

    

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
    conexion, cursor = establecer_conexion()
    resultados = obtener_productos_ordenados_cantidad(cursor)
    print(resultados)
    conexion.close()


    df = pd.DataFrame(resultados, columns=['id', 'nom', 'quantitat'])
    filename = './stats/producteCantidad.png'
    graficoCantidad(df,filename)

def main():
    CantidaRestante()
   
main()




