// Input read
import { dir } from 'console';
import { readFileSync } from 'fs';
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
const edges = mapToEdges();
console.log(edges)







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

function findNeighborsInGrid(start: Coord) : Coord[] {
    // Find all neighbors in cardinal directions
    // How to figure out if neighbor is a turn? keep value of lastDirection in Coord?
    // Maybe a recursive function that tries to 'map' every direction from a given point

    let neighbors: Coord[] = [];
    let row = start.row;
    let col = start.col;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    directions.forEach(dir => {
        let newRow = row + dir[0];
        let newCol = col + dir[1];
        if(newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length){
            neighbors.push(grid[newRow][newCol]);
        }
    });
    return neighbors;
}

// Create nodes and edges from the grid
function mapToEdges(){
    let mappedNodes: Set<Node> = new Set();
    let edges: Edge[] = [];
    grid.forEach(row => {
        row.forEach(col => {
            if(col.value !== '#'){
                let node = new Node();
                node.value = col.value;
                mappedNodes.add(node);
                let neighbors = findNeighborsInGrid(col);
                neighbors.forEach(neighbor => {
                    if(neighbor.value !== '#'){
                        let neighborNode = new Node();
                        neighborNode.value = col.value;
                        
                        mappedNodes.add(neighborNode);
                        if(neighbor.isTurn){
                            let edge = new Edge(node, neighborNode, 1001);
                            edges.push(edge);
                        } else {
                            let edge = new Edge(node, neighborNode, 1);
-                           edges.push(edge);
                        }
                    }
                });
            }
        });
    });
    return edges;
    
}
//#endregion