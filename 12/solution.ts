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
    let grid = rows.map((row, rowIndex) => row.map((col, colIndex) => new Coord(rowIndex, colIndex, col)));
    let plots: Plot[] = [];
    // Find area & perimeter of each area
    // = plants with adjoining coords in cardinal directions
    let plantsTraversed : Coord[] = [];
    grid.forEach((row, rowIndex) => {
        row.forEach((col,colIndex) => {
            if(!plantsTraversed.find(plant => plant.row === rowIndex && plant.col === colIndex)){
                let plantType = col.value;
                let foundPlants = findArea(grid, rowIndex, colIndex, plantType, [new Coord(rowIndex, colIndex, plantType)]);
                console.log("Found plants", foundPlants);
                foundPlants.forEach(plant => plantsTraversed.push(plant));
                plots.push(Object.assign(new Plot(), {
                    plantCoords: foundPlants,
                    plantType: plantType,
                    area: foundPlants.length,
                    perimeter: calculatePerimeter(foundPlants)
                }));
            }
        });
    });
    printPlots(plots);

})();
// Calculate  perimeter
function calculatePerimeter(plantCoords: Coord[]) : number{
    
    return 0;
}

// Helpers

function findArea(grid: Coord[][], row: number, col: number, plantType: string, foundPlants: Coord[]) : Coord[]{
    let adjoiningPlants : Coord[] = foundPlants || [];
    let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    directions.forEach(dir => {
        let newRow = row + dir[0];
        let newCol = col + dir[1];
        if(0 <= newRow && newRow < grid.length && 0 <= newCol && newCol < grid[0].length && !adjoiningPlants.find(plant => plant.row === newRow && plant.col === newCol)){
            let adjoiningPlant = grid[newRow][newCol];
            if(adjoiningPlant.value === plantType){
                adjoiningPlants.push(adjoiningPlant);
                findArea(grid, newRow, newCol, plantType, adjoiningPlants)
            }
        }
    });
    return adjoiningPlants;
}
function printPlots(plots: Plot[]){
    plots.forEach(plot => {
        console.log("Plot of type", plot.plantType, "has area", plot.area, "and perimeter", plot.perimeter);
    });
}