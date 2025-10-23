# Quick Installation Guide

## Prerequisites
- SillyTavern 1.12.0 or higher
- An AI API that supports structured outputs (OpenAI, Claude, etc.)

## Installation Steps

### Step 1: Download
Download or clone this repository to get all the extension files.

### Step 2: Install to SillyTavern
Copy the entire `dynamic-memory-tracker` folder to one of these locations:

**Option A - All Users (Recommended)**
```
SillyTavern/public/scripts/extensions/third-party/dynamic-memory-tracker/
```

**Option B - Current User Only**
```
SillyTavern/data/<your-username>/extensions/dynamic-memory-tracker/
```

### Step 3: Verify Installation
After copying, your folder structure should look like this:
```
dynamic-memory-tracker/
├── manifest.json
├── index.js
├── style.css
├── README.md
├── LICENSE
├── example-data.json
└── INSTALL.md (this file)
```

### Step 4: Enable Extensions
1. Open `SillyTavern/config.yaml`
2. Find the line: `enableExtensions: false`
3. Change it to: `enableExtensions: true`
4. Save the file

### Step 5: Restart SillyTavern
1. Close SillyTavern (if running)
2. Start SillyTavern
3. The extension will load automatically

### Step 6: Configure the Extension
1. Click the Extensions icon (stacked blocks) in the top bar
2. Scroll down to find "Dynamic Memory Tracker"
3. Check "Enable Memory Tracking"
4. Configure other settings as desired
5. Start chatting!

## Verification

To verify the extension loaded correctly:

1. Open your browser's developer console (F12)
2. Look for: `[Dynamic Memory Tracker] Extension initialized`
3. If you see this message, the extension is working!

## First Use

Try these steps to see the extension in action:

1. Start a chat with any character
2. Have a conversation with some emotional moments
3. Click "View Memories" in the extension settings
4. You should see memories being tracked!

## Slash Commands

You can also use these commands in the chat:
- `/memory-view` - Open memories
- `/memory-relationships` - View relationships
- `/memory-timeline` - See the timeline
- `/memory-export` - Export your data

## Troubleshooting

**Extension not appearing?**
- Check that extensions are enabled in config.yaml
- Verify the folder is in the correct location
- Restart SillyTavern

**No memories being created?**
- Make sure "Enable Memory Tracking" is checked
- Verify your API supports structured outputs
- Check the browser console for errors

**Performance issues?**
- Lower the tracking depth to "Basic"
- Reduce max memory entries
- Disable auto-injection temporarily

## Getting Help

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Review the full README.md for detailed information
3. Open an issue on GitHub with:
   - SillyTavern version
   - Browser and version
   - Error messages from console
   - Steps to reproduce the issue

## Next Steps

Once installed, read the full README.md to learn about:
- All features and capabilities
- Configuration options
- Advanced usage tips
- Data structure and storage
- Performance optimization

Happy roleplaying! 🎭
 
