# Release Management Makefile for pcomparator

.PHONY: help release-status release-promote release-deploy release-changelog setup test

help: ## Show this help message
	@echo "🚀 pcomparator Release Management"
	@echo ""
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Setup the project for the first time
	@echo "🔧 Setting up pcomparator release system..."
	@yarn install
	@cd pcomparator && yarn install
	@./scripts/test-workflows.sh
	@echo "✅ Setup complete! You can now use 'make status' to check the release status"

test: ## Test the release configuration
	@./scripts/test-workflows.sh

release-status: ## Show current release status
	@./scripts/release.sh status

release-promote: ## Promote latest beta to production (or specify version: make release-promote VERSION=1.2.0-beta.1)
	@if [ -n "$(VERSION)" ]; then \
		./scripts/release.sh promote $(VERSION); \
	else \
		./scripts/release.sh promote; \
	fi

release-deploy-staging: ## Deploy to staging environment
	@./scripts/release.sh deploy staging

release-deploy-production: ## Deploy to production environment
	@./scripts/release.sh deploy production

release-changelog: ## Show unreleased changes
	@./scripts/release.sh changelog

# Development workflow shortcuts
feature-start: ## Start a new feature branch (usage: make feature-start NAME=my-feature)
	@if [ -z "$(NAME)" ]; then \
		echo "❌ Please specify a feature name: make feature-start NAME=my-feature"; \
		exit 1; \
	fi
	@git checkout dev
	@git pull origin dev
	@git checkout -b feature/$(NAME)
	@echo "✅ Created feature branch: feature/$(NAME)"

feature-finish: ## Finish current feature branch and create PR
	@BRANCH=$$(git rev-parse --abbrev-ref HEAD); \
	if [[ $$BRANCH != feature/* ]]; then \
		echo "❌ Not on a feature branch"; \
		exit 1; \
	fi; \
	git push origin $$BRANCH; \
	if command -v gh &> /dev/null; then \
		gh pr create --base dev --title "feat: $${BRANCH#feature/}" --body "## What's changed\n\n- TODO: Describe your changes\n\n## Checklist\n\n- [ ] Tests added/updated\n- [ ] Documentation updated\n- [ ] Ready for review"; \
		echo "✅ PR created successfully"; \
	else \
		echo "✅ Branch pushed. Create PR manually at: https://github.com/Clement-Muth/pcomparator/compare/dev...$$BRANCH"; \
	fi

hotfix-start: ## Start a hotfix branch (usage: make hotfix-start NAME=critical-bug)
	@if [ -z "$(NAME)" ]; then \
		echo "❌ Please specify a hotfix name: make hotfix-start NAME=critical-bug"; \
		exit 1; \
	fi
	@git checkout master
	@git pull origin master
	@git checkout -b hotfix/$(NAME)
	@echo "✅ Created hotfix branch: hotfix/$(NAME)"

# Quick aliases
status: release-status ## Alias for release-status
promote: release-promote ## Alias for release-promote
deploy: release-deploy-staging ## Alias for release-deploy-staging
changelog: release-changelog ## Alias for release-changelog

# Project commands
dev: ## Start development server
	@cd pcomparator && yarn dev

build: ## Build the project
	@cd pcomparator && yarn build

install: ## Install all dependencies
	@yarn install
	@cd pcomparator && yarn install
