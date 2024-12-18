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
    Box = "O",
    Box_Left = '[',
    Box_Right = ']'
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
const rows = data.split('\r\n\r')[0].replace(/\r/g, '').split('\n').map(row => row.split(''));

// Grid
// Takes the initial rows from the input and maps it to a 2D array of Tile objects
function mapGrid(){
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
}


// Moves
const moves: Direction[] = data.split('\r\n\r')[1].replace(/\r|\n/g, '').split('').map(row => row[0] as Direction);
console.log(moves);

//#endregion

//#region Part1
function solvePt1(){
    mapGrid();
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
    // printGrid();
    // calculateCoordinates();
}



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


//#region Part2
// Reset grid & recalculate with wider boxes
function solvePt2(){
    grid = [];

    grid = createWideGrid();
    mapWideGrid();

    printGrid();
    printGridWithCoordinates();

    findRobot();
    
    moves.forEach((move, index) => {
        console.log(index, ':', move);
        // move robot
        let robotTile = grid[robot.row][robot.col];
        console.log('Robot:' ,robotTile);
        let attemptedTile = getNextTile(robot, move);
    
        // Next tile is wall ? can't move in this direction
        if(attemptedTile.Type == TileType.Wall) return; 
        // Next tile is empty ? simply move the robot
        if(attemptedTile.Type == TileType.Empty){
            moveRobot(attemptedTile, robotTile);
        }
        
        // Next tile is box? move the box
        if(attemptedTile.Type == TileType.Box){
            moveWideBox(attemptedTile, move) ? moveRobot(attemptedTile, robotTile) : null;
        }
        printGrid();
    
    });
    // printGrid();
    // calculateCoordinates();
}


function moveWideBox(box: Tile, direction: Direction): boolean {
    let nextTile: Tile = getNextTile(box, direction); // Get next tile, regardless of direction
    let secondNextTile: Tile;

    return false;
}

solvePt2();


//#endregion


//#region Helpers

function createWideGrid(): Tile[][]{
    let wideGrid : Tile[][] = [];
    rows.forEach((row, rowIndex) => {
        let gridRow: Tile[] = [];
    
        row.forEach((col, colIndex) => {
            let tile = new Tile();
            tile.Type = col as TileType;
            
            // duplicate empty tiles
            if(tile.Type == TileType.Empty){
                gridRow.push(tile);
                let secondTile = new Tile();
                secondTile.Type = TileType.Empty;
     
                gridRow.push(secondTile);
                return;
            }
            // Duplicate walls
            if(tile.Type == TileType.Wall){
                gridRow.push(tile);
                let secondTile = new Tile();
                secondTile.Type = TileType.Wall;
                gridRow.push(secondTile);
                return;
            }
            // Duplicate boxes
            if(tile.Type == TileType.Box){
                tile.Type = TileType.Box_Left;
                gridRow.push(tile);

                let secondTile = new Tile();
                secondTile.Type = TileType.Box_Right;

                gridRow.push(secondTile);
                return;
            }
            // Add empty space behind robot
            if(tile.Type == TileType.Robot){
                gridRow.push(tile);
                let secondTile = new Tile();
                secondTile.Type = TileType.Empty;
                gridRow.push(secondTile);
                return;
            }

        });
        wideGrid.push(gridRow);
    });
    return wideGrid;
}
// Loops through all rows and columns of the wide grid, and correctly sets all tile values
function mapWideGrid(){
    grid.forEach((row, rowIndex) => {
        
        row.forEach((col, colIndex) => {
            let tile = new Tile();
            tile.row = rowIndex;
            tile.col = colIndex;
            tile.Type = col.Type as TileType;
            if(tile.Type == TileType.Robot){
                robot.row = rowIndex;
                robot.col = colIndex;
            }
        });
    });
}

function findRobot(){
    grid.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if(col.Type === TileType.Robot){
                robot.row = rowIndex;
                robot.col = colIndex;
            }
        });
    });
}


function printGrid(){
    grid.forEach((row) => {
        let rowString = '';
        row.forEach((col) => {
            rowString += col.Type;
        });
        console.log(rowString);
    });
}

function printGridWithCoordinates(){
    grid.forEach((row) => {
        let rowString = '';
        row.forEach((col) => {
            rowString += col.Type + '(' + col.row + ',' + col.col + ')';
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