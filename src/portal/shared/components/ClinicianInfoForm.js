/**
 * Reusable Clinician Information Form Component
 * Based on React ClinicianSignupForm with Web3 Diagnostics styling
 * Supports both signup flow and account management contexts
 */

console.log('🔄 Loading ClinicianInfoForm.js...');

window.ClinicianInfoForm = (function() {
    'use strict';

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

    // Medical designations for licensed clinicians
    const MEDICAL_DESIGNATIONS = [
        { value: "DC", label: "DC (Doctor of Chiropractic)" },
        { value: "MD", label: "MD/MB (Medical Doctor)" },
        { value: "DO", label: "DO (Doctor of Osteopathic Medicine)" },
        { value: "ND", label: "ND/NMD (Naturopathic Doctor)" },
        { value: "DDS", label: "DDS/DMD (Doctor of Dentistry)" },
        { value: "OD", label: "OD (Doctor of Optometry)" },
        { value: "DOM", label: "DOM (Doctor of Oriental Medicine)" },
        { value: "LAc", label: "LAc (Acupuncturist)" },
        { value: "NP", label: "NP (Nurse Practitioner)" },
        { value: "PA", label: "PA (Physician Assistant)" }
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
     * Create a new Clinician Info Form instance
     * @param {Object} options - Configuration options
     * @param {string} options.containerId - ID of container element
     * @param {string} options.mode - 'signup' or 'account' mode
     * @param {string} options.userType - 'licensed' or 'unlicensed'
     * @param {Function} options.onSubmit - Callback for form submission
     * @param {Object} options.initialData - Pre-populate form data
     * @param {boolean} options.showCredentials - Show email/password fields (signup mode)
     */
    function create(options = {}) {
        const {
            containerId,
            mode = 'account', // 'signup' or 'account'
            userType = 'licensed',
            onSubmit = () => {},
            initialData = {},
            showCredentials = false
        } = options;

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID '${containerId}' not found`);
            return null;
        }

        // Form data state
        let formData = {
            // Credentials (signup only)
            email: initialData.email || '',
            password: initialData.password || '',
            confirmPassword: initialData.confirmPassword || '',
            
            // Personal Info
            firstName: initialData.firstName || initialData.first_name || '',
            lastName: initialData.lastName || initialData.last_name || '',
            phone: initialData.phone || initialData.phone_number || '',
            
            // Professional Info
            userType: initialData.userType || userType,
            licenseNumber: initialData.licenseNumber || initialData.license_number || '',
            npiNumber: initialData.npiNumber || initialData.npi_number || '',
            designation: initialData.designation || '',
            
            // Practice/Business Info
            practiceName: initialData.practiceName || initialData.practice_name || '',
            businessAddress: initialData.businessAddress || initialData.business_address || '',
            businessCity: initialData.businessCity || initialData.business_city || '',
            businessState: initialData.businessState || initialData.business_state || '',
            businessPostal: initialData.businessPostal || initialData.business_postal || '',
            businessEmail: initialData.businessEmail || initialData.business_email || '',
            
            // Terms (signup only)
            termsAccepted: initialData.termsAccepted || false
        };

        /**
         * Render the complete form
         */
        function render() {
            container.innerHTML = `
                <form class="clinician-info-form" id="clinician-info-form">
                    ${showCredentials ? renderCredentialsSection() : ''}
                    ${renderPersonalSection()}
                    ${renderProfessionalSection()}
                    ${renderPracticeSection()}
                    ${showCredentials ? renderTermsSection() : ''}
                    ${renderSubmitButton()}
                </form>
            `;

            setupEventListeners();
            populateStateDropdown();
            populateDesignationDropdown();
            populateFormData();
        }

        /**
         * Render credentials section (signup only)
         */
        function renderCredentialsSection() {
            return `
                <div class="form-section">
                    <div class="section-header">
                        <h3 class="section-title">Account Credentials</h3>
                        <p class="section-subtitle">Create your login credentials to access the platform</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="email" class="form-label">Email (Username)*</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            class="form-input" 
                            placeholder="your.email@practice.com"
                            required
                        />
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="password" class="form-label">Password*</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                class="form-input"
                                required
                            />
                            <small class="form-help">Minimum 8 characters</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="confirmPassword" class="form-label">Confirm Password*</label>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                class="form-input"
                                required
                            />
                        </div>
                    </div>
                </div>
                <hr class="section-divider" />
            `;
        }

        /**
         * Render personal information section
         */
        function renderPersonalSection() {
            return `
                <div class="form-section">
                    <div class="section-header">
                        <h3 class="section-title">Personal Information</h3>
                        <p class="section-subtitle">Basic contact information</p>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName" class="form-label">First Name*</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                name="firstName" 
                                class="form-input"
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="lastName" class="form-label">Last Name*</label>
                            <input 
                                type="text" 
                                id="lastName" 
                                name="lastName" 
                                class="form-input"
                                required
                            />
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone" class="form-label">Phone Number*</label>
                        <input 
                            type="tel" 
                            id="phone" 
                            name="phone" 
                            class="form-input"
                            placeholder="(555) 123-4567"
                            required
                        />
                    </div>
                </div>
                <hr class="section-divider" />
            `;
        }

        /**
         * Render professional information section
         */
        function renderProfessionalSection() {
            const isLicensed = formData.userType === 'licensed';
            
            return `
                <div class="form-section">
                    <div class="section-header">
                        <h3 class="section-title">${isLicensed ? 'Professional Credentials' : 'Professional Details'}</h3>
                        <p class="section-subtitle">${isLicensed ? 'Your medical credentials and licensing information' : 'Your professional background information'}</p>
                    </div>
                    
                    ${mode === 'signup' ? renderUserTypeSelection() : ''}
                    
                    <div class="form-group">
                        <label for="licenseNumber" class="form-label">
                            ${isLicensed ? 'License Number*' : 'Certification ID*'}
                        </label>
                        <input 
                            type="text" 
                            id="licenseNumber" 
                            name="licenseNumber" 
                            class="form-input"
                            placeholder="Enter your ${isLicensed ? 'license' : 'certification'} number"
                            required
                        />
                    </div>
                    
                    ${isLicensed ? `
                        <div class="form-group">
                            <label for="npiNumber" class="form-label">NPI Number*</label>
                            <input 
                                type="text" 
                                id="npiNumber" 
                                name="npiNumber" 
                                class="form-input"
                                placeholder="10-digit NPI number"
                                required
                            />
                            <small class="form-help">
                                <a href="https://npiregistry.cms.hhs.gov/search" target="_blank" rel="noopener noreferrer" class="form-link">
                                    Search for your NPI number
                                </a>
                            </small>
                        </div>
                    ` : ''}
                    
                    <div class="form-group">
                        <label for="designation" class="form-label">
                            ${isLicensed ? 'Primary Designation*' : 'Certification Type*'}
                        </label>
                        <select 
                            id="designation" 
                            name="designation" 
                            class="form-input"
                            required
                        >
                            <option value="">Select ${isLicensed ? 'designation' : 'certification type'}</option>
                        </select>
                    </div>
                </div>
                <hr class="section-divider" />
            `;
        }

        /**
         * Render user type selection (signup only)
         */
        function renderUserTypeSelection() {
            return `
                <div class="form-group">
                    <label class="form-label">Professional Type*</label>
                    <div class="user-type-selection">
                        <label class="user-type-option ${formData.userType === 'licensed' ? 'selected' : ''}">
                            <input 
                                type="radio" 
                                name="userType" 
                                value="licensed" 
                                ${formData.userType === 'licensed' ? 'checked' : ''}
                            />
                            <div class="user-type-content">
                                <h4>Licensed Clinician</h4>
                                <p>MD, DO, DC, NP, etc.</p>
                            </div>
                        </label>
                        
                        <label class="user-type-option ${formData.userType === 'unlicensed' ? 'selected' : ''}">
                            <input 
                                type="radio" 
                                name="userType" 
                                value="unlicensed" 
                                ${formData.userType === 'unlicensed' ? 'checked' : ''}
                            />
                            <div class="user-type-content">
                                <h4>Non-Licensed Professional</h4>
                                <p>Health coach, nutritionist, etc.</p>
                            </div>
                        </label>
                    </div>
                </div>
            `;
        }

        /**
         * Render practice/business information section
         */
        function renderPracticeSection() {
            const isLicensed = formData.userType === 'licensed';
            
            return `
                <div class="form-section">
                    <div class="section-header">
                        <h3 class="section-title">${isLicensed ? 'Practice Information' : 'Business Information'}</h3>
                        <p class="section-subtitle">${isLicensed ? 'Details about your practice location' : 'Details about your business location'}</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="practiceName" class="form-label">
                            ${isLicensed ? 'Practice/Clinic Name*' : 'Business Name*'}
                        </label>
                        <input 
                            type="text" 
                            id="practiceName" 
                            name="practiceName" 
                            class="form-input"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="businessEmail" class="form-label">Business Email*</label>
                        <input 
                            type="email" 
                            id="businessEmail" 
                            name="businessEmail" 
                            class="form-input"
                            placeholder="contact@yourpractice.com"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="businessAddress" class="form-label">
                            ${isLicensed ? 'Practice Address*' : 'Business Address*'}
                        </label>
                        <input 
                            type="text" 
                            id="businessAddress" 
                            name="businessAddress" 
                            class="form-input"
                            placeholder="Street address"
                            required
                        />
                    </div>
                    
                    <div class="form-row form-row-3">
                        <div class="form-group">
                            <label for="businessCity" class="form-label">City*</label>
                            <input 
                                type="text" 
                                id="businessCity" 
                                name="businessCity" 
                                class="form-input"
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="businessState" class="form-label">State*</label>
                            <select 
                                id="businessState" 
                                name="businessState" 
                                class="form-input"
                                required
                            >
                                <option value="">Select state</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="businessPostal" class="form-label">Zip Code*</label>
                            <input 
                                type="text" 
                                id="businessPostal" 
                                name="businessPostal" 
                                class="form-input"
                                placeholder="12345"
                                required
                            />
                        </div>
                    </div>
                </div>
                ${showCredentials ? '<hr class="section-divider" />' : ''}
            `;
        }

        /**
         * Render terms section (signup only)
         */
        function renderTermsSection() {
            return `
                <div class="form-section">
                    <div class="form-group">
                        <label class="checkbox-container">
                            <input type="checkbox" id="termsAccepted" name="termsAccepted" required>
                            <span class="checkmark"></span>
                            <span class="checkbox-label">
                                I have read and agree to the Web3 Diagnostics terms of service, privacy policy, and data sharing authorization.
                            </span>
                        </label>
                    </div>
                </div>
            `;
        }

        /**
         * Render submit button
         */
        function renderSubmitButton() {
            return `
                <div class="form-actions">
                    <button type="submit" class="btn-primary btn-submit">
                        ${mode === 'signup' ? 'Create Account' : 'Save Information'}
                    </button>
                </div>
            `;
        }

        /**
         * Populate state dropdown
         */
        function populateStateDropdown() {
            const stateSelect = container.querySelector('#businessState');
            if (!stateSelect) return;

            US_STATES.forEach(state => {
                const option = document.createElement('option');
                option.value = state.value;
                option.textContent = state.label;
                stateSelect.appendChild(option);
            });
        }

        /**
         * Populate designation dropdown
         */
        function populateDesignationDropdown() {
            const designationSelect = container.querySelector('#designation');
            if (!designationSelect) return;

            const designations = formData.userType === 'licensed' ? MEDICAL_DESIGNATIONS : UNLICENSED_DESIGNATIONS;
            
            // Clear existing options except the first one
            designationSelect.innerHTML = `<option value="">Select ${formData.userType === 'licensed' ? 'designation' : 'certification type'}</option>`;
            
            designations.forEach(designation => {
                const option = document.createElement('option');
                option.value = designation.value;
                option.textContent = designation.label;
                designationSelect.appendChild(option);
            });
        }

        /**
         * Populate form with data
         */
        function populateFormData() {
            Object.keys(formData).forEach(key => {
                const input = container.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = formData[key];
                    } else if (input.type === 'radio') {
                        if (input.value === formData[key]) {
                            input.checked = true;
                        }
                    } else {
                        input.value = formData[key];
                    }
                }
            });
        }

        /**
         * Setup event listeners
         */
        function setupEventListeners() {
            const form = container.querySelector('#clinician-info-form');
            if (!form) return;

            // Form submission
            form.addEventListener('submit', handleSubmit);

            // Input changes
            form.addEventListener('input', handleInputChange);
            form.addEventListener('change', handleInputChange);

            // User type change (if present)
            const userTypeInputs = form.querySelectorAll('input[name="userType"]');
            userTypeInputs.forEach(input => {
                input.addEventListener('change', handleUserTypeChange);
            });
        }

        /**
         * Handle input changes
         */
        function handleInputChange(event) {
            const { name, value, type, checked } = event.target;
            
            if (type === 'checkbox') {
                formData[name] = checked;
            } else {
                formData[name] = value;
            }

            // Update user type selection styling
            if (name === 'userType') {
                updateUserTypeSelection();
            }
        }

        /**
         * Handle user type change
         */
        function handleUserTypeChange(event) {
            formData.userType = event.target.value;
            updateUserTypeSelection();
            
            // Re-render sections that depend on user type
            const professionalSection = container.querySelector('.form-section:nth-of-type(3)');
            if (professionalSection) {
                professionalSection.outerHTML = renderProfessionalSection();
                populateDesignationDropdown();
                
                // Re-attach event listeners for the new section
                const newSection = container.querySelector('.form-section:nth-of-type(3)');
                if (newSection) {
                    newSection.addEventListener('input', handleInputChange);
                    newSection.addEventListener('change', handleInputChange);
                }
            }

            const practiceSection = container.querySelector('.form-section:nth-of-type(4)');
            if (practiceSection) {
                practiceSection.outerHTML = renderPracticeSection();
                populateStateDropdown();
                populateFormData();
                
                // Re-attach event listeners for the new section
                const newSection = container.querySelector('.form-section:nth-of-type(4)');
                if (newSection) {
                    newSection.addEventListener('input', handleInputChange);
                    newSection.addEventListener('change', handleInputChange);
                }
            }
        }

        /**
         * Update user type selection styling
         */
        function updateUserTypeSelection() {
            const options = container.querySelectorAll('.user-type-option');
            options.forEach(option => {
                const input = option.querySelector('input[type="radio"]');
                if (input && input.checked) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
        }

        /**
         * Validate form data
         */
        function validateForm() {
            const errors = [];

            // Credentials validation (signup only)
            if (showCredentials) {
                if (!formData.email) errors.push('Email is required');
                if (!formData.password) errors.push('Password is required');
                if (formData.password !== formData.confirmPassword) {
                    errors.push('Passwords do not match');
                }
                if (!formData.termsAccepted) {
                    errors.push('You must accept the terms and conditions');
                }
            }

            // Personal info validation
            if (!formData.firstName) errors.push('First name is required');
            if (!formData.lastName) errors.push('Last name is required');
            if (!formData.phone) errors.push('Phone number is required');

            // Professional info validation
            if (!formData.licenseNumber) errors.push('License/certification number is required');
            if (formData.userType === 'licensed' && !formData.npiNumber) {
                errors.push('NPI number is required for licensed clinicians');
            }
            if (!formData.designation) errors.push('Designation is required');

            // Practice info validation
            if (!formData.practiceName) errors.push('Practice/business name is required');
            if (!formData.businessEmail) errors.push('Business email is required');
            if (!formData.businessAddress) errors.push('Business address is required');
            if (!formData.businessCity) errors.push('City is required');
            if (!formData.businessState) errors.push('State is required');
            if (!formData.businessPostal) errors.push('Zip code is required');

            return errors;
        }

        /**
         * Handle form submission
         */
        function handleSubmit(event) {
            event.preventDefault();

            const errors = validateForm();
            if (errors.length > 0) {
                showNotification('Please fix the following errors:\n' + errors.join('\n'), 'error');
                return;
            }

            // Call the provided onSubmit callback
            onSubmit(formData);
        }

        /**
         * Show notification
         */
        function showNotification(message, type = 'info') {
            // Use existing notification system if available
            if (window.AccountManager && window.AccountManager.showNotification) {
                window.AccountManager.showNotification(message, type);
            } else {
                alert(message); // Fallback
            }
        }

        /**
         * Get current form data
         */
        function getFormData() {
            return { ...formData };
        }

        /**
         * Update form data
         */
        function updateFormData(newData) {
            formData = { ...formData, ...newData };
            populateFormData();
        }

        // Initialize the form
        render();

        // Return public API
        return {
            getFormData,
            updateFormData,
            render
        };
    }

    // Public API
    return {
        create
    };
})();

console.log('✅ ClinicianInfoForm module initialized successfully');