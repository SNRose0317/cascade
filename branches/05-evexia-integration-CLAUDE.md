# CLAUDE.md - Evexia Integration
Version: 1.0
Last Updated: December 6, 2024
Branch: 05-evexia/integration
Previous Session: Initial Creation
Next Session Planning: Implement API key setup flow

## 🤖 CRITICAL: Read This First
**STOP** - Before doing ANYTHING:
1. Verify you're on the correct branch: `git branch --show-current`
2. Check if dependencies are merged: `git branch --merged main | grep -E "(01-foundation|02-foundation|03-foundation)"`
3. Read the **Current State** section to understand what's already done
4. If anything is unclear, ASK FOR CLARIFICATION before proceeding

## 🎯 Branch Mission Statement
**In one sentence:** Enable clinicians to connect their Evexia accounts and validate API access for lab integration.
**Success looks like:** Users can securely store Evexia API credentials and verify connectivity with clear feedback.
**Failure looks like:** API keys stored insecurely, unclear connection status, or failed lab data retrieval.

## 🧠 Essential Context You Need

### What You're Building
This branch implements the Evexia API integration layer that allows clinicians to connect their existing Evexia accounts to the Cascade platform. Evexia is a third-party lab testing platform that clinicians use to order and manage lab tests. Our integration enables clinicians to browse available tests, view pricing, and eventually sync orders.

The integration focuses on secure API key management, connection validation, and providing clear visual feedback about connection status. This is a critical step in the user journey as it unlocks the lab catalog and ordering features. The implementation uses the existing modal system and integrates with the customer data service to persist connection details.

### Your Boundaries
**You ARE responsible for:**
- Evexia API key setup flow and UI
- API connection validation logic
- Secure storage of API credentials
- Connection status indicators
- Error handling for API failures
- Integration settings page

**You are NOT responsible for:**
- Authentication system (handled by branch 04)
- Lab catalog browsing (handled by branch 06)
- Order syncing (handled by branch 07)
- Base modal/UI components (from foundation)
- API client setup (from foundation)

### Customer Journey Context
```
Previous Step: User completes authentication (branch 04) → 
YOUR STEP: User connects Evexia account → Validates API access → 
Next Step: User browses lab catalog (branch 06)
```

## 📊 Current State & Progress

### Already Completed
- [x] Evexia screenshots added to assets
- [x] Basic directory structure exists
- [ ] API key input form
- [ ] Connection validation endpoint
- [ ] Settings page for Evexia
- [ ] Success/error state handling
- [ ] API key secure storage

### Active Work Item
**Currently Working On:** Initial planning
**Files Being Modified:** None yet
**Blocker/Issue:** None currently

### Session History
```
Session 1 (Dec 6, 2024): Created CLAUDE.md, planning Evexia integration approach
```

## 🔗 Dependencies & Integration Points

### Incoming Dependencies (What I Need)
```javascript
// From 01-foundation/core-setup
import { modalSystem } from '@/shared/components/ui/modal';
import { Button, Input, Alert } from '@/shared/components/ui';
// Expected: UI components and modal system

// From 02-foundation/api-layer  
import { apiClient } from '@/shared/services/api';
// Expected methods: .post(), .get(), with auth headers

// From 03-foundation/state-management
import { customerDataService } from '@/portal/shared/services/CustomerDataService';
// Expected: getCustomer(), updateCustomer() with evexiaConnection field
```

### Outgoing Contracts (What I Provide)
```javascript
// This branch exports:
export const evexiaIntegration = {
  // Connection management
  connectAccount: (apiKey) => Promise<ConnectionResult>,
  validateConnection: () => Promise<ValidationResult>,
  disconnectAccount: () => Promise<void>,
  
  // Status checks
  isConnected: () => boolean,
  getConnectionStatus: () => ConnectionStatus,
  getLastSyncTime: () => Date | null,
  
  // API key management
  updateApiKey: (newKey) => Promise<ValidationResult>,
  testApiKey: (key) => Promise<boolean>
};

// Types
interface ConnectionResult {
  success: boolean;
  accountInfo?: EvexiaAccount;
  error?: string;
}

interface ConnectionStatus {
  connected: boolean;
  lastValidated: Date;
  accountName?: string;
}
```

### Integration Checklist
- [ ] Modal system working for API key input
- [ ] API client includes auth headers
- [ ] Customer data service stores connection info
- [ ] Error handling follows foundation patterns
- [ ] UI components match design system

## 📁 File Map & Code Patterns

