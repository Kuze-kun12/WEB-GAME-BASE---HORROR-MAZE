
// DSA CONCEPT: STACK (LIFO)
/**
 * Inventory System using Stack data structure
 * 
 * Stack (LIFO - Last In First Out):
 * - push(): Add item to top of stack
 * - pop(): Remove item from top of stack
 * - isEmpty(): Check if stack is empty
 */
class InventoryStack {
    constructor() {
        // Array acts as the underlying storage for stack
        this.items = [];
    }

    /**
     * Add item to inventory (push)
     * @param {string} item - Item name to add
     * Time Complexity: O(1)
     */
    push(item) {
        this.items.push(item);
        this.updateUI();
    }

    /**
     * Remove and return last item from inventory (pop)
     * @returns {string|null} - Removed item or null if empty
     */
    pop() {
        if (this.isEmpty()) return null;
        const item = this.items.pop();
        this.updateUI();
        return item;
    }

    /**
     * Check if inventory is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Update UI display with current inventory
     */
    updateUI() {
        const display = document.getElementById("inventory-display");
        if (this.isEmpty()) {
            display.innerText = "Carrying: [Nothing]";
            display.style.color = "#bdc3c7";
        } else {
            display.innerText = `Carrying: [${this.items.join(", ")}]`;
            display.style.color = "#f1c40f";
        }
    }
}

// ==========================================
// LEVEL MAPS (Grid Layouts)
// ==========================================
/**
 * 5-Level Maze Layouts (15x15 tiles)
 * 
 * Grid Key:
 * 0 = Empty (walkable)
 * 1 = Wall (blocked)
 * 2 = Key (item to collect)
 * 3 = Exit (goal)
 * 
 * Grid Size: 15x15 tiles
 * Player starts at (0, 0)
 * Enemy starts at (14, 14)
 * No border traps - always open paths
 */
const maps = [
    /* LEVEL 1 - Easy - Key in middle intersection with multiple escape routes */
    [
        [0,0,0,1,0,0,0,0,0,0,0,0,2,0,3],
        [0,1,0,1,0,1,1,1,1,1,0,1,1,1,1],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
        [0,0,0,0,0,0,0,2,0,0,0,0,1,0,1],
        [1,1,1,1,1,1,1,0,1,1,1,0,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,1,1,1,1,0,1,0,1,0,1,1,1,0,1],
        [0,1,0,0,0,0,1,0,1,0,0,0,0,0,1],
        [0,1,0,1,1,1,1,0,1,1,1,1,1,1,1],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,1,1,1,1,1,1,0,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    
    /* LEVEL 2 - Medium - Key in central hub with 4-way paths */
    [
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,0,1,0,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
        [0,0,0,0,0,0,1,0,2,0,0,0,1,0,1],
        [1,1,1,0,1,0,1,0,1,1,1,0,1,0,1],
        [0,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
        [0,1,1,1,1,1,1,1,1,0,1,1,1,0,1],
        [0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [0,1,0,1,1,1,1,0,1,1,1,1,1,1,1],
        [0,1,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [2,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    
    /* LEVEL 3 - Hard - Key in crossroads, requires tactical timing */
    [
        [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
        [0,0,0,0,0,2,0,1,0,0,0,0,1,0,1],
        [1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,0,1,1,1,1,0,1,1,1,1,1,1,1],
        [0,1,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,2,3]
    ],
    
    /* LEVEL 4 - Very Hard - Key in side corridor with escape paths */
    [
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
        [0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,0,1,1,0,1,1,1,1,1,1,1,1,0,1],
        [0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,1,0,1,1,1,1,1,1,1,1,0,1,0,1],
        [0,1,0,1,0,0,0,0,0,0,0,0,1,0,1],
        [0,1,0,1,0,1,1,1,1,1,1,1,1,0,1],
        [0,1,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,2,0,3],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    
    /* LEVEL 5 - Nightmare - Key in dangerous center, risky grab for speed run */
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,0,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [0,0,0,0,0,0,2,0,0,0,0,0,1,0,1],
        [1,1,1,1,1,1,0,1,1,1,1,0,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,1,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [2,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    
    /* LEVEL 6 - FINAL DESCENT - Zigzag pattern with entity chasing from behind */
    [
        [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
        [1,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,2,3]
    ]
];

//BREADTH-FIRST SEARCH (BFS)
/**
 * Queue-based Pathfinding Algorithm
 * 
 * BFS (Breadth-First Search):
 * - Uses Queue (FIFO) data structure
 * - Finds shortest path in unweighted grid
 * - Explores level by level
 * 
 * Time Complexity: O(rows × cols)
 * Space Complexity: O(rows × cols) for visited array
 * 
 * @param {number} startX, startY - Starting position
 * @param {number} targetX, targetY - Target position
 * @param {Array} grid - Game grid
 * @param {Object} constants - Game constants
 * @returns {Object} - Next step position {x, y} or null if no path
 */
function findNextPathStep(startX, startY, targetX, targetY, grid, constants) {
    // Queue initialization (FIFO)
    const queue = [{ x: startX, y: startY, path: [] }];
    
    // Visited tracking to avoid revisiting nodes
    const visited = Array.from({ length: constants.ROWS }, () => 
        Array(constants.COLS).fill(false)
    );
    visited[startY][startX] = true;
    
    // Possible directions: Up, Down, Left, Right
    const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];

    // BFS Loop
    while (queue.length > 0) {
        // Dequeue first element (FIFO)
        const current = queue.shift();
        
        // Check if we reached target
        if (current.x === targetX && current.y === targetY) {
            return current.path.length > 0 ? current.path[0] : null;
        }

        // Explore all 4 neighbors
        for (const [dx, dy] of directions) {
            const nx = current.x + dx;
            const ny = current.y + dy;
            
            // Validity checks
            if (nx >= 0 && nx < constants.COLS && 
                ny >= 0 && ny < constants.ROWS && 
                grid[ny][nx] !== constants.TILE_WALL && 
                !visited[ny][nx]) {
                
                visited[ny][nx] = true;
                
                // Enqueue new position with updated path
                queue.push({
                    x: nx,
                    y: ny,
                    path: [...current.path, { x: nx, y: ny }]
                });
            }
        }
    }
    
    return null; // No path found
}
