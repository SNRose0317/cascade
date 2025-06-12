# CLAUDE.md - Foundation State Management
Version: 1.0
Last Updated: December 6, 2024
Branch: 03-foundation/state-management
Previous Session: Initial Creation
Next Session Planning: Enhance state persistence patterns

## 🤖 CRITICAL: Read This First
**STOP** - Before doing ANYTHING:
1. Verify you're on the correct branch: `git branch --show-current`
2. Check if dependencies are merged: `git branch --merged main | grep -E "(01-foundation|02-foundation)"`
3. Read the **Current State** section to understand what's already done
4. If anything is unclear, ASK FOR CLARIFICATION before proceeding

## 🎯 Branch Mission Statement
**In one sentence:** Establish centralized state management for customer data, auth state, and app-wide settings with proper persistence.
**Success looks like:** Single source of truth for application state with automatic persistence and reactive updates.
**Failure looks like:** State scattered across components, localStorage calls everywhere, data inconsistencies between views.

## 🧠 Essential Context You Need

### What You're Building
This branch creates the state management foundation that ensures data consistency across the entire Cascade platform. You're building the layer that manages how customer data, authentication state, and application settings are stored, updated, and synchronized across different parts of the application. This is the memory of the application - without it, every page refresh would lose user context.

The state management system has three core responsibilities: First, providing a centralized store for customer data that multiple components can access and update. Second, managing authentication state to ensure secure access throughout the app. Third, implementing persistence patterns so that critical data survives page refreshes and browser sessions. The system must handle both synchronous updates (immediate UI changes) and asynchronous operations (API calls).

Good news: CustomerDataService already exists and implements many of these patterns! Your job is to document what exists, ensure it integrates properly with the other foundation branches, and establish patterns for future state management needs. The existing service uses an IIFE pattern with localStorage persistence - this should be the template for other state services.

### Your Boundaries
**You ARE responsible for:**
- Documenting and enhancing `CustomerDataService`
- Creating auth state management patterns
- localStorage utility functions
- State change event system
- Data validation before storage
- Persistence strategies
- Memory management (cleanup)

**You are NOT responsible for:**
- UI components that display state (branch 01)
- API calls to fetch/update data (branch 02)
- Authentication logic (branch 04)
- Feature-specific state (handled by features)
- Database or backend storage

### Customer Journey Context
```
Previous Step: API fetches data (branch 02) → 
YOUR STEP: State stored and managed centrally → 
Next Step: UI components render from state (branch 01)
```

## 📊 Current State & Progress

### Already Completed
- [x] CustomerDataService implemented at `/src/portal/shared/services/CustomerDataService.js`
  - Get/set customer data
  - Update specific fields
  - Clear data on logout
  - localStorage persistence
- [x] Customer API service integration at `/src/portal/shared/services/customerApiService.js`
- [x] Basic event system for state changes
- [ ] Auth state management service
- [ ] General localStorage utilities
- [ ] State validation schemas
- [ ] Memory cleanup strategies

### Active Work Item
**Currently Working On:** Initial documentation and assessment
**Files Being Modified:** None currently
**Blocker/Issue:** Need to ensure compatibility with existing services

### Session History
```
Session 1 (Dec 6, 2024): Created initial CLAUDE.md, documented existing CustomerDataService
```

## 🔗 Dependencies & Integration Points

### Incoming Dependencies (What I Need)
```javascript
// From 02-foundation/api-layer
import { apiClient } from '@/shared/services/api';
// Expected: For fetching data to populate state
// Note: This doesn't exist yet, customerApiService used instead

// From browser APIs
// localStorage - for persistence
// sessionStorage - for temporary state
// EventTarget - for state change events
```

