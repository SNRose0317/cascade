# CLAUDE.md - Authentication Complete System
Version: 1.0
Last Updated: December 6, 2024
Branch: 04-auth/complete-system
Previous Session: Initial Creation
Next Session Planning: Implement signup flow and modal system

## 🤖 CRITICAL: Read This First
**STOP** - Before doing ANYTHING:
1. Verify you're on the correct branch: `git branch --show-current`
2. Check if dependencies are merged: `git branch --merged main | grep -E "(01-foundation|02-foundation|03-foundation)"`
3. Read the **Current State** section to understand what's already done
4. If anything is unclear, ASK FOR CLARIFICATION before proceeding

## 🎯 Branch Mission Statement
**In one sentence:** Build a complete authentication system with signup, login, profile management, and role-based access control.
**Success looks like:** Users can register, login, manage their profile, and access role-appropriate features with proper security.
**Failure looks like:** Insecure authentication, broken user flows, or inaccessible profile features.

## 🧠 Essential Context You Need

### What You're Building
This branch implements the complete authentication system for the Cascade platform. It provides user registration for clinicians, secure login/logout functionality, password reset capabilities, and user profile management. The system uses JWT tokens for session management and includes role-based access control to ensure users only access appropriate features.

The authentication system integrates with the existing modal infrastructure from the foundation branches and provides a seamless user experience with proper error handling and validation. All authentication state is managed centrally and exposed through a consistent API that other features can depend on.

### Your Boundaries
**You ARE responsible for:**
- /src/auth/ directory and all its contents
- auth-system.js main authentication module
- Modal-based authentication forms (signup, login, forgot password)
- Profile dropdown and settings components
- Authentication guards and middleware
- Session management and JWT handling

**You are NOT responsible for:**
- API endpoint implementation (uses foundation API layer)
- Base modal system (uses foundation UI components)
- Customer data structure (uses foundation state management)
- Evexia integration (handled by branch 05)
- Lab features (handled by branch 06)

### Customer Journey Context
```
Previous Step: User lands on public site → 
YOUR STEP: User signs up/logs in → Manages profile → 
Next Step: User connects Evexia account (branch 05)
```

## 📊 Current State & Progress

### Already Completed
- [x] Basic auth directory structure created
- [x] Auth service files scaffolded
- [x] Profile dropdown component exists
- [ ] Signup flow implementation
- [ ] Login flow implementation
- [ ] Password reset flow
- [ ] Profile settings page
- [ ] Role-based guards

### Active Work Item
**Currently Working On:** Initial setup review
**Files Being Modified:** None yet
**Blocker/Issue:** None currently

### Session History
```
Session 1 (Dec 6, 2024): Created CLAUDE.md, planning authentication implementation
```

## 🔗 Dependencies & Integration Points

### Incoming Dependencies (What I Need)
```javascript
// From 01-foundation/core-setup
import { modalSystem } from '@/shared/components/ui/modal';
// Expected: Modal.open(), Modal.close(), Modal component

// From 02-foundation/api-layer  
import { apiClient } from '@/shared/services/api';
// Expected methods: .post('/auth/signup'), .post('/auth/login'), .get('/auth/profile')

// From 03-foundation/state-management
import { customerDataService } from '@/portal/shared/services/CustomerDataService';
// Expected interface: { setCustomer(), getCustomer(), clearCustomer() }
```

### Outgoing Contracts (What I Provide)
```javascript
// This branch exports:
export const authSystem = {
  // Core authentication methods
  signup: (userData) => Promise<{ user, token }>,
  login: (credentials) => Promise<{ user, token }>,
  logout: () => Promise<void>,
  
  // Session management
  isAuthenticated: () => boolean,
  getCurrentUser: () => User | null,
  getAuthToken: () => string | null,
  
  // Profile management
  updateProfile: (updates) => Promise<User>,
  changePassword: (oldPass, newPass) => Promise<void>,
  resetPassword: (email) => Promise<void>,
  
  // Guards
  requireAuth: () => boolean,
  requireRole: (role) => boolean
};
```

### Integration Checklist
- [ ] Verified modal system from 01-foundation works
- [ ] Tested API client from 02-foundation
- [ ] Integrated with CustomerDataService from 03-foundation
- [ ] Created auth bridge for legacy compatibility
- [ ] Updated all dependent components

