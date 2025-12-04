#!/usr/bin/env python3
"""
Simple embedding server using sentence-transformers/all-mpnet-base-v2
This ensures embeddings match the database index.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import os

app = Flask(__name__)
CORS(app)

# Load the exact model used for database embeddings
print("Loading sentence-transformers/all-mpnet-base-v2...")
model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
print("Model loaded successfully!")

@app.route('/embed', methods=['POST'])
def embed():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
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
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting embedding server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)

