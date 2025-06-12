# CLAUDE.md - Shopify Integration Module
Version: 1.0
Last Updated: December 6, 2024
Directory: /src/portal/shopify/
Branch: 07-shopify/integration
Purpose: Shopify order synchronization and management

## 📁 Module Overview
This module handles the integration between Evexia lab orders and Shopify for order fulfillment.

## 🏗️ Structure
```
shopify/
├── components/
│   ├── ShopifyConnect.js      # OAuth flow UI
│   ├── StoreStatus.js         # Connection status display
│   ├── ProductMapper.js       # Map Evexia tests to Shopify products
│   ├── SyncDashboard.js       # Order sync monitoring
│   ├── OrderSyncLog.js        # Sync history view
│   └── IntegrationSettings.js # Configuration UI
├── services/
│   ├── shopifyAuth.js         # OAuth implementation
│   ├── shopifyApi.js          # Shopify API wrapper
│   ├── orderSync.js           # Order synchronization logic
│   ├── productMapping.js      # Product mapping service
│   └── webhookHandler.js      # Process Shopify webhooks
├── hooks/
│   ├── useShopifyStore.js     # Store connection state
│   └── useSyncStatus.js       # Sync monitoring hooks
└── styles/
    └── shopify.css            # Module-specific styles
```

## 🔧 Key Features
1. **OAuth Connection**: Secure store connection
2. **Product Mapping**: Link Evexia tests to Shopify products
3. **Order Sync**: Automatic order creation in Shopify
4. **Status Monitoring**: Real-time sync status
5. **Error Recovery**: Retry logic and error handling

## 🔗 Dependencies
- Evexia integration for lab orders
- Customer data service for user info
- API client for backend calls
- Auth system for secure access

## ⚠️ Critical Implementation Notes
- Never store Shopify access tokens in frontend
- Validate all product mappings before sync
- Implement proper webhook signature verification
- Handle Shopify API rate limits
- Use queue-based sync for reliability