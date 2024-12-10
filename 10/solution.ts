import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/10/input.txt', 'utf8');
const rows = data.replace(/\r/g, '').split('\n').map(row => row.split(''));

console.log(rows.length, rows[0].length);

class Coord {
    row: number;
    col: number;
    value: number;
    constructor(row: number, col: number, value: number){
        this.row = row;
        this.col = col;
        this.value = value;
    }
}


(function solvePt1(){
    let totalTrailScore = 0;
    let grid: Coord[][] = rows.map((row, rowIndex) => {
        return row.map((col, colIndex) => new Coord(rowIndex, colIndex, parseInt(col)));
    });
    printGrid(grid);

    // trailheads always start with value 0
    for(let row = 0; row < grid.length -1; row++){
        for(let col = 0; col < rows[0].length -1; col++){
            if(grid[row][col].value == 0){
                console.log("--------------------")
                console.log('Trailhead found at', row, col);
                // find trail length
                let trailScore : number = findTrailScore(grid, row, col);
                console.log("trail score", trailScore);
                totalTrailScore += trailScore;
            }
        }
    }   
    console.log('Total trail score:', totalTrailScore);

})();

function findTrailScore(grid: Coord[][], row: number, col: number){
    let trailCount = findNextValues(grid, row, col, 0, []);
    return trailCount;
}

function findNextValues(grid: Coord[][], row: number, col: number, trailCount : number, reachedEnds: Coord[]) : number{
    let currentValue = grid[row][col].value;
    let nextValue = currentValue + 1;
    let nextCoords : Coord[] = [];
    let reachedendCoords: Coord[] = reachedEnds;

    // find next value in cardinal directions
    let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    directions.forEach(direction => {
        let newRow = row + direction[0];
        let newCol = col + direction[1];
        if(checkInBounds(newRow, newCol)){
            //console.log(newRow, newCol, '..in bounds, value', grid[newRow][newCol].value, 'needs to be', nextValue);
            if(grid[newRow][newCol].value == nextValue){
                if(nextValue == 9 && !reachedEnds.find(coord => coord.row == newRow && coord.col == newCol)){
                    reachedendCoords.push(grid[newRow][newCol]);
                    trailCount++;
                }
                nextCoords.push(grid[newRow][newCol]);
                
            }
            
        }
    });

   
    if(nextCoords.length > 0){
        nextCoords.forEach(coord => {
            trailCount = findNextValues(grid, coord.row, coord.col, trailCount, reachedEnds);
        });
    } else {
        //console.log('No next value found for', row, col);
    }
    
    return trailCount;
}

function checkInBounds(row: number, col: number){
    return (0 <= row && row < rows.length) && (0 <= col && col < rows[0].length);
}

function printGrid(grid: Coord[][]){
    console.log(grid.map(row => row.map(col => col.value).join('')).join('\n'));

}

function findPaths(grid: Coord[][], row: number, col: number, trailCount : number) : number{
    let currentValue = grid[row][col].value;
    let nextValue = currentValue + 1;
    let nextCoords : Coord[] = [];

    // find next value in cardinal directions
    let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    directions.forEach(direction => {
        let newRow = row + direction[0];
        let newCol = col + direction[1];
        if(checkInBounds(newRow, newCol)){
            console.log(newRow, newCol, '..in bounds, value', grid[newRow][newCol].value, 'needs to be', nextValue);
            if(grid[newRow][newCol].value == nextValue){
                if(nextValue == 9){
                    trailCount++;
                }
                nextCoords.push(grid[newRow][newCol]);
                
            }
            
        }
    });

   
    if(nextCoords.length > 0){
        nextCoords.forEach(coord => {
            trailCount = findPaths(grid, coord.row, coord.col, trailCount);
        });
    } else {
        console.log('No next value found for', row, col);
    }
    
    return trailCount;
}