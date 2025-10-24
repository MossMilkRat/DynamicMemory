# Using Dynamic Memory Tracker with Existing Chats

## 🔄 The Challenge

You've been having an amazing RP session for hours/days/weeks, and now you want to add memory tracking. But how does the extension understand everything that's already happened?

## ✨ The Solution: Catch-Up Analysis

The extension includes a **"Analyze Existing Chat"** feature that retroactively processes your entire chat history to build a complete memory profile.

---

## 📋 Quick Start Guide

### Step 1: Install & Enable
1. Install the extension (see INSTALL.md)
2. Enable it in the Extensions panel
3. Configure your preferred settings

### Step 2: Analyze Your Chat
1. Open your existing chat
2. Click the **"Analyze Existing Chat"** button in the extension settings
3. Review the confirmation dialog (it tells you how many messages will be processed)
4. Click "OK" to start

### Step 3: Wait for Analysis
- The extension will process all messages sequentially
- A progress bar shows how many messages have been analyzed
- For a 100-message chat, expect 3-5 minutes
- You can continue chatting; new messages are tracked automatically

### Step 4: Review Results
- Click "View Memories" to see what was extracted
- Check "View Relationships" to see the relationship dynamics
- Browse the "Timeline" to see story progression
- Filter and search as needed

---

## ⚙️ How It Works

### What Gets Analyzed

For each message, the AI extracts:

**📝 Basic Info**
- Summary of main events
- Importance score (0.0 - 1.0)
- Emotional tone

**💭 Detailed Analysis** (if enabled)
- Character feelings and thoughts
- Relationship dynamics
- Important revelations
- Continuity notes

**🔍 Comprehensive Analysis** (if enabled)
- Character development
- Subtext and implications
- Potential contradictions
- Story arcs

### Processing Flow

```
1. Load all messages from chat
2. For each message:
   ↓
3. Check if already analyzed (skip if yes)
   ↓
4. Send to AI for analysis
   ↓
5. Extract structured memory data
   ↓
6. Store in chat metadata
   ↓
7. Update relationships & timeline
   ↓
8. Save to disk

9. Trim to max memories (keeps most important)
10. Show completion summary
```

### Smart Batching

- Processes 5 messages at a time
- Small delays between batches (avoids API rate limits)
- Skips already-analyzed messages (safe to re-run)
- Saves progress periodically

---

## 💡 Best Practices

### Before Analysis

**1. Choose the Right Tracking Depth**

- **Basic**: Fast, lightweight
  - Good for: Casual chats, budget constraints
  - Time: ~30 seconds per 100 messages
  
- **Detailed**: Balanced (Recommended)
  - Good for: Most RP scenarios
  - Time: ~3-5 minutes per 100 messages
  
- **Comprehensive**: Deep analysis
  - Good for: Complex plots, long-term stories
  - Time: ~8-12 minutes per 100 messages

**2. Set Appropriate Memory Limits**

- For short chats (< 50 messages): 25-30 memories
- For medium chats (50-200 messages): 50 memories
- For long chats (200+ messages): 75-100 memories

**3. Consider Your API**

- **OpenAI/Claude**: All tracking depths work great
- **Local models**: Stick to Basic or Detailed
- **Budget concerns**: Start with Basic, upgrade as needed

### During Analysis

**DO:**
- ✅ Let it run in the background
- ✅ Continue chatting (new messages tracked separately)
- ✅ Check progress occasionally
- ✅ Be patient with long chats

**DON'T:**
- ❌ Close the browser tab
- ❌ Switch chats mid-analysis
- ❌ Disable the extension
- ❌ Spam the analyze button

### After Analysis

**Review & Refine:**
1. Browse the memories - are they accurate?
2. Check relationships - do they reflect the story?
3. View timeline - does it capture key moments?
4. Export data (backup your memories!)

**If Results Are Poor:**
- Try a higher tracking depth
- Check your AI model supports structured outputs
- Verify your prompts are clear
- Re-run analysis after adjustments

---

## 📊 What to Expect

### Memory Quality

**High Importance (★★★★★)**
- Major revelations
- Significant emotional moments
- Relationship milestones
- Plot-critical events

**Medium Importance (★★★☆☆)**
- Character development moments
- Meaningful conversations
- Minor conflicts resolved
- Setting details

**Low Importance (★☆☆☆☆)**
- Small talk
- Routine actions
- Background details
- Transitional moments

### Typical Results

**For a 100-message romance RP:**
- 40-60 memories extracted
- 5-8 relationship types tracked
- 30-45 timeline events
- 10-15 high-importance moments

**For a 50-message adventure RP:**
- 20-30 memories extracted
- 3-5 relationship types tracked
- 15-25 timeline events
- 5-8 high-importance moments

---

## 🔧 Troubleshooting

