# Frontend Integration - Customer Journey & API Mapping

## 🎯 Overview

This document provides a comprehensive mapping of the Web3 Diagnostics frontend implementation to backend API endpoints, following the complete customer journey from initial website visit through full platform integration.

### Business Model Context

**Web3 Diagnostics** is an integration-as-a-service platform that enables medical practices to offer lab testing through their e-commerce stores. We serve as an intermediary between:
- **Medical Practices** (our customers) who want to offer lab testing
- **Evexia** (lab aggregator) who provides access to multiple lab vendors through a single API
- **Shopify** (e-commerce platform) where practices sell lab tests to patients

To use our service, medical practices must obtain a **Web3-associated API key from Evexia** that establishes Web3 as a parent account, allowing us to process orders with markup pricing.

## 📋 API Endpoints Overview

### Authentication Endpoints

| API | TYPE | Description | Body | Result |
|-----|------|-------------|------|--------|
| `/api/auth/signup` | POST | New user registration | ```json { "email": "doctor@practice.com", "password": "securePass123", "first_name": "Sarah", "last_name": "Johnson" }``` | ```json { "success": true, "message": "Verification email sent" }``` |
| `/api/auth/login` | POST | User authentication | ```json { "email": "doctor@practice.com", "password": "securePass123" }``` | ```json { "token": "jwt_token_here", "customer_id": "8c13a1b0-2499...", "email": "doctor@practice.com", "first_login": true }``` |
| `/api/auth/verify` | POST | Email verification | ```json { "token": "verification_token", "code": "123456" }``` | ```json { "success": true, "customer_id": "8c13a1b0-2499..." }``` |

### Customer Management Endpoints

| API | TYPE | Description | Body | Result |
|-----|------|-------------|------|--------|
| `/api/customer` | GET | Load customer profile | N/A (uses auth token) | ```json [{ "id": "8c13a1b0-2499...", "practice_name": "Sunshine Medical", "first_name": "Sarah", "last_name": "Johnson", "npi": "1234567890", "client_id": "BCAD601C-EBA4..." }]``` |
| `/api/customer` | POST | Update profile information | ```json { "id": "8c13a1b0-2499...", "practice_name": "Sunshine Medical", "address": "123 Medical Plaza", "city": "Austin", "state": "TX", "zip": "78701", "npi": "1234567890" }``` | ```json { "status": "success", "id": "8c13a1b0-2499..." }``` |
| `/api/customer` | POST | Save Evexia API key | ```json { "id": "8c13a1b0-2499...", "client_id": "BCAD601C-EBA4..." }``` | ```json { "status": "success" }``` |

### Evexia Integration Endpoints

| API | TYPE | Description | Body | Result |
|-----|------|-------------|------|--------|
| `/api/evexia/validate-client-id` | POST | Validate Evexia API key connection | ```json { "external_client_id": "BCAD601C-EBA4...", "customer_id": "8c13a1b0-2499..." }``` | ```json { "valid": true, "available_tests": 156 }``` |

### Lab Discovery Endpoints

| API | TYPE | Description | Query Parameters | Result |
|-----|------|-------------|-----------------|--------|
| `/api/test` | GET | Load available tests | `?client_id={customerId}&limit=100` | ```json { "tests": [{ "sku": "EVT-813", "name": "Vitamin D Test", "cpt_code": "82306", "cost": "45.00", "lab": "LabCorp" }], "last_key": {"id": "813"} }``` |
| `/api/panel` | GET | Load test panels | `?client_id={customerId}&limit=100` | ```json { "panels": [{ "sku": "EVP-3251", "name": "Complete Hormone Panel", "cost": "453.70", "tests": [...] }], "last_key": {"id": "3251"} }``` |

### Sync Management Endpoints

| API | TYPE | Description | Body/Query | Result |
|-----|------|-------------|------------|--------|
| `/api/clinician_sync` | GET | Get synced items | `?client_id={customerId}` | ```json { "panels": [{ "sku": "EVT-813", "price": 58.50, "created_at": "2025-06-01..." }] }``` |
| `/api/clinician_sync` | POST | Add/Update test to catalog | ```json { "customer_id": "8c13a1b0-2499...", "action": "add", "sku": { "sku": "EVT-813", "price": 65.00 } }``` | ```json { "status": "success" }``` |
| `/api/clinician_sync` | DELETE | Remove from catalog | ```json { "customer_id": "8c13a1b0-2499...", "sku": { "sku": "EVT-813" } }``` | ```json { "status": "success" }``` |

