/**
 * GameController - Orchestrates game flow and manages game state
 * Coordinates between SpinningWheel, QuestionDisplay, and user interactions
 */
class GameController {
    constructor(wheelContainerId, questionContainerId, languageManager) {
        this.wheelContainerId = wheelContainerId;
        this.questionContainerId = questionContainerId;
        this.languageManager = languageManager || window.languageManager;
        this.errorHandler = window.errorHandler || null;
        this.initializationFailed = false;
        
        // Initialize game state object
        this.gameState = {
            currentQuestion: null,
            selectedLetter: null,
            roundNumber: 0,
            isSpinning: false,
            gameStarted: false,
            currentLanguage: this.languageManager ? this.languageManager.getCurrentLanguage() : 'dutch'
        };
        
        try {
            // Initialize components with error handling and language support
            this.questionManager = new QuestionManager(this.languageManager);
            this.spinningWheel = new SpinningWheel(wheelContainerId);
            this.questionDisplay = new QuestionDisplay(questionContainerId, this.questionManager, this.languageManager);
            
            this.initializeEventListeners();
            this.setupLanguageChangeListener();
            this.validateComponents();
        } catch (error) {
            console.error('Error initializing GameController:', error);
            this.initializationFailed = true;
            if (this.errorHandler) {
                const errorMessage = this.languageManager ? 
                    (this.languageManager.getCurrentLanguage() === 'dutch' ? 
                        'Het spel kan niet worden gestart. Ververs de pagina om opnieuw te proberen.' :
                        'The game could not be started. Refresh the page to try again.') :
                    'Het spel kan niet worden gestart. Ververs de pagina om opnieuw te proberen.';
                this.errorHandler.handleCriticalError(error, errorMessage);
            }
        }
    }

    /**
     * Initializes event listeners for game controls
     */
    initializeEventListeners() {
        // Spin button event listener
        const spinButton = document.getElementById('spin-button');
        if (spinButton) {
            spinButton.addEventListener('click', () => this.handleSpin());
        }
        
        // New game button event listener
        const newGameButton = document.getElementById('new-game-button');
        if (newGameButton) {
            newGameButton.addEventListener('click', () => this.startNewRound());
        }
    }

    /**
     * Sets up language change listener to update game components when language changes
     */
    setupLanguageChangeListener() {
        document.addEventListener('languageChanged', (event) => {
            const { newLanguage } = event.detail;
            this.onLanguageChange(newLanguage);
        });
    }

    /**
     * Handles language change by updating all components and UI text
     * @param {string} newLanguage - The new language code
     */
    onLanguageChange(newLanguage) {
        try {
            console.log(`GameController handling language change to: ${newLanguage}`);
            
            // Update game state
            this.gameState.currentLanguage = newLanguage;
            console.log('Game state updated');
            
            // Update question display for new language
            if (this.questionDisplay) {
                console.log('Updating question display for new language');
                this.questionDisplay.onLanguageChange(newLanguage);
                console.log('Question display updated');
            } else {
                console.warn('Question display not available');
            }
            
            // Update button text based on game state and new language
            console.log('Updating new game button text');
            this.updateNewGameButtonText();
            console.log('New game button text updated');
            
            // If game is active, refresh question bank for new language
            if (this.gameState.gameStarted) {
                console.log('Refreshing question bank for active game');
                this.refreshQuestionBank();
                console.log('Question bank refreshed');
            }
            
            console.log(`Game controller updated for language: ${newLanguage}`);
        } catch (error) {
            console.error('Error handling language change in GameController:', error);
            console.error('Error details:', error.stack);
            console.error('Error occurred at step:', error.message);
            
            // Don't show error message to user for language switching issues
            // The language switch should still work even if some components have minor issues
            console.log('Language change completed with minor issues - continuing normally');
            
            // Specifically do NOT show any error messages to the user for language changes
            // The language switching should work transparently
        }
    }

