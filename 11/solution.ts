import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/11/input.txt', 'utf8');

const stonesInput = data.split(' ').map(stone => parseInt(stone));

class Stone {
    count: number;
    value: number;
}

// console.log(stones);
(function solvePt1(){
    let stonesCopy = JSON.parse(JSON.stringify(stonesInput)).map(stone => parseInt(stone));
    for(let i = 0; i < 25; i++){
        stonesCopy = blink(stonesCopy);
    }
    console.log("stone count after 25 blinks", stonesCopy.length);
})();



function blink(stones: number[]) : number[]{
    let newStones = [];
    stones.forEach((stone, index) => {
        // stone value 0 : become 1

        if(stone === 0){
            newStones.push(1)
        } else if(stone.toString().length % 2 === 0){
               // stone with even number of DIGITS: split in 2 half stones (eg. '24' becomes '2' and '4') 
                // The new stones don't keep extra 0's, 1000 becomes 1 and 0
            let stoneString = stone.toString();
            let splittedStones = [parseInt(stoneString.slice(0, stoneString.length/2)), parseInt(stoneString.slice(stoneString.length/2))];
            newStones.push(...splittedStones);
        } else {
            // if none of above rules apply; the stone is multiplied by '2024'
            newStones.push(stone * 2024);
        }
    });

    //console.log("Stones (length) after blink", newStones.length);
    return newStones;
}



(function solvePt2(){
    let stonesCopy = JSON.parse(JSON.stringify(stonesInput)).map(stone => parseInt(stone));
    let stonesObjs : Stone[] = stonesCopy.map(stone => ({count: 1, value: stone}));
    for(let i = 1; i <= 75; i++){
        stonesObjs = blink2(stonesObjs);
        // console.log("stones after blink", i + 1, stonesObjs.filter(stone => stone.count > 0));
    }

    let totalValue = 0;
    // console.log("stoneObjs after loops", stonesObjs.filter(stone => stone.count > 0));
    stonesObjs.forEach(stone => {
        totalValue += stone.count;
    });
    console.log("stone count after 75 blinks", totalValue);
    
})();

function blink2(stones: Stone[]){
    let newStones : Stone[] = [];

    let zeroStones : Stone = stones.find(stone => stone.value === 0 && stone.count > 0);
    let evenStones : Stone[] = stones.filter(stone => stone.value.toString().length % 2 === 0 && stone.count > 0);
    let otherStones : Stone[] = stones.filter(stone => stone.value !== 0 && stone.value.toString().length % 2 !== 0 && stone.count > 0 && !evenStones.includes(stone));


    // count of stone with value 0 is added to stone with value 1, count of stone with value 0 is set to 0
    // console.log("zero stones", zeroStones);
    if(zeroStones){
        newStones.push({count: zeroStones.count , value: 1});
    } 

    // console.log("even stones", evenStones);
    if(evenStones.length > 0){
        // stones with even number of digits are split in 2: 24 becomes 2 and 4
        evenStones.forEach(stone => {
            let stoneString = stone.value.toString();
            let splittedStones = [parseFloat(stoneString.slice(0, stoneString.length/2)), parseFloat(stoneString.slice(stoneString.length/2))];
            
            // find stone 1 and add count to it
            let firstStone = newStones.find(s => s.value === splittedStones[0]);
            // console.log("first stone", firstStone);
            if(firstStone){
                newStones[newStones.indexOf(firstStone)].count += stone.count;
            } else {
                newStones.push({ count: stone.count, value: splittedStones[0]});
            }

            let secondStone = newStones.find(s => s.value === splittedStones[1]);
            // console.log("second stone", secondStone);

            if(secondStone){
                newStones[newStones.indexOf(secondStone)].count += stone.count;
            } else {
                newStones.push({count: stone.count, value: splittedStones[1]});
            }
            // 
        });
    }

    // console.log("other stones", otherStones);
    if(otherStones.length > 0){
        otherStones.forEach(stone => {
            let val = stone.value * 2024;
            let findStone = newStones.find(s => s.value === val);
            if(findStone){
                newStones[newStones.indexOf(findStone)].count += stone.count;
            } else {
                newStones.push({count: stone.count, value: val});
            }
        });
    }
   
    return newStones;
}