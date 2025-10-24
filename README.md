# Dynamic Character Memory & Relationship Tracker

A SillyTavern extension that intelligently tracks character relationships, emotional states, and significant events to create more consistent and immersive roleplay experiences.

## Features

### 🧠 Intelligent Memory Tracking
- **Automatic Memory Extraction**: Uses AI to analyze messages and extract significant events, revelations, and character moments
- **Importance Scoring**: Automatically prioritizes memories based on their significance
- **Smart Memory Management**: Keeps the most important memories while managing context window efficiently
- **Keyword Tagging**: Automatically tags memories with relevant keywords for easy searching

### 💕 Relationship Dynamics
- **Relationship Tracking**: Monitors how relationships between characters evolve over time
- **Visual Relationship Levels**: See relationship status at a glance with color-coded progress bars
- **Relationship History**: Track every significant change in character relationships
- **Multiple Relationship Types**: Track different types of relationships (friendship, romance, rivalry, etc.)

### 📅 Timeline View
- **Event Timeline**: Visualize your story's progression chronologically
- **Importance Markers**: Significant events are highlighted on the timeline
- **Quick Navigation**: Jump directly to any event in your chat history
- **Story Arc Tracking**: See how your narrative develops over time

### 😊 Emotional Context
- **Emotional State Tracking**: Monitor character emotional states throughout the conversation
- **Emotional History**: View how emotions change over time
- **Context-Aware Injection**: Automatically includes relevant emotional context in prompts
- **Emotional Decay**: Old emotional states naturally fade over time

### ⚙️ Flexible Configuration
- **Three Tracking Depths**: Choose between Basic, Detailed, or Comprehensive analysis
- **Adjustable Memory Limits**: Control how many memories to keep (10-100)
- **Auto-Injection Toggle**: Enable/disable automatic memory injection
- **Notification System**: Get alerts for significant story moments

## Installation

### Method 1: Via SillyTavern UI (Recommended)
1. Open SillyTavern
2. Click on the Extensions menu (stacked blocks icon)
3. Click on "Download Extensions & Assets"
4. Click "Load Asset List"
5. Find "Dynamic Character Memory & Relationship Tracker" and click Download

### Method 2: Manual Installation
1. Download this repository as a ZIP file
2. Extract the ZIP file
3. Copy the `dynamic-memory-tracker` folder to your SillyTavern installation:
   - **For all users**: `SillyTavern/public/scripts/extensions/third-party/`
   - **For current user**: `SillyTavern/data/<your-user-handle>/extensions/`
4. Restart SillyTavern or reload the page

## Usage

### 🔄 Using with Existing Chats

**Already in the middle of a great RP?** No problem! See the **[Existing Chats Guide](EXISTING-CHATS.md)** for detailed instructions on retroactively analyzing your chat history.

**Quick version:**
1. Click "Analyze Existing Chat" button
2. Wait for processing (shows progress)
3. Review extracted memories
4. Continue chatting with full context!

### Getting Started

1. **Enable the Extension**
   - Open the Extensions panel
   - Scroll down to "Dynamic Memory Tracker"
   - Check "Enable Memory Tracking"

2. **Configure Settings**
   - Choose your tracking depth (Basic, Detailed, or Comprehensive)
   - Set maximum memory entries (default: 50)
   - Enable auto-injection for automatic memory context
   - Enable notifications for important moments

3. **Start Chatting**
   - The extension will automatically analyze messages as you chat
   - Memories are extracted and stored in the background
   - Important moments trigger notifications (if enabled)

### Viewing Memories

#### Using the UI
- Click "View Memories" button in the extension settings
- Browse through all recorded memories
- Filter by emotion or search by keyword
- See importance ratings and keywords for each memory

#### Using Slash Commands
```
/memory-view - Opens the memories panel
/memory-relationships - Opens the relationships panel
/memory-timeline - Opens the timeline view
/memory-analyze - Analyzes all existing messages (catch-up for ongoing chats)
/memory-export - Exports all memory data to JSON
```

### Understanding the Interface

#### Memories Tab
- **Star Rating**: Shows importance (1-5 stars)
- **Emotion Badge**: Displays the emotional tone
- **Timestamp**: When the memory was recorded
- **Summary**: AI-generated summary of the event
- **Continuity Notes**: Important things to remember for later
- **Keywords**: Searchable tags

#### Relationships Tab
- **Relationship Levels**: -100% (very negative) to +100% (very positive)
- **Color Coding**: 
  - 🟢 Green: Positive relationships
  - 🔴 Red: Negative relationships
  - ⚪ Gray: Neutral relationships
- **History**: Recent changes to the relationship

#### Timeline Tab
- **Chronological Order**: Events displayed from oldest to newest
- **Importance Markers**: Larger markers for more significant events
- **Jump to Message**: Click any event to scroll to that point in the chat

## Configuration Options

