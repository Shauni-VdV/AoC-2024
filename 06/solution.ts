import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/06/input.txt', 'utf8');
const rows = data.replace(/\r/g, '').split('\n').map(row => row.split(''));

class Guard {
    currentRow: number;
    currentCol: number;
    currentDirection: Direction;

    move(grid: Tile[][]) : Tile[][]{
        
        let currentTile = grid[this.currentCol][this.currentRow];
        console.log('current tile', currentTile);
        let nextTile : Tile;
        let nextPos: number[];
        switch(this.currentDirection){
            case Direction.UP:
                nextTile = grid[this.currentCol][this.currentRow - 1];
                nextPos = [ this.currentCol, this.currentRow - 1];
                break;
            case Direction.DOWN:
                nextTile = grid[this.currentCol][this.currentRow];
                nextPos = [this.currentCol, this.currentRow];
                break;
            case Direction.LEFT:
                nextTile = grid[this.currentCol - 1][this.currentRow];
                nextPos = [this.currentCol - 1, this.currentRow];
                break;
            case Direction.RIGHT:
                nextTile = grid[this.currentCol + 1][this.currentRow];
                nextPos = [this.currentCol + 1, this.currentRow];

                break;
        }
        console.log('next position', nextPos);
        if(nextTile == undefined){
            console.log('next tile is undefined');
            return grid;
        }
        if(nextTile.Type == 1){
            // eerst draaien
            console.log('next tile is obstacle, turning', nextTile);
            switch(this.currentDirection){
                case Direction.UP:
                    this.currentDirection = Direction.RIGHT;
                    // next tile aanpassen = 1 naar onder, 1 naar rechts
                    nextPos = [this.currentCol + 1, this.currentRow + 1];
                    nextTile = grid[nextPos[0]][nextPos[1]];

                    break;
                case Direction.DOWN:
                    this.currentDirection = Direction.LEFT;
                    nextPos = [this.currentCol - 1, this.currentRow - 1];
                    nextTile = grid[nextPos[0]][nextPos[1]];
                  
                    break;
                case Direction.LEFT:
                    this.currentDirection = Direction.UP;
                    nextPos = [this.currentCol + 1, this.currentRow - 1];
                    nextTile = grid[nextPos[0]][nextPos[1]];
               
                    break;
                case Direction.RIGHT:
                    this.currentDirection = Direction.DOWN;
                    nextPos = [this.currentCol - 1, this.currentRow + 1];
                    nextTile = grid[nextPos[0]][nextPos[1]];
                   
                    break;
            }
            // dan bewegen
            console.log('after turning, next tile is:', nextTile);
            console.log('at pos:', nextPos);
            this.currentRow = nextPos[1];
            this.currentCol = nextPos[0];
            currentTile.Type = 0; // 'huidige' tile is geen guard meer
            nextTile.isTraversedByGuard = true; // nieuwe tile is traversed
            nextTile.Type = 3; // nieuwe tile is guard
            nextTile.value = this.currentDirection; // set direction
        } else {
            // enkel bewegen in huidige richting
            console.log('moving in current direction');
            this.currentRow = nextPos[1];
            this.currentCol = nextPos[0];
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
        grid[this.guard.currentCol][this.guard.currentRow].isTraversedByGuard = true; // eerste tile is traversed
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
}

function findGuard(grid: Tile[][]) : Guard{
    let guard: Guard = null;

    for(let row = 0; row < grid.length; row++){
        for(let col = 0; col < grid[row].length; col++){
            let tile: Tile = grid[row][col];
            if(tile.Type == 3){
                let initGuard = new Guard();
                initGuard.currentRow = col;
                initGuard.currentCol = row;
                initGuard.currentDirection = tile.value as Direction;
                guard = initGuard;
            }
        }
    }
    return guard;
}


(function solvePt1(){
    let rowsWithTiles = rows.map((row) => row.map((tile, index) => {
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
        return Object.assign(new Tile(), {value: tile, Type: tileType, isTraversedByGuard: false});
    }));
        

    let map : Map = new Map(rowsWithTiles);

    for(let i = 0; i < 10; i++){
        map.moveGuard();
        map.print();

    }

    map.print();
})();
