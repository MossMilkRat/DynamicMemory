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
                            
                            <div class="memory-tracker-buttons">
                                <button id="memory-tracker-view-memories" class="menu_button">
                                    <i class="fa-solid fa-brain"></i>
                                    View Memories
                                </button>
                                <button id="memory-tracker-view-relationships" class="menu_button">
                                    <i class="fa-solid fa-heart"></i>
                                    View Relationships
                                </button>
                                <button id="memory-tracker-export" class="menu_button">
                                    <i class="fa-solid fa-download"></i>
                                    Export Data
                                </button>
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

        $('#memory-tracker-view-memories').on('click', function() {
            openMemoryPanel('memories');
        });

        $('#memory-tracker-view-relationships').on('click', function() {
            openMemoryPanel('relationships');
        });

        $('#memory-tracker-export').on('click', function() {
            exportMemoryData();
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
                emotionalStates: {}
            };
        }

        // Extract memory using AI
        const memoryData = await extractMemoryFromMessage(message, source);
        
        if (memoryData) {
            // Store memory
            chatMetadata.memoryTracker.memories.push(memoryData);
            
            // Update timeline
            chatMetadata.memoryTracker.timeline.push({
                timestamp: Date.now(),
                messageIndex: context.chat.length - 1,
                summary: memoryData.summary,
                importance: memoryData.importance
            });
            
            // Update relationships if applicable
            if (memoryData.relationship) {
                updateRelationship(chatMetadata.memoryTracker.relationships, memoryData.relationship);
            }
            
            // Update emotional states
            if (memoryData.emotion && extensionSettings.useEmotionalContext) {
                updateEmotionalState(chatMetadata.memoryTracker.emotionalStates, memoryData.emotion);
            }
            
            // Trim old memories if needed
            trimMemories(chatMetadata.memoryTracker);
            
            // Save metadata
            await context.saveMetadata();
            
            // Show notification if enabled
            if (extensionSettings.showNotifications && memoryData.importance > 0.7) {
                showNotification(`New significant memory: ${memoryData.summary}`);
            }
        }
    }

    /**
     * Extract memory data from a message using AI
     */
    async function extractMemoryFromMessage(message, source) {
        const context = SillyTavern.getContext();
        
        // Build extraction prompt based on tracking depth
        const depth = extensionSettings.trackingDepth;
        let extractionPrompt = '';
        
        if (depth === 'basic') {
            extractionPrompt = `Analyze this message and extract any important facts or events. Keep it brief.

Message: "${message.mes}"

Extract:
1. Main event or fact (one sentence)
2. Importance (0.0 to 1.0)
3. Emotional tone (positive/negative/neutral)`;
        } else if (depth === 'detailed') {
            extractionPrompt = `Analyze this message for memory extraction. Focus on significant events, emotional moments, character development, and relationship changes.

Message: "${message.mes}"

Extract:
1. Summary of the main event or revelation
2. Importance score (0.0 to 1.0, where 1.0 is extremely significant)
3. Emotional context (describe the emotional state)
4. Character feelings or thoughts
5. Any relationship dynamics that changed
6. Keywords for future reference`;
        } else { // comprehensive
            extractionPrompt = `Perform a comprehensive analysis of this message for character memory tracking.

Message: "${message.mes}"

Extract and analyze:
1. Event summary (what happened)
2. Emotional analysis (feelings, tone, subtext)
3. Character development (how this affects the character)
4. Relationship dynamics (changes in relationships)
5. Important revelations or secrets shared
6. Continuity notes (things that should be remembered later)
7. Keywords and tags
8. Importance score (0.0 to 1.0)
9. Any potential contradictions with previous events`;
        }

        const jsonSchema = {
            name: 'MemoryExtraction',
            strict: true,
            value: {
                type: 'object',
                properties: {
                    summary: { type: 'string' },
                    importance: { type: 'number' },
                    emotion: { type: 'string' },
                    keywords: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    relationship: {
                        type: 'object',
                        properties: {
                            type: { type: 'string' },
                            change: { type: 'string' }
                        }
                    },
                    continuityNote: { type: 'string' }
                },
                required: ['summary', 'importance', 'emotion', 'keywords']
            }
        };

        try {
            const result = await context.generateQuietPrompt({
                quietPrompt: extractionPrompt,
                jsonSchema: jsonSchema
            });

            if (result) {
                const memoryData = JSON.parse(result);
                memoryData.timestamp = Date.now();
                memoryData.source = source;
                memoryData.messageIndex = context.chat.length - 1;
                return memoryData;
            }
        } catch (error) {
            console.error('[Dynamic Memory Tracker] Error extracting memory:', error);
        }

        return null;
    }

    /**
     * Update relationship data
     */
    function updateRelationship(relationships, relationshipData) {
        const key = relationshipData.type || 'general';
        
        if (!relationships[key]) {
            relationships[key] = {
                level: 0,
                history: [],
                lastUpdate: Date.now()
            };
        }

        relationships[key].history.push({
            timestamp: Date.now(),
            change: relationshipData.change
        });
        
        // Update relationship level based on change
        const changeMap = {
            'improved': 0.1,
            'worsened': -0.1,
            'neutral': 0
        };
        
        relationships[key].level += changeMap[relationshipData.change] || 0;
        relationships[key].level = Math.max(-1, Math.min(1, relationships[key].level));
        relationships[key].lastUpdate = Date.now();
    }

    /**
     * Update emotional state
     */
    function updateEmotionalState(emotionalStates, emotion) {
        const timestamp = Date.now();
        
        if (!emotionalStates.current) {
            emotionalStates.current = emotion;
            emotionalStates.history = [];
        }

        emotionalStates.history.push({
            timestamp: timestamp,
            emotion: emotion
        });

        emotionalStates.current = emotion;
        
        // Apply decay to old emotional states
        applyEmotionalDecay(emotionalStates);
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
        
        sortedMemories.forEach(memory => {
            const memoryHtml = `
                <div class="memory-tracker-item" data-importance="${memory.importance}">
                    <div class="memory-tracker-item-header">
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
    }

    // Initialize when the app is ready
    const interval = setInterval(() => {
        if (window.SillyTavern && SillyTavern.getContext) {
            clearInterval(interval);
            init();
        }
    }, 100);
})();
 
