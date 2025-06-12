/**
 * Auth-to-Customer Bridge Service
 * 
 * TEMPORARY DEVELOPMENT SERVICE
 * This service bridges the gap between local Cognito authentication and customer creation.
 * In production, Lambda functions handle this automatically after Cognito events.
 * 
 * This service:
 * 1. Intercepts successful authentication
 * 2. Creates a customer record via API
 * 3. Stores the customer ID for use throughout the app
 * 
 * Remove this service when deploying to production with real Lambda functions.
 */

class AuthBridge {
    constructor() {
        this.apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3001'
            : '/api';
        console.log('🌉 AuthBridge: Initialized with API URL:', this.apiBaseUrl);
    }

    /**
     * Generate a UUID v4
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Handle post-authentication customer creation
     * @param {Object} authData - Data from authentication (email required)
     * @returns {Promise<string>} Customer ID
     */
    async handlePostAuth(authData) {
        console.log('🌉 AuthBridge: Handling post-auth for:', authData.email);

        try {
            // Generate a new customer ID
            const customerId = this.generateUUID();
            console.log('🌉 AuthBridge: Generated customer ID:', customerId);

            // Create customer record with minimal data
            const customerData = {
                id: customerId,
                email: authData.email
            };

            // POST to create customer
            const response = await fetch(`${this.apiBaseUrl}/api/customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) {
                throw new Error(`Customer creation failed: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ AuthBridge: Customer created successfully:', result);

            // Store customer ID in localStorage
            localStorage.setItem('web3diagnostics_customer_id', customerId);
            console.log('💾 AuthBridge: Customer ID stored in localStorage');

            // Also store email for reference
            localStorage.setItem('userEmail', authData.email);

            return customerId;

        } catch (error) {
            console.error('❌ AuthBridge: Error creating customer:', error);
            // In development, we'll still store the ID even if API fails
            const fallbackId = this.generateUUID();
            localStorage.setItem('web3diagnostics_customer_id', fallbackId);
            localStorage.setItem('userEmail', authData.email);
            return fallbackId;
        }
    }

    /**
     * Check if customer exists and has complete profile
     * @param {string} customerId 
     * @returns {Promise<boolean>} True if profile is complete
     */
    async checkProfileComplete(customerId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/customer/${customerId}`);
            if (!response.ok) {
                return false;
            }

            const customerData = await response.json();
            
            // Check if all required fields are present
            const requiredFields = [
                'first_name', 'last_name', 'practice_name',
                'email', 'phone', 'npi',
                'address', 'city', 'state', 'zip'
            ];

            const isComplete = requiredFields.every(field => 
                customerData[field] && customerData[field].trim() !== ''
            );

            console.log('🌉 AuthBridge: Profile complete check:', isComplete);
            return isComplete;

        } catch (error) {
            console.error('❌ AuthBridge: Error checking profile:', error);
            return false;
        }
    }
}

// Export singleton instance
const authBridge = new AuthBridge();
window.authBridge = authBridge; // Make available globally for debugging
export default authBridge;