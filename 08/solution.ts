import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/08/input.txt', 'utf8');
const rows = data.replace(/\r/g, '').split('\n').map(row => row.split(''));

class Coord {
    row: number;
    col: number;
    value: string;
}

let antennas : Coord[] = [];
let antinodes : Coord[] = [];

// find antennas
rows.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
        if(col !== '.'){
            antennas.push({row: rowIndex, col: colIndex, value: col});
        }
    })
});


antennas.forEach(antenna => {
    console.log("--------------------")
    console.log("Antenna:", antenna);
    // get all antennas of the same type
    let otherAntennas = antennas.filter(ant => ant.value === antenna.value);
    console.log(otherAntennas);
    // find antennas in a straight line (x-distance = y-distance)
    let x = antenna.col;
    let y = antenna.row;
    otherAntennas.forEach(otherAntenna => {
        let xDistance = otherAntenna.col - x;
        let yDistance = otherAntenna.row - y;
        if(xDistance === 0 && yDistance === 0) return;
        // place antinode at the same distance on opposite sides of each antenna
        let newAntinodes : Coord[] = createAntinodes(antenna, otherAntenna, xDistance, yDistance);
        if(newAntinodes.length === 0) return;
        antinodes.push(...newAntinodes);
        

        
    });
});
function checkInBounds(row: number, col: number){
    return (0 <= row && row < rows.length) && (0 <= col && col < rows[0].length);
}

function createAntinodes(antenna1: Coord, antenna2: Coord, xDistance: number, yDistance: number) :Coord[]{
    let newAntinodes :Coord[] = [];
    let x = antenna1.col + xDistance;
    let y = antenna1.row + yDistance;
    // nieuwe antinodes voor eerste antenna

    while(checkInBounds(y, x)){
        newAntinodes.push({row: y, col: x, value: '#'});
        x += xDistance;
        y += yDistance;
    }
    // nieuwe antinodes voor tweede antenna
    x = antenna2.col - xDistance;
    y = antenna2.row - yDistance;
    while(checkInBounds(y, x)){
        newAntinodes.push({row: y, col: x, value: '#'});
        x += xDistance;
        y += yDistance;
    }
    return newAntinodes;
}

function findUniqueAntinodes(antinodes: Coord[]){
    let uniqueAntinodes: Coord[] = [];
    antinodes.forEach(antinode => {
        let exists = uniqueAntinodes.find(uniqueAntinode => uniqueAntinode.row === antinode.row && uniqueAntinode.col === antinode.col);
        if(exists === undefined){
            uniqueAntinodes.push(antinode);
        }
    });
    return uniqueAntinodes;
}
function printWithAntennasAndAntinodes(){
    let grid = rows.map(row => row.map(col => col));
    antennas.forEach(antenna => {
        grid[antenna.row][antenna.col] = antenna.value;
    });
    antinodes.forEach(antinode => {
        grid[antinode.row][antinode.col] = '#';
    });


    console.log(grid.map(row => row.join('')).join('\n'));
}
console.log("antennas",antennas);
console.log("antinodes", antinodes);

console.log("Unique antinodes", findUniqueAntinodes(antinodes).length);
printWithAntennasAndAntinodes();