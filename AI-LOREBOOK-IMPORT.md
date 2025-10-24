# 🤖 AI-Analyzed Lorebook Import

## New Feature in v1.5.0

When importing lorebook entries, you can now choose to have AI analyze them to extract better information!

---

## ✨ **What's the Difference?**

### **Basic Import (AI Analyze OFF)**
```
Lorebook Entry:
Title: "Alice's Background"
Content: "Alice was born in Tokyo and moved to New York at age 10. 
         She's afraid of heights after a childhood incident."

↓

Memory Created:
Summary: "Alice's Background: Alice was born in Tokyo..."
Importance: 0.7 (your default setting)
Emotion: factual
Keywords: [your lorebook keys] + lorebook, imported
```

---

### **AI Analysis (AI Analyze ON)** ⭐ NEW!
```
Lorebook Entry:
Title: "Alice's Background"
Content: "Alice was born in Tokyo and moved to New York at age 10. 
         She's afraid of heights after a childhood incident."

↓ AI analyzes the content ↓

Memory Created:
Summary: "Character relocated from Tokyo to NYC at young age; 
         has lasting fear of heights from childhood trauma"
Importance: 0.85 (AI determined this is important)
Emotion: biographical, formative
Keywords: Tokyo, NYC, relocation, fear, heights, childhood, 
         trauma + [your lorebook keys] + lorebook, imported
Continuity Note: "Fear of heights should affect rooftop scenes 
                 and tall building scenarios"
```

---

## 🎯 **Benefits of AI Analysis**

### **1. Better Summaries**
- AI condenses long entries into key facts
- Focuses on most relevant information
- More concise than raw text

### **2. Smart Importance Scoring**
- AI evaluates how significant the info is
- Character secrets: 0.9+
- Background facts: 0.7-0.8
- Minor details: 0.5-0.6

### **3. Contextual Emotions**
- "biographical" for backstory
- "mysterious" for secrets
- "formative" for important events
- "neutral" for general facts

### **4. Enhanced Keywords**
- AI extracts additional relevant terms
- Beyond just your lorebook keys
- Better for searching later

### **5. Continuity Notes**
- AI identifies what to remember
- Notes potential story impacts
- Flags important connections

---

## 🔧 **How to Use**

### **Step 1: Click "Import from Lorebook"**

### **Step 2: See the New Option**
```
☑ AI Analyze (extract importance, emotions, keywords)
```
**Checked by default!**

### **Step 3: Select Entries**
Check which lorebook entries to import

### **Step 4: Click "Import Selected"**

### **Step 5: Wait**
- AI analyzes each entry (takes a few seconds each)
- Progress notification shows
- Falls back to basic import if AI fails

### **Step 6: Review Results**
Click "View Memories" to see the AI-enhanced memories!

---

## ⚙️ **Settings**

### **AI Analyze Checkbox**
- ☑ **ON** (default) - Use AI to analyze each entry
- ☐ **OFF** - Quick import with your default importance

### **Default Importance Slider**
- Only used when AI Analyze is OFF
- Set your preferred importance level (0.3 - 1.0)

---

## 📊 **Comparison Example**

### **Lorebook Entry**
```
Title: The Shadow Organization
Content: A secret group operating since the 1800s. They've 
been watching the main characters and collecting information. 
Their true motives are unknown but they have significant 
resources and influence in government. Recently became more 
active after the incident at the museum.
```

### **Basic Import**
```
Summary: "The Shadow Organization: A secret group operating 
         since the 1800s. They've been watching..."
Importance: 0.7
Emotion: factual
Keywords: organization, secret + lorebook, imported
Continuity Note: Imported from World Info: The Shadow Organization
```

### **AI Analysis**
```
Summary: "Centuries-old secret organization actively surveilling 
         protagonists; unknown motives but government-level 
         resources; activity increased post-museum incident"
Importance: 0.95 (critical plot element!)
Emotion: ominous, mysterious, threatening
Keywords: shadow organization, secret, surveillance, government, 
         conspiracy, museum incident, threat + lorebook, imported
Continuity Note: "Major antagonist group with long history and 
         significant power; recent activity surge is plot-relevant"
```

---

## ⏱️ **Time & Cost**

### **Processing Time**
- ~2-3 seconds per entry with AI analysis
- 4 entries: ~10-15 seconds
- 10 entries: ~30-40 seconds
- 20 entries: ~1-2 minutes

### **Token Cost**
- ~200-400 tokens per entry analyzed
- 4 entries: ~800-1600 tokens
- 10 entries: ~2k-4k tokens
- Very affordable!

### **Without AI Analysis**
- Instant (no processing)
- Free (no tokens)

