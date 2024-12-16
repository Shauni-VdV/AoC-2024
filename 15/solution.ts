// Input read
import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/15/input.txt', 'utf8');

// Classes 
class Robot {
    row :number;
    col: number;
}
class Tile {
    row: number;
    col: number;
    Type: TileType;
}

enum TileType {
    Empty = '.',
    Wall = '#',
    Robot = '@',
    Box = "O"
}

enum Direction {
    Up = '^',
    Down = 'v',
    Left = '<',
    Right = '>'
}

let grid: Tile[][] = [];
let robot: Robot = new Robot();
//#region Parse Input
// Grid
const rows = data.split('\r\n\r')[0].replace(/\r/g, '').split('\n').map(row => row.split(''));
rows.forEach((row, rowIndex) => {
    let gridRow: Tile[] = [];
    row.forEach((col, colIndex) => {
        let tile = new Tile();
        tile.row = rowIndex;
        tile.col = colIndex;
        tile.Type = col as TileType;
        gridRow.push(tile);
        if(tile.Type == TileType.Robot){
            robot.row = rowIndex;
            robot.col = colIndex;
        }
    });
    grid.push(gridRow);
});

// Moves
const moves: Direction[] = data.split('\r\n\r')[1].replace(/\r|\n/g, '').split('').map(row => row[0] as Direction);
console.log(moves);
//#endregion

printGrid();

//#region Part1
moves.forEach((move, index) => {
    console.log(index, ':', move);
    // move robot
    let robotTile = grid[robot.row][robot.col];
    let attemptedTile = getNextTileForRobot(robot, move);

    // Next tile is wall ? can't move in this direction
    if(attemptedTile.Type == TileType.Wall) return; 
    // Next tile is empty ? simply move the robot
    if(attemptedTile.Type == TileType.Empty){
        robotTile.Type = TileType.Empty;
        attemptedTile.Type = TileType.Robot;
        robot.row = attemptedTile.row;
        robot.col = attemptedTile.col;
    }
    
    // Next tile is box? move the box (for now just act as if it is a wall)
    if(attemptedTile.Type == TileType.Box){
       return;
    }
    printGrid();

});

function getNextTileForRobot(robot: Robot, direction: Direction): Tile{
    let nextTile: Tile;
    switch(direction){
        case Direction.Up:
            nextTile = grid[robot.row - 1][robot.col];
            break;
        case Direction.Down:
            nextTile = grid[robot.row + 1][robot.col];
            break;
        case Direction.Left:
            nextTile = grid[robot.row][robot.col - 1];
            break;
        case Direction.Right:
            nextTile = grid[robot.row][robot.col + 1];
            break;
    }
    return nextTile;
}

//#endregion


//#region Helpers
function printGrid(){
    grid.forEach((row) => {
        let rowString = '';
        row.forEach((col) => {
            rowString += col.Type;
        });
        console.log(rowString);
    });
}

printGrid();