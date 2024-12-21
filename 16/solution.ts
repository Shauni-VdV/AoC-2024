// Input read
import { dir } from 'console';
import { Dir, readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/16/input.txt', 'utf8');

class Coord {
    row: number;
    col: number;
    value: string;
    constructor(row: number, col: number, value: string) {
        this.row = row;
        this.col = col;
        this.value = value;
    }
    isTurn: boolean;
}
class Node {
    row: number;
    col: number;
    value: string;
}

class Edge {
    start: Node;
    end: Node;
    weight: number;
    constructor(start: Node, end: Node, weight: number) {
        this.start = start;
        this.end = end;
        this.weight = weight;
    }
}

enum Direction {
    Up,
    Down,
    Left,
    Right
}


// First parse input to a regular 2D grid
let grid : Coord[][] = [];
data.split('\n').forEach((row, rowIndex) => {
    let gridRow = [];
    row.replace(/\r/g, '').split('').forEach((col, colIndex) => {
        gridRow.push(new Coord(rowIndex, colIndex, col));
    });
    grid.push(gridRow);
});

printGrid();

// 


//#region Helpers

function printGrid(){
    grid.forEach(row => {
        let rowString = '';
        row.forEach(col => {
            rowString += col.value;
        });
        console.log(rowString);
    });
}


//#endregion