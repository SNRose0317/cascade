# CLAUDE.md - Foundation Core Setup
Version: 1.0
Last Updated: December 6, 2024
Branch: 01-foundation/core-setup
Previous Session: Initial Creation
Next Session Planning: Complete UI component library standardization

## 🤖 CRITICAL: Read This First
**STOP** - Before doing ANYTHING:
1. Verify you're on the correct branch: `git branch --show-current`
2. This is the FIRST foundation branch - no dependencies to check
3. Read the **Current State** section to understand what's already done
4. If anything is unclear, ASK FOR CLARIFICATION before proceeding

## 🎯 Branch Mission Statement
**In one sentence:** Establish the core project structure, shared UI components, and foundational utilities that all other branches will depend on.
**Success looks like:** A standardized component library, consistent styling system, and clear project organization that prevents duplicate code.
**Failure looks like:** Scattered components, inconsistent patterns, multiple implementations of the same functionality.

## 🧠 Essential Context You Need

### What You're Building
This branch establishes the foundational layer of the Cascade platform - a Web3 diagnostics portal that connects clinicians with lab testing services. As the first branch in the sequence, you're responsible for creating the shared infrastructure that every other feature will build upon.

The core setup includes three critical pieces: First, a standardized UI component library that provides consistent interface elements across the entire application. Second, a styling system with CSS variables and utilities that ensures visual consistency. Third, the project structure and build configuration that enables smooth development. This foundation is essential because it prevents fragmentation - without it, each feature would create its own components and patterns, leading to maintenance nightmares.

The current codebase shows signs of evolution - there are React components in `/public-site/shared/components/ui/` and vanilla JS implementations in the portal. Your role is to document what exists and establish clear patterns for future development.

### Your Boundaries
**You ARE responsible for:**
- Documenting existing UI components in `/public-site/shared/components/ui/`
- Establishing CSS variables and base styles in `/src/portal/src/common/styles/`
- Creating/documenting utility functions and hooks
- Setting up TypeScript configurations if needed
- Defining the project folder structure
- Creating shared constants and types

**You are NOT responsible for:**
- Authentication components (handled by branch 04)
- API communication (handled by branch 02)
- State management (handled by branch 03)
- Any feature-specific components
- Third-party integrations

### Customer Journey Context
```
Previous Step: User lands on marketing site → 
YOUR STEP: Consistent UI/UX foundation loads → 
Next Step: User interacts with auth system (branch 04)
```

## 📊 Current State & Progress

### Already Completed
- [x] React UI components exist in `/public-site/shared/components/ui/`
  - Button, Dialog, Input, ScrollArea, Tabs components
- [x] Base styles created in `/src/portal/src/common/styles/`
  - reset.css, variables.css, utilities.css
- [x] Portal base styles in `/src/portal/core/styles/portal-base.css`
- [ ] Component documentation
- [ ] Standardization between React and vanilla JS approaches
- [ ] Modal system implementation
- [ ] Toast/notification system

### Active Work Item
**Currently Working On:** Initial documentation and assessment
**Files Being Modified:** None currently
**Blocker/Issue:** Mixed React/vanilla JS implementations need standardization strategy

### Session History
```
Session 1 (Dec 6, 2024): Created initial CLAUDE.md, documented existing state
```

## 🔗 Dependencies & Integration Points

### Incoming Dependencies (What I Need)
```javascript
// This is the first branch - no incoming dependencies
// However, we need to be aware of existing code patterns
```

### Outgoing Contracts (What I Provide)
```javascript
// UI Components (React) - Available at /public-site/shared/components/ui/
export { Button } from './button';
export { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
export { Input } from './input';
export { ScrollArea } from './scroll-area';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

// CSS Variables - Available in /src/portal/src/common/styles/variables.css
:root {
  --primary-color: #6D28D9;
  --primary-hover: #5B21B6;
  --secondary-color: #1E293B;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --border-color: #E2E8F0;
  --background-white: #FFFFFF;
  --background-gray: #F8FAFC;
  --error-color: #DC2626;
  --success-color: #16A34A;
  --warning-color: #F59E0B;
  
  // Spacing
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  // Border radius
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

// Utility Classes - Available globally
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.text-center { text-align: center; }
.mt-1 { margin-top: 0.25rem; }
.mb-1 { margin-bottom: 0.25rem; }
// ... etc

// Note: Modal system is NOT yet implemented despite being referenced
// in other branches. This needs to be created or documented if it exists elsewhere.
```

