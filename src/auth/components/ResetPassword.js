/**
 * ResetPassword.js
 * 
 * Component for handling password reset
 * This component renders the reset password form and handles form submission
 */

import authService from '../utils/authService.js';
import { validatePassword } from '../utils/authValidation.js';

class ResetPassword {
    constructor(modalInstance) {
        this.modal = modalInstance;
        this.formContainer = document.getElementById('reset-password-container');
        this.form = null;
        this.passwordInput = null;
        this.confirmPasswordInput = null;
        this.submitButton = null;
        this.resetToken = null;
        
        // Initialize form
        this.init();
    }
    
    /**
     * Initialize the reset password form
     */
    init() {
        // Create form if it doesn't exist
        if (!this.form) {
            // Create form element
            this.form = document.createElement('form');
            this.form.className = 'auth-form';
            this.form.id = 'reset-password-form';
            
            // Instructions
            const instructions = document.createElement('p');
            instructions.style.color = 'var(--gray-text)';
            instructions.style.fontSize = '14px';
            instructions.style.marginBottom = '20px';
            instructions.textContent = 'Enter your new password below.';
            
            // Password input
            const passwordGroup = document.createElement('div');
            passwordGroup.className = 'form-group';
            
            const passwordLabel = document.createElement('label');
            passwordLabel.htmlFor = 'reset-password';
            passwordLabel.textContent = 'New Password';
            
            this.passwordInput = document.createElement('input');
            this.passwordInput.type = 'password';
            this.passwordInput.className = 'form-control';
            this.passwordInput.id = 'reset-password';
            this.passwordInput.name = 'password';
            this.passwordInput.placeholder = '••••••••';
            this.passwordInput.required = true;
            
            const passwordError = document.createElement('div');
            passwordError.className = 'form-error';
            passwordError.id = 'reset-password-error';
            
            // Password strength meter
            const strengthMeter = document.createElement('div');
            strengthMeter.className = 'password-strength';
            
            const strengthMeterBar = document.createElement('div');
            strengthMeterBar.className = 'strength-meter';
            
            const strengthMeterSpan = document.createElement('span');
            strengthMeterSpan.id = 'reset-password-strength-meter';
            
            const strengthText = document.createElement('div');
            strengthText.className = 'strength-text';
            strengthText.id = 'reset-password-strength-text';
            
            strengthMeterBar.appendChild(strengthMeterSpan);
            strengthMeter.appendChild(strengthMeterBar);
            strengthMeter.appendChild(strengthText);
            
            passwordGroup.appendChild(passwordLabel);
            passwordGroup.appendChild(this.passwordInput);
            passwordGroup.appendChild(passwordError);
            passwordGroup.appendChild(strengthMeter);
            
            // Confirm Password input
            const confirmPasswordGroup = document.createElement('div');
            confirmPasswordGroup.className = 'form-group';
            
            const confirmPasswordLabel = document.createElement('label');
            confirmPasswordLabel.htmlFor = 'reset-confirm-password';
            confirmPasswordLabel.textContent = 'Confirm New Password';
            
            this.confirmPasswordInput = document.createElement('input');
            this.confirmPasswordInput.type = 'password';
            this.confirmPasswordInput.className = 'form-control';
            this.confirmPasswordInput.id = 'reset-confirm-password';
            this.confirmPasswordInput.name = 'confirmPassword';
            this.confirmPasswordInput.placeholder = '••••••••';
            this.confirmPasswordInput.required = true;
            
            const confirmPasswordError = document.createElement('div');
            confirmPasswordError.className = 'form-error';
            confirmPasswordError.id = 'reset-confirm-password-error';
            
            confirmPasswordGroup.appendChild(confirmPasswordLabel);
            confirmPasswordGroup.appendChild(this.confirmPasswordInput);
            confirmPasswordGroup.appendChild(confirmPasswordError);
            
            // Submit button
            this.submitButton = document.createElement('button');
            this.submitButton.type = 'submit';
            this.submitButton.className = 'auth-submit-btn';
            
            const loader = document.createElement('span');
            loader.className = 'loader';
            
            const buttonText = document.createElement('span');
            buttonText.textContent = 'Reset Password';
            
            this.submitButton.appendChild(loader);
            this.submitButton.appendChild(buttonText);
            
            // Hidden reset token input
            this.tokenInput = document.createElement('input');
            this.tokenInput.type = 'hidden';
            this.tokenInput.id = 'reset-token';
            this.tokenInput.name = 'token';
            
            // Assemble form
            this.form.appendChild(instructions);
            this.form.appendChild(passwordGroup);
            this.form.appendChild(confirmPasswordGroup);
            this.form.appendChild(this.tokenInput);
            this.form.appendChild(this.submitButton);
            
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
        this.passwordInput.addEventListener('input', () => {
            this.checkPasswordStrength();
        });
        
        this.passwordInput.addEventListener('blur', () => {
            this.validateField(this.passwordInput, validatePassword, 'reset-password-error');
        });
        
        this.confirmPasswordInput.addEventListener('blur', () => {
            this.validateConfirmPassword();
        });
    }
    
    /**
     * Set the reset token
     * @param {string} token - The reset token from the URL
     */
    setResetToken(token) {
        this.resetToken = token;
        if (this.tokenInput) {
            this.tokenInput.value = token;
        }
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
     * Validate the confirm password field
     * @returns {boolean} - Whether the passwords match
     */
    validateConfirmPassword() {
        const errorElement = document.getElementById('reset-confirm-password-error');
        
        if (this.passwordInput.value !== this.confirmPasswordInput.value) {
            this.confirmPasswordInput.classList.add('error');
            errorElement.textContent = 'Passwords do not match';
            return false;
        } else {
            this.confirmPasswordInput.classList.remove('error');
            errorElement.textContent = '';
            return true;
        }
    }
    
    /**
     * Check password strength and update the meter
     */
    checkPasswordStrength() {
        const password = this.passwordInput.value;
        const meter = document.getElementById('reset-password-strength-meter');
        const text = document.getElementById('reset-password-strength-text');
        
        // Remove any existing classes
        meter.className = '';
        
        // Define strength criteria
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(password);
        const isLongEnough = password.length >= 8;
        
        // Calculate strength score (0-4)
        let score = 0;
        if (hasLower) score++;
        if (hasUpper) score++;
        if (hasNumber) score++;
        if (hasSpecial) score++;
        if (isLongEnough) score++;
        
        // Update meter and text based on score
        if (password.length === 0) {
            meter.className = '';
            text.textContent = '';
        } else if (score < 2) {
            meter.className = 'weak';
            text.textContent = 'Weak';
            text.style.color = 'var(--error-color)';
        } else if (score < 3) {
            meter.className = 'medium';
            text.textContent = 'Medium';
            text.style.color = '#FFA500';
        } else if (score < 5) {
            meter.className = 'strong';
            text.textContent = 'Strong';
            text.style.color = '#2196F3';
        } else {
            meter.className = 'very-strong';
            text.textContent = 'Very Strong';
            text.style.color = 'var(--success-color)';
        }
    }
    
    /**
     * Handle form submission
     * @param {Event} e - The submit event
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isPasswordValid = this.validateField(this.passwordInput, validatePassword, 'reset-password-error');
        const isConfirmPasswordValid = this.validateConfirmPassword();
        
        if (!isPasswordValid || !isConfirmPasswordValid) {
            return;
        }
        
        // Show loading state
        this.submitButton.classList.add('loading');
        this.submitButton.disabled = true;
        
        try {
            // Ensure we have a token
            if (!this.resetToken) {
                throw new Error('Reset token is missing. Please use the link from your email.');
            }
            
            // Call the auth service reset password method
            const result = await authService.resetPassword({
                token: this.resetToken,
                password: this.passwordInput.value
            });
            
            // Handle successful reset
            this.modal.showAlert('Your password has been reset successfully! You can now log in with your new password.', 'success');
            
            // Clear the form
            this.reset();
            
            // Switch to login tab after a delay
            setTimeout(() => {
                this.modal.switchTab('login');
            }, 3000);
            
        } catch (error) {
            // Handle error
            this.modal.showAlert(error.message || 'Failed to reset password. Please try again or request a new reset link.');
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
        const errorElements = this.form.querySelectorAll('.form-error');
        const inputElements = this.form.querySelectorAll('.form-control');
        
        errorElements.forEach(el => {
            el.textContent = '';
        });
        
        inputElements.forEach(input => {
            input.classList.remove('error');
        });
        
        // Reset password strength meter
        const meter = document.getElementById('reset-password-strength-meter');
        const text = document.getElementById('reset-password-strength-text');
        meter.className = '';
        text.textContent = '';
    }
}

// Export the ResetPassword class
export default ResetPassword;
