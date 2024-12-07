import { read, readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/06/input.txt', 'utf8');
const rows = data.replace(/\r/g, '').split('\n').map(row => row.split(''));

class Guard {
    currentRow: number;
    currentCol: number;
    currentDirection: Direction;
    outOfBounds: boolean;
    isLooping: boolean ;
    traversedTiles: Set<string>;

    constructor(){
        this.traversedTiles = new Set<string>();
    }

    move(grid: Tile[][]) : Tile[][]{
        
        let currentTile: Tile = grid[this.currentRow][this.currentCol];
        let nextTile : Tile;

        switch(this.currentDirection){
            case Direction.UP:
                try {
                    nextTile = grid[this.currentRow - 1][this.currentCol];
                } catch (e) {
                    nextTile = undefined;
                }
                break;
            case Direction.DOWN:
                try {
                    nextTile = grid[this.currentRow + 1][this.currentCol ];
                } catch (e) {
                    nextTile = undefined;
                }
                break;
            case Direction.LEFT:
                try {
                    nextTile = grid[this.currentRow][this.currentCol - 1];
                } catch (e) {
                    nextTile = undefined;
                }
                break;
            case Direction.RIGHT:
                try{ 
                    nextTile = grid[this.currentRow][this.currentCol + 1];
                } catch (e) {
                    nextTile = undefined;
                }
                break;
        }

        if(nextTile == undefined){
            this.outOfBounds = true;
            return grid;
        }
        if(nextTile.Type == 1){
            // eerst draaien
            switch(this.currentDirection){
                case Direction.UP:
                    // turn right
                    this.currentDirection = Direction.RIGHT;
                    // nextTile = grid[this.currentRow][this.currentCol + 1];
                    break;
                case Direction.DOWN:
                    // turn left
                    this.currentDirection = Direction.LEFT;
                    // nextTile = grid[this.currentRow][this.currentCol - 1];
                    break;
                case Direction.LEFT:
                    // turn up
                    this.currentDirection = Direction.UP;
                    // nextTile = grid[this.currentRow - 1][this.currentCol];
                    break;
                case Direction.RIGHT:
                    // turn down
                    this.currentDirection = Direction.DOWN;
                    // nextTile = grid[this.currentRow + 1][this.currentCol];
                    break;
            }
            // // dan bewegen
            // this.currentRow = nextTile.rowIndex;
            // this.currentCol = nextTile.colIndex;

            // currentTile.Type = 0; // 'huidige' tile is geen guard meer
            // nextTile.isTraversedByGuard = true; // nieuwe tile is traversed
            // nextTile.Type = 3; // nieuwe tile is guard
            // nextTile.value = this.currentDirection; // set direction
        } else {
            // enkel bewegen in huidige richting
            this.currentRow = nextTile.rowIndex;
            this.currentCol = nextTile.colIndex;
            currentTile.Type = 0; // 'huidige' tile is geen guard meer
            nextTile.isTraversedByGuard = true; // nieuwe tile is traversed
            nextTile.Type = 3; // nieuwe tile is guard
            nextTile.value = this.currentDirection; // set direction
        }
        if(this.traversedTiles.has(`${this.currentRow},${this.currentCol},${this.currentDirection}`)){
            this.isLooping = true;
        }
        this.traversedTiles.add(`${this.currentRow},${this.currentCol},${this.currentDirection}`);
        return grid;
    }

}

enum Direction {
    UP = '^',
    DOWN = 'v',
    LEFT = '<',
    RIGHT = '>'
}

class Tile {
    colIndex: number;
    rowIndex: number;
    value: string;
    Type: number; // 0 = open, 1 = obstacle, 3 = guard
    isTraversedByGuard: boolean;
}

class Map {
    grid: Tile[][];
    initialGrid: Tile[][];
    guard: Guard;
    initialGuard: Guard;

    constructor(grid: Tile[][]){
        // deepcopy for reset
        this.initialGrid = grid.map(row => 
            row.map(tile => Object.assign(new Tile(), {
                value: tile.value,
                Type: tile.Type,
                isTraversedByGuard: tile.isTraversedByGuard,
                colIndex: tile.colIndex,
                rowIndex: tile.rowIndex
            }))
        );

        // Initialize the current grid and guard
        this.grid = this.initialGrid.map(row =>
            row.map(tile => Object.assign(new Tile(), tile))
        );
        this.guard = findGuard(this.grid);
        this.grid[this.guard.currentRow][this.guard.currentCol].isTraversedByGuard = true; // First tile is traversed

    }

    moveGuard(){
        this.grid = this.guard.move(this.grid);
        // check if loop
        const state = `${this.guard.currentRow},${this.guard.currentCol},${this.guard.currentDirection}`;


    }

    print(){
        console.log('Guard is at col: ', this.guard.currentRow, 'row: ', this.guard.currentCol, 'facing', this.guard.currentDirection);
        this.grid.forEach(row => {
            console.log(
                row.map((tile) => {
                    if(tile.isTraversedByGuard && tile.Type !== 3){
                        return 'X';
                    }
                    return tile.value;
                })
                .join(' ')
            
            );
        });
    }
    getTraversedTiles() : Tile[]{
        return this.grid.flatMap((tile) => tile.filter((tile) => tile.isTraversedByGuard).map(tile => {tile.Type !== 3 ? tile.value = '.' : tile.value; return tile;}));
    }
    getTraversalCount(){
        console.log("Tiles traversed: ", this.getTraversedTiles.length);
    }

    reset() {
        // Reset the grid to its initial state
        this.grid = this.initialGrid.map(row =>
            row.map(tile => Object.assign(new Tile(), tile))
        );

        // Reinitialize the guard
        this.guard = findGuard(this.grid);
        this.grid[this.guard.currentRow][this.guard.currentCol].isTraversedByGuard = true;
        this.guard.traversedTiles.clear();
    }
}

function findGuard(grid: Tile[][]) : Guard{
    let guard: Guard = null;

    for(let row = 0; row < grid.length; row++){
        for(let col = 0; col < grid[row].length; col++){
            let tile: Tile = grid[row][col];
            if(tile.Type == 3){
                let initGuard = new Guard();
                initGuard.currentRow = row;
                initGuard.currentCol = col;
                initGuard.currentDirection = tile.value as Direction;
                guard = initGuard;
            }
        }
    }
    return guard;
}


// (function solvePt1(){
//     let rowsWithTiles = rows.map((row, rowIndex) => row.map((tile, colIndex) => {
//         let tileType : number;
//         switch(tile){
//             case '.':
//                 tileType = 0;
//                 break;
//             case '#':
//                 tileType = 1;
//                 break;
//             default:
//                 tileType = 3;
//                 break;
//         }
//         return Object.assign(new Tile(), {
//             value: tile, 
//             Type: tileType, 
//             isTraversedByGuard: false,
//             colIndex: colIndex,
//             rowIndex: rowIndex
//         });
//     }));
        

//     let map : Map = new Map(rowsWithTiles);

//     while(!map.guard.outOfBounds){
//         map.moveGuard();
//     }
//     map.getTraversalCount();

//     map.print();
// })();

(function solvePt2() {
    let rowsWithTiles = rows.map((row, rowIndex) => row.map((tile, colIndex) => {
        let tileType : number;
        switch(tile){
            case '.':
                tileType = 0;
                break;
            case '#':
                tileType = 1;
                break;
            default:
                tileType = 3;
                break;
        }
        return Object.assign(new Tile(), {
            value: tile, 
            Type: tileType, 
            isTraversedByGuard: false,
            colIndex: colIndex,
            rowIndex: rowIndex
        });
    }));

    let map : Map = new Map(rowsWithTiles);
    
    // Let the guard move across the map to find the traversed tiles
    while(!map.guard.outOfBounds){
        map.moveGuard();
    }
    let possibleTilesForNewObstacle : Tile[] = map.getTraversedTiles();
    let objectsLoopCOunt = 0;

    // loop through traversed tiles, set an obstacle (except on the first 2)
    possibleTilesForNewObstacle.forEach((tile, index) => {
    
        if(index > 1){
            map.reset();
            // set to obstacle
            tile.Type = 1;
            console.log('Setting tile ', tile, 'to obstacle');
            map.grid[tile.rowIndex][tile.colIndex].Type = 1;
            map.grid[tile.rowIndex][tile.colIndex].value = "O";

            // Check if guard goes in loop
            while(!map.guard.outOfBounds){
                map.moveGuard();
                if(map.guard.isLooping){
                    objectsLoopCOunt++;
                    console.log('Guard is looping');
                    break;
                }
            }
            // map.print();
        }
    });
    console.log('obj: ' + objectsLoopCOunt);

})();
