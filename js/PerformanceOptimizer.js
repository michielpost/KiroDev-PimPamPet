/**
 * PerformanceOptimizer - Utility class for optimizing game performance and accessibility
 * Provides methods to enhance performance on various devices and improve accessibility
 */
class PerformanceOptimizer {
    constructor() {
        this.deviceCapabilities = this.detectDeviceCapabilities();
        this.accessibilityPreferences = this.detectAccessibilityPreferences();
        this.performanceMode = this.determinePerformanceMode();
        this.initialized = false;
        
        this.init();
    }

    /**
     * Initialize performance optimizations
     */
    init() {
        if (this.initialized) return;
        
        try {
            this.applyPerformanceOptimizations();
            this.setupAccessibilityEnhancements();
            this.setupKeyboardNavigation();
            this.optimizeAnimations();
            this.setupPerformanceMonitoring();
            
            this.initialized = true;
            console.log('Performance optimizer initialized:', {
                deviceCapabilities: this.deviceCapabilities,
                accessibilityPreferences: this.accessibilityPreferences,
                performanceMode: this.performanceMode
            });
        } catch (error) {
            console.error('Error initializing performance optimizer:', error);
        }
    }

    /**
     * Detect device capabilities for performance optimization
     */
    detectDeviceCapabilities() {
        const capabilities = {
            // Hardware acceleration support
            supportsTransform3d: this.supportsCSS3DTransforms(),
            supportsBackdropFilter: this.supportsBackdropFilter(),
            supportsWillChange: this.supportsWillChange(),
            
            // Device characteristics
            isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isLowEndDevice: this.isLowEndDevice(),
            hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            
            // Browser capabilities
            supportsIntersectionObserver: 'IntersectionObserver' in window,
            supportsRequestIdleCallback: 'requestIdleCallback' in window,
            supportsPassiveListeners: this.supportsPassiveListeners(),
            
            // Performance indicators
            deviceMemory: navigator.deviceMemory || 4, // Default to 4GB if not available
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            connectionType: this.getConnectionType()
        };
        
        return capabilities;
    }

    /**
     * Detect user accessibility preferences
     */
    detectAccessibilityPreferences() {
        const preferences = {
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
            prefersReducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches,
            prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
            
            // Keyboard navigation detection
            usingKeyboard: false,
            screenReaderDetected: this.detectScreenReader(),
            
            // Font size preferences
            baseFontSize: parseInt(getComputedStyle(document.documentElement).fontSize) || 16
        };
        
        return preferences;
    }

    /**
     * Determine optimal performance mode based on device capabilities
     */
    determinePerformanceMode() {
        const { deviceCapabilities } = this;
        
        if (deviceCapabilities.isLowEndDevice || 
            deviceCapabilities.deviceMemory < 2 || 
            deviceCapabilities.connectionType === 'slow') {
            return 'battery-saver';
        } else if (deviceCapabilities.isMobile) {
            return 'mobile-optimized';
        } else {
            return 'full-performance';
        }
    }

    /**
     * Apply performance optimizations based on device capabilities
     */
    applyPerformanceOptimizations() {
        const body = document.body;
        
        // Add performance mode class
        body.classList.add(`performance-${this.performanceMode}`);
        
        // Apply device-specific optimizations
        if (this.deviceCapabilities.isLowEndDevice) {
            body.classList.add('low-end-device');
            this.enableBatterySaverMode();
        }
        
        if (this.deviceCapabilities.isMobile) {
            body.classList.add('mobile-device');
            this.optimizeForMobile();
        }
        
        if (!this.deviceCapabilities.supportsTransform3d) {
            body.classList.add('no-3d-transforms');
        }
        
        if (!this.deviceCapabilities.supportsBackdropFilter) {
            body.classList.add('no-backdrop-filter');
        }
        
        // Optimize will-change usage
        this.optimizeWillChange();
        
        // Setup intersection observer for performance
        if (this.deviceCapabilities.supportsIntersectionObserver) {
            this.setupIntersectionObserver();
        }
    }

