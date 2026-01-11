from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize with strict V2 headers
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    default_headers={"OpenAI-Beta": "assistants=v2"}
)

# Assistant ID
ASSISTANT_ID = os.getenv('ASSISTANT_ID')

def preprocess_markdown(text):
    """Add proper line breaks for markdown formatting"""
    import re
    
    # Add newline before list items that start with "- **"
    text = re.sub(r'([^\n])(- \*\*)', r'\1\n\2', text)
    
    # Add newline after prices followed by "- **" (list items)
    text = re.sub(r'(\$\d+\.\d{2})(- \*\*)', r'\1\n\2', text)
    
    # Add newline before emojis (section headers)
    text = re.sub(r'([^\n*])(\*\*[🍔🍗🍕🥗🍩🎉📍👨‍🍳💰])', r'\1\n\n\2', text)
    
    # Add newline after bold section headers (**text**)
    text = re.sub(r'(\*\*[🍔🍗🍕🥗🍩].+?\*\*)([^\n])', r'\1\n\2', text)
    
    # Add newline after prices that are followed by another dash or capital letter
    text = re.sub(r'(\$\d+\.\d{2})([A-Z-])', r'\1\n\2', text)
    
    # Add newline after closing period followed by capital letter
    text = re.sub(r'(\$\d+\.\d{2}\.)([A-Z])', r'\1\n\n\2', text)
    
    # Clean up excessive newlines (more than 2)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip()

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "message": "Foodies Chatbot API is running",
        "has_openai_key": bool(os.getenv('OPENAI_API_KEY')),
        "has_assistant_id": bool(os.getenv('ASSISTANT_ID'))
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Get messages from request
        data = request.get_json()
        messages = data.get('messages', [])
        
        # Get the last user message
        if not messages:
            return jsonify({
                "success": False,
                "error": "No messages provided"
            }), 400
        
        # Find the last user message
        user_message = None
        for msg in reversed(messages):
            if msg.get('role') == 'user':
                user_message = msg.get('content', '')
                break
        
        if not user_message:
            return jsonify({
                "success": False,
                "error": "No user message found"
            }), 400
        
        # Create a thread
        thread = client.beta.threads.create()
        
        # Add user message to thread
        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_message
        )
        
        # Run the assistant
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=ASSISTANT_ID
        )
        
        # Wait for completion
        while run.status in ['queued', 'in_progress']:
            time.sleep(0.5)
            run = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )
        
        if run.status == 'completed':
            # Get messages from thread
            thread_messages = client.beta.threads.messages.list(
                thread_id=thread.id
            )
            
            # Get the assistant's response (first message in the list)
            assistant_message = thread_messages.data[0].content[0].text.value
            
            # Preprocess markdown to ensure proper line breaks
            assistant_message = preprocess_markdown(assistant_message)
            
            return jsonify({
                "success": True,
                "message": assistant_message
            })
        else:
            return jsonify({
                "success": False,
                "error": f"Run failed with status: {run.status}"
            }), 500
    
    except Exception as e:
        print(f"Error in /api/chat: {str(e)}")  # Log to Render console
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
