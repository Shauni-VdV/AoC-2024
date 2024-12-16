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
    let attemptedTile = getNextTile(robot, move);

    // Next tile is wall ? can't move in this direction
    if(attemptedTile.Type == TileType.Wall) return; 
    // Next tile is empty ? simply move the robot
    if(attemptedTile.Type == TileType.Empty){
        moveRobot(attemptedTile, robotTile);
    }
    
    // Next tile is box? move the box
    if(attemptedTile.Type == TileType.Box){
        moveBox(attemptedTile, move) ? moveRobot(attemptedTile, robotTile) : null;
    }

});
printGrid();
calculateCoordinates();

function moveRobot(attemptedTile: Tile, robotTile: Tile){
    robotTile.Type = TileType.Empty;
    attemptedTile.Type = TileType.Robot;
    robot.row = attemptedTile.row;
    robot.col = attemptedTile.col;
}

function moveBox(box: Tile, direction: Direction): boolean{
    let nextTile = getNextTile(box, direction);
    if(nextTile.Type == TileType.Wall) return false;
    // next tile is empty, move the box
    if(nextTile.Type == TileType.Empty){
        box.Type = TileType.Empty;
        nextTile.Type = TileType.Box;
        return true;
    }
    // next tile is box, try moving the next box
    if(nextTile.Type == TileType.Box){
        if(moveBox(nextTile, direction)){
            box.Type = TileType.Empty;
            nextTile.Type = TileType.Box;
            return true;
        }
    }
}

function getNextTile(robot: Robot, direction: Direction): Tile{
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

function calculateCoordinates(): number{
    // for each box, the coordinates are  (100 * row) + col
    let sum = 0;
    grid.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if(col.Type == TileType.Box){
                console.log('Box:', (100 * rowIndex) + colIndex);
                sum += (100 * rowIndex) + colIndex;
            }
        });
    });
    console.log('Sum of GPS Coordinates:', sum);
    return sum;
}