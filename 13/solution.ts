import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/13/input.txt', 'utf8');

class Coord {
    X: number;
    Y:number;
}
class Button {
    XIncrease: number;
    YIncrease:number;
}

class Machine {
    A: Button;
    B: Button;
    PrizeCoord: Coord;
}

let machines: Machine[] = [];
let machineLines = data.split('\r\n\r').map((machineLine) => machineLine.replace(/\r/g, '').split('\n').filter(line => line.length > 0));
machineLines.forEach((machineLine) => {
    let machine = new Machine();
    // Find A Button values
    let ABtn = new Button();
    ABtn.XIncrease = parseInt(machineLine[0].split(' ')[2].replace(/\D/g, ''));
    ABtn.YIncrease = parseInt(machineLine[0].split(' ')[3].replace(/\D/g, ''));

    // Find B Button values
    let BBtn = new Button();
    BBtn.XIncrease = parseInt(machineLine[1].split(' ')[2].replace(/\D/g, ''));
    BBtn.YIncrease = parseInt(machineLine[1].split(' ')[3].replace(/\D/g, ''));

    // Find Prize
    let prize = new Coord();
    prize.X = parseInt(machineLine[2].split(' ')[1].replace(/\D/g, ''));
    prize.Y = parseInt(machineLine[2].split(' ')[2].replace(/\D/g, ''));

    machine.A = ABtn;
    machine.B = BBtn;
    machine.PrizeCoord = prize;
    
    machines.push(machine);
    
});
console.log("Machine lines", machineLines);
console.log('Machines', machines);