### Shopify Integration Endpoints

| API | TYPE | Description | Body | Result |
|-----|------|-------------|------|--------|
| `/api/customer` | POST | Save Shopify store details | ```json { "id": "8c13a1b0-2499...", "shop_domain": "practice.myshopify.com", "shopify_access_token": "shpat_xxx" }``` | ```json { "status": "success" }``` |
| `/api/shopify/auth` | GET | Initiate OAuth flow | `?customer_id={customerId}` | Redirect to Shopify OAuth |
| `/api/shopify/callback` | GET | Handle OAuth return | `?code={auth_code}&shop={shop}` | ```json { "access_token": "xxx", "shop_domain": "xxx" }``` |
| `/api/shopify/sync-products` | POST | Sync catalog to Shopify | ```json { "customer_id": "8c13a1b0-2499...", "sync_type": "full" }``` | ```json { "synced_count": 45, "errors": [] }``` |

---

## 🌐 Business Main Website → Portal Entry

### Customer Journey

Prospective medical practices discover Web3 Diagnostics through our marketing website where they learn about our automated lab testing integration solution. After understanding the value proposition, they transition to our portal application to begin their onboarding journey.

### Frontend Implementation

| Component | Location | Description | Backend Integration |
|-----------|----------|-------------|---------------------|
| Marketing Website | `web3diagnostics.com` | Static marketing site with product information | None - static content |
| Portal Entry | `portal.web3diagnostics.com` | SPA entry point for authenticated users | Redirects to authentication |
| Navigation Flow | CTAs throughout site | "Get Started" buttons redirect to portal | `window.location.href = '/portal/login'` |

**Note**: No API calls at this stage - purely informational and navigational.

---

## 🔐 Sign Up / Sign In to Web3 Application

### Customer Journey

New practices create accounts using email/password, verify their email, and receive their unique customer ID for all future operations. **Note to Tim**: Frontend is fully prepared for Cognito integration with debug mode implemented for testing while authentication development continues.

### API Integration Table

| API | TYPE | Frontend Usage | Request Body | Expected Response |
|-----|------|----------------|--------------|-------------------|
| `/api/auth/signup` | POST | New user registration | ```json
{
  "email": "doctor@practice.com",
  "password": "securePass123",
  "first_name": "Sarah",
  "last_name": "Johnson"
}``` | ```json
{
  "success": true,
  "message": "Verification email sent"
}``` |
| `/api/auth/login` | POST | User authentication | ```json
{
  "email": "doctor@practice.com",
  "password": "securePass123"
}``` | ```json
{
  "token": "jwt_token_here",
  "customer_id": "8c13a1b0-2499...",
  "email": "doctor@practice.com",
  "first_login": true
}``` |
| `/api/auth/verify` | POST | Email verification | ```json
{
  "token": "verification_token",
  "code": "123456"
}``` | ```json
{
  "success": true,
  "customer_id": "8c13a1b0-2499..."
}``` |

### Frontend Services

* **Components**: `/src/auth/components/SignupForm/`, `/src/auth/components/LoginForm/`
* **State Management**: JWT stored in localStorage, customer_id globally available
* **Route Protection**: AuthGuard validates authentication before portal access
* **Debug Mode**: `DebugToggle.enableDemoCustomer()` simulates authenticated state with demo customer_id

---

## 👤 Client Profile Management

### Customer Journey

First-time users must complete their professional profile before accessing other features. This mandatory step ensures we have all required healthcare compliance information including NPI numbers and practice details.

### API Integration Table

| API | TYPE | Frontend Usage | Request Body | Expected Response |
|-----|------|----------------|--------------|-------------------|
| `/api/customer` | GET | Load profile on login | N/A (uses auth token) | ```json
[{
  "id": "8c13a1b0-2499...",
  "practice_name": "Sunshine Medical",
  "first_name": "Sarah",
  "last_name": "Johnson",
  "npi": "1234567890",
  // ... all fields
}]``` |
| `/api/customer` | POST | Update profile information | ```json
{
  "id": "8c13a1b0-2499...",
  "practice_name": "Sunshine Medical",
  "address": "123 Medical Plaza",
  "city": "Austin",
  "state": "TX",
  "zip": "78701",
  "npi": "1234567890"
}``` | ```json
{
  "status": "success",
  "id": "8c13a1b0-2499..."
}``` |

