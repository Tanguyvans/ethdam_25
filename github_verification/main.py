from github import Github
from datetime import datetime
from dotenv import load_dotenv
import os
import re
from ollama import chat, ChatResponse

# Load environment variables from .env file
load_dotenv()

# Access the GitHub token
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_NAME = "MaximeGloesener/demo"  # ex: "octocat/Hello-World"
START_DATE = "2024-09-20"
END_DATE = "2024-09-24"
TARGET_AUTHOR = "MaximeGloesener"  # pour filtrer uniquement les commits de l'utilisateur

# Connexion à l'API
g = Github(GITHUB_TOKEN)
repo = g.get_repo(REPO_NAME)

# Conversion des dates
start = datetime.fromisoformat(START_DATE)
end = datetime.fromisoformat(END_DATE)

# Récupérer les commits
commits = repo.get_commits(since=start, until=end)

CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".java", ".cpp", ".c", ".cs", ".go",
    ".rs", ".rb", ".php", ".html", ".css", ".scss", ".vue",
    ".swift", ".kt", ".m", ".sh", ".sql"
}

def is_code_file(filename: str) -> bool:
    _, ext = os.path.splitext(filename)
    return ext.lower() in CODE_EXTENSIONS

def calculate_commit_stats(commit_data: list[dict]) -> dict:
    """Calculate statistics from commit data."""
    total_additions = 0
    total_deletions = 0
    total_files = 0
    file_types = set()

    for commit in commit_data:
        for file in commit["files"]:
            total_additions += file["additions"]
            total_deletions += file["deletions"]
            total_files += 1
            _, ext = os.path.splitext(file["filename"])
            file_types.add(ext.lower())

    return {
        "total_commits": len(commit_data),
        "total_additions": total_additions,
        "total_deletions": total_deletions,
        "total_files": total_files,
        "file_types": list(file_types)
    }
def format_prompt(challenge_description: str, commits: list[dict], start_date: str, end_date: str, stats: dict) -> str:
    prompt = f"""Tu es un assistant expert en revue de code. Ton rôle est d'évaluer si un développeur a respecté un objectif annoncé dans un challenge de codage.

*** OBJECTIF DU CHALLENGE ***
🎯 L'objectif du challenge est le suivant:
{challenge_description}

*** CODE IMPLEMENTE ***
📂 Voici les commits et les changements associés (fichiers de code uniquement) :
"""

    for commit in commits:
        prompt += f"\n---\n🔐 Commit {commit['sha'][:7]} - {commit['date']}\n📝 Message: {commit['message']}\n"
        for file in commit["files"]:
            prompt += f"\n📄 Fichier: {file['filename']} (+{file['additions']} / -{file['deletions']})\n"
            if file["patch"]:
                prompt += f"diff\n{file['patch']}\n\n"

    prompt += """
---

Tu connais maintenant l'objectif du challenge, c'est-à-dire ce qui est attendu du développeur. Et tu connais également le code implémenté, pour savoir si le challenge est réussi ou non, tu vas suivre les étapes suivantes:

🧠 Étape 1 : Donne un **résumé technique clair** de ce qui a été fait dans le code (ce que le développeur a réellement produit).

🧪 Étape 2 : Vérifie **si le travail accompli correspond exactement à l'objectif du challenge**.
- Liste les mots-clés et concepts spécifiques de l'objectif du challenge
- Liste les mots-clés et concepts spécifiques du résumé technique
- Vérifie s'il y a une correspondance directe entre ces deux ensembles de concepts
- Identifie clairement tout écart ou divergence entre le résumé technique et l'objectif

ATTENTION CRITIQUE: Tu dois faire une comparaison terme à terme entre l'objectif du challenge et le résumé technique. Pour qu'un challenge soit considéré comme respecté, le domaine technique et la fonctionnalité principale DOIVENT correspondre exactement.

Exemples d'incompatibilité:
- Si l'objectif mentionne "page web météo" et le code concerne "modèle de pruning", alors le challenge n'est PAS respecté.
- Si l'objectif mentionne "API REST" et le code implémente "interface graphique", alors le challenge n'est PAS respecté.
- Si l'objectif mentionne "base de données SQL" et le code implémente "stockage NoSQL", alors le challenge n'est PAS respecté.

📊 Étape 3 : Donne une **note sur 10** uniquement si le code correspond à l'objectif. Sinon, donne une note de 0 et explique clairement pourquoi.

Format obligatoire de ta réponse :

- Résumé technique :
- Évaluation :
  - Mots-clés de l'objectif: [liste]
  - Mots-clés du résumé: [liste]
  - Correspondance: [OUI/NON avec explication]
- NOTE: X
"""

    return prompt


