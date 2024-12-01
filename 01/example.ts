import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/01/input.txt', 'utf8');


console.log('input data: \n', data)
// Pair the smallest number in the left list with the smallest number in the right list.
// then the second smallest on both sides, and so on

// Within each pair, get the difference between left and right (no negatives)
var list_A = [3, 4, 2, 1, 3, 3]
var list_B = [4, 3, 5, 3, 9, 3]


GetDifference(list_A, list_B);

function GetDifference(a : number[], b: number[]){
    //find lowest number of each list
    a.sort();
    b.sort();

    var differences = a.map((a, index) => Math.abs(a - b[index]));
    var total = differences.reduce((x, y) => x + y )

    console.log("Total:" + total);
}