### Frontend Implementation

* **Component**: `AccountManager.js` - Expandable profile form with validation
* **Service**: `CustomerApiService.updateCustomer()` - Centralized API communication
* **State**: `CustomerDataService` - Single source of truth for customer data
* **Validation**: Real-time NPI validation, required field enforcement

### Data Flow

```javascript
// User completes profile
const profileData = {
    id: customerId,  // From authentication
    practice_name: formData.practiceName,
    first_name: formData.firstName,
    // ... mapped fields
};

await CustomerApiService.updateCustomer(customerId, profileData);
```

---

## 🔑 Evexia Integration Setup

### Customer Journey

With profile complete, clinicians connect their Evexia account by providing their Web3-associated API key (External Client ID) obtained from Evexia. This special API key links their Evexia account to Web3's parent account, enabling Web3 to process orders with markup. Visual guides show exactly where to find this API key in their Evexia dashboard.

### Business Context

Web3 Diagnostics provides integration-as-a-service between medical practices and Evexia's lab aggregation platform. To use Web3's automated e-commerce solution, clinicians must:
1. Obtain a specific API key from Evexia that is associated with Web3
2. This establishes Web3 as a parent account for order processing
3. Web3 validates the API key to ensure only authorized tests are displayed at correct Evexia pricing
4. Web3 can then add markup to create the clinician's retail pricing

### API Integration Table

| API | TYPE | Frontend Usage | Request Body | Expected Response |
|-----|------|----------------|--------------|-------------------|
| `/api/customer` | POST | Save External Client ID | ```json
{
  "id": "8c13a1b0-2499...",
  "client_id": "BCAD601C-EBA4..."
}``` | ```json
{
  "status": "success"
}``` |
| `/api/evexia/validate-client-id` | POST | Validate Evexia API key | ```json
{
  "external_client_id": "BCAD601C-EBA4...",
  "customer_id": "8c13a1b0-2499..."
}``` | ```json
{
  "valid": true,
  "available_tests": 156
}``` |

### Frontend Components

* **Visual Guide**: Step-by-step screenshots showing where to find Web3-associated API key in Evexia
* **Validation**: UUID format check + API validation with Evexia
* **Connection Status**: Real-time feedback showing authorized test count from Evexia
* **State Update**: Unlocks lab discovery features with Evexia-authorized tests only

---

## 🔬 Lab Discovery & Test Selection

### Customer Journey

Healthcare providers explore available lab tests/panels from their Evexia account, using search and filters to find specific tests. They build their custom catalog by selecting tests to offer through their practice. All displayed tests are validated through their Evexia API key to ensure they only see authorized tests at correct Evexia pricing.

### API Integration Table

| API | TYPE | Frontend Usage | Query Parameters | Response Structure |
|-----|------|----------------|------------------|-------------------|
| `/api/test` | GET | Load available tests | `?client_id={customerId}&limit=100` | ```json
{
  "tests": [{
    "sku": "EVT-813",
    "name": "Vitamin D Test",
    "cpt_code": "82306",
    "cost": "45.00",
    "lab": "LabCorp"
  }],
  "last_key": {"id": "813"}
}``` |
| `/api/panel` | GET | Load test panels | `?client_id={customerId}&limit=100` | ```json
{
  "panels": [{
    "sku": "EVP-3251",
    "name": "Complete Hormone Panel",
    "cost": "453.70",
    "tests": [...]
  }],
  "last_key": {"id": "3251"}
}``` |
| `/api/clinician_sync` | GET | Get synced items | `?client_id={customerId}` | ```json
{
  "panels": [{
    "sku": "EVT-813",
    "price": 58.50,
    "created_at": "2025-06-01..."
  }]
}``` |
| `/api/clinician_sync` | POST | Add test to catalog | Body: ```json
{
  "customer_id": "8c13a1b0-2499...",
  "action": "add",
  "sku": {
    "sku": "EVT-813",
    "price": null
  }
}``` | ```json
{
  "status": "success"
}``` |

