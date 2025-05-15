from dotenv import load_dotenv
import os

load_dotenv()  # Carrega variáveis do .env

DB_CONFIG = {
    "tipo": os.getenv("DB_TIPO"),
    "usuario": os.getenv("DB_USUARIO"),
    "senha": os.getenv("DB_SENHA"),
    "host": os.getenv("DB_HOST"),
    "porta": os.getenv("DB_PORTA"),
    "banco": os.getenv("DB_BANCO"),
    "destino": os.getenv("DB_DESTINO"),
}

EMAIL_CONFIG = {
    "smtp_server": os.getenv("EMAIL_SMTP_SERVER"),
    "smtp_port": int(os.getenv("EMAIL_SMTP_PORT")),
    "email_origem": os.getenv("EMAIL_ORIGEM"),
    "senha_app": os.getenv("EMAIL_SENHA_APP"),
}
