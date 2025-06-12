/**
 * Authentication Guard
 * Protects routes and features that require authentication
 */

const AuthGuard = {
    /**
     * Check if user is authenticated
     * @returns {boolean} True if authenticated, false otherwise
     */
    isAuthenticated() {
        const token = localStorage.getItem('web3diagnostics_auth_token');
        return !!token;
    },

    /**
     * Check authentication and redirect if needed
     * @param {string} redirectUrl - URL to redirect to if not authenticated
     * @returns {boolean} True if authenticated
     */
    requireAuth(redirectUrl = '/') {
        if (!this.isAuthenticated()) {
            console.warn('🔒 AuthGuard: Access denied - user not authenticated');
            
            // Store intended destination for post-login redirect
            localStorage.setItem('auth_redirect', window.location.href);
            
            // Redirect to home page (where auth modal can be triggered)
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    /**
     * Get stored redirect URL and clear it
     * @returns {string|null} Stored redirect URL or null
     */
    getRedirect() {
        const redirect = localStorage.getItem('auth_redirect');
        if (redirect) {
            localStorage.removeItem('auth_redirect');
        }
        return redirect;
    },

    /**
     * Initialize auth guard for current page
     * Call this on protected pages
     */
    init() {
        // Check authentication on page load
        if (!this.isAuthenticated()) {
            this.requireAuth();
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthGuard;
} else {
    window.AuthGuard = AuthGuard;
}