### Outgoing Contracts (What I Provide)
```javascript
// CustomerDataService - Already exists at /src/portal/shared/services/CustomerDataService.js
window.CustomerDataService = {
  // Core data methods
  setCustomerData: (data) => void,
  getCustomerData: () => CustomerData | null,
  updateCustomerData: (updates) => void,
  clearCustomerData: () => void,
  
  // Specific data accessors
  getLabOrders: () => LabOrder[],
  getApiKeys: () => ApiKey[],
  isEmailVerified: () => boolean,
  
  // Development helpers
  mockCustomerData: () => void,  // For testing
};

// Auth State Service - To be created at /src/shared/services/authState.js
export const AuthStateService = {
  // Auth state management
  setAuthToken: (token) => void,
  getAuthToken: () => string | null,
  clearAuthToken: () => void,
  isAuthenticated: () => boolean,
  
  // User info
  setUser: (user) => void,
  getUser: () => User | null,
  getUserRole: () => string | null,
  
  // Session management
  extendSession: () => void,
  getSessionExpiry: () => Date | null,
  
  // Events
  onAuthChange: (callback) => unsubscribe,
};

// localStorage Utilities - To be created at /src/shared/utils/storage.js
export const StorageUtils = {
  // Safe storage operations
  setItem: (key, value, options) => boolean,
  getItem: (key, defaultValue) => any,
  removeItem: (key) => void,
  clear: (prefix) => void,
  
  // Storage management
  getStorageSize: () => number,
  cleanup: (maxAge) => void,
  
  // Encryption (for sensitive data)
  setSecure: (key, value) => void,
  getSecure: (key) => any,
};

// State Types
interface CustomerData {
  id: string;
  email: string;
  name: string;
  clinicianInfo?: ClinicianInfo;
  emailVerified: boolean;
  createdAt: string;
  labOrders: LabOrder[];
  apiKeys: ApiKey[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  expiresAt: string | null;
  refreshToken?: string;
}
```

### Integration Checklist
- [ ] CustomerDataService works with new patterns
- [ ] Auth state integrates with auth system (branch 04)
- [ ] Storage utilities used consistently
- [ ] State changes trigger UI updates
- [ ] No direct localStorage calls outside utilities

## 📁 File Map & Code Patterns

### Critical Files for This Branch
```
src/
├── portal/
│   └── shared/
│       └── services/
│           ├── CustomerDataService.js  # Existing - enhance documentation
│           └── customerApiService.js   # Existing - uses CustomerDataService
├── shared/
│   ├── services/
│   │   └── state/
│   │       ├── authState.js           # Create - Auth state management
│   │       ├── appState.js            # Create - General app state
│   │       └── index.js               # Create - Public exports
│   └── utils/
│       └── storage/
│           ├── localStorage.js         # Create - localStorage wrapper
│           ├── encryption.js           # Create - For sensitive data
│           └── index.js               # Create - Public exports
```

