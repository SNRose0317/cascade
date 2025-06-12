/**
 * ProfileSettings.js
 * 
 * Component for managing user profile settings
 * This component renders the profile settings form and handles form submission
 */

import authService from '../utils/authService.js';
import { validateEmail } from '../utils/authValidation.js';

class ProfileSettings {
    constructor() {
        this.container = null;
        this.form = null;
        this.emailInput = null;
        this.companyInput = null;
        this.phoneInput = null;
        this.submitButton = null;
        this.userProfile = null;
        
        // Initialize component
        this.init();
    }
    
    /**
     * Initialize the profile settings component
     */
    init() {
        // This will be called when the component is needed
        // We'll populate the user data when it's rendered
    }
    
    /**
     * Render the profile settings form
     * @param {HTMLElement} container - The container to render the form in
     * @param {Object} userData - The user data to populate the form with
     */
    render(container, userData) {
        this.container = container;
        this.userProfile = userData || {};
        
        // Create form element
        this.form = document.createElement('form');
        this.form.className = 'auth-form';
        this.form.id = 'profile-settings-form';
        
        // Personal Information Section
        const personalSection = document.createElement('div');
        personalSection.className = 'profile-section';
        
        const personalTitle = document.createElement('h3');
        personalTitle.textContent = 'Personal Information';
        personalSection.appendChild(personalTitle);
        
        // Email input
        const emailGroup = document.createElement('div');
        emailGroup.className = 'form-group';
        
        const emailLabel = document.createElement('label');
        emailLabel.htmlFor = 'profile-email';
        emailLabel.textContent = 'Email';
        
        this.emailInput = document.createElement('input');
        this.emailInput.type = 'email';
        this.emailInput.className = 'form-control';
        this.emailInput.id = 'profile-email';
        this.emailInput.name = 'email';
        this.emailInput.placeholder = 'your@email.com';
        this.emailInput.value = this.userProfile.email || '';
        this.emailInput.required = true;
        
        const emailError = document.createElement('div');
        emailError.className = 'form-error';
        emailError.id = 'profile-email-error';
        
        emailGroup.appendChild(emailLabel);
        emailGroup.appendChild(this.emailInput);
        emailGroup.appendChild(emailError);
        
        // Company input (optional)
        const companyGroup = document.createElement('div');
        companyGroup.className = 'form-group';
        
        const companyLabel = document.createElement('label');
        companyLabel.htmlFor = 'profile-company';
        companyLabel.textContent = 'Company (Optional)';
        
        this.companyInput = document.createElement('input');
        this.companyInput.type = 'text';
        this.companyInput.className = 'form-control';
        this.companyInput.id = 'profile-company';
        this.companyInput.name = 'company';
        this.companyInput.placeholder = 'Your company';
        this.companyInput.value = this.userProfile.company || '';
        
        companyGroup.appendChild(companyLabel);
        companyGroup.appendChild(this.companyInput);
        
        // Phone input (optional)
        const phoneGroup = document.createElement('div');
        phoneGroup.className = 'form-group';
        
        const phoneLabel = document.createElement('label');
        phoneLabel.htmlFor = 'profile-phone';
        phoneLabel.textContent = 'Phone Number (Optional)';
        
        this.phoneInput = document.createElement('input');
        this.phoneInput.type = 'tel';
        this.phoneInput.className = 'form-control';
        this.phoneInput.id = 'profile-phone';
        this.phoneInput.name = 'phone';
        this.phoneInput.placeholder = 'Your phone number';
        this.phoneInput.value = this.userProfile.phone || '';
        
        phoneGroup.appendChild(phoneLabel);
        phoneGroup.appendChild(this.phoneInput);
        
        // Add personal info fields to section
        personalSection.appendChild(emailGroup);
        personalSection.appendChild(companyGroup);
        personalSection.appendChild(phoneGroup);
        
        // Submit button
        this.submitButton = document.createElement('button');
        this.submitButton.type = 'submit';
        this.submitButton.className = 'auth-submit-btn';
        
        const loader = document.createElement('span');
        loader.className = 'loader';
        
        const buttonText = document.createElement('span');
        buttonText.textContent = 'Save Changes';
        
        this.submitButton.appendChild(loader);
        this.submitButton.appendChild(buttonText);
        
        // Assemble form
        this.form.appendChild(personalSection);
        
        // Password Change Section
        const passwordSection = document.createElement('div');
        passwordSection.className = 'profile-section';
        
        const passwordTitle = document.createElement('h3');
        passwordTitle.textContent = 'Password';
        passwordSection.appendChild(passwordTitle);
        
        const passwordLink = document.createElement('a');
        passwordLink.href = '#';
        passwordLink.className = 'btn-outline';
        passwordLink.style.marginBottom = '20px';
        passwordLink.style.display = 'inline-block';
        passwordLink.textContent = 'Change Password';
        
        passwordSection.appendChild(passwordLink);
        
        // Add password change functionality
        passwordLink.addEventListener('click', (e) => {
            e.preventDefault();
            // You could open a modal or navigate to password change page
            if (typeof window.openForgotPasswordModal === 'function') {
                window.openForgotPasswordModal();
            }
        });
        
        this.form.appendChild(passwordSection);
        this.form.appendChild(this.submitButton);
        
        // Add form to container
        this.container.innerHTML = '';
        this.container.appendChild(this.form);
        
        // Add event listeners
        this.addEventListeners();
    }
    
