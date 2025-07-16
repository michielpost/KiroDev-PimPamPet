# Design Document

## Overview

The Dutch Word Game is a web-based educational game that recreates the "Pim Pam Pet" experience for 7-year-old children. The game features a spinning wheel mechanism for letter selection, a curated set of questions in both Dutch and English, and a child-friendly interface designed to encourage vocabulary learning through play.

The application will be built as a single-page web application using HTML5, CSS3, and JavaScript, ensuring broad compatibility and easy deployment. The design emphasizes visual appeal, intuitive interaction, and educational value while maintaining simplicity appropriate for young children. The game supports full internationalization with language selection and switching capabilities.

## Architecture

### System Architecture
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

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript (ES6+)
- **Styling**: CSS Grid/Flexbox for responsive layout
- **Animations**: CSS transitions and JavaScript-controlled animations
- **Storage**: Browser Local Storage for question persistence
- **Deployment**: Static files - no server required, runs directly from HTML file

## Components and Interfaces

### 1. Game Container Component
- **Purpose**: Main application wrapper and layout manager
- **Responsibilities**: 
  - Initialize game state
  - Coordinate between child components
  - Handle responsive layout

### 2. Spinning Wheel Component
- **Purpose**: Interactive letter selection mechanism
- **Key Features**:
  - Circular wheel with 22 letter segments (excluding c, x, q, y)
  - Small viewing window that reveals only the selected letter
  - Smooth spinning animation with realistic deceleration
  - Visual feedback during interaction

**Interface**:
```javascript
class SpinningWheel {
  constructor(containerId, letters)
  spin() // Triggers wheel animation
  getSelectedLetter() // Returns current letter
  reset() // Prepares for next spin
}
```

### 3. Question Display Component
- **Purpose**: Shows Dutch questions and manages question rotation
- **Key Features**:
  - Large, readable text display
  - Question bank management
  - Random question selection without immediate repeats

**Interface**:
```javascript
class QuestionDisplay {
  constructor(containerId, questions)
  showRandomQuestion() // Displays new question
  getCurrentQuestion() // Returns active question
  getQuestionBank() // Returns all available questions
}
```

### 6. Question Manager Component
- **Purpose**: Handles CRUD operations for custom questions
- **Key Features**:
  - Add, edit, delete custom questions
  - Validate question content
  - Persist questions to local storage
  - Ensure minimum question count

**Interface**:
```javascript
class QuestionManager {
  constructor()
  addQuestion(questionText) // Adds new question
  editQuestion(index, newText) // Modifies existing question
  deleteQuestion(index) // Removes question
  getAllQuestions() // Returns current question list
  saveQuestions() // Persists to storage
  loadQuestions() // Loads from storage
}
```

### 7. Question Management UI Component
- **Purpose**: Provides user interface for question management
- **Key Features**:
  - Modal or dedicated page for question management
  - Form inputs for adding/editing questions
  - List view of all questions
  - Delete confirmation dialogs

**Interface**:
```javascript
class QuestionManagementUI {
  constructor(containerId, questionManager)
  showManagementInterface() // Opens question management UI
  hideManagementInterface() // Closes management UI
  refreshQuestionList() // Updates displayed questions
  handleFormSubmission() // Processes add/edit forms
}
```

### 4. Game Controller Component
- **Purpose**: Orchestrates game flow and state management
- **Key Features**:
  - Round management
  - User interaction coordination
  - Game state persistence

**Interface**:
```javascript
class GameController {
  startNewRound() // Begins new game round
  handleSpin() // Processes wheel spin action
  resetGame() // Returns to initial state
}
```

### 5. UI Animation Manager
- **Purpose**: Handles all visual animations and transitions
- **Key Features**:
  - Wheel spinning animations
  - Button press feedback
  - Smooth transitions between states

### 8. Language Manager Component
- **Purpose**: Manages language selection, switching, and translations
- **Key Features**:
  - Language selection on app startup
  - Persistent language preference storage
  - Real-time language switching
  - Translation management for UI elements

