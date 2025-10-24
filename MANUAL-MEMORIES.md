# ✏️ Manual Memory Management Guide

## Overview

Sometimes you need to add memories manually without analyzing messages. This is perfect for:

- **Adding backstory** you know but isn't in the chat yet
- **Importing key facts** from your World Info/Lorebook
- **Filling gaps** in automatically analyzed chats
- **Quick context addition** without full analysis
- **Character sheet info** that should be remembered

---

## 🆕 New Features (v1.3.0)

### 1. Add Manual Memory
Create custom memory entries with full control over all fields.

### 2. Import from Lorebook
Convert your existing World Info entries into memories automatically.

---

## ✏️ Adding Manual Memories

### When to Use Manual Memories

**Perfect for:**
- ✅ Character backstories ("Character grew up in rural Japan")
- ✅ Important facts not in chat ("User is allergic to shellfish")
- ✅ Relationship history ("They dated 5 years ago")
- ✅ Plot setup ("Secret organization is tracking them")
- ✅ World details ("Magic is forbidden in this kingdom")

**Not needed for:**
- ❌ Things already in recent messages (auto-tracked)
- ❌ Temporary states (emotions handle this)
- ❌ Minor details (low importance anyway)

---

### How to Add Manual Memory

#### Step 1: Click "Add Manual Memory" Button
Located in the extension settings panel.

#### Step 2: Fill in the Form

**Summary** (Required)
```
Brief description of the event or fact.

Good examples:
- "Character revealed they have a twin brother in the military"
- "User character is afraid of heights due to childhood incident"
- "They first met at a coffee shop on a rainy Tuesday"

Bad examples:
- "Stuff happened" (too vague)
- [3 paragraphs of text] (too long, be concise)
```

**Importance** (0.0 - 1.0)
```
How significant is this memory?

1.0 - Critical (character's biggest secret)
0.9 - Very important (major life event)
0.7 - Important (significant but not crucial)
0.5 - Moderate (worth remembering)
0.3 - Minor (background detail)

Default: 0.7 (recommended for most manual entries)
```

**Emotion/Tone**
```
What's the emotional context?

Examples:
- "happy, celebratory"
- "tense, anxious"
- "revelatory, shocking"
- "sad, melancholic"
- "neutral" (for facts)
- "factual" (for backstory)
```

**Keywords** (Comma-separated)
```
Tags for searching and filtering.

Examples:
- "childhood, trauma, fear"
- "family, brother, military"
- "first meeting, coffee shop"
- "secret, organization, danger"

The extension will auto-add "manual" tag.
```

**Continuity Note** (Optional)
```
Reminder for future reference.

Examples:
- "Don't forget character hasn't told their parents yet"
- "This fear should affect any scenes involving heights"
- "Twin brother appears in chapter 12"
```

**Relationship Impact** (Optional)
```
Did this affect a relationship?

Type: romance, friendship, trust, professional, family, rivalry
Change: improved, worsened, neutral

Example:
Type: trust
Change: improved
→ This memory strengthened trust between characters
```

#### Step 3: Save
Click "Save Memory" and it's added immediately!

---

### Example Manual Memories

#### Example 1: Character Backstory
```
Summary: Character was raised by a single mother after father died in a car accident when they were 7
Importance: 0.8
Emotion: sad, formative
Keywords: childhood, father, loss, family
Continuity Note: Character avoids talking about father but keeps his watch
Relationship: family, neutral
```

#### Example 2: Important Fact
```
Summary: User character is a trained surgeon but left medicine after losing a patient
Importance: 0.9
Emotion: regretful, defining
Keywords: surgeon, medicine, trauma, career
Continuity Note: Medical skills may be needed in emergencies
Relationship: professional, worsened
```

#### Example 3: Plot Setup
```
Summary: A secret government agency has been monitoring the characters for unknown reasons
Importance: 1.0
Emotion: ominous, mysterious
Keywords: government, surveillance, conspiracy, danger
Continuity Note: Will be revealed in act 3
Relationship: none
```

#### Example 4: Relationship History
```
Summary: Characters went to the same high school but didn't know each other well back then
Importance: 0.5
Emotion: nostalgic, coincidental
Keywords: high school, past, coincidence
Continuity Note: They might remember mutual friends
Relationship: friendship, neutral
```

---

## 📚 Importing from Lorebook

### What is Lorebook Import?

If you've already built World Info entries in SillyTavern, you can convert them into memories with one click!

