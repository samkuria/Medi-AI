from flask import Blueprint, request, jsonify
from firebase_admin import db
import datetime
import requests

chatbot_bp = Blueprint('chatbot', __name__)

OLLAMA_HOST = "http://127.0.0.1:11434"  # Ollama serve must be running
MODEL_NAME = "mistral:latest"

def call_ollama_model(user_message, session_history=[]):
    try:
        # Convert session history into Ollama role/content format
        messages = [
            {
                "role": "system",
                "content":(
                    "You are MediAI, a friendly, compassionate mental-health assistant."
                    "You are NOT a medical professional, but you offer emotional support,"
                    "coping techniques, and guidance. You speak calmly, avoid judgement,"
                    "and always prioritize the user's emotional safety."
                    "You NEVER give medical diagnoses, never mention being an AI model,"
                    "and never give dangerous instructions. You help the user explore"
                    "their feelings, validate their emotions, encourage positive coping strategies,"
                    "and remind them to seek proffessional help for emergencies or severe symptoms."
                )
            }
        ]
        for msg in session_history:
            role = "user" if msg["sender"] == "user" else "assistant"
            messages.append({"role": role, "content": msg["text"]})

        # Add the current user message
        messages.append({"role": "user", "content": user_message})

        response = requests.post(
            f"{OLLAMA_HOST}/v1/chat/completions",
            json={
                "model": MODEL_NAME,
                "messages": messages,
                "max_tokens": 500
            },
            timeout=6000
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    except Exception as e:
        print("Ollama API error:", e)
        return "Sorry, I'm having trouble responding right now."

# -------------------------------
# Create a new chat session
# -------------------------------
@chatbot_bp.route('/create_session', methods=['POST'])
def create_session():
    try:
        data = request.json
        session_name = data.get("session_name", "New Chat")
        user_id = data.get("user_id", "anonymous")

        ref = db.reference(f'chats/{user_id}')
        new_session_ref = ref.push({
            "session_name": session_name,
            "created_at": datetime.datetime.now().isoformat(),
            "messages": {}
        })

        return jsonify({
            "message": "Session created successfully",
            "session_id": new_session_ref.key,
            "session_name": session_name
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# Send a message
# -------------------------------
@chatbot_bp.route('/send_message', methods=['POST'])
def send_message():
    try:
        data = request.json
        user_id = data.get("user_id")
        session_id = data.get("session_id")
        user_message = data.get("message")

        if not user_id or not session_id or not user_message:
            return jsonify({"error": "Missing user_id, session_id, or message"}), 400

        messages_ref = db.reference(f"chats/{user_id}/{session_id}/messages")

        # Save user message
        user_msg_data = {
            "sender": "user",
            "text": user_message,
            "timestamp": datetime.datetime.now().isoformat()
        }
        messages_ref.push(user_msg_data)

        # Get session history
        session_history = list((messages_ref.get() or {}).values())
        session_history.sort(key=lambda x: x["timestamp"])

        # ---------- ADD PERSONA ----------
        system_prompt = {
            "sender": "system",
            "text": (
                "You are a warm, empathetic, professional therapist. "
                "You respond with emotional support, validation, and gentle guidance. "
                "Do NOT mention being an AI or a machine. "
                "Keep responses short, human-like, and comforting. "
                "Ask thoughtful follow-up questions when appropriate."
            )
        }

        # Prepend system prompt to history (but not saved to DB)
        full_history = [system_prompt] + session_history

        # ---------- CALL OLLAMA ----------
        bot_reply = call_ollama_model(
            user_message,
            session_history=full_history   # send persona-wrapped history
        )

        # Save bot reply
        bot_msg_data = {
            "sender": "bot",
            "text": bot_reply,
            "timestamp": datetime.datetime.now().isoformat()
        }
        messages_ref.push(bot_msg_data)

        return jsonify({"reply": bot_reply}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Get all sessions for a user
# -------------------------------
@chatbot_bp.route('/get_sessions/<user_id>', methods=['GET'])
def get_sessions(user_id):
    try:
        ref = db.reference(f'chats/{user_id}')
        sessions = ref.get() or {}
        return jsonify(sessions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# Get all messages for a session
# -------------------------------
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
        return jsonify({"error": str(e)}), 500

@chatbot_bp.route('/rename_session', methods=['PATCH'])
def rename_session():
    try:
        data = request.json
        user_id = data.get("user_id")
        session_id = data.get("session_id")
        new_name = data.get("session_name")

        if not user_id or not session_id or not new_name:
            return jsonify({"error": "Missing parameters"}), 400

        ref = db.reference(f'chats/{user_id}/{session_id}')
        ref.update({"session_name": new_name})

        return jsonify({"message": "Session renamed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chatbot_bp.route('/delete_session', methods=['DELETE'])
def delete_session():
    try:
        data = request.json
        user_id = data.get("user_id")
        session_id = data.get("session_id")

        if not user_id or not session_id:
            return jsonify({"error": "Missing parameters"}), 400

        ref = db.reference(f'chats/{user_id}/{session_id}')
        ref.delete()

        return jsonify({"message": "Session deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

