# Development & Contributing Guide

## Project Structure

```
dynamic-memory-tracker/
├── manifest.json       # Extension metadata and configuration
├── index.js           # Main extension logic
├── style.css          # All styling for the UI
├── README.md          # User documentation
├── INSTALL.md         # Installation guide
├── LICENSE            # AGPL-3.0 license
├── example-data.json  # Example data structure
└── CONTRIBUTING.md    # This file
```

## Architecture Overview

### Main Components

1. **Settings Management**
   - Loads/saves extension settings
   - Uses SillyTavern's `extensionSettings` object
   - Persists via `saveSettingsDebounced()`

2. **Event System**
   - Listens to SillyTavern events (MESSAGE_RECEIVED, MESSAGE_SENT, etc.)
   - Triggers memory extraction and updates
   - Maintains consistency across chat changes

3. **Memory Extraction**
   - Uses AI to analyze messages
   - Extracts structured data via JSON schema
   - Stores in chat metadata

4. **UI System**
   - Settings panel in Extensions menu
   - Full-screen memory panel with tabs
   - Real-time filtering and search

5. **Data Storage**
   - All data stored in `chatMetadata.memoryTracker`
   - Persists automatically via `saveMetadata()`
   - Exportable as JSON

## Development Setup

### Prerequisites
- SillyTavern development environment
- Basic JavaScript knowledge
- Understanding of SillyTavern's extension API

### Local Development

1. **Clone/Download the Extension**
   ```bash
   cd SillyTavern/public/scripts/extensions/third-party/
   # Clone or copy the extension here
   ```

2. **Enable Developer Mode**
   - Open browser developer tools (F12)
   - Set breakpoints as needed
   - Monitor console for errors

3. **Hot Reload**
   - SillyTavern reloads extensions on page refresh
   - Make changes to files
   - Refresh the page to test

### Testing

1. **Manual Testing**
   - Enable the extension
   - Start a chat
   - Verify memories are created
   - Test each UI component
   - Try all slash commands

2. **Browser Console Testing**
   ```javascript
   // Access extension data
   const ctx = SillyTavern.getContext();
   const memories = ctx.chatMetadata.memoryTracker;
   console.log(memories);
   
   // Test functions directly
   // (Make sure to expose them for testing if needed)
   ```

3. **Edge Cases to Test**
   - Empty chats
   - Very long chats
   - Chat switching
   - Memory limits
   - API failures
   - Invalid JSON responses

## Code Style

### JavaScript
- Use modern ES6+ features
- Use `const` and `let` (no `var`)
- Async/await for promises
- Descriptive variable names
- JSDoc comments for functions

### CSS
- Use CSS custom properties for theming
- Maintain compatibility with SillyTavern themes
- Mobile-responsive design
- Smooth transitions

### Example Function Documentation
```javascript
/**
 * Extract memory data from a message using AI
 * @param {Object} message - The message object from chat
 * @param {string} source - Either 'user' or 'character'
 * @returns {Promise<Object|null>} Memory data or null if extraction fails
 */
async function extractMemoryFromMessage(message, source) {
    // Implementation
}
```

## Adding New Features

### Adding a New Memory Type

1. Update the `extractMemoryFromMessage` JSON schema:
```javascript
const jsonSchema = {
    // ... existing schema
    properties: {
        // ... existing properties
        yourNewField: {
            type: 'string',
            description: 'Description of your field'
        }
    }
};
```

2. Update the UI to display it:
```javascript
// In renderMemories()
const memoryHtml = `
    // ... existing HTML
    ${memory.yourNewField ? `<div>${memory.yourNewField}</div>` : ''}
`;
```

3. Update the example data file
4. Document it in README.md

### Adding a New UI Tab

1. Add tab button in `createUI()`:
```javascript
<button class="memory-tracker-tab" data-tab="yourtab">Your Tab</button>
```

2. Add tab content:
```javascript
<div id="memory-tracker-tab-yourtab" class="memory-tracker-tab-content">
    <!-- Your content -->
</div>
```

