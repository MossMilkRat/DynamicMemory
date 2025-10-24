# 📦 Extension Package Summary

## What's Included

### 📄 Core Files (Required)
- **manifest.json** - Extension metadata
- **index.js** - Main functionality (39KB, ~1,100 lines)
- **style.css** - Complete styling (9KB)

### 📚 Documentation (7 files)
- **README.md** - Complete user guide
- **INSTALL.md** - Installation instructions
- **EXISTING-CHATS.md** - Mid-chat adoption guide (NEW!)
- **QUICK-REFERENCE.md** - Quick start card (NEW!)
- **CONTRIBUTING.md** - Developer guide
- **example-data.json** - Data structure reference
- **LICENSE** - AGPL-3.0

---

## 🆕 Version 1.1.0 Features

### Major Addition: Retroactive Analysis

**The Problem:** You're in the middle of a great 200-message RP and want to add memory tracking, but how does it understand what already happened?

**The Solution:** "Analyze Existing Chat" button that:
- ✅ Processes all existing messages automatically
- ✅ Extracts memories using AI analysis
- ✅ Builds complete relationship history
- ✅ Creates full timeline
- ✅ Shows progress with visual indicator
- ✅ Smart batching (avoids API rate limits)
- ✅ Skip already-analyzed messages (safe to re-run)

### How It Works

```
1. User clicks "Analyze Existing Chat"
2. Extension processes messages in batches of 5
3. For each message:
   - Sends to AI for analysis
   - Extracts structured memory data
   - Updates relationships
   - Adds to timeline
   - Shows progress
4. Saves everything to chat metadata
5. Shows completion summary
```

### Time Investment

| Chat Size | Processing Time |
|-----------|----------------|
| 50 messages | 1-5 minutes |
| 100 messages | 3-10 minutes |
| 200 messages | 6-20 minutes |
| 500 messages | 15-60 minutes |

*Depends on tracking depth and API speed*

### Cost Consideration

**Token Usage Per Message:**
- Basic: ~150-300 tokens
- Detailed: ~300-500 tokens
- Comprehensive: ~500-800 tokens

**For a 100-message chat:**
- Basic: ~15,000-30,000 tokens
- Detailed: ~30,000-50,000 tokens
- Comprehensive: ~50,000-80,000 tokens

---

## 🎯 Perfect For

### New Extension Users
- **Scenario:** Just discovered the extension mid-RP
- **Solution:** Run analysis once, get full context
- **Benefit:** Don't restart your amazing story!

### Long-Term RPs
- **Scenario:** 500+ message epic adventure
- **Solution:** Track relationships and plot threads
- **Benefit:** Never forget important details again

### Character Consistency
- **Scenario:** AI keeps forgetting key events
- **Solution:** Auto-inject relevant memories
- **Benefit:** Characters remember what matters

### Story Debugging
- **Scenario:** Something feels inconsistent
- **Solution:** Review timeline and memories
- **Benefit:** Find and fix continuity issues

---

## 📊 What You Get After Analysis

### Example Results (100-message romance RP)

**Memories Extracted:** 58
- High importance: 12 (first kiss, secret revealed, etc.)
- Medium importance: 31 (character moments, conversations)
- Low importance: 15 (small talk, descriptions)

**Relationships Tracked:** 3 types
- Romance: +67% (from neutral → positive)
- Trust: +42% (steady growth)
- Friendship: +81% (strong bond)

**Timeline Events:** 45
- Chronologically ordered
- Clickable (jump to message)
- Importance-weighted visualization

**Emotional States:** 28 tracked moments
- Current emotion: "content, hopeful"
- History of emotional changes
- Decay over time (old emotions fade)

---

## 🚀 Getting Started Workflow

### For New Chats
```
1. Install extension
2. Enable in settings
3. Start chatting
   → Memories tracked automatically
```

### For Existing Chats
```
1. Install extension
2. Enable in settings
3. Click "Analyze Existing Chat"
4. Wait for processing (grab coffee ☕)
5. Review extracted memories
6. Continue chatting
   → New messages tracked automatically
```

---

## 💡 Pro Tips from the Documentation

### Before Installing
1. Check your API supports JSON schema/structured outputs
2. Have some API credits available (for analysis)
3. Read QUICK-REFERENCE.md for fastest start

