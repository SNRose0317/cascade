# CLAUDE.md - UI Components
Version: 1.0
Last Updated: December 6, 2024
Directory: /src/shared/components/ui/
Branch: 01-foundation/core-setup
Purpose: Shared UI component library

## 📁 Component Overview
This directory should contain the shared UI components used throughout the application. Currently, React components exist in `/public-site/shared/components/ui/` but need to be migrated or bridged here.

## 🎯 Component Guidelines

### Existing Components (in `/public-site/shared/components/ui/`)
- `button.tsx` - Button component with variants
- `dialog.tsx` - Modal/dialog component
- `input.tsx` - Form input component
- `scroll-area.tsx` - Scrollable container
- `tabs.tsx` - Tab navigation component

### Components to Create
- `modal.js` - Vanilla JS modal system (referenced by other branches)
- `toast.js` - Notification system
- `loader.js` - Loading states
- `alert.js` - Alert messages

## 🔧 Implementation Patterns

### React Components
```javascript
import * as React from "react"
import { cn } from "@/lib/utils"

export const Component = React.forwardRef(({ className, ...props }, ref) => {
  return <div className={cn("base-class", className)} ref={ref} {...props} />
})
```

### Vanilla JS Components
```javascript
const Component = (function() {
  'use strict';
  
  function create(options) {
    const element = document.createElement('div');
    element.className = 'component-class';
    // Build component
    return element;
  }
  
  return { create };
})();

window.UIComponents = window.UIComponents || {};
window.UIComponents.Component = Component;
```

## ⚠️ Important Notes
- Components must work in both React and vanilla JS contexts
- Use CSS variables from `/src/portal/src/common/styles/variables.css`
- Follow accessibility best practices
- Include proper TypeScript definitions
- Test across all supported browsers