/**
 * Complete Auth System - All-in-one solution
 * Combines auth state management with modal functionality
 */

console.log('🔐 Auth System: Loading complete auth system...');

// Auth State Management
const AuthState = {
    isAuthenticated() {
        const token = localStorage.getItem('web3diagnostics_auth_token');
        return !!token;
    },

    updateBodyClass() {
        const isAuth = this.isAuthenticated();
        console.log('🔄 Auth State: Updating body class, authenticated:', isAuth);
        
        if (isAuth) {
            document.body.classList.add('authenticated');
            console.log('✅ Auth State: Added authenticated class to body');
        } else {
            document.body.classList.remove('authenticated');
            console.log('✅ Auth State: Removed authenticated class from body');
        }
    },

    logout() {
        console.log('🔓 Auth State: Logging out...');
        localStorage.removeItem('web3diagnostics_auth_token');
        localStorage.removeItem('web3diagnostics_user_data');
        this.updateBodyClass();
        alert('Logged out successfully!');
        setTimeout(() => window.location.reload(), 500);
    }
};

// Complete Auth Modal with Toggle
const AuthModal = {
    modal: null,
    isOpen: false,
    currentMode: 'login',

    show(initialMode = 'login') {
        console.log('📱 Auth Modal: Showing modal, initial mode:', initialMode);
        
        this.hide();
        this.currentMode = initialMode;
        
        this.modal = document.createElement('div');
        this.modal.className = 'auth-modal-overlay';
        this.modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.85) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 999999 !important;
            padding: 1rem !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;

        this.modal.innerHTML = this.createModalHTML();
        document.body.appendChild(this.modal);
        this.isOpen = true;
        this.setupEventListeners();
        
        console.log('✅ Auth Modal: Modal created and displayed');
    },

    hide() {
        if (this.modal) {
            // Add smooth closing animation to both backdrop and content
            this.modal.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            this.modal.style.opacity = '0';
            
            const modalContent = this.modal.querySelector('.auth-modal-content');
            if (modalContent) {
                modalContent.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                modalContent.style.transform = 'scale(0.85) translateY(-20px)';
                modalContent.style.opacity = '0';
            }
            
            setTimeout(() => {
                if (this.modal && this.modal.parentNode) {
                    this.modal.parentNode.removeChild(this.modal);
                }
                this.modal = null;
                this.isOpen = false;
            }, 400);
        }
    },


    createModalHTML() {
        return `
            <div class="auth-modal-content" style="
                background: linear-gradient(135deg, #1B2432, #2A3544);
                color: white;
                padding: 0;
                border-radius: 1rem;
                max-width: 900px;
                width: 100%;
                max-height: 95vh;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.1);
                position: relative;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            ">
                <button class="modal-close" style="
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    transition: all 0.2s ease;
                ">
                    ×
                </button>
                
                <div style="
                    padding: 2rem 2rem 1rem 2rem;
                    text-align: center;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                ">
                    <h2 style="margin: 0 0 1rem 0; font-size: 1.5rem;">
                        Welcome to Web3 Diagnostics
                    </h2>
                    
                    <div class="auth-toggle" style="
                        display: flex;
                        background: rgba(255,255,255,0.1);
                        border-radius: 0.5rem;
                        padding: 0.25rem;
                        margin: 0 auto;
                        max-width: 300px;
                    ">
                        <button id="login-tab" class="toggle-btn ${this.currentMode === 'login' ? 'active' : ''}" style="
                            flex: 1;
                            padding: 0.75rem 1rem;
                            background: ${this.currentMode === 'login' ? '#2A5CAA' : 'transparent'};
                            color: white;
                            border: none;
                            border-radius: 0.25rem;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            font-weight: 500;
                        ">Sign In</button>
                        <button id="signup-tab" class="toggle-btn ${this.currentMode === 'signup' ? 'active' : ''}" style="
                            flex: 1;
                            padding: 0.75rem 1rem;
                            background: ${this.currentMode === 'signup' ? '#2A5CAA' : 'transparent'};
                            color: white;
                            border: none;
                            border-radius: 0.25rem;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            font-weight: 500;
                        ">Sign Up</button>
                    </div>
                </div>
                
                <div style="
                    padding: 2rem;
                    max-height: calc(95vh - 200px);
                    overflow-y: auto;
                ">
                    <div id="auth-content">
                        ${this.currentMode === 'login' ? this.createLoginForm() : this.createSignupForm()}
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes modalFadeIn {
                    from { 
                        opacity: 0; 
                        transform: scale(0.9) translateY(-20px);
                    }
                    to { 
                        opacity: 1; 
                        transform: scale(1) translateY(0);
                    }
                }
                
                .auth-modal-overlay {
                    animation: fadeInBackdrop 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .auth-modal-content {
                    animation: modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    will-change: transform, opacity;
                }
                
                @keyframes fadeInBackdrop {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* Smooth transitions for interactive elements */
                .modal-close {
                    transition: all 0.2s ease !important;
                }
                
                .modal-close:hover {
                    background: rgba(255,255,255,0.2) !important;
                    transform: scale(1.1);
                }
                
                .toggle-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                .toggle-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(42, 92, 170, 0.3);
                }
            </style>
        `;
    },

    createLoginForm() {
        return `
            <div class="login-form">
                <p style="text-align: center; color: rgba(255,255,255,0.7); margin: 0 0 2rem 0;">
                    Sign in to access your clinician portal
                </p>
                
                <form id="login-form" style="max-width: 400px; margin: 0 auto;">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: rgba(255,255,255,0.9);">
                            Email Address
                        </label>
                        <input type="email" id="login-email" required style="
                            width: 100%;
                            padding: 1rem;
                            border: 2px solid rgba(255,255,255,0.2);
                            border-radius: 0.5rem;
                            background: rgba(255,255,255,0.05);
                            color: white;
                            box-sizing: border-box;
                            font-size: 1rem;
                            transition: border-color 0.3s ease;
                        " placeholder="your@email.com" 
                        onfocus="this.style.borderColor='#2A5CAA'" 
                        onblur="this.style.borderColor='rgba(255,255,255,0.2)'">
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: rgba(255,255,255,0.9);">
                            Password
                        </label>
                        <input type="password" id="login-password" required style="
                            width: 100%;
                            padding: 1rem;
                            border: 2px solid rgba(255,255,255,0.2);
                            border-radius: 0.5rem;
                            background: rgba(255,255,255,0.05);
                            color: white;
                            box-sizing: border-box;
                            font-size: 1rem;
                            transition: border-color 0.3s ease;
                        " placeholder="••••••••"
                        onfocus="this.style.borderColor='#2A5CAA'" 
                        onblur="this.style.borderColor='rgba(255,255,255,0.2)'">
                    </div>
                    
                    <button type="submit" style="
                        width: 100%;
                        padding: 1rem;
                        background: linear-gradient(135deg, #2A5CAA, #3A6DBC);
                        color: white;
                        border: none;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 1rem;
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                        margin-bottom: 1rem;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(42,92,170,0.3)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        Sign In to Portal
                    </button>
                </form>
                
                <p style="text-align: center; margin: 2rem 0 0 0; font-size: 0.875rem; color: rgba(255,255,255,0.6);">
                    <strong>Demo:</strong> Use any email/password to login
                </p>
            </div>
        `;
    },

    createSignupForm() {
        return `
            <div class="signup-form">
                <p style="text-align: center; color: rgba(255,255,255,0.7); margin: 0 0 2rem 0;">
                    Create your account to get started
                </p>
                
                <form id="signup-form" style="max-width: 400px; margin: 0 auto;">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: rgba(255,255,255,0.9);">
                            Email Address
                        </label>
                        <input type="email" id="signup-email" required style="
                            width: 100%;
                            padding: 1rem;
                            border: 2px solid rgba(255,255,255,0.2);
                            border-radius: 0.5rem;
                            background: rgba(255,255,255,0.05);
                            color: white;
                            box-sizing: border-box;
                            font-size: 1rem;
                            transition: border-color 0.3s ease;
                        " placeholder="your@email.com" 
                        onfocus="this.style.borderColor='#2A5CAA'" 
                        onblur="this.style.borderColor='rgba(255,255,255,0.2)'">
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: rgba(255,255,255,0.9);">
                            Password
                        </label>
                        <input type="password" id="signup-password" required style="
                            width: 100%;
                            padding: 1rem;
                            border: 2px solid rgba(255,255,255,0.2);
                            border-radius: 0.5rem;
                            background: rgba(255,255,255,0.05);
                            color: white;
                            box-sizing: border-box;
                            font-size: 1rem;
                            transition: border-color 0.3s ease;
                        " placeholder="••••••••"
                        onfocus="this.style.borderColor='#2A5CAA'" 
                        onblur="this.style.borderColor='rgba(255,255,255,0.2)'">
                    </div>
                    
                    <button type="submit" style="
                        width: 100%;
                        padding: 1rem;
                        background: linear-gradient(135deg, #2A5CAA, #3A6DBC);
                        color: white;
                        border: none;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 1rem;
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                        margin-bottom: 1rem;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(42,92,170,0.3)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        Create Account
                    </button>
                </form>
                
                <p style="text-align: center; margin: 2rem 0 0 0; font-size: 0.875rem; color: rgba(255,255,255,0.6);">
                    <strong>Note:</strong> Additional profile information will be requested after signup
                </p>
            </div>
        `;
    },

    switchMode(newMode) {
        console.log('🔄 Auth Modal: Switching to mode:', newMode);
        this.currentMode = newMode;
        
        const contentDiv = this.modal.querySelector('#auth-content');
        contentDiv.innerHTML = newMode === 'login' ? this.createLoginForm() : this.createSignupForm();
        
        const loginTab = this.modal.querySelector('#login-tab');
        const signupTab = this.modal.querySelector('#signup-tab');
        
        if (newMode === 'login') {
            loginTab.style.background = '#2A5CAA';
            signupTab.style.background = 'transparent';
        } else {
            loginTab.style.background = 'transparent';
            signupTab.style.background = '#2A5CAA';
        }

        this.setupFormListeners();
    },

    setupEventListeners() {
        if (!this.modal) return;

        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hide();
            });
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Escape key to close
        const handleEscape = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hide();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        const loginTab = this.modal.querySelector('#login-tab');
        const signupTab = this.modal.querySelector('#signup-tab');
        
        if (loginTab) {
            loginTab.addEventListener('click', () => this.switchMode('login'));
        }
        
        if (signupTab) {
            signupTab.addEventListener('click', () => this.switchMode('signup'));
        }

        this.setupFormListeners();
    },

    setupFormListeners() {
        console.log('🔧 Auth Modal: Setting up form listeners...');
        
        const loginForm = this.modal.querySelector('#login-form');
        if (loginForm) {
            console.log('✅ Login form found, adding event listener');
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Simple signup form
        const signupForm = this.modal.querySelector('#signup-form');
        if (signupForm) {
            console.log('✅ Signup form found, adding event listener');
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }
    },

    handleLogin() {
        const email = this.modal.querySelector('#login-email').value;
        const password = this.modal.querySelector('#login-password').value;

        console.log('🔑 Auth Modal: Login attempt for:', email);

        const userData = {
            email: email,
            firstName: 'Demo',
            lastName: 'User',
            id: 'demo-user-' + Date.now()
        };

        this.handleAuthSuccess(userData, 'login');
    },

    handleSignup() {
        const email = this.modal.querySelector('#signup-email').value;
        const password = this.modal.querySelector('#signup-password').value;

        console.log('📝 Auth Modal: Signup attempt for:', email);

        const userData = {
            email: email,
            firstName: '',
            lastName: '',
            id: 'demo-user-' + Date.now()
        };

        // Note: In production, this would call the Cognito signup endpoint
        // For now, we're simulating success
        this.handleAuthSuccess(userData, 'signup');
    },

    handleSignupSuccess(signupData) {
        console.log('✅ Auth Modal: Comprehensive signup success:', signupData);

        // Transform comprehensive signup data to user data format
        const userData = {
            email: signupData.user?.email || signupData.email,
            firstName: signupData.user?.first_name || signupData.firstName,
            lastName: signupData.user?.last_name || signupData.lastName,
            id: 'demo-user-' + Date.now(),
            clinician: signupData.clinician
        };

        this.handleAuthSuccess(userData, 'signup');
    },

    async handleAuthSuccess(userData, type) {
        console.log('✅ Auth Modal: Auth success:', type, userData);

        const token = 'demo-token-' + Date.now(); // Will be real token from Cognito
        localStorage.setItem('web3diagnostics_auth_token', token);
        localStorage.setItem('web3diagnostics_user_data', JSON.stringify(userData));

        // Update auth state
        AuthState.updateBodyClass();
        
        // Hide modal first
        this.hide();

        try {
            // DEVELOPMENT: Use auth bridge to create customer
            // In production, this is handled by Lambda functions
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('🌉 Using auth bridge for customer creation...');
                
                // Load the auth bridge module
                const authBridgeModule = await import('./services/authBridge.js');
                const authBridge = authBridgeModule.default;
                
                // Create customer and get customer ID
                const customerId = await authBridge.handlePostAuth(userData);
                console.log('🌉 Customer created with ID:', customerId);
                
                // Add customer_id to userData for consistency
                userData.customer_id = customerId;
            }
            
            // Initialize CustomerDataService if available
            if (window.CustomerDataService) {
                console.log('🔄 Initializing customer data...');
                
                // If we have a customer_id from auth response, store it
                if (userData.customer_id) {
                    localStorage.setItem('web3diagnostics_customer_id', userData.customer_id);
                }
                
                // Fetch full customer profile
                const profileLoaded = await window.CustomerDataService.fetchCustomerProfile();
                
                if (!profileLoaded) {
                    console.warn('⚠️ Customer profile not found, redirecting to onboarding...');
                    window.location.href = '/src/portal/features/account-management/pages/profile-onboarding.html';
                    return;
                }
            }

            // Show success message
            const message = type === 'login' ? 
                'Welcome back! Loading your dashboard...' : 
                'Account created successfully! Setting up your profile...';
            alert(message);

            // Check for stored redirect URL
            const redirectUrl = localStorage.getItem('auth_redirect') || 
                              '/src/portal/features/dashboard/pages/index.html';
            localStorage.removeItem('auth_redirect');
            
            // Now redirect with customer data available
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 500);
            
        } catch (error) {
            console.error('❌ Error loading customer data:', error);
            alert('Error loading your profile. Please try logging in again.');
            AuthState.logout();
        }
    }
};