### During Analysis
1. Let it run completely (don't interrupt)
2. You can keep chatting in other windows
3. Don't switch chats mid-analysis
4. Be patient with long chats

### After Analysis
1. Review memories for accuracy
2. Enable auto-injection
3. Export data (backup!)
4. Browse relationship graphs
5. Check timeline makes sense

### Ongoing Usage
1. New messages auto-track (no re-analysis needed)
2. Search memories when needed
3. Check relationships before big scenes
4. Export periodically for backups

---

## 🔧 Technical Details

### Architecture
- **Event-driven:** Hooks into SillyTavern's message events
- **Metadata storage:** All data in chat metadata (persists)
- **AI-powered:** Uses your configured LLM for extraction
- **JSON schema:** Structured outputs ensure consistency
- **Async processing:** Non-blocking UI

### Memory Structure
```javascript
{
  summary: "Character revealed secret",
  importance: 0.95,
  emotion: "anxious, vulnerable",
  keywords: ["secret", "past", "trust"],
  relationship: { type: "trust", change: "improved" },
  continuityNote: "Affects future conversations",
  timestamp: 1729699200000,
  source: "character",
  messageIndex: 42
}
```

### Storage Location
```
SillyTavern/data/<user>/chats/<chat>.jsonl
↓
chatMetadata: {
  memoryTracker: {
    memories: [...],
    relationships: {...},
    timeline: [...],
    emotionalStates: {...}
  }
}
```

---

## 📝 File Guide

### Start Here
1. **QUICK-REFERENCE.md** - Fast 5-minute intro
2. **INSTALL.md** - Get it running
3. **EXISTING-CHATS.md** - If you have ongoing chats

### Full Documentation
4. **README.md** - Complete feature guide
5. **CONTRIBUTING.md** - For developers
6. **example-data.json** - See data structure

### Other
7. **LICENSE** - Legal stuff (AGPL-3.0)

---

## ❓ Common Questions

**Q: Do I need to re-analyze every time I chat?**  
A: No! Only once for existing messages. New messages auto-track.

**Q: Can I stop mid-analysis?**  
A: Technically yes (refresh page), but you'll lose progress. Better to finish.

**Q: What if I have 1000+ messages?**  
A: Works, but takes time. Consider processing in sections or using Basic tracking.

**Q: Does this work with group chats?**  
A: Yes, but doesn't distinguish between characters yet.

**Q: Can I edit memories manually?**  
A: Yes! Export → edit JSON → reimport, or use browser console.

**Q: How much does this cost?**  
A: Depends on API and chat size. See token estimates above.

**Q: Will this slow down my chats?**  
A: No! Analysis runs in background. During analysis, new chats still work normally.

**Q: Can I customize what gets extracted?**  
A: Yes, by editing the extraction prompts in index.js.

---

## 🎓 Learning Path

### Beginner (15 minutes)
1. Read QUICK-REFERENCE.md
2. Install the extension
3. Try with a short test chat
4. Browse the memories

### Intermediate (45 minutes)
1. Read EXISTING-CHATS.md
2. Analyze a real ongoing chat
3. Explore all three tabs (Memories, Relationships, Timeline)
4. Try different tracking depths
5. Export your data

### Advanced (2 hours)
1. Read full README.md
2. Study CONTRIBUTING.md
3. Experiment with settings
4. Try manual memory editing
5. Integrate with World Info
6. Customize extraction prompts

---

## 🏆 Key Benefits

### For Users
✨ **Never forget important story moments**  
✨ **Characters remember relationship history**  
✨ **Catch plot inconsistencies**  
✨ **Visualize story progression**  
✨ **Search memories easily**

### For Long-term RPs
✨ **Track character development**  
✨ **Monitor relationship evolution**  
✨ **Navigate complex plots**  
✨ **Maintain continuity**  
✨ **Resume old chats easily**

### For AI Quality
✨ **More consistent responses**  
✨ **Better emotional awareness**  
✨ **Remembers character details**  
✨ **Respects established facts**  
✨ **Builds on past events**

---

## 📈 Future Roadmap

Planned features (see README.md):
- Character-specific memory profiles
- Advanced search and filters
- Multi-format export
- Memory conflict detection
- World Info integration
- Memory summarization
- Group chat character distinction
- Memory sharing between chats

---

## 🤝 Contributing

Want to help improve this extension?

1. Read CONTRIBUTING.md
2. Check GitHub issues
3. Fork and make changes
4. Submit pull request
5. Join SillyTavern Discord

All contributions welcome! 🙏

---

## 📞 Support

**Need help?**
- Read the docs (you're here!)
- Check GitHub issues
- Ask in SillyTavern Discord
- Open a new issue with details

**Found a bug?**
- Check console for errors (F12)
- Note your SillyTavern version
- Document steps to reproduce
- Open GitHub issue

---

## ⭐ Final Thoughts

This extension solves a real problem: **maintaining consistency and emotional depth in long-form RP**.

Whether you're starting fresh or have 500 messages of epic storytelling, the Dynamic Memory Tracker helps your AI understand and remember what truly matters.

**Install it. Analyze your chat. Never forget again.** 🧠✨

---

## 📦 Package Contents

Total size: ~30KB zipped, ~100KB unzipped

```
dynamic-memory-tracker/
├── index.js (39KB)           # Main functionality
├── style.css (9KB)           # UI styling
├── manifest.json (489B)      # Extension config
├── README.md (11KB)          # Full documentation
├── EXISTING-CHATS.md (9.7KB) # Mid-chat guide
├── QUICK-REFERENCE.md (7KB)  # Quick start
├── INSTALL.md (3.1KB)        # Installation
├── CONTRIBUTING.md (8.6KB)   # Developer guide
├── example-data.json (4.2KB) # Data structure
└── LICENSE (796B)            # AGPL-3.0
```

**Ready to install! 🚀**

---

*Extension Version: 1.1.0*  
*Created: October 23, 2025*  
*License: AGPL-3.0*  
*For: SillyTavern 1.12.0+*
