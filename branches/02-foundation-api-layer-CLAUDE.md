# CLAUDE.md - Foundation API Layer
Version: 1.0
Last Updated: December 6, 2024
Branch: 02-foundation/api-layer
Previous Session: Initial Creation
Next Session Planning: Implement general-purpose API client

## 🤖 CRITICAL: Read This First
**STOP** - Before doing ANYTHING:
1. Verify you're on the correct branch: `git branch --show-current`
2. Check if dependencies are merged: `git branch --merged main | grep "01-foundation"`
3. Read the **Current State** section to understand what's already done
4. If anything is unclear, ASK FOR CLARIFICATION before proceeding

## 🎯 Branch Mission Statement
**In one sentence:** Create a robust, reusable API communication layer with proper error handling, authentication, and service abstractions.
**Success looks like:** All API calls go through a centralized client with consistent error handling, retry logic, and authentication.
**Failure looks like:** Scattered fetch() calls, inconsistent error handling, auth tokens manually added everywhere.

## 🧠 Essential Context You Need

### What You're Building
This branch establishes the API communication foundation for the entire Cascade platform. You're creating the layer that handles all HTTP communication with external services, including our backend, Evexia's API, and eventually Shopify's API. This is critical infrastructure that ensures consistent behavior across all network requests.

The API layer consists of three main components: First, a centralized API client that wraps fetch() with common functionality like authentication headers, error transformation, and retry logic. Second, service abstractions that provide clean interfaces for specific API domains (customers, auth, labs, etc.). Third, error handling patterns that transform network and API errors into consistent, actionable error objects that the UI can handle gracefully.

Currently, only a customer-specific API service exists (`customerApiService.js`). Your job is to extract the common patterns, create a general-purpose API client, and establish patterns that all future API integrations will follow. This prevents each feature from implementing its own error handling, retry logic, and auth token management.

### Your Boundaries
**You ARE responsible for:**
- Creating a general-purpose `apiClient` service
- Implementing common error handling patterns
- Setting up authentication header injection
- Creating retry logic for failed requests
- Establishing service abstraction patterns
- Webhook endpoint structure (for future use)
- Request/response interceptors

**You are NOT responsible for:**
- UI components for loading/error states (branch 01)
- State management of API responses (branch 03)
- Actual authentication flow (branch 04)
- Feature-specific API endpoints
- Third-party API integrations (Evexia, Shopify)

### Customer Journey Context
```
Previous Step: User clicks action in UI (branch 01) → 
YOUR STEP: API client handles request/response/errors → 
Next Step: State management updates app state (branch 03)
```

## 📊 Current State & Progress

### Already Completed
- [x] Customer API service exists at `/src/portal/shared/services/customerApiService.js`
- [x] Basic error handling in customer service
- [x] Auth token management pattern established
- [ ] General-purpose API client
- [ ] Centralized error handling
- [ ] Retry logic implementation
- [ ] Request/response interceptors
- [ ] Webhook handling utilities

### Active Work Item
**Currently Working On:** Initial documentation and analysis
**Files Being Modified:** None currently
**Blocker/Issue:** Need to extract patterns from existing customerApiService

### Session History
```
Session 1 (Dec 6, 2024): Created initial CLAUDE.md, analyzed existing patterns
```

## 🔗 Dependencies & Integration Points

### Incoming Dependencies (What I Need)
```javascript
// From 01-foundation/core-setup
// Note: These may not exist yet - document what we expect
import { showErrorToast, showSuccessToast } from '@/shared/components/ui/toast';
// Expected: Toast system for user notifications

// From browser/environment
// localStorage for token storage
// fetch API for HTTP requests
```

