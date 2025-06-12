# Portal Utils - Demo Service

## Overview

The `demoService.js` file provides a temporary mock implementation for API functions to enable full functionality during development. This service uses localStorage to persist data and simulates API response times.

## Production Replacement Guide

When ready to implement real backend APIs, follow these steps:

### 1. Replace Demo Service Import

Remove the demo service import from HTML files:
```html
<!-- Remove this line -->
<script src="../utils/demoService.js"></script>
```

### 2. Create Production API Service

Create `productionService.js` with real API endpoints:

```javascript
window.ProductionService = (function() {
    'use strict';
    
    const API_BASE_URL = 'https://your-api-domain.com/api';
    
    async function saveExternalClientId(clientId) {
        const response = await fetch(`${API_BASE_URL}/clinician/evexia-config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ external_client_id: clientId })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save External Client ID');
        }
        
        return await response.json();
    }
    
    // ... implement other functions
    
    return {
        saveExternalClientId,
        validateEvexiaConnection,
        syncTestMenu,
        getSetupStatus,
        saveSelectedTests,
        isDemoMode: () => false
    };
})();

window.API = window.ProductionService;
```

### 3. API Endpoints to Implement

#### Required Backend Endpoints:

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `saveExternalClientId` | POST | `/api/clinician/evexia-config` | Save Evexia API key |
| `validateEvexiaConnection` | POST | `/api/clinician/evexia-validate` | Validate connection to Evexia |
| `syncTestMenu` | POST | `/api/clinician/sync-test-menu` | Import tests from Evexia |
| `getSetupStatus` | GET | `/api/clinician/setup-status` | Get current setup progress |
| `saveSelectedTests` | POST | `/api/clinician/selected-tests` | Save test selections |

#### Request/Response Examples:

**Save External Client ID**
```javascript
// Request
POST /api/clinician/evexia-config
{
  "external_client_id": "d44c20b7-be8a-473a-83fe-1d341530cdb0"
}

// Response
{
  "success": true,
  "message": "External Client ID saved successfully",
  "data": {
    "clientId": "d44c20b7-be8a-473a-83fe-1d341530cdb0",
    "status": "saved"
  }
}
```

**Validate Evexia Connection**
```javascript
// Request
POST /api/clinician/evexia-validate
{
  "external_client_id": "d44c20b7-be8a-473a-83fe-1d341530cdb0"
}

// Response
{
  "success": true,
  "message": "Evexia connection validated successfully",
  "data": {
    "status": "validated",
    "testCount": 2247,
    "lastValidated": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Database Schema Requirements

#### Clinician Accounts Table:
```sql
CREATE TABLE clinician_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    external_client_id UUID,
    licensed_states TEXT[],
    in_office_draws BOOLEAN DEFAULT false,
    evexia_connection_status VARCHAR(50) DEFAULT 'not_connected',
    test_menu_sync_status VARCHAR(50) DEFAULT 'not_synced',
    shopify_sync_status VARCHAR(50) DEFAULT 'not_connected',
    last_sync_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Test Menu Table:
```sql
CREATE TABLE test_menu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinician_id UUID REFERENCES clinician_accounts(id),
    evexia_test_id VARCHAR(255),
    test_name VARCHAR(255),
    category VARCHAR(255),
    price DECIMAL(10,2),
    description TEXT,
    sample_type VARCHAR(100),
    is_selected BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Environment Configuration

Update your environment configuration to disable demo mode:

```javascript
// In environment.js
const config = {
    DEMO_MODE: false,
    API_BASE_URL: 'https://your-api-domain.com/api',
    // ... other config
};
```

### 6. Error Handling

Implement proper error handling for network requests:

```javascript
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, options);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
```

### 7. Authentication

Add proper authentication headers:

```javascript
function getAuthHeaders() {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}
```

## Demo Data Management

### Current Demo Data Structure:
```javascript
{
    clinicianId: 'demo-user-001',
    externalClientId: null,
    evexiaConnectionStatus: 'not_connected',
    testMenuSyncStatus: 'not_synced',
    shopifySyncStatus: 'not_connected',
    lastSyncDate: null,
    selectedTests: [],
    setupProgress: {
        evexia_client_id: false,
        evexia_validation: false,
        test_menu_sync: false,
        shopify_setup: false
    }
}
```

### Reset Demo Data:
```javascript
// In browser console
window.API.resetDemoData();
```

## Testing

When transitioning to production APIs:

1. Test each endpoint individually
2. Verify error handling for network failures
3. Test authentication flow
4. Confirm data persistence
5. Test concurrent requests
6. Validate response formats match demo expectations

## Migration Checklist

- [ ] Backend API endpoints implemented
- [ ] Database schema created
- [ ] Authentication system integrated
- [ ] Error handling implemented
- [ ] Production service file created
- [ ] Demo service imports removed
- [ ] Environment configuration updated
- [ ] Testing completed
- [ ] Error monitoring setup
- [ ] Performance monitoring setup

## Support

For questions about the demo service or production migration, refer to the development documentation or contact the development team.