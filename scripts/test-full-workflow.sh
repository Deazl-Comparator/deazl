#!/bin/bash

# Script d'exemple pour tester un workflow complet de release

set -e # Arrêter le script en cas d'erreur

echo "🧪 Test du workflow complet Changeset"
echo "======================================"

# Fonction pour demander confirmation
confirm() {
  read -p "$1 (y/N): " -n 1 -r
  echo
  [[ $REPLY =~ ^[Yy]$ ]]
}

# Vérifier l'état initial
echo "📊 État initial:"
yarn changeset:status

echo ""
if confirm "Voulez-vous créer un changeset d'exemple ?"; then
  echo "📝 Création d'un changeset..."
  # On peut automatiser pour les tests
  echo "---
\"@deazl/shopping-lists\": patch
---

Test automatique du workflow Changeset
" >.changeset/test-workflow.md
  echo "✅ Changeset créé automatiquement"

  echo ""
  echo "📊 Nouveau statut:"
  yarn changeset:status
fi

echo ""
if confirm "Voulez-vous tester une prerelease beta ?"; then
  echo "🚀 Test prerelease beta..."

  # Sauvegarder l'état actuel
  CURRENT_VERSION=$(grep '"version"' packages/applications/shopping-lists/package.json | cut -d'"' -f4)
  echo "📌 Version actuelle: $CURRENT_VERSION"

  # Entrer en mode prerelease
  yarn changeset:beta

  # Appliquer les versions
  yarn changeset:version

  NEW_VERSION=$(grep '"version"' packages/applications/shopping-lists/package.json | cut -d'"' -f4)
  echo "🆕 Nouvelle version: $NEW_VERSION"

  echo ""
  echo "📄 Changelog généré:"
  cat packages/applications/shopping-lists/CHANGELOG.md | head -10

  echo ""
  if confirm "Voulez-vous simuler la publication ?"; then
    echo "📦 Simulation de publication..."
    yarn changeset:publish --dry-run || echo "⚠️  Erreur attendue (pas de token npm configuré)"
  fi

  echo ""
  echo "🔄 Sortie du mode prerelease..."
  yarn changeset:pre:exit

  echo "✅ Test prerelease terminé"
fi

echo ""
if confirm "Voulez-vous nettoyer les fichiers de test ?"; then
  echo "🧹 Nettoyage..."

  # Restaurer la version originale si elle a été modifiée
  git checkout -- packages/applications/shopping-lists/package.json 2>/dev/null || true
  git checkout -- packages/applications/shopping-lists/CHANGELOG.md 2>/dev/null || true

  # Supprimer le changeset de test
  rm -f .changeset/test-workflow.md

  # Supprimer les autres changesets de test si présents
  find .changeset -name "*.md" -not -name "README.md" -delete 2>/dev/null || true

  echo "✅ Nettoyage terminé"
fi

echo ""
echo "🎉 Test terminé !"
echo ""
echo "📚 Pour plus d'informations:"
echo "   - Guide complet: docs/CHANGESET_GUIDE.md"
echo "   - Démarrage rapide: docs/QUICKSTART_CHANGESET.md"
echo "   - Configuration: docs/CHANGESET_SETUP_COMPLETE.md"
echo ""
echo "🚀 Commandes utiles:"
echo "   yarn changeset:add      # Créer un changeset"
echo "   yarn changeset:status   # Voir le statut"
echo "   yarn release:beta       # Prerelease beta"
echo "   yarn release            # Release normale"
