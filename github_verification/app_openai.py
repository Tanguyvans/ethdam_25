from flask import Flask, request, jsonify
from main import evaluate_challenge
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

app = Flask(__name__)

client = OpenAI()  # uses OPENAI_API_KEY from env automatically

@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to the Challenge Evaluation API',
        'endpoints': {
            '/eval-challenge': 'POST - Evaluate a GitHub challenge'
        }
    })

def ask_openai(prompt: str) -> str:
    """Send prompt to OpenAI API and return the response."""
    try:
        # Truncate prompt if it's too long (e.g., max 120k characters as a rough estimate)
        max_prompt_chars = 120000  # to stay under 128k tokens
        if len(prompt) > max_prompt_chars:
            prompt = prompt[:max_prompt_chars]

        response = client.chat.completions.create(
            model="gpt-4o",  # GPT-4o: small, fast, cheap, powerful, long context (128k tokens)
            messages=[
                {"role": "system", "content": "Tu es un assistant expert en revue de code."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000  # Adjust as needed
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")

@app.route('/eval-challenge', methods=['POST'])
def eval_challenge():
    try:
        # Get parameters from request
        data = request.get_json()

        # Validate required parameters
        required_params = ['repo_name', 'start_date', 'end_date', 'target_author', 'challenge_description']
        for param in required_params:
            if param not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required parameter: {param}'
                }), 400

        # Evaluate the challenge
        result = evaluate_challenge(
            repo_name=data['repo_name'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            target_author=data['target_author'],
            challenge_description=data['challenge_description'],
            llm_function=ask_openai  # Pass the OpenAI function instead of Ollama
        )

        # Return True if score is >= 7, False otherwise
        is_successful = result['score'] >= 7

        return jsonify({
            'success': True,
            'is_challenge_successful': is_successful,
            'score': result['score'],
            'summary': result['summary'],
            'evaluation': result['evaluation'],
            'stats': result['stats']
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)