## 📁 File Map & Code Patterns

### Critical Files for This Branch
```
src/
├── auth/
│   ├── auth-system.js             # Main auth module & exports
│   ├── api/
│   │   ├── authService.js         # API calls for auth
│   │   ├── authState.js           # Auth state management
│   │   └── authValidation.js      # Form validation
│   ├── components/
│   │   ├── ClinicianSignupForm.js # Main signup form
│   │   ├── ForgotPassword.js      # Password reset form
│   │   ├── ProfileDropdown.js     # User menu in header
│   │   ├── ProfileSettings.js     # Profile management page
│   │   └── ResetPassword.js       # Reset password form
│   ├── guards/
│   │   ├── authGuard.js           # Authentication check
│   │   └── roleGuard.js           # Role-based access
│   ├── services/
│   │   └── authBridge.js          # Legacy compatibility
│   └── styles/
│       ├── auth.css               # General auth styles
│       └── clinician-signup.css   # Signup specific styles
```

### Code Patterns to Follow
```javascript
// PATTERN 1: Authentication API Calls
async function authenticate(credentials) {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      authState.setToken(response.data.token);
      authState.setUser(response.data.user);
      customerDataService.setCustomer(response.data.user);
    }
    return response.data;
  } catch (error) {
    handleError(error, { context: 'Authentication' });
    throw error;
  }
}

// PATTERN 2: Modal-based Forms
function openSignupModal() {
  modalSystem.open({
    component: ClinicianSignupForm,
    props: {
      onSuccess: (user) => {
        modalSystem.close();
        // Redirect to profile or next step
      },
      onCancel: () => modalSystem.close()
    }
  });
}

// PATTERN 3: Auth Guards
export const requireAuth = (redirectTo = '/login') => {
  if (!authSystem.isAuthenticated()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
};
```

### Naming Conventions
- Components: `PascalCase` (e.g., `ProfileSettings`)
- Services: `camelCase` with descriptive names (e.g., `authService`)
- Guards: `camelCase` with action verb (e.g., `requireAuth`)
- API methods: `camelCase` with clear verbs (e.g., `signup`, `logout`)

## 🧪 Testing Strategy

### Test Coverage Requirements
- [ ] Unit tests for all auth service methods
- [ ] Component tests for forms and interactions
- [ ] Integration tests for full auth flows
- [ ] Guard tests for access control
- [ ] Error scenario coverage

### Test Commands
```bash
# Run tests for auth feature only
npm test -- --testPathPattern="auth"

# Run with coverage
npm test -- --coverage --testPathPattern="auth"

# Run in watch mode during development
npm test -- --watch --testPathPattern="auth"
```

### Critical Test Scenarios
1. **Happy Path**: User signs up → receives confirmation → logs in → accesses profile
2. **Invalid Credentials**: Login with wrong password shows appropriate error
3. **Session Expiry**: Expired token redirects to login
4. **Password Reset**: User can reset password via email link
5. **Role Access**: Users can only access role-appropriate features

## 🚨 Known Issues & Gotchas

### Current Blockers
- **Issue**: Modal system integration needs verification
  - **Impact**: Can't implement signup/login modals
  - **Workaround**: Test with standalone pages first
  - **Needs**: Confirm modal API from 01-foundation

### Common Pitfalls
1. **Don't**: Store sensitive data in localStorage
   **Do**: Use secure httpOnly cookies for tokens when possible
   
2. **Don't**: Implement custom password hashing
   **Do**: Rely on backend API for secure password handling

3. **Don't**: Show generic error messages
   **Do**: Provide specific, helpful error feedback

### Technical Debt
- [ ] Migrate from localStorage to secure cookie storage
- [ ] Implement refresh token rotation
- [ ] Add multi-factor authentication support

## 🔄 Integration Testing

### Pre-Integration Checklist
- [ ] All auth components render correctly
- [ ] Forms validate input properly
- [ ] API calls handle errors gracefully
- [ ] State updates propagate correctly
- [ ] Guards prevent unauthorized access