### Frontend Features

* **Search**: By name, CPT code, or SKU
* **Filters**: Lab provider, category, price range
* **Bulk Operations**: Selection basket for multiple items
* **Performance**: Virtual scrolling for 2000+ items
* **Caching**: IndexedDB for offline access

### Implementation Details

```javascript
// Search implementation
const results = tests.filter(test => 
    test.name.toLowerCase().includes(searchTerm) ||
    test.cpt_code.includes(searchTerm)
);

// Bulk sync operation
for (const sku of selectedTests) {
    await ClinicianSyncService.addSyncItem(customerId, {
        sku: sku,
        price: null  // Set in pricing step
    });
}
```

---

## 💰 Sync Management & Pricing

### Customer Journey

Practices manage their synchronized catalog, setting retail prices using our intelligent pricing calculator. Real-time margin calculations help optimize profitability while remaining competitive. The markup is applied on top of Evexia's wholesale pricing to create the practice's retail pricing.

### API Integration Table

| API | TYPE | Frontend Usage | Request/Response | Notes |
|-----|------|----------------|------------------|-------|
| `/api/clinician_sync` | GET | Load synced catalog | Query: `?client_id={customerId}` | Returns items with Evexia costs |
| `/api/clinician_sync` | POST | Update pricing | ```json
{
  "customer_id": "8c13a1b0-2499...",
  "action": "add",
  "sku": {
    "sku": "EVT-813",
    "price": 65.00
  }
}``` | Same endpoint for add/update |
| `/api/clinician_sync` | DELETE | Remove from catalog | ```json
{
  "customer_id": "8c13a1b0-2499...",
  "sku": {
    "sku": "EVT-813"
  }
}``` | Removes test from sync |

### Pricing Features

* **Markup Calculator**: `(price - cost) / cost * 100`
* **Margin Calculator**: `(price - cost) / price * 100`
* **Bulk Operations**: Apply markup to entire catalog
* **Rounding Tools**: Round to nearest $5 or $10
* **Export/Import**: CSV for external editing

### Frontend Calculations

```javascript
// All calculations done locally
const calculateMarkup = (cost, price) => ((price - cost) / cost * 100).toFixed(2);
const calculateMargin = (cost, price) => ((price - cost) / price * 100).toFixed(2);

// Apply 30% markup
const newPrice = cost * 1.30;
await ClinicianSyncService.updatePrice(customerId, { sku, price: newPrice });
```

---

## 🛒 Shopify Store Integration

### Customer Journey

Final step connects the Web3 catalog to user's Shopify store. OAuth authentication establishes secure connection, then automated sync maintains product catalog and pricing.

### API Integration Table

| API | TYPE | Frontend Usage | Flow Description | Status |
|-----|------|----------------|------------------|--------|
| `/api/customer` | POST | Save store details | ```json
{
  "id": "8c13a1b0-2499...",
  "shop_domain": "practice.myshopify.com",
  "shopify_access_token": "shpat_xxx"
}``` | ✅ Frontend Ready |
| `/api/shopify/auth` | GET | Initiate OAuth | `?customer_id={customerId}` → Shopify OAuth | ⏳ Awaiting Backend |
| `/api/shopify/callback` | GET | Handle OAuth return | Receives auth code from Shopify | ⏳ Awaiting Backend |
| `/api/shopify/sync-products` | POST | Sync catalog | ```json
{
  "customer_id": "8c13a1b0-2499...",
  "sync_type": "full"
}``` | ⏳ Awaiting Backend |

### Frontend Components Ready

* **ShopifyConnector**: OAuth flow UI
* **SyncStatus**: Real-time sync monitoring
* **AutomationRules**: Sync scheduling configuration

---

## 🏗️ Technical Architecture

### Service Layer Design

```
Frontend Services Architecture:
┌─────────────────────────────────────────┐
│          CustomerDataService            │ ← Single Source of Truth
├─────────────────────────────────────────┤
│ - Customer Profile Data                 │
│ - Evexia Client ID (API Key)           │
│ - Authentication State                  │
│ - Global State Management               │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┬────────────────┐
    │                     │                 │
┌───▼──────────┐ ┌───────▼──────┐ ┌────────▼────────┐
│CustomerApiSvc│ │ClinicianSync │ │EvexiaApiService │
│   /customer  │ │   Service    │ │  /evexia/*      │
└──────────────┘ └──────────────┘ └─────────────────┘
```

