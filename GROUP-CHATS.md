# 👥 Group Chat Support Guide

## Overview

The Dynamic Memory Tracker now fully supports group chats! Track memories, relationships, and emotional states for multiple characters in multi-character conversations.

---

## 🆕 What's New (v1.4.0)

### Group Chat Features

✅ **Character Attribution**
- Memories tagged with who said/did what
- Character badges in memory view
- Per-character filtering

✅ **Multiple Relationship Tracking**
- Track relationships between different character pairs
- "Alice & Bob", "Alice & Charlie", "Bob & Charlie"
- Individual relationship progression

✅ **Per-Character Emotions**
- Track emotional state of each character
- See who's happy, sad, angry, etc.
- Independent emotional tracking

✅ **Three Tracking Modes**
- Auto-detect (smart default)
- Combined (treat as one entity)
- Per-Character (fully separate)

---

## 🎛️ **Group Chat Modes**

### Mode 1: Auto-Detect (Recommended) ⭐

**What it does:**
- Automatically detects if you're in a group chat
- Tracks character names in memories
- Creates combined timeline
- Separate emotion tracking per character
- Relationship tracking between pairs

**Best for:**
- Most group chats
- 2-5 characters
- Balanced approach

**Example Output:**
```
Memory: "Alice revealed she's afraid of heights"
Character: Alice
Importance: 0.8

Memory: "Bob comforted Alice about her fear"
Character: Bob  
Relationship: Alice & Bob (trust: +0.1)
```

---

### Mode 2: Combined

**What it does:**
- Treats all group members as single entity
- Memories not tagged by character
- General relationship tracking
- Simpler but less detailed

**Best for:**
- Very large groups (6+ characters)
- When character distinction isn't critical
- Faster processing

**Example Output:**
```
Memory: "Someone revealed a fear of heights"
Importance: 0.8
(No character attribution)
```

---

### Mode 3: Per-Character

**What it does:**
- Completely separate memory banks per character
- Each character has own memories
- Own relationships
- Own emotional states
- Most detailed tracking

**Best for:**
- Important multi-protagonist stories
- When each character arc matters
- Complex group dynamics
- 2-4 main characters

**Example Output:**
```
Alice's Memories: 45
├─ Her revealing her fear
├─ Her childhood story
└─ Her relationship with Bob

Bob's Memories: 38
├─ Him comforting Alice
├─ His own secrets
└─ His relationship with Alice
```

---

## 🔧 **How to Use**

### Step 1: Set Group Chat Mode

In extension settings:
```
Group Chat Mode: [Auto-detect ▼]

Options:
- Auto-detect (recommended)
- Combined (all together)
- Per-Character (separate tracking)
```

### Step 2: Start Chatting

Extension automatically:
- Detects character names
- Tags memories appropriately  
- Tracks relationships between characters
- Monitors each character's emotions

### Step 3: View Memories

**What you'll see:**
```
┌─────────────────────────────────────┐
│ [Alice] ★★★★☆ anxious               │
│ Revealed fear of heights from       │
│ childhood incident                  │
│ Keywords: fear, heights, childhood  │
├─────────────────────────────────────┤
│ [Bob] ★★★☆☆ caring                  │
│ Offered to help Alice overcome     │
│ her fear gradually                  │
│ Keywords: support, help, caring     │
└─────────────────────────────────────┘
```

Character badges show who each memory is about!

---

## 💕 **Relationship Tracking in Groups**

### How It Works

**Auto-detect & Per-Character modes:**
- Tracks relationships between specific pairs
- "Alice & Bob: Trust +0.4"
- "Bob & Charlie: Rivalry -0.2"
- "Alice & Charlie: Friendship +0.6"

**Combined mode:**
- General group relationships
- "Group cohesion: +0.3"
- "Overall trust: +0.5"

### Relationship View

```
Relationships:

Alice & Bob
  Trust: +67% ↑
  Recent: Improved after fear revelation

Bob & Charlie  
  Friendship: +45% ↑
  Recent: Bonding over shared interests

Alice & Charlie
  Romance: +23% ↑
  Recent: Subtle tension building
```

---

## 😊 **Emotional Tracking in Groups**

### Per-Character Emotions

Each character's emotional state tracked separately:

```
Current Emotional States:

Alice: anxious, vulnerable
  (from revealing her fear)

Bob: caring, protective  
  (from comforting Alice)

Charlie: curious, observant
  (watching the interaction)
```

### Emotional History

See how each character's emotions evolved:

```
Alice's Emotions:
  10:00 - happy, excited
  10:15 - nervous, hesitant  
  10:30 - anxious, vulnerable
  10:45 - relieved, grateful

Bob's Emotions:
  10:00 - relaxed, casual
  10:30 - concerned, attentive
  10:45 - caring, protective
```

