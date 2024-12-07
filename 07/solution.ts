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

function checkEquation(equationResult, equation) : boolean{
    // + or *
    let actualResult =0;
    let operators = '+*';
    for(let i = 1; i < equation.length; i++){
        for(let j = 0; j < operators.length; j++){
            switch(operators[j]){
                case '+':
                    actualResult+= equation[i];
                    break;
                case '*':
                    if(actualResult === 0){
                        actualResult ++;
                    }
                    actualResult*= equation[i];
                    break;
            }
        }   
    }
    return actualResult === equationResult;
}

console.log(correctEquations.reduce((a,b) => a + b));