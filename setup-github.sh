#!/bin/bash

# Script to connect local repo to GitHub and push code
# Usage: ./setup-github.sh <github-repo-url>
# Example: ./setup-github.sh https://github.com/yourusername/SQUARETRUTHS.git

if [ -z "$1" ]; then
  echo "Usage: ./setup-github.sh <github-repo-url>"
  echo "Example: ./setup-github.sh https://github.com/yourusername/SQUARETRUTHS.git"
  exit 1
fi

REPO_URL=$1

echo "Adding GitHub remote..."
git remote add origin "$REPO_URL"

echo "Pushing code to GitHub..."
git push -u origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to your Railway project dashboard"
echo "2. Go to Settings > Source"
echo "3. Connect your GitHub repository"
echo "4. Select the repository and branch (main)"
echo "5. Railway will automatically deploy on future pushes"