### Critical Files for This Branch
```
src/
├── portal/
│   ├── evexia/
│   │   ├── components/
│   │   │   ├── EvexiaSetup.js        # Main setup flow component
│   │   │   ├── ApiKeyForm.js         # API key input form
│   │   │   ├── ConnectionStatus.js   # Status indicator
│   │   │   └── EvexiaSettings.js     # Settings page component
│   │   ├── services/
│   │   │   ├── evexiaService.js      # API integration logic
│   │   │   └── evexiaValidation.js   # Validation helpers
│   │   ├── hooks/
│   │   │   └── useEvexiaConnection.js # React hook for connection
│   │   └── styles/
│   │       └── evexia.css             # Evexia-specific styles
│   └── shared/
│       └── services/
│           └── customerApiService.js  # Update for Evexia fields
```

### Code Patterns to Follow
```javascript
// PATTERN 1: API Key Validation
async function validateApiKey(apiKey) {
  try {
    // Never log the actual API key
    console.log('Validating Evexia API connection...');
    
    const response = await apiClient.post('/evexia/validate', {
      apiKey: apiKey // Sent securely over HTTPS
    });
    
    if (response.data.valid) {
      // Store connection info, not the key itself
      await customerDataService.updateCustomer({
        evexiaConnection: {
          connected: true,
          accountName: response.data.accountName,
          lastValidated: new Date()
        }
      });
    }
    
    return response.data;
  } catch (error) {
    handleError(error, { context: 'Evexia Validation' });
    throw error;
  }
}

// PATTERN 2: Secure Storage
// API keys should only be stored server-side
// Frontend only knows connection status
const evexiaState = {
  connected: false,
  accountInfo: null,
  lastSync: null
  // NO apiKey field here!
};

// PATTERN 3: Status Indicators
function ConnectionStatusBadge({ status }) {
  return (
    <div className={`status-badge ${status.connected ? 'connected' : 'disconnected'}`}>
      {status.connected ? (
        <>✓ Connected to {status.accountName}</>
      ) : (
        <>○ Not Connected</>
      )}
    </div>
  );
}
```

### Naming Conventions
- Components: `PascalCase` with `Evexia` prefix (e.g., `EvexiaSetup`)
- Services: `camelCase` with clear purpose (e.g., `evexiaService`)
- Hooks: `use` prefix (e.g., `useEvexiaConnection`)
- API endpoints: `/evexia/*` namespace

## 🧪 Testing Strategy

### Test Coverage Requirements
- [ ] Unit tests for validation logic
- [ ] Component tests for setup flow
- [ ] Integration tests for API calls
- [ ] Error scenario coverage
- [ ] Security tests for key handling

### Test Commands
```bash
# Run tests for Evexia feature only
npm test -- --testPathPattern="evexia"

# Run with coverage
npm test -- --coverage --testPathPattern="evexia"

# Run security tests
npm run test:security -- --testPathPattern="evexia"
```

### Critical Test Scenarios
1. **Happy Path**: Enter valid API key → Validation succeeds → Shows connected status
2. **Invalid Key**: Enter invalid key → Shows specific error → Allows retry
3. **Network Error**: API unavailable → Shows connection error → Offers troubleshooting
4. **Expired Key**: Previously valid key fails → Prompts for update
5. **Disconnect Flow**: User can disconnect and reconnect account

## 🚨 Known Issues & Gotchas

### Current Blockers
- **Issue**: Evexia API documentation access needed
  - **Impact**: Can't implement actual validation
  - **Workaround**: Mock validation endpoint for now
  - **Needs**: Real API endpoints and auth format

### Common Pitfalls
1. **Don't**: Store API keys in frontend state or localStorage
   **Do**: Only store connection status and account info
   
2. **Don't**: Show raw API errors to users
   **Do**: Translate to helpful user messages

3. **Don't**: Make API calls without proper error handling
   **Do**: Always handle network failures gracefully

### Technical Debt
- [ ] Implement API key rotation reminders
- [ ] Add connection health monitoring
- [ ] Cache validation results appropriately

## 🔄 Integration Testing

### Pre-Integration Checklist
- [ ] Setup flow completes successfully
- [ ] Validation provides clear feedback
- [ ] Connection status persists correctly
- [ ] Error messages are user-friendly
- [ ] Security review completed

