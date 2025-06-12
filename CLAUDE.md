# CLAUDE.md - Shopify Integration
Version: 1.0
Last Updated: December 6, 2024
Branch: 07-shopify/integration
Previous Session: Initial Creation
Next Session Planning: Implement Shopify OAuth flow

## 🤖 CRITICAL: Read This First
**STOP** - Before doing ANYTHING:
1. Verify you're on the correct branch: `git branch --show-current`
2. Check if dependencies are merged: `git branch --merged main | grep -E "(01-foundation|02-foundation|03-foundation|04-auth|05-evexia|06-lab)"`
3. Read the **Current State** section to understand what's already done
4. If anything is unclear, ASK FOR CLARIFICATION before proceeding

## 🎯 Branch Mission Statement
**In one sentence:** Enable automatic synchronization of lab orders from Evexia to Shopify for streamlined fulfillment and tracking.
**Success looks like:** Lab orders seamlessly appear in Shopify with correct products, pricing, and customer data for efficient processing.
**Failure looks like:** Manual order entry, data mismatches, or broken sync causing fulfillment delays.

## 🧠 Essential Context You Need

### What You're Building
This branch implements the Shopify integration that automatically syncs lab orders from Evexia to a Shopify store. This is the culmination of the entire user journey - after clinicians browse tests and create orders in Evexia (via our platform), those orders need to be fulfilled. The integration creates corresponding orders in Shopify where the actual fulfillment, shipping, and payment processing occurs.

The system implements Shopify's OAuth flow for secure store connection, maintains product mappings between Evexia tests and Shopify products, handles order synchronization with proper error handling, and provides clear visibility into sync status. This integration is critical for the business as it enables automated order processing without manual data entry.

### Your Boundaries
**You ARE responsible for:**
- Shopify OAuth implementation and store connection
- Product mapping interface between Evexia tests and Shopify products
- Order sync logic and error handling
- Sync status dashboard and monitoring
- Webhook handlers for order updates
- Integration settings and configuration

**You are NOT responsible for:**
- Lab test browsing (handled by branch 06)
- Evexia API connection (handled by branch 05)
- User authentication (handled by branch 04)
- Actual order creation in Evexia (future scope)
- Payment processing (handled by Shopify)

### Customer Journey Context
```
Previous Step: User browses labs and initiates orders (branch 06) → 
YOUR STEP: Orders sync to Shopify → Fulfillment begins → Tracking provided → 
Next Step: Customer receives lab test kit (handled by Shopify fulfillment)
```

## 📊 Current State & Progress

### Already Completed
- [x] Branch structure planned
- [x] Directory structure created (`/src/portal/shopify/`)
- [x] Shopify OAuth flow component (`ShopifyConnect.js`)
- [x] Store connection status component (`StoreStatus.js`)
- [x] Shopify API wrapper service (`shopifyApi.js`)
- [x] Base styles (`shopify.css`)
- [ ] Product mapping interface
- [ ] Order sync service
- [ ] Webhook handlers
- [ ] Sync status dashboard

### Active Work Item
**Currently Working On:** Building core Shopify integration components
**Files Being Modified:** Components and services in `/src/portal/shopify/`
**Blocker/Issue:** None currently

### Session History
```
Session 1 (Dec 6, 2024): Created CLAUDE.md, planning Shopify integration approach
Session 2 (Dec 6, 2024): Created OAuth connection flow, store status display, API wrapper
```

## 🔗 Dependencies & Integration Points

### Incoming Dependencies (What I Need)
```javascript
// From 01-foundation/core-setup
import { modalSystem } from '@/shared/components/ui/modal';
import { Table, Badge, Alert } from '@/shared/components/ui';

// From 02-foundation/api-layer  
import { apiClient } from '@/shared/services/api';
// Expected: OAuth endpoints, webhook handling

// From 03-foundation/state-management
import { customerDataService } from '@/portal/shared/services/CustomerDataService';
// Expected: Store connection info, sync preferences

// From 04-auth/complete-system
import { authSystem } from '@/auth/auth-system';
// Expected: User authentication for protected routes

// From 05-evexia/integration
import { evexiaIntegration } from '@/portal/evexia/services/evexiaService';
// Expected: Access to Evexia connection

// From 06-lab/discovery-and-sync
import { labCatalog } from '@/portal/labs/services/labService';
// Expected: Test/product information
```

