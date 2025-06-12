/**
 * ShopifyConnect.js - OAuth connection flow for Shopify integration
 * Handles the store connection process and OAuth authentication
 */

const ShopifyConnect = (function() {
  'use strict';

  let currentModal = null;

  /**
   * Generate secure random state for OAuth
   */
  function generateSecureState() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Create the connection modal
   */
  function createConnectionModal() {
    const modal = document.createElement('div');
    modal.className = 'shopify-modal-backdrop';
    modal.innerHTML = `
      <div class="shopify-modal">
        <div class="shopify-modal-header">
          <h2>Connect to Shopify</h2>
          <button class="shopify-modal-close">&times;</button>
        </div>
        <div class="shopify-modal-body">
          <div class="shopify-connect-form">
            <div class="form-group">
              <label for="shopify-store-url">Store URL</label>
              <div class="input-group">
                <input 
                  type="text" 
                  id="shopify-store-url" 
                  class="form-control" 
                  placeholder="mystore"
                  pattern="[a-zA-Z0-9-]+"
                  required
                >
                <span class="input-addon">.myshopify.com</span>
              </div>
              <small class="form-text">Enter your Shopify store subdomain</small>
            </div>
            
            <div class="shopify-permissions">
              <h4>This app will be able to:</h4>
              <ul>
                <li>✓ View and manage products</li>
                <li>✓ Create and update orders</li>
                <li>✓ Access customer information</li>
                <li>✓ Manage webhooks for order updates</li>
              </ul>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary shopify-cancel">Cancel</button>
              <button type="button" class="btn btn-primary shopify-connect" disabled>
                Connect Store
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    const closeBtn = modal.querySelector('.shopify-modal-close');
    const cancelBtn = modal.querySelector('.shopify-cancel');
    const connectBtn = modal.querySelector('.shopify-connect');
    const storeInput = modal.querySelector('#shopify-store-url');

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Enable/disable connect button based on input
    storeInput.addEventListener('input', (e) => {
      const isValid = e.target.value.match(/^[a-zA-Z0-9-]+$/);
      connectBtn.disabled = !isValid;
    });

    // Handle connection
    connectBtn.addEventListener('click', () => {
      const storeUrl = storeInput.value.trim();
      if (storeUrl) {
        initiateOAuth(storeUrl);
      }
    });

    return modal;
  }

  /**
   * Close the modal
   */
  function closeModal() {
    if (currentModal) {
      currentModal.remove();
      currentModal = null;
    }
  }

  /**
   * Initiate OAuth flow
   */
  function initiateOAuth(storeName) {
    // Generate and store state for verification
    const state = generateSecureState();
    sessionStorage.setItem('shopify_oauth_state', state);
    sessionStorage.setItem('shopify_store_name', storeName);

    // Get OAuth URL from backend
    const loadingBtn = currentModal.querySelector('.shopify-connect');
    const originalText = loadingBtn.textContent;
    loadingBtn.textContent = 'Redirecting...';
    loadingBtn.disabled = true;

    // Call backend to get OAuth URL
    fetch('/api/shopify/oauth/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        storeName: storeName,
        state: state
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.authUrl) {
        // Redirect to Shopify OAuth
        window.location.href = data.authUrl;
      } else {
        throw new Error('Failed to get authorization URL');
      }
    })
    .catch(error => {
      console.error('OAuth initiation failed:', error);
      loadingBtn.textContent = originalText;
      loadingBtn.disabled = false;
      showError('Failed to connect to Shopify. Please try again.');
    });
  }

  /**
   * Handle OAuth callback
   */
  function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = sessionStorage.getItem('shopify_oauth_state');
    const storeName = sessionStorage.getItem('shopify_store_name');

    // Verify state parameter
    if (!state || state !== storedState) {
      showError('Invalid authorization response. Please try connecting again.');
      return;
    }

    // Clear stored state
    sessionStorage.removeItem('shopify_oauth_state');
    sessionStorage.removeItem('shopify_store_name');

    if (code && storeName) {
      // Exchange code for access token
      completeOAuth(code, storeName);
    } else if (urlParams.get('error')) {
      showError(`Connection failed: ${urlParams.get('error_description') || 'Unknown error'}`);
    }
  }

  /**
   * Complete OAuth by exchanging code for token
   */
  function completeOAuth(code, storeName) {
    showLoading('Completing connection...');

    fetch('/api/shopify/oauth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        code: code,
        storeName: storeName
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccess('Successfully connected to Shopify!');
        // Reload to show connected state
        setTimeout(() => {
          window.location.href = '/portal/shopify';
        }, 1500);
      } else {
        throw new Error(data.error || 'Failed to complete connection');
      }
    })
    .catch(error => {
      console.error('OAuth completion failed:', error);
      showError('Failed to complete connection. Please try again.');
    });
  }

  /**
   * Show error message
   */
  function showError(message) {
    // TODO: Integrate with toast system
    alert('Error: ' + message);
  }

  /**
   * Show success message
   */
  function showSuccess(message) {
    // TODO: Integrate with toast system
    alert('Success: ' + message);
  }

  /**
   * Show loading state
   */
  function showLoading(message) {
    // TODO: Show loading indicator
    console.log('Loading:', message);
  }

  // Public API
  return {
    /**
     * Open the connection modal
     */
    openConnectionModal() {
      if (currentModal) return;
      
      currentModal = createConnectionModal();
      document.body.appendChild(currentModal);
      
      // Focus on input
      setTimeout(() => {
        const input = currentModal.querySelector('#shopify-store-url');
        if (input) input.focus();
      }, 100);
    },

    /**
     * Handle OAuth callback on page load
     */
    handleCallback() {
      if (window.location.pathname === '/shopify/callback') {
        handleOAuthCallback();
      }
    },

    /**
     * Check if store is connected
     */
    async checkConnection() {
      try {
        const response = await fetch('/api/shopify/connection/status', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const data = await response.json();
        return data.connected || false;
      } catch (error) {
        console.error('Failed to check connection:', error);
        return false;
      }
    }
  };
})();

// Make available globally
window.ShopifyConnect = ShopifyConnect;

// Check for OAuth callback on page load
document.addEventListener('DOMContentLoaded', () => {
  ShopifyConnect.handleCallback();
});