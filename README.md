# Pim Pam Pet - Dutch Word Game

LIVE DEMO: https://michielpost.github.io/KiroDev-PimPamPet/

My first experience using Kiro.Dev to generate a word game (Pim Pam Pet).
- My initial input was just 5 lines of text to describe the game
- It generates a lot of specs and taks based on that
- It's a hassle to start all the tasks
- Kiro.Dev AI has a lot of text output to tell you what it's doing, I mostly skip it
- Used the vibe coding mode to fix some bugs
- It has trouble translating every part of the game, some text is not translated

Start Kiro.Dev generated readme:
-----

A fun and educational word game designed for 7-year-old children, featuring a spinning wheel letter selector and Dutch vocabulary questions. This digital recreation of the classic "Pim Pam Pet" game combines learning with play to help children expand their vocabulary in both Dutch and English.

## 🎯 Educational Purpose

Pim Pam Pet is designed to help children:
- **Expand vocabulary** in Dutch and English
- **Practice quick thinking** and word association
- **Learn categorization** through themed questions
- **Develop language skills** through interactive play
- **Build confidence** with age-appropriate challenges

The game presents children with category-based questions (like "Name a fruit" or "Name something you find in the kitchen") and uses a spinning wheel to randomly select a letter. Children must then think of words that fit the category and start with the selected letter.

## 🎮 Game Features

### Core Gameplay
- **Spinning Wheel**: Interactive letter selector with 22 Dutch alphabet letters (excluding c, x, q, y)
- **Question Bank**: 20 carefully crafted questions in both Dutch and English
- **Random Selection**: Avoids immediate question repeats for varied gameplay
- **Child-Friendly Interface**: Large buttons, bright colors, and clear typography

### Language Support
- **Bilingual**: Full support for Dutch and English
- **Language Selection**: Choose your preferred language on startup
- **Language Switching**: Toggle between languages during gameplay
- **Persistent Preferences**: Remembers your language choice

### Question Management
- **Custom Questions**: Add your own questions to personalize the game
- **Question Editor**: Easy-to-use interface for managing questions
- **Validation**: Ensures minimum question count for gameplay
- **Persistent Storage**: Custom questions are saved locally

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Screen Reader Support**: ARIA labels and live regions
- **High Contrast**: Readable text with appropriate color ratios
- **Large Click Targets**: Designed for children's motor skills

## 📸 Screenshots

### Main Game Interface
![Main Game Interface](screenshots/main-game-interface.png)
*The main game interface showing the spinning wheel, question display, and child-friendly controls*

### Language Selection
![Language Selection Modal](screenshots/language-selection-modal.png)
*Language selection modal that appears on first launch, allowing users to choose between Dutch and English*

### Question Management
![Question Management Interface](screenshots/question-management-interface.png)
*Question management interface where parents and teachers can add custom questions*

### Game in Action
![Game in Action](screenshots/game-in-action.png)
*The game showing a selected letter in the wheel's viewing window with an active question*

### English Language Mode
![English Language Mode](screenshots/english-language-mode.png)
*The complete interface in English mode, showing translated text and English questions*

## 🚀 Quick Start

### For Players
1. **Download** or clone this repository
2. **Open** `index.html` in any modern web browser
3. **Choose** your language (Dutch or English)
4. **Click** "New Game" to start playing
5. **Spin** the wheel and think of words!

### For Developers
```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd pim-pam-pet-word-game

# Open in your preferred code editor
code .

# Serve locally (optional)
# Any local server will work, or simply open index.html directly
```

## 🏗️ Technical Implementation

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: CSS Grid/Flexbox for responsive layout
- **Animations**: CSS transitions and JavaScript-controlled animations
- **Storage**: Browser Local Storage for persistence
- **Deployment**: Static files - no server required

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Game Logic    │    │   Data Layer    │
│     Layer       │◄──►│     Layer       │◄──►│                 │
│                 │    │                 │    │                 │
│ - UI Components │    │ - Wheel Logic   │    │ - Questions DB  │
│ - Animations    │    │ - Game State    │    │ - Letter Config │
│ - Event Handlers│    │ - Random Logic  │    │ - Language Data │
│ - Language UI   │    │ - Language Mgmt │    │ - Translations  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

#### GameController
- Orchestrates game flow and manages state
- Coordinates between wheel, questions, and UI
- Handles user interactions and game rounds

#### SpinningWheel
- Creates interactive letter selection mechanism
- Manages wheel animations and letter positioning
- Provides visual feedback during spinning

#### LanguageManager
- Handles language selection and switching
- Manages translations for UI elements
- Provides language-specific question banks

#### QuestionManager
- Manages question CRUD operations
- Handles custom question persistence
- Validates question content and count

#### QuestionDisplay
- Shows questions with appropriate formatting
- Manages question rotation and selection
- Supports both default and custom questions

