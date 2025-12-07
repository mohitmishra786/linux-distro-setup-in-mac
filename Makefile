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
setup:
	@echo "Setting up all distributions..."
	@for distro in ubuntu ubuntu-latest debian fedora alpine archlinux centos opensuse-leap opensuse-tumbleweed rocky-linux almalinux oraclelinux amazonlinux gentoo kali-linux; do \
		echo "Setting up $$distro..."; \
		docker-compose up -d $$distro || true; \
		sleep 2; \
		docker exec linux-book-$$distro /scripts/setup-distro.sh $$distro || true; \
	done
	@echo "Setup complete!"

# Start all containers
start:
	docker-compose up -d

# Stop all containers
stop:
	docker-compose stop

# Restart all containers
restart: stop start

# Shell access for each distribution
shell-ubuntu:
	docker exec -it linux-book-ubuntu bash

shell-ubuntu-latest:
	docker exec -it linux-book-ubuntu-latest bash

shell-debian:
	docker exec -it linux-book-debian bash

shell-fedora:
	docker exec -it linux-book-fedora bash

shell-alpine:
	docker exec -it linux-book-alpine sh

shell-archlinux:
	docker exec -it linux-book-archlinux bash

shell-centos:
	docker exec -it linux-book-centos bash

shell-opensuse-leap:
	docker exec -it linux-book-opensuse-leap bash

shell-opensuse-tumbleweed:
	docker exec -it linux-book-opensuse-tumbleweed bash

shell-rocky-linux:
	docker exec -it linux-book-rocky-linux bash

shell-almalinux:
	docker exec -it linux-book-almalinux bash

shell-oraclelinux:
	docker exec -it linux-book-oraclelinux bash

shell-amazonlinux:
	docker exec -it linux-book-amazonlinux bash

shell-gentoo:
	docker exec -it linux-book-gentoo bash

shell-kali-linux:
	docker exec -it linux-book-kali-linux bash

# Clean up
clean:
	docker-compose down

