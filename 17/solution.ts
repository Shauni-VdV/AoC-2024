import { readFileSync } from "fs";
import { get } from "http";
const data = readFileSync('../AOC_2024/17/input.txt', 'utf8');

class Device {
    regA: number;
    regB: number;
    regC: number;

    operations: number[]; // 0-7
}

function parseInput(data: string) {
    let device = new Device();
    let lines = data.replace(/\r/g,'').split('\n');
    console.log('lines', lines);
    device.regA = parseInt(lines[0].split(' ')[2]);
    device.regB = parseInt(lines[1].split(' ')[2]);
    device.regC = parseInt(lines[2].split(' ')[2]);

    console.log('lines[4]', lines[4]);
    device.operations = lines[4].split(' ')[1].split(',').map(x => parseInt(x));

    return device;
}


// loop through operands and execute their operations
let device = parseInput(data);
let instruction_pointer = 0;
let output = [];
while(device.operations[instruction_pointer] !== undefined) {
    console.log('instruction_pointer', instruction_pointer);
    let opcode = device.operations[instruction_pointer];
    let operand = device.operations[instruction_pointer+1];


    switch(opcode) {
        case 0:
            console.log('adv');
            device.regA = Math.floor(device.regA / Math.pow(2, getOperandValue(device, operand)));
            instruction_pointer += 2;

            break;

        case 1: 
            console.log('bxl');
            device.regB = (device.regB ^ operand) >>> 0;
            instruction_pointer += 2;

            break;

        case 2:
            console.log('bst');
            device.regB = getOperandValue(device, operand) % 8;
            instruction_pointer += 2;

            break;

        case 3:
            console.log('jnz');
            if(device.regA !== 0) {
                instruction_pointer = operand;
            } else {
                instruction_pointer += 2;
            }
            break;
        
        case 4: 
            console.log('bxc');
            device.regB = (device.regB ^ device.regC) >>> 0;
            instruction_pointer += 2;
            break;

        case 5:
            console.log('out');
            let value = getOperandValue(device, operand) % 8;
            // map to string and remove any non-numbers
            output.push(value);

            instruction_pointer += 2;
            break;

        case 6:
            console.log('bdv');
            device.regB = Math.floor(device.regA / Math.pow(2, getOperandValue(device, operand)));
            instruction_pointer += 2;
            break;

        case 7:
            console.log('cdv');
            device.regC = Math.floor(device.regA / Math.pow(2, getOperandValue(device, operand)));
            instruction_pointer += 2;
            break;
    }

    console.log('device', device);
}

console.log(output.join(','));

// Helpers
function getOperandValue(device : Device, operand: number): number{
    if(operand <= 3) return operand;
    if(operand === 4) return device.regA;
    if(operand === 5) return device.regB;
    if(operand === 6) return device.regC;
    if(operand === 7) console.error('Invalid operand 7');
    return -1;
}