---

## 📊 **Memory Organization**

### Auto-Detect Mode

**Single Timeline:**
```
10:00 - [Alice] Arrived at coffee shop
10:05 - [Bob] Ordered drinks for everyone
10:10 - [Charlie] Mentioned the news
10:15 - [Alice] Revealed her secret
10:20 - [Bob] Offered support
10:25 - [Charlie] Shared similar experience
```

**Filterable by Character:**
- View all memories
- Filter to see only Alice's
- Filter to see only Bob's
- etc.

---

### Per-Character Mode

**Separate Memory Banks:**
```
Alice's Perspective:
├─ Arrived at coffee shop
├─ Bob ordered drinks (noticed this)
├─ Revealed my secret
└─ Bob offered support

Bob's Perspective:
├─ Met at coffee shop
├─ Ordered drinks for group
├─ Alice revealed secret
└─ Offered her support

Charlie's Perspective:
├─ Group met at coffee shop
├─ Mentioned recent news
├─ Alice shared secret
└─ Shared my similar experience
```

---

## 🎯 **Best Practices**

### For 2-3 Character Groups

**Recommended: Auto-Detect or Per-Character**

```
Settings:
- Group Chat Mode: Auto-detect
- Tracking Depth: Detailed
- Max Memories: 75-100

Why:
- Clear character attribution
- Detailed relationship tracking
- Each character's arc preserved
```

---

### For 4-5 Character Groups

**Recommended: Auto-Detect**

```
Settings:
- Group Chat Mode: Auto-detect
- Tracking Depth: Detailed
- Max Memories: 100-150

Why:
- Balances detail and manageability
- Tracks key relationships
- Not overwhelmed with data
```

---

### For 6+ Character Groups

**Recommended: Combined or Auto-Detect**

```
Settings:
- Group Chat Mode: Combined or Auto-detect
- Tracking Depth: Basic or Detailed
- Max Memories: 100

Why:
- Prevents memory overload
- Focus on main plot points
- Easier to manage
```

---

## 💡 **Use Cases**

### Use Case 1: Trio Adventure

**Setup:**
- 3 characters: Warrior, Mage, Rogue
- Mode: Per-Character
- Track each character's development

**Memories tracked:**
- Warrior's combat victories
- Mage's spell discoveries
- Rogue's stealth missions
- Their growing friendships
- Individual character arcs

---

### Use Case 2: Romantic Quartet

**Setup:**
- 4 characters in complex romance
- Mode: Auto-detect
- Track evolving relationships