    /**
     * Add event listeners to form elements
     */
    addEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input validation
        this.emailInput.addEventListener('blur', () => {
            this.validateField(this.emailInput, validateEmail, 'profile-email-error');
        });
    }
    
    /**
     * Validate a form field
     * @param {HTMLElement} input - The input element to validate
     * @param {Function} validationFn - The validation function to use
     * @param {string} errorId - The ID of the error element
     * @returns {boolean} - Whether the field is valid
     */
    validateField(input, validationFn, errorId) {
        const errorElement = document.getElementById(errorId);
        const { isValid, error } = validationFn(input.value);
        
        if (!isValid) {
            input.classList.add('error');
            errorElement.textContent = error;
            return false;
        } else {
            input.classList.remove('error');
            errorElement.textContent = '';
            return true;
        }
    }
    
    /**
     * Handle form submission
     * @param {Event} e - The submit event
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate required fields
        const isEmailValid = this.validateField(this.emailInput, validateEmail, 'profile-email-error');
        
        if (!isEmailValid) {
            return;
        }
        
        // Show loading state
        this.submitButton.classList.add('loading');
        this.submitButton.disabled = true;
        
        try {
            // Call the auth service update profile method
            const result = await authService.updateProfile({
                email: this.emailInput.value,
                company: this.companyInput.value,
                phone: this.phoneInput.value
            });
            
            // Handle successful update
            this.showAlert('Your profile has been updated successfully!', 'success');
            
            // Update the stored user profile
            this.userProfile = {
                ...this.userProfile,
                email: this.emailInput.value,
                company: this.companyInput.value,
                phone: this.phoneInput.value
            };
            
        } catch (error) {
            // Handle error
            this.showAlert(error.message || 'Failed to update profile. Please try again.');
        } finally {
            // Reset loading state
            this.submitButton.classList.remove('loading');
            this.submitButton.disabled = false;
        }
    }
    
    /**
     * Show an alert message in the form
     * @param {string} message - The message to display
     * @param {string} type - The type of alert (error or success)
     */
    showAlert(message, type = 'error') {
        // Remove any existing alerts
        const existingAlert = this.form.querySelector('.auth-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `auth-alert ${type}`;
        alert.textContent = message;
        
        // Insert at the top of the form
        this.form.insertBefore(alert, this.form.firstChild);
        
        // Auto-remove success alerts after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }
}

// Export the ProfileSettings class
export default ProfileSettings;
