import { read, readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/07/input.txt', 'utf8');
const rows = data.replace(/\r/g, '').split('\n');


let correctEquations : number[] = [];
rows.forEach(row => {
    let equationResult = parseInt(row.split(':')[0]);
    let equation = row.split(':')[1].trim().split(' ').map(Number);
    checkEquation(equationResult, equation) ? correctEquations.push(equationResult) : null;

    console.log("Equation result: ", equationResult);
    console.log("Equation: ", equation);
});

function checkEquation(equationResult, equation : number[]) : boolean{
    // altijd * of + doen van de eerste 2 getallen, en de rest er achter hangen
    // de lijst wordt zo altijd korter, tot het 1 getal is
    // door recursie gaat elke mogelijke combinatie overlopen worden
    if(equation.length == 1) return equation[0] == equationResult;

    if(checkEquation(equationResult, [equation[0] + equation[1], ...equation.slice(2)])) return true;
    if(checkEquation(equationResult, [equation[0] * equation[1], ...equation.slice(2)])) return true;

}

console.log(correctEquations.reduce((a,b) => a + b));