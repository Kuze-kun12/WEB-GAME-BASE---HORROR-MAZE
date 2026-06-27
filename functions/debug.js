/**
 * HORROR MAZE - DEBUG MODE
 * 
 * Allows developers to quickly jump to any level for testing
 * Add a level selector dropdown and debug controls to the page
 */

// Create debug panel
function initializeDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.innerHTML = `
        <div class="debug-header">🔧 DEBUG MODE</div>
        <div class="debug-controls">
            <label for="level-selector">Jump to Level:</label>
            <select id="level-selector">
                <option value="">-- Select a Level --</option>
                <option value="0">Level 1 (Easy)</option>
                <option value="1">Level 2 (Medium)</option>
                <option value="2">Level 3 (Hard)</option>
                <option value="3">Level 4 (Very Hard)</option>
                <option value="4">Level 5 (Nightmare)</option>
                <option value="5">Level 6 (Final Descent)</option>
            </select>
            <button id="load-level-btn">Load Level</button>
        </div>
        <div class="debug-controls">
            <button id="kill-enemy-btn">Kill Enemy</button>
            <button id="spawn-key-btn">Spawn Key</button>
            <button id="teleport-exit-btn">Teleport to Exit</button>
            <button id="give-key-btn">Give Key</button>
        </div>
        <div class="debug-info">
            <p>Player: <span id="debug-player-pos">0, 0</span></p>
            <p>Enemy: <span id="debug-enemy-pos">0, 0</span></p>
            <p>Level: <span id="debug-level">0</span></p>
            <p>Inventory: <span id="debug-inventory">Empty</span></p>
        </div>
    `;
    
    document.body.appendChild(debugPanel);
    attachDebugEventListeners();
}

// Attach event listeners to debug buttons
function attachDebugEventListeners() {
    // Level selector
    const levelSelector = document.getElementById('level-selector');
    const loadLevelBtn = document.getElementById('load-level-btn');
    
    loadLevelBtn.addEventListener('click', () => {
        const selectedLevel = parseInt(levelSelector.value);
        if (!isNaN(selectedLevel) && selectedLevel >= 0) {
            if (GameState.gameActive) {
                clearInterval(GameState.enemyInterval);
            }
            loadLevel(selectedLevel);
            console.log(`Loaded Level ${selectedLevel + 1}`);
        } else {
            alert('Please select a valid level');
        }
    });
    
    // Kill enemy button
    document.getElementById('kill-enemy-btn').addEventListener('click', () => {
        GameState.enemy = { x: -100, y: -100 };
        GameState.renderer.draw(GameState.grid, GameState.player, GameState.enemy);
        console.log('Enemy killed (moved off-screen)');
    });
    
    // Spawn key button
    document.getElementById('spawn-key-btn').addEventListener('click', () => {
        spawnRandomKey();
        GameState.renderer.draw(GameState.grid, GameState.player, GameState.enemy);
        console.log('New key spawned');
    });
    
    // Teleport to exit button
    document.getElementById('teleport-exit-btn').addEventListener('click', () => {
        // Find exit location
        for (let y = 0; y < CONSTANTS.ROWS; y++) {
            for (let x = 0; x < CONSTANTS.COLS; x++) {
                if (GameState.grid[y][x] === CONSTANTS.TILE_EXIT) {
                    GameState.player.x = x;
                    GameState.player.y = y;
                    GameState.renderer.draw(GameState.grid, GameState.player, GameState.enemy);
                    console.log(`Teleported to exit at (${x}, ${y})`);
                    return;
                }
            }
        }
    });
    
    // Give key button
    document.getElementById('give-key-btn').addEventListener('click', () => {
        if (GameState.inventory) {
            GameState.inventory.push("Rusted Key DEBUG");
            GameState.renderer.draw(GameState.grid, GameState.player, GameState.enemy);
            console.log('Key added to inventory');
        }
    });
}

// Update debug info display
function updateDebugInfo() {
    document.getElementById('debug-player-pos').innerText = 
        `${GameState.player.x}, ${GameState.player.y}`;
    document.getElementById('debug-enemy-pos').innerText = 
        `${GameState.enemy.x}, ${GameState.enemy.y}`;
    document.getElementById('debug-level').innerText = 
        `${GameState.currentLevel + 1}`;
    document.getElementById('debug-inventory').innerText = 
        GameState.inventory.isEmpty() ? 'Empty' : GameState.inventory.items.join(', ');
}

// Update debug info every frame
setInterval(updateDebugInfo, 100);

// Initialize debug panel on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDebugPanel);
} else {
    initializeDebugPanel();
}