### Integration Test Plan
```bash
# 1. Checkout this branch and dependencies
git checkout 04-auth/complete-system

# 2. Merge foundation branches for testing
git merge origin/01-foundation/core-setup
git merge origin/02-foundation/api-layer
git merge origin/03-foundation/state-management

# 3. Run integration tests
npm test:integration

# 4. Manual integration testing steps
# - Step 1: Click "Sign Up" button
# - Step 2: Fill clinician signup form
# - Step 3: Verify email validation
# - Step 4: Submit and check redirect
# - Step 5: Login with new credentials
# - Step 6: Access profile settings
```

## 📈 Performance Considerations

### Bundle Size Impact
- Current feature size: ~45KB
- Acceptable limit: 60KB
- Optimization opportunities: Lazy load profile settings

### Runtime Performance
- Login API calls should complete in < 500ms
- Form validation should be instant (< 50ms)
- Token refresh should be transparent to user

## 🔐 Security Checklist
- [ ] No passwords stored in frontend
- [ ] JWT tokens have appropriate expiry
- [ ] All forms prevent XSS attacks
- [ ] CSRF protection implemented
- [ ] Sensitive routes require authentication
- [ ] Role checks enforced consistently

## 📝 Decisions & Rationale

### Key Decisions Made
1. **Decision**: Use modal-based auth forms instead of separate pages
   - **Why**: Better UX, keeps user context
   - **Trade-offs**: More complex implementation
   - **Benefits**: Seamless experience, no page reloads

2. **Decision**: Implement role-based guards at route level
   - **Why**: Centralized access control
   - **Trade-offs**: Requires route wrapper components
   - **Benefits**: Consistent security, easy to maintain

### Open Questions
- [ ] Should we implement remember me functionality?
- [ ] How long should sessions last before expiry?
- [ ] Do we need social login integration?

## 🚀 Ready for PR Checklist

### Code Quality
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Code coverage > 80%

### Documentation
- [ ] CLAUDE.md updated with final state
- [ ] Code comments added where needed
- [ ] API changes documented
- [ ] README updated if needed

### Manual Testing
- [ ] Signup flow works end-to-end
- [ ] Login/logout works correctly
- [ ] Password reset emails sent
- [ ] Profile updates save properly
- [ ] Guards prevent unauthorized access

### Cleanup
- [ ] Remove console.logs
- [ ] Remove commented code
- [ ] Remove TODO comments (or create issues)
- [ ] Security review completed

## 🔮 Future Considerations

### Next Steps After This Branch
1. Evexia integration (branch 05) will use auth system
2. Lab features (branch 06) will require authentication
3. Shopify integration (branch 07) needs secure API tokens

### Potential Enhancements
- Multi-factor authentication
- Social login providers
- Single sign-on (SSO) support
- Biometric authentication

## 📚 Resources & References

### External Documentation
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Guide](https://owasp.org/www-project-cheat-sheets/)
- [Modal System Docs](../01-foundation/modal-docs.md)

### Related Files in Other Repos
- Similar auth system: [Reference implementation]
- Reusable validation: /shared/utils/validation.js

### Code to Potentially Reuse
```javascript
// From shared validation utilities
import { validateEmail, validatePassword } from '@/shared/utils/validation';

// These can be used in authValidation.js
```

## 🆘 When You're Stuck

### Who to Ask
- **Auth architecture**: Ask about security requirements
- **API endpoints**: Check with backend team
- **UI/UX questions**: Refer to design mockups

### Common Issues & Solutions
1. **Problem**: Modal won't open
   **Solution**: Check modalSystem import and initialization

2. **Problem**: Auth state not persisting
   **Solution**: Verify localStorage/cookie handling

3. **Problem**: Guards not redirecting
   **Solution**: Check route configuration

### Emergency Rollback
```bash
# If something goes wrong:
git stash  # Save your work
git checkout main
git branch -D 04-auth/complete-system
git checkout -b 04-auth/complete-system
```

---

## 🤖 AI Session Notes

### Session Start Checklist
- [ ] Read entire CLAUDE.md
- [ ] Verify on correct branch
- [ ] Check foundation branches are merged
- [ ] Review existing auth code

### Session End Checklist  
- [ ] Update "Current State" section
- [ ] Document any decisions made
- [ ] List blockers discovered
- [ ] Plan next session's work
- [ ] Commit work with clear message

### Inter-Session Communication
**For Next Session**: Start with implementing the signup modal flow
**Discovered Issues**: Need to verify modal system API
**Time Estimate**: 3-4 sessions for complete implementation