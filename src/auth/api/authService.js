/**
 * authService.js
 * 
 * Service for handling authentication with the AWS backend
 * This file contains the integration points for the backend developer to connect to AWS services
 */

// Import configuration from environment
const getConfig = () => window.Config || window.DashboardConfig;

/**
 * Get API Base URL from environment configuration
 * @returns {string} API base URL
 */
const getApiBaseUrl = () => {
    // For local development, use the mock API container
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3001';
    }
    
    // Check for local dev container config
    if (window.LOCAL_DEV_CONFIG && window.LOCAL_DEV_CONFIG.API_BASE_URL) {
        return window.LOCAL_DEV_CONFIG.API_BASE_URL;
    }
    
    const config = getConfig();
    return config ? config.get('API_BASE_URL') : '/api';
};

/**
 * Storage keys for localStorage/sessionStorage
 * @const {Object}
 */
const STORAGE_KEYS = {
    AUTH_TOKEN: 'web3diagnostics_auth_token',
    REFRESH_TOKEN: 'web3diagnostics_refresh_token',
    USER_DATA: 'web3diagnostics_user_data'
};

/**
 * AuthService class for handling all authentication operations
 */
class AuthService {
    constructor() {
        this.token = null;
        this.refreshToken = null;
        this.userData = null;
        
        // Initialize auth state from storage
        this.loadAuthStateFromStorage();
    }
    
    /**
     * Load authentication state from storage (localStorage/sessionStorage)
     * @private
     */
    loadAuthStateFromStorage() {
        // Try to load tokens from persistent storage
        this.token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null;
        this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null;
        
        // Try to load user data
        const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (userDataStr) {
            try {
                this.userData = JSON.parse(userDataStr);
            } catch (e) {
                console.error('Failed to parse user data from storage', e);
                this.userData = null;
            }
        }
    }
    
    /**
     * Save authentication state to storage
     * @param {Object} authData - The authentication data to save
     * @param {boolean} rememberMe - Whether to save to localStorage (persistent) or sessionStorage (session)
     * @private
     */
    saveAuthStateToStorage(authData, rememberMe = true) {
        const storage = rememberMe ? localStorage : sessionStorage;
        
        // Save tokens
        if (authData.token) {
            this.token = authData.token;
            storage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.token);
        }
        
        if (authData.refreshToken) {
            this.refreshToken = authData.refreshToken;
            storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
        }
        
