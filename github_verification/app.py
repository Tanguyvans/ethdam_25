from flask import Flask, request, jsonify
from main import evaluate_challenge
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

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
            challenge_description=data['challenge_description']
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
    app.run(debug=True)