/**
 * Enhanced Clinician Signup Form - Comprehensive React-to-Vanilla JS Conversion
 * Includes all professional fields, file uploads, designations, and state selection
 */

console.log('🚀 ClinicianSignupForm: Script loading...');

window.ClinicianSignupForm = (function() {
    'use strict';
    
    console.log('🚀 ClinicianSignupForm: Module initializing...');

    // Get configuration
    const getConfig = () => window.Config || window.DashboardConfig;

    // US States list for dropdown
    const US_STATES = [
        { value: "AL", label: "Alabama" },
        { value: "AK", label: "Alaska" },
        { value: "AZ", label: "Arizona" },
        { value: "AR", label: "Arkansas" },
        { value: "CA", label: "California" },
        { value: "CO", label: "Colorado" },
        { value: "CT", label: "Connecticut" },
        { value: "DE", label: "Delaware" },
        { value: "FL", label: "Florida" },
        { value: "GA", label: "Georgia" },
        { value: "HI", label: "Hawaii" },
        { value: "ID", label: "Idaho" },
        { value: "IL", label: "Illinois" },
        { value: "IN", label: "Indiana" },
        { value: "IA", label: "Iowa" },
        { value: "KS", label: "Kansas" },
        { value: "KY", label: "Kentucky" },
        { value: "LA", label: "Louisiana" },
        { value: "ME", label: "Maine" },
        { value: "MD", label: "Maryland" },
        { value: "MA", label: "Massachusetts" },
        { value: "MI", label: "Michigan" },
        { value: "MN", label: "Minnesota" },
        { value: "MS", label: "Mississippi" },
        { value: "MO", label: "Missouri" },
        { value: "MT", label: "Montana" },
        { value: "NE", label: "Nebraska" },
        { value: "NV", label: "Nevada" },
        { value: "NH", label: "New Hampshire" },
        { value: "NJ", label: "New Jersey" },
        { value: "NM", label: "New Mexico" },
        { value: "NY", label: "New York" },
        { value: "NC", label: "North Carolina" },
        { value: "ND", label: "North Dakota" },
        { value: "OH", label: "Ohio" },
        { value: "OK", label: "Oklahoma" },
        { value: "OR", label: "Oregon" },
        { value: "PA", label: "Pennsylvania" },
        { value: "RI", label: "Rhode Island" },
        { value: "SC", label: "South Carolina" },
        { value: "SD", label: "South Dakota" },
        { value: "TN", label: "Tennessee" },
        { value: "TX", label: "Texas" },
        { value: "UT", label: "Utah" },
        { value: "VT", label: "Vermont" },
        { value: "VA", label: "Virginia" },
        { value: "WA", label: "Washington" },
        { value: "WV", label: "West Virginia" },
        { value: "WI", label: "Wisconsin" },
        { value: "WY", label: "Wyoming" },
        { value: "DC", label: "District of Columbia" }
    ];

    // Medical designations list for licensed clinicians
    const MEDICAL_DESIGNATIONS = [
        { value: "DC", label: "DC (Doctor of Chiropractic)" },
        { value: "MD", label: "MD/MB (Medical Doctor)" },
        { value: "DO", label: "DO (Doctor of Osteopathic Medicine)" },
        { value: "ND", label: "ND/NMD (Naturopathic Doctor)" },
        { value: "DDS", label: "DDS/DMD (Doctor of Dentistry)" },
        { value: "OD", label: "OD (Doctor of Optometry)" },
        { value: "DOM", label: "DOM (Doctor of Oriental Medicine)" },
        { value: "LAc", label: "LAc (Acupuncturist)" }
    ];

    // Non-licensed professional designations
    const UNLICENSED_DESIGNATIONS = [
        { value: "Health Coach", label: "Health Coach" },
        { value: "Nutritionist", label: "Nutritionist" },
        { value: "Wellness Consultant", label: "Wellness Consultant" },
        { value: "Fitness Professional", label: "Fitness Professional" },
        { value: "Other", label: "Other" }
    ];

    /**
     * Initialize the clinician signup form
     * @param {Object} options - Configuration options
     * @param {string} options.containerId - Container element ID
     * @param {Function} options.onSuccess - Success callback
     * @param {Function} options.onError - Error callback
     */
    function init(options = {}) {
        const {
            containerId = 'clinician-signup-container',
            onSuccess = () => {},
            onError = () => {}
        } = options;

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID '${containerId}' not found`);
            return;
        }

        // Initialize form data
        const formData = {
            // Section 1: Account Credentials
            email: '',
            password: '',
            confirmPassword: '',
            
            // Section 2: Clinician Details
            firstName: '',
            lastName: '',
            phone: '',
            userType: 'licensed',
            licenseOrCertId: '',
            npiNumber: '',
            designation: '',
            
            // Section 3: Practice Information
            clinicName: '',
            addressOfPractice: '',
            city: '',
            state: '',
            postalCode: '',
            referralCode: '',
            
            // Terms
            termsAccepted: false
        };

        // Render the form
        render(container, formData);

        // Setup event handlers
        setupEventHandlers(container, formData, onSuccess, onError);
    }

    /**
     * Render the comprehensive signup form
     */
    function render(container, formData) {
        container.innerHTML = `
            <div class="clinician-signup-wrapper">
                <!-- Header -->
                <div class="signup-header">
                    <h2 class="signup-title">Create Your Web3 Diagnostics Account</h2>
                    <p class="signup-subtitle">Complete the form below to create your professional account</p>
                </div>

                <!-- User Type Selection -->
                <div class="user-type-selection-container">
                    <h3 class="user-type-title">Are you a licensed medical professional?</h3>
                    <div class="user-type-cards">
                        <div class="user-type-card ${formData.userType === 'licensed' ? 'selected' : ''}" data-type="licensed">
                            <div class="card-radio">
                                <div class="radio-circle ${formData.userType === 'licensed' ? 'checked' : ''}"></div>
                            </div>
                            <div class="card-content">
                                <h4>Licensed Clinician</h4>
                                <p>MD, DO, DC, NP, etc.</p>
                            </div>
                        </div>
                        <div class="user-type-card ${formData.userType === 'unlicensed' ? 'selected' : ''}" data-type="unlicensed">
                            <div class="card-radio">
                                <div class="radio-circle ${formData.userType === 'unlicensed' ? 'checked' : ''}"></div>
                            </div>
                            <div class="card-content">
                                <h4>Non-Licensed Professional</h4>
                                <p>Health coach, nutritionist, etc.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Form -->
                <form class="clinician-form" id="clinician-form">
                    <!-- Section 1: Account Credentials -->
                    <div class="form-section">
                        <h3 class="section-title">Account Credentials</h3>
                        <p class="section-subtitle">Create your login credentials to access the platform</p>
                        
                        <div class="form-group">
                            <label for="email" class="form-label">Email (Username)*</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                class="form-input" 
                                placeholder="your.email@practice.com" 
                                value="${formData.email}"
                                required
                            >
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="password" class="form-label">Password*</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password"
                                    class="form-input" 
                                    value="${formData.password}"
                                    required
                                >
                                <p class="form-hint">Minimum 8 characters</p>
                            </div>
                            
                            <div class="form-group">
                                <label for="confirmPassword" class="form-label">Confirm Password*</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    name="confirmPassword"
                                    class="form-input" 
                                    value="${formData.confirmPassword}"
                                    required
                                >
                            </div>
                        </div>
                    </div>

                    <hr class="section-divider">

                    <!-- Section 2: Professional Details -->
                    <div class="form-section">
                        <h3 class="section-title">${formData.userType === 'licensed' ? 'Clinician Details' : 'Professional Details'}</h3>
                        <p class="section-subtitle">${formData.userType === 'licensed' ? 'Tell us about your credentials and practice' : 'Tell us about your professional background'}</p>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName" class="form-label">First Name*</label>
                                <input 
                                    type="text" 
                                    id="firstName" 
                                    name="firstName"
                                    class="form-input" 
                                    value="${formData.firstName}"
                                    required
                                >
                            </div>
                            
                            <div class="form-group">
                                <label for="lastName" class="form-label">Last Name*</label>
                                <input 
                                    type="text" 
                                    id="lastName" 
                                    name="lastName"
                                    class="form-input" 
                                    value="${formData.lastName}"
                                    required
                                >
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="phone" class="form-label">Phone Number*</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone"
                                class="form-input" 
                                value="${formData.phone}"
                                required
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="licenseOrCertId" class="form-label">${formData.userType === 'licensed' ? 'License Number*' : 'Certification ID*'}</label>
                            <input 
                                type="text" 
                                id="licenseOrCertId" 
                                name="licenseOrCertId"
                                class="form-input" 
                                placeholder="Enter your ${formData.userType === 'licensed' ? 'license' : 'certification'} number"
                                value="${formData.licenseOrCertId}"
                                required
                            >
                        </div>
                        
                        ${formData.userType === 'licensed' ? `
                            <div class="form-group">
                                <label for="npiNumber" class="form-label">NPI Number*</label>
                                <input 
                                    type="text" 
                                    id="npiNumber" 
                                    name="npiNumber"
                                    class="form-input" 
                                    value="${formData.npiNumber}"
                                    required
                                >
                                <p class="form-hint">
                                    <a href="https://npiregistry.cms.hhs.gov/search" target="_blank" rel="noopener noreferrer" class="form-link">
                                        Click to search for your NPI number
                                    </a>
                                </p>
                            </div>
                        ` : ''}
                        
                        <div class="form-group">
                            <label for="designation" class="form-label">${formData.userType === 'licensed' ? 'Primary Designation*' : 'Certification Type*'}</label>
                            <select 
                                id="designation" 
                                name="designation"
                                class="form-select" 
                                required
                            >
                                <option value="">Select ${formData.userType === 'licensed' ? 'designation' : 'certification type'}</option>
                                ${(formData.userType === 'licensed' ? MEDICAL_DESIGNATIONS : UNLICENSED_DESIGNATIONS).map(designation => 
                                    `<option value="${designation.value}" ${formData.designation === designation.value ? 'selected' : ''}>${designation.label}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="file-upload-section">
                            <label class="file-upload-label">
                                <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                Upload License/Certification
                            </label>
                            <p class="file-upload-hint">
                                Upload a scanned copy or photo of your license or certification for verification
                            </p>
                            <input 
                                type="file" 
                                id="licenseUpload" 
                                name="licenseUpload"
                                class="file-input"
                                accept="image/*,.pdf"
                            >
                        </div>
                    </div>

                    <hr class="section-divider">

                    <!-- Section 3: Practice Information -->
                    <div class="form-section">
                        <h3 class="section-title">${formData.userType === 'licensed' ? 'Practice Information' : 'Business Information'}</h3>
                        <p class="section-subtitle">${formData.userType === 'licensed' ? 'Tell us where you practice' : 'Tell us about your business location'}</p>
                        
                        <div class="form-group">
                            <label for="clinicName" class="form-label">${formData.userType === 'licensed' ? 'Clinic/Practice Name*' : 'Business Name*'}</label>
                            <input 
                                type="text" 
                                id="clinicName" 
                                name="clinicName"
                                class="form-input" 
                                value="${formData.clinicName}"
                                required
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="addressOfPractice" class="form-label">${formData.userType === 'licensed' ? 'Practice Address*' : 'Business Address*'}</label>
                            <input 
                                type="text" 
                                id="addressOfPractice" 
                                name="addressOfPractice"
                                class="form-input" 
                                value="${formData.addressOfPractice}"
                                required
                            >
                        </div>
                        
                        <div class="form-row form-row-triple">
                            <div class="form-group">
                                <label for="city" class="form-label">City*</label>
                                <input 
                                    type="text" 
                                    id="city" 
                                    name="city"
                                    class="form-input" 
                                    value="${formData.city}"
                                    required
                                >
                            </div>
                            
                            <div class="form-group">
                                <label for="state" class="form-label">State*</label>
                                <select 
                                    id="state" 
                                    name="state"
                                    class="form-select" 
                                    required
                                >
                                    <option value="">Select state</option>
                                    ${US_STATES.map(state => 
                                        `<option value="${state.value}" ${formData.state === state.value ? 'selected' : ''}>${state.label}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="postalCode" class="form-label">Zip Code*</label>
                                <input 
                                    type="text" 
                                    id="postalCode" 
                                    name="postalCode"
                                    class="form-input" 
                                    value="${formData.postalCode}"
                                    required
                                >
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="referralCode" class="form-label">Referral Code (Optional)</label>
                            <input 
                                type="text" 
                                id="referralCode" 
                                name="referralCode"
                                class="form-input" 
                                placeholder="Have a referral code? Enter it here"
                                value="${formData.referralCode}"
                            >
                        </div>
                    </div>

                    <hr class="section-divider">

                    <!-- Terms and Conditions -->
                    <div class="form-section">
                        <div class="terms-section">
                            <label class="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    id="termsAccepted" 
                                    name="termsAccepted"
                                    class="checkbox-input"
                                    ${formData.termsAccepted ? 'checked' : ''}
                                >
                                <span class="checkbox-custom"></span>
                                <span class="checkbox-text">
                                    I have read and agree to the Web3 Diagnostics terms of service, privacy policy, and data sharing authorization.
                                </span>
                            </label>
                        </div>
                        
                        <button 
                            type="submit" 
                            class="submit-button"
                            id="submit-button"
                        >
                            <span class="button-text">Create Account</span>
                            <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </button>
                        
                        <p class="terms-footer">
                            By signing up you are agreeing to our Terms and Conditions
                        </p>
                    </div>
                </form>

                <!-- Loading Overlay -->
                <div class="loading-overlay" id="loading-overlay" style="display: none;">
                    <div class="loading-spinner"></div>
                    <p>Creating your account...</p>
                </div>
            </div>
        `;
    }

    /**
     * Setup event handlers
     */
    function setupEventHandlers(container, formData, onSuccess, onError) {
        // User type selection
        const userTypeCards = container.querySelectorAll('.user-type-card');
        userTypeCards.forEach(card => {
            card.addEventListener('click', () => {
                const newUserType = card.dataset.type;
                if (newUserType !== formData.userType) {
                    formData.userType = newUserType;
                    render(container, formData);
                    setupEventHandlers(container, formData, onSuccess, onError);
                }
            });
        });

        // Form input handlers
        const form = container.querySelector('#clinician-form');
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const { name, value, type, checked } = e.target;
                if (type === 'checkbox') {
                    formData[name] = checked;
                } else {
                    formData[name] = value;
                }
            });
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(formData, container, onSuccess, onError);
        });
    }

    /**
     * Handle form submission
     */
    async function handleFormSubmit(formData, container, onSuccess, onError) {
        const config = getConfig();
        const loadingOverlay = container.querySelector('#loading-overlay');
        const submitButton = container.querySelector('#submit-button');

        try {
            // Show loading
            showLoading(loadingOverlay, submitButton);

            // Validate form data
            const validationResult = validateFormData(formData);
            if (!validationResult.valid) {
                throw new Error(validationResult.message);
            }

            // Transform form data to API format
            const apiData = transformFormData(formData);

            if (config.get('MOCK_DATA')) {
                // Simulate API call
                await simulateSignup(apiData);
                showNotification('Account created successfully!', 'success');
                onSuccess(apiData);
            } else {
                // Real API call
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(apiData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Signup failed');
                }

                const result = await response.json();
                showNotification('Account created successfully!', 'success');
                onSuccess(result);
            }

        } catch (error) {
            config.error('Signup error:', error);
            showNotification(error.message || 'Failed to create account', 'error');
            onError(error);
        } finally {
            hideLoading(loadingOverlay, submitButton);
        }
    }

    /**
     * Validate form data
     */
    function validateFormData(formData) {
        const errors = [];

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            errors.push('Valid email address is required');
        }

        // Password validation
        if (!formData.password || formData.password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }

        if (formData.password !== formData.confirmPassword) {
            errors.push('Passwords do not match');
        }

        // Required fields
        const requiredFields = [
            'firstName', 'lastName', 'phone', 'licenseOrCertId', 
            'designation', 'clinicName', 'addressOfPractice', 
            'city', 'state', 'postalCode'
        ];

        // Add NPI for licensed users
        if (formData.userType === 'licensed') {
            requiredFields.push('npiNumber');
        }

        requiredFields.forEach(field => {
            if (!formData[field]) {
                const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
                errors.push(`${fieldName} is required`);
            }
        });

        // Terms acceptance
        if (!formData.termsAccepted) {
            errors.push('You must accept the terms and conditions');
        }

        return {
            valid: errors.length === 0,
            message: errors.join(', ')
        };
    }

    /**
     * Transform form data to API format
     */
    function transformFormData(formData) {
        return {
            // User table data
            user: {
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName
            },
            // Clinician table data
            clinician: {
                user_type: formData.userType,
                license_or_cert_id: formData.licenseOrCertId,
                npi_number: formData.npiNumber || null,
                designation: formData.designation,
                clinic_name: formData.clinicName,
                phone_number: formData.phone,
                address_of_practice: formData.addressOfPractice,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postalCode,
                referral_code: formData.referralCode || null,
                status: 'pending'
            }
        };
    }

    /**
     * Simulate signup process
     */
    async function simulateSignup(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate potential errors (5% chance)
        if (Math.random() < 0.05) {
            throw new Error('Email address already exists');
        }

        return {
            success: true,
            userId: 'user_' + Date.now(),
            message: 'Account created successfully'
        };
    }

    /**
     * Show loading overlay
     */
    function showLoading(overlay, button) {
        if (overlay) {
            overlay.style.display = 'flex';
        }
        if (button) {
            button.disabled = true;
            button.querySelector('.button-text').textContent = 'Creating Account...';
        }
    }

    /**
     * Hide loading overlay
     */
    function hideLoading(overlay, button) {
        if (overlay) {
            overlay.style.display = 'none';
        }
        if (button) {
            button.disabled = false;
            button.querySelector('.button-text').textContent = 'Create Account';
        }
    }

    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (window.AuthModal && window.AuthModal.showNotification) {
            window.AuthModal.showNotification(message, type);
        } else {
            // Create simple notification
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#3b82f6'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
            `;
            notification.textContent = message;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Auto remove
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);
        }
    }

    // Public API
    console.log('✅ ClinicianSignupForm: Module ready, exposing init function');
    return {
        init
    };
})();

console.log('✅ ClinicianSignupForm: Script fully loaded and window.ClinicianSignupForm available');