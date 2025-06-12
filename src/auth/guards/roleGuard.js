/**
 * Role-Based Access Control Guard
 * Manages user roles and permissions
 */

const RoleGuard = {
    // Define available roles
    ROLES: {
        ADMIN: 'admin',
        CLINICIAN: 'clinician',
        STAFF: 'staff',
        USER: 'user'
    },

    /**
     * Get current user's role
     * @returns {string|null} User role or null if not authenticated
     */
    getUserRole() {
        const userData = localStorage.getItem('web3diagnostics_user_data');
        if (!userData) return null;

        try {
            const user = JSON.parse(userData);
            return user.role || this.ROLES.CLINICIAN; // Default to clinician
        } catch (e) {
            console.error('❌ RoleGuard: Error parsing user data:', e);
            return null;
        }
    },

    /**
     * Check if user has a specific role
     * @param {string} requiredRole - Role to check for
     * @returns {boolean} True if user has the role
     */
    hasRole(requiredRole) {
        const userRole = this.getUserRole();
        if (!userRole) return false;

        // Admin has access to everything
        if (userRole === this.ROLES.ADMIN) return true;

        return userRole === requiredRole;
    },

    /**
     * Check if user has any of the specified roles
     * @param {string[]} roles - Array of roles to check
     * @returns {boolean} True if user has any of the roles
     */
    hasAnyRole(roles) {
        return roles.some(role => this.hasRole(role));
    },

    /**
     * Check if user has all of the specified roles
     * @param {string[]} roles - Array of roles to check
     * @returns {boolean} True if user has all roles
     */
    hasAllRoles(roles) {
        return roles.every(role => this.hasRole(role));
    },

    /**
     * Require specific role and redirect if not met
     * @param {string} requiredRole - Role required for access
     * @param {string} redirectUrl - URL to redirect to if role not met
     * @returns {boolean} True if role requirement met
     */
    requireRole(requiredRole, redirectUrl = '/portal/features/dashboard/pages/index.html') {
        if (!this.hasRole(requiredRole)) {
            console.warn(`🔒 RoleGuard: Access denied - requires ${requiredRole} role`);
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    /**
     * Get role-specific permissions
     * @param {string} role - Role to get permissions for
     * @returns {object} Permissions object
     */
    getPermissions(role = null) {
        const userRole = role || this.getUserRole();
        
        const permissions = {
            [this.ROLES.ADMIN]: {
                canManageUsers: true,
                canViewAllData: true,
                canEditSettings: true,
                canManageIntegrations: true,
                canViewReports: true,
                canManageBilling: true
            },
            [this.ROLES.CLINICIAN]: {
                canManageUsers: false,
                canViewAllData: false,
                canEditSettings: true,
                canManageIntegrations: true,
                canViewReports: true,
                canManageBilling: true
            },
            [this.ROLES.STAFF]: {
                canManageUsers: false,
                canViewAllData: false,
                canEditSettings: false,
                canManageIntegrations: false,
                canViewReports: true,
                canManageBilling: false
            },
            [this.ROLES.USER]: {
                canManageUsers: false,
                canViewAllData: false,
                canEditSettings: false,
                canManageIntegrations: false,
                canViewReports: false,
                canManageBilling: false
            }
        };

        return permissions[userRole] || permissions[this.ROLES.USER];
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoleGuard;
} else {
    window.RoleGuard = RoleGuard;
}