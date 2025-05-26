# Release Workflow Documentation

## Vue d'ensemble

Ce projet utilise un workflow de release automatisé basé sur [semantic-release](https://semantic-release.gitbook.io/) avec deux environnements :

- **Staging** (branch `dev`) : Pre-releases automatiques
- **Production** (branch `master`) : Releases stables

## Workflow de développement

### 1. Développement des features

```bash
# Créer une branch pour ta feature
git checkout dev
git pull origin dev
git checkout -b feature/ma-nouvelle-feature

# Développer et commiter avec des messages conventionnels
git commit -m "feat: ajouter nouvelle fonctionnalité"
git commit -m "fix: corriger bug dans le composant"

# Pousser et créer une PR vers dev
git push origin feature/ma-nouvelle-feature
```

### 2. Merge vers staging (dev)

Quand tu merges une PR vers `dev` :
- ✅ Semantic-release crée automatiquement une **pre-release** (ex: `1.2.0-beta.1`)
- ✅ Le CHANGELOG est mis à jour
- ✅ Un tag Git est créé
- ✅ Le déploiement staging se déclenche automatiquement

### 3. Promotion vers production

Quand tu veux mettre en production :

#### Option A : Via l'interface GitHub (recommandé)
1. Va dans l'onglet "Actions" de ton repo
2. Clique sur "Promote to Production"
3. Clique "Run workflow"
4. Saisir la version à promouvoir (ex: `1.2.0-beta.1`)
5. Une PR sera créée automatiquement vers `master`
6. Review et merge la PR

#### Option B : Manuellement
```bash
git checkout master
git pull origin master
git merge --no-ff v1.2.0-beta.1
git push origin master
```

### 4. Release de production

Quand tu merges vers `master` :
- ✅ Semantic-release crée une **release stable** (ex: `1.2.0`)
- ✅ Le CHANGELOG est mis à jour
- ✅ Un tag Git est créé
- ✅ Le déploiement production se déclenche automatiquement

## Format des commits

Utilise [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: ajouter nouvelle fonctionnalité
fix: corriger bug critique
docs: mettre à jour documentation
style: corriger formatage
refactor: refactoriser composant
test: ajouter tests manquants
chore: mettre à jour dépendances
```

### Impact sur les versions

- `fix:` → Version patch (1.0.0 → 1.0.1)
- `feat:` → Version minor (1.0.0 → 1.1.0)
- `BREAKING CHANGE:` → Version major (1.0.0 → 2.0.0)

## Environnements

### Staging
- **Branch** : `dev`
- **Versions** : Pre-releases (ex: `1.2.0-beta.1`)
- **URL** : https://staging.pcomparator.app
- **Déploiement** : Automatique à chaque release

### Production
- **Branch** : `master`
- **Versions** : Stables (ex: `1.2.0`)
- **URL** : https://pcomparator.app
- **Déploiement** : Automatique à chaque release

## Commandes utiles

```bash
# Voir les releases
git tag --sort=-version:refname

# Voir les dernières releases
gh release list

# Créer une release manuellement (si besoin)
gh release create v1.2.0 --title "Release 1.2.0" --notes "Description des changements"

# Promouvoir une version spécifique
gh workflow run promote-to-production.yaml -f version=1.2.0-beta.1
```

## Dépannage

### Problème : Release bloquée
```bash
# Vérifier l'état du repo
git status
git log --oneline -10

# Forcer une release (attention !)
npx semantic-release --dry-run
```

### Problème : Version incorrecte
```bash
# Supprimer un tag local et distant
git tag -d v1.2.0
git push origin :refs/tags/v1.2.0
```

### Problème : Merge conflict
```bash
# Résoudre et continuer
git add .
git commit -m "resolve: merge conflict"
git push
```
