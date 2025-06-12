# CLAUDE.md - Portal Directory
Version: 1.0
Last Updated: December 6, 2024
Directory: /src/portal/
Purpose: Clinician portal application

## 📁 Directory Overview
The portal is the main application for clinicians to:
- Manage their profiles and authentication
- Connect to Evexia for lab access
- Browse and order lab tests
- Sync orders to Shopify for fulfillment

## 🏗️ Structure
```
portal/
├── core/           # Core portal layout and navigation
├── shared/         # Portal-specific shared resources
│   ├── services/   # CustomerDataService, customerApiService
│   └── utils/      # Portal utilities
├── evexia/         # Evexia integration (branch 05)
├── labs/           # Lab browsing and ordering (branch 06)
├── shopify/        # Shopify integration (branch 07)
└── src/            # Legacy structure (being migrated)
    └── common/
        └── styles/ # CSS variables, utilities, reset
```

## 🔑 Key Services
- `CustomerDataService` - Central customer data management
- `customerApiService` - Customer-specific API calls
- `portalService` - Portal initialization and routing

## 🎯 Development Guidelines
1. Use existing services (don't recreate)
2. Follow IIFE pattern for new services
3. Use CSS variables from `src/common/styles/`
4. Integrate with foundation layer in `/src/shared/`

## ⚠️ Important Notes
- This is vanilla JS (not React)
- Services attach to window object
- Must work with existing auth system
- Maintain backwards compatibility