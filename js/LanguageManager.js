/**
 * LanguageManager - Handles language selection, switching, and translations
 * Manages both UI translations and question banks for Dutch and English
 */
class LanguageManager {
    constructor() {
        this.currentLanguage = 'dutch'; // Default language
        this.storageKey = 'pim-pam-pet-language';
        
        // Translation data for UI elements
        this.translations = {
            dutch: {
                gameTitle: "Pim Pam Pet Woordspel",
                spinButton: "DRAAI HET WIEL!",
                newGameButton: "NIEUW SPEL",
                nextQuestionButton: "VOLGENDE VRAAG",
                manageButton: "BEHEER",
                languageButton: "English",
                tryAgain: "Probeer opnieuw!",
                chooseLanguage: "Kies je taal",
                addQuestion: "Vraag toevoegen",
                editQuestion: "Vraag bewerken",
                deleteQuestion: "Vraag verwijderen",
                saveQuestion: "Opslaan",
                cancel: "Annuleren",
                confirmDelete: "Weet je zeker dat je deze vraag wilt verwijderen?",
                questionPlaceholder: "Voer je vraag in...",
                minimumQuestions: "Er moeten minimaal 5 vragen zijn om het spel te spelen.",
                // Game result translations
                result: "Resultaat!",
                question: "Vraag:",
                letter: "Letter:",
                instruction: "Bedenk een woord dat begint met de letter",
                // Game state translations
                round: "Ronde",
                clickNewGameToStart: "Klik op \"Nieuw Spel\" om te beginnen",
                clickNextQuestionToStart: "Klik op \"Volgende Vraag\" om te beginnen",
                spinning: "Aan het draaien...",
                // Accessibility translations
                skipToMainContent: "Spring naar hoofdinhoud",
                currentQuestion: "Huidige Vraag",
                spinningWheel: "Draaiend Wiel",
                gameControls: "Spelbesturing",
                gameResults: "Spelresultaten",
                questionDescription: "Dit is de vraag waarvoor je een woord moet bedenken",
                wheelDescription: "Het wiel selecteert een willekeurige letter voor je antwoord",
                spinButtonHelp: "Druk op deze knop om het wiel te laten draaien en een willekeurige letter te selecteren",
                newGameHelp: "Druk op deze knop om een nieuwe ronde te beginnen met een nieuwe vraag",
                // Question management translations
                manageQuestions: "Vragen Beheren",
                addNewQuestion: "Nieuwe Vraag Toevoegen",
                editQuestion: "Vraag Bewerken",
                questionLabel: "Vraag:",
                questionPlaceholderExample: "Bijv: Noem een fruit",
                save: "Opslaan",
                update: "Bijwerken",
                cancel: "Annuleren",
                allQuestions: "Alle Vragen",
                totalQuestions: "Totaal:",
                customQuestions: "Aangepast:",
                questions: "vragen",
                defaultQuestions: "Standaard Vragen",
                customQuestionsSection: "Aangepaste Vragen",
                noCustomQuestions: "Nog geen aangepaste vragen toegevoegd.",
                edit: "Bewerken",
                delete: "Verwijderen",
                defaultLabel: "Standaard",
                deleteQuestion: "Vraag Verwijderen",
                deleteConfirmation: "Weet je zeker dat je deze vraag wilt verwijderen?",
                enterQuestion: "Voer een vraag in.",
                questionUpdatedSuccess: "Vraag succesvol bijgewerkt!",
                questionUpdateError: "Kon vraag niet bijwerken. Controleer of de vraag niet al bestaat.",
                questionAddedSuccess: "Vraag succesvol toegevoegd!",
                questionAddError: "Kon vraag niet toevoegen. Controleer of de vraag niet al bestaat.",
                questionDeletedSuccess: "Vraag succesvol verwijderd!",
                questionDeleteError: "Kon vraag niet verwijderen.",
                minimumQuestionsError: "Kan vraag niet verwijderen. Er moeten minimaal 5 vragen beschikbaar blijven."
            },
            english: {
                gameTitle: "Pim Pam Pet Word Game",
                spinButton: "SPIN THE WHEEL!",
                newGameButton: "NEW GAME",
                nextQuestionButton: "NEXT QUESTION",
                manageButton: "MANAGE",
                languageButton: "Nederlands",
                tryAgain: "Try again!",
                chooseLanguage: "Choose your language",
                addQuestion: "Add Question",
                editQuestion: "Edit Question",
                deleteQuestion: "Delete Question",
                saveQuestion: "Save",
                cancel: "Cancel",
                confirmDelete: "Are you sure you want to delete this question?",
                questionPlaceholder: "Enter your question...",
                minimumQuestions: "There must be at least 5 questions to play the game.",
                // Game result translations
                result: "Result!",
                question: "Question:",
                letter: "Letter:",
                instruction: "Think of a word that starts with the letter",
                // Game state translations
                round: "Round",
                clickNewGameToStart: "Click \"New Game\" to start",
                clickNextQuestionToStart: "Click \"Next Question\" to start",
                spinning: "Spinning...",
                // Accessibility translations
                skipToMainContent: "Skip to main content",
                currentQuestion: "Current Question",
                spinningWheel: "Spinning Wheel",
                gameControls: "Game Controls",
                gameResults: "Game Results",
                questionDescription: "This is the question for which you need to think of a word",
                wheelDescription: "The wheel selects a random letter for your answer",
                spinButtonHelp: "Press this button to spin the wheel and select a random letter",
                newGameHelp: "Press this button to start a new round with a new question",
                // Question management translations
                manageQuestions: "Manage Questions",
                addNewQuestion: "Add New Question",
                editQuestion: "Edit Question",
                questionLabel: "Question:",
                questionPlaceholderExample: "E.g: Name a fruit",
                save: "Save",
                update: "Update",
                cancel: "Cancel",
                allQuestions: "All Questions",
                totalQuestions: "Total:",
                customQuestions: "Custom:",
                questions: "questions",
                defaultQuestions: "Default Questions",
                customQuestionsSection: "Custom Questions",
                noCustomQuestions: "No custom questions added yet.",
                edit: "Edit",
                delete: "Delete",
                defaultLabel: "Default",
                deleteQuestion: "Delete Question",
                deleteConfirmation: "Are you sure you want to delete this question?",
                enterQuestion: "Please enter a question.",
                questionUpdatedSuccess: "Question updated successfully!",
                questionUpdateError: "Could not update question. Check if the question already exists.",
                questionAddedSuccess: "Question added successfully!",
                questionAddError: "Could not add question. Check if the question already exists.",
                questionDeletedSuccess: "Question deleted successfully!",
                questionDeleteError: "Could not delete question.",
                minimumQuestionsError: "Cannot delete question. At least 5 questions must remain available."
            }
        };

        // Question banks for both languages
        this.questionBanks = {
            dutch: [
                "Noem een fruit",
                "Noem iets wat je meeneemt in de auto",
                "Noem een dier",
                "Noem iets wat je op school gebruikt",
                "Noem een kleur",
                "Noem iets wat je kunt eten",
                "Noem een speelgoed",
                "Noem iets in de keuken",
                "Noem een kledingstuk",
                "Noem iets wat kan vliegen",
                "Noem een bloem",
                "Noem iets wat je in de badkamer vindt",
                "Noem een voertuig",
                "Noem iets wat groot is",
                "Noem iets wat klein is",
                "Noem een beroep",
                "Noem iets wat je kunt drinken",
                "Noem een muziekinstrument",
                "Noem iets wat je in de tuin vindt",
                "Noem een lichaamsdeel"
            ],
            english: [
                "Name a fruit",
                "Name something you take in the car",
                "Name an animal",
                "Name something you use at school",
                "Name a color",
                "Name something you can eat",
                "Name a toy",
                "Name something in the kitchen",
                "Name a piece of clothing",
                "Name something that can fly",
                "Name a flower",
                "Name something you find in the bathroom",
                "Name a vehicle",
                "Name something that is big",
                "Name something that is small",
                "Name a profession",
                "Name something you can drink",
                "Name a musical instrument",
                "Name something you find in the garden",
                "Name a body part"
            ]
        };

        // Load saved language preference
        this.loadLanguagePreference();
    }

