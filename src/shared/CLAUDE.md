# CLAUDE.md - Shared Resources
Version: 1.0
Last Updated: December 6, 2024
Directory: /src/shared/
Purpose: Foundation layer components, services, and utilities

## 📁 Directory Overview
This directory contains the foundational code that all features depend on. It's organized into three main categories:

### Components (`/components/`)
UI components that provide consistent interface elements across the application.
- See: `/components/ui/CLAUDE.md` for UI component details

### Services (`/services/`)
Core services for API communication and state management.
- See: `/services/api/CLAUDE.md` for API layer details
- See: `/services/state/CLAUDE.md` for state management details

### Utils (`/utils/`)
Utility functions and helpers used throughout the application.
- See: `/utils/storage/CLAUDE.md` for storage utilities

## 🔗 Foundation Branches
This directory is built by three foundation branches:
1. **01-foundation/core-setup**: Creates UI components and utilities
2. **02-foundation/api-layer**: Implements API services
3. **03-foundation/state-management**: Adds state management services

## ⚠️ Important Guidelines
- All code here must be feature-agnostic
- No business logic - only infrastructure
- Must work with both React and vanilla JS contexts
- Thoroughly tested and documented
- No external dependencies without approval