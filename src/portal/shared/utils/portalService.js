/**
 * Portal Service
 * Shared API service for the 3 core data areas:
 * - web3_users (User Profile)
 * - clinician_accounts (Account Management) 
 * - clinician_testmenu (Test Menu Management)
 */

window.PortalService = (function() {
    'use strict';

    // Get configuration
    const getConfig = () => window.Config || window.DashboardConfig;

    /**
     * Make authenticated API request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} - Response data
     */
    async function apiRequest(endpoint, options = {}) {
        const config = getConfig();
        
        // Default headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add auth token if available and auth is required
        if (config.get('REQUIRE_AUTH') && config.getAuthToken()) {
            headers['Authorization'] = `Bearer ${config.getAuthToken()}`;
        }

        try {
            const response = await fetch(endpoint, {
                ...options,
                headers
            });

            // Parse response
            const data = await response.json();

            // Handle error responses
            if (!response.ok) {
                throw new Error(data.message || `API Error: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            config.error('API Request Error:', error);
            throw error;
        }
    }

    /**
     * USER PROFILE OPERATIONS (web3_users table)
     */
    const UserProfile = {
        /**
         * Get current user profile
         */
        async get() {
            const config = getConfig();
            
            if (config.get('MOCK_DATA')) {
                return {
                    user_id: 'user-123',
                    email: 'dr.smith@example.com',
                    first_name: 'Dr. John',
                    last_name: 'Smith',
                    created_at: '2024-01-15T00:00:00Z'
                };
            }

            return await apiRequest(config.getEndpoint('USER_PROFILE'));
        },

        /**
         * Update user profile
         * @param {Object} userData - User data to update
         */
        async update(userData) {
            const config = getConfig();
            
            if (config.get('MOCK_DATA')) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true, user: userData };
            }

            return await apiRequest(config.getEndpoint('USER_PROFILE'), {
                method: 'PUT',
                body: JSON.stringify(userData)
            });
        }
    };

    /**
     * CLINICIAN ACCOUNT OPERATIONS (clinician_accounts table)
     */
    const ClinicianAccount = {
        /**
         * Get clinician account data
         */
        async get() {
            const config = getConfig();
            
            if (config.get('MOCK_DATA')) {
                return {
                    clinician_id: 'clinician-123',
                    user_id: 'user-123',
                    external_client_id: '',
                    licensed_states: ['TX', 'CA'],
                    in_office_draws: true,
                    status: 'pending',
                    created_at: '2024-01-15T00:00:00Z'
                };
            }

            return await apiRequest('/api/clinician/account');
        },

        /**
         * Update clinician account
         * @param {Object} accountData - Account data to update
         */
        async update(accountData) {
            const config = getConfig();
            
            if (config.get('MOCK_DATA')) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));
                return { success: true, account: accountData };
            }

            return await apiRequest('/api/clinician/account', {
                method: 'PUT',
                body: JSON.stringify(accountData)
            });
        },

        /**
         * Sync with Evexia (populates clinician_testmenu table)
         * @param {string} externalClientId - Evexia client ID
         */
        async syncEvexia(externalClientId) {
            const config = getConfig();
            
            if (config.get('MOCK_DATA')) {
                // Simulate sync process
                await new Promise(resolve => setTimeout(resolve, 3000));
                return {
                    success: true,
                    tests_imported: 147,
                    panels_imported: 27,
                    message: 'Sync completed successfully'
                };
            }

            return await apiRequest('/api/clinician/sync-evexia', {
                method: 'POST',
                body: JSON.stringify({ external_client_id: externalClientId })
            });
        }
    };

    /**
     * TEST MENU OPERATIONS (clinician_testmenu table)
     */
    const TestMenu = {
        /**
         * Get clinician's test menu
         */
        async getAll() {
            const config = getConfig();
            
            if (config.get('MOCK_DATA')) {
                // Return mock clinician_testmenu data
                return { data: generateMockTestMenuData() };
            }

            return await apiRequest(config.getEndpoint('TEST_MENU'));
        },


        /**
         * Update test retail price
         * @param {number} itemId - Test/panel ID  
         * @param {number} retailPrice - New retail price
         */
        async updatePrice(itemId, retailPrice) {
            const config = getConfig();
            
            if (config.get('MOCK_DATA')) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true };
            }

            return await apiRequest(config.getEndpoint('TEST_PRICING').replace('{id}', itemId), {
                method: 'PUT',
                body: JSON.stringify({ retail_price: retailPrice })
            });
        },

    };

    /**
     * SYNC OPERATIONS
     */
    const Sync = {
        /**
         * Get sync status
         */
        async getStatus() {
            const config = getConfig();
            
            if (config.get('MOCK_DATA')) {
                return {
                    last_sync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    status: 'up_to_date',
                    synced_count: 174,
                    external_client_id: '',
                    is_configured: false
                };
            }

            return await apiRequest(config.getEndpoint('SYNC_STATUS'));
        },

        /**
         * Perform manual sync
         * @param {string} externalClientId - Evexia client ID
         * @param {number} defaultMarkup - Default markup percentage
         */
        async performSync(externalClientId, defaultMarkup = 25) {
            const config = getConfig();
            
            if (config.get('MOCK_DATA')) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                return {
                    success: true,
                    tests_imported: 147,
                    panels_imported: 27,
                    tests_updated: 12,
                    duration: '2.3 seconds'
                };
            }

            return await apiRequest(config.getEndpoint('SYNC_STOREFRONT'), {
                method: 'POST',
                body: JSON.stringify({
                    external_client_id: externalClientId,
                    default_markup: defaultMarkup
                })
            });
        },

        /**
         * Validate Evexia client ID
         * @param {string} clientId - Client ID to validate
         */
        async validateClientId(clientId) {
            const config = getConfig();
            
            if (config.get('MOCK_DATA')) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                // 90% success rate for demo
                return { valid: Math.random() > 0.1 };
            }

            return await apiRequest('/api/evexia/validate-client-id', {
                method: 'POST',
                body: JSON.stringify({ client_id: clientId })
            });
        }
    };

    /**
     * Generate mock test menu data based on clinician_testmenu table structure
     */
    function generateMockTestMenuData() {
        const tests = [];
        const labs = ['LabCorp', 'Quest Diagnostics', 'AML', 'Boston Heart', 'Specialty Lab'];
        const testTypes = ['Blood', 'Urine', 'Saliva', 'Stool', 'Hair'];
        const turnaroundTimes = ['1-2 days', '3-5 days', '5-7 days', '7-10 days', '10-14 days'];

        // Generate individual tests (matches clinician_testmenu table structure)
        for (let i = 1; i <= 120; i++) {
            const wholesaleCost = Math.floor(Math.random() * 200) + 25;
            const retailPrice = Math.floor(wholesaleCost * (1.25 + Math.random() * 0.5));
            
            tests.push({
                clinician_id: 'current-clinician',
                item_id: 10000 + i,
                is_panel: false,
                lab_id: Math.floor(Math.random() * 5) + 1,
                name: `${testTypes[Math.floor(Math.random() * testTypes.length)]} Test ${i}`,
                wholesale_cost: wholesaleCost,
                retail_price: retailPrice,
                synced: Math.random() > 0.3,
                cpt_code: `${80000 + Math.floor(Math.random() * 9999)}`,
                test_type: testTypes[Math.floor(Math.random() * testTypes.length)],
                is_kit: Math.random() > 0.7,
                collection_requirements: {
                    fasting: Math.random() > 0.7,
                    morning_collection: Math.random() > 0.5,
                    special_handling: Math.random() > 0.8
                },
                turnaround_time: turnaroundTimes[Math.floor(Math.random() * turnaroundTimes.length)],
                instructions_html: '<p>Standard collection procedure.</p>',
                patient_prep_html: Math.random() > 0.5 ? '<p>No special preparation required.</p>' : '<p>12-hour fasting required.</p>',
                created_at: new Date().toISOString(),
                lab_name: labs[Math.floor(Math.random() * labs.length)]
            });
        }

        // Generate panels
        for (let i = 1; i <= 27; i++) {
            const wholesaleCost = Math.floor(Math.random() * 500) + 150;
            const retailPrice = Math.floor(wholesaleCost * (1.25 + Math.random() * 0.5));
            
            tests.push({
                clinician_id: 'current-clinician',
                item_id: 20000 + i,
                is_panel: true,
                lab_id: Math.floor(Math.random() * 5) + 1,
                name: `Health Panel ${i}`,
                wholesale_cost: wholesaleCost,
                retail_price: retailPrice,
                synced: Math.random() > 0.2,
                cpt_code: `${80000 + Math.floor(Math.random() * 9999)}`,
                test_type: 'Panel',
                is_kit: false,
                collection_requirements: {
                    fasting: Math.random() > 0.5,
                    morning_collection: true,
                    special_handling: false
                },
                turnaround_time: turnaroundTimes[Math.floor(Math.random() * turnaroundTimes.length)],
                instructions_html: '<p>Comprehensive panel with multiple biomarkers.</p>',
                patient_prep_html: '<p>12-hour fasting required.</p>',
                created_at: new Date().toISOString(),
                lab_name: labs[Math.floor(Math.random() * labs.length)]
            });
        }

        return tests;
    }

    // Public API
    return {
        UserProfile,
        ClinicianAccount,
        TestMenu,
        Sync,
        apiRequest
    };
})();