    /**
     * Starts a new round of the game with enhanced smooth transitions
     * Coordinates question and wheel reset as per requirement 5.1, 5.2
     */
    startNewRound() {
        try {
            // Add visual feedback for button press
            this.addButtonPressEffect('new-game-button');
            
            // Add game phase transition animation
            this.addGamePhaseTransition();
            
            // Enhanced loading state for new game button
            const newGameButton = document.getElementById('new-game-button');
            if (newGameButton) {
                const originalText = newGameButton.textContent;
                newGameButton.classList.add('loading');
                newGameButton.disabled = true;
                
                // Use setTimeout to show loading state with smooth transition
                setTimeout(() => {
                    try {
                        // Add state change animation to game sections
                        this.addSectionStateChangeAnimation();
                        
                        // Reset wheel to initial state with smooth transition
                        this.spinningWheel.reset();
                        
                        // Display a new random question with enhanced transition
                        const newQuestion = this.questionDisplay.showRandomQuestion();
                        
                        if (newQuestion) {
                            // Update game state
                            this.gameState.currentQuestion = newQuestion;
                            this.gameState.selectedLetter = null;
                            this.gameState.roundNumber += 1;
                            this.gameState.isSpinning = false;
                            this.gameState.gameStarted = true;
                            
                            // Enable spin button with smooth transition
                            this.enableSpinButton();
                            
                            // Update UI to reflect new round with animations
                            this.updateGameUI();
                            
                            // Hide previous results with smooth animation
                            this.hideResults();
                            
                            // Remove active state from game sections with transition
                            this.removeGameActiveState();
                            
                            console.log(`New round started: Round ${this.gameState.roundNumber}`);
                            console.log(`Question: ${this.gameState.currentQuestion}`);
                        } else {
                            console.error('Failed to start new round: No questions available');
                            this.handleGameError(new Error('No questions available'), 'new-round', () => {
                                // Fallback: try to load default questions
                                this.questionManager.resetCustomQuestions();
                                const fallbackQuestion = this.questionDisplay.showRandomQuestion();
                                if (fallbackQuestion) {
                                    this.gameState.currentQuestion = fallbackQuestion;
                                    this.gameState.gameStarted = true;
                                    this.enableSpinButton();
                                }
                            });
                        }
                        
                    } catch (roundError) {
                        console.error('Error during new round setup:', roundError);
                        this.handleGameError(roundError, 'new-round');
                    }
                    
                    // Restore button state with smooth transition
                    setTimeout(() => {
                        newGameButton.classList.remove('loading');
                        newGameButton.disabled = false;
                    }, 200);
                }, 500); // Enhanced delay to show loading state and allow transitions
            }
        } catch (error) {
            console.error('Error starting new round:', error);
            this.handleGameError(error, 'new-round');
        }
    }

