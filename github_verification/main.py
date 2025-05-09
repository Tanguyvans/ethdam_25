from github import Github
from datetime import datetime
import os

# CONFIGURATION
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_NAME = "username/repo-name"  # ex: "octocat/Hello-World"
START_DATE = "2024-05-01"
END_DATE = "2024-05-08"
TARGET_AUTHOR = "username"  # pour filtrer uniquement les commits de l'utilisateur

# Connexion à l’API
g = Github(GITHUB_TOKEN)
repo = g.get_repo(REPO_NAME)

# Conversion des dates
start = datetime.fromisoformat(START_DATE)
end = datetime.fromisoformat(END_DATE)

# Récupérer les commits
commits = repo.get_commits(since=start, until=end)

print(f"\n--- Commits de {TARGET_AUTHOR} entre {START_DATE} et {END_DATE} ---\n")

for commit in commits:
    author = commit.author.login if commit.author else "unknown"
    if author != TARGET_AUTHOR:
        continue

    sha = commit.sha
    message = commit.commit.message
    date = commit.commit.author.date

    print(f"\n📦 Commit: {sha[:7]}")
    print(f"🕒 Date: {date}")
    print(f"🧑 Auteur: {author}")
    print(f"✏️ Message: {message.strip()}")

    files = commit.files
    for f in files:
        print(f" - {f.filename}: +{f.additions} / -{f.deletions}")

    print("-" * 50)
