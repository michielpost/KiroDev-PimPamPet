/**
 * QuestionManagementUI - Provides user interface for managing questions
 * Handles modal display, form inputs, and question list management
 */
class QuestionManagementUI {
    constructor(containerId, questionManager) {
        this.containerId = containerId;
        this.questionManager = questionManager;
        this.languageManager = window.languageManager || null;
        this.isVisible = false;
        this.editingIndex = -1;
        
        this.createUI();
        this.attachEventListeners();
        this.setupLanguageChangeListener();
    }

    /**
     * Creates the question management UI structure
     */
    createUI() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id '${this.containerId}' not found`);
            return;
        }

        const t = (key) => this.languageManager ? this.languageManager.getTranslation(key) : key;

        container.innerHTML = `
            <div id="question-management-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modal-title">${t('manageQuestions')}</h2>
                        <button class="close-btn" id="close-modal">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="question-form-section">
                            <h3 id="form-title">${t('addNewQuestion')}</h3>
                            <form id="question-form">
                                <div class="form-group">
                                    <label for="question-input" id="question-label">${t('questionLabel')}</label>
                                    <input 
                                        type="text" 
                                        id="question-input" 
                                        placeholder="${t('questionPlaceholderExample')}"
                                        maxlength="100"
                                        required
                                    >
                                </div>
                                <div class="form-buttons">
                                    <button type="submit" id="save-question-btn">${t('save')}</button>
                                    <button type="button" id="cancel-edit-btn" style="display: none;">${t('cancel')}</button>
                                </div>
                            </form>
                            <div id="form-message" class="message"></div>
                        </div>

