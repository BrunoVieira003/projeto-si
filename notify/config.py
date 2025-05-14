DB_CONFIG = {
    "tipo": "postgres",
    "usuario": "postgres",
    "senha": "1574",
    "host": "localhost",
    "porta": "5432",
    "banco": "postgres",
    "destino": "backups/"
}

EMAIL_CONFIG = {
    "smtp_server": "smtp.gmail.com",
    "smtp_port": 465,
    "email_origem": "seu_email@gmail.com",
    "senha_app": "sua_senha_app",
    "destinatarios": [  # pode carregar isso de um banco também
        "usuario1@email.com",
        "usuario2@email.com"
    ]
}