    /**
     * Get the current active language
     * @returns {string} Current language code ('dutch' or 'english')
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Set the active language and persist the preference
     * @param {string} languageCode - Language code ('dutch' or 'english')
     * @returns {boolean} True if language was set successfully
     */
    setLanguage(languageCode) {
        try {
            if (!this.translations[languageCode]) {
                console.warn(`Language '${languageCode}' not supported`);
                return false;
            }

            const previousLanguage = this.currentLanguage;
            this.currentLanguage = languageCode;
            this.saveLanguagePreference();
            
            console.log(`Language changed from ${previousLanguage} to ${languageCode}`);
            return true;
        } catch (error) {
            console.error('Error setting language:', error);
            return false;
        }
    }

    /**
     * Get translated text for a given key
     * @param {string} key - Translation key
     * @returns {string} Translated text or key if translation not found
     */
    getTranslation(key) {
        const translation = this.translations[this.currentLanguage]?.[key];
        if (!translation) {
            console.warn(`Translation not found for key '${key}' in language '${this.currentLanguage}'`);
            return key; // Return key as fallback
        }
        return translation;
    }

    /**
     * Get question bank for the current language
     * @returns {Array<string>} Array of questions in current language
     */
    getQuestions() {
        return this.questionBanks[this.currentLanguage] || this.questionBanks.dutch;
    }

