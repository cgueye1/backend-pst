# Instructions pour retirer les secrets de l'historique Git

## Méthode simple (recommandée)

### Option 1 : Utiliser git rebase interactif

```bash
# 1. Démarrer un rebase interactif depuis avant le commit problématique
git rebase -i 0ff1d1c

# 2. Dans l'éditeur qui s'ouvre, changez "pick" en "edit" pour le commit 0640f23
#    Exemple:
#    edit 0640f23 correction apres deploiement
#    pick 9d78fa5 Retirer docker-compose.yml du repo

# 3. Git va s'arrêter sur le commit 0640f23
#    Remplacez le contenu de docker-compose.yml par la version sans secrets
#    (utilisez docker-compose.example.yml comme modèle)

# 4. Ajoutez le fichier modifié
git add docker-compose.yml

# 5. Modifiez le commit
git commit --amend --no-edit

# 6. Continuez le rebase
git rebase --continue

# 7. Forcez le push
git push origin main --force
```

### Option 2 : Utiliser git filter-branch (automatique)

Exécutez le script PowerShell fourni :

```powershell
.\fix-git-history.ps1
```

Puis forcez le push :

```bash
git push origin main --force
```

## ⚠️ IMPORTANT

- **Force push réécrit l'historique** : Si d'autres personnes ont déjà récupéré le commit, elles devront faire un `git pull --rebase` ou recréer leur branche
- **Sauvegardez votre travail** avant d'exécuter ces commandes
- **Testez d'abord sur une branche de test** si possible

## Alternative : Autoriser le secret via GitHub

Si vous préférez ne pas modifier l'historique, vous pouvez autoriser le secret via le lien GitHub :
https://github.com/cgueye1/backend-pst/security/secret-scanning/unblock-secret/38XYojRHfIATJ0KzkdIENXD8uNV

