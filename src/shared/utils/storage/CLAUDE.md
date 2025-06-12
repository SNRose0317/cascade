# CLAUDE.md - Storage Utilities
Version: 1.0
Last Updated: December 6, 2024
Directory: /src/shared/utils/storage/
Branch: 03-foundation/state-management
Purpose: localStorage wrapper utilities

## 📁 Utility Overview
This directory contains utilities for safe and efficient localStorage operations.

## 🎯 Files to Create

### `localStorage.js`
Safe localStorage wrapper:
- Automatic JSON serialization
- Error handling for quota limits
- TTL support for temporary data
- Prefix management for namespacing

### `encryption.js`
Simple encryption for sensitive data:
- Encrypt/decrypt functions
- Key management
- Used for tokens and sensitive settings

### `index.js`
Public exports:
- StorageUtils object
- Encryption utilities

## 🔧 Usage Pattern

```javascript
const { StorageUtils } = window.SharedUtils;

// Set item with TTL
StorageUtils.setItem('user_preference', { theme: 'dark' }, { 
  ttl: 24 * 60 * 60 * 1000 // 24 hours
});

// Get item with default
const pref = StorageUtils.getItem('user_preference', { theme: 'light' });

// Set encrypted item
StorageUtils.setSecure('api_key', 'secret-key-value');

// Cleanup old items
StorageUtils.cleanup(7 * 24 * 60 * 60 * 1000); // Remove items older than 7 days
```

## 🔗 Used By
- All state management services
- Auth system for token storage
- Feature modules for preferences

## ⚠️ Important Notes
- Always handle quota exceeded errors
- Use prefixes to avoid key collisions
- Don't store large objects (use IndexedDB instead)
- Regularly cleanup expired items