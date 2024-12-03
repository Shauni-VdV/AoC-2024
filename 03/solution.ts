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