### Critical Parameter Convention

**⚠️ IMPORTANT**: Different parameter names for GET vs POST

```javascript
// GET Requests - Use 'client_id'
GET /api/clinician_sync?client_id={customerId}
GET /api/test?client_id={customerId}
GET /api/panel?client_id={customerId}

// POST Requests - Use 'customer_id' in body
POST /api/clinician_sync
Body: { "customer_id": "{customerId}", ... }
```

**Note**: `client_id` in query parameters refers to the Web3 customer ID, not the Evexia API key

---

## 📊 Implementation Status Dashboard

| Feature | Frontend | Backend API | Integration | Notes |
|---------|----------|-------------|-------------|-------|
| **Authentication** | ✅ Complete | ⏳ Cognito Pending | 🔄 Using Debug Mode | Ready for Cognito |
| **Customer Profile** | ✅ Complete | ✅ Complete | ✅ **WORKING** | Full integration |
| **Evexia API Key Setup** | ✅ Complete | ⏳ Validation Pending | 🔄 Partial | Need validation endpoint |
| **Lab Discovery** | ✅ Complete | ✅ Complete | ✅ **WORKING** | Shows Evexia-authorized tests |
| **Test Sync** | ✅ Complete | ✅ Complete | ✅ **WORKING** | Full functionality |
| **Pricing** | ✅ Complete | ✅ Complete | ✅ **WORKING** | Markup on Evexia costs |
| **Shopify** | ✅ UI Ready | ⏳ OAuth Pending | ⏳ Waiting | Frontend prepared |

---

## 🔧 Development Tools & Testing

### Debug Toggle System

Available in development environment for testing without authentication:

```javascript
// Enable debug modes
DebugToggle.enableMockData();      // UI testing with fake data
DebugToggle.enableDemoCustomer();  // Real APIs with demo ID

// Demo Customer ID: 8c13a1b0-2499-40a8-9a91-43ea75b2a327
```

### Frontend Testing Scripts

```javascript
// Run in browser console
TestCustomerEndpoint.runAllTests();  // Customer API tests
TestClientIdFix.testAllEndpoints();  // Parameter naming tests
```

---

## 🚨 Issues Resolved & Pending

### ✅ Resolved Issues

1. **Parameter Naming Mismatch**
   * **Issue**: Frontend sent `customer_id`, backend expected `client_id` for GET requests
   * **Solution**: Updated all GET requests to use `client_id` parameter
   * **Result**: 500 errors resolved, APIs working
   * **Note**: `client_id` in queries refers to Web3 customer ID, not Evexia API key

### ⏳ Pending Backend Requirements

1. **Lambda Parameter Extraction**
   ```javascript
   // Current (broken)
   const customer_id = event.customer_id; // undefined
   
   // Needed
   const customer_id = event.queryStringParameters?.customer_id || 
                      JSON.parse(event.body || '{}').customer_id;
   ```

2. **Cognito Integration**
   * Need customer_id immediately after authentication
   * Clarify customer record creation flow

3. **Shopify OAuth Implementation**
   * Frontend ready with UI components
   * Awaiting OAuth endpoint implementation

---

## 📈 Performance Considerations

### Current Implementations

* **Test Loading**: Currently loads all 2000+ tests at once
* **Caching**: IndexedDB reduces API calls
* **Virtual Scrolling**: Handles large datasets in UI

### Recommendations

* Consider pagination for `/api/test` and `/api/panel`
* Implement cursor-based pagination for better performance
* Add response caching headers for static data

---

## 🎯 Next Steps

### Immediate Priorities

1. ✅ **Fix Lambda functions** to extract customer_id from query parameters
2. 🔄 **Complete Cognito integration** for production authentication
3. 📋 **Implement Shopify OAuth** for store connections

### Frontend Ready For

* Real user testing with production authentication
* Shopify integration as soon as OAuth is available
* Performance optimization based on real usage data

---

*Document Version: 1.0*  
*Last Updated: Current Date*  
*Frontend Lead: Nick Rose*