### Analysis Stuck or Slow

**Problem**: Progress bar not moving
**Solutions**:
- Check browser console for errors (F12)
- Verify API is responding (test with regular chat)
- Try lowering tracking depth
- Process chat in smaller sections (see Advanced Tips)

### Poor Quality Memories

**Problem**: Extracted memories don't make sense
**Solutions**:
- Increase tracking depth
- Check your API model (some models work better than others)
- Verify JSON schema support in your API
- Try a different AI model/service

### Duplicate Memories

**Problem**: Same event appears multiple times
**Solutions**:
- Click "Analyze Existing Chat" only once
- Extension automatically skips re-analyzed messages
- If duplicates exist, export → edit JSON → re-import

### Out of Memory / Browser Crash

**Problem**: Browser slows down or crashes
**Solutions**:
- Lower max memory entries
- Use Basic tracking depth
- Process chat in sections (see Advanced Tips)
- Close other browser tabs

---

## 🎓 Advanced Tips

### Processing Long Chats in Sections

For very long chats (500+ messages):

1. **Export your chat** (backup first!)
2. **Split into sections**:
   - Create temporary chat with first 200 messages
   - Analyze
   - Export memories
   - Repeat for next section
3. **Merge results** manually if needed

### Manual Memory Editing

You can edit memories directly:

```javascript
// Open browser console (F12)
const ctx = SillyTavern.getContext();
const memories = ctx.chatMetadata.memoryTracker.memories;

// Find and edit a memory
const memory = memories.find(m => m.summary.includes('your search term'));
memory.summary = "Your updated summary";
memory.importance = 0.95; // Update importance

// Save changes
await ctx.saveMetadata();
```

### Selective Re-Analysis

To re-analyze only recent messages:

1. Export current memories (backup)
2. Delete memories from a specific message index onwards
3. Run analysis (it will only process messages without memories)

### Combining with World Info

For best results:
1. Enable World Info entries for key facts
2. Use Memory Tracker for dynamic events
3. World Info = static facts (character backgrounds, lore)
4. Memory Tracker = dynamic narrative (what happened, how relationships changed)

---

## 🎯 Use Cases

### New to an Ongoing Story
**Scenario**: You're taking over an RP from someone else

**Process**:
1. Read through the chat history
2. Run Comprehensive analysis
3. Review extracted memories
4. Add manual notes if needed
5. Start chatting with full context

### Resurrecting an Old Chat
**Scenario**: You haven't chatted in weeks/months

**Process**:
1. Open the old chat
2. Run analysis to refresh your memory
3. Review timeline to see where you left off
4. Check relationships to understand current dynamics
5. Continue the story

### Preparing for Important Scenes
**Scenario**: You're about to write a climactic moment

**Process**:
1. Analyze the entire chat
2. Review all high-importance memories
3. Check relationship levels
4. Ensure continuity with past events
5. Let auto-injection handle the rest

### Debugging Inconsistencies
**Scenario**: Character forgot something important

**Process**:
1. Search memories for the forgotten fact
2. Check what message it was in
3. Jump to that message (timeline feature)
4. Manually remind the character in your next message
5. Add a continuity note to that memory

---

## ❓ FAQ

**Q: Will this analyze every message, even small talk?**
A: Yes, but small talk typically gets low importance scores and may be trimmed to make room for important memories.

**Q: How much does this cost in API tokens?**
A: Approximately 150-800 tokens per message depending on tracking depth. For a 100-message chat: 15k-80k tokens.

**Q: Can I stop analysis mid-way?**
A: Technically yes (refresh page), but you'll lose progress. Better to let it finish.

**Q: Will this work with group chats?**
A: Yes, but the extension doesn't currently distinguish between different characters in the group. It tracks all as general chat memories.

**Q: Can I analyze multiple chats at once?**
A: No, analyze one chat at a time. Switch chats and run analysis again.

**Q: What if I add more messages later?**
A: The extension auto-tracks new messages. You only need to run analysis once for existing messages.

**Q: Can I customize what gets extracted?**
A: Not directly through UI, but you can modify the extraction prompts in `index.js` for full control.

---

## 🚀 Next Steps

Now that your chat is analyzed:

1. **Enable Auto-Injection** for seamless memory integration
2. **Set up notifications** for important moments
3. **Regularly export** your data for backup
4. **Browse memories** before major story beats
5. **Enjoy** more consistent, emotionally aware RP!

---

## 💾 Data Location

Your analyzed memories are stored in:
```
SillyTavern/data/<user>/chats/<chat-name>.jsonl
```

In the chat metadata, under:
```javascript
chatMetadata.memoryTracker = {
  memories: [...],
  relationships: {...},
  timeline: [...],
  emotionalStates: {...}
}
```

Always **export** before making major changes!

---

**Happy memory tracking! 🧠✨**
