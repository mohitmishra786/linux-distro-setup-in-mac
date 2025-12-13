#!/bin/bash

# GitHub Labels Creation Script for linux-distro-setup-in-mac
# This script creates comprehensive labels for issue tracking and project management

echo "Creating GitHub labels for linux-distro-setup-in-mac..."
echo ""

# Type Labels - What is this?
echo "📋 Creating Type labels..."
gh label create "type:bug" --description "Bug report or defect" --color "d73a4a" --force
gh label create "type:feature" --description "New feature or enhancement" --color "a2eeef" --force
gh label create "type:documentation" --description "Documentation updates" --color "0075ca" --force
gh label create "type:chore" --description "Maintenance or routine tasks" --color "fef2e7" --force
gh label create "type:refactor" --description "Code refactoring" --color "ee8899" --force
gh label create "type:test" --description "Testing and test coverage" --color "fbca04" --force
gh label create "type:performance" --description "Performance optimization" --color "ff6b6b" --force

# Priority Labels - How urgent?
echo "⚡ Creating Priority labels..."
gh label create "priority:critical" --description "Must fix immediately" --color "ff0000" --force
gh label create "priority:high" --description "Important, schedule soon" --color "ff6600" --force
gh label create "priority:medium" --description "Normal priority" --color "ffcc00" --force
gh label create "priority:low" --description "Can be deferred" --color "cccccc" --force

# Status Labels - Where are we?
echo "📊 Creating Status labels..."
gh label create "status:backlog" --description "In product backlog" --color "e2e2e2" --force
gh label create "status:ready" --description "Ready to start development" --color "c5def5" --force
gh label create "status:in-progress" --description "Currently being worked on" --color "f0ad4e" --force
gh label create "status:review" --description "Under code review" --color "0e7c86" --force
gh label create "status:done" --description "Completed" --color "efd641" --force
gh label create "status:blocked" --description "Blocked or waiting" --color "ff4444" --force
gh label create "status:wontfix" --description "Will not be fixed" --color "6f42c1" --force
gh label create "status:duplicate" --description "Duplicate of another issue" --color "cccccc" --force

# Component Labels - Which part?
echo "🔧 Creating Component labels..."
gh label create "component:core" --description "Core functionality" --color "1d76db" --force
gh label create "component:scripts" --description "Shell scripts and automation" --color "0066cc" --force
gh label create "component:documentation" --description "Docs and guides" --color "0052cc" --force
gh label create "component:extension" --description "VS Code extension" --color "9900cc" --force
gh label create "component:ci-cd" --description "CI/CD pipeline" --color "ff3399" --force
gh label create "component:docker" --description "Docker and containers" --color "0099ff" --force
gh label create "component:makefile" --description "Makefile and build system" --color "9966cc" --force
gh label create "component:ui-ux" --description "User interface/experience" --color "66ccff" --force

# Future Plans - What's coming?
echo "🚀 Creating Future Plan labels..."
gh label create "future:cpp-support" --description "C++ language support" --color "6f42c1" --force
gh label create "future:rust-support" --description "Rust language support" --color "ce3262" --force
gh label create "future:go-support" --description "Go language support" --color "00a0d2" --force
gh label create "future:python-support" --description "Python language support" --color "3776ab" --force
gh label create "future:multistage-build" --description "Multi-stage Docker builds" --color "0066ff" --force
gh label create "future:parallel-execution" --description "Parallel job execution" --color "ff6600" --force
gh label create "future:web-dashboard" --description "Web UI dashboard" --color "4169e1" --force
gh label create "future:cloud-integration" --description "Cloud platform support" --color "ff9900" --force
gh label create "future:kubernetes" --description "Kubernetes integration" --color "326ce5" --force
gh label create "future:remote-execution" --description "Remote execution capabilities" --color "00aaff" --force

