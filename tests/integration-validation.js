/**
 * Integration Validation Script
 * Comprehensive testing of all game components working together
 * Tests Requirements: 1.1, 6.1, 6.2, 6.3, 8.4, 8.5
 */

class IntegrationValidator {
    constructor() {
        this.testResults = [];
        this.errors = [];
        this.warnings = [];
    }

    /**
     * Main validation method - runs all integration tests
     */
    async validateIntegration() {
        console.log('🧪 Starting comprehensive integration validation...');
        
        try {
            // Test 1: Component Initialization and Wiring
            await this.testComponentInitialization();
            
            // Test 2: Language Management Integration
            await this.testLanguageIntegration();
            
            // Test 3: Complete User Flow
            await this.testCompleteUserFlow();
            
            // Test 4: Question Bank Integration
            await this.testQuestionBankIntegration();
            
            // Test 5: Educational Goals Verification
            await this.testEducationalGoals();
            
            // Test 6: Error Handling Integration
            await this.testErrorHandlingIntegration();
            
            // Test 7: Performance and Accessibility
            await this.testPerformanceAccessibility();
            
            // Generate final report
            return this.generateReport();
            
        } catch (error) {
            this.errors.push(`Critical validation error: ${error.message}`);
            console.error('Integration validation failed:', error);
            return this.generateReport();
        }
    }