### Integration Test Plan
```bash
# 1. Checkout this branch and dependencies
git checkout 05-evexia/integration

# 2. Merge foundation branches
git merge origin/01-foundation/core-setup
git merge origin/02-foundation/api-layer
git merge origin/03-foundation/state-management

# 3. Run integration tests
npm test:integration

# 4. Manual testing steps
# - Navigate to Settings > Integrations
# - Click "Connect Evexia Account"
# - Enter test API key
# - Verify validation feedback
# - Check connection status updates
# - Test disconnect/reconnect flow
```

## 📈 Performance Considerations

### Bundle Size Impact
- Current feature size: ~25KB
- Acceptable limit: 40KB
- Optimization opportunities: Lazy load settings page

### Runtime Performance
- API validation should complete in < 2s
- Status checks should be cached (5 min TTL)
- UI should show loading states immediately

## 🔐 Security Checklist
- [ ] API keys never exposed in frontend code
- [ ] All API key transmission over HTTPS
- [ ] No API keys in console logs
- [ ] Validation endpoint rate-limited
- [ ] Clear security warnings in UI
- [ ] Audit trail for connection changes

## 📝 Decisions & Rationale

### Key Decisions Made
1. **Decision**: Store API keys only on backend
   - **Why**: Security best practice
   - **Trade-offs**: More complex validation flow
   - **Benefits**: Prevents key exposure in browser

2. **Decision**: Use modal for initial setup
   - **Why**: Consistent with auth patterns
   - **Trade-offs**: Limited space for instructions
   - **Benefits**: Seamless user experience

### Open Questions
- [ ] Should we support multiple Evexia accounts?
- [ ] How often should we revalidate connections?
- [ ] Do we need webhook support for real-time updates?

## 🚀 Ready for PR Checklist

### Code Quality
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Security scan clean (`npm audit`)
- [ ] Code coverage > 80%

### Documentation
- [ ] CLAUDE.md updated with final state
- [ ] API integration documented
- [ ] Security considerations noted
- [ ] User guide created

### Manual Testing
- [ ] Setup flow works end-to-end
- [ ] Validation provides clear feedback
- [ ] Connection status accurate
- [ ] Error handling works properly
- [ ] Disconnect flow works

### Cleanup
- [ ] Remove console.logs
- [ ] Remove test API keys
- [ ] Security review completed
- [ ] No sensitive data exposed

## 🔮 Future Considerations

### Next Steps After This Branch
1. Lab catalog browser (branch 06) uses connection
2. Order sync (branch 07) requires valid connection
3. Automated testing features need API access

### Potential Enhancements
- Multi-account support
- API usage analytics
- Automated connection health checks
- Webhook integration for real-time updates

## 📚 Resources & References

### External Documentation
- [Evexia API Docs](https://evexia.com/api/docs) (need access)
- [OAuth Best Practices](https://oauth.net/2/best-practices/)
- Screenshots in: `/portal/core/assets/images/evexia-screenshots/`

### Related Files in Other Repos
- Similar integration: [Reference OAuth implementation]
- API key handling: [Security patterns reference]

### Code to Potentially Reuse
```javascript
// From existing customer service
const updateConnectionStatus = async (status) => {
  const customer = await customerDataService.getCustomer();
  return customerDataService.updateCustomer({
    ...customer,
    evexiaConnection: status
  });
};
```

## 🆘 When You're Stuck

### Who to Ask
- **Evexia API details**: Check with integration team
- **Security questions**: Consult security guidelines
- **UI/UX questions**: Refer to design mockups

### Common Issues & Solutions
1. **Problem**: API validation fails with CORS
   **Solution**: Ensure backend proxy is configured

2. **Problem**: Connection status not updating
   **Solution**: Check customerDataService integration

3. **Problem**: Modal not closing after success
   **Solution**: Verify modalSystem.close() is called

### Emergency Rollback
```bash
# If something goes wrong:
git stash
git checkout main
git branch -D 05-evexia/integration
git checkout -b 05-evexia/integration
```

---

## 🤖 AI Session Notes

### Session Start Checklist
- [ ] Read entire CLAUDE.md
- [ ] Verify on correct branch
- [ ] Check foundation dependencies
- [ ] Review Evexia screenshots

### Session End Checklist  
- [ ] Update "Current State" section
- [ ] Document any API discoveries
- [ ] Note security considerations
- [ ] Plan next session's work
- [ ] Commit with clear message

### Inter-Session Communication
**For Next Session**: Begin with API key form implementation
**Discovered Issues**: Need Evexia API documentation
**Time Estimate**: 2-3 sessions for complete integration