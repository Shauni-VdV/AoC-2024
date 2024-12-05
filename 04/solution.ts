import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/04/input.txt', 'utf8');

const rows = data.replace(/\r/g, '').split('\n');

const maxRow = rows.length -1
const maxCol = rows[0].length -1

const grid = rows.map(row => row.split(''));
printMatrix(grid);
// PART 1
function findMatches(grid: string[][]): number {
    let matches = 0;
    let word = 'XMAS';

    for (let row = 0; row < grid.length; row++) {
        console.log('row', row, grid[row]);
        for(let col = 0; col < grid[row].length; col++) {
            let currElement : string = grid[row][col];
            if(currElement === 'X'){
                for(let i = 1; i <= 8; i++){
                    // correct start value, find next letter in adjacent cells
                    if(isMatchInDirection(row, col, i)){
                        console.log('found full word in direction:', i );
                        matches++;
                    }
                }
                
                
            }
        }
    }

    return matches;
}

function isMatchInDirection(startRow: number, startCol: number, direction : Direction): boolean{
  let match = true;
  let word = ['M', 'A', 'S'];

  let row: number;
  let col: number;
  for(let i = 0; i < word.length; i++){
    [row, col] = moveToAdjacent(startRow, startCol, direction)[0];
    console.log('moved to:')
    startRow = row;
    startCol = col;
    console.log('row', row, 'max:', maxRow)
    console.log('col', col, 'max:', maxCol)
    if((0 <= row && row <= maxRow ) && (0 <= col && col <= maxCol)){
        console.log('letter', grid[row][col])
        if(word[i] === grid[row][col]){
            console.log(word[i] + ' matches index ' + i + ' in word: ' + word);
        } else {
            match = false;
        }
    } else {
        console.log('out of bounds')
        match = false;
    }
   
  }
  return match;
}


function moveToAdjacent(startRow : number, startColumn: number , direction: Direction): number[][]{
    console.log('moving to adjacent in direction', direction)
    let newCoord : number[][];
    switch(direction){
        case Direction.Up:
            newCoord = [[startRow + 1, startColumn]];
            break;
        case Direction.Down:
            newCoord = [[startRow - 1, startColumn]];
            break;
        case Direction.Left:
            newCoord = [[startRow, startColumn - 1]];
            break;
        case Direction.Right:
            newCoord = [[startRow, startColumn + 1]];
            break;
        case Direction.UpLeft:
            newCoord = [[startRow - 1, startColumn - 1]];
            break;
        case Direction.UpRight:
            newCoord = [[startRow - 1, startColumn + 1]];
            break;
        case Direction.DownLeft:
            newCoord = [[startRow + 1, startColumn - 1]];
            break;
        case Direction.DownRight:
            newCoord = [[startRow + 1, startColumn + 1]];
            break;
    }
    return newCoord;
}

function getAdjacentValue(startRow: number, startColumn: number, direction: Direction): string{
    let row: number;
    let col: number;
    [row, col] = moveToAdjacent(startRow, startColumn, direction)[0];
    if(0 <= row && row <= maxRow && 0 <= col && col <= maxCol){
        return grid[row][col];
    } return '';
}


// Part 2:

console.log('xes:', findXes(grid));
// 1: Find 'A'
// 2: Create string of topleft, mid, bottomright & bottomleft, mid, topright
// 3: check if both strings are equal to 'SAM' or 'MAS'
function findXes(grid: string[][]): number {
    let matches = 0;
    for (let row = 0; row < grid.length; row++) {
        for(let col = 0; col < grid[row].length; col++) {
            let currElement: string = grid[row][col];
            if(currElement === "A"){
                checkDiagonals(row, col) ? matches++ : null;
            }
        }
    }

   
    return matches;
}

function checkDiagonals(row: number, col: number): boolean{
    // Both diagonals must be 'SAM' or 'MAS'
    let topLeft = getAdjacentValue(row, col, Direction.UpLeft);
    let bottomRight = getAdjacentValue(row, col, Direction.DownRight);
    let bottomLeft = getAdjacentValue(row, col, Direction.DownLeft);
    let topRight = getAdjacentValue(row, col, Direction.UpRight);

   let diagonal1 = (topLeft + grid[row][col] + bottomRight) === 'SAM' || (topLeft + grid[row][col] + bottomRight) === 'MAS';
   let diagonal2 = (bottomLeft + grid[row][col] + topRight) === 'SAM' || (bottomLeft + grid[row][col] + topRight) === 'MAS';

   return diagonal1 && diagonal2;
}




// Helpers
function printMatrix(matrix: string[][]): void {
    matrix.forEach(row => {
        console.log(row.join(' '));
    });
}


export const enum Direction {
    "Up"  = 1,
    "Down" = 2,
    "Left" = 3,
    "Right" = 4,
    "UpLeft" = 5,
    "UpRight" = 6,
    "DownLeft" = 7,
    "DownRight" = 8
}