/**
 * QuestionDisplay - Handles question display and random selection logic
 * Manages question rotation and avoids immediate repeats
 */
class QuestionDisplay {
    constructor(containerId, questionManager, languageManager) {
        this.containerId = containerId;
        this.questionManager = questionManager;
        this.languageManager = languageManager || window.languageManager;
        this.currentQuestion = null;
        this.usedQuestions = [];
        this.maxUsedQuestions = 3; // Avoid repeating last 3 questions
        this.errorHandler = window.errorHandler || null;
        
        try {
            this.createDisplayElement();
        } catch (error) {
            console.error('Error creating question display:', error);
            if (this.errorHandler) {
                const errorMessage = this.languageManager ? 
                    (this.languageManager.getCurrentLanguage() === 'dutch' ? 
                        'De vragenweergave kan niet worden geladen. Ververs de pagina om opnieuw te proberen.' :
                        'The question display could not be loaded. Refresh the page to try again.') :
                    'De vragenweergave kan niet worden geladen. Ververs de pagina om opnieuw te proberen.';
                this.errorHandler.handleCriticalError(error, errorMessage);
            }
        }
    }

    /**
     * Creates the question display element
     */
    createDisplayElement() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id '${this.containerId}' not found`);
            return;
        }

        const initialText = this.languageManager ? 
            this.languageManager.getTranslation('clickNewGameToStart') :
            'Klik op "Nieuw Spel" om te beginnen!';

        container.innerHTML = `
            <div class="question-display">
                <div class="question-text" id="current-question">
                    ${initialText}
                </div>
            </div>
        `;
    }

    /**
     * Displays a random question that hasn't been used recently
     * @returns {string|null} - The selected question or null if no questions available
     */
    showRandomQuestion() {
        try {
            // Get questions for current language from both LanguageManager and QuestionManager
            const allQuestions = this.getAllQuestionsForCurrentLanguage();
            
            if (allQuestions.length === 0) {
                this.handleNoQuestionsError();
                return null;
            }

            // Get available questions (not recently used)
            let availableQuestions = allQuestions.filter(q => !this.usedQuestions.includes(q));
            
            // If all questions have been used recently, reset the used list but keep the current question
            if (availableQuestions.length === 0) {
                this.usedQuestions = this.currentQuestion ? [this.currentQuestion] : [];
                availableQuestions = allQuestions.filter(q => q !== this.currentQuestion);
            }
            
            // If still no available questions (edge case with only 1 question), use any question
            if (availableQuestions.length === 0) {
                availableQuestions = allQuestions;
            }

            // Select random question from available ones
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            const selectedQuestion = availableQuestions[randomIndex];
            
            // Validate selected question
            if (!selectedQuestion || typeof selectedQuestion !== 'string') {
                throw new Error('Invalid question selected');
            }
            
            // Update current question and used questions list
            this.currentQuestion = selectedQuestion;
            this.addToUsedQuestions(selectedQuestion);
            
            // Display the question
            this.displayQuestion(selectedQuestion);
            
            return selectedQuestion;
        } catch (error) {
            console.error('Error showing random question:', error);
            this.handleQuestionDisplayError(error);
            return null;
        }
    }

    /**
     * Displays a specific question with enhanced smooth transitions
     * @param {string} question - The question to display
     */
    displayQuestion(question) {
        const questionElement = document.getElementById('current-question');
        if (questionElement) {
            // If there's already a question, fade it out first
            if (questionElement.textContent && questionElement.textContent !== 'Klik op "Nieuw Spel" om te beginnen!') {
                this.transitionToNewQuestion(questionElement, question);
            } else {
                // First question or initial state - just fade in
                this.showQuestionWithFadeIn(questionElement, question);
            }
        }
    }

    /**
     * Transitions from current question to new question with smooth animation
     * @param {HTMLElement} questionElement - The question display element
     * @param {string} newQuestion - The new question to display
     */
    transitionToNewQuestion(questionElement, newQuestion) {
        // Fade out current question
        questionElement.classList.add('fade-out');
        
        setTimeout(() => {
            // Update content and fade in new question
            questionElement.textContent = newQuestion;
            questionElement.classList.remove('fade-out');
            questionElement.classList.add('fade-in', 'active');
            
            // Remove fade-in class after animation completes
            setTimeout(() => {
                questionElement.classList.remove('fade-in');
            }, 500);
        }, 300);
    }

    /**
     * Shows a question with fade-in animation
     * @param {HTMLElement} questionElement - The question display element
     * @param {string} question - The question to display
     */
    showQuestionWithFadeIn(questionElement, question) {
        questionElement.textContent = question;
        questionElement.classList.add('fade-in', 'active');
        
        // Remove fade-in class after animation completes
        setTimeout(() => {
            questionElement.classList.remove('fade-in');
        }, 500);
    }

    /**
     * Displays an error message
     * @param {string} message - The error message to display
     */
    displayError(message) {
        const questionElement = document.getElementById('current-question');
        if (questionElement) {
            questionElement.textContent = message;
            questionElement.className = 'question-text error';
        }
    }

    /**
     * Adds a question to the used questions list
     * @param {string} question - The question to add to used list
     */
    addToUsedQuestions(question) {
        this.usedQuestions.push(question);
        
        // Keep only the most recent questions in the used list
        if (this.usedQuestions.length > this.maxUsedQuestions) {
            this.usedQuestions.shift();
        }
    }

    /**
     * Gets the currently displayed question
     * @returns {string|null} - The current question or null if none
     */
    getCurrentQuestion() {
        return this.currentQuestion;
    }

    /**
     * Gets all available questions from the question manager
     * @returns {string[]} - Array of all questions
     */
    getQuestionBank() {
        return this.getAllQuestionsForCurrentLanguage();
    }

    /**
     * Gets all questions for the current language (default + custom)
     * @returns {string[]} - Array of questions in current language
     */
    getAllQuestionsForCurrentLanguage() {
        if (!this.languageManager) {
            return this.questionManager.getAllQuestions();
        }

        const currentLanguage = this.languageManager.getCurrentLanguage();
        
        // Get default questions for current language from LanguageManager
        const defaultQuestions = this.languageManager.getQuestions();
        
        // Get custom questions for current language from QuestionManager
        const customQuestions = this.questionManager.getCustomQuestionsForLanguage(currentLanguage);
        
        // Combine default and custom questions
        return [...defaultQuestions, ...customQuestions];
    }

    /**
     * Resets the question display state
     */
    reset() {
        this.currentQuestion = null;
        this.usedQuestions = [];
        
        const questionElement = document.getElementById('current-question');
        if (questionElement) {
            const initialText = this.languageManager ? 
                this.languageManager.getTranslation('clickNewGameToStart') :
                'Klik op "Nieuw Spel" om te beginnen!';
            questionElement.textContent = initialText;
            questionElement.className = 'question-text';
        }
    }

    /**
     * Handles language change by updating display text and clearing used questions
     * @param {string} newLanguage - The new language code
     */
    onLanguageChange(newLanguage) {
        // Clear used questions since they're language-specific
        this.usedQuestions = [];
        this.currentQuestion = null;
        
        // Update initial text if no game is active
        const questionElement = document.getElementById('current-question');
        if (questionElement) {
            const currentText = questionElement.textContent;
            const isInitialState = currentText.includes('Klik op') || currentText.includes('Click');
            
            if (isInitialState) {
                const initialText = this.languageManager ? 
                    this.languageManager.getTranslation('clickNewGameToStart') :
                    'Klik op "Nieuw Spel" om te beginnen!';
                questionElement.textContent = initialText;
            }
        }
    }

    /**
     * Gets statistics about question usage
     * @returns {Object} - Object containing question statistics
     */
    getQuestionStats() {
        const allQuestions = this.questionManager.getAllQuestions();
        return {
            totalQuestions: allQuestions.length,
            currentQuestion: this.currentQuestion,
            recentlyUsed: [...this.usedQuestions],
            availableQuestions: allQuestions.filter(q => !this.usedQuestions.includes(q)).length
        };
    }

    /**
     * Updates the question display when questions are modified
     * This should be called when questions are added/edited/deleted
     */
    refreshQuestionBank() {
        const allQuestions = this.questionManager.getAllQuestions();
        
        // If current question no longer exists, reset
        if (this.currentQuestion && !allQuestions.includes(this.currentQuestion)) {
            this.currentQuestion = null;
        }
        
        // Clean up used questions list to remove non-existent questions
        this.usedQuestions = this.usedQuestions.filter(q => allQuestions.includes(q));
        
        // If no questions available, show error
        if (allQuestions.length === 0) {
            this.displayError('Geen vragen beschikbaar!');
        }
    }

    /**
     * Sets the maximum number of questions to remember as "recently used"
     * @param {number} max - Maximum number of recent questions to track
     */
    setMaxUsedQuestions(max) {
        if (max >= 0 && max < 10) { // Reasonable limits
            this.maxUsedQuestions = max;
            
            // Trim used questions list if it's now too long
            while (this.usedQuestions.length > this.maxUsedQuestions) {
                this.usedQuestions.shift();
            }
        }
    }

    /**
     * Handles the case when no questions are available
     */
    handleNoQuestionsError() {
        console.error('No questions available');
        
        if (this.errorHandler) {
            this.errorHandler.handleQuestionLoadError(
                new Error('No questions available'),
                () => this.loadFallbackQuestions()
            );
        } else {
            this.displayError('Geen vragen beschikbaar! Ververs de pagina om opnieuw te proberen.');
        }
    }

    /**
     * Handles errors during question display
     * @param {Error} error - The error that occurred
     */
    handleQuestionDisplayError(error) {
        console.error('Question display error:', error);
        
        if (this.errorHandler) {
            this.errorHandler.showError(
                'Er is een probleem met het tonen van vragen. We proberen het opnieuw!',
                'warning',
                4000
            );
        }
        
        // Try to recover by using a fallback question
        this.loadFallbackQuestions();
    }

    /**
     * Loads fallback questions when normal question loading fails
     */
    loadFallbackQuestions() {
        try {
            // Use a simple fallback question if all else fails
            const fallbackQuestions = [
                "Noem een dier",
                "Noem een kleur",
                "Noem iets wat je kunt eten"
            ];
            
            const randomIndex = Math.floor(Math.random() * fallbackQuestions.length);
            const fallbackQuestion = fallbackQuestions[randomIndex];
            
            this.currentQuestion = fallbackQuestion;
            this.displayQuestion(fallbackQuestion);
            
            console.log('Using fallback question:', fallbackQuestion);
            
        } catch (error) {
            console.error('Even fallback questions failed:', error);
            this.displayError('Er is een ernstig probleem opgetreden. Ververs de pagina.');
        }
    }

    /**
     * Validates the question display state and repairs if necessary
     * @returns {boolean} - True if display is valid, false if repairs were needed
     */
    validateAndRepair() {
        try {
            const container = document.getElementById(this.containerId);
            const questionElement = document.getElementById('current-question');
            
            // Check if essential elements exist
            if (!container) {
                console.error('Question container missing');
                return false;
            }
            
            if (!questionElement) {
                console.warn('Question element missing, recreating...');
                this.createDisplayElement();
                return false;
            }
            
            // Check if question manager is valid
            if (!this.questionManager || typeof this.questionManager.getAllQuestions !== 'function') {
                console.error('Question manager is invalid');
                return false;
            }
            
            // Check if we have questions available
            const allQuestions = this.questionManager.getAllQuestions();
            if (allQuestions.length === 0) {
                console.warn('No questions available');
                this.handleNoQuestionsError();
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error validating question display:', error);
            if (this.errorHandler) {
                this.errorHandler.handleCriticalError(error, 'De vragenweergave heeft een probleem. Ververs de pagina om opnieuw te proberen.');
            }
            return false;
        }
    }

    /**
     * Forces a specific question to be displayed (for testing purposes)
     * @param {string} question - The question to display
     * @returns {boolean} - True if question exists and was displayed, false otherwise
     */
    forceDisplayQuestion(question) {
        const allQuestions = this.questionManager.getAllQuestions();
        
        if (allQuestions.includes(question)) {
            this.currentQuestion = question;
            this.addToUsedQuestions(question);
            this.displayQuestion(question);
            return true;
        }
        
        return false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionDisplay;
}