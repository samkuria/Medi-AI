import firebase_admin
from firebase_admin import credentials,db

cred=credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://syncmediai-default-rtdb.europe-west1.firebasedatabase.app/"
})