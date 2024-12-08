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
        // if(xDistance === 0 && yDistance === 0) return;
        // place antinode at the same distance on opposite sides of each antenna
        let antinode1 = {row: otherAntenna.row + yDistance, col: otherAntenna.col + xDistance, value: '#'};
        checkInBounds(antinode1.row, antinode1.col) ? antinodes.push(antinode1) : null;
        let antinode2 = {row: antenna.row - yDistance, col: antenna.col - xDistance, value: '#'};
        checkInBounds(antinode2.row, antinode2.col) ? antinodes.push(antinode2) : null;

        
    });
});
function checkInBounds(row: number, col: number){
    return (0 <= row && row < rows.length) && (0 <= col && col < rows[0].length);
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