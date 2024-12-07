import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/06/input.txt', 'utf8');
const rows = data.replace(/\r/g, '').split('\n').map(row => row.split(''));

class Guard {
    currentRow: number;
    currentCol: number;
    currentDirection: Direction;
    outOfBounds: boolean;

    move(grid: Tile[][]) : Tile[][]{
        
        let currentTile: Tile = grid[this.currentRow][this.currentCol];
        let nextTile : Tile;

        console.log('current tile', currentTile);
        switch(this.currentDirection){
            case Direction.UP:
                nextTile = grid[this.currentRow - 1][this.currentCol];
                break;
            case Direction.DOWN:
                nextTile = grid[this.currentRow + 1][this.currentCol ];

                break;
            case Direction.LEFT:
                nextTile = grid[this.currentRow][this.currentCol - 1];
                break;
            case Direction.RIGHT:
                nextTile = grid[this.currentRow][this.currentCol + 1];
                break;
        }
        console.log("Attempting to move to tile", nextTile)

        if(nextTile == undefined){
            console.log('next tile is undefined');
            this.outOfBounds = true;
            return grid;
        }
        if(nextTile.Type == 1){
            // eerst draaien
            console.log('next tile is obstacle, turning..');
            switch(this.currentDirection){
                case Direction.UP:
                    // turn right
                    this.currentDirection = Direction.RIGHT;
                    nextTile = grid[this.currentRow][this.currentCol + 1];
                    break;
                case Direction.DOWN:
                    // turn left
                    this.currentDirection = Direction.LEFT;
                    nextTile = grid[this.currentRow][this.currentCol - 1];
                    break;
                case Direction.LEFT:
                    // turn up
                    this.currentDirection = Direction.UP;
                    nextTile = grid[this.currentRow - 1][this.currentCol];
                    break;
                case Direction.RIGHT:
                    // turn down
                    this.currentDirection = Direction.DOWN;
                    nextTile = grid[this.currentRow + 1][this.currentCol];
                    break;
            }
            // dan bewegen
            console.log('after turning, next tile is:', nextTile);
            this.currentRow = nextTile.rowIndex;
            this.currentCol = nextTile.colIndex;

            currentTile.Type = 0; // 'huidige' tile is geen guard meer
            nextTile.isTraversedByGuard = true; // nieuwe tile is traversed
            nextTile.Type = 3; // nieuwe tile is guard
            nextTile.value = this.currentDirection; // set direction
        } else {
            // enkel bewegen in huidige richting
            console.log('moving in current direction');
            this.currentRow = nextTile.rowIndex;
            this.currentCol = nextTile.colIndex;
            console.log('newX:', this.currentRow, 'newY:', this.currentCol);
            currentTile.Type = 0; // 'huidige' tile is geen guard meer
            nextTile.isTraversedByGuard = true; // nieuwe tile is traversed
            nextTile.Type = 3; // nieuwe tile is guard
            nextTile.value = this.currentDirection; // set direction
        }
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
    guard: Guard;

    constructor(grid: Tile[][]){
        this.grid = grid;
        this.guard = findGuard(grid);
        grid[this.guard.currentRow][this.guard.currentCol].isTraversedByGuard = true; // eerste tile is traversed
    }

    moveGuard(){
        this.grid = this.guard.move(this.grid);
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
    getTraversalCount(){
        console.log("Tiles traversed: ", this.grid.flatMap((tile) => tile.filter((tile) => tile.isTraversedByGuard)).length);
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


(function solvePt1(){
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

    while(!map.guard.outOfBounds){
        map.moveGuard();
        map.print();
    }
    map.getTraversalCount();

    map.print();
})();
