/**
 * Dynamic Character Memory & Relationship Tracker
 * An extension for SillyTavern that tracks character relationships, emotional states,
 * and significant events for more consistent RP experiences.
 */

(function() {
    'use strict';

    const MODULE_NAME = 'dynamic_memory_tracker';
    const MEMORY_PANEL_ID = 'memory-tracker-panel';
    
    // Default settings
    const defaultSettings = Object.freeze({
        enabled: true,
        autoInject: true,
        maxMemoryEntries: 50,
        maxRelationshipTracking: 10,
        emotionalDecayRate: 0.1,
        useEmotionalContext: true,
        showNotifications: true,
        trackingDepth: 'detailed', // 'basic', 'detailed', 'comprehensive'
        groupChatMode: 'auto', // 'auto', 'combined', 'per-character'
    });

    let extensionSettings = {};
    let eventSource = null;
    let saveSettingsDebounced = null;

    /**
     * Initialize the extension
     */
    async function init() {
        const context = SillyTavern.getContext();
        eventSource = context.eventSource;
        saveSettingsDebounced = context.saveSettingsDebounced;
        
        // Load settings
        loadSettings();
        
        // Create UI
        createUI();
        
        // Register event listeners
        registerEventListeners();
        
        // Register slash commands
        registerSlashCommands();
        
        console.log('[Dynamic Memory Tracker] Extension initialized');
    }

    /**
     * Load extension settings
     */
    function loadSettings() {
        const context = SillyTavern.getContext();
        const allSettings = context.extensionSettings;
        
        if (!allSettings[MODULE_NAME]) {
            allSettings[MODULE_NAME] = structuredClone(defaultSettings);
        }
        
        // Ensure all default keys exist
        for (const key of Object.keys(defaultSettings)) {
            if (!Object.hasOwn(allSettings[MODULE_NAME], key)) {
                allSettings[MODULE_NAME][key] = defaultSettings[key];
            }
        }
        
        extensionSettings = allSettings[MODULE_NAME];
    }

    /**
     * Save extension settings
     */
    function saveSettings() {
        if (saveSettingsDebounced) {
            saveSettingsDebounced();
        }
    }

    /**
     * Create the UI for the extension
     */
    function createUI() {
        const settingsHtml = `
            <div class="memory-tracker-settings">
                <div class="inline-drawer">
                    <div class="inline-drawer-toggle inline-drawer-header">
                        <b>Dynamic Memory Tracker</b>
                        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                    </div>
                    <div class="inline-drawer-content">
                        <div class="memory-tracker-controls">
                            <label class="checkbox_label">
                                <input type="checkbox" id="memory-tracker-enabled" ${extensionSettings.enabled ? 'checked' : ''}>
                                <span>Enable Memory Tracking</span>
                            </label>
                            
                            <label class="checkbox_label">
                                <input type="checkbox" id="memory-tracker-auto-inject" ${extensionSettings.autoInject ? 'checked' : ''}>
                                <span>Auto-inject relevant memories into context</span>
                            </label>
                            
                            <label class="checkbox_label">
                                <input type="checkbox" id="memory-tracker-emotional-context" ${extensionSettings.useEmotionalContext ? 'checked' : ''}>
                                <span>Use emotional context</span>
                            </label>
                            
                            <label class="checkbox_label">
                                <input type="checkbox" id="memory-tracker-notifications" ${extensionSettings.showNotifications ? 'checked' : ''}>
                                <span>Show notifications</span>
                            </label>
                            
                            <label for="memory-tracker-max-entries">
                                Max Memory Entries: <span id="memory-tracker-max-entries-value">${extensionSettings.maxMemoryEntries}</span>
                            </label>
                            <input type="range" id="memory-tracker-max-entries" min="10" max="100" step="5" value="${extensionSettings.maxMemoryEntries}">
                            
                            <label for="memory-tracker-tracking-depth">Tracking Depth:</label>
                            <select id="memory-tracker-tracking-depth">
                                <option value="basic" ${extensionSettings.trackingDepth === 'basic' ? 'selected' : ''}>Basic</option>
                                <option value="detailed" ${extensionSettings.trackingDepth === 'detailed' ? 'selected' : ''}>Detailed</option>
                                <option value="comprehensive" ${extensionSettings.trackingDepth === 'comprehensive' ? 'selected' : ''}>Comprehensive</option>
                            </select>
                            
                            <label for="memory-tracker-group-mode">Group Chat Mode:</label>
                            <select id="memory-tracker-group-mode">
                                <option value="auto" ${extensionSettings.groupChatMode === 'auto' ? 'selected' : ''}>Auto-detect</option>
                                <option value="combined" ${extensionSettings.groupChatMode === 'combined' ? 'selected' : ''}>Combined (all together)</option>
                                <option value="per-character" ${extensionSettings.groupChatMode === 'per-character' ? 'selected' : ''}>Per-Character</option>
                            </select>
                            <div class="memory-tracker-hint">
                                <small>Per-Character mode tracks memories separately for each group member</small>
                            </div>
                            
                            <div class="memory-tracker-buttons">
                                <button id="memory-tracker-view-memories" class="menu_button">
                                    <i class="fa-solid fa-brain"></i>
                                    View Memories
                                </button>
                                <button id="memory-tracker-view-relationships" class="menu_button">
                                    <i class="fa-solid fa-heart"></i>
                                    View Relationships
                                </button>
                                <button id="memory-tracker-analyze-existing" class="menu_button menu_button_icon">
                                    <i class="fa-solid fa-clock-rotate-left"></i>
                                    Analyze Existing Chat
                                </button>
                                <button id="memory-tracker-analyze-range" class="menu_button menu_button_icon">
                                    <i class="fa-solid fa-sliders"></i>
                                    Analyze Range
                                </button>
                                <button id="memory-tracker-add-manual" class="menu_button menu_button_icon">
                                    <i class="fa-solid fa-plus"></i>
                                    Add Manual Memory
                                </button>
                                <button id="memory-tracker-import-lorebook" class="menu_button menu_button_icon">
                                    <i class="fa-solid fa-book"></i>
                                    Import from Lorebook
                                </button>
                                <button id="memory-tracker-export" class="menu_button">
                                    <i class="fa-solid fa-download"></i>
                                    Export Data
                                </button>
                            </div>
                            <div id="memory-tracker-analysis-status" class="memory-tracker-analysis-status" style="display: none;">
                                <div class="analysis-progress">
                                    <div class="analysis-progress-bar"></div>
                                </div>
                                <div class="analysis-text">Analyzing message <span class="analysis-current">0</span> of <span class="analysis-total">0</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const memoryPanelHtml = `
            <div id="${MEMORY_PANEL_ID}" class="memory-tracker-panel" style="display: none;">
                <div class="memory-tracker-panel-header">
                    <h3>Character Memories & Relationships</h3>
                    <button id="memory-tracker-close-panel" class="menu_button">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                <div class="memory-tracker-tabs">
                    <button class="memory-tracker-tab active" data-tab="memories">Memories</button>
                    <button class="memory-tracker-tab" data-tab="relationships">Relationships</button>
                    <button class="memory-tracker-tab" data-tab="timeline">Timeline</button>
                </div>
                <div class="memory-tracker-panel-content">
                    <div id="memory-tracker-tab-memories" class="memory-tracker-tab-content active">
                        <div class="memory-tracker-filters">
                            <input type="text" id="memory-search" placeholder="Search memories...">
                            <select id="memory-emotion-filter">
                                <option value="">All Emotions</option>
                                <option value="positive">Positive</option>
                                <option value="negative">Negative</option>
                                <option value="neutral">Neutral</option>
                            </select>
                        </div>
                        <div id="memory-list" class="memory-tracker-list"></div>
                    </div>
                    <div id="memory-tracker-tab-relationships" class="memory-tracker-tab-content">
                        <div id="relationship-graph" class="relationship-graph"></div>
                        <div id="relationship-details" class="relationship-details"></div>
                    </div>
                    <div id="memory-tracker-tab-timeline" class="memory-tracker-tab-content">
                        <div id="timeline-view" class="timeline-view"></div>
                    </div>
                </div>
            </div>
        `;

        // Add settings to extensions panel
        $('#extensions_settings2').append(settingsHtml);
        
        // Add memory panel to body
        $('body').append(memoryPanelHtml);

        // Attach event handlers
        attachUIEventHandlers();
    }

    /**
     * Attach event handlers to UI elements
     */
    function attachUIEventHandlers() {
        $('#memory-tracker-enabled').on('change', function() {
            extensionSettings.enabled = $(this).is(':checked');
            saveSettings();
        });

        $('#memory-tracker-auto-inject').on('change', function() {
            extensionSettings.autoInject = $(this).is(':checked');
            saveSettings();
        });

        $('#memory-tracker-emotional-context').on('change', function() {
            extensionSettings.useEmotionalContext = $(this).is(':checked');
            saveSettings();
        });

        $('#memory-tracker-notifications').on('change', function() {
            extensionSettings.showNotifications = $(this).is(':checked');
            saveSettings();
        });

        $('#memory-tracker-max-entries').on('input', function() {
            const value = $(this).val();
            $('#memory-tracker-max-entries-value').text(value);
            extensionSettings.maxMemoryEntries = parseInt(value);
            saveSettings();
        });

        $('#memory-tracker-tracking-depth').on('change', function() {
            extensionSettings.trackingDepth = $(this).val();
            saveSettings();
        });

        $('#memory-tracker-group-mode').on('change', function() {
            extensionSettings.groupChatMode = $(this).val();
            saveSettings();
        });

        $('#memory-tracker-view-memories').on('click', function() {
            openMemoryPanel('memories');
        });

        $('#memory-tracker-view-relationships').on('click', function() {
            openMemoryPanel('relationships');
        });

        $('#memory-tracker-export').on('click', function() {
            exportMemoryData();
        });

        $('#memory-tracker-analyze-existing').on('click', function() {
            analyzeExistingChat();
        });

        $('#memory-tracker-analyze-range').on('click', function() {
            openRangeAnalysisDialog();
        });

        $('#memory-tracker-add-manual').on('click', function() {
            openManualMemoryDialog();
        });

        $('#memory-tracker-import-lorebook').on('click', function() {
            openLorebookImportDialog();
        });

        $('#memory-tracker-close-panel').on('click', function() {
            $(`#${MEMORY_PANEL_ID}`).fadeOut(200);
        });

        $('.memory-tracker-tab').on('click', function() {
            const tab = $(this).data('tab');
            switchTab(tab);
        });

        // Memory search
        $('#memory-search').on('input', function() {
            filterMemories($(this).val());
        });

        $('#memory-emotion-filter').on('change', function() {
            filterMemoriesByEmotion($(this).val());
        });
    }

    /**
     * Register event listeners for chat events
     */
    function registerEventListeners() {
        eventSource.on('MESSAGE_RECEIVED', handleMessageReceived);
        eventSource.on('MESSAGE_SENT', handleMessageSent);
        eventSource.on('CHAT_CHANGED', handleChatChanged);
        eventSource.on('CHARACTER_MESSAGE_RENDERED', handleMessageRendered);
    }

    /**
     * Handle incoming AI messages
     */
    async function handleMessageReceived(data) {
        if (!extensionSettings.enabled) return;
        
        const context = SillyTavern.getContext();
        const message = context.chat[context.chat.length - 1];
        
        if (!message) return;
        
        // Analyze message for memory extraction
        await analyzeAndStoreMemory(message, 'character');
    }

    /**
     * Handle user messages
     */
    async function handleMessageSent(data) {
        if (!extensionSettings.enabled) return;
        
        const context = SillyTavern.getContext();
        const message = context.chat[context.chat.length - 1];
        
        if (!message) return;
        
        // Analyze message for memory extraction
        await analyzeAndStoreMemory(message, 'user');
    }

    /**
     * Handle chat changes
     */
    function handleChatChanged() {
        // Reload memories for the new chat
        loadChatMemories();
    }

    /**
     * Handle message rendering
     */
    function handleMessageRendered(data) {
        // Could add visual indicators here
    }

    /**
     * Analyze message and store relevant memories
     */
    async function analyzeAndStoreMemory(message, source) {
        const context = SillyTavern.getContext();
        const chatMetadata = context.chatMetadata;
        
        if (!chatMetadata.memoryTracker) {
            chatMetadata.memoryTracker = {
                memories: [],
                relationships: {},
                timeline: [],
                emotionalStates: {},
                characterMemories: {} // Per-character memories for group chats
            };
        }

        // Detect if this is a group chat
        const isGroupChat = context.groupId !== null && context.groupId !== undefined;
        const characterName = message.name || (message.is_user ? context.name1 : context.name2);

        // Extract memory using AI
        const memoryData = await extractMemoryFromMessage(message, source, characterName, isGroupChat);
        
        if (memoryData) {
            // Store memory
            chatMetadata.memoryTracker.memories.push(memoryData);
            
            // Store in per-character memory if group chat and per-character mode
            if (isGroupChat && extensionSettings.groupChatMode === 'per-character') {
                if (!chatMetadata.memoryTracker.characterMemories[characterName]) {
                    chatMetadata.memoryTracker.characterMemories[characterName] = [];
                }
                chatMetadata.memoryTracker.characterMemories[characterName].push(memoryData);
            }
            
            // Update timeline
            chatMetadata.memoryTracker.timeline.push({
                timestamp: Date.now(),
                messageIndex: context.chat.length - 1,
                summary: memoryData.summary,
                importance: memoryData.importance,
                characterName: characterName // Track who this is about
            });
            
            // Update relationships if applicable
            if (memoryData.relationship) {
                updateRelationship(chatMetadata.memoryTracker.relationships, memoryData.relationship, characterName);
            }
            
            // Update emotional states
            if (memoryData.emotion && extensionSettings.useEmotionalContext) {
                updateEmotionalState(chatMetadata.memoryTracker.emotionalStates, memoryData.emotion, characterName);
            }
            
            // Trim old memories if needed
            trimMemories(chatMetadata.memoryTracker);
            
            // Save metadata
            await context.saveMetadata();
            
            // Show notification if enabled
            if (extensionSettings.showNotifications && memoryData.importance > 0.7) {
                const prefix = isGroupChat ? `[${characterName}] ` : '';
                showNotification(`${prefix}New significant memory: ${memoryData.summary}`);
            }
        }
    }

    /**
     * Extract memory data from a message using AI
     */
    async function extractMemoryFromMessage(message, source, characterName, isGroupChat) {
        const context = SillyTavern.getContext();
        
        // Build extraction prompt based on tracking depth
        const depth = extensionSettings.trackingDepth;
        let extractionPrompt = '';
        
        const groupChatPrefix = isGroupChat ? `This is from a group chat. The character speaking is: ${characterName}\n\n` : '';
        
        if (depth === 'basic') {
            extractionPrompt = `${groupChatPrefix}Analyze this message and extract any important facts or events. Keep it brief.

Message: "${message.mes}"

Return ONLY a JSON object (no other text) with this exact structure:
{
  "summary": "one sentence description",
  "importance": 0.5,
  "emotion": "neutral",
  "keywords": ["keyword1", "keyword2"]
}`;
        } else if (depth === 'detailed') {
            extractionPrompt = `${groupChatPrefix}Analyze this message for memory extraction. Focus on significant events, emotional moments, character development, and relationship changes.

Message: "${message.mes}"

Return ONLY a JSON object (no other text, no markdown, no explanation) with this exact structure:
{
  "summary": "brief summary of main event",
  "importance": 0.7,
  "emotion": "describe emotion",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "relationship": {
    "type": "friendship",
    "change": "improved",
    "between": "CharA and CharB"
  },
  "continuityNote": "important detail to remember"
}

If no significant event, return: {"summary": "none", "importance": 0.0, "emotion": "neutral", "keywords": []}`;
        } else { // comprehensive
            extractionPrompt = `${groupChatPrefix}Perform a comprehensive analysis of this message for character memory tracking.

Message: "${message.mes}"

Return ONLY a JSON object (no markdown formatting, no code blocks, no explanation) with this structure:
{
  "summary": "detailed summary",
  "importance": 0.8,
  "emotion": "emotional analysis",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "relationship": {
    "type": "type of relationship",
    "change": "improved/worsened/neutral",
    "between": "Character names"
  },
  "continuityNote": "important continuity note"
}`;
        }

        try {
            // Try with JSON schema if supported
            const result = await context.generateQuietPrompt({
                quietPrompt: extractionPrompt,
                quietToLoud: true
            });

            if (!result) {
                console.log('[Dynamic Memory Tracker] No result from AI');
                return null;
            }

            // Try to parse the result
            let memoryData = null;
            
            // Remove markdown code blocks if present
            let cleanResult = result.trim();
            cleanResult = cleanResult.replace(/```json\n?/g, '');
            cleanResult = cleanResult.replace(/```\n?/g, '');
            cleanResult = cleanResult.trim();
            
            // Try to find JSON in the response
            const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanResult = jsonMatch[0];
            }
            
            try {
                memoryData = JSON.parse(cleanResult);
            } catch (parseError) {
                console.warn('[Dynamic Memory Tracker] Failed to parse JSON, attempting manual extraction:', parseError);
                
                // Fallback: try to extract information manually from the text
                memoryData = extractMemoryManually(result, message.mes);
                
                if (!memoryData) {
                    console.error('[Dynamic Memory Tracker] Could not extract memory data');
                    return null;
                }
            }

            // Validate we have minimum required fields
            if (!memoryData.summary || memoryData.summary === 'none') {
                return null;
            }

            // Ensure all required fields exist with defaults
            memoryData.summary = memoryData.summary || 'Event occurred';
            memoryData.importance = typeof memoryData.importance === 'number' ? memoryData.importance : 0.5;
            memoryData.emotion = memoryData.emotion || 'neutral';
            memoryData.keywords = Array.isArray(memoryData.keywords) ? memoryData.keywords : ['general'];
            memoryData.continuityNote = memoryData.continuityNote || '';
            
            // Add metadata
            memoryData.timestamp = Date.now();
            memoryData.source = source;
            memoryData.characterName = characterName;
            memoryData.messageIndex = context.chat.length - 1;
            
            return memoryData;
            
        } catch (error) {
            console.error('[Dynamic Memory Tracker] Error extracting memory:', error);
            return null;
        }
    }

    /**
     * Fallback manual extraction when JSON parsing fails
     */
    function extractMemoryManually(aiResponse, originalMessage) {
        try {
            // Try to extract key information from free-form text
            const lines = aiResponse.split('\n');
            const memoryData = {
                summary: '',
                importance: 0.5,
                emotion: 'neutral',
                keywords: [],
                continuityNote: ''
            };
            
            // Look for patterns in the response
            for (const line of lines) {
                const lower = line.toLowerCase().trim();
                
                // Summary
                if (lower.includes('summary') || lower.includes('main event') || lower.includes('event:')) {
                    const summaryMatch = line.match(/[:：](.*)/);
                    if (summaryMatch) {
                        memoryData.summary = summaryMatch[1].trim();
                    }
                }
                
                // Importance
                if (lower.includes('importance')) {
                    const importanceMatch = line.match(/(\d+\.?\d*)/);
                    if (importanceMatch) {
                        memoryData.importance = parseFloat(importanceMatch[1]);
                        if (memoryData.importance > 1) memoryData.importance /= 10;
                    }
                }
                
                // Emotion
                if (lower.includes('emotion') || lower.includes('tone') || lower.includes('feeling')) {
                    const emotionMatch = line.match(/[:：](.*)/);
                    if (emotionMatch) {
                        memoryData.emotion = emotionMatch[1].trim();
                    }
                }
                
                // Keywords
                if (lower.includes('keyword') || lower.includes('tags')) {
                    const keywordMatch = line.match(/[:：](.*)/);
                    if (keywordMatch) {
                        memoryData.keywords = keywordMatch[1]
                            .split(/[,，、]/)
                            .map(k => k.trim())
                            .filter(k => k.length > 0);
                    }
                }
                
                // Continuity note
                if (lower.includes('continuity') || lower.includes('remember') || lower.includes('note')) {
                    const noteMatch = line.match(/[:：](.*)/);
                    if (noteMatch) {
                        memoryData.continuityNote = noteMatch[1].trim();
                    }
                }
            }
            
            // If we still don't have a summary, create a simple one
            if (!memoryData.summary || memoryData.summary.length < 5) {
                memoryData.summary = originalMessage.substring(0, 100).trim();
                if (originalMessage.length > 100) memoryData.summary += '...';
            }
            
            // Ensure we have at least one keyword
            if (memoryData.keywords.length === 0) {
                memoryData.keywords = ['conversation'];
            }
            
            return memoryData;
            
        } catch (error) {
            console.error('[Dynamic Memory Tracker] Manual extraction failed:', error);
            return null;
        }
    }

    /**
     * Update relationship data
     */
    function updateRelationship(relationships, relationshipData, characterName) {
        // For group chats, use the 'between' field if available
        const key = relationshipData.between || relationshipData.type || 'general';
        const fullKey = characterName ? `${characterName}:${key}` : key;
        
        if (!relationships[fullKey]) {
            relationships[fullKey] = {
                level: 0,
                history: [],
                lastUpdate: Date.now(),
                characterName: characterName,
                relationshipType: relationshipData.type
            };
        }

        relationships[fullKey].history.push({
            timestamp: Date.now(),
            change: relationshipData.change
        });
        
        // Update relationship level based on change
        const changeMap = {
            'improved': 0.1,
            'worsened': -0.1,
            'neutral': 0
        };
        
        relationships[fullKey].level += changeMap[relationshipData.change] || 0;
        relationships[fullKey].level = Math.max(-1, Math.min(1, relationships[fullKey].level));
        relationships[fullKey].lastUpdate = Date.now();
    }

    /**
     * Update emotional state
     */
    function updateEmotionalState(emotionalStates, emotion, characterName) {
        const timestamp = Date.now();
        const key = characterName || 'general';
        
        if (!emotionalStates[key]) {
            emotionalStates[key] = {
                current: emotion,
                history: [],
                characterName: characterName
            };
        }

        emotionalStates[key].history.push({
            timestamp: timestamp,
            emotion: emotion
        });

        emotionalStates[key].current = emotion;
        
        // Apply decay to old emotional states
        applyEmotionalDecay(emotionalStates[key]);
    }

    /**
     * Apply emotional decay to old states
     */
    function applyEmotionalDecay(emotionalStates) {
        const now = Date.now();
        const decayThreshold = 1000 * 60 * 60; // 1 hour
        
        emotionalStates.history = emotionalStates.history.filter(entry => {
            return (now - entry.timestamp) < decayThreshold;
        });
    }

    /**
     * Trim old memories based on max entries
     */
    function trimMemories(trackerData) {
        if (trackerData.memories.length > extensionSettings.maxMemoryEntries) {
            // Sort by importance and keep the most important ones
            trackerData.memories.sort((a, b) => b.importance - a.importance);
            trackerData.memories = trackerData.memories.slice(0, extensionSettings.maxMemoryEntries);
        }
    }

    /**
     * Load chat memories
     */
    function loadChatMemories() {
        const context = SillyTavern.getContext();
        const chatMetadata = context.chatMetadata;
        
        if (!chatMetadata.memoryTracker) {
            chatMetadata.memoryTracker = {
                memories: [],
                relationships: {},
                timeline: [],
                emotionalStates: {}
            };
        }
        
        // Update UI if panel is open
        if ($(`#${MEMORY_PANEL_ID}`).is(':visible')) {
            renderMemories();
            renderRelationships();
            renderTimeline();
        }
    }

    /**
     * Open the memory panel
     */
    function openMemoryPanel(tab = 'memories') {
        loadChatMemories();
        switchTab(tab);
        $(`#${MEMORY_PANEL_ID}`).fadeIn(200);
    }

    /**
     * Switch between tabs in the memory panel
     */
    function switchTab(tab) {
        $('.memory-tracker-tab').removeClass('active');
        $(`.memory-tracker-tab[data-tab="${tab}"]`).addClass('active');
        
        $('.memory-tracker-tab-content').removeClass('active');
        $(`#memory-tracker-tab-${tab}`).addClass('active');
        
        // Render content for the active tab
        switch(tab) {
            case 'memories':
                renderMemories();
                break;
            case 'relationships':
                renderRelationships();
                break;
            case 'timeline':
                renderTimeline();
                break;
        }
    }

    /**
     * Render memories in the panel
     */
    function renderMemories() {
        const context = SillyTavern.getContext();
        const chatMetadata = context.chatMetadata;
        
        if (!chatMetadata.memoryTracker) return;
        
        const memories = chatMetadata.memoryTracker.memories;
        const memoryList = $('#memory-list');
        memoryList.empty();
        
        if (memories.length === 0) {
            memoryList.append('<p class="memory-tracker-empty">No memories recorded yet.</p>');
            return;
        }

        // Sort by timestamp (most recent first)
        const sortedMemories = [...memories].sort((a, b) => b.timestamp - a.timestamp);
        
        // Check if this is a group chat
        const isGroupChat = context.groupId !== null && context.groupId !== undefined;
        
        sortedMemories.forEach(memory => {
            const characterBadge = memory.characterName && isGroupChat 
                ? `<span class="memory-tracker-character-badge">${memory.characterName}</span>` 
                : '';
            
            const memoryHtml = `
                <div class="memory-tracker-item" data-importance="${memory.importance}">
                    <div class="memory-tracker-item-header">
                        ${characterBadge}
                        <span class="memory-tracker-importance" style="opacity: ${memory.importance}">
                            ${'★'.repeat(Math.ceil(memory.importance * 5))}
                        </span>
                        <span class="memory-tracker-emotion">${memory.emotion}</span>
                        <span class="memory-tracker-date">${new Date(memory.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="memory-tracker-item-content">
                        <p class="memory-tracker-summary">${memory.summary}</p>
                        ${memory.continuityNote ? `<p class="memory-tracker-note"><i class="fa-solid fa-note-sticky"></i> ${memory.continuityNote}</p>` : ''}
                        <div class="memory-tracker-keywords">
                            ${memory.keywords.map(kw => `<span class="memory-tracker-keyword">${kw}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            memoryList.append(memoryHtml);
        });
    }

    /**
     * Render relationships in the panel
     */
    function renderRelationships() {
        const context = SillyTavern.getContext();
        const chatMetadata = context.chatMetadata;
        
        if (!chatMetadata.memoryTracker) return;
        
        const relationships = chatMetadata.memoryTracker.relationships;
        const relationshipDetails = $('#relationship-details');
        relationshipDetails.empty();
        
        if (Object.keys(relationships).length === 0) {
            relationshipDetails.append('<p class="memory-tracker-empty">No relationship data recorded yet.</p>');
            return;
        }

        Object.entries(relationships).forEach(([type, data]) => {
            const level = data.level;
            const levelPercent = ((level + 1) / 2) * 100; // Convert -1 to 1 range to 0-100%
            const levelClass = level > 0.3 ? 'positive' : (level < -0.3 ? 'negative' : 'neutral');
            
            const relationshipHtml = `
                <div class="memory-tracker-relationship">
                    <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                    <div class="relationship-level ${levelClass}">
                        <div class="relationship-level-bar" style="width: ${levelPercent}%"></div>
                        <span class="relationship-level-value">${(level * 100).toFixed(0)}%</span>
                    </div>
                    <div class="relationship-history">
                        <h5>Recent Changes:</h5>
                        <ul>
                            ${data.history.slice(-5).reverse().map(entry => `
                                <li>
                                    <span class="relationship-change">${entry.change}</span>
                                    <span class="relationship-date">${new Date(entry.timestamp).toLocaleString()}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
            relationshipDetails.append(relationshipHtml);
        });
    }

    /**
     * Render timeline in the panel
     */
    function renderTimeline() {
        const context = SillyTavern.getContext();
        const chatMetadata = context.chatMetadata;
        
        if (!chatMetadata.memoryTracker) return;
        
        const timeline = chatMetadata.memoryTracker.timeline;
        const timelineView = $('#timeline-view');
        timelineView.empty();
        
        if (timeline.length === 0) {
            timelineView.append('<p class="memory-tracker-empty">No timeline events recorded yet.</p>');
            return;
        }

        // Sort by timestamp
        const sortedTimeline = [...timeline].sort((a, b) => a.timestamp - b.timestamp);
        
        sortedTimeline.forEach((event, index) => {
            const eventHtml = `
                <div class="timeline-event" data-importance="${event.importance}">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-time">${new Date(event.timestamp).toLocaleString()}</div>
                        <div class="timeline-summary">${event.summary}</div>
                        <button class="timeline-jump" data-message-index="${event.messageIndex}">
                            Jump to message
                        </button>
                    </div>
                </div>
            `;
            timelineView.append(eventHtml);
        });

        // Attach jump handlers
        $('.timeline-jump').on('click', function() {
            const messageIndex = $(this).data('message-index');
            jumpToMessage(messageIndex);
        });
    }

    /**
     * Jump to a specific message in the chat
     */
    function jumpToMessage(messageIndex) {
        const messageElement = $(`.mes[mesid="${messageIndex}"]`);
        if (messageElement.length) {
            messageElement[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            messageElement.addClass('highlight-flash');
            setTimeout(() => messageElement.removeClass('highlight-flash'), 2000);
        }
    }

    /**
     * Filter memories by search term
     */
    function filterMemories(searchTerm) {
        const term = searchTerm.toLowerCase();
        
        $('.memory-tracker-item').each(function() {
            const text = $(this).text().toLowerCase();
            if (text.includes(term)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    /**
     * Filter memories by emotion
     */
    function filterMemoriesByEmotion(emotion) {
        if (!emotion) {
            $('.memory-tracker-item').show();
            return;
        }

        $('.memory-tracker-item').each(function() {
            const itemEmotion = $(this).find('.memory-tracker-emotion').text().toLowerCase();
            if (itemEmotion.includes(emotion)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    /**
     * Open dialog to add a manual memory
     */
    function openManualMemoryDialog() {
        const dialogHtml = `
            <div id="memory-manual-dialog" class="memory-range-dialog">
                <div class="memory-range-content">
                    <h3>Add Manual Memory</h3>
                    <p>Create a custom memory entry for important facts or events.</p>
                    
                    <div class="manual-memory-form">
                        <label>
                            <strong>Summary</strong> (required)
                            <textarea id="manual-summary" placeholder="Brief description of the event or fact..." rows="3"></textarea>
                        </label>
                        
                        <label>
                            <strong>Importance</strong> (0.0 - 1.0)
                            <input type="range" id="manual-importance" min="0" max="1" step="0.05" value="0.7">
                            <span id="manual-importance-value">0.7</span>
                        </label>
                        
                        <label>
                            <strong>Emotion/Tone</strong>
                            <input type="text" id="manual-emotion" placeholder="e.g., happy, tense, revelatory" value="neutral">
                        </label>
                        
                        <label>
                            <strong>Keywords</strong> (comma-separated)
                            <textarea id="manual-keywords" placeholder="e.g., first meeting, secret, character name" rows="2"></textarea>
                        </label>
                        
                        <label>
                            <strong>Continuity Note</strong> (optional)
                            <textarea id="manual-continuity" placeholder="Important details to remember for future reference..." rows="2"></textarea>
                        </label>
                        
                        <label>
                            <strong>Relationship Impact</strong> (optional)
                            <select id="manual-relationship-type">
                                <option value="">None</option>
                                <option value="romance">Romance</option>
                                <option value="friendship">Friendship</option>
                                <option value="trust">Trust</option>
                                <option value="professional">Professional</option>
                                <option value="family">Family</option>
                                <option value="rivalry">Rivalry</option>
                            </select>
                            <select id="manual-relationship-change">
                                <option value="neutral">No change</option>
                                <option value="improved">Improved</option>
                                <option value="worsened">Worsened</option>
                            </select>
                        </label>
                    </div>
                    
                    <div class="range-buttons">
                        <button id="manual-save-btn" class="menu_button">Save Memory</button>
                        <button id="manual-cancel-btn" class="menu_button">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        $('#memory-manual-dialog').remove();
        $('body').append(dialogHtml);
        $('#memory-manual-dialog').fadeIn(200);
        
        // Update importance display
        $('#manual-importance').on('input', function() {
            $('#manual-importance-value').text($(this).val());
        });
        
        // Save button
        $('#manual-save-btn').on('click', function() {
            const summary = $('#manual-summary').val().trim();
            
            if (!summary) {
                showNotification('Summary is required');
                return;
            }
            
            const keywords = $('#manual-keywords').val()
                .split(',')
                .map(k => k.trim())
                .filter(k => k.length > 0);
            
            const memoryData = {
                summary: summary,
                importance: parseFloat($('#manual-importance').val()),
                emotion: $('#manual-emotion').val().trim() || 'neutral',
                keywords: keywords.length > 0 ? keywords : ['manual'],
                continuityNote: $('#manual-continuity').val().trim() || '',
                timestamp: Date.now(),
                source: 'manual',
                messageIndex: -1 // Indicates manual entry
            };
            
            // Add relationship if specified
            const relType = $('#manual-relationship-type').val();
            const relChange = $('#manual-relationship-change').val();
            
            if (relType && relChange !== 'neutral') {
                memoryData.relationship = {
                    type: relType,
                    change: relChange
                };
            }
            
            addManualMemory(memoryData);
            
            $('#memory-manual-dialog').fadeOut(200, function() {
                $(this).remove();
            });
        });
        
        // Cancel button
        $('#manual-cancel-btn').on('click', function() {
            $('#memory-manual-dialog').fadeOut(200, function() {
                $(this).remove();
            });
        });
    }

    /**
     * Add a manual memory to the tracker
     */
    async function addManualMemory(memoryData) {
        const context = SillyTavern.getContext();
        const chatMetadata = context.chatMetadata;
        
        if (!chatMetadata.memoryTracker) {
            chatMetadata.memoryTracker = {
                memories: [],
                relationships: {},
                timeline: [],
                emotionalStates: {}
            };
        }
        
        // Add memory
        chatMetadata.memoryTracker.memories.push(memoryData);
        
        // Update timeline
        chatMetadata.memoryTracker.timeline.push({
            timestamp: memoryData.timestamp,
            messageIndex: -1,
            summary: memoryData.summary,
            importance: memoryData.importance
        });
        
        // Update relationships if specified
        if (memoryData.relationship) {
            updateRelationship(
                chatMetadata.memoryTracker.relationships,
                memoryData.relationship
            );
        }
        
        // Update emotional states
        if (memoryData.emotion && extensionSettings.useEmotionalContext) {
            updateEmotionalState(
                chatMetadata.memoryTracker.emotionalStates,
                memoryData.emotion
            );
        }
        
        // Save metadata
        await context.saveMetadata();
        
        showNotification(`Manual memory added: ${memoryData.summary.substring(0, 50)}...`);
        
        // Refresh UI if panel is open
        if ($(`#${MEMORY_PANEL_ID}`).is(':visible')) {
            renderMemories();
        }
    }

    /**
     * Open dialog to import from lorebook
     */
    function openLorebookImportDialog() {
        const context = SillyTavern.getContext();
        
        // Get World Info entries from multiple sources
        let worldInfo = [];
        
        try {
            // Method 1: Try to get from world_info_data (newer ST versions)
            if (context.world_info_data && Array.isArray(context.world_info_data)) {
                worldInfo = context.world_info_data;
            }
            // Method 2: Try worldInfoData (alternative property name)
            else if (context.worldInfoData && Array.isArray(context.worldInfoData)) {
                worldInfo = context.worldInfoData;
            }
            // Method 3: Try to get from chat metadata
            else if (context.chatMetadata && context.chatMetadata.world_info) {
                worldInfo = context.chatMetadata.world_info;
            }
            // Method 4: Try to access through characters
            else if (context.characters && context.characters[context.characterId]) {
                const char = context.characters[context.characterId];
                if (char.data && char.data.character_book && char.data.character_book.entries) {
                    worldInfo = char.data.character_book.entries;
                }
            }
            // Method 5: Try direct access to world_info
            else if (window.world_info && Array.isArray(window.world_info.entries)) {
                worldInfo = window.world_info.entries;
            }
            // Method 6: Try getWorldInfoSettings
            else if (typeof SillyTavern.getWorldInfoSettings === 'function') {
                const wiSettings = SillyTavern.getWorldInfoSettings();
                if (wiSettings && wiSettings.entries) {
                    worldInfo = wiSettings.entries;
                }
            }
            
            console.log('[Dynamic Memory Tracker] Found', worldInfo.length, 'World Info entries');
            
        } catch (error) {
            console.error('[Dynamic Memory Tracker] Error accessing world info:', error);
        }
        
        // Also try to get character-specific lorebook
        try {
            if (context.characters && context.characters[context.characterId]) {
                const char = context.characters[context.characterId];
                
                // V2 character cards
                if (char.data && char.data.character_book) {
                    const charBook = char.data.character_book;
                    if (charBook.entries && Array.isArray(charBook.entries)) {
                        console.log('[Dynamic Memory Tracker] Found', charBook.entries.length, 'character book entries');
                        worldInfo = [...worldInfo, ...charBook.entries];
                    }
                }
                
                // Alternative structure
                if (char.book && Array.isArray(char.book)) {
                    console.log('[Dynamic Memory Tracker] Found', char.book.length, 'character book entries (alt)');
                    worldInfo = [...worldInfo, ...char.book];
                }
            }
        } catch (error) {
            console.error('[Dynamic Memory Tracker] Error accessing character book:', error);
        }
        
        // Remove duplicates based on content
        const seen = new Set();
        worldInfo = worldInfo.filter(entry => {
            const key = (entry.content || entry.description || '') + (entry.key || entry.keys || []).join(',');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        
        if (worldInfo.length === 0) {
            showNotification(
                'No World Info/Lorebook entries found.\n\n' +
                'Make sure:\n' +
                '• World Info is enabled (book icon in toolbar)\n' +
                '• Character has lorebook entries\n' +
                '• Or global World Info file is loaded\n\n' +
                'Check browser console (F12) for details.'
            );
            return;
        }
        
        console.log('[Dynamic Memory Tracker] Total unique entries:', worldInfo.length);
        
        // Create dialog with lorebook entries
        let entriesHtml = '';
        try {
            entriesHtml = worldInfo.map((entry, index) => {
                // Handle different entry formats
                const content = entry.content || entry.description || entry.text || '';
                
                // Handle different key formats
                let keys = '';
                if (Array.isArray(entry.key)) {
                    keys = entry.key.join(', ');
                } else if (Array.isArray(entry.keys)) {
                    keys = entry.keys.join(', ');
                } else if (typeof entry.key === 'string') {
                    keys = entry.key;
                } else if (typeof entry.keys === 'string') {
                    keys = entry.keys;
                }
                
                const comment = entry.comment || entry.title || entry.name || `Entry ${index + 1}`;
                
                // Escape HTML to prevent issues
                const safeComment = $('<div>').text(comment).html();
                const safeKeys = $('<div>').text(keys || 'none').html();
                const safeContent = $('<div>').text(content.substring(0, 150)).html();
                
                return `
                    <div class="lorebook-entry">
                        <label>
                            <input type="checkbox" class="lorebook-checkbox" data-index="${index}">
                            <div class="lorebook-entry-content">
                                <div class="lorebook-entry-title">${safeComment}</div>
                                <div class="lorebook-entry-keys">Keys: ${safeKeys}</div>
                                <div class="lorebook-entry-text">${safeContent}${content.length > 150 ? '...' : ''}</div>
                            </div>
                        </label>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('[Dynamic Memory Tracker] Error creating entry HTML:', error);
            showNotification('Error displaying entries. Check console for details.');
            return;
        }
        
        const dialogHtml = `
            <div id="memory-lorebook-dialog" class="memory-range-dialog">
                <div class="memory-range-content" style="max-width: 800px;">
                    <h3>Import from Lorebook</h3>
                    <p>Found <strong>${worldInfo.length}</strong> World Info entries. Select which to import:</p>
                    
                    <div class="lorebook-options">
                        <label>
                            <input type="checkbox" id="lorebook-select-all">
                            <strong>Select All</strong>
                        </label>
                        <label>
                            Default Importance: 
                            <input type="range" id="lorebook-importance" min="0.3" max="1" step="0.05" value="0.7">
                            <span id="lorebook-importance-value">0.7</span>
                        </label>
                    </div>
                    
                    <div class="lorebook-entries-list">
                        ${entriesHtml}
                    </div>
                    
                    <div class="range-buttons">
                        <button id="lorebook-import-btn" class="menu_button">Import Selected</button>
                        <button id="lorebook-cancel-btn" class="menu_button">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        console.log('[Dynamic Memory Tracker] Creating lorebook dialog');
        $('#memory-lorebook-dialog').remove();
        $('body').append(dialogHtml);
        console.log('[Dynamic Memory Tracker] Dialog appended to body');
        $('#memory-lorebook-dialog').fadeIn(200);
        console.log('[Dynamic Memory Tracker] Dialog should be visible');
        
        // Update importance display
        $('#lorebook-importance').on('input', function() {
            $('#lorebook-importance-value').text($(this).val());
        });
        
        // Select all toggle
        $('#lorebook-select-all').on('change', function() {
            console.log('[Dynamic Memory Tracker] Select all toggled');
            $('.lorebook-checkbox').prop('checked', $(this).is(':checked'));
        });
        
        // Import button
        $('#lorebook-import-btn').on('click', function() {
            console.log('[Dynamic Memory Tracker] Import button clicked');
            const selectedIndices = [];
            $('.lorebook-checkbox:checked').each(function() {
                selectedIndices.push(parseInt($(this).data('index')));
            });
            
            console.log('[Dynamic Memory Tracker] Selected indices:', selectedIndices);
            
            if (selectedIndices.length === 0) {
                showNotification('No entries selected');
                return;
            }
            
            const importance = parseFloat($('#lorebook-importance').val());
            console.log('[Dynamic Memory Tracker] Importing with importance:', importance);
            
            $('#memory-lorebook-dialog').fadeOut(200, function() {
                $(this).remove();
            });
            
            importLorebookEntries(worldInfo, selectedIndices, importance);
        });
        
        // Cancel button
        $('#lorebook-cancel-btn').on('click', function() {
            console.log('[Dynamic Memory Tracker] Cancel button clicked');
            $('#memory-lorebook-dialog').fadeOut(200, function() {
                $(this).remove();
            });
        });
    }

    /**
     * Import selected lorebook entries as memories
     */
    async function importLorebookEntries(worldInfo, selectedIndices, importance) {
        const context = SillyTavern.getContext();
        const chatMetadata = context.chatMetadata;
        
        if (!chatMetadata.memoryTracker) {
            chatMetadata.memoryTracker = {
                memories: [],
                relationships: {},
                timeline: [],
                emotionalStates: {},
                characterMemories: {}
            };
        }
        
        let imported = 0;
        
        for (const index of selectedIndices) {
            const entry = worldInfo[index];
            
            // Handle different content field names
            const content = entry.content || entry.description || entry.text || '';
            
            // Handle different key formats
            let keys = [];
            if (Array.isArray(entry.key)) {
                keys = entry.key;
            } else if (Array.isArray(entry.keys)) {
                keys = entry.keys;
            } else if (typeof entry.key === 'string') {
                keys = entry.key.split(',').map(k => k.trim());
            } else if (typeof entry.keys === 'string') {
                keys = entry.keys.split(',').map(k => k.trim());
            }
            
            const comment = entry.comment || entry.title || entry.name || `Lorebook Entry ${index + 1}`;
            
            // Create memory from lorebook entry
            const memoryData = {
                summary: content.length > 200 
                    ? `${comment}: ${content.substring(0, 200)}...`
                    : `${comment}: ${content}`,
                importance: importance,
                emotion: 'factual',
                keywords: [...keys, 'lorebook', 'imported'].filter(k => k && k.length > 0),
                continuityNote: `Imported from World Info: ${comment}`,
                timestamp: Date.now(),
                source: 'lorebook',
                messageIndex: -1
            };
            
            chatMetadata.memoryTracker.memories.push(memoryData);
            
            chatMetadata.memoryTracker.timeline.push({
                timestamp: memoryData.timestamp,
                messageIndex: -1,
                summary: comment,
                importance: importance
            });
            
            imported++;
        }
        
        // Save metadata
        await context.saveMetadata();
        
        showNotification(`Imported ${imported} ${imported === 1 ? 'entry' : 'entries'} from lorebook`);
        
        // Refresh UI if panel is open
        if ($(`#${MEMORY_PANEL_ID}`).is(':visible')) {
            renderMemories();
        }
    }

    /**
     * Open range analysis dialog for selective message analysis
     */
    function openRangeAnalysisDialog() {
        const context = SillyTavern.getContext();
        const chat = context.chat;
        
        if (!chat || chat.length === 0) {
            showNotification('No messages to analyze');
            return;
        }

        const totalMessages = chat.length;
        
        // Create dialog HTML
        const dialogHtml = `
            <div id="memory-range-dialog" class="memory-range-dialog">
                <div class="memory-range-content">
                    <h3>Analyze Message Range</h3>
                    <p>Total messages in chat: <strong>${totalMessages}</strong></p>
                    <p>Select which messages to analyze:</p>
                    
                    <div class="range-option">
                        <label>
                            <input type="radio" name="range-type" value="recent" checked>
                            <strong>Recent messages</strong> (recommended for long chats)
                        </label>
                        <div class="range-input">
                            <label>Last <input type="number" id="range-recent-count" value="200" min="10" max="${totalMessages}"> messages</label>
                        </div>
                    </div>
                    
                    <div class="range-option">
                        <label>
                            <input type="radio" name="range-type" value="custom">
                            <strong>Custom range</strong>
                        </label>
                        <div class="range-input">
                            <label>From message <input type="number" id="range-start" value="1" min="1" max="${totalMessages}"></label>
                            <label>To message <input type="number" id="range-end" value="${totalMessages}" min="1" max="${totalMessages}"></label>
                        </div>
                    </div>
                    
                    <div class="range-option">
                        <label>
                            <input type="radio" name="range-type" value="all">
                            <strong>All messages</strong> (may take a long time!)
                        </label>
                    </div>
                    
                    <div class="range-estimate">
                        <p><strong>Estimated time:</strong> <span id="estimate-time">3-5 minutes</span></p>
                        <p><strong>Estimated tokens:</strong> <span id="estimate-tokens">30k-50k</span></p>
                    </div>
                    
                    <div class="range-buttons">
                        <button id="range-analyze-btn" class="menu_button">Start Analysis</button>
                        <button id="range-cancel-btn" class="menu_button">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing dialog if any
        $('#memory-range-dialog').remove();
        
        // Add to body
        $('body').append(dialogHtml);
        
        // Show dialog
        $('#memory-range-dialog').fadeIn(200);
        
        // Update estimates on input change
        function updateEstimates() {
            const rangeType = $('input[name="range-type"]:checked').val();
            let messageCount = 0;
            
            if (rangeType === 'recent') {
                messageCount = parseInt($('#range-recent-count').val()) || 200;
            } else if (rangeType === 'custom') {
                const start = parseInt($('#range-start').val()) || 1;
                const end = parseInt($('#range-end').val()) || totalMessages;
                messageCount = Math.max(0, end - start + 1);
            } else {
                messageCount = totalMessages;
            }
            
            // Calculate estimates based on tracking depth
            const depth = extensionSettings.trackingDepth || 'detailed';
            let tokensPerMessage = 400; // detailed average
            
            if (depth === 'basic') tokensPerMessage = 225;
            if (depth === 'comprehensive') tokensPerMessage = 650;
            
            const totalTokens = messageCount * tokensPerMessage;
            const timeMinutes = Math.ceil(messageCount / 20); // ~20 messages per minute
            
            // Update UI
            $('#estimate-time').text(
                timeMinutes < 60 
                    ? `${timeMinutes}-${Math.ceil(timeMinutes * 1.5)} minutes`
                    : `${Math.floor(timeMinutes / 60)}-${Math.ceil(timeMinutes * 1.5 / 60)} hours`
            );
            
            $('#estimate-tokens').text(
                totalTokens < 1000 
                    ? `${totalTokens.toFixed(0)} tokens`
                    : `${(totalTokens / 1000).toFixed(0)}k tokens`
            );
        }
        
        // Attach event handlers
        $('input[name="range-type"]').on('change', updateEstimates);
        $('#range-recent-count, #range-start, #range-end').on('input', updateEstimates);
        
        $('#range-analyze-btn').on('click', function() {
            const rangeType = $('input[name="range-type"]:checked').val();
            let start, end;
            
            if (rangeType === 'recent') {
                const count = parseInt($('#range-recent-count').val()) || 200;
                start = Math.max(0, totalMessages - count);
                end = totalMessages - 1;
            } else if (rangeType === 'custom') {
                start = (parseInt($('#range-start').val()) || 1) - 1; // Convert to 0-indexed
                end = (parseInt($('#range-end').val()) || totalMessages) - 1;
            } else {
                start = 0;
                end = totalMessages - 1;
            }
            
            // Validate range
            if (start < 0) start = 0;
            if (end >= totalMessages) end = totalMessages - 1;
            if (start > end) {
                showNotification('Invalid range: start must be before end');
                return;
            }
            
            $('#memory-range-dialog').fadeOut(200, function() {
                $(this).remove();
            });
            
            analyzeMessageRange(start, end);
        });
        
        $('#range-cancel-btn').on('click', function() {
            $('#memory-range-dialog').fadeOut(200, function() {
                $(this).remove();
            });
        });
        
        // Initial estimate
        updateEstimates();
    }

    /**
     * Analyze a specific range of messages
     */
    async function analyzeMessageRange(startIndex, endIndex) {
        const context = SillyTavern.getContext();
        const chat = context.chat;
        const chatMetadata = context.chatMetadata;
        
        const messageCount = endIndex - startIndex + 1;
        
        // Show helpful message about JSON parsing
        const apiInfo = `Note: The extension will attempt to extract memories even if your API doesn't perfectly support JSON output. You may see some parsing warnings in the console - this is normal and the extension will try alternative extraction methods.`;
        
        const proceed = confirm(
            `Analyze ${messageCount} messages (${startIndex + 1} to ${endIndex + 1})?\n\n` +
            `This will extract memories from the selected range.\n\n` +
            `${apiInfo}`
        );
        
        if (!proceed) return;
        
        // Show progress UI
        const statusDiv = $('#memory-tracker-analysis-status');
        const progressBar = $('.analysis-progress-bar');
        const currentSpan = $('.analysis-current');
        const totalSpan = $('.analysis-total');
        const analyzeButton = $('#memory-tracker-analyze-existing, #memory-tracker-analyze-range');
        
        statusDiv.show();
        analyzeButton.prop('disabled', true);
        totalSpan.text(messageCount);
        
        // Initialize memory tracker if needed
        if (!chatMetadata.memoryTracker) {
            chatMetadata.memoryTracker = {
                memories: [],
                relationships: {},
                timeline: [],
                emotionalStates: {}
            };
        }
        
        let processed = 0;
        let newMemories = 0;
        const batchSize = 5;
        
        try {
            for (let i = startIndex; i <= endIndex; i += batchSize) {
                const batchEnd = Math.min(i + batchSize, endIndex + 1);
                const batch = chat.slice(i, batchEnd);
                
                for (const message of batch) {
                    const messageIndex = chat.indexOf(message);
                    
                    // Skip if already analyzed
                    const alreadyAnalyzed = chatMetadata.memoryTracker.memories.some(
                        m => m.messageIndex === messageIndex
                    );
                    
                    if (!alreadyAnalyzed) {
                        const source = message.is_user ? 'user' : 'character';
                        const memoryData = await extractMemoryFromMessage(message, source);
                        
                        if (memoryData) {
                            memoryData.messageIndex = messageIndex;
                            chatMetadata.memoryTracker.memories.push(memoryData);
                            newMemories++;
                            
                            chatMetadata.memoryTracker.timeline.push({
                                timestamp: message.send_date || Date.now(),
                                messageIndex: messageIndex,
                                summary: memoryData.summary,
                                importance: memoryData.importance
                            });
                            
                            if (memoryData.relationship) {
                                updateRelationship(
                                    chatMetadata.memoryTracker.relationships,
                                    memoryData.relationship
                                );
                            }
                            
                            if (memoryData.emotion && extensionSettings.useEmotionalContext) {
                                updateEmotionalState(
                                    chatMetadata.memoryTracker.emotionalStates,
                                    memoryData.emotion
                                );
                            }
                        }
                    }
                    
                    processed++;
                    currentSpan.text(processed);
                    const progressPercent = (processed / messageCount) * 100;
                    progressBar.css('width', progressPercent + '%');
                }
                
                if (i + batchSize <= endIndex) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
            
            chatMetadata.memoryTracker.timeline.sort((a, b) => a.timestamp - b.timestamp);
            trimMemories(chatMetadata.memoryTracker);
            await context.saveMetadata();
            
            showNotification(
                `Range analysis complete!\n` +
                `• Processed messages ${startIndex + 1} to ${endIndex + 1}\n` +
                `• Created ${newMemories} new memories\n` +
                `• Total memories: ${chatMetadata.memoryTracker.memories.length}`
            );
            
        } catch (error) {
            console.error('[Dynamic Memory Tracker] Error during range analysis:', error);
            showNotification('Error during analysis. Check console for details.');
        } finally {
            statusDiv.fadeOut(300);
            analyzeButton.prop('disabled', false);
            progressBar.css('width', '0%');
        }
    }

    /**
     * Analyze existing chat messages to build memory retroactively
     */
    async function analyzeExistingChat() {
        const context = SillyTavern.getContext();
        const chat = context.chat;
        const chatMetadata = context.chatMetadata;
        
        if (!chat || chat.length === 0) {
            showNotification('No messages to analyze');
            return;
        }

        // Check if user wants to proceed
        const existingMemories = chatMetadata.memoryTracker?.memories?.length || 0;
        let proceed = true;
        
        if (existingMemories > 0) {
            proceed = confirm(
                `This chat already has ${existingMemories} memories tracked.\n\n` +
                `Analyzing existing messages will:\n` +
                `• Review all ${chat.length} messages in this chat\n` +
                `• Extract memories from each message\n` +
                `• Merge with existing memories\n` +
                `• May take several minutes for long chats\n\n` +
                `Continue?`
            );
        } else {
            proceed = confirm(
                `This will analyze all ${chat.length} messages in this chat to build a complete memory profile.\n\n` +
                `This process:\n` +
                `• Uses AI to extract significant moments\n` +
                `• Tracks relationships and emotions\n` +
                `• May take several minutes\n` +
                `• Uses API tokens\n\n` +
                `Continue?`
            );
        }
        
        if (!proceed) return;

        // Show progress UI
        const statusDiv = $('#memory-tracker-analysis-status');
        const progressBar = $('.analysis-progress-bar');
        const currentSpan = $('.analysis-current');
        const totalSpan = $('.analysis-total');
        const analyzeButton = $('#memory-tracker-analyze-existing');
        
        statusDiv.show();
        analyzeButton.prop('disabled', true).text('Analyzing...');
        totalSpan.text(chat.length);

        // Initialize memory tracker if needed
        if (!chatMetadata.memoryTracker) {
            chatMetadata.memoryTracker = {
                memories: [],
                relationships: {},
                timeline: [],
                emotionalStates: {}
            };
        }

        let processed = 0;
        let newMemories = 0;
        const batchSize = 5; // Process in batches to avoid overwhelming the API

        try {
            // Process messages in batches
            for (let i = 0; i < chat.length; i += batchSize) {
                const batch = chat.slice(i, Math.min(i + batchSize, chat.length));
                
                for (const message of batch) {
                    const messageIndex = chat.indexOf(message);
                    
                    // Skip if this message was already analyzed
                    const alreadyAnalyzed = chatMetadata.memoryTracker.memories.some(
                        m => m.messageIndex === messageIndex
                    );
                    
                    if (!alreadyAnalyzed) {
                        const source = message.is_user ? 'user' : 'character';
                        const memoryData = await extractMemoryFromMessage(message, source);
                        
                        if (memoryData) {
                            // Override messageIndex to match the actual position
                            memoryData.messageIndex = messageIndex;
                            
                            // Store memory
                            chatMetadata.memoryTracker.memories.push(memoryData);
                            newMemories++;
                            
                            // Update timeline
                            chatMetadata.memoryTracker.timeline.push({
                                timestamp: message.send_date || Date.now(),
                                messageIndex: messageIndex,
                                summary: memoryData.summary,
                                importance: memoryData.importance
                            });
                            
                            // Update relationships
                            if (memoryData.relationship) {
                                updateRelationship(
                                    chatMetadata.memoryTracker.relationships,
                                    memoryData.relationship
                                );
                            }
                            
                            // Update emotional states
                            if (memoryData.emotion && extensionSettings.useEmotionalContext) {
                                updateEmotionalState(
                                    chatMetadata.memoryTracker.emotionalStates,
                                    memoryData.emotion
                                );
                            }
                        }
                    }
                    
                    processed++;
                    
                    // Update progress
                    currentSpan.text(processed);
                    const progressPercent = (processed / chat.length) * 100;
                    progressBar.css('width', progressPercent + '%');
                }
                
                // Small delay between batches to avoid rate limiting
                if (i + batchSize < chat.length) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            // Sort timeline chronologically
            chatMetadata.memoryTracker.timeline.sort((a, b) => a.timestamp - b.timestamp);
            
            // Trim memories if needed
            trimMemories(chatMetadata.memoryTracker);
            
            // Save metadata
            await context.saveMetadata();
            
            showNotification(
                `Analysis complete!\n` +
                `• Processed ${processed} messages\n` +
                `• Created ${newMemories} new memories\n` +
                `• Total memories: ${chatMetadata.memoryTracker.memories.length}`
            );
            
        } catch (error) {
            console.error('[Dynamic Memory Tracker] Error during analysis:', error);
            showNotification('Error during analysis. Check console for details.');
        } finally {
            // Reset UI
            statusDiv.fadeOut(300);
            analyzeButton.prop('disabled', false).html('<i class="fa-solid fa-clock-rotate-left"></i> Analyze Existing Chat');
            progressBar.css('width', '0%');
        }
    }

    /**
     * Export memory data
     */
    function exportMemoryData() {
        const context = SillyTavern.getContext();
        const chatMetadata = context.chatMetadata;
        
        if (!chatMetadata.memoryTracker) {
            showNotification('No memory data to export');
            return;
        }

        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            characterName: context.name2,
            chatName: context.chatId,
            data: chatMetadata.memoryTracker
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `memory-tracker-${context.name2}-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        showNotification('Memory data exported successfully');
    }

    /**
     * Show a notification
     */
    function showNotification(message) {
        if (typeof toastr !== 'undefined') {
            toastr.info(message, 'Dynamic Memory Tracker');
        } else {
            console.log(`[Dynamic Memory Tracker] ${message}`);
        }
    }

    /**
     * Register slash commands
     */
    function registerSlashCommands() {
        const { SlashCommandParser, SlashCommand, ARGUMENT_TYPE } = window;
        
        if (!SlashCommandParser || !SlashCommand) {
            console.error('[Dynamic Memory Tracker] Slash command system not available');
            return;
        }

        SlashCommandParser.addCommandObject(SlashCommand.fromProps({
            name: 'memory-view',
            callback: () => {
                openMemoryPanel('memories');
                return '';
            },
            helpString: 'Opens the memory tracker panel'
        }));

        SlashCommandParser.addCommandObject(SlashCommand.fromProps({
            name: 'memory-relationships',
            callback: () => {
                openMemoryPanel('relationships');
                return '';
            },
            helpString: 'Opens the relationship tracker panel'
        }));

        SlashCommandParser.addCommandObject(SlashCommand.fromProps({
            name: 'memory-timeline',
            callback: () => {
                openMemoryPanel('timeline');
                return '';
            },
            helpString: 'Opens the timeline panel'
        }));

        SlashCommandParser.addCommandObject(SlashCommand.fromProps({
            name: 'memory-export',
            callback: () => {
                exportMemoryData();
                return 'Memory data exported';
            },
            helpString: 'Exports all memory data to a JSON file'
        }));

        SlashCommandParser.addCommandObject(SlashCommand.fromProps({
            name: 'memory-analyze',
            callback: async () => {
                await analyzeExistingChat();
                return 'Chat analysis started';
            },
            helpString: 'Analyzes all existing messages in the current chat to build memory profile'
        }));
    }

    // Initialize when the app is ready
    const interval = setInterval(() => {
        if (window.SillyTavern && SillyTavern.getContext) {
            clearInterval(interval);
            init();
        }
    }, 100);
})();