# Enhancement Labels
echo "✨ Creating Enhancement labels..."
gh label create "enhancement:usability" --description "Improve user experience" --color "84b6eb" --force
gh label create "enhancement:api" --description "API improvements" --color "fb8500" --force
gh label create "enhancement:error-handling" --description "Better error handling" --color "ffb703" --force
gh label create "enhancement:logging" --description "Enhanced logging and debugging" --color "8ecae6" --force
gh label create "enhancement:caching" --description "Caching improvements" --color "ffb703" --force

# Platform Labels - Which distribution?
echo "🐧 Creating Platform labels..."
gh label create "platform:ubuntu" --description "Ubuntu-specific" --color "dd4814" --force
gh label create "platform:debian" --description "Debian-specific" --color "a81d13" --force
gh label create "platform:fedora" --description "Fedora-specific" --color "003399" --force
gh label create "platform:alpine" --description "Alpine-specific" --color "0d47a1" --force
gh label create "platform:archlinux" --description "Arch Linux-specific" --color "1793d1" --force
gh label create "platform:centos" --description "CentOS-specific" --color "922b88" --force
gh label create "platform:opensuse" --description "openSUSE-specific" --color "6da121" --force
gh label create "platform:rockylinux" --description "Rocky Linux-specific" --color "10b981" --force
gh label create "platform:almalinux" --description "AlmaLinux-specific" --color "9d4edd" --force
gh label create "platform:oraclelinux" --description "Oracle Linux-specific" --color "f78c6b" --force
gh label create "platform:amazonlinux" --description "Amazon Linux-specific" --color "ff9900" --force
gh label create "platform:gentoo" --description "Gentoo-specific" --color "54a3d3" --force
gh label create "platform:kalilinux" --description "Kali Linux-specific" --color "00aaff" --force
gh label create "platform:cross-distro" --description "Affects multiple distributions" --color "006699" --force

# Performance Labels
echo "⚙️  Creating Performance labels..."
gh label create "perf:memory" --description "Memory optimization" --color "ff6b6b" --force
gh label create "perf:cpu" --description "CPU optimization" --color "ee5a6f" --force
gh label create "perf:io" --description "I/O optimization" --color "c92a2a" --force
gh label create "perf:startup" --description "Startup time optimization" --color "f76707" --force

# Meta Labels - Administrative
echo "🏷️  Creating Meta labels..."
gh label create "meta:help-wanted" --description "Help needed from community" --color "33aa3f" --force
gh label create "meta:good-first-issue" --description "Good for new contributors" --color "7057ff" --force
gh label create "meta:breaking-change" --description "Breaking change" --color "ff0000" --force
gh label create "meta:security" --description "Security issue or fix" --color "ff6600" --force
gh label create "meta:needs-investigation" --description "Requires investigation" --color "cccccc" --force
gh label create "meta:needs-design" --description "Needs design decision" --color "d4af37" --force
gh label create "meta:needs-testing" --description "Needs testing/verification" --color "ffd700" --force
gh label create "meta:needs-discussion" --description "Needs community discussion" --color "4169e1" --force
gh label create "meta:RFC" --description "Request for Comments" --color "87ceeb" --force
gh label create "meta:documentation-needed" --description "Documentation is needed" --color "0066cc" --force

# Epic Labels - Large initiatives
echo "📌 Creating Epic labels..."
gh label create "epic:multi-language-support" --description "Support multiple programming languages" --color "8b008b" --force
gh label create "epic:cloud-native" --description "Cloud-native infrastructure" --color "228b22" --force
gh label create "epic:developer-experience" --description "Improve developer experience" --color "1e90ff" --force
gh label create "epic:performance-optimization" --description "System-wide performance improvements" --color "ff1493" --force
gh label create "epic:release-v2" --description "Version 2.0 release" --color "ffa500" --force

echo ""
echo "✅ All GitHub labels created successfully!"
echo ""
echo "Labels summary:"
gh label list --limit 500
