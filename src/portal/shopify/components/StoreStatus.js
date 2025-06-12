/**
 * StoreStatus.js - Display Shopify store connection status
 * Shows current connection state and store information
 */

const StoreStatus = (function() {
  'use strict';

  let statusContainer = null;
  let refreshInterval = null;

  /**
   * Create status display HTML
   */
  function createStatusHTML(storeInfo) {
    if (!storeInfo || !storeInfo.connected) {
      return `
        <div class="shopify-status disconnected">
          <div class="status-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
          </div>
          <div class="status-content">
            <h3>No Store Connected</h3>
            <p>Connect your Shopify store to start syncing orders</p>
            <button class="btn btn-primary" onclick="ShopifyConnect.openConnectionModal()">
              Connect Store
            </button>
          </div>
        </div>
      `;
    }

    const lastSync = storeInfo.lastSync ? new Date(storeInfo.lastSync).toLocaleString() : 'Never';
    const syncStatus = storeInfo.syncStatus || 'idle';
    
    return `
      <div class="shopify-status connected">
        <div class="status-header">
          <div class="status-icon success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="status-info">
            <h3>${storeInfo.storeName}</h3>
            <p class="status-url">${storeInfo.storeUrl}</p>
          </div>
          <div class="status-actions">
            <button class="btn btn-sm btn-secondary" onclick="StoreStatus.refreshStatus()">
              Refresh
            </button>
            <button class="btn btn-sm btn-danger" onclick="StoreStatus.disconnectStore()">
              Disconnect
            </button>
          </div>
        </div>
        
        <div class="status-details">
          <div class="detail-item">
            <span class="detail-label">Status:</span>
            <span class="detail-value status-${syncStatus}">${syncStatus}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Last Sync:</span>
            <span class="detail-value">${lastSync}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Products Mapped:</span>
            <span class="detail-value">${storeInfo.mappedProducts || 0} / ${storeInfo.totalProducts || 0}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Pending Orders:</span>
            <span class="detail-value">${storeInfo.pendingOrders || 0}</span>
          </div>
        </div>
        
        ${syncStatus === 'syncing' ? `
          <div class="sync-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${storeInfo.syncProgress || 0}%"></div>
            </div>
            <p class="sync-message">${storeInfo.syncMessage || 'Syncing orders...'}</p>
          </div>
        ` : ''}
        
        ${storeInfo.lastError ? `
          <div class="status-error">
            <strong>Last Error:</strong> ${storeInfo.lastError}
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Fetch store status from API
   */
  async function fetchStoreStatus() {
    try {
      const response = await fetch('/api/shopify/connection/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch store status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching store status:', error);
      return { connected: false, error: error.message };
    }
  }

  /**
   * Update the status display
   */
  async function updateStatus() {
    if (!statusContainer) return;
    
    const storeInfo = await fetchStoreStatus();
    statusContainer.innerHTML = createStatusHTML(storeInfo);
    
    // Update sync button state if syncing
    if (storeInfo.syncStatus === 'syncing') {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  }

  /**
   * Start auto-refresh when syncing
   */
  function startAutoRefresh() {
    if (refreshInterval) return;
    refreshInterval = setInterval(updateStatus, 2000); // Refresh every 2 seconds
  }

  /**
   * Stop auto-refresh
   */
  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }

  /**
   * Disconnect store
   */
  async function disconnectStore() {
    if (!confirm('Are you sure you want to disconnect your Shopify store? This will stop all order syncing.')) {
      return;
    }

    try {
      const response = await fetch('/api/shopify/connection', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect store');
      }

      // Refresh status
      await updateStatus();
      
      // Show success message
      if (window.toastSystem) {
        window.toastSystem.showSuccess('Store disconnected successfully');
      }
    } catch (error) {
      console.error('Error disconnecting store:', error);
      if (window.toastSystem) {
        window.toastSystem.showError('Failed to disconnect store');
      }
    }
  }

  // Public API
  return {
    /**
     * Initialize the status display
     * @param {string|HTMLElement} container - Container element or selector
     */
    init(container) {
      if (typeof container === 'string') {
        statusContainer = document.querySelector(container);
      } else {
        statusContainer = container;
      }
      
      if (!statusContainer) {
        console.error('StoreStatus: Container not found');
        return;
      }
      
      // Initial load
      updateStatus();
      
      // Refresh every 30 seconds
      setInterval(updateStatus, 30000);
    },

    /**
     * Manually refresh status
     */
    refreshStatus() {
      updateStatus();
    },

    /**
     * Disconnect the store
     */
    disconnectStore() {
      disconnectStore();
    },

    /**
     * Cleanup
     */
    destroy() {
      stopAutoRefresh();
      if (statusContainer) {
        statusContainer.innerHTML = '';
        statusContainer = null;
      }
    }
  };
})();

// Make available globally
window.StoreStatus = StoreStatus;