    /**
     * Get question bank for a specific language
     * @param {string} languageCode - Language code ('dutch' or 'english')
     * @returns {Array<string>} Array of questions in specified language
     */
    getQuestionsForLanguage(languageCode) {
        return this.questionBanks[languageCode] || this.questionBanks.dutch;
    }

    /**
     * Get all available languages
     * @returns {Array<string>} Array of available language codes
     */
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    /**
     * Check if a language is supported
     * @param {string} languageCode - Language code to check
     * @returns {boolean} True if language is supported
     */
    isLanguageSupported(languageCode) {
        return this.translations.hasOwnProperty(languageCode);
    }

    /**
     * Save language preference to localStorage
     * @private
     */
    saveLanguagePreference() {
        try {
            localStorage.setItem(this.storageKey, this.currentLanguage);
            console.log(`Language preference saved: ${this.currentLanguage}`);
        } catch (error) {
            console.warn('Could not save language preference to localStorage:', error);
            // Language switching can still work without localStorage
        }
    }

    /**
     * Load language preference from localStorage
     * @private
     */
    loadLanguagePreference() {
        try {
            const savedLanguage = localStorage.getItem(this.storageKey);
            if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
                this.currentLanguage = savedLanguage;
            }
        } catch (error) {
            console.warn('Could not load language preference from localStorage:', error);
            // Keep default language
        }
    }

    /**
     * Reset to default language (Dutch)
     */
    resetToDefault() {
        this.setLanguage('dutch');
    }

    /**
     * Toggle between Dutch and English
     * @returns {string} New current language
     */
    toggleLanguage() {
        try {
            const currentLang = this.getCurrentLanguage();
            const newLanguage = currentLang === 'dutch' ? 'english' : 'dutch';
            
            console.log(`Toggling language from ${currentLang} to ${newLanguage}`);
            
            const success = this.setLanguage(newLanguage);
            if (!success) {
                console.error('Failed to set new language during toggle');
                return currentLang; // Return current language if toggle failed
            }
            
            console.log(`Language successfully toggled to: ${newLanguage}`);
            return newLanguage;
        } catch (error) {
            console.error('Error in toggleLanguage:', error);
            return this.getCurrentLanguage(); // Return current language on error
        }
    }
}