### Outgoing Contracts (What I Provide)
```javascript
// Main API Client - will be available at /src/shared/services/api/apiClient.js
export const apiClient = {
  // Core methods
  get: (url, options) => Promise<Response>,
  post: (url, data, options) => Promise<Response>,
  put: (url, data, options) => Promise<Response>,
  delete: (url, options) => Promise<Response>,
  patch: (url, data, options) => Promise<Response>,
  
  // Configuration
  setBaseURL: (url) => void,
  setDefaultHeaders: (headers) => void,
  
  // Interceptors
  addRequestInterceptor: (interceptor) => void,
  addResponseInterceptor: (interceptor) => void,
  
  // Error handling
  handleError: (error) => FormattedError,
};

// Error Types - available at /src/shared/services/api/errors.js
export class APIError extends Error {
  constructor(message, code, status, details) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class NetworkError extends APIError {
  constructor(message) {
    super(message, 'NETWORK_ERROR', 0);
  }
}

export class ValidationError extends APIError {
  constructor(errors) {
    super('Validation failed', 'VALIDATION_ERROR', 400, errors);
  }
}

export class AuthenticationError extends APIError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
  }
}

// Service Base Class - pattern for feature services
export class BaseAPIService {
  constructor(basePath) {
    this.basePath = basePath;
  }
  
  async request(method, path, options) {
    try {
      return await apiClient[method](`${this.basePath}${path}`, options);
    } catch (error) {
      throw apiClient.handleError(error);
    }
  }
}

// Webhook utilities - for backend webhook endpoints
export const webhookUtils = {
  verifySignature: (payload, signature, secret) => boolean,
  parseWebhookBody: (body) => object,
  createWebhookResponse: (status, data) => Response,
};
```

### Integration Checklist
- [ ] API client works with existing auth token pattern
- [ ] Error types match what UI expects to handle
- [ ] Service pattern compatible with customerApiService
- [ ] Interceptors can add auth headers automatically
- [ ] Webhook utilities ready for Shopify integration

## 📁 File Map & Code Patterns

### Critical Files for This Branch
```
src/
├── shared/
│   └── services/
│       └── api/
│           ├── apiClient.js         # Main API client
│           ├── errors.js            # Error classes
│           ├── interceptors.js      # Request/response interceptors
│           ├── retry.js             # Retry logic
│           └── index.js             # Public exports
├── portal/
│   └── shared/
│       └── services/
│           └── customerApiService.js # Existing - refactor to use apiClient
└── api/
    └── webhooks/
        └── utils.js                 # Webhook handling utilities
```

### Code Patterns to Follow
```javascript
// PATTERN 1: API Client (based on customerApiService patterns)
const APIClient = (function() {
  'use strict';
  
  let baseURL = window.CONFIG?.API_BASE_URL || '/api';
  let defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  const requestInterceptors = [];
  const responseInterceptors = [];
  
  // Add auth token to requests
  requestInterceptors.push((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });
  
  // Core request method
  async function request(method, url, data, options = {}) {
    let config = {
      method,
      headers: { ...defaultHeaders, ...options.headers },
      ...options
    };
    
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      config.body = JSON.stringify(data);
    }
    
    // Run request interceptors
    for (const interceptor of requestInterceptors) {
      config = await interceptor(config);
    }
    
    try {
      const response = await fetch(`${baseURL}${url}`, config);
      
      // Run response interceptors
      let processedResponse = response;
      for (const interceptor of responseInterceptors) {
        processedResponse = await interceptor(processedResponse);
      }
      
      if (!processedResponse.ok) {
        throw await createErrorFromResponse(processedResponse);
      }
      
      return await processedResponse.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      // Network error
      throw new NetworkError(error.message);
    }
  }
  
  // Public methods
  const get = (url, options) => request('GET', url, null, options);
  const post = (url, data, options) => request('POST', url, data, options);
  const put = (url, data, options) => request('PUT', url, data, options);
  const patch = (url, data, options) => request('PATCH', url, data, options);
  const del = (url, options) => request('DELETE', url, null, options);
  
  return {
    get,
    post,
    put,
    patch,
    delete: del,
    setBaseURL: (url) => { baseURL = url; },
    addRequestInterceptor: (fn) => requestInterceptors.push(fn),
    addResponseInterceptor: (fn) => responseInterceptors.push(fn),
    handleError: formatError,
  };
})();

// PATTERN 2: Error Handling (class-based for better stack traces)
class APIError extends Error {
  constructor(message, code, status, details = {}) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

async function createErrorFromResponse(response) {
  let errorData;
  try {
    errorData = await response.json();
  } catch {
    errorData = { message: response.statusText };
  }
  
  switch (response.status) {
    case 400:
      return new ValidationError(errorData.errors || {});
    case 401:
      return new AuthenticationError(errorData.message);
    case 403:
      return new AuthorizationError(errorData.message);
    case 404:
      return new NotFoundError(errorData.message);
    case 429:
      return new RateLimitError(errorData.retryAfter);
    case 500:
    case 502:
    case 503:
      return new ServerError(errorData.message);
    default:
      return new APIError(
        errorData.message || 'An error occurred',
        errorData.code || 'UNKNOWN_ERROR',
        response.status,
        errorData
      );
  }
}

// PATTERN 3: Service Abstraction (following existing customerApiService)
const CustomerService = (function() {
  'use strict';
  
  const basePath = '/customers';
  
  return {
    async getProfile() {
      try {
        return await apiClient.get(`${basePath}/profile`);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        throw apiClient.handleError(error);
      }
    },
    
    async updateProfile(updates) {
      try {
        return await apiClient.put(`${basePath}/profile`, updates);
      } catch (error) {
        console.error('Failed to update profile:', error);
        throw apiClient.handleError(error);
      }
    },
    
    async searchCustomers(query) {
      try {
        return await apiClient.get(`${basePath}/search`, {
          params: { q: query }
        });
      } catch (error) {
        console.error('Failed to search customers:', error);
        throw apiClient.handleError(error);
      }
    }
  };
})();

// PATTERN 4: Retry Logic with Exponential Backoff
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Don't retry client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      const waitTime = delay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}
```

