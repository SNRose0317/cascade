# Authentication System

The authentication system provides secure user authentication and authorization for the Web3 Diagnostics platform.

## Overview

The auth system handles:
- User login and signup
- Password management (forgot/reset)
- Authentication state management
- Role-based access control
- Profile management
- Integration with AWS Cognito (planned)

## Directory Structure

```
src/auth/
├── auth-system.js          # Main authentication system (modal, forms, state)
├── api/                    # API services (Cognito-ready)
│   ├── authService.js      # Authentication API calls
│   ├── authState.js        # Auth state management
│   └── authValidation.js   # Form validation utilities
├── components/             # UI components
│   ├── ClinicianSignupForm.js  # Extended signup form
│   ├── ProfileDropdown.js      # User profile dropdown
│   ├── ProfileSettings.js      # Profile settings component
│   ├── ForgotPassword.js       # Password recovery
│   └── ResetPassword.js        # Password reset
├── guards/                 # Access control
│   ├── authGuard.js        # Authentication checks
│   └── roleGuard.js        # Role-based permissions
└── styles/                 # CSS styles
    ├── auth.css            # Main auth styles
    └── clinician-signup.css # Clinician form styles
```

## Quick Start

### Basic Usage

```javascript
// Check if user is authenticated
if (AuthGuard.isAuthenticated()) {
    // User is logged in
}

// Protect a page (add to page initialization)
AuthGuard.init(); // Redirects if not authenticated

// Check user role
if (RoleGuard.hasRole('clinician')) {
    // User is a clinician
}
```

### Show Auth Modal

```javascript
// Show login modal
AuthModal.show('login');

// Show signup modal
AuthModal.show('signup');
```

## Components

### auth-system.js

The main authentication system that includes:
- **AuthState**: Manages authentication state and body classes
- **AuthModal**: Handles login/signup modal display
- **AuthEventHandler**: Manages auth-related DOM events

### API Services

#### authService.js
Handles all authentication API calls:
- `login(email, password)` - User login
- `register(userData)` - User registration
- `logout()` - User logout
- `forgotPassword(email)` - Password recovery
- `resetPassword(token, password)` - Password reset
- `updateProfile(data)` - Profile updates

#### authState.js
Event-driven authentication state management:
- Emits events for login/logout
- Manages token storage
- Handles session validation

### Guards

#### authGuard.js
- `isAuthenticated()` - Check if user is logged in
- `requireAuth(redirectUrl)` - Enforce authentication
- `init()` - Initialize guard for current page

#### roleGuard.js
- `getUserRole()` - Get current user's role
- `hasRole(role)` - Check if user has specific role
- `requireRole(role, redirectUrl)` - Enforce role requirement
- `getPermissions()` - Get role-based permissions

## Authentication Flow

1. **Signup Flow**:
   - User clicks "Sign Up"
   - Enters name, email, password
   - Account created (will integrate with Cognito)
   - Customer record created with unique ID
   - Redirected to portal dashboard

2. **Login Flow**:
   - User clicks "Log In"
   - Enters email and password
   - Credentials validated
   - Token stored in localStorage
   - Redirected to intended page or dashboard

## Storage

The system uses localStorage for:
- `web3diagnostics_auth_token` - Authentication token
- `web3diagnostics_user_data` - User profile data
- `auth_redirect` - Post-login redirect URL

## Styling

The auth system uses a dark theme with:
- Background: Gradient from #1B2432 to #2A3544
- Primary color: #2A5CAA (blue)
- Smooth animations and transitions
- Responsive design

## Security Considerations

1. **Token Management**:
   - Tokens stored in localStorage
   - Planned: Implement token refresh mechanism
   - Planned: Add token expiration handling

2. **Password Requirements**:
   - Currently basic validation
   - Planned: Enforce strong password requirements

3. **HTTPS Only**:
   - All auth requests should use HTTPS in production

## Cognito Integration (Planned)

The system is structured for AWS Cognito integration:
1. Replace mock authentication with Cognito API calls
2. Implement proper token refresh using Cognito refresh tokens
3. Add MFA support
4. Integrate with Cognito user pools

## Testing

Currently using mock authentication for development:
- Any email/password combination works for login
- Signup creates mock user records

## Related Documentation

- [API Documentation](/docs/api/README.md)
- [Architecture Overview](/docs/architecture/README.md)
- [Features Documentation](/docs/features/README.md)

## Future Enhancements

1. **Multi-Factor Authentication (MFA)**
2. **Social login providers**
3. **Session timeout handling**
4. **Remember me functionality**
5. **Account verification emails**
6. **Password strength meter**
7. **Biometric authentication support**