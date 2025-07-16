/**
 * SpinningWheel - Handles the spinning wheel component with letter selection
 * Creates a circular wheel layout with a viewing window that shows only the selected letter
 */
class SpinningWheel {
    constructor(containerId) {
        this.containerId = containerId;
        this.isSpinning = false;
        this.selectedLetter = null;
        this.currentRotation = 0;
        this.animationFailed = false;
        this.errorHandler = window.errorHandler || null;
        
        // Dutch alphabet excluding c, x, q, y (22 letters total)
        this.letters = [
            'a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 
            'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'z'
        ];
        
        // Calculate angle per letter segment
        this.anglePerLetter = 360 / this.letters.length;
        
        try {
            this.createWheelElement();
            this.positionLetters();
        } catch (error) {
            console.error('Error initializing spinning wheel:', error);
            if (this.errorHandler) {
                this.errorHandler.handleCriticalError(error, 'Het draaiende wiel kan niet worden geladen. Ververs de pagina om opnieuw te proberen.');
            }
        }
    }

    /**
     * Creates the spinning wheel HTML structure
     */
    createWheelElement() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id '${this.containerId}' not found`);
            return;
        }

        container.innerHTML = `
            <div class="spinning-wheel-container">
                <div class="wheel-wrapper">
                    <div class="wheel" id="wheel">
                        <!-- Letters will be positioned here -->
                    </div>
                    <div class="viewing-window">
                        <div class="window-pointer"></div>
                        <div class="selected-letter-display" id="selected-letter">
                            ?
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Positions all letters around the circular wheel
     */
    positionLetters() {
        const wheel = document.getElementById('wheel');
        if (!wheel) return;

        // Clear existing letters
        wheel.innerHTML = '';

        this.letters.forEach((letter, index) => {
            const letterElement = document.createElement('div');
            letterElement.className = 'wheel-letter';
            letterElement.textContent = letter.toUpperCase();
            letterElement.setAttribute('data-letter', letter);
            letterElement.setAttribute('data-index', index);

            // Calculate position around the circle
            const angle = index * this.anglePerLetter;
            const radius = 120; // Distance from center
            
            // Convert angle to radians and calculate x, y coordinates
            const radian = (angle - 90) * (Math.PI / 180); // -90 to start at top
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            // Position the letter
            letterElement.style.left = `calc(50% + ${x}px)`;
            letterElement.style.top = `calc(50% + ${y}px)`;
            letterElement.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

            wheel.appendChild(letterElement);
        });

        // Set initial selected letter (first letter)
        this.updateSelectedLetter(0);
    }

    /**
     * Spins the wheel and selects a random letter
     * @returns {Promise<string>} - Promise that resolves with the selected letter
     */
    spin() {
        if (this.isSpinning) {
            return Promise.resolve(this.selectedLetter);
        }

        return new Promise((resolve, reject) => {
            try {
                this.isSpinning = true;
                
                // Add visual feedback for spinning state
                this.addSpinningVisualFeedback();
                
                // Generate random rotation with proper distribution
                const minSpins = 4;
                const maxSpins = 7;
                const spins = minSpins + Math.random() * (maxSpins - minSpins);
                
                // Ensure proper random distribution across all letters
                const randomLetterIndex = Math.floor(Math.random() * this.letters.length);
                const targetAngle = randomLetterIndex * this.anglePerLetter;
                
                // Calculate total rotation (accounting for current position)
                const totalRotation = this.currentRotation + (spins * 360) + targetAngle;
                
                const wheel = document.getElementById('wheel');
                const selectedDisplay = document.getElementById('selected-letter');
                
                if (!wheel || !selectedDisplay) {
                    console.error('Wheel elements not found');
                    this.isSpinning = false;
                    this.removeSpinningVisualFeedback();
                    this.fallbackSpin(randomLetterIndex, resolve);
                    return;
                }

                // Check for animation support and use fallback if needed
                if (this.animationFailed || (this.errorHandler && this.errorHandler.isFallbackMode())) {
                    this.fallbackSpin(randomLetterIndex, resolve);
                    return;
                }

                try {
                    // Show enhanced spinning state in viewing window
                    selectedDisplay.textContent = '...';
                    selectedDisplay.style.animation = 'pulse 0.5s infinite alternate';
                    selectedDisplay.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    // Apply enhanced realistic spinning animation with natural deceleration
                    wheel.style.transition = 'transform 3.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    wheel.style.transform = `rotate(${totalRotation}deg)`;
                    
                    // Update current rotation for next spin (normalize to 0-360)
                    this.currentRotation = totalRotation % 360;
                    
                    // Enhanced spinning feedback with progressive updates
                    this.addProgressiveSpinningFeedback();
                    
                    // Set up animation completion handler with error detection
                    const animationTimeout = setTimeout(() => {
                        try {
                            this.completeSpinAnimation(randomLetterIndex, selectedDisplay, resolve);
                        } catch (completionError) {
                            console.error('Error completing spin animation:', completionError);
                            this.handleAnimationFailure(randomLetterIndex, resolve);
                        }
                    }, 3800);

                    // Set up fallback timeout in case animation fails
                    const fallbackTimeout = setTimeout(() => {
                        console.warn('Animation timeout - using fallback');
                        clearTimeout(animationTimeout);
                        this.handleAnimationFailure(randomLetterIndex, resolve);
                    }, 5000);

                    // Clear fallback timeout when animation completes normally
                    setTimeout(() => {
                        clearTimeout(fallbackTimeout);
                    }, 3900);

                } catch (animationError) {
                    console.error('Animation error:', animationError);
                    this.handleAnimationFailure(randomLetterIndex, resolve);
                }
                
            } catch (error) {
                console.error('Spin error:', error);
                this.isSpinning = false;
                this.removeSpinningVisualFeedback();
                
                // Always use fallback instead of throwing errors
                const randomIndex = Math.floor(Math.random() * this.letters.length);
                this.fallbackSpin(randomIndex, resolve);
            }
        });
    }