---

## 💡 **When to Use Each**

### **Use AI Analysis When:**
✅ You have complex lorebook entries
✅ Entries contain multiple facts
✅ You want better importance scoring
✅ You want enhanced keywords
✅ You have time for processing
✅ Quality > speed

### **Use Basic Import When:**
✅ Entries are already concise
✅ You've set good importance manually
✅ You want instant import
✅ You're importing many entries (20+)
✅ You want to save tokens
✅ Speed > analysis depth

---

## 🎯 **Best Practices**

### **Before Import**

**1. Review Your Entries**
- Make sure lorebook content is clear
- Well-written entries = better AI analysis
- Fix any typos or unclear text

**2. Choose Wisely**
- Don't import everything
- Select only relevant entries
- Quality > quantity

**3. Set Expectations**
- AI analysis isn't perfect
- May need manual adjustments
- Fallback to basic if AI fails

### **After Import**

**1. Review Memories**
```
Click "View Memories"
Filter by: lorebook, imported
Check AI analysis quality
```

**2. Adjust if Needed**
- Export memories
- Edit importance scores
- Refine summaries
- Re-import if desired

**3. Test in Chat**
- Send a few messages
- See if memories are referenced
- Verify they're helpful

---

## 🔍 **What Gets Analyzed**

The AI analyzes:
1. **Main themes** in the content
2. **Important facts** to extract
3. **Significance level** (importance)
4. **Emotional context** of the info
5. **Key terms** for searching
6. **Story implications** (continuity notes)

The AI preserves:
- Your original lorebook keys
- Entry title/name
- Source attribution
- Timestamp

---

## 🆘 **Troubleshooting**

### **"AI analysis failed, using basic import"**

**Causes:**
- API doesn't support JSON output well
- Entry content too short/empty
- Rate limiting
- API error

**Result:**
- Falls back to basic import automatically
- Memory still created
- Just without AI enhancements

**Fix:**
- Check your API (OpenAI/Claude work best)
- Verify API is responding
- Wait a moment and try again

---

### **Analysis seems wrong**

**Example:**
AI rated a critical plot point as 0.5 importance

**Solutions:**
1. **Improve lorebook content**
   - Make importance clearer in text
   - Add context about why it matters
   - Be more explicit

2. **Edit after import**
   - Export memories
   - Manually adjust importance
   - Re-import

3. **Use basic import instead**
   - Turn off AI Analyze
   - Set your own importance
   - More control

---

### **Takes too long**

**For 20+ entries:**
- Consider basic import instead
- Or import in batches
- 10 at a time with AI
- Rest with basic import

---

## 📈 **Example Results**

### **Small Lorebook (5 entries)**
```
Without AI:
- Time: Instant
- Quality: Raw text
- Importance: All 0.7
- Keywords: Just your keys

With AI:
- Time: 15 seconds
- Quality: Enhanced summaries
- Importance: 0.6, 0.8, 0.9, 0.7, 0.85
- Keywords: Expanded by AI
- Result: Much better! ✨
```

### **Large Lorebook (30 entries)**
```
Without AI:
- Time: Instant
- Tokens: 0
- All uniform quality

With AI:
- Time: 2-3 minutes
- Tokens: ~6k-12k
- Variable quality (better on average)

Recommendation: AI analyze the 10 most important
               Basic import the rest
```

---

## 🎓 **Advanced: Hybrid Strategy**

### **For Best Results:**

**Step 1: Sort Your Entries**
```
Critical (5 entries):
- Main character secrets
- Core plot points
- Important relationships
→ AI analyze these

Important (10 entries):
- Supporting character info
- World rules
- Location details
→ AI analyze if time permits

Background (15 entries):
- Minor facts
- Flavor text
- General lore
→ Basic import
```

**Step 2: Import in Batches**
```
Batch 1: Critical entries with AI (5)
Wait, review quality

Batch 2: Important entries with AI (10)
Wait, review quality

Batch 3: Background entries basic (15)
Instant import
```

**Result:**
- Best quality where it matters
- Acceptable quality elsewhere
- Balanced time and cost

---

## ✅ **Summary**

**AI Analysis:**
- ✨ Better summaries
- 🎯 Smart importance
- 🏷️ Enhanced keywords
- 📝 Continuity notes
- ⏱️ Takes time
- 💰 Uses tokens

**Basic Import:**
- ⚡ Instant
- 🆓 Free
- 📋 Raw text
- ⚙️ Manual control

**Choose based on your needs!**

Both create perfectly valid memories - AI just enhances them! 🎯

---

**Try it out with your lorebook! The default (AI ON) usually gives the best results.** ✨
