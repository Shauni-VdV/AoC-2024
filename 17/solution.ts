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
    device.regA = parseInt(lines[0].split(' ')[2]);
    device.regB = parseInt(lines[1].split(' ')[2]);
    device.regC = parseInt(lines[2].split(' ')[2]);

    device.operations = lines[4].split(' ')[1].split(',').map(x => parseInt(x));

    return device;
}

function part1(){
    let device = parseInput(data);
    let output = runOperations(device);
    console.log(output.join(','));
}


// loop through operands and execute their operations
function runOperations(device: Device) : number[]{
    let instruction_pointer = 0;

    let output = [];

    while(device.operations[instruction_pointer] !== undefined) {
        let opcode = device.operations[instruction_pointer];
        let operand = device.operations[instruction_pointer+1];
    
    
        switch(opcode) {
            case 0:
                device.regA = Math.floor(device.regA / Math.pow(2, getOperandValue(device, operand)));
                instruction_pointer += 2;
    
                break;
    
            case 1: 
                device.regB = (device.regB ^ operand) >>> 0;
                instruction_pointer += 2;
    
                break;
    
            case 2:
                device.regB = getOperandValue(device, operand) % 8;
                instruction_pointer += 2;
    
                break;
    
            case 3:
                if(device.regA !== 0) {
                    instruction_pointer = operand;
                } else {
                    instruction_pointer += 2;
                }
                break;
            
            case 4: 
                device.regB = (device.regB ^ device.regC) >>> 0;
                instruction_pointer += 2;
                break;
    
            case 5:
                let value = getOperandValue(device, operand) % 8;
                // map to string and remove any non-numbers
                output.push(value);
    
                instruction_pointer += 2;
                break;
    
            case 6:
                device.regB = Math.floor(device.regA / Math.pow(2, getOperandValue(device, operand)));
                instruction_pointer += 2;
                break;
    
            case 7:
                device.regC = Math.floor(device.regA / Math.pow(2, getOperandValue(device, operand)));
                instruction_pointer += 2;
                break;
        }
    }
    return output;

}


// Helpers
function getOperandValue(device : Device, operand: number): number{
    if(operand <= 3) return operand;
    if(operand === 4) return device.regA;
    if(operand === 5) return device.regB;
    if(operand === 6) return device.regC;
    if(operand === 7) console.error('Invalid operand 7');
    return -1;
}


// Part 2
function part2(){
    console.log('lookign for a register A value... ');
    let output = [];
    let regA = 450000;
    let operations = parseInput(data).operations;
    // check if arrays are equal
    console.log('operations: ', operations);
    console.log('output: ', output);

    while(operations.join(',') != output.join(',')) {
        console.log('trying A: ', regA);
        let device = parseInput(data);
        device.regA = regA;
        output = runOperations(device);
        regA += 1;

    }

    console.log('required A register: ', regA);
}


part1();
console.log('PT 2: -------')
part2();
