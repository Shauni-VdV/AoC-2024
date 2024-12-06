import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/06/input.txt', 'utf8');
const rows = data.replace(/\r/g, '').split('\n').map(row => row.split(''));

class Guard {
    currentX: number;
    currentY: number;
    currentDirection: Direction;
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
    }

    moveGuard(direction: Direction){
        switch(direction){
            case Direction.UP:
                this.guard.currentY--;
                break;
            case Direction.DOWN:
                this.guard.currentY++;
                break;
            case Direction.LEFT:
                this.guard.currentX--;
                break;
            case Direction.RIGHT:
                this.guard.currentX++;
                break;
        }
    }

    print(){
        console.log('Guard is at col: ', this.guard.currentX, 'row: ', this.guard.currentY, 'facing', this.guard.currentDirection);
        this.grid.forEach(row => {
            console.log(row.map((tile) => tile.value).join(' '));
        });
    }
}

function findGuard(grid: Tile[][]) : Guard{
    let guard: Guard = null;

    for(let row = 0; row < grid.length; row++){
        for(let col = 0; col < grid[row].length; col++){
            let tile: Tile = grid[row][col];
            if(tile.Type == 3){
                console.log("FOUND GUARD");
                let initGuard = new Guard();
                initGuard.currentX = col;
                initGuard.currentY = row;
                initGuard.currentDirection = tile.value as Direction;
                console.log(initGuard);
                guard = initGuard;
            }
        }
    }
    return guard;
}


(function solvePt1(){
    let rowsWithTiles = rows.map((row) => row.map((tile, index) => {
        console.log(tile);
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
    map.print();

    // map.moveGuard(Direction.UP);
    // map.print();
})();
