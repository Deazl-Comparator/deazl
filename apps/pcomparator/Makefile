install:
	@yarn install
.PHONY: install

ci: up format lint analyze test
.PHONY: ci

up:
	$(MAKE) install
	@printf "💄 Please wait, starting pcomparator...\n\n"
	@traefik &
	$(MAKE) start
	@printf "\n\Pcomparator is ready, enjoy 🎉\nRun make logs if you want some 💡\n\n"
.PHONY: up

start:
	@yarn turbo dev
.PHONY: start

down:
	$(MAKE) -C .. down
.PHONY: up

lint: | up
	@yarn turbo lint:check
.PHONY: lint

analyze: | up
	@yarn turbo typescript:check
.PHONY: analyze

test: PATHS?=.
test: | up
	@yarn turbo test ${PATHS}
.PHONY: test

ifeq ($(CI),)
certs:
	mkcert -uninstall
	sudo rm -rf /etc/ssl/certs/mkcert*
	mkdir -p certs/root
	mkcert -cert-file certs/cert.pem -key-file certs/key.pem "pcomparator.localhost" "bore.pub"
	mkcert -install
else
certs:
endif
