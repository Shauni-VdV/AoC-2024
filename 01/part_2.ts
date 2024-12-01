import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/01/input.txt', 'utf8');

const lines = data.replace(/\r/g, '').split('\n'); // remove \r from strings

var list_A = [];
var list_B = [];
lines.forEach(l =>{
    list_A.push(l.trim().split(/\s+/).map(Number)[0]);
    list_B.push(l.trim().split(/\s+/).map(Number)[1]);
})


// Calculate how often a number from the left list appears in the right list
// Similarity score = sum(item in left list * count in right list)
getSimilarityScore(list_A, list_B);

function getSimilarityScore(a : number[], b: number[]){

    var newVals : number[] = a.map( val => {
        // Get count of val in right list
        var count_in_right_list = b.filter(right_val => right_val === val).length;
        // multiply val * count
        val = val * count_in_right_list;

        return val;
    })

    var score = newVals.reduce((x, y) => x + y)

    console.log('score', score)
}