        // Save user data
        if (authData.userData) {
            this.userData = authData.userData;
            storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authData.userData));
        }
    }
    
    /**
     * Clear authentication state from storage and memory
     * @private
     */
    clearAuthState() {
        this.token = null;
        this.refreshToken = null;
        this.userData = null;
        
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        
        sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
    
    /**
     * Make an API request with authentication
     * @param {string} endpoint - API endpoint to call
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} - Response data
     * @private
     */
    async apiRequest(endpoint, options = {}) {
        const apiBaseUrl = getApiBaseUrl();
        const url = `${apiBaseUrl}${endpoint}`;
        
        // Default headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        // Add auth token if available
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        // Make the request
        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            
            // Parse response
            const data = await response.json();
            
            // Handle error responses
            if (!response.ok) {
                // Check for 401 Unauthorized (expired token)
                if (response.status === 401 && this.refreshToken) {
                    // Try to refresh the token
                    const refreshed = await this.refreshAuthToken();
                    if (refreshed) {
                        // Retry the original request with the new token
                        return this.apiRequest(endpoint, options);
                    }
                }
                
                // If we couldn't refresh or it's another error, throw it
                throw new Error(data.message || `API Error: ${response.statusText}`);
            }
            
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }
    
    /**
     * Check if the user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        const hasToken = !!this.token;
        console.log('🔑 AuthService: isAuthenticated check - token exists:', hasToken, 'token value:', this.token ? '[REDACTED]' : 'null');
        return hasToken;
    }
    
    /**
     * Get the current user data
     * @returns {Object|null} - The user data or null if not authenticated
     */
    getCurrentUser() {
        return this.userData;
    }
    
    /**
     * Get the authentication token
     * @returns {string|null} - The token or null if not authenticated
     */
    getToken() {
        return this.token;
    }
    
    /**
     * Refresh the authentication token
     * @returns {Promise<boolean>} - Whether the token was successfully refreshed
     * @private
     */
    async refreshAuthToken() {
        if (!this.refreshToken) {
            return false;
        }
        
        try {
            const apiBaseUrl = getApiBaseUrl();
            const response = await fetch(`${apiBaseUrl}/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: this.refreshToken
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                // If refresh failed, clear auth state
                this.clearAuthState();
                return false;
            }
            
            // Save the new tokens
            this.saveAuthStateToStorage({
                token: data.token,
                refreshToken: data.refreshToken
            });
            
            return true;
        } catch (error) {
            console.error('Token Refresh Error:', error);
            this.clearAuthState();
            return false;
        }
    }
    
    /**
     * Log in a user
     * @param {Object} credentials - User credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @param {boolean} credentials.remember - Whether to remember the user
     * @returns {Promise<Object>} - Response data
     */
    async login(credentials) {
        try {
            // Make login request to AWS Cognito/API Gateway
            const data = await this.apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            });
            
            // Save auth state
            this.saveAuthStateToStorage({
                token: data.token,
                refreshToken: data.refreshToken,
                userData: data.user
            }, credentials.remember);
            
            // Store customer_id separately for quick access
            if (data.user && data.user.customer_id) {
                const storage = credentials.remember ? localStorage : sessionStorage;
                storage.setItem('web3diagnostics_customer_id', data.user.customer_id);
            }
            
            return data;
        } catch (error) {
            throw new Error(error.message || 'Login failed. Please check your credentials and try again.');
        }
    }
    
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.email - User's email
     * @param {string} userData.password - User's password
     * @returns {Promise<Object>} - Response data
     */
    async register(userData) {
        try {
            // Make registration request to AWS Cognito/API Gateway
            const data = await this.apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password
                })
            });
            
            return data;
        } catch (error) {
            throw new Error(error.message || 'Registration failed. Please try again.');
        }
    }
    
    /**
     * Request a password reset
     * @param {Object} requestData - Password reset request data
     * @param {string} requestData.email - User's email
     * @returns {Promise<Object>} - Response data
     */
    async forgotPassword(requestData) {
        try {
            // Make forgot password request to AWS Cognito/API Gateway
            const data = await this.apiRequest('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({
                    email: requestData.email
                })
            });
            
            return data;
        } catch (error) {
            throw new Error(error.message || 'Failed to send password reset email. Please try again.');
        }
    }
    
    /**
     * Reset a password with a token
     * @param {Object} resetData - Password reset data
     * @param {string} resetData.token - Reset token
     * @param {string} resetData.password - New password
     * @returns {Promise<Object>} - Response data
     */
    async resetPassword(resetData) {
        try {
            // Make reset password request to AWS Cognito/API Gateway
            const data = await this.apiRequest('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({
                    token: resetData.token,
                    password: resetData.password
                })
            });
            
            return data;
        } catch (error) {
            throw new Error(error.message || 'Failed to reset password. Please try again.');
        }
    }
    
    /**
     * Update a user's profile
     * @param {Object} profileData - User profile data to update
     * @returns {Promise<Object>} - Response data
     */
    async updateProfile(profileData) {
        try {
            // Ensure the user is authenticated
            if (!this.isAuthenticated()) {
                throw new Error('You must be logged in to update your profile');
            }
            
            // Make update profile request to AWS API Gateway
            const data = await this.apiRequest('/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
            
            // Update stored user data
            if (data.user) {
                this.saveAuthStateToStorage({
                    userData: data.user
                });
            }
            
            return data;
        } catch (error) {
            throw new Error(error.message || 'Failed to update profile. Please try again.');
        }
    }
    
    /**
     * Change a user's password
     * @param {Object} passwordData - Password change data
     * @param {string} passwordData.currentPassword - Current password
     * @param {string} passwordData.newPassword - New password
     * @returns {Promise<Object>} - Response data
     */
    async changePassword(passwordData) {
        try {
            // Ensure the user is authenticated
            if (!this.isAuthenticated()) {
                throw new Error('You must be logged in to change your password');
            }
            
            // Make change password request to AWS Cognito/API Gateway
            const data = await this.apiRequest('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            
            return data;
        } catch (error) {
            throw new Error(error.message || 'Failed to change password. Please try again.');
        }
    }
    
    /**
     * Log out the current user
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            // Make logout request to AWS Cognito/API Gateway if needed
            // Some implementations might not need a server call for logout
            if (this.isAuthenticated()) {
                await this.apiRequest('/auth/logout', {
                    method: 'POST'
                }).catch(e => console.error('Logout API error (non-critical):', e));
            }
        } finally {
            // Always clear local auth state, even if the API call fails
            this.clearAuthState();
        }
    }
    
    /**
     * Verify a user's email address
     * @param {string} token - Verification token
     * @returns {Promise<Object>} - Response data
     */
    async verifyEmail(token) {
        try {
            // Make verify email request to AWS Cognito/API Gateway
            const data = await this.apiRequest('/auth/verify-email', {
                method: 'POST',
                body: JSON.stringify({
                    token
                })
            });
            
            return data;
        } catch (error) {
            throw new Error(error.message || 'Failed to verify email. Please try again.');
        }
    }
    
    /**
     * Check if user session is valid
     * @returns {Promise<Object>} - Response with user data if session is valid
     */
    async checkSession() {
        try {
            // Only proceed if we have a token
            if (!this.token) {
                throw new Error('No active session');
            }
            
            // Make session check request to AWS API Gateway
            const data = await this.apiRequest('/auth/session', {
                method: 'GET'
            });
            
            // Update user data if returned
            if (data.user) {
                this.saveAuthStateToStorage({
                    userData: data.user
                });
            }
            
            return data;
        } catch (error) {
            // Clear auth state if session check fails
            this.clearAuthState();
            throw new Error(error.message || 'Session expired. Please log in again.');
        }
    }
}

// Create and export an instance of the service
const authService = new AuthService();
export default authService;
