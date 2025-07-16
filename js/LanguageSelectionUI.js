/**
 * LanguageSelectionUI - Provides interface for initial language selection and switching
 * Handles modal dialog for initial language choice and toggle button in main interface
 */
class LanguageSelectionUI {
    constructor(containerId, languageManager) {
        this.containerId = containerId;
        this.languageManager = languageManager;
        this.modalOverlay = null;
        this.toggleButton = null;
        this.isInitialized = false;
        this.hasShownInitialSelection = false;
        
        // Check if language preference already exists
        this.hasExistingPreference = localStorage.getItem('pim-pam-pet-language') !== null;
        
        // Initialize the UI components
        this.init();
    }

    /**
     * Initialize the language selection UI components
     * @private
     */
    init() {
        try {
            this.createModalStructure();
            this.createToggleButton();
            this.setupEventListeners();
            this.isInitialized = true;
            console.log('LanguageSelectionUI initialized successfully');
        } catch (error) {
            console.error('Error initializing LanguageSelectionUI:', error);
            if (window.errorHandler) {
                window.errorHandler.showError(
                    'Er is een probleem met de taalinstelling. Het spel gebruikt Nederlands.',
                    'warning',
                    4000
                );
            }
        }
    }

    /**
     * Create the modal structure for initial language selection
     * @private
     */
    createModalStructure() {
        // Create modal overlay
        this.modalOverlay = document.createElement('div');
        this.modalOverlay.className = 'language-modal-overlay';
        this.modalOverlay.setAttribute('role', 'dialog');
        this.modalOverlay.setAttribute('aria-modal', 'true');
        this.modalOverlay.setAttribute('aria-labelledby', 'language-modal-title');
        this.modalOverlay.setAttribute('aria-describedby', 'language-modal-description');

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'language-modal-content';

        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'language-modal-header';

        const modalTitle = document.createElement('h2');
        modalTitle.id = 'language-modal-title';
        modalTitle.className = 'language-modal-title';
        modalTitle.textContent = 'Choose your language / Kies je taal';

        // Hidden description for screen readers
        const modalDescription = document.createElement('p');
        modalDescription.id = 'language-modal-description';
        modalDescription.className = 'sr-only';
        modalDescription.textContent = 'Select your preferred language for the game interface and questions';

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(modalDescription);

        // Create language options container
        const languageOptions = document.createElement('div');
        languageOptions.className = 'language-options';

        // Create Dutch option
        const dutchOption = this.createLanguageOption('dutch', '🇳🇱', 'Nederlands');
        
        // Create English option
        const englishOption = this.createLanguageOption('english', '🇺🇸', 'English');

        languageOptions.appendChild(dutchOption);
        languageOptions.appendChild(englishOption);

        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(languageOptions);
        this.modalOverlay.appendChild(modalContent);

        // Add to document body
        document.body.appendChild(this.modalOverlay);
    }