### Outgoing Contracts (What I Provide)
```javascript
// This branch exports:
export const shopifyIntegration = {
  // Store connection
  connectStore: (storeUrl) => Promise<OAuthResult>,
  disconnectStore: () => Promise<void>,
  getStoreInfo: () => Promise<StoreInfo>,
  
  // Product mapping
  mapProduct: (evexiaTestId, shopifyProductId) => Promise<void>,
  getMappings: () => Promise<ProductMapping[]>,
  suggestMappings: () => Promise<MappingSuggestion[]>,
  
  // Order sync
  syncOrder: (evexiaOrderId) => Promise<SyncResult>,
  syncAllPendingOrders: () => Promise<SyncBatchResult>,
  getOrderSyncStatus: (orderId) => Promise<SyncStatus>,
  
  // Monitoring
  getSyncHistory: (filters) => Promise<SyncHistory[]>,
  getIntegrationHealth: () => Promise<HealthStatus>,
  
  // Configuration
  updateSyncSettings: (settings) => Promise<void>,
  getSyncSettings: () => Promise<SyncSettings>
};

// Types
interface SyncResult {
  success: boolean;
  shopifyOrderId?: string;
  error?: string;
  syncedAt: Date;
}

interface ProductMapping {
  evexiaTestId: string;
  evexiaTestName: string;
  shopifyProductId: string;
  shopifyProductName: string;
  lastSynced: Date;
}
```

### Integration Checklist
- [ ] All 6 foundation branches integrated
- [ ] OAuth flow tested with Shopify
- [ ] Product mapping UI functional
- [ ] Order sync error handling robust
- [ ] Webhook endpoints secured
- [ ] Performance acceptable for bulk sync

## 📁 File Map & Code Patterns

### Critical Files for This Branch
```
src/
├── portal/
│   ├── shopify/
│   │   ├── components/
│   │   │   ├── ShopifyConnect.js      # OAuth flow UI
│   │   │   ├── StoreStatus.js         # Connection status
│   │   │   ├── ProductMapper.js       # Mapping interface
│   │   │   ├── SyncDashboard.js       # Sync monitoring
│   │   │   ├── OrderSyncLog.js        # Sync history
│   │   │   └── IntegrationSettings.js # Config UI
│   │   ├── services/
│   │   │   ├── shopifyAuth.js         # OAuth implementation
│   │   │   ├── shopifyApi.js          # API wrapper
│   │   │   ├── orderSync.js           # Sync logic
│   │   │   ├── productMapping.js      # Mapping service
│   │   │   └── webhookHandler.js      # Webhook processing
│   │   ├── hooks/
│   │   │   ├── useShopifyStore.js     # Store connection hook
│   │   │   └── useSyncStatus.js       # Sync monitoring hook
│   │   └── styles/
│   │       └── shopify.css             # Integration styles
│   └── api/
│       └── webhooks/
│           └── shopify.js              # Webhook endpoints
```

### Code Patterns to Follow
```javascript
// PATTERN 1: Shopify OAuth Flow
async function initiateShopifyOAuth(storeUrl) {
  const state = generateSecureState();
  const redirectUri = `${window.location.origin}/shopify/callback`;
  
  // Store state for verification
  sessionStorage.setItem('shopify_oauth_state', state);
  
  const authUrl = new URL(`https://${storeUrl}/admin/oauth/authorize`);
  authUrl.searchParams.append('client_id', SHOPIFY_CLIENT_ID);
  authUrl.searchParams.append('scope', 'write_orders,read_products');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('state', state);
  
  window.location.href = authUrl.toString();
}

// PATTERN 2: Order Sync with Retry Logic
async function syncOrderWithRetry(evexiaOrder, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Map Evexia order to Shopify format
      const shopifyOrder = await transformOrder(evexiaOrder);
      
      // Create order in Shopify
      const result = await shopifyApi.createOrder(shopifyOrder);
      
      // Record successful sync
      await recordSyncResult({
        evexiaOrderId: evexiaOrder.id,
        shopifyOrderId: result.id,
        success: true,
        attempt
      });
      
      return result;
    } catch (error) {
      if (attempt === retries) {
        await recordSyncResult({
          evexiaOrderId: evexiaOrder.id,
          success: false,
          error: error.message,
          attempt
        });
        throw error;
      }
      // Exponential backoff
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
}

