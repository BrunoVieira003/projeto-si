import tkinter as tk
from tkinter import messagebox, scrolledtext
from backup import executar_backup
from email_sender import enviar_alerta_invasao
import threading
import sys
import io

# Credenciais fixas (exemplo simples)
USUARIO_CORRETO = "admin"
SENHA_CORRETA = "1234"

# Redirecionador de stdout para o Text
class ConsoleRedirector(io.TextIOBase):
    def __init__(self, text_widget):
        self.text_widget = text_widget

    def write(self, msg):
        self.text_widget.after(0, self.text_widget.insert, tk.END, msg)
        self.text_widget.after(0, self.text_widget.see, tk.END)

    def flush(self):
        pass

def realizar_emergencia():
    def tarefa():
        try:
            print("🔄 Iniciando backup...")
            destino = executar_backup()
            print("🔄 Enviando alerta de invasão...")
            enviar_alerta_invasao()
            print("✅ Procedimento finalizado.")
            messagebox.showinfo("Sucesso", f"Backup criado e alerta enviado!\nArquivo: {destino}")
        except Exception as e:
            print(f"❌ Erro ao executar backup:\n{e}")
            messagebox.showerror("Erro", f"Erro ao executar backup:\n{e}")

    threading.Thread(target=tarefa).start()

def abrir_janela_principal():
    janela_login.destroy()  # Fecha janela de login

    janela = tk.Tk()
    janela.title("Backup de Emergência")
    janela.geometry("500x400")

    label = tk.Label(janela, text="Backup + Alerta de Invasão", font=("Arial", 14))
    label.pack(pady=10)

    botao = tk.Button(janela, text="Executar Procedimento", command=realizar_emergencia,
                      bg="#ff4444", fg="white", height=2, width=30)
    botao.pack(pady=10)

    # Área de log
    log_text = scrolledtext.ScrolledText(janela, height=15, width=60, state="normal")
    log_text.pack(padx=10, pady=10)

    # Redireciona stdout/stderr
    sys.stdout = ConsoleRedirector(log_text)
    sys.stderr = ConsoleRedirector(log_text)

    janela.mainloop()

def tentar_login():
    usuario = entry_usuario.get()
    senha = entry_senha.get()

    if usuario == USUARIO_CORRETO and senha == SENHA_CORRETA:
        abrir_janela_principal()
    else:
        messagebox.showerror("Erro de Login", "Usuário ou senha incorretos.")

# Tela de login
janela_login = tk.Tk()
janela_login.title("Login")
janela_login.geometry("300x200")

tk.Label(janela_login, text="Usuário:").pack(pady=5)
entry_usuario = tk.Entry(janela_login)
entry_usuario.pack()

tk.Label(janela_login, text="Senha:").pack(pady=5)
entry_senha = tk.Entry(janela_login, show="*")
entry_senha.pack()

tk.Button(janela_login, text="Entrar", command=tentar_login, bg="#007acc", fg="white").pack(pady=20)

janela_login.mainloop()
