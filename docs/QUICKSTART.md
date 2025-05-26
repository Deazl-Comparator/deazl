# 🚀 Guide de démarrage rapide - Release System

## Installation et configuration

### 1. Première utilisation

```bash
# Cloner et installer
git clone https://github.com/Clement-Muth/pcomparator.git
cd pcomparator

# Installer les dépendances
yarn install
cd pcomparator && yarn install

# Tester la configuration
./scripts/test-workflows.sh
```

### 2. Configuration GitHub

1. **Permissions du token GitHub** : Assure-toi que `GITHUB_TOKEN` a les permissions :
   - `contents: write`
   - `issues: write` 
   - `pull-requests: write`

2. **Protection des branches** (optionnel mais recommandé) :
   - `master` : Protégée, require PR reviews
   - `dev` : Peut être modifiée directement

## Workflow quotidien

### 🔧 Développement d'une feature

```bash
# 1. Créer une nouvelle feature
make feature-start NAME=ma-super-feature

# 2. Développer avec des commits conventionnels
git commit -m "feat: ajouter nouvelle fonctionnalité"
git commit -m "fix: corriger bug dans le composant"
git commit -m "docs: mettre à jour documentation"

# 3. Créer une PR vers dev
make feature-finish
```

### 📦 Release vers staging

```bash
# Merger la PR vers dev
# → Déclenche automatiquement une pre-release (ex: 1.2.0-beta.1)
# → Déploie automatiquement sur staging
```

### 🚀 Release vers production

```bash
# Option 1: Via Makefile (recommandé)
make promote VERSION=1.2.0-beta.1

# Option 2: Via interface GitHub
# Actions → Promote to Production → Run workflow

# Option 3: Manuellement
git checkout master
git merge --no-ff v1.2.0-beta.1
git push origin master
```

## Types de commits

| Prefix | Description | Impact version |
|--------|-------------|----------------|
| `feat:` | Nouvelle fonctionnalité | Minor (1.0.0 → 1.1.0) |
| `fix:` | Correction de bug | Patch (1.0.0 → 1.0.1) |
| `BREAKING CHANGE:` | Changement cassant | Major (1.0.0 → 2.0.0) |
| `docs:` | Documentation | Aucun |
| `style:` | Formatage | Aucun |
| `refactor:` | Refactoring | Aucun |
| `test:` | Tests | Aucun |
| `chore:` | Maintenance | Aucun |

### Exemples de commits

```bash
# Feature simple
git commit -m "feat: ajouter recherche par code-barres"

# Fix critique
git commit -m "fix: corriger erreur de calcul des prix"

# Breaking change
git commit -m "feat!: nouvelle API de comparaison

BREAKING CHANGE: l'API /compare change de format"

# Multiple scopes
git commit -m "feat(auth): ajouter login OAuth Google"
git commit -m "fix(ui): corriger responsive du header"
```

## Commandes rapides

```bash
# Status des releases
make status

# Voir les changements non-released
make changelog

# Promouvoir vers prod
make promote

# Déployer manuellement
make deploy

# Aide complète
./scripts/release.sh help
```

## Environnements

| Environnement | Branch | URL | Versions |
|---------------|--------|-----|----------|
| **Staging** | `dev` | staging.pcomparator.app | Pre-releases (1.2.0-beta.1) |
| **Production** | `master` | pcomparator.app | Stables (1.2.0) |

## Dépannage

### ❌ "manifest.filter is not a function"
```bash
# Solution 1: Vérifier le cache yarn
rm -rf node_modules yarn.lock
yarn install

# Solution 2: Utiliser npm au lieu de yarn
npm install
```

### ❌ Release bloquée
```bash
# Vérifier l'état
git status
make status

# Dry-run pour debug
yarn semantic-release --dry-run
```

### ❌ Conflit de merge
```bash
# Résoudre et continuer
git add .
git commit -m "resolve: merge conflict"
git push
```

### ❌ Mauvaise version générée
```bash
# Supprimer un tag
git tag -d v1.2.0
git push origin :refs/tags/v1.2.0

# Re-run semantic-release
yarn semantic-release
```

## Monitoring

### GitHub Actions
- **CI** : Tests automatiques sur chaque PR
- **Release** : Releases automatiques sur dev/master
- **Deploy** : Déploiements automatiques

### Notifications
- **Releases** : Notifications GitHub + Slack (si configuré)
- **Erreurs** : Email + GitHub notifications

## Support

- 📖 [Documentation complète](docs/RELEASE.md)
- 🐛 [Issues GitHub](https://github.com/Clement-Muth/pcomparator/issues)
- 💬 Slack: #pcomparator-releases