    /**
     * Updates the selected letter display with enhanced animations
     * @param {number} letterIndex - Index of the selected letter
     * @param {boolean} withRevealAnimation - Whether to show the letter reveal animation
     */
    updateSelectedLetter(letterIndex, withRevealAnimation = false) {
        if (letterIndex >= 0 && letterIndex < this.letters.length) {
            this.selectedLetter = this.letters[letterIndex];
            
            const selectedDisplay = document.getElementById('selected-letter');
            const viewingWindow = document.querySelector('.viewing-window');
            
            if (selectedDisplay) {
                selectedDisplay.textContent = this.selectedLetter.toUpperCase();
                
                if (withRevealAnimation) {
                    // Add letter reveal animation
                    selectedDisplay.classList.add('letter-reveal');
                    
                    // Add celebration animation to viewing window
                    if (viewingWindow) {
                        viewingWindow.classList.add('letter-selected');
                    }
                    
                    // Remove animation classes after completion
                    setTimeout(() => {
                        selectedDisplay.classList.remove('letter-reveal');
                        if (viewingWindow) {
                            viewingWindow.classList.remove('letter-selected');
                        }
                    }, 1000);
                } else {
                    // Simple scale animation for non-reveal updates
                    selectedDisplay.style.transform = 'scale(1.2)';
                    selectedDisplay.style.color = '#4CAF50';
                    
                    setTimeout(() => {
                        selectedDisplay.style.transform = 'scale(1)';
                        selectedDisplay.style.color = 'white';
                    }, 300);
                }
            }
            
            // Highlight the selected letter on the wheel
            this.highlightSelectedLetter(letterIndex);
        }
    }

    /**
     * Highlights the currently selected letter on the wheel
     * @param {number} letterIndex - Index of the letter to highlight
     */
    highlightSelectedLetter(letterIndex) {
        const allLetters = document.querySelectorAll('.wheel-letter');
        
        // Remove highlight from all letters
        allLetters.forEach(letter => {
            letter.classList.remove('selected');
        });
        
        // Add highlight to selected letter
        if (allLetters[letterIndex]) {
            allLetters[letterIndex].classList.add('selected');
        }
    }

    /**
     * Gets the currently selected letter
     * @returns {string|null} - The selected letter or null if none selected
     */
    getSelectedLetter() {
        return this.selectedLetter;
    }

    /**
     * Resets the wheel to initial state
     */
    reset() {
        this.isSpinning = false;
        this.currentRotation = 0;
        
        const wheel = document.getElementById('wheel');
        if (wheel) {
            wheel.style.transition = 'none';
            wheel.style.transform = 'rotate(0deg)';
        }
        
        // Reset to first letter
        this.updateSelectedLetter(0);
        
        // Force reflow to ensure transition is removed
        setTimeout(() => {
            if (wheel) {
                wheel.style.transition = '';
            }
        }, 50);
    }

    /**
     * Checks if the wheel is currently spinning
     * @returns {boolean} - True if spinning, false otherwise
     */
    isWheelSpinning() {
        return this.isSpinning;
    }