### File Structure
```
pim-pam-pet-word-game/
├── index.html                 # Main game interface
├── css/
│   ├── main-game.css         # Core game styling
│   ├── spinning-wheel.css    # Wheel component styles
│   ├── question-management.css # Question editor styles
│   └── language-selection.css # Language UI styles
├── js/
│   ├── GameController.js     # Main game orchestration
│   ├── SpinningWheel.js      # Wheel component logic
│   ├── LanguageManager.js    # Language handling
│   ├── QuestionManager.js    # Question CRUD operations
│   ├── QuestionDisplay.js    # Question presentation
│   ├── QuestionManagementUI.js # Question editor UI
│   ├── LanguageSelectionUI.js # Language selection UI
│   └── ErrorHandler.js       # Error handling utilities
├── screenshots/              # Visual documentation
│   ├── README.md            # Screenshot documentation
│   ├── screenshot-guide.html # Interactive screenshot guide
│   ├── main-game-interface.png # Main game interface
│   ├── language-selection-modal.png # Language selection
│   ├── question-management-interface.png # Question management
│   ├── game-in-action.png   # Game with selected letter
│   └── english-language-mode.png # English interface
└── tests/                    # Test files and utilities
```

## 🎨 Design Principles

### Child-Friendly Interface
- **Bright Colors**: Engaging color scheme with high contrast
- **Large Elements**: Easy-to-click buttons and clear visual hierarchy
- **Simple Navigation**: Intuitive flow with minimal complexity
- **Immediate Feedback**: Visual responses to all interactions

### Educational Focus
- **Age-Appropriate Content**: Questions suitable for 7-year-olds
- **Vocabulary Building**: Categories that expand word knowledge
- **Cultural Relevance**: Content appropriate for Dutch-speaking children
- **Progressive Learning**: Varied difficulty through different categories

### Technical Excellence
- **Performance**: Smooth animations on various devices
- **Compatibility**: Works on modern browsers without plugins
- **Accessibility**: WCAG guidelines compliance
- **Maintainability**: Clean, documented code structure

## 🌐 Browser Compatibility

### Supported Browsers
- **Chrome** 60+ (recommended)
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+

### Graceful Degradation
- Fallback mechanisms for older browsers
- Static letter selection if animations fail
- Basic functionality maintained without modern features

## 🎯 Usage Guide

### For Children
1. **Start**: Click "New Game" to begin
2. **Read**: Look at the question that appears
3. **Spin**: Click "Spin the Wheel!" to get your letter
4. **Think**: Come up with a word that starts with your letter and fits the category
5. **Play Again**: Click "New Game" for another round

### For Parents/Teachers
1. **Customize**: Use "Manage Questions" to add your own questions
2. **Language**: Switch between Dutch and English as needed
3. **Monitor**: Questions are age-appropriate and educational
4. **Extend**: Add questions related to current learning topics

### Question Management
- **Add**: Click "Add Question" to create new questions
- **Edit**: Click the edit button next to any question
- **Delete**: Remove questions with the delete button (minimum 5 required)
- **Save**: Changes are automatically saved to your browser

## 🔧 Development

### Local Development
```bash
# No build process required - edit files directly
# Open index.html in browser to test changes
# Use browser developer tools for debugging
```

### Adding Features
1. **New Components**: Follow the existing class-based structure
2. **Styling**: Add CSS to appropriate files in the css/ directory
3. **Translations**: Update the LanguageManager translations object
4. **Questions**: Modify question banks in LanguageManager

### Testing
- **Manual Testing**: Open index.html and test functionality
- **Browser Testing**: Test across different browsers and devices
- **Accessibility Testing**: Use screen readers and keyboard navigation
- **Performance Testing**: Check animations on various hardware

## 🤝 Contributing

We welcome contributions to improve the game! Here's how you can help:

### Adding Screenshots
- Use the `screenshots/screenshot-guide.html` for detailed instructions
- Capture screenshots at 1200px+ width for clarity
- Include all UI elements mentioned in the guide
- Save as PNG format for best quality
- Follow the naming conventions in `screenshots/README.md`

### Adding Questions
- Questions should be appropriate for 7-year-olds
- Use simple, clear language
- Focus on familiar categories (animals, food, toys, etc.)
- Ensure questions work in both Dutch and English

### Improving Translations
- Check existing translations for accuracy
- Add support for additional languages
- Ensure cultural appropriateness

### Code Contributions
- Follow the existing code style and structure
- Add comments for complex functionality
- Test changes across different browsers
- Maintain accessibility standards

### Visual Documentation
- Update screenshots when interface changes
- Maintain consistent visual style
- Include alt text for accessibility
- Document new features with appropriate visuals

## 📝 License

This project is open source and available under the MIT License. Feel free to use, modify, and distribute as needed for educational purposes.

## 🙏 Acknowledgments

- Inspired by the classic Dutch "Pim Pam Pet" word game
- Designed with input from educators and child development specialists
- Built with accessibility and inclusion in mind

---

**Have fun playing and learning with Pim Pam Pet!** 🎉

For questions, suggestions, or issues, please feel free to open an issue or contribute to the project.