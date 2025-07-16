# Screenshots and Visual Documentation

This directory contains screenshots and visual documentation for the Pim Pam Pet Dutch Word Game.

## Required Screenshots

### 1. Main Game Interface (`main-game-interface.png`)
**Description**: Screenshot of the main game interface showing the spinning wheel and question display
**Elements to capture**:
- Game title "Nederlands Woordspel" at the top
- Language toggle button (showing "English" when in Dutch mode)
- "Beheer Vragen" (Manage Questions) button
- Question display area showing a sample question like "Noem een fruit"
- Spinning wheel with letters visible
- Small viewing window on the wheel
- "Draai het Wiel!" (Spin the Wheel) button
- "Nieuw Spel" (New Game) button
- Round counter display
- Child-friendly color scheme and large buttons

**How to capture**:
1. Open `index.html` in a web browser
2. Select Dutch language if prompted
3. Click "Nieuw Spel" to start a game
4. Take screenshot showing the complete interface

### 2. Language Selection Modal (`language-selection-modal.png`)
**Description**: Screenshot of the language selection dialog that appears on first launch
**Elements to capture**:
- Modal overlay with semi-transparent background
- Language selection dialog box
- "Choose Your Language" or equivalent text
- "Nederlands" button with Dutch flag or text
- "English" button with English flag or text
- Clean, centered modal design

**How to capture**:
1. Clear browser local storage to reset language preference
2. Open `index.html` in a web browser
3. Take screenshot when language selection modal appears
4. Alternatively, inspect the LanguageSelectionUI component code to trigger the modal

### 3. Question Management Interface (`question-management-interface.png`)
**Description**: Screenshot of the question management interface with visual examples
**Elements to capture**:
- Question management modal or interface
- List of existing questions (both default and custom)
- "Add Question" form with input field
- Edit and delete buttons for each question
- Question validation messages if any
- "Save" and "Cancel" buttons
- Dutch interface text

**How to capture**:
1. Open the game in Dutch mode
2. Click "Beheer Vragen" button
3. Add a sample custom question to show the interface in action
4. Take screenshot showing the complete question management interface

### 4. Game in Action (`game-in-action.png`)
**Description**: Screenshot showing the game with a selected letter displayed
**Elements to capture**:
- Active game state with a question displayed
- Spinning wheel showing a selected letter in the viewing window
- Letter clearly visible (e.g., "M" or "B")
- Question like "Noem een dier" (Name an animal)
- Buttons in their active/disabled states as appropriate
- Visual indication that the wheel has stopped spinning
- Any result or feedback text

**How to capture**:
1. Start a new game
2. Click "Draai het Wiel!" to spin
3. Wait for wheel to stop and show selected letter
4. Take screenshot showing the result state

### 5. English Language Mode (`english-language-mode.png`)
**Description**: Screenshot showing the game interface in English
**Elements to capture**:
- Game title "Dutch Word Game" in English
- English question like "Name a fruit"
- "Spin the Wheel!" button text
- "New Game" button text
- "Manage" button text
- Language toggle showing "Nederlands"
- Same visual layout but with English text

**How to capture**:
1. Switch to English language mode
2. Start a new game
3. Take screenshot showing English interface

## Screenshot Specifications

### Technical Requirements
- **Format**: PNG for best quality and transparency support
- **Resolution**: Minimum 1200px width for desktop screenshots
- **Quality**: High resolution, clear text, no compression artifacts
- **Browser**: Use Chrome or Firefox for consistent rendering
- **Window Size**: Standard desktop size (1920x1080 or similar)

### Visual Guidelines
- Ensure all text is clearly readable
- Capture the full interface without browser chrome (address bar, etc.)
- Use consistent lighting and contrast
- Show the interface in a realistic usage scenario
- Include mouse cursor if it adds context

### File Naming Convention
- Use descriptive, lowercase names with hyphens
- Include version numbers if multiple iterations exist
- Examples: `main-game-interface-v1.png`, `language-modal-dutch.png`

## Usage in Documentation

These screenshots will be used in:
1. **README.md** - Main project documentation
2. **GitHub repository** - Project showcase
3. **Educational materials** - For teachers and parents
4. **Development documentation** - For contributors

## Updating Screenshots

When updating the game interface:
1. Review existing screenshots for accuracy
2. Retake screenshots that show outdated interface elements
3. Update this documentation if new screenshot types are needed
4. Maintain consistent visual style across all screenshots

## Alternative Documentation Methods

If screenshots cannot be taken directly:
1. **Browser Developer Tools**: Use device emulation for consistent sizing
2. **Screen Recording**: Create GIFs showing interactions
3. **Component Documentation**: Document visual elements in code comments
4. **Mockups**: Create visual representations of the interface

## Accessibility Considerations

When documenting visuals:
- Include alt text descriptions for all images
- Document color schemes and contrast ratios
- Note accessibility features visible in screenshots
- Describe interactive elements and their states