    /**
     * Create a language option button
     * @private
     * @param {string} languageCode - Language code ('dutch' or 'english')
     * @param {string} flag - Flag emoji
     * @param {string} name - Language name
     * @returns {HTMLElement} Language option button
     */
    createLanguageOption(languageCode, flag, name) {
        const option = document.createElement('button');
        option.className = 'language-option';
        option.setAttribute('data-language', languageCode);
        option.setAttribute('aria-label', `Select ${name} language`);
        option.setAttribute('type', 'button');

        const flagSpan = document.createElement('span');
        flagSpan.className = 'language-flag';
        flagSpan.textContent = flag;
        flagSpan.setAttribute('aria-hidden', 'true');

        const nameSpan = document.createElement('span');
        nameSpan.className = 'language-name';
        nameSpan.textContent = name;

        option.appendChild(flagSpan);
        option.appendChild(nameSpan);

        // Add click event listener
        option.addEventListener('click', (event) => {
            this.handleLanguageChange(languageCode);
        });

        // Add keyboard support
        option.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.handleLanguageChange(languageCode);
            }
        });

        return option;
    }

    /**
     * Create the language toggle button for the main interface
     * @private
     */
    createToggleButton() {
        // Find the header controls container
        const headerControls = document.querySelector('.header-controls');
        if (!headerControls) {
            console.warn('Header controls container not found');
            return;
        }

        // Create toggle button
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'language-toggle-btn';
        this.toggleButton.setAttribute('type', 'button');
        this.toggleButton.setAttribute('aria-label', 'Switch language');
        this.toggleButton.id = 'language-toggle-btn';

        // Update button content based on current language
        this.updateToggleButton();

        // Add click event listener
        this.toggleButton.addEventListener('click', (event) => {
            this.handleToggleClick();
        });

        // Add keyboard support
        this.toggleButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.handleToggleClick();
            }
        });

        // Insert toggle button before the manage button
        const manageButton = document.getElementById('manage-questions-btn');
        if (manageButton) {
            headerControls.insertBefore(this.toggleButton, manageButton);
        } else {
            headerControls.appendChild(this.toggleButton);
        }
    }

    /**
     * Update the toggle button content based on current language
     * @private
     */
    updateToggleButton() {
        if (!this.toggleButton) return;

        const currentLanguage = this.languageManager.getCurrentLanguage();
        const otherLanguage = currentLanguage === 'dutch' ? 'english' : 'dutch';
        
        // Clear existing content
        this.toggleButton.innerHTML = '';

        // Add flag and name for the other language
        const flag = otherLanguage === 'dutch' ? '🇳🇱' : '🇺🇸';
        const name = otherLanguage === 'dutch' ? 'Nederlands' : 'English';

        const flagSpan = document.createElement('span');
        flagSpan.className = 'language-flag';
        flagSpan.textContent = flag;
        flagSpan.setAttribute('aria-hidden', 'true');

        const nameSpan = document.createElement('span');
        nameSpan.className = 'language-name';
        nameSpan.textContent = name;

        this.toggleButton.appendChild(flagSpan);
        this.toggleButton.appendChild(nameSpan);

        // Update aria-label
        const switchToText = otherLanguage === 'dutch' ? 'Switch to Dutch' : 'Switch to English';
        this.toggleButton.setAttribute('aria-label', switchToText);
    }

    /**
     * Setup event listeners for modal and keyboard navigation
     * @private
     */
    setupEventListeners() {
        // Close modal on overlay click
        this.modalOverlay.addEventListener('click', (event) => {
            if (event.target === this.modalOverlay) {
                this.hideInitialSelection();
            }
        });

        // Handle escape key to close modal
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isModalVisible()) {
                this.hideInitialSelection();
            }
        });

        // Focus trap for modal accessibility
        this.modalOverlay.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                this.handleModalTabNavigation(event);
            }
        });
    }

    /**
     * Handle tab navigation within the modal for accessibility
     * @private
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleModalTabNavigation(event) {
        const focusableElements = this.modalOverlay.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * Show initial language selection modal on first app launch
     * This method displays the modal if no language preference exists
     */
    showInitialSelection() {
        try {
            // Only show if no existing preference and hasn't been shown yet
            if (!this.hasExistingPreference && !this.hasShownInitialSelection) {
                this.showModal();
                this.hasShownInitialSelection = true;
                console.log('Showing initial language selection');
            } else {
                console.log('Skipping initial language selection - preference exists or already shown');
            }
        } catch (error) {
            console.error('Error showing initial language selection:', error);
            if (window.errorHandler) {
                window.errorHandler.showError(
                    'Er is een probleem met de taalinstelling.',
                    'warning',
                    3000
                );
            }
        }
    }

    /**
     * Show the language selection modal
     * @private
     */
    showModal() {
        if (!this.modalOverlay) return;

        // Show modal
        this.modalOverlay.style.display = 'flex';
        
        // Trigger show animation
        requestAnimationFrame(() => {
            this.modalOverlay.classList.add('show');
        });

        // Focus first language option for accessibility
        setTimeout(() => {
            const firstOption = this.modalOverlay.querySelector('.language-option');
            if (firstOption) {
                firstOption.focus();
            }
        }, 100);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Announce to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Language selection dialog opened');
        }
    }

    /**
     * Hide the initial language selection modal
     * @private
     */
    hideInitialSelection() {
        this.hideModal();
    }

    /**
     * Hide the language selection modal
     * @private
     */
    hideModal() {
        if (!this.modalOverlay) return;

        // Add hide animation class
        this.modalOverlay.classList.remove('show');
        this.modalOverlay.classList.add('hide');

        // Hide modal after animation
        setTimeout(() => {
            this.modalOverlay.style.display = 'none';
            this.modalOverlay.classList.remove('hide');
            
            // Restore body scroll
            document.body.style.overflow = '';
        }, 300);

        // Announce to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Language selection dialog closed');
        }
    }

    /**
     * Check if the modal is currently visible
     * @private
     * @returns {boolean} True if modal is visible
     */
    isModalVisible() {
        return this.modalOverlay && 
               this.modalOverlay.style.display === 'flex' && 
               this.modalOverlay.classList.contains('show');
    }

    /**
     * Handle language change from modal selection
     * @param {string} languageCode - Selected language code
     */
    handleLanguageChange(languageCode) {
        try {
            console.log('Language change requested:', languageCode);

            // Validate language manager exists
            if (!this.languageManager) {
                throw new Error('Language manager not available');
            }

            // Validate language code
            if (!this.languageManager.isLanguageSupported(languageCode)) {
                throw new Error(`Unsupported language: ${languageCode}`);
            }

            // Get previous language for event
            const previousLanguage = this.languageManager.getCurrentLanguage();

            // Set the language
            const success = this.languageManager.setLanguage(languageCode);
            if (!success) {
                throw new Error(`Failed to set language: ${languageCode}`);
            }

            // Update toggle button
            this.updateToggleButton();

            // Hide modal
            this.hideModal();

            // Dispatch language change event
            const languageChangeEvent = new CustomEvent('languageChanged', {
                detail: {
                    newLanguage: languageCode,
                    previousLanguage: previousLanguage
                }
            });
            document.dispatchEvent(languageChangeEvent);

            // Announce change to screen readers
            const languageName = languageCode === 'dutch' ? 'Nederlands' : 'English';
            if (window.announceStatus) {
                window.announceStatus(`Language changed to ${languageName}`);
            }

            console.log('Language successfully changed to:', languageCode);

        } catch (error) {
            console.error('Error handling language change:', error);
            console.error('Error details:', {
                languageCode,
                languageManagerExists: !!this.languageManager,
                currentLanguage: this.languageManager ? this.languageManager.getCurrentLanguage() : 'unknown'
            });
            
            if (window.errorHandler) {
                const errorMessage = 'There was a problem switching languages. Please try again.';
                window.errorHandler.showError(errorMessage, 'error', 4000);
            } else {
                // Fallback error display
                alert('There was a problem switching languages. Please refresh the page and try again.');
            }
        }
    }

    /**
     * Handle toggle button click to switch languages
     * @private
     */
    handleToggleClick() {
        console.log('=== LANGUAGE TOGGLE STARTED ===');
        
        try {
            console.log('Toggle button clicked');
            
            // Validate language manager exists
            if (!this.languageManager) {
                throw new Error('Language manager not available');
            }

            // Get current language before toggle
            const previousLanguage = this.languageManager.getCurrentLanguage();
            console.log('Current language before toggle:', previousLanguage);

            // Add visual feedback
            if (this.toggleButton) {
                this.toggleButton.classList.add('language-switching');
                console.log('Added visual feedback to toggle button');
            }
            
            // Toggle language
            console.log('Calling languageManager.toggleLanguage()...');
            const newLanguage = this.languageManager.toggleLanguage();
            console.log('Language toggled to:', newLanguage);
            
            // Validate the toggle was successful
            if (!newLanguage || newLanguage === previousLanguage) {
                throw new Error('Language toggle failed - no change detected');
            }

            // Update toggle button
            console.log('Updating toggle button...');
            this.updateToggleButton();
            console.log('Toggle button updated');

            // Dispatch language change event
            console.log('Dispatching language change event...');
            const languageChangeEvent = new CustomEvent('languageChanged', {
                detail: {
                    newLanguage: newLanguage,
                    previousLanguage: previousLanguage
                }
            });
            document.dispatchEvent(languageChangeEvent);
            console.log('Language change event dispatched');

            // Remove visual feedback after animation
            setTimeout(() => {
                if (this.toggleButton) {
                    this.toggleButton.classList.remove('language-switching');
                    console.log('Removed visual feedback from toggle button');
                }
            }, 500);

            // Announce change to screen readers
            const languageName = newLanguage === 'dutch' ? 'Nederlands' : 'English';
            if (window.announceStatus) {
                window.announceStatus(`Language switched to ${languageName}`);
            }

            console.log('=== LANGUAGE TOGGLE COMPLETED SUCCESSFULLY ===');

        } catch (error) {
            console.error('=== LANGUAGE TOGGLE FAILED ===');
            console.error('Error handling toggle click:', error);
            console.error('Toggle error details:', {
                languageManagerExists: !!this.languageManager,
                currentLanguage: this.languageManager ? this.languageManager.getCurrentLanguage() : 'unknown',
                toggleButtonExists: !!this.toggleButton,
                errorMessage: error.message,
                errorStack: error.stack
            });
            
            // Remove visual feedback on error
            if (this.toggleButton) {
                this.toggleButton.classList.remove('language-switching');
            }
            
            // Don't show any error messages to the user - just log them
            console.log('Language toggle failed but not showing error to user');
        }
    }

    /**
     * Show language switcher (for programmatic access)
     * This method can be used to show the modal from other parts of the application
     */
    showLanguageSwitcher() {
        this.showModal();
    }

    /**
     * Get the current state of the language selection UI
     * @returns {Object} Current state information
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            hasShownInitialSelection: this.hasShownInitialSelection,
            hasExistingPreference: this.hasExistingPreference,
            isModalVisible: this.isModalVisible(),
            currentLanguage: this.languageManager.getCurrentLanguage()
        };
    }

    /**
     * Destroy the language selection UI and clean up resources
     */
    destroy() {
        try {
            // Remove modal from DOM
            if (this.modalOverlay && this.modalOverlay.parentNode) {
                this.modalOverlay.parentNode.removeChild(this.modalOverlay);
            }

            // Remove toggle button from DOM
            if (this.toggleButton && this.toggleButton.parentNode) {
                this.toggleButton.parentNode.removeChild(this.toggleButton);
            }

            // Clear references
            this.modalOverlay = null;
            this.toggleButton = null;
            this.isInitialized = false;

            console.log('LanguageSelectionUI destroyed');

        } catch (error) {
            console.error('Error destroying LanguageSelectionUI:', error);
        }
    }
}