**Benefits:**
- ✅ No need to re-type information
- ✅ Preserves your keywords
- ✅ Batch import multiple entries
- ✅ Adjustable importance
- ✅ Quick setup for new chats

---

### How to Import from Lorebook

#### Step 1: Set Up World Info First
Make sure you have World Info entries for:
- Character backgrounds
- Important locations
- Plot points
- World rules
- Key facts

#### Step 2: Click "Import from Lorebook"
Button in extension settings.

#### Step 3: Select Entries to Import

The dialog shows all your World Info entries:
```
┌───────────────────────────────────────────┐
│ Import from Lorebook                      │
├───────────────────────────────────────────┤
│ ☐ Select All    Importance: [====] 0.7   │
│                                           │
│ ☑ Character Background                    │
│   Keys: character, past, history          │
│   Born in Tokyo, moved to US at age...   │
│                                           │
│ ☑ The Secret Organization                 │
│   Keys: organization, conspiracy          │
│   A shadow group operating since...       │
│                                           │
│ ☐ Coffee Shop Location                    │
│   Keys: coffee, location, meeting         │
│   Small corner cafe where they...         │
│                                           │
│ [Import Selected] [Cancel]                │
└───────────────────────────────────────────┘
```

**Controls:**
- Check/uncheck entries to import
- "Select All" to import everything
- Adjust importance slider (applies to all)
- Default: 0.7 (good for most lorebook facts)

#### Step 4: Import
Click "Import Selected" and all checked entries become memories!

---

### What Gets Imported

For each lorebook entry:

**Summary**
```
Entry title + first 200 characters of content
Example: "Character Background: Born in Tokyo, moved to US at age 10..."
```

**Keywords**
```
All keys from the lorebook entry
+ "lorebook"
+ "imported"
```

**Importance**
```
Whatever you set in the slider
Recommended: 0.7 for general facts
            0.8-0.9 for critical info
```

**Emotion**
```
Automatically set to "factual"
(lorebook entries are usually objective facts)
```

**Continuity Note**
```
"Imported from World Info: [entry title]"
```

---

### Best Practices for Lorebook Import

#### Before Importing

**1. Review Your World Info**
- Remove outdated entries
- Merge duplicate information
- Update content for accuracy

**2. Organize by Importance**
- Critical facts: Import at 0.9
- General info: Import at 0.7
- Minor details: Import at 0.5 or skip

**3. Check Keywords**
- Make sure keys are descriptive
- Add important search terms
- These become memory keywords

#### After Importing

**1. Review Imported Memories**
```
Click "View Memories"
Search for: lorebook
Check that everything looks good
```

**2. Adjust if Needed**
- Export your memories
- Edit the JSON if needed
- Re-import edited version

**3. Clean Up**
- Delete any redundant entries
- Merge similar memories
- Adjust importance scores

---

## 🔄 Combining Strategies

### The Power Combo

For the best results, combine all three methods:

#### Method 1: Lorebook Import (5 min)
```
Import key world facts and character backgrounds
→ Sets up the foundation
```

#### Method 2: Manual Memories (10 min)
```
Add specific plot points or relationship history
→ Fills in important gaps
```

#### Method 3: Analyze Recent Chat (15 min)
```
Analyze last 200 messages
→ Captures recent developments
```

**Result:**
- ✅ Complete context coverage
- ✅ Manual + automatic tracking
- ✅ Past + present + future
- ✅ Total time: ~30 minutes
- ✅ Cost: ~$1-2

---

## 💡 Use Cases

### Use Case 1: Starting Fresh Chat with Backstory

**Situation:** New chat, but characters have history.

**Solution:**
1. Add 5-10 manual memories about their past
2. Set importance 0.7-0.9
3. Start chatting
4. New events auto-tracked

**Example Memories:**
- "Met 3 years ago at university"
- "Dated briefly but stayed friends"
- "Character A helped Character B through breakup"
- "Share an inside joke about pizza"
- "Character B owes Character A $200"

---

### Use Case 2: Complex World with Lorebook

**Situation:** Fantasy/sci-fi RP with lots of world rules.

**Solution:**
1. Build comprehensive World Info first
2. Import all entries at 0.7 importance
3. Add manual memories for character-specific facts
4. Start RP with full world context

**Lorebook Entries to Import:**
- Magic system rules
- Kingdom politics
- Character backgrounds
- Important locations
- Historical events
- Faction relationships

---