// PATTERN 3: Product Mapping Management
const productMappingService = {
  mappings: new Map(),
  
  async loadMappings() {
    const stored = await apiClient.get('/shopify/mappings');
    stored.data.forEach(m => {
      this.mappings.set(m.evexiaTestId, m.shopifyProductId);
    });
  },
  
  async mapProduct(evexiaTestId, shopifyProductId) {
    await apiClient.post('/shopify/mappings', {
      evexiaTestId,
      shopifyProductId
    });
    this.mappings.set(evexiaTestId, shopifyProductId);
  },
  
  getShopifyProduct(evexiaTestId) {
    return this.mappings.get(evexiaTestId);
  }
};
```

### Naming Conventions
- Components: `Shopify` prefix (e.g., `ShopifyConnect`)
- Services: Clear purpose naming (e.g., `orderSync`, `shopifyAuth`)
- Webhooks: RESTful endpoints (e.g., `/api/webhooks/shopify/orders`)
- Events: Past tense (e.g., `orderSynced`, `mappingCreated`)

## 🧪 Testing Strategy

### Test Coverage Requirements
- [ ] OAuth flow complete cycle
- [ ] Product mapping CRUD operations
- [ ] Order sync with various scenarios
- [ ] Webhook signature verification
- [ ] Error handling and retries
- [ ] Bulk sync performance

### Test Commands
```bash
# Run Shopify integration tests
npm test -- --testPathPattern="shopify"

# Test with mock Shopify API
npm test:integration -- --env=shopify-mock

# Load test for bulk sync
npm test:load -- --scenario=bulk-order-sync
```

### Critical Test Scenarios
1. **OAuth Flow**: Initiate → Authorize → Callback → Token storage
2. **Product Mapping**: Map test → Verify in UI → Use in sync
3. **Order Sync**: Create order → Sync → Verify in Shopify
4. **Error Recovery**: Network failure → Retry → Success
5. **Webhook Processing**: Receive → Verify → Process → Respond

## 🚨 Known Issues & Gotchas

### Current Blockers
- **Issue**: Shopify API rate limits
  - **Impact**: Bulk sync may be throttled
  - **Workaround**: Implement queue with rate limiting
  - **Needs**: Optimize API calls, batch where possible

### Common Pitfalls
1. **Don't**: Store Shopify access tokens in frontend
   **Do**: Keep tokens secure on backend only
   
2. **Don't**: Sync orders without product mappings
   **Do**: Validate all products mapped before sync

3. **Don't**: Process webhooks without verification
   **Do**: Always verify HMAC signatures

### Technical Debt
- [ ] Implement webhook queue for reliability
- [ ] Add sync scheduling options
- [ ] Create bulk mapping import tool

## 🔄 Integration Testing

### Pre-Integration Checklist
- [ ] All 6 dependency branches merged
- [ ] Shopify test store available
- [ ] Test products created in Shopify
- [ ] Webhook URLs configured
- [ ] API credentials secured

### Integration Test Plan
```bash
# 1. Setup with all dependencies
git checkout 07-shopify/integration
git merge origin/01-foundation/core-setup
git merge origin/02-foundation/api-layer
git merge origin/03-foundation/state-management
git merge origin/04-auth/complete-system
git merge origin/05-evexia/integration
git merge origin/06-lab/discovery-and-sync

# 2. Configure test environment
cp .env.example .env
# Add Shopify credentials

# 3. Run full integration suite
npm test:integration:full