**Interface**:
```javascript
class LanguageManager {
  constructor()
  getCurrentLanguage() // Returns active language code
  setLanguage(languageCode) // Changes active language
  getTranslation(key) // Returns translated text
  getQuestions() // Returns questions in current language
  showLanguageSelector() // Displays language selection UI
}
```

### 9. Language Selection UI Component
- **Purpose**: Provides interface for initial language selection and switching
- **Key Features**:
  - Modal dialog for initial language choice
  - Language toggle button in main interface
  - Visual language indicators (flags or text)

**Interface**:
```javascript
class LanguageSelectionUI {
  constructor(containerId, languageManager)
  showInitialSelection() // Shows startup language choice
  showLanguageSwitcher() // Displays in-game language toggle
  handleLanguageChange(language) // Processes language selection
}
```

## Data Models

### Letter Configuration
```javascript
const GAME_LETTERS = [
  'a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 
  'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'z'
];
```

### Question Bank Structure
```javascript
const DUTCH_QUESTIONS = [
  "Noem een fruit", // Name a fruit
  "Noem iets wat je meeneemt in de auto", // Name something you take in the car
  "Noem een dier", // Name an animal
  "Noem iets wat je op school gebruikt", // Name something you use at school
  "Noem een kleur", // Name a color
  "Noem iets wat je kunt eten", // Name something you can eat
  "Noem een speelgoed", // Name a toy
  "Noem iets in de keuken", // Name something in the kitchen
  "Noem een kledingstuk", // Name a piece of clothing
  "Noem iets wat kan vliegen", // Name something that can fly
  "Noem een bloem", // Name a flower
  "Noem iets wat je in de badkamer vindt", // Name something you find in the bathroom
  "Noem een voertuig", // Name a vehicle
  "Noem iets wat groot is", // Name something that is big
  "Noem iets wat klein is", // Name something that is small
  "Noem een beroep", // Name a profession
  "Noem iets wat je kunt drinken", // Name something you can drink
  "Noem een muziekinstrument", // Name a musical instrument
  "Noem iets wat je in de tuin vindt", // Name something you find in the garden
  "Noem een lichaamsdeel" // Name a body part
];

const ENGLISH_QUESTIONS = [
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
];
```

### Language Data Model
```javascript
const TRANSLATIONS = {
  dutch: {
    gameTitle: "Pim Pam Pet Woordspel",
    spinButton: "DRAAI HET WIEL!",
    newGameButton: "NIEUW SPEL",
    manageButton: "BEHEER",
    languageButton: "English",
    tryAgain: "Probeer opnieuw!"
  },
  english: {
    gameTitle: "Pim Pam Pet Word Game",
    spinButton: "SPIN THE WHEEL!",
    newGameButton: "NEW GAME",
    manageButton: "MANAGE",
    languageButton: "Nederlands",
    tryAgain: "Try again!"
  }
};

const QUESTION_BANKS = {
  dutch: DUTCH_QUESTIONS,
  english: ENGLISH_QUESTIONS
};
```

### Game State Model
```javascript
const gameState = {
  currentQuestion: null,
  selectedLetter: null,
  isSpinning: false,
  roundNumber: 0,
  usedQuestions: [],
  currentLanguage: 'dutch' // Default language
};
```

### Question Storage Model
```javascript
const questionStorage = {
  getDefaultQuestions(language) {
    return QUESTION_BANKS[language] || QUESTION_BANKS.dutch;
  },
  customQuestions: {
    dutch: [],
    english: []
  },
  getAllQuestions(language) {
    const defaults = this.getDefaultQuestions(language);
    const customs = this.customQuestions[language] || [];
    return [...defaults, ...customs];
  }
};
```

## User Interface Design

### Layout Structure
```
┌─────────────────────────────────────┐
│            Game Title               │
│  [English]              [BEHEER]   │
│ (Language)             (Manage)     │
├─────────────────────────────────────┤
│                                     │
│         Question Display            │
│      "Noem een fruit"               │
│                                     │
├─────────────────────────────────────┤
│                                     │
│        Spinning Wheel               │
│     ┌─────┐                        │
│     │  ?  │ ← Small window          │
│     └─────┘                        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      [DRAAI HET WIEL!]             │
│       (Spin the Wheel!)             │
│                                     │
│      [NIEUW SPEL]                  │
│       (New Game)                    │
│                                     │
└─────────────────────────────────────┘
```

