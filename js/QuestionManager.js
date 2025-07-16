/**
 * QuestionManager - Handles CRUD operations for questions with local storage persistence
 * Manages both default questions and custom user-added questions with language support
 */
class QuestionManager {
    constructor(languageManager) {
        this.languageManager = languageManager || window.languageManager;
        this.storageKey = 'dutch-word-game-questions';
        this.minQuestionCount = 5;
        this.errorHandler = window.errorHandler || null;
        this.storageAvailable = this.testStorageAvailability();
        
        // Custom questions are now stored per language
        this.customQuestions = {
            dutch: [],
            english: []
        };
        
        try {
            this.loadCustomQuestions();
        } catch (error) {
            console.error('Error loading custom questions:', error);
            this.customQuestions = { dutch: [], english: [] };
            if (this.errorHandler) {
                this.errorHandler.handleStorageError(error, 'load');
            }
        }
    }

    /**
     * Validates question content
     * @param {string} questionText - The question to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    validateQuestion(questionText) {
        if (!questionText || typeof questionText !== 'string') {
            return false;
        }
        
        const trimmed = questionText.trim();
        return trimmed.length > 0 && trimmed.length <= 100;
    }

    /**
     * Adds a new custom question for the current language
     * @param {string} questionText - The question to add
     * @param {string} language - Optional language code, defaults to current language
     * @returns {boolean} - True if successfully added, false otherwise
     */
    addQuestion(questionText, language = null) {
        if (!this.validateQuestion(questionText)) {
            return false;
        }
        
        const trimmed = questionText.trim();
        const targetLanguage = language || (this.languageManager ? this.languageManager.getCurrentLanguage() : 'dutch');
        
        // Check for duplicates in the target language
        if (this.getAllQuestionsForLanguage(targetLanguage).includes(trimmed)) {
            return false;
        }
        
        // Ensure the language array exists
        if (!this.customQuestions[targetLanguage]) {
            this.customQuestions[targetLanguage] = [];
        }
        
        this.customQuestions[targetLanguage].push(trimmed);
        this.saveCustomQuestions();
        return true;
    }

    /**
     * Edits an existing custom question for the current language
     * @param {number} index - Index of the custom question to edit
     * @param {string} newText - New question text
     * @param {string} language - Optional language code, defaults to current language
     * @returns {boolean} - True if successfully edited, false otherwise
     */
    editQuestion(index, newText, language = null) {
        const targetLanguage = language || (this.languageManager ? this.languageManager.getCurrentLanguage() : 'dutch');
        const customQuestionsForLanguage = this.customQuestions[targetLanguage] || [];
        
        if (index < 0 || index >= customQuestionsForLanguage.length) {
            return false;
        }
        
        if (!this.validateQuestion(newText)) {
            return false;
        }
        
        const trimmed = newText.trim();
        
        // Check for duplicates (excluding the current question being edited)
        const allQuestions = this.getAllQuestionsForLanguage(targetLanguage);
        const currentQuestion = customQuestionsForLanguage[index];
        const otherQuestions = allQuestions.filter(q => q !== currentQuestion);
        
        if (otherQuestions.includes(trimmed)) {
            return false;
        }
        
        this.customQuestions[targetLanguage][index] = trimmed;
        this.saveCustomQuestions();
        return true;
    }

    /**
     * Deletes a custom question for the current language
     * @param {number} index - Index of the custom question to delete
     * @param {string} language - Optional language code, defaults to current language
     * @returns {boolean} - True if successfully deleted, false otherwise
     */
    deleteQuestion(index, language = null) {
        const targetLanguage = language || (this.languageManager ? this.languageManager.getCurrentLanguage() : 'dutch');
        const customQuestionsForLanguage = this.customQuestions[targetLanguage] || [];
        
        if (index < 0 || index >= customQuestionsForLanguage.length) {
            return false;
        }
        
        // Ensure minimum question count is maintained for the target language
        const totalQuestions = this.getAllQuestionsForLanguage(targetLanguage).length;
        if (totalQuestions <= this.minQuestionCount) {
            return false;
        }
        
        this.customQuestions[targetLanguage].splice(index, 1);
        this.saveCustomQuestions();
        return true;
    }

