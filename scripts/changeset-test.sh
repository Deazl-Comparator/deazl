#!/bin/bash

# Script pour tester les releases avec Changeset

echo "🚀 Test des releases Changeset"
echo "================================"

# Vérifier le statut actuel
echo "📊 Statut actuel des changesets:"
yarn changeset:status

echo ""
echo "📝 Actions disponibles:"
echo "1. yarn changeset:add - Créer un nouveau changeset"
echo "2. yarn changeset:version - Appliquer les versions"
echo "3. yarn changeset:status - Voir le statut"
echo ""
echo "🔄 Prereleases:"
echo "4. yarn changeset:beta - Entrer en mode beta"
echo "5. yarn changeset:alpha - Entrer en mode alpha"
echo "6. yarn changeset:canary - Entrer en mode canary"
echo "7. yarn changeset:pre:exit - Sortir du mode prerelease"
echo ""
echo "📦 Publications (simulation):"
echo "8. yarn changeset:publish --dry-run - Simuler la publication"
echo ""
echo "🎯 Workflows complets:"
echo "9. yarn release - Release normale (version + publish)"
echo "10. yarn release:beta - Prerelease beta"
echo "11. yarn release:alpha - Prerelease alpha"
echo "12. yarn release:canary - Prerelease canary"

echo ""
echo "💡 Pour commencer, créez un changeset avec:"
echo "   yarn changeset:add"
