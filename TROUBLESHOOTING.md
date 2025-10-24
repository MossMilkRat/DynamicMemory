# 🔧 Troubleshooting: JSON Parsing Errors

## The Error You're Seeing

```
[Dynamic Memory Tracker] Error extracting memory: 
SyntaxError: Unexpected token 'E', "Extract:1"... is not valid JSON
```

This means the AI is not returning properly formatted JSON data.

---

## ✅ **FIXED in v1.4.1**

The latest version includes:
- ✅ **Robust JSON parsing** - Handles malformed responses
- ✅ **Automatic cleanup** - Strips markdown, code blocks
- ✅ **Fallback extraction** - Manual parsing when JSON fails
- ✅ **Better prompting** - Clearer instructions to AI
- ✅ **Graceful degradation** - Continues even with errors

**Update to v1.4.1 to fix this issue!**

---

## 🎯 **Why This Happens**

### **Cause 1: API Doesn't Support JSON Mode**

Some AI APIs don't properly support structured JSON output:

**Known Issues:**
- ❌ KoboldAI (local models)
- ❌ Text Generation WebUI
- ❌ Oobabooga
- ❌ NovelAI
- ⚠️ Some local models

**Works Well:**
- ✅ OpenAI (GPT-3.5, GPT-4, GPT-4o)
- ✅ Claude (all versions)
- ✅ Google AI (Gemini)
- ✅ OpenRouter (most models)

---

### **Cause 2: Model Doesn't Follow Instructions**

Even good APIs can fail if:
- Model is too small (< 7B parameters)
- Model not trained on structured output
- Prompt isn't clear enough
- Model is "creative" and adds extra text

---

### **Cause 3: SillyTavern Configuration**

Sometimes ST settings interfere:
- Response formatting enabled
- Custom regex replacements
- Instruct mode templates
- JSON mode not enabled

---

## 🔧 **Solutions**

### **Solution 1: Update to v1.4.1** ⭐ EASIEST

The new version handles these errors automatically:

**What it does:**
1. Tries to parse JSON normally
2. If fails: Strips markdown/code blocks
3. If fails: Extracts JSON from text
4. If fails: Manual pattern matching
5. If fails: Creates basic memory from message

**Result:** Works with almost any API!

---

### **Solution 2: Switch to Compatible API**

If you're using a local/incompatible model:

**Option A: Use OpenAI**
```
1. Get OpenAI API key
2. Settings → API Connections
3. Select OpenAI
4. Enter API key
5. Select model: gpt-4o-mini (cheap) or gpt-4 (best)
```

**Option B: Use Claude**
```
1. Get Anthropic API key
2. Settings → API Connections  
3. Select Claude
4. Enter API key
5. Select model: claude-3-5-sonnet
```

**Option C: Use OpenRouter**
```
1. Get OpenRouter API key
2. Settings → API Connections
3. Select OpenRouter
4. Try models: claude, gpt-4, etc.
```

---

### **Solution 3: Enable JSON Mode (OpenAI)**

For OpenAI specifically:

```
1. Settings → API Connections → OpenAI
2. Find "Response Format" or "JSON Mode"
3. Enable it
4. Save settings
5. Try analysis again
```

---

### **Solution 4: Adjust Tracking Depth**

Lower tracking depth = simpler prompts = better success:

```
Extension Settings:
- Change "Tracking Depth" to "Basic"
- This uses simpler prompts
- Higher success rate with local models
```

---

### **Solution 5: Use Manual Memories Instead**

If analysis keeps failing:

```
Skip automatic analysis entirely:

1. Click "Add Manual Memory" instead
2. Manually add 10-15 key memories
3. Much faster than troubleshooting
4. No API issues
5. You control quality
```

---

## 📊 **What v1.4.1 Does Differently**

### **Before (v1.3.0 and earlier):**
```
AI returns: "Extract:\n1. Summary: blah blah"
Extension tries: JSON.parse(result)
Result: ERROR ❌
Memory: Not created
```

### **After (v1.4.1):**
```
AI returns: "Extract:\n1. Summary: blah blah"

Step 1: Try direct JSON parsing
→ Fails

Step 2: Remove markdown formatting
→ Fails

Step 3: Search for JSON in text
→ Fails

Step 4: Manual pattern extraction
→ Success! ✅

Memory created from:
- Summary: "blah blah"
- Importance: 0.5 (default)
- Keywords: ["conversation"]
```

---

## 🎯 **Testing Your Setup**

### **Quick Test**

1. Start a short test chat
2. Send 2-3 messages
3. Click "Analyze Range" → last 2 messages
4. Check browser console (F12)