    /**
     * Gets all questions (default + custom) for current language
     * @returns {string[]} - Array of all questions
     */
    getAllQuestions() {
        const currentLanguage = this.languageManager ? this.languageManager.getCurrentLanguage() : 'dutch';
        return this.getAllQuestionsForLanguage(currentLanguage);
    }

    /**
     * Gets all questions for a specific language
     * @param {string} language - Language code ('dutch' or 'english')
     * @returns {string[]} - Array of all questions for the language
     */
    getAllQuestionsForLanguage(language) {
        // Get default questions from LanguageManager if available
        const defaultQuestions = this.languageManager ? 
            this.languageManager.getQuestionsForLanguage(language) : 
            [];
        
        // Get custom questions for the language
        const customQuestions = this.customQuestions[language] || [];
        
        return [...defaultQuestions, ...customQuestions];
    }

    /**
     * Gets only custom questions for current language
     * @returns {string[]} - Array of custom questions
     */
    getCustomQuestions() {
        const currentLanguage = this.languageManager ? this.languageManager.getCurrentLanguage() : 'dutch';
        return this.getCustomQuestionsForLanguage(currentLanguage);
    }

    /**
     * Gets custom questions for a specific language
     * @param {string} language - Language code ('dutch' or 'english')
     * @returns {string[]} - Array of custom questions for the language
     */
    getCustomQuestionsForLanguage(language) {
        return [...(this.customQuestions[language] || [])];
    }

    /**
     * Gets only default questions for current language
     * @returns {string[]} - Array of default questions
     */
    getDefaultQuestions() {
        const currentLanguage = this.languageManager ? this.languageManager.getCurrentLanguage() : 'dutch';
        return this.languageManager ? 
            this.languageManager.getQuestionsForLanguage(currentLanguage) : 
            [];
    }

    /**
     * Gets the total count of questions for current language
     * @returns {number} - Total number of questions
     */
    getQuestionCount() {
        return this.getAllQuestions().length;
    }

    /**
     * Gets the total count of questions for a specific language
     * @param {string} language - Language code ('dutch' or 'english')
     * @returns {number} - Total number of questions for the language
     */
    getQuestionCountForLanguage(language) {
        return this.getAllQuestionsForLanguage(language).length;
    }

    /**
     * Tests if localStorage is available and working
     * @returns {boolean} - True if storage is available
     */
    testStorageAvailability() {
        try {
            const test = 'storage-test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.warn('localStorage not available:', error);
            return false;
        }
    }

    /**
     * Saves custom questions to local storage with error handling
     */
    saveCustomQuestions() {
        if (!this.storageAvailable) {
            console.warn('Storage not available, questions will not persist');
            if (this.errorHandler) {
                this.errorHandler.handleStorageError(new Error('Storage not available'), 'save');
            }
            return;
        }

        try {
            const dataToSave = JSON.stringify(this.customQuestions);
            localStorage.setItem(this.storageKey, dataToSave);
        } catch (error) {
            console.error('Failed to save questions to local storage:', error);
            
            if (this.errorHandler) {
                this.errorHandler.handleStorageError(error, 'save');
            }
            
            // Try to clear some space and retry once
            if (error.name === 'QuotaExceededError') {
                try {
                    this.clearOldStorageData();
                    localStorage.setItem(this.storageKey, JSON.stringify(this.customQuestions));
                } catch (retryError) {
                    console.error('Retry save also failed:', retryError);
                }
            }
        }
    }