// Event Handler Setup
const AuthEventHandler = {
    init() {
        console.log('🎬 Auth Event Handler: Initializing...');
        
        // Set up global click handler for auth actions
        document.addEventListener('click', (e) => {
            const target = e.target;
            console.log('🎬 Auth Event Handler: Click detected on:', target.tagName, target.id, target.className);
            
            // Check multiple ways to find auth action
            let authAction = target.dataset.authAction;
            let authElement = target;
            
            // If not found on target, check closest element with data-auth-action
            if (!authAction) {
                authElement = target.closest('[data-auth-action]');
                if (authElement) {
                    authAction = authElement.dataset.authAction;
                }
            }
            
            console.log('🎬 Auth Event Handler: Auth action found:', authAction, 'on element:', authElement);
            
            if (authAction) {
                e.preventDefault();
                console.log('🎬 Auth Event Handler: Auth action triggered:', authAction);
                
                switch (authAction) {
                    case 'login':
                        console.log('🎬 Auth Event Handler: Showing login modal...');
                        AuthModal.show('login');
                        break;
                    case 'signup':
                        console.log('🎬 Auth Event Handler: Showing signup modal...');
                        AuthModal.show('signup');
                        break;
                    case 'logout':
                        console.log('🎬 Auth Event Handler: Logging out...');
                        AuthState.logout();
                        break;
                    case 'profile':
                        console.log('🎬 Auth Event Handler: Accessing profile...');
                        if (AuthState.isAuthenticated()) {
                            window.location.href = '/portal/features/account-management/pages/account.html';
                        } else {
                            alert('Please log in first');
                        }
                        break;
                }
            } else {
                // Debug: Log when no auth action found
                if (target.id === 'auth-signup-btn' || target.textContent.includes('Get Started') || target.textContent.includes('Log-In')) {
                    console.log('🎬 Auth Event Handler: Auth-related element clicked but no action found:', target);
                    console.log('🎬 Auth Event Handler: Element attributes:', target.attributes);
                    console.log('🎬 Auth Event Handler: Dataset:', target.dataset);
                }
            }
        });

        console.log('✅ Auth Event Handler: Initialization complete');
    }
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Auth System: DOM ready, initializing...');
    AuthState.updateBodyClass();
    AuthEventHandler.init();
    
    // Additional initialization to ensure Get Started button works
    setTimeout(() => {
        const getStartedBtn = document.getElementById('auth-signup-btn');
        const navLoginBtn = document.querySelector('[data-auth-action="login"]');
        
        if (getStartedBtn) {
            console.log('✅ Auth System: Get Started button found and verified');
            // Ensure it has the correct data attribute
            if (!getStartedBtn.hasAttribute('data-auth-action')) {
                getStartedBtn.setAttribute('data-auth-action', 'signup');
                console.log('✅ Auth System: Added data-auth-action to Get Started button');
            }
        } else {
            console.log('⚠️  Auth System: Get Started button not found');
        }
        
        if (navLoginBtn) {
            console.log('✅ Auth System: Navigation login button found and verified');
        } else {
            console.log('⚠️  Auth System: Navigation login button not found');
        }
    }, 100);
    
    console.log('✅ Auth System: All components initialized');
});

// Make objects globally available
window.AuthState = AuthState;
window.AuthModal = AuthModal;
window.AuthEventHandler = AuthEventHandler;

// For backward compatibility
window.AuthFix = AuthState;

console.log('✅ Auth System: Complete auth system loaded successfully');