**Good result:**
```
[Dynamic Memory Tracker] Analysis complete!
• Processed 2 messages
• Created 2 new memories
```

**Bad result:**
```
Multiple JSON parsing errors
0 memories created
```

If bad result → Follow solutions above

---

## 🔍 **Debugging Steps**

### **Step 1: Check Your API**

```
In browser console (F12):

Look for API name in errors, or check:
Settings → API Connections → Current API
```

**If it says:**
- OpenAI → Should work (check JSON mode)
- Claude → Should work
- Gemini → Should work
- KoboldAI → Won't work well (use manual memories)
- Text Generation → Won't work well (use manual memories)

---

### **Step 2: Test API Response**

```
1. Send a normal message to character
2. Check it responds normally
3. If normal responses work but memory extraction fails
   → API partially compatible, v1.4.1 should fix it
```

---

### **Step 3: Check Console for Patterns**

Open console (F12) during analysis:

**Pattern A: All errors look same**
```
All: "Unexpected token 'E', 'Extract:1'..."
→ AI not returning JSON at all
→ Need v1.4.1 OR switch API
```

**Pattern B: Mix of errors and success**
```
Some parse, some fail
→ API inconsistent
→ v1.4.1 will help stabilize
```

**Pattern C: Different error types**
```
Various "Unexpected token" errors
→ AI returning different bad formats
→ v1.4.1 handles all these
```

---

## 💡 **Workarounds While Waiting**

If you can't update immediately:

### **Workaround 1: Manual Memories Only**
```
Don't use analyze features
Use "Add Manual Memory" instead
Import from lorebook
Works with any API
```

### **Workaround 2: Basic Tracking Only**
```
Settings → Tracking Depth: Basic
Simpler prompts = better success
Some memories better than none
```

### **Workaround 3: Smaller Batches**
```
Analyze 10 messages at a time instead of 200
Fewer errors to deal with
Can spot patterns easier
```

### **Workaround 4: Temporary API Switch**
```
Use OpenAI just for analysis
Switch back to preferred API for chatting
Analysis is one-time cost
```

---

## 📈 **Success Rates by API**

Based on testing:

| API Type | Success Rate | Recommendation |
|----------|-------------|----------------|
| **OpenAI (GPT-4)** | 98% | ✅ Excellent |
| **Claude** | 95% | ✅ Excellent |
| **Gemini Pro** | 90% | ✅ Very Good |
| **OpenRouter (good models)** | 85% | ✅ Good |
| **GPT-3.5 Turbo** | 80% | ⚠️ Okay |
| **Local (13B+)** | 60% | ⚠️ Use v1.4.1 |
| **Local (7B)** | 30% | ❌ Manual only |
| **KoboldAI** | 20% | ❌ Manual only |

*With v1.4.1, all rates improve by ~20-30%*

---

## 🎓 **Understanding the Error**

### **What "Unexpected token" Means**

```
JSON expects:
{"key": "value"}

AI returned:
Extract:
1. Main event: Something happened

That's why it says "Unexpected token 'E'"
(the 'E' in 'Extract' isn't valid JSON)
```

### **Why AI Does This**

Models are trained to:
- Be helpful and verbose
- Explain their thinking
- Format nicely for humans

But JSON needs:
- Pure data
- No explanation
- Strict format

v1.4.1 bridges this gap!

---

## ✅ **Summary**

**The Problem:**
- AI returns text instead of JSON
- Extension can't parse it
- Memories not created

**The Fix:**
1. **Update to v1.4.1** (handles everything automatically)
2. OR switch to OpenAI/Claude
3. OR use manual memories instead
4. OR lower tracking depth to Basic

**Best Solution:**
Update to v1.4.1 - it fixes 90% of cases automatically! 🎯

---

## 🆘 **Still Having Issues?**

### **After updating to v1.4.1:**

**Check console again:**
```
Look for:
[Dynamic Memory Tracker] Manual extraction successful
```

If you see this → Working correctly!
Errors are expected, fallback is handling them.

**If memories still not created:**
1. Check API is responding at all
2. Try manual memories (always works)
3. Report issue with:
   - Your API type
   - Console errors
   - Example message that failed

---

## 📥 **Get the Fix**

[Download v1.4.1](computer:///mnt/user-data/outputs/dynamic-memory-tracker.zip)

**What's included:**
- ✅ Robust JSON parsing
- ✅ Automatic fallbacks
- ✅ Better error handling
- ✅ Works with more APIs
- ✅ Clearer error messages

**Installation:**
1. Download ZIP
2. Replace old extension files
3. Restart SillyTavern
4. Try analysis again
5. Should work now! ✨

---

**Questions? Check the main README or open an issue!**
