/**
 * Portal Header Component
 * Standardized navigation component for all portal pages
 */

console.log('🔄 Loading PortalHeader.js...');

window.PortalHeader = (function() {
    'use strict';
    
    console.log('🔄 PortalHeader module initialized');

    // Configuration for different page types
    const PAGE_CONFIGS = {
        'dashboard': { title: 'Dashboard', active: 'index.html' },
        'account': { title: 'Profile', active: 'account.html' },
        'configuration': { title: 'Configuration', active: 'sync-configuration.html' },
        'sync': { title: 'Sync', active: 'sync.html' }
    };

    /**
     * Generate the standardized header HTML
     * @param {string} currentPage - Current page identifier
     * @param {string} activeAccountSection - Active account dropdown section
     * @returns {string} Header HTML
     */
    function generateHeaderHTML(currentPage = 'dashboard', activeAccountSection = 'profile') {
        return `
            <header>
                <div class="container">
                    <div class="logo">
                        <a href="/index.html">
                            <img src="/src/assets/images/logo.png" alt="Web3 Diagnostics Logo">
                        </a>
                    </div>
                    <nav>
                        <ul>
                            <li><a href="/index.html">Home</a></li>
                            <li><a href="/src/portal/features/dashboard/pages/index.html" class="${currentPage === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
                            <li><a href="/src/portal/features/lab-discovery/pages/index.html" class="${currentPage === 'discovery' ? 'active' : ''}">Lab Discovery</a></li>
                            <li><a href="/src/portal/features/evexia-integration/pages/sync.html" class="${currentPage === 'sync' ? 'active' : ''}">Sync</a></li>
                        </ul>
                    </nav>
                    <div class="nav-actions">
                        <a href="/index.html" class="nav-link">Home</a>
                        <a href="/src/portal/features/account-management/pages/account.html" class="nav-link ${currentPage === 'account' ? 'active' : ''}">My Profile</a>
                        <a href="#" class="nav-link" data-auth-action="logout">Logout</a>
                        
                        <div class="search">
                            <input type="text" placeholder="Search for tests...">
                            <button><i class="fas fa-search"></i></button>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    /**
     * Load and initialize debug toggle for development
     * 
     * NOTE: DebugToggle has been moved to standalone debugger tool.
     * For debugging, use /debugger-tool/ instead of embedded toggle.
     */
    function initializeDebugToggle() {
        // Only load services in development environment
        const isDevelopment = window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1' ||
                             window.location.hostname.includes('localhost');
        
        if (!isDevelopment) {
            console.log('🚫 Production environment - Debug services disabled');
            return;
        }

        // Load Customer Data Service and API Service (still needed for portal functionality)
        const customerDataScript = document.createElement('script');
        customerDataScript.src = '/src/portal/core/shared/services/CustomerDataService.js';
        document.head.appendChild(customerDataScript);
        
        // Load Customer API Service
        const customerApiScript = document.createElement('script');
        customerApiScript.src = '/src/portal/core/shared/services/customerApiService.js';
        document.head.appendChild(customerApiScript);
        
        // Wait for CustomerDataService to load
        customerDataScript.onload = () => {
            console.log('✅ CustomerDataService loaded');
            
            // Initialize CustomerDataService
            if (window.CustomerDataService) {
                window.CustomerDataService.init();
            }
            
            // Debug toggle is now standalone - inform developers
            console.log('🛠️  For debugging, visit: /debugger-tool/');
        };
    }

    /**
     * Initialize the portal header
     * @param {Object} options - Configuration options
     */
    function init(options = {}) {
        console.log('🔄 PortalHeader.init() called with options:', options);
        
        const config = {
            currentPage: options.currentPage || 'dashboard',
            activeAccountSection: options.activeAccountSection || 'profile',
            containerId: options.containerId || 'portal-header'
        };
        
        console.log('🔄 PortalHeader config:', config);

        // Find existing header or create container
        let headerContainer = document.getElementById(config.containerId);
        if (!headerContainer) {
            // Replace existing header if it exists
            const existingHeader = document.querySelector('header');
            if (existingHeader) {
                headerContainer = document.createElement('div');
                headerContainer.id = config.containerId;
                existingHeader.parentNode.replaceChild(headerContainer, existingHeader);
            } else {
                // Create new header container at beginning of body
                headerContainer = document.createElement('div');
                headerContainer.id = config.containerId;
                document.body.insertBefore(headerContainer, document.body.firstChild);
            }
        }

        // Inject header HTML (replacing any fallback content)
        console.log('🔄 Injecting header HTML into container:', config.containerId);
        headerContainer.innerHTML = generateHeaderHTML(config.currentPage, config.activeAccountSection);
        console.log('✅ Header HTML injected successfully');

        // Initialize navigation functionality
        initializeNavigation();

        // Initialize debug toggle for development (centralized for all portal pages)
        initializeDebugToggle();

        console.log('✅ Portal Header component initialized for page:', config.currentPage);
    }

    /**
     * Initialize navigation functionality
     */
    function initializeNavigation() {
        // Handle logout action
        const logoutLink = document.querySelector('[data-auth-action="logout"]');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        }
        
        console.log('✅ Navigation initialized');
    }

    /**
     * Handle logout functionality
     */
    function handleLogout() {
        // Clear any stored authentication data
        localStorage.removeItem('web3diagnostics_auth_token');
        localStorage.removeItem('web3diagnostics_refresh_token');
        localStorage.removeItem('web3diagnostics_user_data');
        
        // Redirect to home page
        window.location.href = '/index.html';
    }

    /**
     * Update active states
     * @param {string} currentPage - Current page identifier
     * @param {string} activeAccountSection - Active account section
     */
    function updateActiveStates(currentPage, activeAccountSection) {
        // Update portal submenu active states
        const submenuLinks = document.querySelectorAll('.portal-submenu a');
        submenuLinks.forEach(link => {
            link.classList.remove('active');
            if (PAGE_CONFIGS[currentPage] && link.getAttribute('href') === PAGE_CONFIGS[currentPage].active) {
                link.classList.add('active');
            }
        });

        // Update account dropdown active states
        const accountLinks = document.querySelectorAll('.account-dropdown-menu .dropdown-item');
        accountLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const activeAccountLink = document.querySelector(`.account-dropdown-menu .dropdown-item[href*="${activeAccountSection}"]`);
        if (activeAccountLink) {
            activeAccountLink.classList.add('active');
        }
    }

    // Public API
    return {
        init: init,
        updateActiveStates: updateActiveStates,
        generateHeaderHTML: generateHeaderHTML
    };
})();