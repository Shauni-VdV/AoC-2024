import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/12/input.txt', 'utf8');
const rows = data.replace(/\r/g, '').split('\n').map(row => row.split(''));

class Coord {
    row: number;
    col: number;
    value: string;
    constructor(row: number, col: number, value?: string
    ){
        this.row = row; 
        this.col = col; 
        this.value = value;
    }
}

class Fence { // = line between 2 coords
    firstCoord: Coord;
    secondCoord: Coord;

    constructor(firstCoord: Coord, secondCoord: Coord){
        this.firstCoord = firstCoord;
        this.secondCoord = secondCoord;
    }
}

class Plot {
     plantCoords : Coord[]; // lijst van alle coords waar deze plant op staat
     plantType: string;
     area: number;
     perimeter: number;
     fences: Fence[];
     sides: number;
}

let grid = rows.map((row, rowIndex) => row.map((col, colIndex) => new Coord(rowIndex, colIndex, col)));

(function solvePt1And2(){
    let plots: Plot[] = [];
    // Find area & perimeter of each area
    // = plants with adjoining coords in cardinal directions
    let plantsTraversed : Coord[] = [];
    grid.forEach((row, rowIndex) => {
        row.forEach((col,colIndex) => {
            if(!plantsTraversed.find(plant => plant.row === rowIndex && plant.col === colIndex)){
                let plantType = col.value;
                let foundPlants = findArea(grid, rowIndex, colIndex, plantType, [new Coord(rowIndex, colIndex, plantType)]);
                //console.log("Found plants", foundPlants);
                foundPlants.forEach(plant => plantsTraversed.push(plant));
                plots.push(Object.assign(new Plot(), {
                    plantCoords: foundPlants,
                    plantType: plantType,
                    area: foundPlants.length,
                    perimeter: 0
                }));
            }
        });
    });
    console.log(plots.length)

    calculatePerimeter(plots);
    calculateSides(plots);
    printPlots(plots);

})();
// Calculate  perimeter
function calculatePerimeter(plots: Plot[]) {
    plots.forEach(plot => {
        let builtFences : Fence[] = [];

        let fences = 0;
        let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        plot.plantCoords.forEach(plant => {
            // Check if there is a plant in any direction, if so, remove the fence
            directions.forEach(dir => {
                let newCoord : Coord = new Coord(plant.row + dir[0], plant.col + dir[1]);
    
                // check bounds
                if(isInBounds(newCoord)){
                    if(!plot.plantCoords.find(plant => plant.row === newCoord.row && plant.col === newCoord.col)){
                        // it's not a plant of the same type, check if there is already a fence there
                        //console.log('not a plant of the same type')
                        let firstCoord = new Coord(plant.row, plant.col, plot.plantType);
                        let secondCoord = new Coord(newCoord.row, newCoord.col, grid[newCoord.row][newCoord.col].value);
                        let fence : Fence = new Fence(firstCoord, secondCoord);
                            builtFences.push(fence);
                            fences++;
                        //}
                    }
                } else {
                    // edge of grid, add fence
                    let firstCoord = new Coord(plant.row, plant.col, plot.plantType);
                    let secondCoord = new Coord(plant.row + dir[0], plant.col + dir[1], 'NONE');
                    let fence : Fence = new Fence(firstCoord, secondCoord);
                    builtFences.push(fence);
                    fences++;
                }
                
            });
        });
       // console.log(builtFences);
        plot.perimeter = fences;
        plot.fences = builtFences;
    });
    
    //return builtFences.length;
}

function calculateSides(plots: Plot[]){
    plots.forEach(plot => {
        let sides = 0;
        // do magic please
       
    })
    
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
       // console.log("Plot of type", plot.plantType, "has area", plot.area, "and perimeter", plot.perimeter);
        console.log("Plot of type", plot.plantType, "has area", plot.area, "and nr of sides", plot.sides);

    });
    console.log("total price" , plots.reduce((acc, plot) => acc + plot.area * plot.perimeter, 0));
    console.log("Total price with discount", plots.reduce((acc, plot) => acc + plot.area * plot.sides, 0));
}

function isInBounds(coord: Coord){
    //console.log("checking bounds of coord: ", coord);
    return (0 <= coord.row && coord.row < rows.length) && (0 <= coord.col && coord.col < rows[0].length);
}