### Code Patterns to Follow
```javascript
// PATTERN 1: State Service (based on existing CustomerDataService)
const StateService = (function() {
  'use strict';
  
  const STORAGE_KEY = 'app_state';
  const STORAGE_VERSION = '1.0';
  
  // Private state
  let state = loadState();
  const listeners = new Set();
  
  // Load state from storage
  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === STORAGE_VERSION) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.error('Failed to load state:', error);
    }
    return getDefaultState();
  }
  
  // Save state to storage
  function saveState() {
    try {
      const toStore = {
        version: STORAGE_VERSION,
        data: state,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Failed to save state:', error);
      // Handle quota exceeded
      if (error.name === 'QuotaExceededError') {
        cleanupOldData();
      }
    }
  }
  
  // Notify listeners of state changes
  function notifyListeners(changeType, data) {
    listeners.forEach(listener => {
      try {
        listener({ type: changeType, data });
      } catch (error) {
        console.error('State listener error:', error);
      }
    });
  }
  
  // Public API
  return {
    // State management
    setState(newState) {
      state = { ...state, ...newState };
      saveState();
      notifyListeners('update', state);
    },
    
    getState() {
      return { ...state }; // Return copy to prevent mutations
    },
    
    updateState(updates) {
      state = { ...state, ...updates };
      saveState();
      notifyListeners('update', updates);
    },
    
    clearState() {
      state = getDefaultState();
      localStorage.removeItem(STORAGE_KEY);
      notifyListeners('clear', null);
    },
    
    // Subscriptions
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener); // Unsubscribe function
    },
    
    // Specific accessors (following CustomerDataService pattern)
    getValue(key) {
      return state[key];
    },
    
    setValue(key, value) {
      state[key] = value;
      saveState();
      notifyListeners('update', { [key]: value });
    }
  };
})();

// PATTERN 2: Auth State Management
const AuthStateService = (function() {
  'use strict';
  
  const TOKEN_KEY = 'authToken';
  const USER_KEY = 'authUser';
  const EXPIRY_KEY = 'authExpiry';
  
  // Check if session expired
  function isSessionValid() {
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (!expiry) return false;
    return new Date(expiry) > new Date();
  }
  
  // Auto-cleanup on init
  (function init() {
    if (!isSessionValid()) {
      clearAuthData();
    }
  })();
  
  function clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }
  
  return {
    setAuth(token, user, expiresIn = 3600) {
      const expiry = new Date(Date.now() + expiresIn * 1000);
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(EXPIRY_KEY, expiry.toISOString());
      
      window.dispatchEvent(new CustomEvent('auth:login', { detail: user }));
    },
    
    getToken() {
      if (!isSessionValid()) {
        clearAuthData();
        return null;
      }
      return localStorage.getItem(TOKEN_KEY);
    },
    
    getUser() {
      if (!isSessionValid()) {
        clearAuthData();
        return null;
      }
      try {
        return JSON.parse(localStorage.getItem(USER_KEY));
      } catch {
        return null;
      }
    },
    
    isAuthenticated() {
      return !!this.getToken();
    },
    
    logout() {
      clearAuthData();
    },
    
    extendSession(additionalSeconds = 3600) {
      const currentExpiry = localStorage.getItem(EXPIRY_KEY);
      if (currentExpiry) {
        const newExpiry = new Date(new Date(currentExpiry).getTime() + additionalSeconds * 1000);
        localStorage.setItem(EXPIRY_KEY, newExpiry.toISOString());
      }
    }
  };
})();

// PATTERN 3: Storage Utilities with Error Handling
const StorageUtils = (function() {
  'use strict';
  
  const PREFIX = 'cascade_';
  
  function getKey(key) {
    return `${PREFIX}${key}`;
  }
  
  return {
    setItem(key, value, options = {}) {
      const { encrypt = false, ttl = null } = options;
      
      try {
        const data = {
          value,
          timestamp: Date.now(),
          ttl
        };
        
        const serialized = JSON.stringify(data);
        const finalData = encrypt ? this.encrypt(serialized) : serialized;
        
        localStorage.setItem(getKey(key), finalData);
        return true;
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          this.cleanup();
          // Retry once after cleanup
          try {
            localStorage.setItem(getKey(key), finalData);
            return true;
          } catch {
            return false;
          }
        }
        return false;
      }
    },
    
    getItem(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(getKey(key));
        if (!item) return defaultValue;
        
        const data = JSON.parse(item);
        
        // Check TTL
        if (data.ttl && Date.now() - data.timestamp > data.ttl) {
          this.removeItem(key);
          return defaultValue;
        }
        
        return data.value;
      } catch {
        return defaultValue;
      }
    },
    
    removeItem(key) {
      localStorage.removeItem(getKey(key));
    },
    
    cleanup(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days default
      const now = Date.now();
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(PREFIX)) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data.timestamp && now - data.timestamp > maxAge) {
              localStorage.removeItem(key);
            }
          } catch {
            // Remove corrupted data
            localStorage.removeItem(key);
          }
        }
      });
    },
    
    getStorageSize() {
      let size = 0;
      for (const key in localStorage) {
        if (key.startsWith(PREFIX)) {
          size += localStorage.getItem(key).length + key.length;
        }
      }
      return size;
    }
  };
})();

// PATTERN 4: Reactive State Updates
function createReactiveState(initialState = {}) {
  const state = { ...initialState };
  const listeners = new Map();
  
  const handler = {
    set(target, property, value) {
      const oldValue = target[property];
      target[property] = value;
      
      // Notify property-specific listeners
      const propListeners = listeners.get(property) || [];
      propListeners.forEach(listener => listener(value, oldValue));
      
      // Notify global listeners
      const globalListeners = listeners.get('*') || [];
      globalListeners.forEach(listener => listener(property, value, oldValue));
      
      return true;
    }
  };
  
  const proxy = new Proxy(state, handler);
  
  return {
    state: proxy,
    watch(property, callback) {
      if (!listeners.has(property)) {
        listeners.set(property, []);
      }
      listeners.get(property).push(callback);
      
      // Return unwatch function
      return () => {
        const callbacks = listeners.get(property);
        const index = callbacks.indexOf(callback);
        if (index > -1) callbacks.splice(index, 1);
      };
    }
  };
}
```

