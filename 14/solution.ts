// Input mapping
import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/14/input.txt', 'utf8');

// Change to  101 wide / 103 tall for real input
let maxCol =11;
let maxRow = 7;

// Classes

class Coord {
    row: number;
    col:number;

    constructor(x: number, y: number){
        this.row = x;
        this.col = y;
    }
}
class Robot {
    position: Coord;
    velocityX: number;
    velocityY: number;
    constructor(position: Coord, velocityX: number, velocityY: number){
        this.position = position;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }
}
let robotLines = data.split('\n').map((robotLine) => {
    console.log(robotLine);
    let position = robotLine.split(' ')[0].split('=')[1];
    let velocity = robotLine.split(' ')[1].split('=')[1];

    let positionX = parseInt(position.split(',')[0]);
    let positionY = parseInt(position.split(',')[1]);

    let velocityX = parseInt(velocity.split(',')[0]);
    let velocityY = parseInt(velocity.split(',')[1]);

    return {positionX, positionY, velocityX, velocityY};
});

let robots : Robot[] = [];

robotLines.forEach((robotLine) => {
    robots.push(new Robot(new Coord(robotLine.positionY, robotLine.positionX), robotLine.velocityY, robotLine.velocityX));
});


(function solvePt1(){
    // Move robots 100 times
    for(let i = 0; i < 100; i++){
        robots.forEach((robot) => {
            robot.position.row = (robot.position.row + robot.velocityX + maxRow) % maxRow;
            robot.position.col = (robot.position.col + robot.velocityY + maxCol) % maxCol;
        });
    }
    // find quadrants
    let q1 = [new Coord(0,0), new Coord(maxRow / 2 - 1, maxCol / 2 - 1)];
    console.log(q1);
    printGrid();

})();

//printGrid();

// Helpers
function printGrid(){
    let grid = Array.from({length: maxRow}, () => Array.from({length: maxCol}, () => '.'));
    robots.forEach((robot) => {
        // Count nr of robots on this space
        let robotCount = robots.filter((otherRobot) => otherRobot.position.row === robot.position.row && otherRobot.position.col === robot.position.col).length;
        grid[robot.position.row][robot.position.col] = robotCount.toString();
    });
    grid.forEach(row => console.log(row.join('')));
}