/**
 * ForgotPassword.js
 * 
 * Component for handling password reset requests
 * This component renders the forgot password form and handles form submission
 */

import authService from '../utils/authService.js';
import { validateEmail } from '../utils/authValidation.js';

class ForgotPassword {
    constructor(modalInstance) {
        this.modal = modalInstance;
        this.formContainer = document.getElementById('forgot-password-container');
        this.form = null;
        this.emailInput = null;
        this.submitButton = null;
        
        // Initialize form
        this.init();
    }
    
    /**
     * Initialize the forgot password form
     */
    init() {
        // Create form if it doesn't exist
        if (!this.form) {
            // Create form element
            this.form = document.createElement('form');
            this.form.className = 'auth-form';
            this.form.id = 'forgot-password-form';
            
            // Email input
            const emailGroup = document.createElement('div');
            emailGroup.className = 'form-group';
            
            const emailLabel = document.createElement('label');
            emailLabel.htmlFor = 'forgot-password-email';
            emailLabel.textContent = 'Email';
            
            this.emailInput = document.createElement('input');
            this.emailInput.type = 'email';
            this.emailInput.className = 'form-control';
            this.emailInput.id = 'forgot-password-email';
            this.emailInput.name = 'email';
            this.emailInput.placeholder = 'your@email.com';
            this.emailInput.required = true;
            
            const emailError = document.createElement('div');
            emailError.className = 'form-error';
            emailError.id = 'forgot-password-email-error';
            
            emailGroup.appendChild(emailLabel);
            emailGroup.appendChild(this.emailInput);
            emailGroup.appendChild(emailError);
            
            // Instructions
            const instructions = document.createElement('p');
            instructions.style.color = 'var(--gray-text)';
            instructions.style.fontSize = '14px';
            instructions.style.marginBottom = '20px';
            instructions.textContent = 'Enter your email address and we will send you instructions to reset your password.';
            
            // Submit button
            this.submitButton = document.createElement('button');
            this.submitButton.type = 'submit';
            this.submitButton.className = 'auth-submit-btn';
            
            const loader = document.createElement('span');
            loader.className = 'loader';
            
            const buttonText = document.createElement('span');
            buttonText.textContent = 'Send Reset Link';
            
            this.submitButton.appendChild(loader);
            this.submitButton.appendChild(buttonText);
            
            // Back to login link
            const backLink = document.createElement('div');
            backLink.className = 'form-group';
            backLink.style.textAlign = 'center';
            backLink.style.marginTop = '15px';
            
            const backText = document.createElement('a');
            backText.href = '#';
            backText.className = 'form-link';
            backText.textContent = 'Back to Login';
            
            backLink.appendChild(backText);
            
            // Add back to login functionality
            backLink.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                this.modal.switchTab('login');
            });
            
            // Assemble form
            this.form.appendChild(instructions);
            this.form.appendChild(emailGroup);
            this.form.appendChild(this.submitButton);
            this.form.appendChild(backLink);
            
            // Add form to container
            this.formContainer.innerHTML = '';
            this.formContainer.appendChild(this.form);
            
            // Add event listeners
            this.addEventListeners();
        }
    }
    
    /**
     * Add event listeners to form elements
     */
    addEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input validation
        this.emailInput.addEventListener('blur', () => {
            this.validateField(this.emailInput, validateEmail, 'forgot-password-email-error');
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
        
        // Validate email
        const isEmailValid = this.validateField(this.emailInput, validateEmail, 'forgot-password-email-error');
        
        if (!isEmailValid) {
            return;
        }
        
        // Show loading state
        this.submitButton.classList.add('loading');
        this.submitButton.disabled = true;
        
        try {
            // Call the auth service forgot password method
            const result = await authService.forgotPassword({
                email: this.emailInput.value
            });
            
            // Handle successful request
            this.modal.showAlert('Password reset instructions have been sent to your email.', 'success');
            
            // Clear the form
            this.reset();
            
            // Optionally switch back to login after a delay
            setTimeout(() => {
                this.modal.switchTab('login');
            }, 3000);
            
        } catch (error) {
            // Handle error
            this.modal.showAlert(error.message || 'Failed to send password reset email. Please try again.');
        } finally {
            // Reset loading state
            this.submitButton.classList.remove('loading');
            this.submitButton.disabled = false;
        }
    }
    
    /**
     * Reset the form
     */
    reset() {
        this.form.reset();
        const errorElement = document.getElementById('forgot-password-email-error');
        errorElement.textContent = '';
        this.emailInput.classList.remove('error');
    }
}

// Export the ForgotPassword class
export default ForgotPassword;
