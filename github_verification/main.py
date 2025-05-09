from github import Github
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access the GitHub token
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_NAME = "MaximeGloesener/demo"  # ex: "octocat/Hello-World"
START_DATE = "2024-09-20"
END_DATE = "2024-09-24"
TARGET_AUTHOR = "MaximeGloesener"  # pour filtrer uniquement les commits de l'utilisateur

# Connexion à l’API
g = Github(GITHUB_TOKEN)
repo = g.get_repo(REPO_NAME)

# Conversion des dates
start = datetime.fromisoformat(START_DATE)
end = datetime.fromisoformat(END_DATE)

# Récupérer les commits
commits = repo.get_commits(since=start, until=end)


commit_data = []

CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".java", ".cpp", ".c", ".cs", ".go",
    ".rs", ".rb", ".php", ".html", ".css", ".scss", ".vue",
    ".swift", ".kt", ".m", ".sh", ".sql"
}


def is_code_file(filename):
    _, ext = os.path.splitext(filename)
    return ext.lower() in CODE_EXTENSIONS


def format_prompt(challenge_description: str, commits: list[dict], start_date: str, end_date: str) -> str:
    prompt = f"""Tu es un assistant expert en revue de code. Ton rôle est d'évaluer si un développeur a respecté un objectif annoncé dans un challenge de codage.

🎯 Objectif du challenge :
{challenge_description}

📅 Période du challenge :
Du {start_date} au {end_date}

📂 Voici les commits et les changements associés (fichiers de code uniquement) :
"""

    for commit in commits:
        prompt += f"\n---\n🔐 Commit {commit['sha'][:7]} - {commit['date']}\n📝 Message: {commit['message']}\n"
        for file in commit["files"]:
            if not is_code_file(file["filename"]):
                continue
            prompt += f"\n📄 Fichier: {file['filename']} (+{file['additions']} / -{file['deletions']})\n"
            if file["patch"]:
                prompt += f"```diff\n{file['patch']}\n```\n"

    prompt += """
---
🧠 Donne d'abord un **résumé technique clair** des changements apportés (ce qui a été fait concrètement dans le code).

✅ Ensuite, indique si le challenge est respecté ou non, et justifie ta réponse.

📊 Enfin, donne une **note de réussite entre 0 (échec total) et 10 (objectif parfaitement rempli)**, sur une nouvelle ligne, au format exact :
NOTE: X
(où X est un nombre entre 0 et 10)

Ta réponse doit être structurée avec :
- Résumé technique :
- Évaluation :
- NOTE: X
"""

    return prompt


import re

def extract_score(llm_response: str) -> int:
    match = re.search(r"NOTE:\s*([0-9]|10)\b", llm_response)
    if match:
        return int(match.group(1))
    return None


def extract_summary(llm_response: str) -> dict:
    summary = ""
    evaluation = ""
    score = extract_score(llm_response)

    parts = re.split(r"(Résumé technique\s*:|Évaluation\s*:|NOTE\s*:)", llm_response, flags=re.IGNORECASE)
    # crude but effective
    if len(parts) >= 6:
        summary = parts[2].strip()
        evaluation = parts[4].strip()

    return {
        "summary": summary,
        "evaluation": evaluation,
        "score": score
    }

from ollama import chat
from ollama import ChatResponse

def ask_ollama(prompt: str, model_name: str = "mistral"):
    response: ChatResponse = chat(model='qwen3:0.6b', messages=[
        {"role": "system", "content": "Tu es un assistant expert en revue de code."},
        {"role": "user", "content": prompt}
    ])
    return (response['message']['content'])



challenge_description = "faire une interface tkinter"
prompt = format_prompt(challenge_description, commit_data, START_DATE, END_DATE)
response = ask_ollama(prompt)
analysis = extract_summary(response)

print("Résumé technique :", analysis['summary'])
print("Évaluation :", analysis['evaluation'])
print("Note :", analysis['score'], "/ 10")