### Integration Checklist
- [ ] React components accessible from feature branches
- [ ] CSS variables loaded globally
- [ ] Utility classes available
- [ ] TypeScript definitions for components
- [ ] Build process handles both React and vanilla JS

## 📁 File Map & Code Patterns

### Critical Files for This Branch
```
cascade/
├── public-site/
│   └── shared/
│       └── components/
│           └── ui/
│               ├── button.tsx          # React button component
│               ├── dialog.tsx          # React modal/dialog
│               ├── input.tsx           # Form input
│               ├── scroll-area.tsx     # Scrollable container
│               └── tabs.tsx            # Tab navigation
├── src/
│   └── portal/
│       ├── src/
│       │   └── common/
│       │       └── styles/
│       │           ├── reset.css       # CSS reset
│       │           ├── variables.css   # CSS custom properties
│       │           └── utilities.css   # Utility classes
│       └── core/
│           └── styles/
│               └── portal-base.css     # Portal-specific styles
└── [Missing Items]
    └── shared/
        ├── components/
        │   └── ui/
        │       └── modal.js            # Needs creation
        └── utils/
            └── debounce.js             # Needs creation
```

### Code Patterns to Follow
```javascript
// PATTERN 1: React Component Structure (from existing button.tsx)
import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

// PATTERN 2: Vanilla JS Component (following auth-system pattern)
const ModalSystem = (function() {
  'use strict';
  
  let activeModal = null;
  
  const open = (options) => {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${options.title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">${options.content}</div>
      </div>
    `;
    document.body.appendChild(modal);
    activeModal = modal;
  };
  
  const close = () => {
    if (activeModal) {
      activeModal.remove();
      activeModal = null;
    }
  };
  
  return { open, close };
})();

// Make available globally
window.modalSystem = ModalSystem;

// PATTERN 3: Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

### Naming Conventions
- React Components: `PascalCase` (e.g., `Button`, `DialogContent`)
- Vanilla JS Modules: `PascalCase` with IIFE pattern
- CSS Classes: `kebab-case` (e.g., `modal-backdrop`)
- CSS Variables: `--kebab-case` (e.g., `--primary-color`)
- Utility Functions: `camelCase` (e.g., `debounce`, `formatDate`)

## 🧪 Testing Strategy

### Test Coverage Requirements
- [ ] Unit tests for all utility functions
- [ ] Component tests for React components
- [ ] Visual regression tests for styles
- [ ] Cross-browser compatibility tests

### Test Commands
```bash
# Run tests for UI components
npm test -- --testPathPattern="ui|components|shared"

# Run style linting
npm run lint:css

# Check for unused CSS
npm run css:purge -- --check
```

### Critical Test Scenarios
1. **Component Rendering**: All components render without errors
2. **Style Variables**: CSS variables cascade correctly
3. **Utility Functions**: Debounce, throttle work as expected
4. **Modal System**: Open/close/nested modals work properly
5. **Cross-Browser**: Components work in Chrome, Firefox, Safari

## 🚨 Known Issues & Gotchas

### Current Blockers
- **Issue**: Mixed React/Vanilla JS approaches
  - **Impact**: Inconsistent component usage patterns
  - **Workaround**: Document both patterns, gradually standardize
  - **Needs**: Decision on unified approach

### Common Pitfalls
1. **Don't**: Import React components into vanilla JS files
   **Do**: Create vanilla JS wrappers or use the auth bridge pattern

2. **Don't**: Hardcode colors or spacing
   **Do**: Always use CSS variables

3. **Don't**: Create one-off components in feature branches
   **Do**: Add to shared UI library first

### Technical Debt
- [ ] Standardize on React or vanilla JS approach
- [ ] Create missing modal system
- [ ] Document component API/props
- [ ] Add Storybook for component documentation

## 🔄 Integration Testing

### Pre-Integration Checklist
- [ ] All components render correctly
- [ ] CSS variables load properly
- [ ] No console errors
- [ ] Build process works
- [ ] TypeScript compiles without errors

### Integration Test Plan
```bash
# 1. Checkout this branch
git checkout 01-foundation/core-setup

# 2. Install dependencies
npm install

# 3. Run component tests
npm test -- --testPathPattern="components"

# 4. Build and verify
npm run build
# Check that public-site/shared/components are included
# Verify CSS files are bundled correctly

# 5. Manual testing
# - Open example.html or dev server
# - Verify all components render
# - Check styles apply correctly
# - Test responsive behavior
```

