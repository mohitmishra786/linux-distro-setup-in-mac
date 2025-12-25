.PHONY: help setup start stop restart shell ubuntu debian fedora alpine arch centos clean

# Default target
help:
	@echo "Linux Distro Testing Environment"
	@echo "================================="
	@echo ""
	@echo "Available commands:"
	@echo "  make setup          - Setup all distributions (install build tools)"
	@echo "  make start          - Start all containers"
	@echo "  make stop           - Stop all containers"
	@echo "  make restart        - Restart all containers"
	@echo "  make shell-<distro> - Open shell in specific distro (e.g., make shell-ubuntu)"
	@echo "  make clean          - Stop and remove all containers"
	@echo ""
	@echo "Available distributions:"
	@echo "  ubuntu, ubuntu-latest, debian, fedora, alpine, archlinux, centos,"
	@echo "  opensuse-leap, opensuse-tumbleweed, rocky-linux, almalinux,"
	@echo "  oraclelinux, amazonlinux, gentoo, kali-linux"
	@echo ""
	@echo "Quick examples:"
	@echo "  ./scripts/run-in-distro.sh ubuntu gcc --version"
	@echo "  ./scripts/compile-and-run.sh ubuntu code/hello.c"
	@echo "  make shell-ubuntu"

# Setup all distributions

# Detect runtime
RUNTIME := $(shell ./scripts/detect-runtime.sh 2>/dev/null || echo "docker")
COMPOSE_CMD := $(shell if [ "$(RUNTIME)" = "podman" ]; then \
	if command -v podman-compose >/dev/null 2>&1; then echo "podman-compose"; \
	else echo "podman compose"; fi; \
	else echo "$(COMPOSE_CMD)"; fi)
# Setup all distributions
setup:
	@echo "=========================================="
	@echo "Setting up all distributions"
	@echo "=========================================="
	@total=15; \
	current=0; \
	for distro in ubuntu ubuntu-latest debian fedora alpine archlinux centos opensuse-leap opensuse-tumbleweed rocky-linux almalinux oraclelinux amazonlinux gentoo kali-linux; do \
		current=$$((current + 1)); \
		echo ""; \
		echo "[$$current/$$total] Setting up $$distro..."; \
		$(COMPOSE_CMD) up -d $$distro > /dev/null 2>&1 || true; \
		sleep 2; \
		if $(RUNTIME) exec linux-book-$$distro /scripts/setup-distro.sh $$distro > /dev/null 2>&1; then \
			echo "[$$current/$$total] $$distro setup complete [SUCCESS]"; \
		else \
			echo "[$$current/$$total] $$distro setup complete [WARNING: some packages may have failed]"; \
		fi; \
	done
	@echo ""
	@echo "=========================================="
	@echo "Setup complete: 15/15 distributions processed"
	@echo "=========================================="
	@echo "Setup complete!"

# Start all containers
start:
	$(COMPOSE_CMD) up -d

# Stop all containers
stop:
	$(COMPOSE_CMD) stop

# Restart all containers
restart: stop start

# Shell access for each distribution
shell-ubuntu:
	$(RUNTIME) exec -it linux-book-ubuntu bash

shell-ubuntu-latest:
	$(RUNTIME) exec -it linux-book-ubuntu-latest bash

shell-debian:
	$(RUNTIME) exec -it linux-book-debian bash

shell-fedora:
	$(RUNTIME) exec -it linux-book-fedora bash

shell-alpine:
	$(RUNTIME) exec -it linux-book-alpine sh

shell-archlinux:
	$(RUNTIME) exec -it linux-book-archlinux bash

shell-centos:
	$(RUNTIME) exec -it linux-book-centos bash

shell-opensuse-leap:
	$(RUNTIME) exec -it linux-book-opensuse-leap bash

shell-opensuse-tumbleweed:
	$(RUNTIME) exec -it linux-book-opensuse-tumbleweed bash

shell-rocky-linux:
	$(RUNTIME) exec -it linux-book-rocky-linux bash

shell-almalinux:
	$(RUNTIME) exec -it linux-book-almalinux bash

shell-oraclelinux:
	$(RUNTIME) exec -it linux-book-oraclelinux bash

shell-amazonlinux:
	$(RUNTIME) exec -it linux-book-amazonlinux bash

shell-gentoo:
	$(RUNTIME) exec -it linux-book-gentoo bash

shell-kali-linux:
	$(RUNTIME) exec -it linux-book-kali-linux bash

# Clean up
clean:
	$(COMPOSE_CMD) down

