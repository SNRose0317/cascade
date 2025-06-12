# CLAUDE.md - API Service Layer
Version: 1.0
Last Updated: December 6, 2024
Directory: /src/shared/services/api/
Branch: 02-foundation/api-layer
Purpose: Centralized API communication layer

## 📁 Service Overview
This directory contains the core API client and related utilities for making HTTP requests throughout the application.

## 🎯 Files to Create

### `apiClient.js`
Main API client that wraps fetch() with:
- Automatic auth token injection
- Error transformation
- Retry logic
- Request/response interceptors

### `errors.js`
Standardized error classes:
- `APIError` - Base error class
- `NetworkError` - Network failures
- `ValidationError` - 400 errors with field errors
- `AuthenticationError` - 401 errors
- `AuthorizationError` - 403 errors
- `NotFoundError` - 404 errors
- `ServerError` - 5xx errors

### `interceptors.js`
Request and response interceptor management:
- Auth header injection
- Error transformation
- Logging capabilities

### `retry.js`
Retry logic for failed requests:
- Exponential backoff
- Configurable retry count
- Skip retry for 4xx errors

## 🔧 Usage Pattern

```javascript
// Import the API client
const { apiClient } = window.APIServices;

// Make requests
try {
  const data = await apiClient.get('/customers/profile');
  console.log(data);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
  } else if (error instanceof NetworkError) {
    // Handle network errors
  }
}
```

## 🔗 Integration Points
- Used by all feature services
- Integrates with auth state for tokens
- Works with CustomerDataService for data fetching

## ⚠️ Important Notes
- Never store sensitive data in the client
- All requests should go through this client
- Maintain backwards compatibility with customerApiService
- Test with various network conditions