import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/03/input.txt', 'utf8');

console.log(data);

let filteredData = [...data.matchAll(/mul\(\d+,\d+\)/g)]

let total = 0;

filteredData.forEach((multiplication) => {
    // split string & get numbers
    var parts = multiplication[0].split(',');
    // replace non-numbers
    parts = parts.map(part => part.replace(/\D/g, ''));
    // multiply & add to total
    total += parseInt(parts[0]) * parseInt(parts[1]);
})

console.log(total);

// Part 2

let filteredData2 = [...data.matchAll(/(mul\(\d+,\d+\)|(do\(\))|don\'t\(\))/g)]

console.log(filteredData2.map((x) => x[0]));

let totalPt2 = 0;
var add = true;
filteredData2.map((match) => match[0]).forEach((command) => {
    if(command == "do()") {
        add = true;
    } else if(command == "don't()") {
        add = false;
    } else {
        if(add) {
            var parts = command.split(',');
            parts = parts.map(part => part.replace(/\D/g, ''));
            totalPt2 += parseInt(parts[0]) * parseInt(parts[1]);
        }
    }

});

console.log(totalPt2);