    /**
     * Setup accessibility enhancements
     */
    setupAccessibilityEnhancements() {
        const body = document.body;
        
        // Apply accessibility preferences
        if (this.accessibilityPreferences.prefersReducedMotion) {
            body.classList.add('reduce-motion');
        }
        
        if (this.accessibilityPreferences.prefersHighContrast) {
            body.classList.add('high-contrast');
        }
        
        if (this.accessibilityPreferences.prefersReducedTransparency) {
            body.classList.add('reduce-transparency');
        }
        
        // Setup screen reader support
        if (this.accessibilityPreferences.screenReaderDetected) {
            body.classList.add('screen-reader-active');
            this.enhanceScreenReaderSupport();
        }
        
        // Setup focus management
        this.setupFocusManagement();
        
        // Setup ARIA live regions
        this.setupLiveRegions();
        
        // Monitor accessibility preference changes
        this.monitorAccessibilityChanges();
    }

    /**
     * Setup comprehensive keyboard navigation
     */
    setupKeyboardNavigation() {
        let keyboardActive = false;
        
        // Detect keyboard usage
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key.startsWith('Arrow')) {
                if (!keyboardActive) {
                    keyboardActive = true;
                    document.body.classList.add('keyboard-navigation');
                    this.accessibilityPreferences.usingKeyboard = true;
                }
            }
        });
        
        // Detect mouse usage
        document.addEventListener('mousedown', () => {
            if (keyboardActive) {
                keyboardActive = false;
                document.body.classList.remove('keyboard-navigation');
                this.accessibilityPreferences.usingKeyboard = false;
            }
        });
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Setup focus trap for modals
        this.setupFocusTrap();
    }

    /**
     * Setup keyboard shortcuts for game controls
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Skip if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            const gameController = window.gameController;
            if (!gameController) return;
            
            const gameState = gameController.getGameState();
            
            switch (e.key) {
                case ' ': // Spacebar to spin wheel
                case 'Enter': // Enter to spin wheel
                    if (gameState.gameStarted && !gameState.isSpinning) {
                        e.preventDefault();
                        const spinButton = document.getElementById('spin-button');
                        if (spinButton && !spinButton.disabled) {
                            spinButton.click();
                            this.announceToScreenReader('Wiel wordt gedraaid...');
                        }
                    }
                    break;
                    
                case 'n': // 'N' for new game
                case 'N':
                    if (e.ctrlKey || e.altKey) {
                        e.preventDefault();
                        const newGameButton = document.getElementById('new-game-button');
                        if (newGameButton) {
                            newGameButton.click();
                            this.announceToScreenReader('Nieuwe ronde gestart');
                        }
                    }
                    break;
                    
                case 'm': // 'M' for manage questions
                case 'M':
                    if (e.ctrlKey || e.altKey) {
                        e.preventDefault();
                        const manageButton = document.getElementById('manage-questions-btn');
                        if (manageButton) {
                            manageButton.click();
                            this.announceToScreenReader('Vraagbeheer geopend');
                        }
                    }
                    break;
                    
                case 'l': // 'L' for language toggle
                case 'L':
                    if (e.ctrlKey || e.altKey) {
                        e.preventDefault();
                        const languageButton = document.querySelector('.language-toggle-btn');
                        if (languageButton) {
                            languageButton.click();
                            this.announceToScreenReader('Taal wordt gewijzigd');
                        }
                    }
                    break;
                    
                case 'Escape': // Escape to close modals
                    this.closeActiveModals();
                    break;
                    
                case '?': // Help
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.showKeyboardHelp();
                    }
                    break;
            }
        });
    }

    /**
     * Optimize animations based on device capabilities and user preferences
     */
    optimizeAnimations() {
        if (this.accessibilityPreferences.prefersReducedMotion) {
            this.disableAnimations();
            return;
        }
        
        if (this.performanceMode === 'battery-saver') {
            this.simplifyAnimations();
        } else if (this.performanceMode === 'mobile-optimized') {
            this.optimizeAnimationsForMobile();
        }
        
        // Setup animation performance monitoring
        this.monitorAnimationPerformance();
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        if (!this.deviceCapabilities.supportsRequestIdleCallback) return;
        
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitorPerformance = () => {
            const currentTime = performance.now();
            frameCount++;
            
            if (currentTime - lastTime >= 5000) { // Check every 5 seconds
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30 && this.performanceMode !== 'battery-saver') {
                    console.warn('Low FPS detected, switching to battery saver mode');
                    this.enableBatterySaverMode();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitorPerformance);
        };
        
        requestAnimationFrame(monitorPerformance);
    }

    /**
     * Enable battery saver mode for low-end devices
     */
    enableBatterySaverMode() {
        document.body.classList.add('battery-saver-mode');
        
        // Disable complex animations
        const style = document.createElement('style');
        style.textContent = `
            .battery-saver-mode * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
            .battery-saver-mode .game-button:hover {
                transform: none !important;
            }
            .battery-saver-mode .wheel.spinning {
                animation: none !important;
                transform: rotate(720deg) !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log('Battery saver mode enabled');
    }

    /**
     * Optimize for mobile devices
     */
    optimizeForMobile() {
        // Reduce animation complexity
        const style = document.createElement('style');
        style.textContent = `
            .mobile-device .game-button:hover {
                transform: translateY(-1px) scale(1.01) !important;
            }
            .mobile-device .question-section:hover,
            .mobile-device .wheel-section:hover {
                transform: translateY(-1px) !important;
            }
        `;
        document.head.appendChild(style);
        
        // Setup touch optimizations
        this.setupTouchOptimizations();
    }

    /**
     * Setup touch optimizations for mobile devices
     */
    setupTouchOptimizations() {
        // Add touch feedback
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('game-button') || 
                e.target.classList.contains('language-option') ||
                e.target.classList.contains('manage-questions-btn')) {
                e.target.classList.add('touch-active');
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('touch-active')) {
                setTimeout(() => {
                    e.target.classList.remove('touch-active');
                }, 150);
            }
        }, { passive: true });
        
        // Prevent double-tap zoom on buttons
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                if (e.target.classList.contains('game-button') || 
                    e.target.classList.contains('language-option') ||
                    e.target.classList.contains('manage-questions-btn')) {
                    e.preventDefault();
                }
            }
            lastTouchEnd = now;
        }, false);
    }

    /**
     * Setup focus management for accessibility
     */
    setupFocusManagement() {
        // Track focus for better accessibility
        let focusedElement = null;
        
        document.addEventListener('focusin', (e) => {
            focusedElement = e.target;
            
            // Announce focus changes to screen readers
            if (this.accessibilityPreferences.screenReaderDetected) {
                const label = e.target.getAttribute('aria-label') || 
                             e.target.textContent || 
                             e.target.getAttribute('title');
                if (label) {
                    this.announceToScreenReader(`Gefocust op: ${label}`);
                }
            }
        });
        
        document.addEventListener('focusout', (e) => {
            focusedElement = null;
        });
        
        // Return focus to last focused element when modals close
        this.lastFocusedElement = null;
        
        document.addEventListener('modal-opened', (e) => {
            this.lastFocusedElement = focusedElement;
        });
        
        document.addEventListener('modal-closed', (e) => {
            if (this.lastFocusedElement && this.lastFocusedElement.isConnected) {
                this.lastFocusedElement.focus();
            }
        });
    }

    /**
     * Setup focus trap for modals
     */
    setupFocusTrap() {
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            const modal = document.querySelector('.modal[style*="display: flex"], .language-modal-overlay[style*="display: flex"]');
            if (!modal) return;
            
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) return;
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    /**
     * Setup ARIA live regions for screen reader announcements
     */
    setupLiveRegions() {
        // Ensure live regions exist
        if (!document.getElementById('sr-announcements')) {
            const announcements = document.createElement('div');
            announcements.id = 'sr-announcements';
            announcements.className = 'sr-live-region';
            announcements.setAttribute('aria-live', 'polite');
            announcements.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcements);
        }
        
        if (!document.getElementById('sr-status')) {
            const status = document.createElement('div');
            status.id = 'sr-status';
            status.className = 'sr-live-region';
            status.setAttribute('aria-live', 'assertive');
            status.setAttribute('aria-atomic', 'true');
            document.body.appendChild(status);
        }
    }

    /**
     * Announce messages to screen readers
     */
    announceToScreenReader(message, priority = 'polite') {
        const regionId = priority === 'assertive' ? 'sr-status' : 'sr-announcements';
        const region = document.getElementById(regionId);
        
        if (region) {
            region.textContent = message;
            setTimeout(() => {
                region.textContent = '';
            }, priority === 'assertive' ? 2000 : 1000);
        }
    }

    /**
     * Close active modals
     */
    closeActiveModals() {
        // Close question management modal
        const questionModal = document.querySelector('.modal[style*="display: flex"]');
        if (questionModal && window.questionManagementUI) {
            window.questionManagementUI.hideManagementInterface();
            return;
        }
        
        // Close language selection modal
        const languageModal = document.querySelector('.language-modal-overlay[style*="display: flex"]');
        if (languageModal && window.languageSelectionUI) {
            // Only close if not initial selection
            if (!languageModal.classList.contains('initial-selection')) {
                window.languageSelectionUI.hideLanguageSelector();
            }
        }
    }

    /**
     * Show keyboard help dialog
     */
    showKeyboardHelp() {
        const helpText = `
Toetsenbord sneltoetsen:
• Spatie/Enter: Draai het wiel
• Ctrl+N: Nieuw spel
• Ctrl+M: Beheer vragen
• Ctrl+L: Wissel taal
• Escape: Sluit vensters
• Shift+?: Toon deze help
• Tab: Navigeer tussen elementen
        `;
        
        this.announceToScreenReader(helpText, 'assertive');
        
        // Also show visual help if possible
        if (window.errorHandler) {
            window.errorHandler.showError(helpText.replace(/•/g, '•'), 'info', 10000);
        }
    }

    /**
     * Utility methods for feature detection
     */
    supportsCSS3DTransforms() {
        const el = document.createElement('div');
        return 'transform' in el.style && 'perspective' in el.style;
    }

    supportsBackdropFilter() {
        return CSS.supports('backdrop-filter', 'blur(1px)') || 
               CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    }

    supportsWillChange() {
        return CSS.supports('will-change', 'transform');
    }

    supportsPassiveListeners() {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        } catch (e) {}
        return supportsPassive;
    }

    isLowEndDevice() {
        // Heuristics to detect low-end devices
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const connection = this.getConnectionType();
        
        return memory < 2 || cores < 2 || connection === 'slow';
    }

    getConnectionType() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (!connection) return 'unknown';
        
        const slowConnections = ['slow-2g', '2g', '3g'];
        return slowConnections.includes(connection.effectiveType) ? 'slow' : 'fast';
    }

    detectScreenReader() {
        // Heuristics to detect screen reader usage
        return navigator.userAgent.includes('NVDA') || 
               navigator.userAgent.includes('JAWS') || 
               navigator.userAgent.includes('VoiceOver') ||
               window.speechSynthesis !== undefined;
    }

    /**
     * Monitor accessibility preference changes
     */
    monitorAccessibilityChanges() {
        // Monitor reduced motion preference changes
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        reducedMotionQuery.addListener((e) => {
            this.accessibilityPreferences.prefersReducedMotion = e.matches;
            if (e.matches) {
                document.body.classList.add('reduce-motion');
                this.disableAnimations();
            } else {
                document.body.classList.remove('reduce-motion');
                this.enableAnimations();
            }
        });
        
        // Monitor high contrast preference changes
        const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
        highContrastQuery.addListener((e) => {
            this.accessibilityPreferences.prefersHighContrast = e.matches;
            if (e.matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        });
    }

    /**
     * Disable animations for reduced motion preference
     */
    disableAnimations() {
        const style = document.createElement('style');
        style.id = 'disable-animations';
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Enable animations
     */
    enableAnimations() {
        const style = document.getElementById('disable-animations');
        if (style) {
            style.remove();
        }
    }

    /**
     * Simplify animations for battery saver mode
     */
    simplifyAnimations() {
        const style = document.createElement('style');
        style.id = 'simplify-animations';
        style.textContent = `
            .game-button:hover {
                transform: scale(1.02) !important;
            }
            .wheel.spinning {
                animation-duration: 2s !important;
            }
            .question-text.fade-in,
            .question-text.fade-out {
                transition-duration: 0.2s !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Optimize animations for mobile
     */
    optimizeAnimationsForMobile() {
        const style = document.createElement('style');
        style.id = 'mobile-animations';
        style.textContent = `
            @media (max-width: 768px) {
                .game-button:hover {
                    transform: translateY(-1px) scale(1.01) !important;
                }
                .question-section:hover,
                .wheel-section:hover {
                    transform: translateY(-1px) !important;
                }
                .wheel.spinning {
                    animation-duration: 3s !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Monitor animation performance
     */
    monitorAnimationPerformance() {
        let animationFrameCount = 0;
        let animationStartTime = performance.now();
        
        const checkAnimationPerformance = () => {
            animationFrameCount++;
            const currentTime = performance.now();
            
            if (currentTime - animationStartTime >= 1000) {
                const fps = animationFrameCount;
                
                if (fps < 30 && this.performanceMode !== 'battery-saver') {
                    console.warn('Animation performance degraded, optimizing...');
                    this.simplifyAnimations();
                }
                
                animationFrameCount = 0;
                animationStartTime = currentTime;
            }
            
            requestAnimationFrame(checkAnimationPerformance);
        };
        
        requestAnimationFrame(checkAnimationPerformance);
    }

    /**
     * Optimize will-change usage
     */
    optimizeWillChange() {
        // Remove will-change from elements that are not actively animating
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const element = mutation.target;
                    
                    // Remove will-change from elements that finished animating
                    if (!element.classList.contains('spinning') && 
                        !element.classList.contains('fade-in') && 
                        !element.classList.contains('fade-out')) {
                        element.style.willChange = 'auto';
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class']
        });
    }

    /**
     * Setup intersection observer for performance
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Element is visible, enable animations
                    entry.target.classList.remove('visibility-hidden');
                } else {
                    // Element is not visible, disable animations
                    entry.target.classList.add('visibility-hidden');
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        // Observe game sections
        const sections = document.querySelectorAll('.question-section, .wheel-section, .results-section');
        sections.forEach(section => observer.observe(section));
    }

    /**
     * Enhance screen reader support
     */
    enhanceScreenReaderSupport() {
        // Add more descriptive labels
        const spinButton = document.getElementById('spin-button');
        if (spinButton) {
            spinButton.setAttribute('aria-describedby', 'spin-button-help');
        }
        
        const newGameButton = document.getElementById('new-game-button');
        if (newGameButton) {
            newGameButton.setAttribute('aria-describedby', 'new-game-help');
        }
        
        // Add role descriptions
        const wheelContainer = document.getElementById('wheel-container');
        if (wheelContainer) {
            wheelContainer.setAttribute('role', 'application');
            wheelContainer.setAttribute('aria-label', 'Draaiend wiel voor letter selectie');
        }
        
        const questionContainer = document.getElementById('question-container');
        if (questionContainer) {
            questionContainer.setAttribute('role', 'region');
            questionContainer.setAttribute('aria-label', 'Huidige vraag');
        }
    }

    /**
     * Get current performance statistics
     */
    getPerformanceStats() {
        return {
            deviceCapabilities: this.deviceCapabilities,
            accessibilityPreferences: this.accessibilityPreferences,
            performanceMode: this.performanceMode,
            initialized: this.initialized
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}