    /**
     * Clears old storage data to free up space
     */
    clearOldStorageData() {
        try {
            // Remove any old game data that might be taking up space
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('old-') || key.includes('temp-') || key.includes('cache-')) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            console.log(`Cleared ${keysToRemove.length} old storage items`);
        } catch (error) {
            console.error('Error clearing old storage data:', error);
        }
    }

    /**
     * Loads custom questions from local storage with error handling
     */
    loadCustomQuestions() {
        if (!this.storageAvailable) {
            console.warn('Storage not available, using empty custom questions');
            this.customQuestions = { dutch: [], english: [] };
            return;
        }

        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                
                // Handle migration from old format (array) to new format (object)
                if (Array.isArray(parsed)) {
                    console.log('Migrating questions from old format to new language-based format');
                    // Old format - assume these are Dutch questions
                    const validQuestions = parsed.filter(q => this.validateQuestion(q));
                    this.customQuestions = {
                        dutch: validQuestions,
                        english: []
                    };
                    // Save in new format
                    this.saveCustomQuestions();
                } else if (parsed && typeof parsed === 'object') {
                    // New format - validate each language's questions
                    this.customQuestions = { dutch: [], english: [] };
                    
                    for (const language of ['dutch', 'english']) {
                        if (parsed[language] && Array.isArray(parsed[language])) {
                            const validQuestions = parsed[language].filter(q => this.validateQuestion(q));
                            this.customQuestions[language] = validQuestions;
                            
                            if (validQuestions.length !== parsed[language].length) {
                                console.warn(`Removed ${parsed[language].length - validQuestions.length} invalid ${language} questions from storage`);
                            }
                        }
                    }
                    
                    // Save cleaned version if needed
                    const originalCount = (parsed.dutch?.length || 0) + (parsed.english?.length || 0);
                    const newCount = this.customQuestions.dutch.length + this.customQuestions.english.length;
                    if (originalCount !== newCount) {
                        setTimeout(() => {
                            this.saveCustomQuestions();
                        }, 100);
                    }
                }
            } else {
                this.customQuestions = { dutch: [], english: [] };
            }
        } catch (error) {
            console.error('Failed to load questions from local storage:', error);
            
            if (this.errorHandler) {
                this.errorHandler.handleStorageError(error, 'load');
            }
            
            // Try to recover by clearing corrupted data
            try {
                localStorage.removeItem(this.storageKey);
                console.log('Cleared corrupted question data');
            } catch (clearError) {
                console.error('Could not clear corrupted data:', clearError);
            }
            
            this.customQuestions = { dutch: [], english: [] };
        }
    }

    /**
     * Validates the integrity of all questions and repairs if necessary
     * @returns {Object} - Validation results
     */
    validateAndRepair() {
        const results = {
            valid: true,
            repairsNeeded: [],
            totalQuestions: 0,
            validQuestions: 0,
            languageBreakdown: {}
        };

        try {
            let totalValidQuestions = 0;
            
            // Check questions for each language
            for (const language of ['dutch', 'english']) {
                const defaultQuestions = this.languageManager ? 
                    this.languageManager.getQuestionsForLanguage(language) : [];
                const customQuestions = this.customQuestions[language] || [];
                
                // Validate custom questions for this language
                const validCustoms = customQuestions.filter(q => this.validateQuestion(q));
                if (validCustoms.length !== customQuestions.length) {
                    results.valid = false;
                    results.repairsNeeded.push(`Invalid custom questions detected for ${language}`);
                    this.customQuestions[language] = validCustoms;
                }
                
                const totalForLanguage = defaultQuestions.length + validCustoms.length;
                totalValidQuestions += totalForLanguage;
                
                results.languageBreakdown[language] = {
                    default: defaultQuestions.length,
                    custom: validCustoms.length,
                    total: totalForLanguage
                };
                
                // Check minimum question count per language
                if (totalForLanguage < this.minQuestionCount) {
                    results.valid = false;
                    results.repairsNeeded.push(`Insufficient questions for ${language} (${totalForLanguage} < ${this.minQuestionCount})`);
                }
            }
            
            // Save repaired custom questions if needed
            if (results.repairsNeeded.some(repair => repair.includes('Invalid custom questions'))) {
                this.saveCustomQuestions();
            }

            results.totalQuestions = totalValidQuestions;
            results.validQuestions = totalValidQuestions;

            return results;
        } catch (error) {
            console.error('Error during question validation:', error);
            results.valid = false;
            results.repairsNeeded.push('Validation process failed');
            return results;
        }
    }

    /**
     * Resets custom questions (removes all custom questions for current language or all languages)
     * @param {string} language - Optional language code, if not provided resets all languages
     */
    resetCustomQuestions(language = null) {
        if (language) {
            // Reset only the specified language
            this.customQuestions[language] = [];
        } else {
            // Reset all languages
            this.customQuestions = { dutch: [], english: [] };
        }
        this.saveCustomQuestions();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionManager;
}