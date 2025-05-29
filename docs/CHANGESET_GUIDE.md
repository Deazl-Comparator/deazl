# Guide de Release avec Changeset

Ce document explique comment gérer les releases et prereleases dans ce monorepo en utilisant Changeset.

## Vue d'ensemble

Nous utilisons [Changeset](https://github.com/changesets/changesets) pour :
- Gérer les versions des packages
- Générer les changelogs automatiquement
- Publier sur npm
- Gérer les prereleases (alpha, beta, canary)

## Structure des branches

- `master` : Releases stables (production)
- `dev` : Développement et prereleases beta
- `beta` : Prereleases beta
- `alpha` : Prereleases alpha
- `release/*` : Release candidates (rc)

## Workflow de développement

### 1. Création d'un changeset

Quand vous ajoutez une feature, un bugfix ou un breaking change :

```bash
# Créer un changeset interactif
yarn changeset:add

# Ou directement
yarn changeset
```

Cela va :
- Vous demander quels packages sont affectés
- Le type de changement (patch, minor, major)
- Une description du changement

### 2. Types de changements

- **patch** : Bug fixes, corrections mineures
- **minor** : Nouvelles features (non-breaking)
- **major** : Breaking changes

### 3. Vérifier le statut

```bash
# Voir les changesets en attente
yarn changeset:status
```

## Releases

### Release stable (master)

Les releases stables se font automatiquement via GitHub Actions quand des changesets sont mergés sur `master`.

Le workflow :
1. Détecte les changesets
2. Crée une PR "Version Packages" avec les nouvelles versions
3. Quand la PR est mergée, publie automatiquement sur npm

### Releases manuelles

```bash
# Version des packages (consomme les changesets)
yarn changeset:version

# Publication sur npm
yarn changeset:publish

# Ou les deux en une commande
yarn release
```

## Prereleases

### Entrer en mode prerelease

```bash
# Beta (recommandé pour les features stables)
yarn changeset:beta

# Alpha (pour les features expérimentales)
yarn changeset:alpha

# Canary (pour les tests rapides)
yarn changeset:canary
```

### Publier une prerelease

```bash
# Version snapshot + publication
yarn release:beta
yarn release:alpha
yarn release:canary
```

### Sortir du mode prerelease

```bash
yarn changeset:pre:exit
```

## Automatisation GitHub Actions

### Workflow Release (`master`)

- Déclenché sur push vers `master`
- Crée une PR de version ou publie automatiquement
- Tags : `latest`

### Workflow Prerelease

- Déclenché sur `dev`, `beta`, `alpha`, `release/*`
- Publie automatiquement des prereleases
- Tags : `beta`, `alpha`, `canary`, `rc`

## Configuration npm

Pour publier, vous devez configurer le token npm :

```bash
# Dans GitHub Secrets
NPM_TOKEN=your_npm_token
```

## Exemple de workflow complet

1. **Développement d'une feature** :
   ```bash
   git checkout -b feature/new-feature
   # Développement...
   yarn changeset:add  # Décrire le changement
   git commit -am "feat: nouvelle feature"
   ```

2. **Prerelease pour tests** :
   ```bash
   git checkout dev
   git merge feature/new-feature
   git push  # → Déclenche une prerelease beta automatique
   ```

3. **Release stable** :
   ```bash
   git checkout master
   git merge dev
   git push  # → Crée une PR de version automatique
   ```

## Scripts disponibles

- `yarn changeset` : Créer un changeset
- `yarn changeset:status` : Voir le statut
- `yarn changeset:version` : Appliquer les versions
- `yarn changeset:publish` : Publier
- `yarn release` : Version + publication
- `yarn release:beta` : Prerelease beta
- `yarn release:alpha` : Prerelease alpha
- `yarn release:canary` : Prerelease canary

## Bonnes pratiques

1. **Toujours créer un changeset** pour les changes qui affectent les utilisateurs
2. **Utiliser des descriptions claires** dans les changesets
3. **Tester les prereleases** avant les releases stables
4. **Suivre le semantic versioning** strictement
5. **Reviewer les PRs de version** avant de merger
