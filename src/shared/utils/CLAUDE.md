# CLAUDE.md - Shared Utilities
Version: 1.0
Last Updated: December 6, 2024
Directory: /src/shared/utils/
Branch: 01-foundation/core-setup
Purpose: Utility functions and helpers

## 📁 Utility Overview
This directory contains utility functions that are used throughout the application. These should be pure functions with no side effects.

## 🎯 Utilities to Create

### Core Utilities
- `debounce.js` - Debounce function for input handlers
- `throttle.js` - Throttle function for scroll/resize handlers
- `formatters.js` - Date, currency, and number formatters
- `validators.js` - Common validation functions
- `dom.js` - DOM manipulation helpers

### Example Implementation
```javascript
// debounce.js
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

// Export for use
window.SharedUtils = window.SharedUtils || {};
window.SharedUtils.debounce = debounce;
```

## 🔧 Usage Guidelines
- Keep functions pure (no side effects)
- Include JSDoc comments
- Add unit tests for each utility
- Export to window.SharedUtils namespace
- Consider performance implications

## ⚠️ Important Notes
- Utilities should work in all browsers
- No external dependencies
- Thoroughly tested edge cases
- Clear error messages