3. Add render function:
```javascript
function renderYourTab() {
    const yourTabView = $('#yourtab-view');
    // Render your content
}
```

4. Update `switchTab()` function

### Adding a New Slash Command

```javascript
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: 'memory-yourcommand',
    callback: (args, value) => {
        // Your command logic
        return 'Result message';
    },
    namedArgumentList: [
        SlashCommandNamedArgument.fromProps({
            name: 'yourarg',
            description: 'Description',
            typeList: ARGUMENT_TYPE.STRING,
            isRequired: false,
        }),
    ],
    helpString: 'Description of what your command does',
}));
```

## API Integration

### Using SillyTavern Context

```javascript
const context = SillyTavern.getContext();

// Access chat data
const chat = context.chat;
const currentMessage = chat[chat.length - 1];

// Access character info
const characterName = context.name2;
const characterId = context.characterId;

// Access settings
const extensionSettings = context.extensionSettings;

// Generate AI responses
const result = await context.generateQuietPrompt({
    quietPrompt: 'Your prompt here',
    jsonSchema: yourSchema // optional
});
```

### Event Handling

```javascript
const { eventSource, event_types } = SillyTavern.getContext();

// Listen to events
eventSource.on(event_types.MESSAGE_RECEIVED, (data) => {
    // Handle event
});

// Emit custom events
await eventSource.emit('myCustomEvent', { data: 'value' });
```

## Performance Optimization

### Tips for Efficient Memory Usage

1. **Limit AI Calls**
   - Only extract memories when needed
   - Cache results when possible
   - Use appropriate tracking depth

2. **Optimize Data Storage**
   - Trim old memories regularly
   - Use importance scoring to keep best memories
   - Compress data where possible

3. **UI Optimization**
   - Lazy load memory lists
   - Virtualize long lists
   - Debounce search/filter operations

## Debugging

### Common Issues

**Extension not loading:**
- Check console for errors
- Verify manifest.json is valid JSON
- Check file paths are correct

**Memories not being created:**
- Verify API supports structured outputs
- Check extraction prompt is working
- Look for JSON parsing errors

**UI not updating:**
- Check event listeners are attached
- Verify DOM elements exist
- Look for jQuery errors

### Debug Helpers

```javascript
// Add to your code temporarily
console.log('[DMT Debug]', variable);

// Check if functions exist
console.log('Function exists:', typeof yourFunction);

// Monitor metadata changes
const ctx = SillyTavern.getContext();
setInterval(() => {
    console.log('Memories:', ctx.chatMetadata?.memoryTracker?.memories?.length || 0);
}, 5000);
```

## Submitting Changes

### Before Submitting

1. Test all functionality thoroughly
2. Update documentation if needed
3. Follow the code style guidelines
4. Add comments for complex logic
5. Check for console errors/warnings

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add: YourFeature'`)
6. Push to your fork (`git push origin feature/YourFeature`)
7. Open a Pull Request

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Changes
- List of changes made
- Another change
- Etc.

## Testing
How to test these changes

## Screenshots (if applicable)
Before/after screenshots of UI changes

## Checklist
- [ ] Tested locally
- [ ] Updated documentation
- [ ] No console errors
- [ ] Follows code style
```

## Resources

### SillyTavern Resources
- [Extension Documentation](https://docs.sillytavern.app/for-contributors/writing-extensions/)
- [SillyTavern GitHub](https://github.com/SillyTavern/SillyTavern)
- [SillyTavern Discord](https://discord.gg/sillytavern)

### JavaScript Resources
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [jQuery Documentation](https://api.jquery.com/)
- [Async/Await Guide](https://javascript.info/async-await)

## License

This project is licensed under AGPL-3.0. By contributing, you agree to license your contributions under the same license.

## Questions?

- Open an issue for bugs or feature requests
- Join the SillyTavern Discord for questions
- Check existing issues before creating new ones

## Acknowledgments

Thanks to all contributors and the SillyTavern community!

---

Happy coding! 🚀
