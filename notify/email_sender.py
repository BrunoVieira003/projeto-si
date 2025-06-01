import smtplib
from email.mime.text import MIMEText
from config import EMAIL_CONFIG
from db_utils import buscar_emails_usuarios

def enviar_alerta_invasao():
    destinatarios = buscar_emails_usuarios()
    if not destinatarios:
        print("⚠️ Nenhum destinatário encontrado.")
        return

    msg = MIMEText("⚠️ Detectamos uma possível invasão ao sistema. Um backup foi realizado. Verifique sua conta.")
    msg["Subject"] = "🚨 Alerta de Segurança - Backup Executado"
    msg["From"] = EMAIL_CONFIG["email_origem"]
    msg["To"] = ", ".join(destinatarios)

    try:
        with smtplib.SMTP_SSL(EMAIL_CONFIG["smtp_server"], EMAIL_CONFIG["smtp_port"]) as server:
            server.login(EMAIL_CONFIG["email_origem"], EMAIL_CONFIG["senha_app"])
            server.send_message(msg)
            print(f"✅ E-mail enviado a {len(destinatarios)} usuários.")
    except Exception as e:
        print("❌ Erro ao enviar e-mail:", e)
