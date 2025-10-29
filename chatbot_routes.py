from flask import Blueprint, request, jsonify
from firebase_admin import db
import random
import datetime

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/create_session', methods=['POST'])
def create_session():
    try:
        data = request.json
        session_name = data.get("session_name", "New Chat")
        user_id = data.get("user_id","anonymous")
        ref = db.reference(f'chats/{user_id}')
        new_session = ref.push({
            "session_name":session_name,
            "created_at": datetime.datetime.now().isoformat(),
            "messages": {}
    })

        return jsonify({"message": "Session created successfully", "session_id" : new_session.key}), 200
    except Exception as e:
        return jsonify({"error" : str(e)}), 500
    
@chatbot_bp.route('/send message', methods=['POST'])
def send_message():
    try:
        data = request.json
        user_id = data.get("user_id")
        session_id = data.get("session_id")
        user_message = data.get("message")
        if not user_id or not session_id or not user_message:
            return jsonify({"error": "Missing user_id, session_id, or message"}), 400
        chat_ref = db.reference(f"chats/{user_id}/{session_id}/messages")
        chat_ref.push({ "sender":"user","text":user_message})
    except Exception as e:
        return jsonify({"error" : str(e)}),500

@chatbot_bp.route('/get_sessions/<user_id>', methods=['GET'])
def get_sessions(user_id):
    try:
        ref = db.reference(f'chats/{user_id}')
        sessions = ref.get() or {}
        return jsonify(sessions), 200
    except Exception as e:
        return jsonify({"error" : str(e)}),500
    
@chatbot_bp.route('/get_messages', methods=['POST'])
def get_messages():
    try:
        data = request.json
        user_id = data.get("user_id")
        session_id = data.get("session_id")
        if not user_id or not session_id:
            return jsonify({"error": "Missing user_id or session_id"}), 400
        ref = db.reference(f"chats/{user_id}/{session_id}/messages")
        messages = ref.get() or {}
        return jsonify(messages), 200
    except Exception as e:
        return jsonify({"error" : str(e)}),500