                        <div class="question-list-section">
                            <h3 id="all-questions-title">${t('allQuestions')}</h3>
                            <div class="question-stats">
                                <span id="question-count">${t('totalQuestions')} 0 ${t('questions')}</span>
                                <span id="custom-count">${t('customQuestions')} 0 ${t('questions')}</span>
                            </div>
                            <div id="question-list" class="question-list">
                                <!-- Questions will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delete confirmation dialog -->
            <div id="delete-confirmation-modal" class="modal" style="display: none;">
                <div class="modal-content small">
                    <div class="modal-header">
                        <h3 id="delete-modal-title">${t('deleteQuestion')}</h3>
                    </div>
                    <div class="modal-body">
                        <p id="delete-confirmation-text">${t('deleteConfirmation')}</p>
                        <p id="delete-question-text" class="question-preview"></p>
                        <div class="form-buttons">
                            <button id="confirm-delete-btn" class="danger-btn">${t('delete')}</button>
                            <button id="cancel-delete-btn">${t('cancel')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Attaches event listeners to UI elements
     */
    attachEventListeners() {
        // Modal controls
        document.getElementById('close-modal').addEventListener('click', () => {
            this.hideManagementInterface();
        });

        // Form submission
        document.getElementById('question-form').addEventListener('submit', (e) => {
            this.handleFormSubmission(e);
        });

        // Cancel edit
        document.getElementById('cancel-edit-btn').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Delete confirmation
        document.getElementById('confirm-delete-btn').addEventListener('click', () => {
            this.confirmDelete();
        });

        document.getElementById('cancel-delete-btn').addEventListener('click', () => {
            this.hideDeleteConfirmation();
        });

        // Close modal when clicking outside
        document.getElementById('question-management-modal').addEventListener('click', (e) => {
            if (e.target.id === 'question-management-modal') {
                this.hideManagementInterface();
            }
        });

        document.getElementById('delete-confirmation-modal').addEventListener('click', (e) => {
            if (e.target.id === 'delete-confirmation-modal') {
                this.hideDeleteConfirmation();
            }
        });
    }

    /**
     * Shows the question management interface
     */
    showManagementInterface() {
        this.isVisible = true;
        document.getElementById('question-management-modal').style.display = 'flex';
        this.refreshQuestionList();
        this.resetForm();
        
        // Focus on input field
        setTimeout(() => {
            document.getElementById('question-input').focus();
        }, 100);
    }

    /**
     * Hides the question management interface
     */
    hideManagementInterface() {
        this.isVisible = false;
        document.getElementById('question-management-modal').style.display = 'none';
        this.resetForm();
    }

    /**
     * Refreshes the question list display
     */
    refreshQuestionList() {
        const listContainer = document.getElementById('question-list');
        const allQuestions = this.questionManager.getAllQuestions();
        const customQuestions = this.questionManager.getCustomQuestions();
        const defaultQuestions = this.questionManager.getDefaultQuestions();

        const t = (key) => this.languageManager ? this.languageManager.getTranslation(key) : key;

        // Update stats
        document.getElementById('question-count').textContent = `${t('totalQuestions')} ${allQuestions.length} ${t('questions')}`;
        document.getElementById('custom-count').textContent = `${t('customQuestions')} ${customQuestions.length} ${t('questions')}`;

        // Clear existing list
        listContainer.innerHTML = '';

        // Add default questions (read-only)
        if (defaultQuestions.length > 0) {
            const defaultSection = document.createElement('div');
            defaultSection.className = 'question-section';
            defaultSection.innerHTML = `<h4>${t('defaultQuestions')}</h4>`;
            
            defaultQuestions.forEach((question, index) => {
                const questionItem = this.createQuestionItem(question, index, false);
                defaultSection.appendChild(questionItem);
            });
            
            listContainer.appendChild(defaultSection);
        }

        // Add custom questions (editable)
        if (customQuestions.length > 0) {
            const customSection = document.createElement('div');
            customSection.className = 'question-section';
            customSection.innerHTML = `<h4>${t('customQuestionsSection')}</h4>`;
            
            customQuestions.forEach((question, index) => {
                const questionItem = this.createQuestionItem(question, index, true);
                customSection.appendChild(questionItem);
            });
            
            listContainer.appendChild(customSection);
        } else {
            const noCustomQuestions = document.createElement('div');
            noCustomQuestions.className = 'no-questions';
            noCustomQuestions.innerHTML = `<p><em>${t('noCustomQuestions')}</em></p>`;
            listContainer.appendChild(noCustomQuestions);
        }
    }

    /**
     * Creates a question list item element
     * @param {string} question - The question text
     * @param {number} index - The question index
     * @param {boolean} isCustom - Whether this is a custom question
     * @returns {HTMLElement} - The question item element
     */
    createQuestionItem(question, index, isCustom) {
        const item = document.createElement('div');
        item.className = 'question-item';
        
        const questionText = document.createElement('span');
        questionText.className = 'question-text';
        questionText.textContent = question;
        
        const actions = document.createElement('div');
        actions.className = 'question-actions';
        
        const t = (key) => this.languageManager ? this.languageManager.getTranslation(key) : key;
        
        if (isCustom) {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = t('edit');
            editBtn.addEventListener('click', () => this.editQuestion(index));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = t('delete');
            deleteBtn.addEventListener('click', () => this.showDeleteConfirmation(index));
            
            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
        } else {
            const readOnlyLabel = document.createElement('span');
            readOnlyLabel.className = 'read-only-label';
            readOnlyLabel.textContent = t('defaultLabel');
            actions.appendChild(readOnlyLabel);
        }
        
        item.appendChild(questionText);
        item.appendChild(actions);
        
        return item;
    }

    /**
     * Handles form submission for adding/editing questions
     * @param {Event} e - The form submission event
     */
    handleFormSubmission(e) {
        e.preventDefault();
        
        const input = document.getElementById('question-input');
        const questionText = input.value.trim();
        const messageEl = document.getElementById('form-message');
        
        const t = (key) => this.languageManager ? this.languageManager.getTranslation(key) : key;
        
        if (!questionText) {
            this.showMessage(t('enterQuestion'), 'error');
            return;
        }
        
        let success = false;
        let message = '';
        
        if (this.editingIndex >= 0) {
            // Editing existing question
            success = this.questionManager.editQuestion(this.editingIndex, questionText);
            message = success ? t('questionUpdatedSuccess') : t('questionUpdateError');
        } else {
            // Adding new question
            success = this.questionManager.addQuestion(questionText);
            message = success ? t('questionAddedSuccess') : t('questionAddError');
        }
        
        if (success) {
            this.showMessage(message, 'success');
            this.refreshQuestionList();
            this.resetForm();
        } else {
            this.showMessage(message, 'error');
        }
    }

    /**
     * Starts editing a question
     * @param {number} index - Index of the custom question to edit
     */
    editQuestion(index) {
        const customQuestions = this.questionManager.getCustomQuestions();
        if (index < 0 || index >= customQuestions.length) {
            return;
        }
        
        this.editingIndex = index;
        const question = customQuestions[index];
        
        const t = (key) => this.languageManager ? this.languageManager.getTranslation(key) : key;
        
        document.getElementById('question-input').value = question;
        document.getElementById('form-title').textContent = t('editQuestion');
        document.getElementById('save-question-btn').textContent = t('update');
        document.getElementById('cancel-edit-btn').style.display = 'inline-block';
        
        // Scroll to form
        document.getElementById('question-form').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('question-input').focus();
    }

    /**
     * Cancels the current edit operation
     */
    cancelEdit() {
        this.resetForm();
    }

    /**
     * Shows delete confirmation dialog
     * @param {number} index - Index of the custom question to delete
     */
    showDeleteConfirmation(index) {
        const customQuestions = this.questionManager.getCustomQuestions();
        if (index < 0 || index >= customQuestions.length) {
            return;
        }
        
        const t = (key) => this.languageManager ? this.languageManager.getTranslation(key) : key;
        
        // Check if deletion would violate minimum question count
        if (this.questionManager.getQuestionCount() <= 5) {
            this.showMessage(t('minimumQuestionsError'), 'error');
            return;
        }
        
        this.deleteIndex = index;
        const question = customQuestions[index];
        
        document.getElementById('delete-question-text').textContent = question;
        document.getElementById('delete-confirmation-modal').style.display = 'flex';
    }

    /**
     * Hides delete confirmation dialog
     */
    hideDeleteConfirmation() {
        document.getElementById('delete-confirmation-modal').style.display = 'none';
        this.deleteIndex = -1;
    }

    /**
     * Confirms and executes question deletion
     */
    confirmDelete() {
        if (this.deleteIndex >= 0) {
            const success = this.questionManager.deleteQuestion(this.deleteIndex);
            
            const t = (key) => this.languageManager ? this.languageManager.getTranslation(key) : key;
            
            if (success) {
                this.showMessage(t('questionDeletedSuccess'), 'success');
                this.refreshQuestionList();
            } else {
                this.showMessage(t('questionDeleteError'), 'error');
            }
        }
        
        this.hideDeleteConfirmation();
    }

    /**
     * Resets the form to its initial state
     */
    resetForm() {
        this.editingIndex = -1;
        document.getElementById('question-input').value = '';
        
        const t = (key) => this.languageManager ? this.languageManager.getTranslation(key) : key;
        
        document.getElementById('form-title').textContent = t('addNewQuestion');
        document.getElementById('save-question-btn').textContent = t('save');
        document.getElementById('cancel-edit-btn').style.display = 'none';
        this.clearMessage();
    }

    /**
     * Shows a message to the user
     * @param {string} message - The message to show
     * @param {string} type - The message type ('success', 'error', 'info')
     */
    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('form-message');
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.clearMessage();
            }, 3000);
        }
    }

    /**
     * Clears the current message
     */
    clearMessage() {
        const messageEl = document.getElementById('form-message');
        messageEl.textContent = '';
        messageEl.className = 'message';
        messageEl.style.display = 'none';
    }

    /**
     * Sets up language change listener to update UI when language changes
     */
    setupLanguageChangeListener() {
        document.addEventListener('languageChanged', (event) => {
            this.onLanguageChange(event.detail.newLanguage);
        });
    }

    /**
     * Handles language change by updating all UI text
     * @param {string} newLanguage - The new language code
     */
    onLanguageChange(newLanguage) {
        try {
            // Update all static text elements
            this.updateUIText();
            
            // Refresh the question list to update dynamic content
            if (this.isVisible) {
                this.refreshQuestionList();
            }
        } catch (error) {
            console.error('Error updating QuestionManagementUI for language change:', error);
        }
    }

    /**
     * Updates all UI text elements with current language translations
     */
    updateUIText() {
        if (!this.languageManager) return;

        const t = (key) => this.languageManager.getTranslation(key);

        // Update modal titles and labels
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) modalTitle.textContent = t('manageQuestions');

        const allQuestionsTitle = document.getElementById('all-questions-title');
        if (allQuestionsTitle) allQuestionsTitle.textContent = t('allQuestions');

        const questionLabel = document.getElementById('question-label');
        if (questionLabel) questionLabel.textContent = t('questionLabel');

        const questionInput = document.getElementById('question-input');
        if (questionInput) questionInput.placeholder = t('questionPlaceholderExample');

        const deleteModalTitle = document.getElementById('delete-modal-title');
        if (deleteModalTitle) deleteModalTitle.textContent = t('deleteQuestion');

        const deleteConfirmationText = document.getElementById('delete-confirmation-text');
        if (deleteConfirmationText) deleteConfirmationText.textContent = t('deleteConfirmation');

        const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
        if (confirmDeleteBtn) confirmDeleteBtn.textContent = t('delete');

        const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
        if (cancelDeleteBtn) cancelDeleteBtn.textContent = t('cancel');

        // Update form state based on current editing state
        this.updateFormText();
    }

    /**
     * Updates form text based on current editing state
     */
    updateFormText() {
        if (!this.languageManager) return;

        const t = (key) => this.languageManager.getTranslation(key);

        const formTitle = document.getElementById('form-title');
        const saveBtn = document.getElementById('save-question-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');

        if (this.editingIndex >= 0) {
            // Editing mode
            if (formTitle) formTitle.textContent = t('editQuestion');
            if (saveBtn) saveBtn.textContent = t('update');
        } else {
            // Adding mode
            if (formTitle) formTitle.textContent = t('addNewQuestion');
            if (saveBtn) saveBtn.textContent = t('save');
        }

        if (cancelBtn) cancelBtn.textContent = t('cancel');
    }

    /**
     * Returns whether the management interface is currently visible
     * @returns {boolean} - True if visible, false otherwise
     */
    isManagementVisible() {
        return this.isVisible;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionManagementUI;
}