### Use Case 3: Fixing Gaps in Analyzed Chat

**Situation:** Analyzed 200 messages, but AI forgets earlier events.

**Solution:**
1. Analyze recent 200 messages
2. Read through older messages manually
3. Add 10-15 manual memories for key earlier events
4. Now have complete coverage

**Manual Memories for:**
- Major events from early chat
- Character reveals before message 1
- Important decisions made
- Relationship milestones
- Plot setups

---

### Use Case 4: Quick Context Without Analysis

**Situation:** 1000-message chat, don't want to analyze it all.

**Solution:**
1. Write 15-20 manual memories covering main plot
2. Import relevant lorebook entries
3. Done in 20 minutes vs 2 hours of analysis
4. Costs $0 vs $5-10

**What to Include:**
- Characters and their traits
- Main plot arc summary
- Current situation
- Important secrets
- Relationship status
- Critical facts

---

## 🎯 Quick Reference

### Manual Memory
- **When:** Need specific fact added quickly
- **Time:** 1-2 minutes per memory
- **Cost:** Free
- **Best for:** Backstory, plot setup, important facts

### Lorebook Import
- **When:** Have existing World Info
- **Time:** 5 minutes for batch import
- **Cost:** Free
- **Best for:** World facts, character backgrounds, lore

### Message Analysis
- **When:** Want detailed event tracking
- **Time:** Varies by message count
- **Cost:** API tokens
- **Best for:** Capturing actual conversations

---

## 🔧 Tips & Tricks

### Writing Good Manual Memories

**DO:**
- ✅ Be concise but specific
- ✅ Include relevant context
- ✅ Use descriptive keywords
- ✅ Set appropriate importance
- ✅ Add continuity notes for future reference

**DON'T:**
- ❌ Write essays (keep it brief)
- ❌ Add trivial details (save for high importance)
- ❌ Forget keywords (needed for search)
- ❌ Skip emotion (adds context)
- ❌ Overuse high importance (1.0 is for biggest moments)

---

### Organizing Imported Lorebook Entries

**By Importance:**
```
0.9-1.0: Critical world rules, main character secrets
0.7-0.8: Important locations, faction info, background
0.5-0.6: Minor details, flavor text
```

**By Type:**
```
Characters → 0.8
Locations → 0.6
Plot Points → 0.9
World Rules → 0.7
History → 0.5
```

---

### Maintaining Your Memories

**Weekly:**
- Export your memories (backup!)
- Review recent additions
- Delete outdated entries

**Monthly:**
- Check for duplicates
- Merge similar memories
- Adjust importance scores

**Before Big Scenes:**
- Search relevant memories
- Add manual notes if needed
- Review relationships

---

## 🆘 Troubleshooting

**"Import from Lorebook" button says no entries found**
- Check World Info is enabled
- Make sure character has World Info attached
- Verify entries exist in global or character-specific lorebook

**Manual memories not appearing in search**
- Check keywords are included
- Try different search terms
- Filter by emotion to narrow down

**Imported memories have wrong importance**
- Export memories to JSON
- Edit importance values
- Could also delete and re-import with new importance

**Too many memories after import**
- Set max memories higher temporarily
- Delete less important ones
- Or just let trimming handle it

---

## 🎓 Examples in Action

### Complete Setup Example

**Step 1: Import Lorebook (5 min)**
```
✅ Imported 12 World Info entries
   - Magic system (0.8)
   - Kingdom politics (0.7)
   - Character backgrounds (0.9)
```

**Step 2: Add Manual Memories (10 min)**
```
✅ Added 8 manual memories
   - Character secret (1.0)
   - Past relationship (0.8)
   - Plot setup (0.9)
   - Character fears (0.7)
```

**Step 3: Analyze Recent (15 min)**
```
✅ Analyzed last 200 messages
   - 87 memories extracted
   - 3 relationships tracked
   - 45 timeline events
```

**Total Memories: 107**
**Total Time: 30 minutes**
**Total Cost: ~$1-2**

**Result:**
- Complete world context
- Character history
- Recent events
- Ready to continue!

---

## 📖 Related Guides

- **[LONG-CHATS.md](LONG-CHATS.md)** - Strategies for very long chats
- **[EXISTING-CHATS.md](EXISTING-CHATS.md)** - Mid-chat adoption guide
- **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - Quick start card
- **[README.md](README.md)** - Complete documentation

---

**Happy memory tracking! 🧠✨**
