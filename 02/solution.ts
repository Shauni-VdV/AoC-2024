import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/02/input.txt', 'utf8');

const lines = data.split('\n'); // remove \r from strings

//1 report per line
// number = level
const reports = lines.map(l => l.split(' ').map(Number));

console.log(reports);

// safe = gradually increasing or decreasing
// safe = any 2 numbers differ by max 3 (value)

let safeCount = 0;
reports.forEach(report => {
    if(isSafe2(report)){
        console.log('Safe:', report);
        safeCount++;
    } else {
        console.log('Unsafe:', report);
    }
});

console.log('Safe reports:', safeCount);

function isSafe(report: number[]): boolean {
    let safe : boolean = true;
    let isIncreasing : boolean = false;
    if(report[0] < report[1]){
        isIncreasing = true;
    }
    
    report.forEach((level, index) => {
        let previousLevel = report[index - 1];
        if(isIncreasing){
            // If level is not higher than previous level
            // OR: If previous level is more than 3 levels lower: not safe
            if(level <= previousLevel || level > previousLevel + 3){
                safe = false;
            }
        } else {
            // If level is not lower than previous level
            // OR If previous level is more than 3 levels higher: not safe
            if(level >= previousLevel || level < previousLevel - 3){
                safe = false;
            }
        }
    });
    return safe;
}
// PT2

function isSafe2(report: number[]): boolean {
    if(isSafe(report)){
        return true;
    } else {
        return isSafeWithDampener(report);
    }
}

function isSafeWithDampener(report: number[]) : boolean {
    let safeCount = 0;

    // remove every level at a time, check if the report is safe
    report.forEach((level, index) => {
        let reportCopy = [...report];
        reportCopy.splice(index, 1);

        if(isSafe(reportCopy)){
            console.log('safe by removing ', report[index], reportCopy);
            safeCount++;
        }
    });
    
    console.log('Safe count with dampener:', safeCount);
    return safeCount > 0;
}
