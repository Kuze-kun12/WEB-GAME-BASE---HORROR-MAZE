/**
 * HORROR MAZE  EDITION - GAME LOGIC
 * 
 * Main game engine with:
 * - Game Constants & Configuration
 * - Rendering System (Canvas API + Flashlight effects)
 * - Game State Management
 * - Player & Enemy Logic
 * - Collision Detection
 * - Game Events & Sequences
 */


// 1. GAME CONSTANTS & CONFIGURATION
const CONSTANTS = {
    /* Grid Configuration */
    TILE_SIZE: 40,
    ROWS: 15,
    COLS: 15,
    
    /* Flashlight Settings */
    FLASHLIGHT_RADIUS: 200,
    
    /* Gameplay Speeds (ms) */
    ENEMY_SPEED: 350,
    WHEEL_SPIN_DURATION: 2000,
    WHEEL_RESULT_DISPLAY_TIME: 1500,
    JUMPSCARE_DURATION: 2500,
    
    /* Game Tile Types */
    TILE_EMPTY: 0,
    TILE_WALL: 1,
    TILE_KEY: 2,
    TILE_EXIT: 3,
    
    /* Chance Values */
    WHEEL_SUCCESS_CHANCE: 0.6, // 60% chance to escape on level 5
    
    /* Colors */
    COLORS: {
        WALL: "#1a1a1a",
        WALL_EDGE: "#0d0d0d",
        EXIT: "#1e8449",
        KEY: "#b7950b",
        PLAYER: "#aed6f1",
        ENEMY: "#820000"
    }
};