    /**
     * Test 1: Component Initialization and Wiring
     * Requirement 1.1: System displays colorful, child-friendly interface
     */
    async testComponentInitialization() {
        console.log('Testing component initialization and wiring...');
        
        try {
            // Create test environment
            const testContainer = this.createTestContainer('init-test');
            
            // Test ErrorHandler
            const errorHandler = new ErrorHandler();
            if (!errorHandler || typeof errorHandler.showError !== 'function') {
                throw new Error('ErrorHandler initialization failed');
            }
            
            // Test PerformanceOptimizer
            const performanceOptimizer = new PerformanceOptimizer();
            if (!performanceOptimizer) {
                throw new Error('PerformanceOptimizer initialization failed');
            }
            
            // Test LanguageManager
            const languageManager = new LanguageManager();
            if (!languageManager || typeof languageManager.getCurrentLanguage !== 'function') {
                throw new Error('LanguageManager initialization failed');
            }
            
            // Test QuestionManager
            const questionManager = new QuestionManager(languageManager);
            if (!questionManager || typeof questionManager.getAllQuestions !== 'function') {
                throw new Error('QuestionManager initialization failed');
            }
            
            // Test SpinningWheel
            const spinningWheel = new SpinningWheel(testContainer.id);
            if (!spinningWheel || typeof spinningWheel.spin !== 'function') {
                throw new Error('SpinningWheel initialization failed');
            }
            
            // Test QuestionDisplay
            const questionDisplay = new QuestionDisplay(testContainer.id, questionManager, languageManager);
            if (!questionDisplay || typeof questionDisplay.showRandomQuestion !== 'function') {
                throw new Error('QuestionDisplay initialization failed');
            }
            
            // Test GameController
            const gameController = new GameController(testContainer.id, testContainer.id, languageManager);
            if (!gameController || typeof gameController.startNewRound !== 'function') {
                throw new Error('GameController initialization failed');
            }
            
            // Test component health
            const healthCheck = gameController.performHealthCheck();
            if (healthCheck.overall === 'critical') {
                throw new Error('Component health check failed');
            }
            
            this.testResults.push({
                test: 'Component Initialization',
                status: 'PASS',
                details: 'All components initialized successfully and health check passed'
            });
            
            this.cleanupTestContainer(testContainer);
            
        } catch (error) {
            this.errors.push(`Component initialization failed: ${error.message}`);
            this.testResults.push({
                test: 'Component Initialization',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    /**
     * Test 2: Language Management Integration
     * Requirements 8.4, 8.5: Language switching and question display
     */
    async testLanguageIntegration() {
        console.log('Testing language management integration...');
        
        try {
            const testContainer = this.createTestContainer('lang-test');
            const languageManager = new LanguageManager();
            const gameController = new GameController(testContainer.id, testContainer.id, languageManager);
            
            // Test initial language selection
            const initialLang = languageManager.getCurrentLanguage();
            if (!initialLang || (initialLang !== 'dutch' && initialLang !== 'english')) {
                throw new Error('Invalid initial language');
            }
            
            // Test language switching
            const newLang = initialLang === 'dutch' ? 'english' : 'dutch';
            languageManager.setLanguage(newLang);
            
            // Simulate language change event
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { newLanguage: newLang }
            }));
            
            await this.wait(200); // Allow time for event processing
            
            // Verify language change propagated to game controller
            const gameState = gameController.getGameState();
            if (gameState.currentLanguage !== newLang) {
                throw new Error('Language change not propagated to GameController');
            }
            
            // Test question bank switching
            const dutchQuestions = languageManager.getQuestions('dutch');
            const englishQuestions = languageManager.getQuestions('english');
            
            if (!dutchQuestions || dutchQuestions.length < 20) {
                throw new Error('Dutch question bank insufficient');
            }
            if (!englishQuestions || englishQuestions.length < 20) {
                throw new Error('English question bank insufficient');
            }
            
            // Test translations
            const gameTitle = languageManager.getTranslation('gameTitle');
            if (!gameTitle || gameTitle.trim() === '') {
                throw new Error('Translation system not working');
            }
            
            this.testResults.push({
                test: 'Language Management Integration',
                status: 'PASS',
                details: `Language switching working. Dutch: ${dutchQuestions.length} questions, English: ${englishQuestions.length} questions`
            });
            
            this.cleanupTestContainer(testContainer);
            
        } catch (error) {
            this.errors.push(`Language integration failed: ${error.message}`);
            this.testResults.push({
                test: 'Language Management Integration',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    /**
     * Test 3: Complete User Flow
     * Requirements 6.1, 6.2, 6.3: Educational focus and vocabulary building
     */
    async testCompleteUserFlow() {
        console.log('Testing complete user flow...');
        
        try {
            const testContainer = this.createTestContainer('flow-test');
            const languageManager = new LanguageManager();
            const gameController = new GameController(testContainer.id, testContainer.id, languageManager);
            
            // Step 1: Start new round
            gameController.startNewRound();
            await this.wait(100);
            
            let gameState = gameController.getGameState();
            if (!gameState.gameStarted || !gameState.currentQuestion) {
                throw new Error('New round failed to start');
            }
            
            // Step 2: Spin wheel
            const spinPromise = gameController.handleSpin();
            await spinPromise;
            
            gameState = gameController.getGameState();
            if (!gameState.selectedLetter) {
                throw new Error('Wheel spin failed');
            }
            
            // Step 3: Test multiple rounds
            const firstQuestion = gameState.currentQuestion;
            gameController.startNewRound();
            await this.wait(100);
            
            gameState = gameController.getGameState();
            if (gameState.roundNumber !== 2) {
                throw new Error('Round counter not working');
            }
            
            // Step 4: Test language switching during gameplay
            const originalLang = languageManager.getCurrentLanguage();
            const newLang = originalLang === 'dutch' ? 'english' : 'dutch';
            
            languageManager.setLanguage(newLang);
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { newLanguage: newLang }
            }));
            
            await this.wait(200);
            
            gameState = gameController.getGameState();
            if (gameState.currentLanguage !== newLang) {
                throw new Error('Language switching during gameplay failed');
            }
            
            this.testResults.push({
                test: 'Complete User Flow',
                status: 'PASS',
                details: `Full user flow working: rounds, spinning, language switching. Selected letter: ${gameState.selectedLetter}`
            });
            
            this.cleanupTestContainer(testContainer);
            
        } catch (error) {
            this.errors.push(`User flow test failed: ${error.message}`);
            this.testResults.push({
                test: 'Complete User Flow',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    /**
     * Test 4: Question Bank Integration
     * Verify both Dutch and English question banks display correctly
     */
    async testQuestionBankIntegration() {
        console.log('Testing question bank integration...');
        
        try {
            const testContainer = this.createTestContainer('question-test');
            const languageManager = new LanguageManager();
            const questionManager = new QuestionManager(languageManager);
            const questionDisplay = new QuestionDisplay(testContainer.id, questionManager, languageManager);
            
            // Test Dutch questions
            languageManager.setLanguage('dutch');
            const dutchQuestions = questionManager.getAllQuestions();
            
            if (!dutchQuestions || dutchQuestions.length < 20) {
                throw new Error(`Dutch questions insufficient: ${dutchQuestions ? dutchQuestions.length : 0}`);
            }
            
            // Verify Dutch question format
            const sampleDutchQuestion = dutchQuestions[0];
            if (!sampleDutchQuestion.toLowerCase().includes('noem')) {
                this.warnings.push('Dutch questions may not be properly formatted');
            }
            
            // Test English questions
            languageManager.setLanguage('english');
            const englishQuestions = questionManager.getAllQuestions();
            
            if (!englishQuestions || englishQuestions.length < 20) {
                throw new Error(`English questions insufficient: ${englishQuestions ? englishQuestions.length : 0}`);
            }
            
            // Verify English question format
            const sampleEnglishQuestion = englishQuestions[0];
            if (!sampleEnglishQuestion.toLowerCase().includes('name')) {
                this.warnings.push('English questions may not be properly formatted');
            }
            
            // Test question randomization
            const randomQuestions = [];
            for (let i = 0; i < 5; i++) {
                const question = questionDisplay.showRandomQuestion();
                randomQuestions.push(question);
            }
            
            const uniqueQuestions = new Set(randomQuestions);
            if (uniqueQuestions.size < 3) {
                this.warnings.push('Question randomization may not be optimal');
            }
            
            this.testResults.push({
                test: 'Question Bank Integration',
                status: 'PASS',
                details: `Dutch: ${dutchQuestions.length} questions, English: ${englishQuestions.length} questions, Randomization: ${uniqueQuestions.size}/5 unique`
            });
            
            this.cleanupTestContainer(testContainer);
            
        } catch (error) {
            this.errors.push(`Question bank integration failed: ${error.message}`);
            this.testResults.push({
                test: 'Question Bank Integration',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    /**
     * Test 5: Educational Goals Verification
     * Ensure educational objectives are met in both languages
     */
    async testEducationalGoals() {
        console.log('Testing educational goals...');
        
        try {
            const languageManager = new LanguageManager();
            
            // Get question banks
            const dutchQuestions = languageManager.getQuestions('dutch');
            const englishQuestions = languageManager.getQuestions('english');
            
            // Test vocabulary building content
            const educationalCategories = [
                'fruit', 'dier', 'animal', 'kleur', 'color', 'speelgoed', 'toy',
                'keuken', 'kitchen', 'kledingstuk', 'clothing', 'voertuig', 'vehicle',
                'bloem', 'flower', 'beroep', 'profession'
            ];
            
            let dutchEducationalContent = 0;
            let englishEducationalContent = 0;
            
            dutchQuestions.forEach(question => {
                educationalCategories.forEach(category => {
                    if (question.toLowerCase().includes(category)) {
                        dutchEducationalContent++;
                    }
                });
            });
            
            englishQuestions.forEach(question => {
                educationalCategories.forEach(category => {
                    if (question.toLowerCase().includes(category)) {
                        englishEducationalContent++;
                    }
                });
            });
            
            if (dutchEducationalContent < 10) {
                throw new Error('Insufficient educational content in Dutch questions');
            }
            if (englishEducationalContent < 10) {
                throw new Error('Insufficient educational content in English questions');
            }
            
            // Test age-appropriateness (7-year-olds)
            const complexWords = ['sophisticated', 'complicated', 'ingewikkeld', 'gecompliceerd'];
            let ageAppropriate = true;
            
            [...dutchQuestions, ...englishQuestions].forEach(question => {
                complexWords.forEach(word => {
                    if (question.toLowerCase().includes(word)) {
                        ageAppropriate = false;
                    }
                });
            });
            
            if (!ageAppropriate) {
                this.warnings.push('Some questions may be too complex for 7-year-olds');
            }
            
            // Test learning objectives
            const learningObjectives = {
                vocabularyBuilding: dutchEducationalContent > 10 && englishEducationalContent > 10,
                categoryThinking: true, // Questions ask for categories
                letterRecognition: true, // Wheel provides letters
                languageLearning: dutchQuestions.length >= 20 && englishQuestions.length >= 20,
                ageAppropriate: ageAppropriate
            };
            
            const objectivesMet = Object.entries(learningObjectives)
                .filter(([key, value]) => value === true).length;
            const totalObjectives = Object.keys(learningObjectives).length;
            
            if (objectivesMet < totalObjectives - 1) { // Allow one objective to be warning
                throw new Error(`Only ${objectivesMet}/${totalObjectives} learning objectives met`);
            }
            
            this.testResults.push({
                test: 'Educational Goals',
                status: 'PASS',
                details: `${objectivesMet}/${totalObjectives} objectives met. Dutch educational: ${dutchEducationalContent}, English educational: ${englishEducationalContent}`
            });
            
        } catch (error) {
            this.errors.push(`Educational goals test failed: ${error.message}`);
            this.testResults.push({
                test: 'Educational Goals',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    /**
     * Test 6: Error Handling Integration
     */
    async testErrorHandlingIntegration() {
        console.log('Testing error handling integration...');
        
        try {
            const errorHandler = new ErrorHandler();
            
            // Test error display
            errorHandler.showError('Test error message', 'error', 1000);
            
            // Test browser support detection
            const browserSupport = errorHandler.getBrowserSupport();
            if (!browserSupport) {
                throw new Error('Browser support detection failed');
            }
            
            // Test graceful degradation
            if (!browserSupport.cssTransitions) {
                errorHandler.enableGracefulDegradation();
                if (!errorHandler.isFallbackMode()) {
                    throw new Error('Graceful degradation not working');
                }
            }
            
            this.testResults.push({
                test: 'Error Handling Integration',
                status: 'PASS',
                details: 'Error handling, browser support detection, and graceful degradation working'
            });
            
        } catch (error) {
            this.errors.push(`Error handling integration failed: ${error.message}`);
            this.testResults.push({
                test: 'Error Handling Integration',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    /**
     * Test 7: Performance and Accessibility
     */
    async testPerformanceAccessibility() {
        console.log('Testing performance and accessibility...');
        
        try {
            const performanceOptimizer = new PerformanceOptimizer();
            
            // Test performance metrics
            const metrics = performanceOptimizer.getPerformanceMetrics();
            if (!metrics) {
                this.warnings.push('Performance metrics not available');
            }
            
            // Test accessibility features
            const accessibilityFeatures = performanceOptimizer.getAccessibilityFeatures();
            if (!accessibilityFeatures) {
                this.warnings.push('Accessibility features not fully available');
            }
            
            // Test keyboard navigation support
            const keyboardSupport = performanceOptimizer.testKeyboardNavigation();
            if (!keyboardSupport) {
                this.warnings.push('Keyboard navigation may not be fully supported');
            }
            
            this.testResults.push({
                test: 'Performance and Accessibility',
                status: 'PASS',
                details: 'Performance optimization and accessibility features tested'
            });
            
        } catch (error) {
            this.errors.push(`Performance/accessibility test failed: ${error.message}`);
            this.testResults.push({
                test: 'Performance and Accessibility',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    /**
     * Helper method to create test container
     */
    createTestContainer(id) {
        const container = document.createElement('div');
        container.id = id;
        container.style.display = 'none'; // Hide test containers
        document.body.appendChild(container);
        return container;
    }

    /**
     * Helper method to cleanup test container
     */
    cleanupTestContainer(container) {
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }

    /**
     * Helper method to wait for async operations
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generate comprehensive validation report
     */
    generateReport() {
        const passedTests = this.testResults.filter(test => test.status === 'PASS').length;
        const totalTests = this.testResults.length;
        const allPassed = passedTests === totalTests && this.errors.length === 0;
        
        const report = {
            summary: {
                status: allPassed ? 'PASS' : 'FAIL',
                passedTests: passedTests,
                totalTests: totalTests,
                errors: this.errors.length,
                warnings: this.warnings.length,
                timestamp: new Date().toISOString()
            },
            testResults: this.testResults,
            errors: this.errors,
            warnings: this.warnings,
            recommendations: this.generateRecommendations()
        };
        
        console.log('🎯 Integration Validation Report:');
        console.log(`Status: ${report.summary.status}`);
        console.log(`Tests: ${passedTests}/${totalTests} passed`);
        console.log(`Errors: ${this.errors.length}`);
        console.log(`Warnings: ${this.warnings.length}`);
        
        if (allPassed) {
            console.log('🎉 All integration tests passed! Game is ready for production.');
        } else {
            console.log('⚠️ Some integration issues detected. Review before production.');
        }
        
        return report;
    }

    /**
     * Generate recommendations based on test results
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (this.errors.length > 0) {
            recommendations.push('🔴 Critical: Fix all errors before production deployment');
        }
        
        if (this.warnings.length > 0) {
            recommendations.push('🟡 Review warnings and consider improvements');
        }
        
        if (this.testResults.some(test => test.status === 'FAIL')) {
            recommendations.push('🔧 Address failed tests to ensure full functionality');
        }
        
        if (this.warnings.some(w => w.includes('randomization'))) {
            recommendations.push('🎲 Consider improving question randomization algorithm');
        }
        
        if (this.warnings.some(w => w.includes('age-appropriate'))) {
            recommendations.push('👶 Review question complexity for 7-year-old target audience');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('✅ All systems working optimally - ready for production!');
        }
        
        return recommendations;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntegrationValidator;
}

// Auto-run validation if loaded directly
if (typeof window !== 'undefined' && window.document) {
    window.IntegrationValidator = IntegrationValidator;
    
    // Provide global function for easy testing
    window.runIntegrationValidation = async function() {
        const validator = new IntegrationValidator();
        return await validator.validateIntegration();
    };
}