**Relationships tracked:**
- Alice & Bob (will-they-won't-they)
- Alice & Charlie (friendship)
- Bob & Dana (rivalry)
- Charlie & Dana (developing romance)
- Dana & Alice (complicated history)

---

### Use Case 3: Large Party Adventure

**Setup:**
- 7+ characters in D&D campaign
- Mode: Combined
- Track major plot points

**Focus:**
- Group decisions
- Major battles
- Plot progression
- Key revelations
- Less individual tracking

---

## 🔍 **Filtering & Search**

### Character-Specific Search

```
In Memory Panel:
1. Click filter icon
2. Select character: "Alice"
3. View only Alice's memories

Results:
- All memories involving Alice
- Her emotional moments
- Her relationships
- Her development
```

### Relationship-Specific Search

```
Search for: "Alice Bob"
Results:
- Memories involving both
- Their interactions
- Relationship changes
- Shared moments
```

---

## 📖 **Manual Memories in Groups**

### Adding Manual Memory

When adding manual memory in group chat:

```
Summary: "Alice revealed her backstory to Bob"
Importance: 0.9
Character: Alice (auto-detected or manual selection)
Keywords: Alice, Bob, backstory, reveal
Relationship: Alice & Bob → trust improved
```

**Character assignment:**
- Auto-detected from summary content
- Or manually specify
- Can involve multiple characters

---

### Lorebook Import

When importing from lorebook in group chat:

```
Entry: "Alice's Background"
→ Imported as memory tagged to Alice

Entry: "Bob's Secret"
→ Imported as memory tagged to Bob

Entry: "World Lore"
→ Imported as general memory (no character tag)
```

---

## ⚙️ **Technical Details**

### Memory Structure

```javascript
{
  summary: "Alice revealed her fear of heights",
  importance: 0.8,
  emotion: "vulnerable, anxious",
  keywords: ["fear", "heights", "Alice"],
  characterName: "Alice", // Who this is about
  relationship: {
    type: "trust",
    change: "improved",
    between: "Alice & Bob" // Group-specific
  },
  timestamp: 1234567890,
  messageIndex: 42
}
```

### Relationship Keys

**Auto-detect mode:**
```
"Alice:trust" - Alice's trust relationships
"Bob:friendship" - Bob's friendships
"Alice & Bob:romance" - Specific pair
```

**Combined mode:**
```
"trust" - General trust
"friendship" - General friendship
```

---

## 🎛️ **Switching Modes**

### Can I switch modes mid-chat?

**Yes, but:**
- New memories use new mode
- Old memories keep old format
- May want to re-analyze

**Recommended:**
```
1. Choose mode before starting
2. Stick with it for that chat
3. Different chats can use different modes
```

### Migrating Memories

If switching modes:

```
1. Export current memories
2. Switch mode
3. Optionally re-analyze chat
4. Or manually edit exported JSON
5. Re-import if needed
```

---

## 🆘 **Troubleshooting**

### "Character names not showing"

**Check:**
```
1. Group Chat Mode: Not "Combined"
2. Character names in messages
3. Re-analyze recent messages
4. Check browser console for errors
```

---

### "Too many relationships tracked"

**Solution:**
```
1. Increase max memories setting
2. Or switch to Combined mode
3. Or focus on main character pairs
4. Delete less important relationships
```

---

### "Can't tell who's who"

**Solution:**
```
1. Switch from Combined to Auto-detect
2. Re-analyze last 50-100 messages
3. Character badges will appear
4. Or add manual memories with names
```

---

### "Performance issues"

**Optimization:**
```
For large groups (6+):
1. Use Combined mode
2. Set tracking depth: Basic
3. Lower max memories: 50-75
4. Analyze less frequently
```

---

## 📊 **Example Group Chat Session**

### Setup
```
Characters: Alice, Bob, Charlie
Mode: Auto-detect
Tracking: Detailed
```

### After 100 Messages

**Memories: 58 total**
```
Alice: 22 memories
├─ Her fears revealed
├─ Her childhood stories
├─ Her goals discussed
└─ Her relationships

Bob: 19 memories
├─ His supportive moments
├─ His own secrets
├─ His protective nature
└─ His relationships

Charlie: 17 memories
├─ His observations
├─ His similar experiences
├─ His mediation
└─ His relationships
```

**Relationships: 6 tracked**
```
Alice & Bob
  Trust: +0.7 (strong)
  
Alice & Charlie
  Friendship: +0.5 (growing)
  
Bob & Charlie
  Friendship: +0.4 (solid)
  
Alice (romance): +0.3
Bob (trust): +0.6
Charlie (curiosity): +0.2
```

**Emotional States**
```
Current:
- Alice: relieved, hopeful
- Bob: caring, determined
- Charlie: contemplative, supportive

History tracked for each
```

---

## 🎯 **Quick Reference**

| Group Size | Recommended Mode | Tracking Depth | Max Memories |
|------------|-----------------|----------------|--------------|
| 2-3 chars | Auto or Per-Char | Detailed | 75-100 |
| 4-5 chars | Auto-detect | Detailed | 100-150 |
| 6+ chars | Auto or Combined | Basic/Detailed | 75-100 |

---

## 🚀 **Getting Started**

### For Your Group Chat

**Step 1: Configure (2 min)**
```
1. Open extension settings
2. Set Group Chat Mode: Auto-detect
3. Set Tracking Depth: Detailed
4. Set Max Memories: 100
```

**Step 2: Build Memory Base (30 min)**
```
Option A: Analyze recent messages
- Click "Analyze Range"
- Last 100-200 messages
- Wait for completion

Option B: Manual setup
- Add 10-15 manual memories
- Tag with character names
- Import from lorebook

Option C: Hybrid (recommended)
- 5-10 manual memories
- Analyze last 100 messages
- Best of both worlds
```

**Step 3: Start Tracking**
```
- Continue chatting normally
- Extension auto-tracks all messages
- Character names auto-detected
- Relationships tracked automatically
```

**Step 4: Review**
```
- Click "View Memories"
- See character badges
- Check relationships
- Browse timeline
```

---

## 💎 **Pro Tips**

### Character Name Consistency

**Make sure characters use consistent names:**
```
✅ Always "Alice" or always "Alice Smith"
❌ Mix of "Alice", "Ali", "Alice S."

Extension tracks by exact name match
```

### Relationship Focus

**For complex groups, focus on key relationships:**
```
Don't need to track every possible pair
Focus on:
- Main romantic interests
- Core friendships
- Important rivalries
- Key conflicts
```

### Memory Management

**Regular maintenance:**
```
Weekly:
- Review high-importance memories
- Delete outdated/redundant entries
- Check character attributions

Monthly:
- Export full backup
- Clean up old memories
- Adjust importance scores
```

---

**Happy group chat tracking! 👥✨**
