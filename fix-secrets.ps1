# Script simple pour retirer les secrets de l'historique Git
# Méthode: Rebase interactif

Write-Host "🔧 Script pour retirer les secrets de l'historique Git" -ForegroundColor Yellow
Write-Host ""

# Vérifier qu'on est sur la branche main
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "main") {
    Write-Host "❌ Erreur: Vous devez être sur la branche 'main'" -ForegroundColor Red
    Write-Host "   Branche actuelle: $currentBranch" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Étapes à suivre:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Démarrer un rebase interactif:" -ForegroundColor Yellow
Write-Host "   git rebase -i 0ff1d1c" -ForegroundColor White
Write-Host ""
Write-Host "2. Dans l'éditeur qui s'ouvre, changez 'pick' en 'edit' pour le commit 0640f23" -ForegroundColor Yellow
Write-Host "   Exemple:" -ForegroundColor White
Write-Host "   edit 0640f23 correction apres deploiement" -ForegroundColor Gray
Write-Host "   pick 9d78fa5 Retirer docker-compose.yml du repo" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Sauvegardez et fermez l'éditeur" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Git va s'arrêter sur le commit 0640f23" -ForegroundColor Yellow
Write-Host "   Remplacez le contenu de docker-compose.yml par la version sans secrets" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Exécutez ces commandes:" -ForegroundColor Yellow
Write-Host "   git add docker-compose.yml" -ForegroundColor White
Write-Host "   git commit --amend --no-edit" -ForegroundColor White
Write-Host "   git rebase --continue" -ForegroundColor White
Write-Host ""
Write-Host "6. Forcez le push:" -ForegroundColor Yellow
Write-Host "   git push origin main --force" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  ATTENTION: --force réécrit l'historique sur le serveur!" -ForegroundColor Red
Write-Host ""

$continue = Read-Host "Voulez-vous démarrer le rebase maintenant? (o/n)"
if ($continue -eq "o" -or $continue -eq "O") {
    Write-Host ""
    Write-Host "🚀 Démarrage du rebase interactif..." -ForegroundColor Green
    git rebase -i 0ff1d1c
} else {
    Write-Host ""
    Write-Host "✅ Instructions affichées. Exécutez les commandes manuellement." -ForegroundColor Green
}