# 4. Manual testing flow
# - Login as clinician
# - Connect Evexia account
# - Connect Shopify store via OAuth
# - Map Evexia tests to Shopify products
# - Create test order in Evexia
# - Trigger sync
# - Verify order in Shopify
# - Test webhook updates
```

## 📈 Performance Considerations

### Bundle Size Impact
- Current feature size: ~75KB
- Acceptable limit: 100KB
- Optimization: Lazy load sync dashboard

### Runtime Performance
- Single order sync: < 3s
- Bulk sync (100 orders): < 60s
- Webhook processing: < 500ms
- Product search: < 1s

### Optimization Strategies
- Queue orders for batch processing
- Cache product mappings aggressively
- Implement pagination for sync history
- Use Shopify GraphQL for efficiency

## 🔐 Security Checklist
- [ ] OAuth state parameter validated
- [ ] Access tokens encrypted at rest
- [ ] Webhook signatures verified
- [ ] API rate limits implemented
- [ ] Audit logging for all syncs
- [ ] PII handled according to regulations

## 📝 Decisions & Rationale

### Key Decisions Made
1. **Decision**: Queue-based sync vs real-time
   - **Why**: Reliability and rate limit management
   - **Trade-offs**: Slight delay in order appearance
   - **Benefits**: Retry capability, better error handling

2. **Decision**: Manual product mapping vs auto-matching
   - **Why**: Accuracy critical for orders
   - **Trade-offs**: Initial setup time
   - **Benefits**: Prevents incorrect fulfillment

### Open Questions
- [ ] Should we support multiple Shopify stores?
- [ ] How to handle partial order syncs?
- [ ] Do we need two-way sync for updates?

## 🚀 Ready for PR Checklist

### Code Quality
- [ ] All tests pass
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Error handling comprehensive

### Documentation
- [ ] CLAUDE.md finalized
- [ ] API documentation complete
- [ ] Setup guide created
- [ ] Troubleshooting guide added

### Manual Testing
- [ ] Full OAuth flow tested
- [ ] All sync scenarios verified
- [ ] Webhook processing confirmed
- [ ] Error recovery tested
- [ ] Performance acceptable

### Cleanup
- [ ] Remove debug logging
- [ ] Clear test data
- [ ] Verify no hardcoded values
- [ ] Security scan passed

## 🔮 Future Considerations

### Next Steps After This Branch
1. Inventory sync from Shopify
2. Automated fulfillment updates
3. Advanced analytics dashboard
4. Multi-store support

### Potential Enhancements
- Real-time order status updates
- Automated product mapping suggestions
- Bulk order processing optimization
- Custom Shopify app for deeper integration

## 📚 Resources & References

### External Documentation
- [Shopify OAuth Guide](https://shopify.dev/docs/apps/auth/oauth)
- [Shopify Orders API](https://shopify.dev/docs/api/admin-rest/orders)
- [Webhook Best Practices](https://shopify.dev/docs/apps/webhooks/best-practices)

### Related Files in Other Repos
- OAuth implementation: [Reference OAuth flow]
- Queue system: [Background job patterns]

### Code to Potentially Reuse
```javascript
// From existing services
import { queueService } from '@/shared/services/queue';
import { cryptoUtils } from '@/shared/utils/crypto';

// HMAC verification for webhooks
function verifyWebhookSignature(rawBody, signature) {
  const hash = cryptoUtils.hmac(SHOPIFY_WEBHOOK_SECRET, rawBody);
  return cryptoUtils.timingSafeEqual(hash, signature);
}
```

## 🆘 When You're Stuck

### Who to Ask
- **Shopify API questions**: Check official docs first
- **Integration patterns**: Review similar integrations
- **Security concerns**: Consult security guidelines

### Common Issues & Solutions
1. **Problem**: OAuth callback fails
   **Solution**: Check redirect URI configuration

2. **Problem**: Orders not syncing
   **Solution**: Verify product mappings exist

3. **Problem**: Webhooks not received
   **Solution**: Check webhook URL and verification

### Emergency Rollback
```bash
# If something goes wrong:
git stash
git checkout main
git branch -D 07-shopify/integration
git checkout -b 07-shopify/integration
```

---

## 🤖 AI Session Notes

### Session Start Checklist
- [ ] Read entire CLAUDE.md
- [ ] Verify all dependencies merged
- [ ] Check Shopify test store access
- [ ] Review integration requirements

### Session End Checklist  
- [ ] Update "Current State" section
- [ ] Document integration progress
- [ ] Note any API limitations
- [ ] Plan next session's work
- [ ] Commit with clear message

### Inter-Session Communication
**For Next Session**: Begin with OAuth implementation
**Discovered Issues**: Need Shopify partner account
**Time Estimate**: 5-6 sessions for complete integration