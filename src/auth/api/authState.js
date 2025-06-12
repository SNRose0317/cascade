/**
 * authState.js
 * 
 * Utility for managing authentication state and providing authentication events
 * This allows components to react to login/logout events and check auth status
 */

import authService from './authService.js';

/**
 * AuthState class for managing authentication state and events
 */
class AuthState {
    constructor() {
        this.listeners = {
            login: [],
            logout: [],
            profileUpdate: []
        };
        
        this.isInitialized = false;
        
        // Initialize by checking if user is already logged in
        this.init();
    }
    
    /**
     * Initialize the auth state
     */
    async init() {
        if (this.isInitialized) return;
        
        this.isInitialized = true;
        
        // Check if the user is already logged in (from a previous session)
        if (authService.isAuthenticated()) {
            try {
                // Validate the stored token with the server
                await authService.checkSession();
                
                // If successful, notify listeners of the login
                this.notifyListeners('login', authService.getCurrentUser());
            } catch (error) {
                console.error('Session validation failed:', error);
                // Token was invalid, so no login event is triggered
            }
        }
    }
    
    /**
     * Add an event listener
     * @param {string} event - Event to listen for ('login', 'logout', 'profileUpdate')
     * @param {Function} callback - Function to call when the event occurs
     * @returns {Function} - Function to remove the listener
     */
    addEventListener(event, callback) {
        if (!this.listeners[event]) {
            console.warn(`Unknown auth event: ${event}`);
            return () => {};
        }
        
        this.listeners[event].push(callback);
        
        // Return a function to remove this listener
        return () => {
            this.removeEventListener(event, callback);
        };
    }
    
    /**
     * Remove an event listener
     * @param {string} event - Event to stop listening for
     * @param {Function} callback - Function to remove
     */
    removeEventListener(event, callback) {
        if (!this.listeners[event]) return;
        
        const index = this.listeners[event].indexOf(callback);
        if (index !== -1) {
            this.listeners[event].splice(index, 1);
        }
    }
    
    /**
     * Notify all listeners of an event
     * @param {string} event - Event that occurred
     * @param {*} data - Data to pass to listeners
     * @private
     */
    notifyListeners(event, data) {
        if (!this.listeners[event]) return;
        
        for (const listener of this.listeners[event]) {
            try {
                listener(data);
            } catch (error) {
                console.error(`Error in ${event} listener:`, error);
            }
        }
    }
    
    /**
     * Login a user and notify listeners
     * @param {Object} credentials - Login credentials
     * @returns {Promise<Object>} - Login response
     */
    async login(credentials) {
        const response = await authService.login(credentials);
        this.notifyListeners('login', authService.getCurrentUser());
        return response;
    }
    
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} - Registration response
     */
    async register(userData) {
        return authService.register(userData);
        // Note: We don't notify login listeners here because registration
        // typically doesn't log the user in automatically (email verification may be required)
    }
    
    /**
     * Update a user's profile and notify listeners
     * @param {Object} profileData - Profile data to update
     * @returns {Promise<Object>} - Update response
     */
    async updateProfile(profileData) {
        const response = await authService.updateProfile(profileData);
        this.notifyListeners('profileUpdate', authService.getCurrentUser());
        return response;
    }
    
    /**
     * Logout a user and notify listeners
     * @returns {Promise<void>}
     */
    async logout() {
        await authService.logout();
        this.notifyListeners('logout');
    }
    
    /**
     * Check if the user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return authService.isAuthenticated();
    }
    
    /**
     * Get the current user
     * @returns {Object|null}
     */
    getCurrentUser() {
        return authService.getCurrentUser();
    }
    
    /**
     * Request a password reset
     * @param {Object} requestData - Password reset request data
     * @returns {Promise<Object>}
     */
    async forgotPassword(requestData) {
        return authService.forgotPassword(requestData);
    }
    
    /**
     * Reset a password with a token
     * @param {Object} resetData - Password reset data
     * @returns {Promise<Object>}
     */
    async resetPassword(resetData) {
        return authService.resetPassword(resetData);
    }
    
    /**
     * Change a user's password
     * @param {Object} passwordData - Password change data
     * @returns {Promise<Object>}
     */
    async changePassword(passwordData) {
        return authService.changePassword(passwordData);
    }
    
    /**
     * Verify a user's email
     * @param {string} token - Verification token
     * @returns {Promise<Object>}
     */
    async verifyEmail(token) {
        return authService.verifyEmail(token);
    }
}

// Create and export a singleton instance
const authState = new AuthState();
export default authState;