### Language Selection Modal
```
┌─────────────────────────────────────┐
│                                     │
│        Choose Your Language         │
│                                     │
│         [Nederlands]                │
│                                     │
│         [English]                   │
│                                     │
└─────────────────────────────────────┘
```

### Color Scheme
- **Primary Colors**: Bright, cheerful colors (blues, greens, yellows)
- **Accent Colors**: Orange and red for interactive elements
- **Background**: Light, warm colors to create a welcoming atmosphere
- **Text**: High contrast dark colors for readability

### Typography
- **Headers**: Large, rounded, friendly fonts (like Comic Sans or similar child-friendly typeface)
- **Body Text**: Clear, sans-serif fonts with generous sizing (minimum 18px)
- **Buttons**: Bold, uppercase text for clear action indication

## Error Handling

### Wheel Spinning Errors
- **Issue**: Wheel animation fails or gets stuck
- **Handling**: Reset wheel to initial position and allow re-spin
- **User Feedback**: Simple message "Probeer opnieuw!" (Try again!)

### Question Loading Errors
- **Issue**: Question bank fails to load or becomes empty
- **Handling**: Fallback to hardcoded question set
- **User Feedback**: Game continues seamlessly

### Browser Compatibility Issues
- **Issue**: Animations not supported in older browsers
- **Handling**: Graceful degradation to static letter selection
- **User Feedback**: Game remains functional without animations

## Testing Strategy

### Unit Testing
- **Wheel Logic**: Test letter selection randomization and distribution
- **Question Management**: Verify random selection without immediate repeats
- **Game State**: Ensure proper state transitions and data persistence

### Integration Testing
- **Component Interaction**: Test communication between wheel, questions, and controller
- **Animation Coordination**: Verify smooth transitions between game states
- **User Flow**: Test complete game rounds from start to finish

### User Experience Testing
- **Child Usability**: Test with target age group for intuitive interaction
- **Visual Appeal**: Verify colors and animations are engaging
- **Performance**: Ensure smooth operation on various devices and browsers

### Accessibility Testing
- **Visual**: High contrast ratios for text readability
- **Motor Skills**: Large click targets appropriate for children
- **Cognitive Load**: Simple, clear instructions and feedback

### Browser Testing
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Devices**: Responsive design testing on tablets and phones
- **Performance**: Smooth animations across different hardware capabilities

### Language Testing
- **Translation Accuracy**: Verify all UI elements translate correctly
- **Language Switching**: Test seamless language transitions during gameplay
- **Question Banks**: Ensure both Dutch and English questions display properly
- **Persistence**: Verify language preference is saved and restored

## Documentation Requirements

### README.md Structure
The project will include a comprehensive README.md file with the following sections:

#### Project Overview
- Clear description of the "Pim Pam Pet" word game concept
- Educational purpose and target age group (7-year-olds)
- Key features including spinning wheel, questions, and language support

#### Game Features
- Spinning wheel letter selection mechanism
- 20 built-in questions in both Dutch and English
- Custom question management system
- Language selection and switching
- Child-friendly interface design

#### Technical Implementation
- Technology stack (HTML5, CSS3, Vanilla JavaScript)
- Architecture overview with component descriptions
- Browser compatibility information
- No server requirements - runs as static files

#### Setup and Usage
- Simple installation instructions (download and open index.html)
- How to play the game
- How to manage custom questions
- How to switch languages

#### Screenshots
- Main game interface showing spinning wheel and question
- Language selection modal
- Question management interface
- Game in action with selected letter displayed

#### Development Information
- Project structure explanation
- Component architecture overview
- How the spinning wheel animation works
- Question randomization logic
- Language management system

#### Contributing
- Guidelines for adding new questions
- How to contribute translations
- Code style and structure guidelines

The README will be written in clear, professional language suitable for both developers and educators who might want to use or modify the game.