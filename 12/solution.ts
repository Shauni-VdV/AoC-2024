import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/12/input.txt', 'utf8');
const rows = data.replace(/\r/g, '').split('\n').map(row => row.split(''));

class Coord {
    row: number;
    col: number;
    value: string;
    constructor(row: number, col: number, value: string
    ){
        this.row = row; 
        this.col = col; 
        this.value = value;
    }
}

class Plot {
     plantCoords : Coord[]; // lijst van alle coords waar deze plant op staat
     plantType: string;
     area: number;
     perimeter: number;
}

(function solvePt1(){
    let plots = rows.map((row, rowIndex) => row.map((col, colIndex) => new Coord(rowIndex, colIndex, col)));
    printPlots(plots);
    // Find area & perimeter of each area
    // = plants with adjoining coords in cardinal directions
    let plantsTraversed : Coord[] = [];
    plots.forEach((row, rowIndex) => {
        row.forEach((col,colIndex) => {
            if(!plantsTraversed.find(plant => plant.row === rowIndex && plant.col === colIndex)){
                let plantType = col.value;
                let foundPlants = findArea(plots, rowIndex, colIndex, plantType, [col]);
                console.log("Found plants", foundPlants);
                foundPlants.forEach(plant => plantsTraversed.push(plant));
            }
        });
    });
})();
// Calculate area and perimeter


// Helpers

function findArea(plots: Coord[][], row: number, col: number, plantType: string, foundPlants: Coord[]) : Coord[]{
    let adjoiningPlants : Coord[] = foundPlants || [];
    let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    directions.forEach(dir => {
        let newRow = row + dir[0];
        let newCol = col + dir[1];
        if(0 <= newRow && newRow < plots.length && 0 <= newCol && newCol < plots[0].length){
            let adjoiningPlant = plots[newRow][newCol];
            if(adjoiningPlant.value === plantType){
                adjoiningPlants.push(adjoiningPlant);
                findArea(plots, newRow, newCol, plantType, adjoiningPlants)
            }
        }
    });
    return adjoiningPlants;
}
function printPlots(plots: Coord[][]){
    plots.forEach(row => {
        console.log(row.map(col => col.value).join(''));
    });
}