## 📈 Performance Considerations

### Bundle Size Impact
- Current UI components: ~45KB
- CSS utilities: ~15KB
- Acceptable limit: 75KB total
- Optimization: Tree-shaking for unused components

### Runtime Performance
- Component mount time: < 16ms
- Style calculation: < 10ms
- No memory leaks in modal system
- Debounced functions properly throttled

## 🔐 Security Checklist
- [ ] No inline styles that could enable XSS
- [ ] Sanitize any HTML in modal content
- [ ] No external resource loading
- [ ] Event handlers properly cleaned up
- [ ] No sensitive data in components

## 📝 Decisions & Rationale

### Key Decisions Made
1. **Decision**: Keep both React and vanilla JS patterns
   - **Why**: Existing code uses both, gradual migration safer
   - **Trade-offs**: Some duplication, complexity
   - **Benefits**: No breaking changes, flexibility

2. **Decision**: Use CSS variables over CSS-in-JS
   - **Why**: Works with both React and vanilla JS
   - **Trade-offs**: Less dynamic styling
   - **Benefits**: Better performance, simpler

### Open Questions
- [ ] Should we migrate all components to React?
- [ ] Do we need a toast/notification system?
- [ ] Should we add component prop validation?
- [ ] Include icon library in core setup?

## 🚀 Ready for PR Checklist

### Code Quality
- [ ] All existing components documented
- [ ] New utilities have tests
- [ ] CSS follows BEM or consistent naming
- [ ] No duplicate implementations

### Documentation
- [ ] Component usage examples provided
- [ ] CSS variable documentation complete
- [ ] Migration guide for vanilla to React
- [ ] README updated with setup instructions

### Manual Testing
- [ ] All components render correctly
- [ ] Styles apply consistently
- [ ] No console errors
- [ ] Works in all target browsers
- [ ] Mobile responsive

### Cleanup
- [ ] Remove any experimental code
- [ ] Delete unused files
- [ ] Optimize images/assets
- [ ] Minify CSS for production

## 🔮 Future Considerations

### Next Steps After This Branch
1. API layer can use these UI components for loading states
2. State management can use utilities for persistence
3. Auth system already uses some components

### Potential Enhancements
- Component library documentation site
- Automated visual regression testing
- Design tokens for multi-theme support
- Web components for framework agnostic approach

## 📚 Resources & References

### External Documentation
- [React Component Patterns](https://reactpatterns.com/)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Vanilla JS Best Practices](https://www.patterns.dev/posts/classic-design-patterns/)

### Related Files in Other Repos
- Modal implementation: Check auth-system.js for pattern
- Component structure: Reference existing React components

### Code to Potentially Reuse
```javascript
// From auth-system.js - Modal creation pattern
const createModal = (content) => {
  const backdrop = document.createElement('div');
  backdrop.className = 'auth-modal-backdrop';
  backdrop.innerHTML = `
    <div class="auth-modal">
      <button class="auth-modal-close">&times;</button>
      <div class="auth-modal-content">${content}</div>
    </div>
  `;
  return backdrop;
};

// CSS animation patterns from portal-base.css
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## 🆘 When You're Stuck

### Who to Ask
- **Component design**: Check existing React components first
- **Styling patterns**: Look at portal-base.css
- **Build issues**: Review webpack/build configuration

### Common Issues & Solutions
1. **Problem**: Components not found in imports
   **Solution**: Check exact paths, may need alias configuration

2. **Problem**: Styles not applying
   **Solution**: Ensure CSS files imported in correct order

3. **Problem**: React/vanilla JS conflict
   **Solution**: Use separate bundles or bridge pattern

### Emergency Rollback
```bash
# If something goes wrong:
git stash
git checkout main
git branch -D 01-foundation/core-setup
git checkout -b 01-foundation/core-setup
```

---

## 🤖 AI Session Notes

### Session Start Checklist
- [ ] Read entire CLAUDE.md
- [ ] Check what components already exist
- [ ] Verify build process works
- [ ] Review style patterns in use

### Session End Checklist  
- [ ] Update "Current State" section
- [ ] Document any new components created
- [ ] Note any pattern decisions
- [ ] Update integration examples
- [ ] Commit with clear message

### Inter-Session Communication
**For Next Session**: Modal system needs implementation
**Discovered Issues**: React/vanilla split needs resolution
**Time Estimate**: 2-3 sessions for full standardization