    /**
     * Handles user spin interaction and manages component coordination
     * As per requirement 5.3
     */
    async handleSpin() {
        // Prevent spinning if already spinning or game not started
        if (this.gameState.isSpinning || !this.gameState.gameStarted) {
            return;
        }
        
        try {
            // Add visual feedback for button press
            this.addButtonPressEffect('spin-button');
            
            // Update game state
            this.gameState.isSpinning = true;
            
            // Disable all buttons during spinning to prevent conflicts
            this.disableAllButtons();
            
            // Coordinate with spinning wheel component with proper error handling
            let selectedLetter;
            try {
                selectedLetter = await this.spinningWheel.spin();
            } catch (spinError) {
                console.error('Spinning wheel error:', spinError);
                // Use fallback immediately without throwing
                const letters = ['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'z'];
                selectedLetter = letters[Math.floor(Math.random() * letters.length)];
            }
            
            // Validate the selected letter
            if (!selectedLetter || typeof selectedLetter !== 'string') {
                console.warn('Invalid letter selected, using fallback');
                const letters = ['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'z'];
                selectedLetter = letters[Math.floor(Math.random() * letters.length)];
            }
            
            // Update game state with selected letter
            this.gameState.selectedLetter = selectedLetter;
            this.gameState.isSpinning = false;
            
            // Update UI to show results
            this.displaySpinResults();
            
            // Re-enable buttons after spinning
            this.enableAllButtons();
            
            console.log(`Spin completed: Letter ${selectedLetter} selected`);
            console.log(`Current question: ${this.gameState.currentQuestion}`);
            
        } catch (error) {
            console.error('Error during spin:', error);
            
            // Reset spinning state
            this.gameState.isSpinning = false;
            this.enableAllButtons();
            
            // Show user-friendly error message
            if (this.errorHandler) {
                this.errorHandler.showError('Het wiel heeft een probleem gehad. Probeer het opnieuw!', 'warning', 4000);
            }
            
            // Don't throw the error to prevent global error handler from triggering
        }
    }

    /**
     * Updates the game UI to reflect current state
     */
    updateGameUI() {
        const roundDisplay = document.getElementById('round-number');
        if (roundDisplay) {
            const roundText = this.languageManager.getTranslation('round');
            roundDisplay.textContent = `${roundText} ${this.gameState.roundNumber}`;
        }
        
        // Update button states
        if (this.gameState.gameStarted) {
            this.enableSpinButton();
        } else {
            this.disableSpinButton();
        }
        
        // Update new game button text based on game state
        this.updateNewGameButtonText();
    }

    /**
     * Updates the new game button text based on whether the game has started
     */
    updateNewGameButtonText() {
        const newGameButton = document.getElementById('new-game-button');
        if (newGameButton) {
            const currentLanguage = this.gameState.currentLanguage;
            
            if (this.gameState.gameStarted) {
                // Game has started, show "Next Question" text
                newGameButton.textContent = this.languageManager.getTranslation('nextQuestionButton');
                const nextQuestionLabel = currentLanguage === 'dutch' ? 
                    'Start de volgende vraag van het spel' : 
                    'Start the next question of the game';
                newGameButton.setAttribute('aria-label', nextQuestionLabel);
            } else {
                // Game hasn't started, show "New Game" text
                newGameButton.textContent = this.languageManager.getTranslation('newGameButton');
                const newGameLabel = currentLanguage === 'dutch' ? 
                    'Start een nieuwe ronde van het spel' : 
                    'Start a new round of the game';
                newGameButton.setAttribute('aria-label', newGameLabel);
            }
        }
    }

    /**
     * Displays the results after spinning with smooth animations
     */
    displaySpinResults() {
        if (this.gameState.selectedLetter && this.gameState.currentQuestion) {
            const resultsElement = document.getElementById('game-results');
            if (resultsElement) {
                // First hide any existing results with animation
                if (resultsElement.style.display === 'block') {
                    resultsElement.classList.add('hide');
                    setTimeout(() => {
                        this.showNewResults(resultsElement);
                    }, 400);
                } else {
                    this.showNewResults(resultsElement);
                }
            }
        }
    }

    /**
     * Shows new results with smooth entrance animation
     * @param {HTMLElement} resultsElement - The results container element
     */
    showNewResults(resultsElement) {
        const currentLanguage = this.gameState.currentLanguage;
        const languageManager = this.languageManager;
        
        resultsElement.innerHTML = `
            <div class="spin-results">
                <h3>🎉 ${languageManager.getTranslation('result')}</h3>
                <p><strong>${languageManager.getTranslation('question')}</strong> ${this.gameState.currentQuestion}</p>
                <p><strong>${languageManager.getTranslation('letter')}</strong> ${this.gameState.selectedLetter.toUpperCase()}</p>
                <p class="instruction">${languageManager.getTranslation('instruction')} "${this.gameState.selectedLetter.toUpperCase()}"!</p>
            </div>
        `;
        
        // Remove hide class and add show class for smooth animation
        resultsElement.classList.remove('hide');
        resultsElement.classList.add('show');
        resultsElement.style.display = 'block';
        
        // Add active state to game sections
        this.addGameActiveState();
    }

    /**
     * Enables the spin button
     */
    enableSpinButton() {
        const spinButton = document.getElementById('spin-button');
        if (spinButton) {
            spinButton.disabled = false;
            spinButton.textContent = this.languageManager.getTranslation('spinButton');
            spinButton.classList.remove('disabled');
        }
    }

    /**
     * Disables the spin button
     */
    disableSpinButton() {
        const spinButton = document.getElementById('spin-button');
        if (spinButton) {
            spinButton.disabled = true;
            spinButton.textContent = this.languageManager.getTranslation('spinning');
            spinButton.classList.add('disabled', 'spinning');
        }
    }

    /**
     * Disables all interactive buttons during wheel spinning to prevent conflicts
     * As per requirement: ensure buttons are disabled during wheel spinning
     */
    disableAllButtons() {
        // Disable spin button with spinning animation
        const spinButton = document.getElementById('spin-button');
        if (spinButton) {
            spinButton.disabled = true;
            spinButton.textContent = this.languageManager.getTranslation('spinning');
            spinButton.classList.add('disabled', 'spinning');
        }
        
        // Disable new game button
        const newGameButton = document.getElementById('new-game-button');
        if (newGameButton) {
            newGameButton.disabled = true;
            newGameButton.classList.add('disabled');
        }
        
        // Disable manage questions button
        const manageQuestionsBtn = document.getElementById('manage-questions-btn');
        if (manageQuestionsBtn) {
            manageQuestionsBtn.disabled = true;
            manageQuestionsBtn.style.opacity = '0.5';
            manageQuestionsBtn.style.pointerEvents = 'none';
        }
    }

    /**
     * Enables all interactive buttons after wheel spinning is complete
     */
    enableAllButtons() {
        // Enable spin button and remove spinning animation
        const spinButton = document.getElementById('spin-button');
        if (spinButton) {
            spinButton.disabled = false;
            spinButton.textContent = this.languageManager.getTranslation('spinButton');
            spinButton.classList.remove('disabled', 'spinning');
        }
        
        // Enable new game button
        const newGameButton = document.getElementById('new-game-button');
        if (newGameButton) {
            newGameButton.disabled = false;
            newGameButton.classList.remove('disabled');
        }
        
        // Enable manage questions button
        const manageQuestionsBtn = document.getElementById('manage-questions-btn');
        if (manageQuestionsBtn) {
            manageQuestionsBtn.disabled = false;
            manageQuestionsBtn.style.opacity = '1';
            manageQuestionsBtn.style.pointerEvents = 'auto';
        }
    }

    /**
     * Displays error messages to the user
     * @param {string} message - Error message to display
     */
    displayError(message) {
        const errorElement = document.getElementById('error-display');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Auto-hide error after 5 seconds
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        } else {
            // Fallback to console if no error display element
            console.error(message);
        }
    }

    /**
     * Gets the current game state
     * @returns {Object} - Current game state object
     */
    getGameState() {
        return { ...this.gameState };
    }

    /**
     * Resets the entire game to initial state
     */
    resetGame() {
        // Reset all components
        this.spinningWheel.reset();
        this.questionDisplay.reset();
        
        // Reset game state
        this.gameState = {
            currentQuestion: null,
            selectedLetter: null,
            roundNumber: 0,
            isSpinning: false,
            gameStarted: false
        };
        
        // Update UI
        this.updateGameUI();
        
        // Hide results
        const resultsElement = document.getElementById('game-results');
        if (resultsElement) {
            resultsElement.style.display = 'none';
        }
        
        console.log('Game reset to initial state');
    }

    /**
     * Gets statistics about the current game session
     * @returns {Object} - Game statistics
     */
    getGameStats() {
        return {
            roundNumber: this.gameState.roundNumber,
            gameStarted: this.gameState.gameStarted,
            currentQuestion: this.gameState.currentQuestion,
            selectedLetter: this.gameState.selectedLetter,
            isSpinning: this.gameState.isSpinning,
            totalQuestions: this.questionManager.getQuestionCount(),
            wheelStats: this.spinningWheel.getWheelStats(),
            questionStats: this.questionDisplay.getQuestionStats()
        };
    }

    /**
     * Updates the question bank (useful when questions are modified)
     */
    refreshQuestionBank() {
        this.questionDisplay.refreshQuestionBank();
    }

    /**
     * Gets access to the question manager for external use
     * @returns {QuestionManager} - The question manager instance
     */
    getQuestionManager() {
        return this.questionManager;
    }

    /**
     * Gets access to the spinning wheel for external use
     * @returns {SpinningWheel} - The spinning wheel instance
     */
    getSpinningWheel() {
        return this.spinningWheel;
    }

    /**
     * Gets access to the question display for external use
     * @returns {QuestionDisplay} - The question display instance
     */
    getQuestionDisplay() {
        return this.questionDisplay;
    }

    /**
     * Adds visual feedback effect when a button is pressed
     * @param {string} buttonId - ID of the button to add effect to
     */
    addButtonPressEffect(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            // Add a temporary class for visual feedback
            button.classList.add('button-pressed');
            
            // Remove the class after animation completes
            setTimeout(() => {
                button.classList.remove('button-pressed');
            }, 200);
        }
    }