### Naming Conventions
- Services: `PascalCase` with `Service` suffix (e.g., `CustomerService`)
- Error classes: `PascalCase` with `Error` suffix (e.g., `ValidationError`)
- API methods: `camelCase` verbs (e.g., `getProfile`, `updateSettings`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_TIMEOUT`)

## 🧪 Testing Strategy

### Test Coverage Requirements
- [ ] Unit tests for all API client methods
- [ ] Error handling for all HTTP status codes
- [ ] Interceptor chain testing
- [ ] Retry logic with various scenarios
- [ ] Mock service testing patterns

### Test Commands
```bash
# Run API layer tests
npm test -- --testPathPattern="api|service"

# Test with mock server
npm test:api -- --mock

# Test error scenarios
npm test -- --testNamePattern="error handling"
```

### Critical Test Scenarios
1. **Authentication Flow**: Token added to requests automatically
2. **Error Transformation**: HTTP errors become proper error objects
3. **Retry Logic**: Retries on 5xx, not on 4xx
4. **Interceptors**: Request/response interceptors run in order
5. **Network Failures**: Handles offline/timeout gracefully

## 🚨 Known Issues & Gotchas

### Current Blockers
- **Issue**: No standardized API client exists
  - **Impact**: Each service implements its own patterns
  - **Workaround**: Use customerApiService as template
  - **Needs**: Extract common functionality

### Common Pitfalls
1. **Don't**: Store API keys in frontend code
   **Do**: Use environment variables and backend proxy

2. **Don't**: Retry on client errors (4xx)
   **Do**: Only retry on server errors (5xx) and network failures

3. **Don't**: Expose raw fetch errors to UI
   **Do**: Transform to user-friendly error messages

### Technical Debt
- [ ] Migrate customerApiService to use new apiClient
- [ ] Add request caching for GET requests
- [ ] Implement request deduplication
- [ ] Add request/response logging for debugging

## 🔄 Integration Testing

### Pre-Integration Checklist
- [ ] API client can make all HTTP methods
- [ ] Auth token properly injected
- [ ] Errors properly transformed
- [ ] Works with existing services
- [ ] No breaking changes to customerApiService

### Integration Test Plan
```bash
# 1. Checkout this branch and dependency
git checkout 02-foundation/api-layer
git merge origin/01-foundation/core-setup

# 2. Run API tests
npm test -- --testPathPattern="api"

# 3. Test with real backend
# Start backend server
npm run backend:dev

# Run integration tests
npm test:integration -- --group=api

# 4. Manual testing
# - Make API calls through console
# - Verify auth headers added
# - Test error scenarios
# - Check retry behavior
```

## 📈 Performance Considerations

### Bundle Size Impact
- API client core: ~10KB
- Error classes: ~5KB
- Interceptors: ~3KB
- Total impact: ~18KB

### Runtime Performance
- Request overhead: < 5ms
- Interceptor chain: < 2ms per interceptor
- Error transformation: < 1ms
- Memory: Minimal, no request queuing

### Optimization Strategies
- Lazy load error classes
- Tree-shake unused HTTP methods
- Implement request caching
- Add request deduplication

## 🔐 Security Checklist
- [ ] Never log sensitive data (tokens, passwords)
- [ ] Validate all inputs before sending
- [ ] Use HTTPS for all requests
- [ ] Implement CSRF protection
- [ ] Add rate limiting awareness
- [ ] Sanitize error messages shown to users

## 📝 Decisions & Rationale

### Key Decisions Made
1. **Decision**: Use class-based errors over plain objects
   - **Why**: Better stack traces, instanceof checks
   - **Trade-offs**: Slightly larger bundle size
   - **Benefits**: Easier debugging, type safety

2. **Decision**: IIFE pattern over ES modules
   - **Why**: Consistent with existing codebase
   - **Trade-offs**: No tree-shaking
   - **Benefits**: Works everywhere, no build issues

3. **Decision**: Separate error types for each scenario
   - **Why**: Specific handling in UI
   - **Trade-offs**: More classes to maintain
   - **Benefits**: Clear error handling paths

### Open Questions
- [ ] Should we add request caching?
- [ ] Do we need request/response logging?
- [ ] How should we handle API versioning?
- [ ] Should we support GraphQL in addition to REST?

## 🚀 Ready for PR Checklist

### Code Quality
- [ ] All API methods tested
- [ ] Error scenarios covered
- [ ] JSDoc comments on public methods
- [ ] No console.log statements

### Documentation
- [ ] API client usage examples
- [ ] Error handling guide
- [ ] Service creation template
- [ ] Migration guide for existing services

### Manual Testing
- [ ] Test with real backend
- [ ] Verify auth flow works
- [ ] Check error handling
- [ ] Test retry logic
- [ ] Verify no breaking changes

### Cleanup
- [ ] Remove debug code
- [ ] Clean up test data
- [ ] Update .env.example
- [ ] No hardcoded URLs

## 🔮 Future Considerations

### Next Steps After This Branch
1. State management will use this for data fetching
2. Auth system will use for login/logout
3. Feature services will extend base patterns

### Potential Enhancements
- WebSocket support for real-time updates
- Request caching layer
- Offline support with service worker
- GraphQL client option
- Request performance monitoring

## 📚 Resources & References

### External Documentation
- [Fetch API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [HTTP Status Codes](https://httpstatuses.com/)
- [API Design Best Practices](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)

### Related Files in Other Repos
- Error handling: Similar patterns in enterprise apps
- Interceptors: Axios-like interceptor pattern
- Service pattern: Repository pattern inspiration

### Code to Potentially Reuse
```javascript
// From customerApiService.js - Token management
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Pattern for specific error handling
const handleAuthError = (error) => {
  if (error.status === 401) {
    // Clear token and redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  throw error;
};
```

## 🆘 When You're Stuck

### Who to Ask
- **API design questions**: Check REST best practices
- **Error patterns**: Look at customerApiService.js
- **Integration issues**: Test with actual backend

### Common Issues & Solutions
1. **Problem**: CORS errors in development
   **Solution**: Use proxy configuration in dev server

2. **Problem**: Token not being sent
   **Solution**: Check interceptor order, localStorage key

3. **Problem**: Errors not caught properly
   **Solution**: Ensure async/await used correctly

### Emergency Rollback
```bash
# If something goes wrong:
git stash
git checkout main
git branch -D 02-foundation/api-layer
git checkout -b 02-foundation/api-layer
```

---

## 🤖 AI Session Notes

### Session Start Checklist
- [ ] Read entire CLAUDE.md
- [ ] Review customerApiService.js patterns
- [ ] Check if backend is available for testing
- [ ] Understand auth token flow

### Session End Checklist  
- [ ] Update "Current State" section
- [ ] Document API client methods created
- [ ] List any integration issues found
- [ ] Update error types if added
- [ ] Commit with clear message

### Inter-Session Communication
**For Next Session**: Need to implement the actual apiClient
**Discovered Issues**: Only customer service exists currently
**Time Estimate**: 2-3 sessions to complete all components