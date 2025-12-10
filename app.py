from flask import Flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from routes.chatbot_routes import chatbot_bp
import subprocess
import socket
import time

# Initialize Firebase
cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://syncmediai-default-rtdb.europe-west1.firebasedatabase.app/"
})

OLLAMA_PORT = 11434
def is_port_open(port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.connect(("127.0.0.1", port))
        s.shutdown(2)
        return True
    except:
        return False
    
def start_ollama_server():
    if is_port_open(OLLAMA_PORT):
        print("Ollama already running.")
        return
    print("Starting Ollama server...")

    subprocess.Popen(["ollama", "serve"],
                     stdout=subprocess.DEVNULL,
                     stderr=subprocess.DEVNULL,
                     shell=True
                     )
    for _ in range(15):
        if is_port_open(OLLAMA_PORT):
            print("Ollama started successfully.")
            return
        time.sleep(1)
    print("Warning: Ollama may have failed to start.") 
start_ollama_server()

# Create Flask app
app = Flask(__name__)
CORS(app)

# Register your chatbot blueprint
app.register_blueprint(chatbot_bp, url_prefix="/chatbot")  # all routes now under /chatbot

if __name__ == "__main__":
    app.run(port=5000, debug=True)



