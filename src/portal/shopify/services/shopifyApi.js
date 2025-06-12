/**
 * shopifyApi.js - Shopify API wrapper service
 * Handles all communication with the Shopify backend API
 */

const ShopifyAPI = (function() {
  'use strict';

  const API_BASE = '/api/shopify';

  /**
   * Make authenticated API request
   */
  async function request(method, endpoint, data = null) {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, options);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Shopify API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  // Public API
  return {
    // Connection Management
    connection: {
      /**
       * Get current connection status
       */
      async getStatus() {
        return request('GET', '/connection/status');
      },

      /**
       * Initiate OAuth connection
       */
      async initiate(storeName, state) {
        return request('POST', '/oauth/initiate', { storeName, state });
      },

      /**
       * Complete OAuth callback
       */
      async callback(code, storeName) {
        return request('POST', '/oauth/callback', { code, storeName });
      },

      /**
       * Disconnect store
       */
      async disconnect() {
        return request('DELETE', '/connection');
      }
    },

    // Product Management
    products: {
      /**
       * Get all products from Shopify
       */
      async list(params = {}) {
        const query = new URLSearchParams(params).toString();
        return request('GET', `/products${query ? `?${query}` : ''}`);
      },

      /**
       * Search products
       */
      async search(query) {
        return request('GET', `/products/search?q=${encodeURIComponent(query)}`);
      },

      /**
       * Get product mappings
       */
      async getMappings() {
        return request('GET', '/products/mappings');
      },

      /**
       * Create or update product mapping
       */
      async mapProduct(evexiaTestId, shopifyProductId) {
        return request('POST', '/products/mappings', {
          evexiaTestId,
          shopifyProductId
        });
      },

      /**
       * Delete product mapping
       */
      async unmapProduct(evexiaTestId) {
        return request('DELETE', `/products/mappings/${evexiaTestId}`);
      },

      /**
       * Get mapping suggestions
       */
      async getSuggestions() {
        return request('GET', '/products/mappings/suggestions');
      }
    },

    // Order Management
    orders: {
      /**
       * Sync a single order
       */
      async syncOrder(evexiaOrderId) {
        return request('POST', `/orders/${evexiaOrderId}/sync`);
      },

      /**
       * Sync all pending orders
       */
      async syncAll() {
        return request('POST', '/orders/sync-all');
      },

      /**
       * Get sync status for an order
       */
      async getSyncStatus(orderId) {
        return request('GET', `/orders/${orderId}/sync-status`);
      },

      /**
       * Get sync history
       */
      async getSyncHistory(params = {}) {
        const query = new URLSearchParams(params).toString();
        return request('GET', `/orders/sync-history${query ? `?${query}` : ''}`);
      },

      /**
       * Retry failed sync
       */
      async retrySyn(orderId) {
        return request('POST', `/orders/${orderId}/retry`);
      }
    },

    // Settings Management
    settings: {
      /**
       * Get sync settings
       */
      async get() {
        return request('GET', '/settings');
      },

      /**
       * Update sync settings
       */
      async update(settings) {
        return request('PUT', '/settings', settings);
      }
    },

    // Webhook Management
    webhooks: {
      /**
       * List registered webhooks
       */
      async list() {
        return request('GET', '/webhooks');
      },

      /**
       * Register webhook
       */
      async register(topic) {
        return request('POST', '/webhooks', { topic });
      },

      /**
       * Unregister webhook
       */
      async unregister(webhookId) {
        return request('DELETE', `/webhooks/${webhookId}`);
      },

      /**
       * Test webhook
       */
      async test(webhookId) {
        return request('POST', `/webhooks/${webhookId}/test`);
      }
    },

    // Health & Monitoring
    health: {
      /**
       * Get integration health status
       */
      async getStatus() {
        return request('GET', '/health');
      },

      /**
       * Get sync statistics
       */
      async getStats() {
        return request('GET', '/health/stats');
      }
    }
  };
})();

// Make available globally
window.ShopifyAPI = ShopifyAPI;