### Naming Conventions
- Services: `PascalCase` with `Service` suffix (e.g., `CustomerDataService`)
- Storage keys: `UPPER_SNAKE_CASE` constants (e.g., `AUTH_TOKEN_KEY`)
- Event names: `namespace:action` format (e.g., `auth:login`)
- Private functions: `camelCase` (internal to IIFE)
- Public methods: `camelCase` (exposed API)

## 🧪 Testing Strategy

### Test Coverage Requirements
- [ ] State persistence across page refreshes
- [ ] Storage quota handling
- [ ] Event listener cleanup
- [ ] TTL expiration for stored items
- [ ] Concurrent state updates

### Test Commands
```bash
# Run state management tests
npm test -- --testPathPattern="state|storage"

# Test persistence
npm test -- --testNamePattern="persistence"

# Test with storage quota limits
npm test:storage -- --quota=minimal
```

### Critical Test Scenarios
1. **State Persistence**: Data survives page refresh
2. **Auth Expiry**: Session cleaned up when expired
3. **Storage Quota**: Graceful handling when full
4. **Race Conditions**: Multiple updates don't conflict
5. **Memory Leaks**: Listeners properly cleaned up

## 🚨 Known Issues & Gotchas

### Current Blockers
- **Issue**: No centralized state for app settings
  - **Impact**: Settings duplicated across components
  - **Workaround**: Use CustomerDataService pattern
  - **Needs**: Create AppStateService

### Common Pitfalls
1. **Don't**: Store sensitive data unencrypted
   **Do**: Use encryption utilities for tokens/keys

2. **Don't**: Forget to cleanup listeners
   **Do**: Return unsubscribe functions

3. **Don't**: Mutate state directly
   **Do**: Always create new objects/arrays

### Technical Debt
- [ ] Add state versioning for migrations
- [ ] Implement state compression for large data
- [ ] Add IndexedDB support for larger storage
- [ ] Create state debugging tools

## 🔄 Integration Testing

### Pre-Integration Checklist
- [ ] CustomerDataService still works
- [ ] No breaking changes to existing code
- [ ] Storage keys don't conflict
- [ ] Events don't interfere
- [ ] Memory usage acceptable

### Integration Test Plan
```bash
# 1. Checkout branch with dependencies
git checkout 03-foundation/state-management
git merge origin/01-foundation/core-setup
git merge origin/02-foundation/api-layer

# 2. Test existing functionality
npm test -- --testPathPattern="CustomerData"

# 3. Test state persistence
# Open browser console
CustomerDataService.setCustomerData({ email: 'test@example.com' });
// Refresh page
CustomerDataService.getCustomerData(); // Should return data

# 4. Test auth state
AuthStateService.setAuth('token123', { id: 1, email: 'user@example.com' });
AuthStateService.isAuthenticated(); // true
// Refresh page
AuthStateService.isAuthenticated(); // Still true

# 5. Test storage utilities
StorageUtils.setItem('test', { data: 'value' }, { ttl: 5000 });
StorageUtils.getItem('test'); // Returns { data: 'value' }
// Wait 6 seconds
StorageUtils.getItem('test'); // Returns null (expired)
```

## 📈 Performance Considerations

### Bundle Size Impact
- State services: ~8KB
- Storage utilities: ~5KB
- Event system: ~2KB
- Total impact: ~15KB

### Runtime Performance
- State read: < 1ms (memory access)
- State write: < 5ms (includes localStorage)
- Event dispatch: < 1ms per listener
- Storage cleanup: < 50ms for 100 items