    /**
     * Hides the results section with smooth animation
     */
    hideResults() {
        const resultsElement = document.getElementById('game-results');
        if (resultsElement && resultsElement.style.display === 'block') {
            resultsElement.classList.remove('show');
            resultsElement.classList.add('hide');
            
            setTimeout(() => {
                resultsElement.style.display = 'none';
                resultsElement.classList.remove('hide');
            }, 400);
        }
    }

    /**
     * Adds active state styling to game sections during gameplay
     */
    addGameActiveState() {
        const questionSection = document.querySelector('.question-section');
        const wheelSection = document.querySelector('.wheel-section');
        
        if (questionSection) {
            questionSection.classList.add('game-active');
        }
        
        if (wheelSection) {
            wheelSection.classList.add('game-active');
        }
    }

    /**
     * Removes active state styling from game sections
     */
    removeGameActiveState() {
        const questionSection = document.querySelector('.question-section');
        const wheelSection = document.querySelector('.wheel-section');
        
        if (questionSection) {
            questionSection.classList.remove('game-active');
        }
        
        if (wheelSection) {
            wheelSection.classList.remove('game-active');
        }
    }

    /**
     * Adds game phase transition animation to the main container
     */
    addGamePhaseTransition() {
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.classList.add('game-phase-transition');
            
            // Remove the class after animation completes
            setTimeout(() => {
                gameContainer.classList.remove('game-phase-transition');
            }, 600);
        }
    }

    /**
     * Adds state change animation to game sections
     */
    addSectionStateChangeAnimation() {
        const questionSection = document.querySelector('.question-section');
        const wheelSection = document.querySelector('.wheel-section');
        
        if (questionSection) {
            questionSection.classList.add('state-changing');
            setTimeout(() => {
                questionSection.classList.remove('state-changing');
            }, 500);
        }
        
        if (wheelSection) {
            wheelSection.classList.add('state-changing');
            setTimeout(() => {
                wheelSection.classList.remove('state-changing');
            }, 500);
        }
    }

    /**
     * Validates all game components and their state
     * @returns {boolean} - True if all components are valid
     */
    validateComponents() {
        if (this.initializationFailed) {
            return false;
        }

        try {
            // Validate question manager
            if (!this.questionManager || typeof this.questionManager.getAllQuestions !== 'function') {
                throw new Error('Question manager is invalid');
            }

            // Validate spinning wheel
            if (!this.spinningWheel || typeof this.spinningWheel.spin !== 'function') {
                throw new Error('Spinning wheel is invalid');
            }

            // Validate question display
            if (!this.questionDisplay || typeof this.questionDisplay.showRandomQuestion !== 'function') {
                throw new Error('Question display is invalid');
            }

            // Validate that we have questions
            const questionCount = this.questionManager.getQuestionCount();
            if (questionCount < 5) {
                throw new Error(`Insufficient questions: ${questionCount} (minimum 5 required)`);
            }

            // Validate essential DOM elements
            const requiredElements = [
                'spin-button',
                'new-game-button',
                'error-display',
                'game-results'
            ];

            for (const elementId of requiredElements) {
                if (!document.getElementById(elementId)) {
                    console.warn(`Missing DOM element: ${elementId}`);
                }
            }

            return true;
        } catch (error) {
            console.error('Component validation failed:', error);
            if (this.errorHandler) {
                this.errorHandler.handleCriticalError(error, 'Het spel heeft een configuratieprobleem. Ververs de pagina om opnieuw te proberen.');
            }
            return false;
        }
    }

    /**
     * Enhanced error handling for game operations
     * @param {Error} error - The error that occurred
     * @param {string} operation - The operation that failed
     * @param {Function} fallbackFunction - Optional fallback function
     */
    handleGameError(error, operation, fallbackFunction) {
        console.error(`Game error during ${operation}:`, error);

        let userMessage;
        switch (operation) {
            case 'spin':
                userMessage = 'Er ging iets mis bij het draaien van het wiel. Probeer het opnieuw!';
                break;
            case 'new-round':
                userMessage = 'Er ging iets mis bij het starten van een nieuwe ronde. Probeer het opnieuw!';
                break;
            case 'question-load':
                userMessage = 'Er ging iets mis bij het laden van vragen. We gebruiken standaard vragen.';
                break;
            default:
                userMessage = 'Er is een onverwachte fout opgetreden. Probeer het opnieuw!';
        }

        if (this.errorHandler) {
            this.errorHandler.showError(userMessage, 'error', 5000);
        } else {
            this.displayError(userMessage);
        }

        // Execute fallback if provided
        if (typeof fallbackFunction === 'function') {
            try {
                fallbackFunction();
            } catch (fallbackError) {
                console.error('Fallback function failed:', fallbackError);
            }
        }

        // Reset spinning state if error occurred during spin
        if (operation === 'spin') {
            this.gameState.isSpinning = false;
            this.enableAllButtons();
        }
    }

    /**
     * Performs a health check on all game components
     * @returns {Object} - Health check results
     */
    performHealthCheck() {
        const healthCheck = {
            overall: 'healthy',
            components: {},
            issues: [],
            timestamp: new Date().toISOString()
        };

        try {
            // Check question manager
            if (this.questionManager) {
                const questionValidation = this.questionManager.validateAndRepair();
                healthCheck.components.questionManager = {
                    status: questionValidation.valid ? 'healthy' : 'issues',
                    details: questionValidation
                };
                if (!questionValidation.valid) {
                    healthCheck.issues.push('Question manager has issues');
                }
            } else {
                healthCheck.components.questionManager = { status: 'missing' };
                healthCheck.issues.push('Question manager is missing');
            }

            // Check spinning wheel
            if (this.spinningWheel) {
                const wheelValid = this.spinningWheel.validateAndRepair();
                healthCheck.components.spinningWheel = {
                    status: wheelValid ? 'healthy' : 'issues',
                    stats: this.spinningWheel.getWheelStats()
                };
                if (!wheelValid) {
                    healthCheck.issues.push('Spinning wheel has issues');
                }
            } else {
                healthCheck.components.spinningWheel = { status: 'missing' };
                healthCheck.issues.push('Spinning wheel is missing');
            }

            // Check question display
            if (this.questionDisplay) {
                const displayValid = this.questionDisplay.validateAndRepair();
                healthCheck.components.questionDisplay = {
                    status: displayValid ? 'healthy' : 'issues',
                    stats: this.questionDisplay.getQuestionStats()
                };
                if (!displayValid) {
                    healthCheck.issues.push('Question display has issues');
                }
            } else {
                healthCheck.components.questionDisplay = { status: 'missing' };
                healthCheck.issues.push('Question display is missing');
            }

            // Overall health assessment
            if (healthCheck.issues.length > 0) {
                healthCheck.overall = healthCheck.issues.length > 2 ? 'critical' : 'degraded';
            }

        } catch (error) {
            console.error('Health check failed:', error);
            healthCheck.overall = 'critical';
            healthCheck.issues.push('Health check process failed');
        }

        return healthCheck;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameController;
}