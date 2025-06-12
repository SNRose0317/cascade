/**
 * ProfileDropdown.js
 * 
 * Component for displaying the user profile dropdown menu
 * This provides navigation to profile settings, dashboard, and logout
 */

import authState from '../utils/authState.js';

class ProfileDropdown {
    constructor() {
        this.dropdownContainer = null;
        this.dropdownTrigger = null;
        this.dropdown = null;
        this.isOpen = false;
        
        // Initialize component
        this.init();
    }
    
    /**
     * Initialize the profile dropdown
     */
    init() {
        // Create the dropdown container if it doesn't exist
        if (!this.dropdownContainer) {
            // Create container
            this.dropdownContainer = document.createElement('div');
            this.dropdownContainer.className = 'profile-dropdown-container';
            
            // Create dropdown trigger
            this.dropdownTrigger = document.createElement('button');
            this.dropdownTrigger.className = 'profile-dropdown-trigger';
            this.dropdownTrigger.setAttribute('data-auth-only', '');
            
            // Create user avatar/icon
            const avatar = document.createElement('div');
            avatar.className = 'user-avatar';
            
            const avatarInitials = document.createElement('span');
            avatarInitials.className = 'avatar-initials';
            avatarInitials.textContent = 'U';
            
            avatar.appendChild(avatarInitials);
            this.dropdownTrigger.appendChild(avatar);
            
            // Create dropdown menu
            this.dropdown = document.createElement('div');
            this.dropdown.className = 'profile-dropdown';
            
            // Create dropdown items
            const menuItems = [
                { text: 'My Profile', action: 'profile', icon: 'user' },
                { text: 'Dashboard', action: 'dashboard', icon: 'tachometer-alt' },
                { text: 'Settings', action: 'settings', icon: 'cog' },
                { text: 'Logout', action: 'logout', icon: 'sign-out-alt' }
            ];
            
            // Create and append menu items
            menuItems.forEach(item => {
                const menuItem = document.createElement('a');
                menuItem.href = '#';
                menuItem.className = 'dropdown-item';
                menuItem.dataset.authAction = item.action;
                
                const icon = document.createElement('i');
                icon.className = `fas fa-${item.icon}`;
                
                const text = document.createElement('span');
                text.textContent = item.text;
                
                menuItem.appendChild(icon);
                menuItem.appendChild(text);
                
                this.dropdown.appendChild(menuItem);
            });
            
            // Assemble dropdown
            this.dropdownContainer.appendChild(this.dropdownTrigger);
            this.dropdownContainer.appendChild(this.dropdown);
            
            // Add event listeners
            this.addEventListeners();
            
            // Find a place to append the dropdown
            this.appendToDOM();
            
            // Update display based on auth state
            this.updateDisplay();
            
            // Listen for auth state changes
            authState.addEventListener('login', (user) => this.updateDisplay(user));
            authState.addEventListener('logout', () => this.updateDisplay());
            authState.addEventListener('profileUpdate', (user) => this.updateDisplay(user));
        }
    }
    
    /**
     * Add event listeners to the dropdown
     * @private
     */
    addEventListeners() {
        // Toggle dropdown on click
        this.dropdownTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.dropdownContainer.contains(e.target)) {
                this.closeDropdown();
            }
        });
        
        // Close dropdown when pressing escape
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && e.key === 'Escape') {
                this.closeDropdown();
            }
        });
    }
    
    /**
     * Append the dropdown to the DOM
     * @private
     */
    appendToDOM() {
        // Look for the nav-actions container
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            navActions.appendChild(this.dropdownContainer);
        } else {
            // Fallback to appending to the header
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(this.dropdownContainer);
            }
        }
    }
    
    /**
     * Update the display based on the current user
     * @param {Object} user - The current user data
     * @private
     */
    updateDisplay(user) {
        // Get the user if not provided
        if (!user && authState.isAuthenticated()) {
            user = authState.getCurrentUser();
        }
        
        // If we have a user, update the avatar
            if (user) {
                const avatarInitials = this.dropdownTrigger.querySelector('.avatar-initials');
                if (avatarInitials) {
                    // Create initials from email
                    let initials = 'U';
                    if (user.email) {
                        // Use first letter of email
                        initials = user.email[0].toUpperCase();
                    }
                    
                    avatarInitials.textContent = initials.toUpperCase();
                }
            
            // Update profile link text
            const profileLink = this.dropdown.querySelector('[data-auth-action="profile"]');
            if (profileLink) {
                const textSpan = profileLink.querySelector('span');
                if (textSpan) {
                    textSpan.textContent = 'My Profile';
                }
            }
        }
    }
    
    /**
     * Toggle the dropdown visibility
     * @private
     */
    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    /**
     * Open the dropdown
     * @private
     */
    openDropdown() {
        this.dropdown.classList.add('active');
        this.isOpen = true;
    }
    
    /**
     * Close the dropdown
     * @private
     */
    closeDropdown() {
        this.dropdown.classList.remove('active');
        this.isOpen = false;
    }
}

// Export the ProfileDropdown class
export default ProfileDropdown;
