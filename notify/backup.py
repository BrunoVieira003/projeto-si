import os
import subprocess
from datetime import datetime
from config import DB_CONFIG

def executar_backup():
    data = datetime.now().strftime("%Y-%m-%d_%H-%M")
    nome_arquivo = f"backup_{data}.sql"
    caminho_destino = os.path.join(DB_CONFIG["destino"], nome_arquivo)

    if not os.path.exists(DB_CONFIG["destino"]):
        os.makedirs(DB_CONFIG["destino"])

    tipo = DB_CONFIG["tipo"]
    comando = []

    if tipo == "postgres":
        os.environ["PGPASSWORD"] = DB_CONFIG["senha"]
        comando = [
            r"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe",
            "-U", DB_CONFIG["usuario"],
            "-h", DB_CONFIG["host"],
            "-p", DB_CONFIG["porta"],
            "-F", "c",
            "-f", caminho_destino,
            DB_CONFIG["banco"]
        ]
    else:
        raise Exception("Tipo de banco não suportado.")

    subprocess.run(comando, check=True)
    return caminho_destino
