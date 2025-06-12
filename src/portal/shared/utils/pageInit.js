/**
 * Portal Page Initialization
 * Handles authentication checks and customer data initialization for all portal pages
 */

window.PortalPageInit = (function() {
    'use strict';
    
    /**
     * Initialize portal page with authentication and data checks
     * @returns {Promise<boolean>} - True if initialization successful, false if redirected
     */
    async function init() {
        console.log('🔐 Initializing portal page...');
        
        // Check authentication
        if (!window.AuthGuard || !window.AuthGuard.isAuthenticated()) {
            console.warn('⚠️ User not authenticated, redirecting...');
            if (window.AuthGuard) {
                window.AuthGuard.requireAuth();
            } else {
                // Fallback redirect if AuthGuard not available
                localStorage.setItem('auth_redirect', window.location.href);
                window.location.href = '/';
            }
            return false;
        }
        
        // Initialize customer data
        if (window.CustomerDataService) {
            try {
                const hasCustomerData = await window.CustomerDataService.init();
                
                if (!hasCustomerData) {
                    console.warn('⚠️ No customer data available, redirecting to profile setup...');
                    window.location.href = '/src/portal/features/account-management/pages/profile-onboarding.html';
                    return false;
                }
                
                // Check if profile is complete
                const isComplete = window.CustomerDataService.isProfileComplete();
                const currentPath = window.location.pathname;
                const isOnboardingPage = currentPath.includes('profile-onboarding') || 
                                       currentPath.includes('account.html');
                
                if (!isComplete && !isOnboardingPage) {
                    console.warn('⚠️ Profile incomplete, redirecting to complete profile...');
                    window.location.href = '/src/portal/features/account-management/pages/profile-onboarding.html';
                    return false;
                }
            } catch (error) {
                console.error('❌ Error initializing customer data:', error);
                alert('Error loading your profile. Please try logging in again.');
                
                // Clear auth and redirect to login
                if (window.AuthGuard) {
                    window.AuthGuard.requireAuth();
                } else {
                    window.location.href = '/';
                }
                return false;
            }
        } else {
            console.warn('⚠️ CustomerDataService not available');
        }
        
        console.log('✅ Portal page initialization complete');
        return true;
    }
    
    /**
     * Check if current page requires authentication
     * @returns {boolean} - True if page requires auth
     */
    function requiresAuth() {
        // All portal pages require authentication
        const currentPath = window.location.pathname;
        return currentPath.includes('/portal/') || 
               currentPath.includes('/src/portal/');
    }
    
    /**
     * Get customer ID from initialized service
     * @returns {string|null} - Customer ID or null
     */
    function getCustomerId() {
        if (window.CustomerDataService && window.CustomerDataService.isLoaded()) {
            return window.CustomerDataService.getCustomerId();
        }
        return null;
    }
    
    /**
     * Check if user has required permissions for current page
     * @param {string} requiredRole - Required role for page access
     * @returns {boolean} - True if user has permission
     */
    function hasPermission(requiredRole) {
        if (!window.RoleGuard) {
            // If no role guard, assume permission granted
            return true;
        }
        
        return window.RoleGuard.hasRole(requiredRole);
    }
    
    // Public API
    return {
        init,
        requiresAuth,
        getCustomerId,
        hasPermission
    };
})();

// Auto-initialize on certain pages if data attribute is present
document.addEventListener('DOMContentLoaded', function() {
    const shouldAutoInit = document.body.dataset.requiresAuth === 'true' ||
                          document.querySelector('[data-portal-page]');
    
    if (shouldAutoInit && window.PortalPageInit) {
        window.PortalPageInit.init().then(success => {
            if (success) {
                // Dispatch event for page-specific initialization
                document.dispatchEvent(new CustomEvent('portalPageReady', {
                    detail: { customerId: window.PortalPageInit.getCustomerId() }
                }));
            }
        });
    }
});