// 2. RENDERING SYSTEM (Canvas API)
/**
 * Handles all canvas rendering including flashlight effects
 */
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        
        // Offscreen canvas for lighting mask (performance optimization)
        this.lightCanvas = document.createElement('canvas');
        this.lightCanvas.width = canvas.width;
        this.lightCanvas.height = canvas.height;
        this.lightCtx = this.lightCanvas.getContext('2d');
    }

    /**
     * Main draw function - renders game state
     * @param {Array} grid - Game grid state
     * @param {Object} player - Player position {x, y}
     * @param {Object} enemy - Enemy position {x, y}
     */
    draw(grid, player, enemy) {
        this.clearCanvas();
        this.drawGameWorld(grid, player, enemy);
        this.applyLightingMask(player);
    }

    /**
     * Clear canvas to pure black
     */
    clearCanvas() {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw all game elements: walls, exit, key, player, enemy
     */
    drawGameWorld(grid, player, enemy) {
        this.drawMapTiles(grid);
        this.drawEnemy(enemy);    // Draw enemy BEHIND player
        this.drawPlayer(player);  // Draw player ON TOP
    }

    /**
     * Draw grid elements (walls, exit, keys)
     */
    drawMapTiles(grid) {
        for (let y = 0; y < CONSTANTS.ROWS; y++) {
            for (let x = 0; x < CONSTANTS.COLS; x++) {
                const tileX = x * CONSTANTS.TILE_SIZE;
                const tileY = y * CONSTANTS.TILE_SIZE;
                const tileType = grid[y][x];

                if (tileType === CONSTANTS.TILE_WALL) {
                    this.drawWall(tileX, tileY);
                } else if (tileType === CONSTANTS.TILE_EXIT) {
                    this.drawExit(tileX, tileY);
                } else if (tileType === CONSTANTS.TILE_KEY) {
                    this.drawKey(tileX, tileY);
                }
            }
        }
    }

    /**
     * Draw a single wall tile with texture
     */
    drawWall(x, y) {
        this.ctx.fillStyle = CONSTANTS.COLORS.WALL;
        this.ctx.fillRect(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
        
        // Add texture for visual interest
        this.ctx.strokeStyle = CONSTANTS.COLORS.WALL_EDGE;
        this.ctx.strokeRect(x + 5, y + 5, CONSTANTS.TILE_SIZE - 10, CONSTANTS.TILE_SIZE - 10);
    }

    /**
     * Draw exit (green square)
     */
    drawExit(x, y) {
        this.ctx.fillStyle = CONSTANTS.COLORS.EXIT;
        this.ctx.fillRect(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
    }

    /**
     * Draw key item (yellow square)
     */
    drawKey(x, y) {
        this.ctx.fillStyle = CONSTANTS.COLORS.KEY;
        this.ctx.fillRect(x + 12, y + 12, CONSTANTS.TILE_SIZE - 24, CONSTANTS.TILE_SIZE - 24);
    }

    /**
     * Draw player character
     */
    drawPlayer(player) {
        this.ctx.fillStyle = CONSTANTS.COLORS.PLAYER;
        const px = player.x * CONSTANTS.TILE_SIZE + 8;
        const py = player.y * CONSTANTS.TILE_SIZE + 8;
        this.ctx.fillRect(px, py, CONSTANTS.TILE_SIZE - 16, CONSTANTS.TILE_SIZE - 16);
    }

    /**
     * Draw enemy character
     */
    drawEnemy(enemy) {
        this.ctx.fillStyle = CONSTANTS.COLORS.ENEMY;
        const ex = enemy.x * CONSTANTS.TILE_SIZE + 5;
        const ey = enemy.y * CONSTANTS.TILE_SIZE + 5;
        this.ctx.fillRect(ex, ey, CONSTANTS.TILE_SIZE - 10, CONSTANTS.TILE_SIZE - 10);
    }

    /**
     * Apply flashlight masking effect
     * Creates a dark screen with flashlight beam around player
     */
    applyLightingMask(player) {
        this.createDarknessMask();
        this.createFlashlightBeam(player);
        this.createAmbientLight(player);
        this.applyMaskToCanvas();
    }

    /**
     * Create base darkness mask (all black)
     */
    createDarknessMask() {
        this.lightCtx.globalCompositeOperation = 'source-over';
        this.lightCtx.fillStyle = "rgba(0, 0, 0, 1)";
        this.lightCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Create main flashlight beam with gradient fade
     */
    createFlashlightBeam(player) {
        let px, py;
        
        // For all levels, center flashlight on player
        px = player.x * CONSTANTS.TILE_SIZE + CONSTANTS.TILE_SIZE / 2;
        py = player.y * CONSTANTS.TILE_SIZE + CONSTANTS.TILE_SIZE / 2;

        this.lightCtx.globalCompositeOperation = 'destination-out';
        
        const gradient = this.lightCtx.createRadialGradient(
            px, py, 0,
            px, py, CONSTANTS.FLASHLIGHT_RADIUS
        );
        
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");      // Bright core
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");  // Dimming
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");      // Edge fade to black

        this.lightCtx.fillStyle = gradient;
        this.lightCtx.beginPath();
        this.lightCtx.arc(px, py, CONSTANTS.FLASHLIGHT_RADIUS, 0, Math.PI * 2);
        this.lightCtx.fill();
    }

    /**
     * Add subtle ambient light around player
     */
    createAmbientLight(player) {
        const px = player.x * CONSTANTS.TILE_SIZE + CONSTANTS.TILE_SIZE / 2;
        const py = player.y * CONSTANTS.TILE_SIZE + CONSTANTS.TILE_SIZE / 2;
        
        this.lightCtx.fillStyle = "rgba(255, 255, 255, 0.1)";
        this.lightCtx.beginPath();
        this.lightCtx.arc(px, py, CONSTANTS.TILE_SIZE * 1.2, 0, Math.PI * 2);
        this.lightCtx.fill();
    }

    /**
     * Apply the lighting mask to main canvas
     */
    applyMaskToCanvas() {
        this.ctx.drawImage(this.lightCanvas, 0, 0);
    }
}

// ==========================================
// 3. GAME STATE MANAGEMENT
// ==========================================
const GameState = {
    currentLevel: 0,
    grid: [],
    player: { x: 0, y: 0 },
    enemy: { x: 9, y: 9 },
    gameActive: true,
    enemyInterval: null,
    inventory: null,
    gameComplete: false,
    renderer: null,
    shackInterval: null,
    isShacking: false,
    stamina: 21,
    maxStamina: 21,
    staminaRegenInterval: null,
    lastMovementTime: 0,
    lives: 3,
    winDialogReady: false
};

// ==========================================
// SHACK ANIMATION (Maze trembling effect)
// ==========================================
/**
 * Trigger shack/trembling animation for horror atmosphere
 */
function startShackAnimation() {
    const canvas = document.getElementById("gameCanvas");
    if (GameState.isShacking) return;
    
    GameState.isShacking = true;
    const originalLeft = canvas.style.left || "0px";
    const originalTop = canvas.style.top || "0px";
    
    let shackCount = 0;
    GameState.shackInterval = setInterval(() => {
        if (shackCount % 2 === 0) {
            canvas.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        } else {
            canvas.style.transform = `translate(0px, 0px)`;
        }
        shackCount++;
    }, 100);
}

/**
 * Stop the shack animation
 */
function stopShackAnimation() {
    const canvas = document.getElementById("gameCanvas");
    clearInterval(GameState.shackInterval);
    GameState.isShacking = false;
    canvas.style.transform = `translate(0px, 0px)`;
}

/**
 * Intense shack effect when enemy is very close
 */
function intenseShack() {
    const canvas = document.getElementById("gameCanvas");
    
    // Apply stronger trembling
    const shakeAmount = Math.random() * 6 - 3; // -3 to 3 pixels
    canvas.style.transform = `translate(${shakeAmount}px, ${shakeAmount * 0.8}px) rotate(${Math.random() * 0.5 - 0.25}deg)`;
}

/**
 * Find the exit tile coordinates on the current grid
 * @returns {{x:number,y:number}|null}
 */
function findExitPosition() {
    for (let y = 0; y < CONSTANTS.ROWS; y++) {
        for (let x = 0; x < CONSTANTS.COLS; x++) {
            if (GameState.grid[y][x] === CONSTANTS.TILE_EXIT) {
                return { x, y };
            }
        }
    }
    return null;
}

/**
 * Apply a stronger proximity shake when near the exit
 */
function exitProximityShack() {
    const canvas = document.getElementById("gameCanvas");
    const shakeAmount = Math.random() * 10 - 5; // ±5 pixels for stronger effect
    canvas.style.transform = `translate(${shakeAmount}px, ${shakeAmount * 0.8}px) rotate(${Math.random() * 1 - 0.5}deg)`;
}

// ==========================================
// 4. GAME INITIALIZATION & LEVEL LOADING
// ==========================================
/**
 * Initialize game and load first level
 */
function initializeGame() {
    const canvas = document.getElementById("gameCanvas");
    GameState.renderer = new Renderer(canvas);
    GameState.inventory = new InventoryStack();
    loadLevel(0);
}

/**
 * Load a specific level
 * @param {number} levelIndex - Level to load
 */
function loadLevel(levelIndex, options = {}) {
    const resetLives = options.resetLives !== false;

    // Handle game completion
    if (levelIndex >= maps.length) {
        console.log("All levels completed!");
        GameState.currentLevel = 0;
        levelIndex = 0;
    }

    // Reset game state
    GameState.currentLevel = levelIndex;
    GameState.grid = JSON.parse(JSON.stringify(maps[levelIndex]));
    GameState.player = { x: 0, y: 0 };
    
    // On Level 6, enemy spawns right behind the player
    if (levelIndex === maps.length - 1) {
        GameState.player = { x: 2, y: 2 };  // Player spawns at open area
        GameState.enemy = { x: 1, y: 0 };   // Entity spawns at block 1
        if (resetLives) {
            GameState.lives = 3;
        }
        GameState.stamina = 21;  // Initialize stamina for level 6
        GameState.maxStamina = 21;
        updateStaminaDisplay();
        updateLivesDisplay();
        // Start stamina regeneration
        startStaminaRegeneration();
    } else {
        GameState.enemy = { x: 14, y: 14 };  // Normal spawn for other levels
        // Clear stamina regeneration for other levels
        if (GameState.staminaRegenInterval) {
            clearInterval(GameState.staminaRegenInterval);
            GameState.staminaRegenInterval = null;
        }
        hideLivesDisplay();
    }
    
    GameState.inventory = new InventoryStack();
    GameState.gameActive = true;
    GameState.gameComplete = false;
    GameState.winDialogReady = false;

    // Hide any end screens
    const deathScreen = document.getElementById('death-screen');
    const finalScreen = document.getElementById('final-screen');
    const completeScreen = document.getElementById('game-complete');
    if (deathScreen) deathScreen.classList.remove('active');
    if (finalScreen) finalScreen.classList.remove('active');
    if (completeScreen) completeScreen.classList.remove('active');

    // Spawn key and update UI
    spawnRandomKey();
    updateLevelUI();

    // Start enemy movement
    clearInterval(GameState.enemyInterval);
    GameState.enemyInterval = setInterval(updateEnemyPosition, CONSTANTS.ENEMY_SPEED);

    // Start shack animation for final level (Level 6)
    if (levelIndex === maps.length - 1) {
        startShackAnimation();
        // Play level 6 music at full volume
        const level6Sound = document.getElementById('level6-sound');
        if (level6Sound) {
            level6Sound.volume = 1;
            level6Sound.currentTime = 0;
            level6Sound.play().catch(e => {});
        }
    } else {
        stopShackAnimation();
    }

    // Render
    GameState.renderer.draw(GameState.grid, GameState.player, GameState.enemy);
}

/**
 * Update level display text
 */
function updateLevelUI() {
    const levelDisplay = document.getElementById("level-display");
    levelDisplay.innerText = `Descent: ${GameState.currentLevel + 1} / ${maps.length}`;
}

function updateLivesDisplay() {
    const livesDisplay = document.getElementById('lives-display');
    if (!livesDisplay) return;

    if (GameState.currentLevel === maps.length - 1) {
        livesDisplay.style.display = 'block';
        livesDisplay.innerText = `Lives: ${'❤️ '.repeat(GameState.lives).trim()}`;
    } else {
        livesDisplay.style.display = 'none';
    }
}

function hideLivesDisplay() {
    const livesDisplay = document.getElementById('lives-display');
    if (livesDisplay) {
        livesDisplay.style.display = 'none';
    }
}

function showDeathScreen() {
    const deathScreen = document.getElementById('death-screen');
    if (deathScreen) {
        deathScreen.classList.add('active');
        setTimeout(() => {
            deathScreen.classList.remove('active');
        }, 1500);
    }
}

function showFinalScreen() {
    const finalScreen = document.getElementById('final-screen');
    const completeScreen = document.getElementById('game-complete');
    if (finalScreen) {
        finalScreen.classList.add('active');
    }
    if (completeScreen) {
        completeScreen.classList.remove('active');
    }
    GameState.gameComplete = true;
    GameState.winDialogReady = true;
}

function showGameOverScreen() {
    const completeScreen = document.getElementById('game-complete');
    if (completeScreen) {
        completeScreen.querySelector('h1').innerText = 'GAME OVER';
        completeScreen.querySelector('p').innerText = 'You have no lives left. Press ENTER to restart.';
        completeScreen.classList.add('active');
    }
    GameState.gameComplete = true;
}

/**
 * Spawn a random key on the grid
 */
function spawnRandomKey() {
    let placed = false;
    while (!placed) {
        const randX = Math.floor(Math.random() * CONSTANTS.COLS);
        const randY = Math.floor(Math.random() * CONSTANTS.ROWS);
        
        // Must be empty, not player start, not enemy start
        if (GameState.grid[randY][randX] === CONSTANTS.TILE_EMPTY &&
            !(randX === 0 && randY === 0) &&
            !(randX === 9 && randY === 9)) {
            
            GameState.grid[randY][randX] = CONSTANTS.TILE_KEY;
            placed = true;
        }
    }
}

// ==========================================
// 5. ENEMY AI & PATHFINDING
// ==========================================
/**
 * Update enemy position using BFS pathfinding
 */
function updateEnemyPosition() {
    if (!GameState.gameActive) return;

    const nextStep = findNextPathStep(
        GameState.enemy.x, GameState.enemy.y,
        GameState.player.x, GameState.player.y,
        GameState.grid,
        CONSTANTS
    );

    if (nextStep) {
        GameState.enemy.x = nextStep.x;
        GameState.enemy.y = nextStep.y;
    }

    checkCollisions();
    GameState.renderer.draw(GameState.grid, GameState.player, GameState.enemy);
}

// ==========================================
// 6. COLLISION & INTERACTION DETECTION
// ==========================================
/**
 * Check for player-enemy and player-exit collisions
 */
function checkCollisions() {
    // Level 6: Use normal collision detection (1x1)
    if (GameState.currentLevel === maps.length - 1) {
        // Player caught by enemy
        if (GameState.player.x === GameState.enemy.x && 
            GameState.player.y === GameState.enemy.y) {
            GameState.gameActive = false;
            clearInterval(GameState.enemyInterval);
            stopShackAnimation();
            GameState.lives = Math.max(0, GameState.lives - 1);
            updateLivesDisplay();
            if (GameState.lives > 0) {
                triggerJumpscare(() => loadLevel(GameState.currentLevel, { resetLives: false }));
            } else {
                triggerJumpscare(() => window.location.href = 'dead.html');
            }
        }

        // Player reached exit
        if (GameState.grid[GameState.player.y][GameState.player.x] === CONSTANTS.TILE_EXIT) {
            GameState.gameActive = false;
            clearInterval(GameState.enemyInterval);
            stopShackAnimation();
            showFinalScreen();
        }
    } else {
        // Normal collision for other levels
        // Player caught by enemy
        if (GameState.player.x === GameState.enemy.x && 
            GameState.player.y === GameState.enemy.y) {
            GameState.gameActive = false;
            clearInterval(GameState.enemyInterval);
            stopShackAnimation();
            triggerJumpscare();
        }

        // Player reached exit
        if (GameState.grid[GameState.player.y][GameState.player.x] === CONSTANTS.TILE_EXIT) {
            GameState.gameActive = false;
            clearInterval(GameState.enemyInterval);
            stopShackAnimation();
            if (GameState.currentLevel === maps.length - 2) {
                spinTheWheel();
            } else {
                loadLevel(GameState.currentLevel + 1);
            }
        }
    }

    // Increase shacking intensity when enemy is close (final level only)
    if (GameState.currentLevel === maps.length - 1 && GameState.isShacking) {
        const distance = Math.abs(GameState.player.x - GameState.enemy.x) + 
                        Math.abs(GameState.player.y - GameState.enemy.y);
        
        // If enemy is very close (3 tiles or less), increase shack intensity
        if (distance <= 3) {
            intenseShack();
        }

        // Shake harder when near the exit, with 10-sensitivity intensity
        const exitPosition = findExitPosition();
        if (exitPosition) {
            const exitDistance = Math.abs(GameState.player.x - exitPosition.x) + 
                                  Math.abs(GameState.player.y - exitPosition.y);
            if (exitDistance <= 10) {
                exitProximityShack();
            }
        }
    }
}

/**
 * Check if player can move to a tile
 * @returns {boolean} - True if movement is valid
 */
function canMoveTo(x, y) {
    // Level 6: Use normal 1x1 movement (not 3x3 box collision)
    if (GameState.currentLevel === maps.length - 1) {
        // Bounds check
        if (x < 0 || x >= CONSTANTS.COLS || y < 0 || y >= CONSTANTS.ROWS) return false;
        
        // Wall check
        if (GameState.grid[y][x] === CONSTANTS.TILE_WALL) return false;

        // Exit requires inventory
        if (GameState.grid[y][x] === CONSTANTS.TILE_EXIT && GameState.inventory.isEmpty()) {
            return false;
        }
        
        return true;
    } else {
        // Normal movement for other levels
        // Bounds check
        if (x < 0 || x >= CONSTANTS.COLS || y < 0 || y >= CONSTANTS.ROWS) return false;
        
        // Wall check
        if (GameState.grid[y][x] === CONSTANTS.TILE_WALL) return false;

        // Exit requires inventory
        if (GameState.grid[y][x] === CONSTANTS.TILE_EXIT && GameState.inventory.isEmpty()) {
            return false;
        }

        return true;
    }
}

/**
 * Handle item pickup (press E)
 */
function pickupItem() {
    if (GameState.currentLevel === maps.length - 1) {
        // Level 6: Use normal pickup (1x1)
        if (GameState.grid[GameState.player.y][GameState.player.x] === CONSTANTS.TILE_KEY) {
            GameState.inventory.push("Rusted Key");
            GameState.grid[GameState.player.y][GameState.player.x] = CONSTANTS.TILE_EMPTY;
            GameState.renderer.draw(GameState.grid, GameState.player, GameState.enemy);
        }
    } else {
        // Normal pickup for other levels
        if (GameState.grid[GameState.player.y][GameState.player.x] === CONSTANTS.TILE_KEY) {
            GameState.inventory.push("Rusted Key");
            GameState.grid[GameState.player.y][GameState.player.x] = CONSTANTS.TILE_EMPTY;
            GameState.renderer.draw(GameState.grid, GameState.player, GameState.enemy);
        }
    }
}

// 7. GAME EVENTS & SEQUENCES

/**
 * Trigger jumpscare when caught
 */
function triggerJumpscare(onComplete) {
    const screen = document.getElementById('jumpscare-screen');
    const sound = document.getElementById('jumpscare-sound');

    if (screen) screen.style.display = 'block';
    if (sound) sound.play().catch(e => {});

    setTimeout(() => {
        if (screen) screen.style.display = 'none';
        if (typeof onComplete === 'function') {
            onComplete();
        } else {
            loadLevel(GameState.currentLevel);
        }
    }, CONSTANTS.JUMPSCARE_DURATION);
}

/**
 * Spin the wheel at exit for 50/50 chance
 */
function spinTheWheel() {
    const wheelContainer = document.getElementById('wheel-container');
    const wheel = document.getElementById('wheel');
    const resultDiv = document.getElementById('wheel-result');

    wheelContainer.classList.add('active');
    wheel.classList.remove('stopped');
    resultDiv.innerText = '';

    // Spin for duration, then determine outcome
    setTimeout(() => {
        wheel.classList.add('stopped');
        const success = Math.random() < CONSTANTS.WHEEL_SUCCESS_CHANCE;

        if (success) {
            resultDiv.innerHTML = '<span class="win">YOU ESCAPED!</span>';
            setTimeout(() => {
                wheelContainer.classList.remove('active');
                GameState.inventory.pop();
                GameState.currentLevel++;

                // Check if game complete
                if (GameState.currentLevel >= maps.length) {
                    GameState.gameComplete = true;
                    document.getElementById('game-complete').classList.add('active');
                } else {
                    loadLevel(GameState.currentLevel);
                }
            }, CONSTANTS.WHEEL_RESULT_DISPLAY_TIME);
        } else {
            resultDiv.innerHTML = '<span class="lose">TRAPPED... START OVER</span>';
            setTimeout(() => {
                wheelContainer.classList.remove('active');
                loadLevel(GameState.currentLevel);
            }, CONSTANTS.WHEEL_RESULT_DISPLAY_TIME);
        }
    }, CONSTANTS.WHEEL_SPIN_DURATION);
}

// ==========================================
// 8. INPUT HANDLING (Keyboard Controls)
// ==========================================
window.addEventListener("keydown", (e) => {
    // Press Enter when game complete
    if (e.key === "Enter" && GameState.gameComplete) {
        if (GameState.winDialogReady) {
            window.location.href = 'win.html';
            return;
        }
        document.getElementById('game-complete').classList.remove('active');
        location.reload();
        return;
    }

    if (!GameState.gameActive) return;

    // Pickup item (E key)
    if (e.key === "e" || e.key === "E") {
        pickupItem();
        return;
    }

    // Movement controls
    let newX = GameState.player.x;
    let newY = GameState.player.y;

    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") newY--;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") newY++;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") newX--;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") newX++;

    if (canMoveTo(newX, newY)) {
        // Level 6: Check stamina before moving
        if (GameState.currentLevel === maps.length - 1) {
            if (GameState.stamina > 0) {
                GameState.player.x = newX;
                GameState.player.y = newY;
                GameState.stamina--;
                // Auto-pickup key when stepping on it
                if (GameState.grid[GameState.player.y][GameState.player.x] === CONSTANTS.TILE_KEY) {
                    GameState.inventory.push("Rusted Key");
                    GameState.grid[GameState.player.y][GameState.player.x] = CONSTANTS.TILE_EMPTY;
                    updateStaminaDisplay();
                    GameState.renderer.draw(GameState.grid, GameState.player, GameState.enemy);
                } else {
                    updateStaminaDisplay();
                }
            }
            // If stamina is 0, player can't move
        } else {
            GameState.player.x = newX;
            GameState.player.y = newY;
            // Auto-pickup for other levels as well
            if (GameState.grid[GameState.player.y][GameState.player.x] === CONSTANTS.TILE_KEY) {
                GameState.inventory.push("Rusted Key");
                GameState.grid[GameState.player.y][GameState.player.x] = CONSTANTS.TILE_EMPTY;
            }
        }
        checkCollisions();
        GameState.renderer.draw(GameState.grid, GameState.player, GameState.enemy);
    }
});

// STAMINA SYSTEM FOR LEVEL 6
/**
 * Start stamina regeneration (1 stamina every 1 second)
 */
function startStaminaRegeneration() {
    if (GameState.staminaRegenInterval) {
        clearInterval(GameState.staminaRegenInterval);
    }
    
    GameState.staminaRegenInterval = setInterval(() => {
        if (GameState.currentLevel === maps.length - 1 && GameState.stamina < GameState.maxStamina) {
            GameState.stamina++;
            updateStaminaDisplay();
        }
    }, 1000); // 1 second = 1000ms
}

/**
 * Update stamina display on UI
 */
function updateStaminaDisplay() {
    const staminaDisplay = document.getElementById('stamina-display');
    if (staminaDisplay) {
        if (GameState.currentLevel === maps.length - 1) {
            staminaDisplay.style.display = 'block';
            staminaDisplay.innerText = `Stamina: ${GameState.stamina} / ${GameState.maxStamina}`;
        } else {
            staminaDisplay.style.display = 'none';
        }
    }
}

// 9. GAME START

// Wait for DOM to be ready, then start game
document.addEventListener('DOMContentLoaded', initializeGame);
// Fallback for already loaded DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}
