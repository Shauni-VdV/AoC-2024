import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/04/input.txt', 'utf8');

const rows = data.replace(/\r/g, '').split('\n');

const maxRow = rows.length -1
const maxCol = rows[0].length -1

const grid = rows.map(row => row.split(''));
printMatrix(grid);


console.log('total matches: ' , findMatches(grid))
function findMatches(grid: string[][]): number {
    let matches = 0;
    let word = 'XMAS';

    for (let row = 0; row < grid.length; row++) {
        console.log('row', row, grid[row]);
        for(let col = 0; col < grid[row].length; col++) {
            let currElement : string = grid[row][col];
            if(currElement === 'X'){
                console.log('found first letter', currElement);

                let word : string[] = ['X', 'M', 'A', 'S'];
                for(let i = 1; i <= 8; i++){
                    // correct start value, find next letter in adjacent cells
                    if(isMatchInDirection(false, row, col, i)){
                        console.log('found full word in direction:', i );
                        matches++;
                    }
                }
                
                
            }
        }
    }

    return matches;
}

function isMatchInDirection(reverse: boolean, startRow: number, startCol: number, direction : Direction): boolean{
  let match = true;
  let word = reverse ? ['A', 'M', 'X'] : ['M', 'A', 'S'];

  let row: number;
  let col: number;
  for(let i = 1; i < word.length; i++){
    [row, col] = moveToAdjacent(startRow, startCol, direction)[0];
    console.log('moved to:')
    console.log('row', row, 'max:', maxRow)
    console.log('col', col, 'max:', maxCol)
    if((0 <= row && row <= maxRow ) && (0<= col && col <= maxCol)){
        console.log('letter', grid[row][col])
        if(word[i] === grid[row][col]){
            console.log(word[i] + ' matches index ' + i + ' in word: ' + word);
        } else {
            match = false;
        }
    } else {
        console.log('out of bounds')
    }
   
  }
  return match;
}


function moveToAdjacent(startRow : number, startColumn: number , direction: Direction): number[][]{
    console.log('moving to adjacent', direction)
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