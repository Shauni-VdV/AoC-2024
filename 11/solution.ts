import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/11/input.txt', 'utf8');

const stones = data.split(' ').map(stone => parseInt(stone));

// console.log(stones);

blink();
function blink(){
    let newStones = [];
    stones.forEach((stone, index) => {
        console.log('evaluating stone', stone)
        // stone value 0 : become 1

        if(stone === 0){
            console.log('stone is 0')
            newStones.push(1)
        } else if(stone.toString().length % 2 === 0){
            console.log('stone has even number of digits')
               // stone with even number of DIGITS: split in 2 half stones (eg. '24' becomes '2' and '4') 
                // The new stones don't keep extra 0's, 1000 becomes 1 and 0
            let stoneString = stone.toString();
            let splittedStones = [parseInt(stoneString.slice(0, stoneString.length/2)), parseInt(stoneString.slice(stoneString.length/2))];
            console.log('splitted stones', splittedStones);
            newStones.push(...splittedStones);
        } else {
            console.log('no other rules apply')
            // if none of above rules apply; the stone is multiplied by '2024'
            newStones.push(stone * 2024);
        }
    });

    console.log("Stones after blink", newStones);

 

}