def extract_score(llm_response: str) -> int:
    match = re.search(r"NOTE:\s*([0-9]|10)\b", llm_response)
    if match:
        score = int(match.group(1))
        # Validation que le score est dans la plage valide
        if 0 <= score <= 10:
            return score
    return None

def extract_summary(llm_response: str) -> dict:
    parts = re.split(r"(Résumé technique\s*:|Évaluation\s*:|NOTE\s*:)", llm_response, flags=re.IGNORECASE)
    return {
        "summary": parts[2].strip() if len(parts) >= 6 else "",
        "evaluation": parts[4].strip() if len(parts) >= 6 else "",
        "score": extract_score(llm_response)
    }

def ask_ollama(prompt: str) -> str:
    response: ChatResponse = chat(model='qwen3:4b', messages=[
        {"role": "system", "content": "Tu es un assistant expert en revue de code."},
        {"role": "user", "content": prompt}
    ])
    return response['message']['content']

def evaluate_challenge(
    repo_name: str,
    start_date: str,
    end_date: str,
    target_author: str,
    challenge_description: str,
    github_token: str = None
) -> dict:
    """
    Evaluate a coding challenge based on GitHub commits.

    Args:
        repo_name: GitHub repository name (format: "owner/repo")
        start_date: Start date in ISO format (YYYY-MM-DD)
        end_date: End date in ISO format (YYYY-MM-DD)
        target_author: GitHub username to filter commits
        challenge_description: Description of the coding challenge
        github_token: GitHub API token (optional if set in .env)

    Returns:
        dict: Contains summary, evaluation, score, and statistics
    """
    token = github_token or os.getenv("GITHUB_TOKEN")
    if not token:
        raise ValueError("GitHub token is required")

    g = Github(token)
    repo = g.get_repo(repo_name)
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)
    commits = repo.get_commits(since=start, until=end)

    commit_data = []
    for commit in commits:
        if commit.author and commit.author.login == target_author:
            files = [
                {
                    "filename": file.filename,
                    "additions": file.additions,
                    "deletions": file.deletions,
                    "patch": file.patch
                }
                for file in commit.files
                if is_code_file(file.filename)
            ]

            if files:
                commit_data.append({
                    "sha": commit.sha,
                    "date": commit.commit.author.date.isoformat(),
                    "message": commit.commit.message,
                    "files": files
                })

    # Si aucun commit n'est trouvé, retourner un résultat d'échec
    if not commit_data:
        return {
            "summary": "Aucun commit trouvé dans la période spécifiée.",
            "evaluation": "Le challenge n'a pas été complété car aucun commit n'a été effectué pendant la période donnée.",
            "score": 0,
            "stats": {
                "total_commits": 0,
                "total_additions": 0,
                "total_deletions": 0,
                "total_files": 0,
                "file_types": []
            }
        }

    # Calculer les statistiques
    stats = calculate_commit_stats(commit_data)

    prompt = format_prompt(challenge_description, commit_data, start_date, end_date, stats)
    response = ask_ollama(prompt)
    result = extract_summary(response)

    # Validation supplémentaire pour s'assurer que le score est cohérent
    if result['score'] is None or not (0 <= result['score'] <= 10):
        result['score'] = 0
        result['evaluation'] = "Erreur dans l'évaluation. Score invalide détecté."

    # Ajouter les statistiques au résultat
    result['stats'] = stats

    return result

# Example usage:
if __name__ == "__main__":
    result = evaluate_challenge(
        repo_name="MaximeGloesener/demo",
        start_date="2024-09-10",
        end_date="2024-09-24",
        target_author="MaximeGloesener",
        challenge_description="faire une application qui fait la météo en react JS"
    )

    print("Résumé technique :", result['summary'])
    print("Évaluation :", result['evaluation'])
    print("Note :", result['score'], "/ 10")
    print("\nStatistiques :")
    print(f"- Nombre de commits : {result['stats']['total_commits']}")
    print(f"- Lignes ajoutées : {result['stats']['total_additions']}")
    print(f"- Lignes supprimées : {result['stats']['total_deletions']}")
    print(f"- Fichiers modifiés : {result['stats']['total_files']}")
    print(f"- Types de fichiers : {', '.join(result['stats']['file_types'])}")