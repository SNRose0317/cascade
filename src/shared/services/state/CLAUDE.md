# CLAUDE.md - State Management Services
Version: 1.0
Last Updated: December 6, 2024
Directory: /src/shared/services/state/
Branch: 03-foundation/state-management
Purpose: Centralized state management services

## 📁 Service Overview
This directory contains state management services that provide a single source of truth for application data.

## 🎯 Files to Create

### `authState.js`
Authentication state management:
- Token storage and retrieval
- User session management
- Auto-logout on expiry
- Session extension capabilities

### `appState.js`
General application state:
- App-wide settings
- UI preferences
- Feature flags
- Temporary UI state

### `index.js`
Public exports and initialization:
- Export all state services
- Initialize on app load
- Cleanup utilities

## 🔧 Implementation Pattern

All state services follow the IIFE pattern established by CustomerDataService:

```javascript
const StateService = (function() {
  'use strict';
  
  const STORAGE_KEY = 'service_state';
  let state = loadState();
  
  function loadState() {
    // Load from localStorage
  }
  
  function saveState() {
    // Save to localStorage
  }
  
  return {
    // Public API
    getState: () => ({ ...state }),
    setState: (newState) => { /* ... */ },
    updateState: (updates) => { /* ... */ },
    clearState: () => { /* ... */ }
  };
})();

window.StateServices = window.StateServices || {};
window.StateServices.ServiceName = StateService;
```

## 🔗 Integration Points
- CustomerDataService (already exists)
- Auth system uses authState
- API client reads auth tokens
- UI components subscribe to state changes

## ⚠️ Important Notes
- Always return copies of state to prevent mutations
- Clean up expired data automatically
- Handle localStorage quota limits
- Encrypt sensitive data before storage