/**
 * authValidation.js
 * 
 * Utility functions for validating form fields related to authentication
 */

/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {Object} - Object containing isValid boolean and error message if invalid
 */
export function validateEmail(email) {
    // Empty check
    if (!email || email.trim() === '') {
        return {
            isValid: false,
            error: 'Email is required'
        };
    }
    
    // Basic email format check using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            error: 'Please enter a valid email address'
        };
    }
    
    return {
        isValid: true,
        error: ''
    };
}

/**
 * Validate a password
 * @param {string} password - The password to validate
 * @returns {Object} - Object containing isValid boolean and error message if invalid
 */
export function validatePassword(password) {
    // Empty check
    if (!password || password.trim() === '') {
        return {
            isValid: false,
            error: 'Password is required'
        };
    }
    
    // Minimum length check
    if (password.length < 8) {
        return {
            isValid: false,
            error: 'Password must be at least 8 characters'
        };
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must contain at least one lowercase letter'
        };
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must contain at least one uppercase letter'
        };
    }
    
    // Check for at least one number
    if (!/[0-9]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must contain at least one number'
        };
    }
    
    return {
        isValid: true,
        error: ''
    };
}

/**
 * Validate a phone number
 * @param {string} phone - The phone number to validate
 * @returns {Object} - Object containing isValid boolean and error message if invalid
 */
export function validatePhone(phone) {
    // Phone is optional, so empty is valid
    if (!phone || phone.trim() === '') {
        return {
            isValid: true,
            error: ''
        };
    }
    
    // Basic phone format check using regex (allows various formats)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone)) {
        return {
            isValid: false,
            error: 'Please enter a valid phone number'
        };
    }
    
    return {
        isValid: true,
        error: ''
    };
}

/**
 * Validate a company name
 * @param {string} company - The company name to validate
 * @returns {Object} - Object containing isValid boolean and error message if invalid
 */
export function validateCompany(company) {
    // Company is optional, so empty is valid
    if (!company || company.trim() === '') {
        return {
            isValid: true,
            error: ''
        };
    }
    
    // Maximum length check
    if (company.trim().length > 100) {
        return {
            isValid: false,
            error: 'Company name cannot exceed 100 characters'
        };
    }
    
    return {
        isValid: true,
        error: ''
    };
}
