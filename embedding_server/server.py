"""
Simple embedding server using sentence-transformers/all-mpnet-base-v2
Run with: python server.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
CORS(app)

# Load model once at startup
print("Loading sentence-transformers/all-mpnet-base-v2 model...")
model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
print("Model loaded successfully!")

@app.route('/embed', methods=['POST'])
def embed():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Truncate if too long
        text = text[:8000]
        
        # Generate embedding
        embedding = model.encode(text, convert_to_numpy=True)
        
        return jsonify({
            'embedding': embedding.tolist()
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': 'sentence-transformers/all-mpnet-base-v2'})

if __name__ == '__main__':
    print("Starting embedding server on http://localhost:8000")
    app.run(host='0.0.0.0', port=8000)

