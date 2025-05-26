#!/bin/bash

# Script de test pour valider la configuration des workflows GitHub Actions
# Usage: ./scripts/test-workflows.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

echo "🧪 Testing pcomparator release workflows..."
echo ""

# Test 1: Vérifier les fichiers de configuration
log_info "Testing configuration files..."

if [[ -f "release.config.js" ]]; then
  log_success "release.config.js exists"
else
  log_error "release.config.js missing"
  exit 1
fi

if [[ -f "package.json" ]]; then
  log_success "package.json exists"
else
  log_error "package.json missing"
  exit 1
fi

if [[ -f "yarn.lock" ]]; then
  log_success "yarn.lock exists"
else
  log_warning "yarn.lock missing (will be created by CI)"
fi

# Test 2: Vérifier les workflows GitHub Actions
log_info "Testing GitHub Actions workflows..."

workflows_dir=".github/workflows"
if [[ -d "$workflows_dir" ]]; then
  log_success "Workflows directory exists"

  for workflow in "release.yaml" "ci.yaml" "deploy.yaml" "promote-to-production.yaml"; do
    if [[ -f "$workflows_dir/$workflow" ]]; then
      log_success "Workflow $workflow exists"
    else
      log_error "Workflow $workflow missing"
    fi
  done
else
  log_error "Workflows directory missing"
  exit 1
fi

# Test 3: Vérifier la syntaxe YAML des workflows
log_info "Testing YAML syntax..."

if command -v yamllint &>/dev/null; then
  for workflow in .github/workflows/*.yaml; do
    if yamllint "$workflow" &>/dev/null; then
      log_success "$(basename "$workflow") syntax OK"
    else
      log_error "$(basename "$workflow") syntax error"
      yamllint "$workflow"
    fi
  done
else
  log_warning "yamllint not installed, skipping YAML validation"
  log_info "Install with: brew install yamllint"
fi

# Test 4: Vérifier les dépendances Node.js
log_info "Testing Node.js dependencies..."

if [[ -f "node_modules/.bin/semantic-release" ]]; then
  log_success "semantic-release installed"
else
  log_warning "semantic-release not installed, installing..."
  yarn install --frozen-lockfile
fi

# Test 5: Test semantic-release en dry-run
log_info "Testing semantic-release dry-run..."

if yarn semantic-release --dry-run &>/dev/null; then
  log_success "semantic-release dry-run passed"
else
  log_warning "semantic-release dry-run failed (might be normal without commits)"
fi

# Test 6: Vérifier la structure du projet pcomparator
log_info "Testing pcomparator project structure..."

if [[ -d "pcomparator" ]]; then
  log_success "pcomparator directory exists"

  if [[ -f "pcomparator/package.json" ]]; then
    log_success "pcomparator/package.json exists"
  else
    log_error "pcomparator/package.json missing"
  fi

  if [[ -f "pcomparator/yarn.lock" ]]; then
    log_success "pcomparator/yarn.lock exists"
  else
    log_error "pcomparator/yarn.lock missing"
  fi
else
  log_error "pcomparator directory missing"
fi

# Test 7: Vérifier les scripts make
log_info "Testing Makefile targets..."

if [[ -f "Makefile" ]]; then
  log_success "Makefile exists"

  if make -n status &>/dev/null; then
    log_success "Makefile status target OK"
  else
    log_error "Makefile status target error"
  fi
else
  log_error "Makefile missing"
fi

# Test 8: Vérifier les permissions des scripts
log_info "Testing script permissions..."

if [[ -x "scripts/release.sh" ]]; then
  log_success "scripts/release.sh is executable"
else
  log_warning "scripts/release.sh not executable"
  chmod +x scripts/release.sh
  log_success "Fixed scripts/release.sh permissions"
fi

echo ""
log_success "All tests completed! 🎉"
echo ""
log_info "Next steps:"
echo "1. Commit your changes with conventional commits (feat:, fix:, etc.)"
echo "2. Push to dev branch to trigger first pre-release"
echo "3. Use 'make promote' to promote to production"
echo ""
log_info "Useful commands:"
echo "- make status           # Check release status"
echo "- make promote          # Promote to production"
echo "- make changelog        # View unreleased changes"
echo "- ./scripts/release.sh help  # Full help"
