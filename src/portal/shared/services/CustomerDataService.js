/**
 * Customer Data Service
 * 
 * Central service for managing customer data throughout the application.
 * This loads real customer data from the backend APIs.
 * 
 * In production:
 * 1. User logs in
 * 2. Backend returns auth token + basic user info
 * 3. Frontend fetches complete customer profile (this service)
 * 4. All components/services access customer data from here
 */

window.CustomerDataService = (function() {
    'use strict';
    
    let customerData = null;
    const listeners = new Set();
    const STORAGE_KEY = 'web3diagnostics_customer_data';
    
    /**
     * Initialize the service
     * @returns {Promise<boolean>} - Success status
     */
    async function init() {
        console.log('🔧 CustomerDataService: Initializing...');
        
        // Check for existing customer data
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            try {
                customerData = JSON.parse(storedData);
                console.log('✅ CustomerDataService: Loaded from storage');
                return true;
            } catch (e) {
                console.error('❌ Error parsing stored customer data:', e);
            }
        }
        
        // No stored data, try to fetch
        return await fetchCustomerProfile();
    }
    
    /**
     * Load customer data from storage
     */
    function loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                customerData = JSON.parse(stored);
                console.log('✅ Customer data loaded from storage');
            }
        } catch (e) {
            console.error('Failed to load customer data from storage:', e);
        }
    }
    
    /**
     * Save customer data to storage
     */
    function saveToStorage() {
        try {
            if (customerData) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(customerData));
            }
        } catch (e) {
            console.error('Failed to save customer data:', e);
        }
    }
    
    /**
     * Set customer data (called after login or profile fetch)
     */
    function setCustomerData(data) {
        console.log('📋 Setting customer data:', data);
        customerData = data;
        saveToStorage();
        notifyListeners();
    }
    
    /**
     * Get customer data
     */
    function getCustomerData() {
        return customerData;
    }
    
    /**
     * Get specific field from customer data
     */
    function get(field) {
        return customerData ? customerData[field] : null;
    }
    
    /**
     * Get customer ID (primary use case)
     */
    function getCustomerId() {
        // Try stored customer ID first
        const storedId = localStorage.getItem('web3diagnostics_customer_id');
        if (storedId && !storedId.includes('demo')) {
            return storedId;
        }
        
        // Try from customer data
        if (customerData) {
            return customerData.customer_id || customerData.id;
        }
        
        // Try from user data
        const userData = localStorage.getItem('web3diagnostics_user_data');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                return user.customer_id;
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        
        // No fallback - return null if no valid ID
        return null;
    }
    
    /**
     * Check if customer data is loaded
     */
    function isLoaded() {
        return !!customerData;
    }
    
    /**
     * Clear customer data (logout)
     */
    function clear() {
        customerData = null;
        localStorage.removeItem(STORAGE_KEY);
        notifyListeners();
    }
    
    /**
     * Subscribe to customer data changes
     */
    function subscribe(callback) {
        listeners.add(callback);
        return () => listeners.delete(callback);
    }
    
    /**
     * Notify all listeners of changes
     */
    function notifyListeners() {
        listeners.forEach(callback => {
            try {
                callback(customerData);
            } catch (e) {
                console.error('Error in customer data listener:', e);
            }
        });
    }
    
    /**
     * Fetch customer profile from backend
     * @returns {Promise<boolean>} - Success status
     */
    async function fetchCustomerProfile() {
        console.log('🔄 CustomerDataService: Fetching customer profile...');
        
        try {
            // First try to get customer ID from various sources
            const customerId = getCustomerId();
            
            if (!customerId || customerId.includes('demo') || customerId.includes('default')) {
                console.warn('⚠️ No valid customer ID available');
                return false;
            }
            
            // Use CustomerApiService if available
            if (window.CustomerApiService && window.CustomerApiService.getCustomerProfile) {
                const response = await window.CustomerApiService.getCustomerProfile(customerId);
                
                if (response.success && response.data) {
                    setCustomerData(response.data);
                    return true;
                }
                
                // If customer exists but has no profile data, return true with empty data
                if (response.status === 404) {
                    console.log('📋 Customer exists but profile incomplete');
                    setCustomerData({ customer_id: customerId, email: '' });
                    return true;
                }
                
                return false;
            } else {
                // Fallback to direct API call - using correct endpoint
                const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                    ? 'http://localhost:3001'
                    : '/api';
                
                const response = await fetch(`${apiBaseUrl}/api/customer/${customerId}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 404) {
                    // Customer not found - this is expected for new users
                    console.log('📋 Customer not found - new user');
                    setCustomerData({ customer_id: customerId, email: '' });
                    return true;
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch profile: ${response.status}`);
                }

                const profileData = await response.json();
                setCustomerData(profileData);
                return true;
            }
        } catch (error) {
            console.error('❌ Error fetching customer profile:', error);
            return false;
        }
    }
    
    /**
     * Update customer data via the customer endpoint
     * @param {Object} updates - Fields to update
     * @returns {Promise<boolean>} - Success status
     */
    async function updateCustomerData(updates) {
        try {
            const customerId = getCustomerId();
            if (!customerId) {
                throw new Error('Customer ID not found - cannot update');
            }

            console.log('📡 Updating customer data via /api/customer endpoint:', updates);

            // Use CustomerApiService if available
            if (window.CustomerApiService) {
                // Map frontend fields to API fields
                const apiUpdates = window.CustomerApiService.mapToApiFields(updates);
                const result = await window.CustomerApiService.updateCustomer(customerId, apiUpdates);
                
                console.log('✅ Customer data updated successfully:', result);
                
                // Refresh the local data
                await fetchCustomerProfile();
                
                return true;
            } else {
                // Fallback to direct API call
                const response = await fetch('/api/customer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: customerId,
                        ...updates
                    })
                });

                if (!response.ok) {
                    throw new Error(`Failed to update customer data: ${response.status}`);
                }

                const result = await response.json();
                console.log('✅ Customer data updated successfully:', result);

                // Refresh the local data
                await fetchCustomerProfile();
                
                return true;
            }
        } catch (error) {
            console.error('❌ Error updating customer data:', error);
            throw error;
        }
    }

    /**
     * Update Evexia client ID specifically
     * @param {string} clientId - The Evexia External Client ID
     * @returns {Promise<boolean>} - Success status
     */
    async function updateEvexiaClientId(clientId) {
        try {
            const customerId = getCustomerId();
            if (!customerId) {
                throw new Error('Customer ID not found - cannot update');
            }

            console.log('📡 Updating Evexia client ID:', clientId);

            // Use CustomerApiService if available
            if (window.CustomerApiService) {
                await window.CustomerApiService.updateEvexiaClientId(customerId, clientId);
                
                // Update local data
                if (customerData) {
                    customerData.externalClientId = clientId;
                    customerData.client_id = clientId;
                    saveToStorage();
                    notifyListeners();
                }
                
                return true;
            } else {
                // Fallback to updateCustomerData
                return await updateCustomerData({ client_id: clientId });
            }
        } catch (error) {
            console.error('❌ Error updating Evexia client ID:', error);
            throw error;
        }
    }
    
    /**
     * Check if profile is complete
     * @returns {boolean} - True if all required fields are filled
     */
    function isProfileComplete() {
        if (!customerData) return false;
        
        // Check required profile fields using correct API field names
        const requiredFields = [
            customerData.first_name,
            customerData.last_name,
            customerData.phone,
            customerData.practice_name,
            customerData.email,
            customerData.address,
            customerData.city,
            customerData.state,
            customerData.zip
        ];
        
        return requiredFields.every(field => field && field.toString().trim() !== '');
    }
    
    /**
     * Get authentication token from multiple sources
     * @returns {string|null} - The auth token or null
     */
    function getAuthToken() {
        // Check Config first
        if (window.Config && window.Config.getAuthToken) {
            const configToken = window.Config.getAuthToken();
            if (configToken && configToken !== 'null') {
                return configToken;
            }
        }
        
        // Check DashboardConfig
        if (window.DashboardConfig && window.DashboardConfig.getAuthToken) {
            const dashToken = window.DashboardConfig.getAuthToken();
            if (dashToken && dashToken !== 'null') {
                return dashToken;
            }
        }
        
        // Check localStorage for auth token
        const storedToken = localStorage.getItem('auth-token');
        if (storedToken && storedToken !== 'null') {
            return storedToken;
        }
        
        console.warn('⚠️ No auth token found');
        return null;
    }
    
    // Public API
    return {
        init,
        setCustomerData,
        getCustomerData,
        get,
        getCustomerId,
        isLoaded,
        isProfileComplete,
        clear,
        subscribe,
        fetchCustomerProfile,
        updateCustomerData,
        updateEvexiaClientId,
        getAuthToken
    };
})();

// Note: CustomerDataService is initialized by PortalHeader in development environments
// In production, it would be initialized after successful login 