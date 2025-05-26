# 🔧 Troubleshooting Guide - Release System

## Erreurs courantes et solutions

### 1. ❌ "manifest.filter is not a function"

**Cause**: Problème avec le cache yarn ou fichier yarn.lock manquant

**Solutions**:
```bash
# Solution 1: Nettoyer et réinstaller
rm -rf node_modules yarn.lock
yarn install

# Solution 2: Utiliser npm (temporaire)
rm -rf node_modules package-lock.json
npm install

# Solution 3: Vérifier le cache-dependency-path
# Assurer que le chemin dans .github/workflows/*.yaml est correct
```

### 2. ❌ "No commits found for the current branch"

**Cause**: Semantic-release ne trouve pas de commits avec conventional commits

**Solutions**:
```bash
# Vérifier l'historique des commits
git log --oneline

# Ajouter un commit conventionnel
git commit --allow-empty -m "feat: initialize release system"

# Push vers dev pour déclencher une release
git push origin dev
```

### 3. ❌ "Branch dev is not configured for releases"

**Cause**: Configuration semantic-release incorrecte

**Solutions**:
```bash
# Vérifier release.config.js
cat release.config.js

# S'assurer que dev est dans les branches:
# branches: ["master", { name: "dev", prerelease: "beta" }]
```

### 4. ❌ "GITHUB_TOKEN permissions insufficient"

**Cause**: Token GitHub n'a pas les bonnes permissions

**Solutions**:
1. Aller dans Settings → Actions → General
2. Workflow permissions → Read and write permissions
3. Ou ajouter un Personal Access Token avec scopes:
   - `repo` (full control)
   - `write:packages` (si nécessaire)

### 5. ❌ "semantic-release command not found"

**Cause**: Dépendances non installées

**Solutions**:
```bash
# À la racine du projet
yarn install

# Vérifier l'installation
ls node_modules/.bin/semantic-release

# Tester
yarn semantic-release --dry-run
```

### 6. ❌ "Failed to publish release"

**Cause**: Problème réseau ou permissions GitHub

**Solutions**:
```bash
# Vérifier la connectivité
gh auth status

# Re-authenticate si nécessaire
gh auth login

# Vérifier les permissions du repo
gh repo view --json permissions
```

### 7. ❌ "Working directory is not clean"

**Cause**: Fichiers non commités

**Solutions**:
```bash
# Vérifier l'état
git status

# Soit commit les changements
git add .
git commit -m "chore: prepare for release"

# Soit les ignorer (attention!)
git stash

# Ou reset si pas important
git reset --hard HEAD
```

### 8. ❌ "Version already exists"

**Cause**: Tag déjà présent

**Solutions**:
```bash
# Voir les tags existants
git tag

# Supprimer un tag si nécessaire
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# Force un nouveau tag (attention!)
git tag -f v1.0.0
git push origin v1.0.0 --force
```

### 9. ❌ "Deploy workflow not triggered"

**Cause**: Configuration workflow ou permissions

**Solutions**:
```bash
# Vérifier les events dans deploy.yaml
# on:
#   release:
#     types: [published]

# Vérifier manuellement
gh workflow run deploy.yaml -f environment=staging
```

### 10. ❌ "PR creation failed"

**Cause**: GitHub CLI non configuré ou permissions

**Solutions**:
```bash
# Installer GitHub CLI
brew install gh

# Authenticate
gh auth login

# Tester
gh repo view
```

## Commandes de diagnostic

### Vérifier l'état général
```bash
# Status du repository
git status
git log --oneline -5

# Status des releases
make status

# Test complet
./scripts/test-workflows.sh
```

### Debug semantic-release
```bash
# Mode verbose
DEBUG=semantic-release:* yarn semantic-release --dry-run

# Vérifier config
node -e "console.log(require('./release.config.js'))"
```

### Debug GitHub Actions
```bash
# Voir les workflows
gh workflow list

# Voir les runs récents
gh run list

# Voir les logs d'un run
gh run view <run-id> --log
```

### Debug Git
```bash
# Vérifier les remotes
git remote -v

# Vérifier les branches
git branch -a

# Vérifier les tags
git tag --sort=-version:refname | head -10
```

## Réinitialiser complètement

Si tout est cassé, voici comment recommencer :

```bash
# 1. Nettoyer les node_modules
rm -rf node_modules yarn.lock
cd pcomparator && rm -rf node_modules yarn.lock && cd ..

# 2. Réinstaller
yarn install
cd pcomparator && yarn install && cd ..

# 3. Reset git si nécessaire
git fetch origin
git reset --hard origin/dev  # ou origin/master

# 4. Supprimer les tags locaux
git tag -l | xargs git tag -d

# 5. Refetch les tags
git fetch --tags

# 6. Tester
./scripts/test-workflows.sh
```

## Support et aide

### Logs utiles à partager
```bash
# Version des outils
node --version
yarn --version
git --version

# Config semantic-release
cat release.config.js

# Dernier run GitHub Actions
gh run list --limit 1

# Status git
git status
git log --oneline -5
```

### Où demander de l'aide
1. **Documentation**: `docs/RELEASE.md`
2. **Issues GitHub**: https://github.com/Clement-Muth/pcomparator/issues
3. **Discussions**: https://github.com/Clement-Muth/pcomparator/discussions

### Ressources externes
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