### Optimization Strategies
- Debounce frequent state updates
- Batch localStorage writes
- Lazy load large state sections
- Use WeakMap for listener cleanup

## 🔐 Security Checklist
- [ ] Encrypt sensitive data (tokens, keys)
- [ ] Clear auth data on logout
- [ ] Validate state data on load
- [ ] Prevent XSS in stored data
- [ ] Use secure session expiry
- [ ] No PII in plain localStorage

## 📝 Decisions & Rationale

### Key Decisions Made
1. **Decision**: Use IIFE pattern like CustomerDataService
   - **Why**: Consistency with existing code
   - **Trade-offs**: No ES module benefits
   - **Benefits**: Works everywhere, proven pattern

2. **Decision**: localStorage over IndexedDB
   - **Why**: Simpler, synchronous, sufficient size
   - **Trade-offs**: 5-10MB limit
   - **Benefits**: No async complexity

3. **Decision**: Event-based state updates
   - **Why**: Decoupled components
   - **Trade-offs**: Slight overhead
   - **Benefits**: Flexible, testable

### Open Questions
- [ ] Should we add state time-travel debugging?
- [ ] Do we need state sync across tabs?
- [ ] Should we support offline state queue?
- [ ] Add compression for large state?

## 🚀 Ready for PR Checklist

### Code Quality
- [ ] All state operations tested
- [ ] No memory leaks
- [ ] Proper error handling
- [ ] JSDoc comments complete

### Documentation
- [ ] State service usage guide
- [ ] Storage utility examples
- [ ] Migration guide from direct localStorage
- [ ] Event subscription patterns

### Manual Testing
- [ ] State persists correctly
- [ ] Auth expiry works
- [ ] Storage quota handled
- [ ] No console errors
- [ ] Performance acceptable

### Cleanup
- [ ] Remove debug logging
- [ ] Clear test data
- [ ] No hardcoded values
- [ ] Proper error messages

## 🔮 Future Considerations

### Next Steps After This Branch
1. Auth system will use AuthStateService
2. Features will extend state patterns
3. API layer will populate state

### Potential Enhancements
- State sync across browser tabs
- Offline queue for pending changes
- State migration system
- Redux-like time travel debugging
- State persistence plugins

## 📚 Resources & References

### External Documentation
- [localStorage Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [State Management Patterns](https://www.patterns.dev/posts/statemanagement/)
- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)

### Related Files in Other Repos
- State patterns from React apps
- Event systems from enterprise apps
- Storage utilities from PWAs

### Code to Potentially Reuse
```javascript
// From CustomerDataService - state update pattern
updateCustomerData(updates) {
  const currentData = this.getCustomerData();
  if (!currentData) return;
  
  const updatedData = { ...currentData, ...updates };
  this.setCustomerData(updatedData);
}

// localStorage error handling
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Handle storage full
    this.cleanup();
  }
}
```

## 🆘 When You're Stuck

### Who to Ask
- **State patterns**: Check CustomerDataService.js
- **Storage issues**: Browser storage documentation
- **Event patterns**: DOM event documentation

### Common Issues & Solutions
1. **Problem**: State not persisting
   **Solution**: Check localStorage permissions/limits

2. **Problem**: Events not firing
   **Solution**: Verify listener registration

3. **Problem**: Memory leak warnings
   **Solution**: Ensure listeners cleaned up

### Emergency Rollback
```bash
# If something goes wrong:
git stash
git checkout main
git branch -D 03-foundation/state-management
git checkout -b 03-foundation/state-management
```

---

## 🤖 AI Session Notes

### Session Start Checklist
- [ ] Read entire CLAUDE.md
- [ ] Test CustomerDataService functionality
- [ ] Understand localStorage limitations
- [ ] Review auth token patterns

### Session End Checklist  
- [ ] Update "Current State" section
- [ ] Document any new services created
- [ ] List state management patterns used
- [ ] Note any integration issues
- [ ] Commit with clear message

### Inter-Session Communication
**For Next Session**: Auth state service needs creation
**Discovered Issues**: Only customer state exists currently
**Time Estimate**: 2 sessions to complete all state services