/**
 * Customer API Service
 * Handles all customer-related API operations with the /api/customer endpoint
 */

window.CustomerApiService = (function() {
    'use strict';

    // Get configuration
    const getConfig = () => window.Config || window.DashboardConfig;

    /**
     * Add or update customer record
     * @param {Object} customerData - Customer data to save
     * @returns {Promise<Object>} - Response with status and customer ID
     */
    async function saveCustomer(customerData) {
        const config = getConfig();
        
        try {
            console.log('📡 Saving customer data:', customerData);
            
            const response = await fetch('/api/customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.getAuthToken()}`
                },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save customer: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Customer saved successfully:', result);
            
            return result;
        } catch (error) {
            console.error('❌ Error saving customer:', error);
            throw error;
        }
    }

    /**
     * Get customer data
     * @returns {Promise<Array>} - Array of customer records
     */
    async function getCustomer() {
        const config = getConfig();
        
        try {
            console.log('📡 Fetching customer data');
            
            const response = await fetch('/api/customer', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${config.getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch customer: ${response.status}`);
            }

            const customers = await response.json();
            console.log('✅ Customer data retrieved:', customers);
            
            // Return the first customer (assuming single customer per account)
            return customers && customers.length > 0 ? customers[0] : null;
        } catch (error) {
            console.error('❌ Error fetching customer:', error);
            throw error;
        }
    }

    /**
     * Update customer with new data (partial update)
     * @param {string} customerId - Customer ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} - Updated customer data
     */
    async function updateCustomer(customerId, updates) {
        if (!customerId) {
            throw new Error('Customer ID is required for updates');
        }

        // Add ID to the update payload
        const updatePayload = {
            id: customerId,
            ...updates
        };

        return await saveCustomer(updatePayload);
    }

    /**
     * Create new customer (no ID provided)
     * @param {Object} customerData - New customer data
     * @returns {Promise<Object>} - Created customer with ID
     */
    async function createCustomer(customerData) {
        // Ensure no ID is provided for creation
        const { id, ...dataWithoutId } = customerData;
        return await saveCustomer(dataWithoutId);
    }

    /**
     * Update customer's Evexia client ID
     * @param {string} customerId - Customer ID
     * @param {string} clientId - Evexia External Client ID
     * @returns {Promise<Object>} - Updated customer data
     */
    async function updateEvexiaClientId(customerId, clientId) {
        return await updateCustomer(customerId, { client_id: clientId });
    }

    /**
     * Map frontend field names to API field names
     * @param {Object|FormData} frontendData - Data with frontend field names or FormData object
     * @returns {Object} - Data with API field names
     */
    function mapToApiFields(frontendData) {
        const mapping = {
            // Form field IDs → API field names (actual form IDs from profile-onboarding.html)
            'prof-first-name': 'first_name',
            'prof-last-name': 'last_name',
            'prof-phone': 'phone',
            'prof-business-name': 'practice_name',
            'prof-business-email': 'email',
            'prof-address': 'address',
            'prof-city': 'city',
            'prof-state': 'state',
            'prof-zip': 'zip',
            'evexia_api_key': 'client_id',
            
            // Form field names (name attributes) → API field names
            'first_name': 'first_name',
            'last_name': 'last_name',
            'phone_number': 'phone',
            'practice_name': 'practice_name',
            'business_email': 'email',
            'business_address': 'address',
            'business_city': 'city',
            'business_state': 'state',
            'business_postal': 'zip',
            'npi_number': 'npi',
            
            // Legacy camelCase mappings (for backward compatibility)
            firstName: 'first_name',
            lastName: 'last_name',
            practiceName: 'practice_name',
            npiNumber: 'npi',
            businessEmail: 'email',
            phoneNumber: 'phone',
            businessAddress: 'address',
            businessCity: 'city',
            businessState: 'state',
            businessPostal: 'zip',
            externalClientId: 'client_id',
            shopDomain: 'shop_domain'
        };

        const apiData = {};
        
        // Handle FormData objects
        if (frontendData instanceof FormData) {
            for (let [key, value] of frontendData.entries()) {
                const apiKey = mapping[key] || key;
                if (value !== undefined && value !== null && value !== '') {
                    apiData[apiKey] = value;
                }
            }
        } else {
            // Handle plain objects
            Object.keys(frontendData).forEach(key => {
                const apiKey = mapping[key] || key;
                if (frontendData[key] !== undefined && frontendData[key] !== null) {
                    apiData[apiKey] = frontendData[key];
                }
            });
        }

        return apiData;
    }

    /**
     * Map API field names to frontend field names
     * @param {Object} apiData - Data with API field names
     * @returns {Object} - Data with frontend field names
     */
    function mapFromApiFields(apiData) {
        if (!apiData) return null;

        return {
            // IDs
            id: apiData.id,
            customerId: apiData.id,
            
            // User fields
            firstName: apiData.first_name,
            lastName: apiData.last_name,
            email: apiData.email,
            
            // Practice fields
            practiceName: apiData.practice_name,
            npiNumber: apiData.npi,
            businessEmail: apiData.email,
            phoneNumber: apiData.phone,
            businessAddress: apiData.address,
            businessCity: apiData.city,
            businessState: apiData.state,
            businessPostal: apiData.zip,
            
            // Integration fields
            externalClientId: apiData.client_id,
            shopDomain: apiData.shop_domain,
            
            // Additional fields
            markup: apiData.markup,
            hmacSecret: apiData.hmac_secret,
            accessToken: apiData.access_token,
            licenseDocument: apiData.license_document,
            licenseFilename: apiData.license_filename
        };
    }

    /**
     * Get customer profile by ID
     * @param {string} customerId - Customer ID
     * @returns {Promise<Object>} - Customer profile data
     */
    async function getCustomerProfile(customerId) {
        const config = getConfig();
        
        try {
            console.log('📡 Fetching customer profile for ID:', customerId);
            
            const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:3001'
                : '/api';
            
            const response = await fetch(`${apiBaseUrl}/api/customer/${customerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                // Customer not found - expected for new users
                console.log('📋 Customer not found - new user');
                return { 
                    success: true, 
                    status: 404,
                    data: null 
                };
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch customer: ${response.status}`);
            }

            const customerData = await response.json();
            console.log('✅ Customer profile retrieved:', customerData);
            
            return { 
                success: true, 
                data: customerData 
            };
        } catch (error) {
            console.error('❌ Error fetching customer profile:', error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    // Public API
    return {
        saveCustomer,
        getCustomer,
        createCustomer,
        updateCustomer,
        updateEvexiaClientId,
        getCustomerProfile,
        mapToApiFields,
        mapFromApiFields
    };
})(); 