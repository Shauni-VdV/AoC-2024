// Input mapping

import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/14/input.txt', 'utf8');

// 234362625 = too high
// Change to  101 wide / 103 tall for real input
let maxCol = 101;
let maxRow = 103;

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


function solvePt1(){
    // Move robots 100 times
    for(let i = 0; i < 100; i++){
        robots.forEach((robot) => {
            robot.position.row = (robot.position.row + robot.velocityX + maxRow) % maxRow;
            robot.position.col = (robot.position.col + robot.velocityY + maxCol) % maxCol;
        });
    }

    // find quadrants
    let quadrants = []
    let q1 = [new Coord(0,0), new Coord((maxRow -1) /2 - 1, (maxCol - 1) / 2 - 1) ]; // top left 
    let q2 = [new Coord(0, (maxCol - 1) / 2 + 1), new Coord((maxRow - 1) / 2 - 1, maxCol - 1)]; // top right
    let q3 = [new Coord((maxRow - 1) / 2 + 1, 0), new Coord(maxRow - 1, (maxCol - 1) / 2 -1)]; // bottom left
    let q4 = [new Coord((maxRow - 1) / 2 + 1, (maxCol - 1) / 2 +1), new Coord(maxRow - 1, maxCol - 1)]; // bottom right
    quadrants.push(q1, q2, q3, q4);
    console.log('Q1:', q1);
    console.log('Q2:', q2);
    console.log('Q3:', q3);
    console.log('Q4:', q4);

    // Print the quadrants in a grid to see if they are correct
    // let grid = Array.from({length: maxRow}, () => Array.from({length: maxCol}, () => '.'));
    // quadrants.forEach((q) => {
    //     for(let i = q[0].row; i <= q[1].row; i++){
    //         for(let j = q[0].col; j <= q[1].col; j++){
    //             grid[i][j] = '#';
    //         }
    //     }
    // });
    // grid.forEach(row => console.log(row.join('')));

    let robotsInsideQuadrants = 0
    quadrants.forEach(q => {
        let robotsInQ = robots.filter((robot) => 
            robot.position.row >= q[0].row && robot.position.row <= q[1].row && 
            robot.position.col >= q[0].col && robot.position.col <= q[1].col);

            robotsInsideQuadrants === 0 ? robotsInsideQuadrants = robotsInQ.length : robotsInsideQuadrants *= robotsInQ.length;
            if(robotsInQ.length === 0){
                robotsInsideQuadrants += robotsInQ.length;
            } else {}
        console.log(q, 'Has:', robotsInQ.length);
    });
    console.log('Safety factor: ', robotsInsideQuadrants);
    printGrid();

}

function solvePt2(){
    // Move robots 100 times
    for(let i = 0; i < 9000; i++){

            robots.forEach((robot) => {
                robot.position.row = (robot.position.row + robot.velocityX + maxRow) % maxRow;
                robot.position.col = (robot.position.col + robot.velocityY + maxCol) % maxCol;
            });

            if(i > 7000){
                console.log("------------------------------------------------");
                console.log("after", i+1, "seconds");
                printGrid2();
            }

    }
    
    }


solvePt2();
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

function printGrid2() : string[][]{
    let grid = Array.from({length: maxRow}, () => Array.from({length: maxCol}, () => ' '));
    robots.forEach((robot) => {
        // Count nr of robots on this space
        let robotCount = robots.filter((otherRobot) => otherRobot.position.row === robot.position.row && otherRobot.position.col === robot.position.col).length;
        grid[robot.position.row][robot.position.col] = '#';
    });
    grid.forEach(row => console.log(row.join('')));
    return grid;
}