    /**
     * Gets all available letters
     * @returns {string[]} - Array of all letters in the wheel
     */
    getAllLetters() {
        return [...this.letters];
    }

    /**
     * Gets the total number of letters
     * @returns {number} - Number of letters in the wheel
     */
    getLetterCount() {
        return this.letters.length;
    }

    /**
     * Forces selection of a specific letter (for testing purposes)
     * @param {string} letter - The letter to select
     * @returns {boolean} - True if letter exists and was selected, false otherwise
     */
    forceSelectLetter(letter) {
        const letterIndex = this.letters.indexOf(letter.toLowerCase());
        if (letterIndex >= 0) {
            this.updateSelectedLetter(letterIndex);
            return true;
        }
        return false;
    }

    /**
     * Adds visual feedback during spinning state
     */
    addSpinningVisualFeedback() {
        const wheel = document.getElementById('wheel');
        const viewingWindow = document.querySelector('.viewing-window');
        
        if (wheel) {
            wheel.classList.add('spinning');
        }
        
        if (viewingWindow) {
            viewingWindow.classList.add('spinning-active');
        }
        
        // Add spinning glow effect to wheel
        if (wheel) {
            wheel.style.boxShadow = `
                0 0 30px rgba(255, 152, 0, 0.6),
                inset 0 0 30px rgba(255, 193, 7, 0.4),
                0 0 60px rgba(255, 152, 0, 0.3)
            `;
        }
    }

    /**
     * Adds progressive spinning feedback with timed visual updates
     */
    addProgressiveSpinningFeedback() {
        try {
            const wheel = document.getElementById('wheel');
            const viewingWindow = document.querySelector('.viewing-window');
            
            // Progressive intensity updates during spinning
            const intensitySteps = [
                { time: 500, intensity: 0.4 },
                { time: 1000, intensity: 0.7 },
                { time: 1500, intensity: 1.0 },
                { time: 2500, intensity: 0.8 },
                { time: 3200, intensity: 0.5 }
            ];
            
            intensitySteps.forEach(step => {
                setTimeout(() => {
                    try {
                        if (this.isSpinning && wheel) {
                            const alpha = step.intensity;
                            wheel.style.boxShadow = `
                                0 0 ${20 + (30 * alpha)}px rgba(255, 152, 0, ${0.3 + (0.4 * alpha)}),
                                inset 0 0 ${15 + (25 * alpha)}px rgba(255, 193, 7, ${0.2 + (0.3 * alpha)}),
                                0 0 ${40 + (40 * alpha)}px rgba(255, 152, 0, ${0.2 + (0.2 * alpha)})
                            `;
                        }
                        
                        if (this.isSpinning && viewingWindow) {
                            viewingWindow.style.transform = `translateX(-50%) scale(${1 + (0.05 * alpha)})`;
                        }
                    } catch (feedbackError) {
                        console.warn('Error applying progressive feedback:', feedbackError);
                    }
                }, step.time);
            });
        } catch (error) {
            console.warn('Error setting up progressive spinning feedback:', error);
        }
    }

    /**
     * Removes visual feedback after spinning completes
     */
    removeSpinningVisualFeedback() {
        try {
            const wheel = document.getElementById('wheel');
            const viewingWindow = document.querySelector('.viewing-window');
            
            if (wheel) {
                wheel.classList.remove('spinning');
                // Reset to original box shadow
                wheel.style.boxShadow = `
                    0 0 20px rgba(255, 152, 0, 0.3),
                    inset 0 0 20px rgba(255, 193, 7, 0.2)
                `;
            }
            
            if (viewingWindow) {
                viewingWindow.classList.remove('spinning-active');
                // Reset transform if it was modified
                viewingWindow.style.transform = 'translateX(-50%)';
            }
        } catch (error) {
            console.warn('Error removing spinning visual feedback:', error);
        }
    }

    /**
     * Completes the spin animation normally
     * @param {number} randomLetterIndex - Index of the selected letter
     * @param {HTMLElement} selectedDisplay - The selected letter display element
     * @param {Function} resolve - Promise resolve function
     */
    completeSpinAnimation(randomLetterIndex, selectedDisplay, resolve) {
        this.isSpinning = false;
        this.removeSpinningVisualFeedback();
        
        // Stop the pulsing animation with smooth transition
        selectedDisplay.style.animation = '';
        
        // Update selected letter with enhanced reveal animation
        this.updateSelectedLetter(randomLetterIndex, true);
        resolve(this.selectedLetter);
    }

