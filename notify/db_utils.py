import psycopg2  # ou pymysql para MySQL
from config import DB_CONFIG

def buscar_emails_usuarios():
    emails = []

    try:
        if DB_CONFIG["tipo"] == "postgres":
            conn = psycopg2.connect(
                dbname=DB_CONFIG["banco"],
                user=DB_CONFIG["usuario"],
                password=DB_CONFIG["senha"],
                host=DB_CONFIG["host"],
                port=DB_CONFIG["porta"]
            )
        else:
            raise Exception("Tipo de banco não suportado")

        cursor = conn.cursor()
        cursor.execute("SELECT email FROM users WHERE email IS NOT NULL")
        resultado = cursor.fetchall()
        emails = [r[0] for r in resultado]

        cursor.close()
        conn.close()

    except Exception as e:
        print("Erro ao buscar e-mails:", e)

    return emails
