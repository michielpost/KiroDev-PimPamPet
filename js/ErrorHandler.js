/**
 * ErrorHandler - Centralized error handling and graceful degradation
 * Provides fallback mechanisms and user-friendly error messages in Dutch for children
 */
class ErrorHandler {
    constructor() {
        this.errorDisplay = null;
        this.fallbackMode = false;
        this.browserSupport = this.checkBrowserSupport();
        this.initializeErrorDisplay();
    }

    /**
     * Initializes the error display system
     */
    initializeErrorDisplay() {
        this.errorDisplay = document.getElementById('error-display');
        if (!this.errorDisplay) {
            // Create error display if it doesn't exist
            this.createErrorDisplay();
        }
    }

    /**
     * Creates error display element if missing
     */
    createErrorDisplay() {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-display';
        errorDiv.className = 'error-display';
        errorDiv.style.display = 'none';
        
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.insertBefore(errorDiv, gameContainer.firstChild);
            this.errorDisplay = errorDiv;
        }
    }

    /**
     * Checks browser support for required features
     * @returns {Object} - Object containing browser support information
     */
    checkBrowserSupport() {
        const support = {
            localStorage: this.testLocalStorage(),
            cssTransitions: this.testCSSTransitions(),
            cssTransforms: this.testCSSTransforms(),
            promises: typeof Promise !== 'undefined',
            es6Classes: this.testES6Classes(),
            addEventListener: typeof document.addEventListener === 'function'
        };

        // Log browser support status
        console.log('Browser support check:', support);
        
        return support;
    }

    /**
     * Tests localStorage support
     * @returns {boolean} - True if localStorage is supported
     */
    testLocalStorage() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Tests CSS transitions support
     * @returns {boolean} - True if CSS transitions are supported
     */
    testCSSTransitions() {
        const element = document.createElement('div');
        const properties = ['transition', 'WebkitTransition', 'MozTransition', 'OTransition'];
        
        for (let property of properties) {
            if (element.style[property] !== undefined) {
                return true;
            }
        }
        return false;
    }

    /**
     * Tests CSS transforms support
     * @returns {boolean} - True if CSS transforms are supported
     */
    testCSSTransforms() {
        const element = document.createElement('div');
        const properties = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform'];
        
        for (let property of properties) {
            if (element.style[property] !== undefined) {
                return true;
            }
        }
        return false;
    }

    /**
     * Tests ES6 class support
     * @returns {boolean} - True if ES6 classes are supported
     */
    testES6Classes() {
        try {
            eval('class TestClass {}');
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Displays a user-friendly error message in Dutch for children
     * @param {string} message - The error message to display
     * @param {string} type - Error type ('error', 'warning', 'info')
     * @param {number} duration - How long to show the message (0 = permanent)
     */
    showError(message, type = 'error', duration = 5000) {
        if (!this.errorDisplay) {
            console.error('Error display not available:', message);
            return;
        }

        // Clear any existing error
        this.clearError();

        // Set message and styling
        this.errorDisplay.textContent = message;
        this.errorDisplay.className = `error-display ${type}`;
        this.errorDisplay.style.display = 'block';

        // Add child-friendly styling
        this.errorDisplay.style.fontSize = '18px';
        this.errorDisplay.style.padding = '15px';
        this.errorDisplay.style.borderRadius = '10px';
        this.errorDisplay.style.margin = '10px';
        this.errorDisplay.style.textAlign = 'center';

        // Auto-hide after duration (if specified)
        if (duration > 0) {
            setTimeout(() => {
                this.clearError();
            }, duration);
        }

        console.error(`[${type.toUpperCase()}] ${message}`);
    }

    /**
     * Clears the current error message
     */
    clearError() {
        if (this.errorDisplay) {
            this.errorDisplay.style.display = 'none';
            this.errorDisplay.textContent = '';
            this.errorDisplay.className = 'error-display';
        }
    }

    /**
     * Handles animation failures with fallback mechanisms
     * @param {string} animationType - Type of animation that failed
     * @param {Function} fallbackFunction - Fallback function to execute
     * @param {string} userMessage - User-friendly message to display
     */
    handleAnimationFailure(animationType, fallbackFunction, userMessage) {
        console.warn(`Animation failure detected: ${animationType}`);
        
        // Execute fallback function
        if (typeof fallbackFunction === 'function') {
            try {
                fallbackFunction();
            } catch (error) {
                console.error('Fallback function failed:', error);
            }
        }

        // Show user message if provided
        if (userMessage) {
            this.showError(userMessage, 'warning', 3000);
        }

        // Enable fallback mode
        this.fallbackMode = true;
        document.body.classList.add('fallback-mode');
    }

    /**
     * Handles wheel spinning errors with appropriate fallbacks
     * @param {Error} error - The error that occurred
     * @param {Function} fallbackSpinFunction - Fallback spinning function
     */
    handleWheelSpinError(error, fallbackSpinFunction) {
        console.error('Wheel spin error:', error);

        const userMessage = 'Het wiel heeft een probleem. We proberen het op een andere manier!';
        
        this.handleAnimationFailure('wheel-spin', fallbackSpinFunction, userMessage);
    }

    /**
     * Handles question loading errors
     * @param {Error} error - The error that occurred
     * @param {Function} fallbackQuestionFunction - Fallback question loading function
     */
    handleQuestionLoadError(error, fallbackQuestionFunction) {
        console.error('Question loading error:', error);

        const userMessage = 'Er is een probleem met het laden van vragen. We gebruiken de standaard vragen.';
        
        if (typeof fallbackQuestionFunction === 'function') {
            try {
                fallbackQuestionFunction();
                this.showError(userMessage, 'warning', 4000);
            } catch (fallbackError) {
                console.error('Question fallback failed:', fallbackError);
                this.showError('Er zijn geen vragen beschikbaar. Ververs de pagina om opnieuw te proberen.', 'error');
            }
        }
    }

    /**
     * Handles local storage errors
     * @param {Error} error - The error that occurred
     * @param {string} operation - The operation that failed ('save', 'load')
     */
    handleStorageError(error, operation) {
        console.error(`Storage ${operation} error:`, error);

        let userMessage;
        if (operation === 'save') {
            userMessage = 'Je aangepaste vragen kunnen niet worden opgeslagen. Ze blijven alleen voor deze sessie beschikbaar.';
        } else {
            userMessage = 'Je opgeslagen vragen kunnen niet worden geladen. We gebruiken de standaard vragen.';
        }

        this.showError(userMessage, 'warning', 6000);
    }

    /**
     * Provides graceful degradation for older browsers
     */
    enableGracefulDegradation() {
        console.log('Enabling graceful degradation for older browser');

        // Disable animations if not supported
        if (!this.browserSupport.cssTransitions || !this.browserSupport.cssTransforms) {
            document.body.classList.add('no-animations');
            this.showError('Je browser ondersteunt geen animaties. Het spel werkt nog steeds!', 'info', 4000);
        }

        // Provide localStorage fallback
        if (!this.browserSupport.localStorage) {
            this.createLocalStorageFallback();
            this.showError('Aangepaste vragen kunnen niet worden opgeslagen in deze browser.', 'warning', 5000);
        }

        // Provide Promise fallback for older browsers
        if (!this.browserSupport.promises) {
            this.createPromiseFallback();
        }

        // Enable fallback mode
        this.fallbackMode = true;
        document.body.classList.add('fallback-mode');
    }

    /**
     * Creates a simple localStorage fallback using memory storage
     */
    createLocalStorageFallback() {
        if (typeof Storage === 'undefined') {
            window.localStorage = {
                _data: {},
                setItem: function(key, value) {
                    this._data[key] = value;
                },
                getItem: function(key) {
                    return this._data[key] || null;
                },
                removeItem: function(key) {
                    delete this._data[key];
                }
            };
        }
    }

    /**
     * Creates a simple Promise fallback for older browsers
     */
    createPromiseFallback() {
        if (typeof Promise === 'undefined') {
            window.Promise = function(executor) {
                const self = this;
                self.state = 'pending';
                self.value = undefined;
                self.handlers = [];

                function resolve(result) {
                    if (self.state === 'pending') {
                        self.state = 'fulfilled';
                        self.value = result;
                        self.handlers.forEach(handle);
                        self.handlers = null;
                    }
                }

                function reject(error) {
                    if (self.state === 'pending') {
                        self.state = 'rejected';
                        self.value = error;
                        self.handlers.forEach(handle);
                        self.handlers = null;
                    }
                }

                function handle(handler) {
                    if (self.state === 'pending') {
                        self.handlers.push(handler);
                    } else {
                        if (self.state === 'fulfilled' && typeof handler.onFulfilled === 'function') {
                            handler.onFulfilled(self.value);
                        }
                        if (self.state === 'rejected' && typeof handler.onRejected === 'function') {
                            handler.onRejected(self.value);
                        }
                    }
                }

                this.then = function(onFulfilled, onRejected) {
                    return new Promise(function(resolve, reject) {
                        handle({
                            onFulfilled: function(result) {
                                try {
                                    resolve(onFulfilled ? onFulfilled(result) : result);
                                } catch (ex) {
                                    reject(ex);
                                }
                            },
                            onRejected: function(error) {
                                try {
                                    resolve(onRejected ? onRejected(error) : error);
                                } catch (ex) {
                                    reject(ex);
                                }
                            }
                        });
                    });
                };

                executor(resolve, reject);
            };
        }
    }

    /**
     * Wraps a function with error handling
     * @param {Function} func - Function to wrap
     * @param {string} errorMessage - Error message to show on failure
     * @param {Function} fallbackFunc - Fallback function to execute on error
     * @returns {Function} - Wrapped function with error handling
     */
    wrapWithErrorHandling(func, errorMessage, fallbackFunc) {
        return (...args) => {
            try {
                const result = func.apply(this, args);
                
                // Handle promises
                if (result && typeof result.then === 'function') {
                    return result.catch(error => {
                        console.error('Promise error:', error);
                        this.showError(errorMessage, 'error', 4000);
                        if (fallbackFunc) {
                            return fallbackFunc.apply(this, args);
                        }
                    });
                }
                
                return result;
            } catch (error) {
                console.error('Function error:', error);
                this.showError(errorMessage, 'error', 4000);
                if (fallbackFunc) {
                    return fallbackFunc.apply(this, args);
                }
            }
        };
    }

    /**
     * Gets browser support information
     * @returns {Object} - Browser support object
     */
    getBrowserSupport() {
        return { ...this.browserSupport };
    }

    /**
     * Checks if fallback mode is enabled
     * @returns {boolean} - True if in fallback mode
     */
    isFallbackMode() {
        return this.fallbackMode;
    }

    /**
     * Handles critical errors that prevent game functionality
     * @param {Error} error - The critical error
     * @param {string} userMessage - User-friendly message
     */
    handleCriticalError(error, userMessage) {
        console.error('Critical error:', error);
        
        const message = userMessage || 'Er is een ernstige fout opgetreden. Ververs de pagina om opnieuw te proberen.';
        this.showError(message, 'error', 0); // Permanent error message
        
        // Disable all interactive elements
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}