### Tracking Depth

**Basic**
- Quick extraction of main events and facts
- Lower token usage
- Best for casual chats or limited API budgets

**Detailed** (Recommended)
- Comprehensive extraction including emotions and relationships
- Balanced token usage
- Best for most roleplay scenarios

**Comprehensive**
- Deep analysis including subtext, contradictions, and character development
- Higher token usage
- Best for complex, long-term stories

### Memory Management

- **Max Memory Entries**: Controls how many memories to keep
  - Older, less important memories are automatically pruned
  - Important memories are always kept regardless of age
  
- **Auto-Injection**: When enabled, relevant memories are automatically added to the context
  - Only the most relevant memories are injected
  - Helps maintain consistency without manual work

### Notifications

When enabled, you'll receive notifications for:
- High-importance events (>70% importance)
- Significant relationship changes
- Important revelations or secrets

## How It Works

### Memory Extraction Process

1. **Message Analysis**: Each message is analyzed using your selected LLM
2. **Information Extraction**: The AI identifies:
   - Key events and facts
   - Emotional context
   - Character development
   - Relationship changes
   - Important revelations
3. **Scoring**: Assigns importance score (0.0 - 1.0)
4. **Storage**: Saves to chat metadata
5. **Context Injection**: Relevant memories are injected into prompts (if enabled)

### Relationship Tracking

- Monitors mentions of relationship dynamics
- Detects positive/negative changes
- Maintains historical record
- Updates relationship level (-1.0 to +1.0)

### Timeline Construction

- Records significant events in chronological order
- Links to specific messages
- Allows navigation through story progression

## Data Storage

All data is stored in your chat's metadata file and persists across sessions:
- Location: `SillyTavern/data/<user>/chats/<chat-name>.jsonl`
- Format: JSON
- Exportable: Use the Export button or `/memory-export` command

## Performance Considerations

### Token Usage

The extension uses tokens for memory extraction:
- **Basic**: ~150-300 tokens per message
- **Detailed**: ~300-500 tokens per message
- **Comprehensive**: ~500-800 tokens per message

These extractions happen in the background using quiet prompts, so they don't interrupt your RP flow.

### Optimization Tips

1. Use Basic tracking for everyday chats
2. Use Detailed for important story moments
3. Use Comprehensive for climactic scenes
4. Lower the max memory entries if you notice slowdowns
5. Disable auto-injection if you prefer manual memory management

## Troubleshooting

### Extension Not Loading
- Check that `enableExtensions` is set to `true` in `config.yaml`
- Verify the extension folder is in the correct location
- Check browser console for error messages (F12)

### Memories Not Being Created
- Ensure the extension is enabled in settings
- Check that your API is properly configured
- Verify your API supports JSON schema/structured outputs
- Try increasing tracking depth

### Performance Issues
- Reduce max memory entries
- Lower tracking depth
- Disable auto-injection
- Clear old memories from completed stories

### Memory Panel Not Opening
- Check browser console for errors
- Try reloading the page
- Ensure jQuery is loaded (should be automatic)

## Compatibility

- **Minimum SillyTavern Version**: 1.12.0
- **Recommended Version**: Latest release
- **Compatible APIs**: 
  - ✅ OpenAI (GPT-4, GPT-3.5)
  - ✅ Anthropic Claude (all models)
  - ✅ Any API with JSON schema support
  - ⚠️ Limited support for APIs without structured outputs

## Future Features (Planned)

- [ ] Character-specific memory profiles
- [ ] Memory search with advanced filters
- [ ] Export to various formats (Markdown, CSV)
- [ ] Import memories from other sources
- [ ] Memory conflict detection
- [ ] Customizable memory templates
- [ ] Integration with World Info
- [ ] Automatic memory summarization
- [ ] Multi-character relationship graphs
- [ ] Memory sharing between chats

## Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## License

This extension is released under the AGPL-3.0 license.

## Credits

Created by AI Assistant for the SillyTavern community.

Special thanks to:
- The SillyTavern development team
- The SillyTavern community for feedback and ideas

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Join the SillyTavern Discord
- Check the SillyTavern documentation

## Changelog

### Version 1.1.0 (2025-10-23)
- Added "Analyze Existing Chat" feature for retroactive analysis
- Added `/memory-analyze` slash command
- Added progress indicator for batch analysis
- Added smart skip for already-analyzed messages
- Added EXISTING-CHATS.md guide for mid-chat adoption
- Improved error handling during analysis
- Better API rate limit handling with batching

### Version 1.0.0 (2025-10-23)
- Initial release
- Core memory tracking functionality
- Relationship dynamics system
- Timeline view
- Three tracking depth modes
- Export functionality
- Slash command support
- Customizable settings

---

**Note**: This extension requires an API that supports structured outputs (JSON schema) for optimal functionality. It will work with any modern LLM API but results may vary.
