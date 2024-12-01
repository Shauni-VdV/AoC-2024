import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/01/input.txt', 'utf8');

const lines = data.replace(/\r/g, '').split('\n'); // remove \r from strings

var list_A = [];
var list_B = [];
lines.forEach(l =>{
    list_A.push(l.trim().split(/\s+/).map(Number)[0]);
    list_B.push(l.trim().split(/\s+/).map(Number)[1]);
})


GetDifference(list_A, list_B);



function GetDifference(a : number[], b: number[]){
    // sort
    a.sort();
    b.sort();

    // find the difference between the items at the same index
    var differences = a.map((a, index) => Math.abs(a - b[index]));
    // get total
    var total = differences.reduce((x, y) => x + y )

    console.log("Total:" + total);
}

