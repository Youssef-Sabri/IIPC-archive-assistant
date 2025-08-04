import os
import pickle
import numpy as np
import faiss
import requests
from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
from flask_cors import CORS
import traceback

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load FAISS index and texts
with open("embeddings_v2.pkl", "rb") as f:
    data = pickle.load(f)

embeddings = np.array(data["embeddings"]).astype("float32")
combined_texts = data["combined_texts"]

index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings)

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
AiModel = genai.GenerativeModel("gemini-2.5-flash-lite")

# Load remote embedding API URL from .env
REMOTE_EMBEDDING_API = os.getenv("VITE_EMBEDDING_API_URL")

# Call Hugging Face embedding API
def get_remote_embedding(text: str):
    try:
        response = requests.post(
            REMOTE_EMBEDDING_API,
            json={"text": text},
            timeout=20,
        )
        response.raise_for_status()
        return response.json()["embedding"]
    except Exception as e:
        print("Embedding API error:", str(e))
        return None

def retrieve_top_k(query, k=10):
    query_embedding = get_remote_embedding(query)
    if not query_embedding:
        return []
    distances, indices = index.search(np.array([query_embedding]).astype("float32"), k)
    return [combined_texts[i] for i in indices[0]]

def generate_response(query, context_docs):
    context = "\n----\n".join(context_docs)

    prompt = f"""You are an expert assistant specialized in web archiving, using ONLY the provided IIPC conference materials below.

Each document includes metadata fields like Title, Creator, Date, Subject, and Content, clearly labeled.

Answer the user's questions strictly based on this context about web archiving topics discussed in the IIPC conferences.

Format your answer in clear, simple language without using markdown symbols such as asterisks, underscores, or other formatting characters.

Use plain text bullet points or paragraphs to make the answer easy to read and understand.

If the question asks about a specific year or topic, base your answers only on the relevant information found in the context.

Do NOT make any assumptions or use knowledge beyond what is in the provided documents.

If the answer is not found in the context, respond with: "I don't know."

Context:
{context}

Question: {query}
Answer:"""

    response = AiModel.generate_content(prompt)
    return response.text

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        query = data.get("query")
        if not query:
            return jsonify({"error": "Query not provided"}), 400

        print(f"Received query: {query}")

        context_docs = retrieve_top_k(query)
        print(f"Retrieved {len(context_docs)} context docs")

        if not context_docs:
            return jsonify({"response": "I don't know."})

        answer = generate_response(query, context_docs)
        print("Generated answer")

        return jsonify({"response": answer})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