    /**
     * Handles animation failure with fallback mechanism
     * @param {number} randomLetterIndex - Index of the selected letter
     * @param {Function} resolve - Promise resolve function
     */
    handleAnimationFailure(randomLetterIndex, resolve) {
        console.warn('Wheel animation failed, using fallback');
        this.animationFailed = true;
        
        if (this.errorHandler) {
            this.errorHandler.handleAnimationFailure(
                'wheel-spin',
                () => this.fallbackSpin(randomLetterIndex, resolve),
                'Het wiel draait anders dan normaal, maar het werkt nog steeds!'
            );
        } else {
            this.fallbackSpin(randomLetterIndex, resolve);
        }
    }

    /**
     * Fallback spinning mechanism without animations
     * @param {number} letterIndex - Index of the letter to select
     * @param {Function} resolve - Promise resolve function
     */
    fallbackSpin(letterIndex, resolve) {
        console.log('Using fallback spin mechanism');
        
        try {
            // Ensure letterIndex is valid
            const validIndex = Math.max(0, Math.min(letterIndex, this.letters.length - 1));
            
            const selectedDisplay = document.getElementById('selected-letter');
            
            // Simple fallback without animations
            if (selectedDisplay) {
                selectedDisplay.textContent = '...';
                
                // Simulate spinning delay
                setTimeout(() => {
                    try {
                        this.isSpinning = false;
                        this.removeSpinningVisualFeedback();
                        
                        // Update selected letter without animations
                        this.updateSelectedLetter(validIndex, false);
                        
                        // Add simple visual feedback
                        if (selectedDisplay) {
                            selectedDisplay.style.backgroundColor = '#4CAF50';
                            selectedDisplay.style.color = 'white';
                            
                            setTimeout(() => {
                                selectedDisplay.style.backgroundColor = '';
                                selectedDisplay.style.color = '';
                            }, 1000);
                        }
                        
                        resolve(this.selectedLetter);
                    } catch (fallbackError) {
                        console.error('Error in fallback spin completion:', fallbackError);
                        // Emergency completion
                        this.isSpinning = false;
                        this.selectedLetter = this.letters[validIndex];
                        resolve(this.selectedLetter);
                    }
                }, 1500); // Shorter delay for fallback
            } else {
                // Emergency fallback
                this.isSpinning = false;
                this.selectedLetter = this.letters[validIndex];
                resolve(this.selectedLetter);
            }
        } catch (error) {
            console.error('Error in fallback spin:', error);
            // Ultimate fallback - just resolve with a random letter
            this.isSpinning = false;
            const safeIndex = Math.floor(Math.random() * this.letters.length);
            this.selectedLetter = this.letters[safeIndex];
            resolve(this.selectedLetter);
        }
    }

    /**
     * Validates wheel state and repairs if necessary
     * @returns {boolean} - True if wheel is valid, false if repairs were needed
     */
    validateAndRepair() {
        try {
            const wheel = document.getElementById('wheel');
            const selectedDisplay = document.getElementById('selected-letter');
            const container = document.getElementById(this.containerId);
            
            // Check if essential elements exist
            if (!container) {
                console.error('Wheel container missing');
                return false;
            }
            
            if (!wheel || !selectedDisplay) {
                console.warn('Wheel elements missing, recreating...');
                this.createWheelElement();
                this.positionLetters();
                return false;
            }
            
            // Check if letters are positioned
            const letters = wheel.querySelectorAll('.wheel-letter');
            if (letters.length !== this.letters.length) {
                console.warn('Letters missing, repositioning...');
                this.positionLetters();
                return false;
            }
            
            // Validate selected letter
            if (!this.selectedLetter || !this.letters.includes(this.selectedLetter)) {
                console.warn('Invalid selected letter, resetting...');
                this.updateSelectedLetter(0);
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error validating wheel:', error);
            if (this.errorHandler) {
                this.errorHandler.handleCriticalError(error, 'Het draaiende wiel heeft een probleem. Ververs de pagina om opnieuw te proberen.');
            }
            return false;
        }
    }

    /**
     * Gets statistics about the wheel
     * @returns {Object} - Object containing wheel statistics
     */
    getWheelStats() {
        return {
            totalLetters: this.letters.length,
            selectedLetter: this.selectedLetter,
            isSpinning: this.isSpinning,
            currentRotation: this.currentRotation,
            excludedLetters: ['c', 'x', 'q', 'y'],
            animationFailed: this.animationFailed,
            isValid: this.validateAndRepair()
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpinningWheel;
}