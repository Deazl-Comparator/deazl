#!/bin/bash

# Script de gestion des releases pour pcomparator
# Usage: ./scripts/release.sh [command] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

# Check if gh CLI is installed
check_gh_cli() {
  if ! command -v gh &>/dev/null; then
    log_error "GitHub CLI (gh) is required but not installed."
    log_info "Install it with: brew install gh"
    exit 1
  fi
}

# Get current branch
get_current_branch() {
  git rev-parse --abbrev-ref HEAD
}

# Get latest release
get_latest_release() {
  gh release list --limit 1 --json tagName --jq '.[0].tagName' 2>/dev/null || echo ""
}

# Get latest pre-release
get_latest_prerelease() {
  gh release list --json tagName,isPrerelease --jq '.[] | select(.isPrerelease) | .tagName' | head -n1 2>/dev/null || echo ""
}

# Show help
show_help() {
  echo "🚀 pcomparator Release Management Script"
  echo ""
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  status          Show current release status"
  echo "  promote [ver]   Promote a beta version to production"
  echo "  deploy [env]    Deploy to staging or production"
  echo "  changelog       Show unreleased changes"
  echo "  help            Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 status"
  echo "  $0 promote 1.2.0-beta.1"
  echo "  $0 deploy staging"
}

# Show current status
show_status() {
  log_info "Current release status for pcomparator"
  echo ""

  local current_branch=$(get_current_branch)
  log_info "Current branch: $current_branch"

  local latest_release=$(get_latest_release)
  local latest_prerelease=$(get_latest_prerelease)

  if [[ -n "$latest_release" ]]; then
    log_info "Latest production release: $latest_release"
  else
    log_warning "No production releases found"
  fi

  if [[ -n "$latest_prerelease" ]]; then
    log_info "Latest staging release: $latest_prerelease"
  else
    log_warning "No staging releases found"
  fi

  echo ""
  log_info "Recent releases:"
  gh release list --limit 5 2>/dev/null || log_warning "No releases found"
}

# Promote version to production
promote_version() {
  local version=$1

  if [[ -z "$version" ]]; then
    local latest_prerelease=$(get_latest_prerelease)
    if [[ -n "$latest_prerelease" ]]; then
      version=${latest_prerelease#v}
      log_info "Using latest pre-release: $version"
    else
      log_error "No version specified and no pre-releases found"
      log_info "Usage: $0 promote <version>"
      exit 1
    fi
  fi

  # Remove 'v' prefix if present
  version=${version#v}

  log_info "Promoting version $version to production..."

  # Check if version exists
  if ! git tag | grep -q "^v$version$"; then
    log_error "Version v$version does not exist"
    log_info "Available versions:"
    git tag --sort=-version:refname | head -10
    exit 1
  fi

  # Run the promotion workflow
  log_info "Triggering promotion workflow..."
  gh workflow run promote-to-production.yaml -f version="$version" -f create_pr=true

  log_success "Promotion workflow triggered!"
  log_info "Check the Actions tab to monitor progress."
  log_info "A PR will be created to merge v$version into master."
}

# Deploy to environment
deploy_env() {
  local env=$1

  if [[ -z "$env" ]]; then
    log_error "Environment not specified"
    log_info "Usage: $0 deploy <staging|production>"
    exit 1
  fi

  if [[ "$env" != "staging" && "$env" != "production" ]]; then
    log_error "Invalid environment: $env"
    log_info "Valid environments: staging, production"
    exit 1
  fi

  log_info "Deploying to $env environment..."
  gh workflow run deploy.yaml -f environment="$env"

  log_success "Deployment workflow triggered!"
  log_info "Check the Actions tab to monitor progress."
}

# Show changelog for unreleased changes
show_changelog() {
  local latest_release=$(get_latest_release)

  if [[ -n "$latest_release" ]]; then
    log_info "Changes since $latest_release:"
    echo ""
    git log --oneline --pretty=format:"%C(yellow)%h%C(reset) %s" "$latest_release"..HEAD
  else
    log_info "All commits (no previous releases):"
    echo ""
    git log --oneline --pretty=format:"%C(yellow)%h%C(reset) %s"
  fi
}

# Main script logic
main() {
  check_gh_cli

  local command=${1:-help}

  case $command in
  "status")
    show_status
    ;;
  "promote")
    promote_version "$2"
    ;;
  "deploy")
    deploy_env "$2"
    ;;
  "changelog")
    show_changelog
    ;;
  "help" | "--help" | "-h")
    show_help
    ;;
  *)
    log_error "Unknown command: $command"
    echo ""
    show_help
    exit 1
    ;;
  esac
}

# Run main function with all arguments
main "$@"
