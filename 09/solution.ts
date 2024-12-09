import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/09/input.txt', 'utf8');

const numbers = data.split('').map(nr => parseInt(nr));
console.log(numbers);

class DiskSpace {
    index: number | null;
    value: number;
    isFile: boolean;
    fileId: number | null;

    constructor( index, value, isFile, fileId, ) {
        this.index = index; // index in string
        this.value = value; // value of block (= aantal blokken)
        this.isFile = isFile;
        this.fileId = fileId; // actual 'calculated' file id
    }
}

function solvePt1(){
    let fileId = 0;
    let disk: DiskSpace[] = [];

    numbers.forEach((number, index) => {
        if(index % 2 === 0){
            disk.push(new DiskSpace(index, number, true, fileId));
            fileId++;
        } else {
            // uneven blocks = free space
            disk.push(new DiskSpace(index, number, false, null));
        }
    });
    printBlocks(disk);
}

solvePt1();

function printBlocks(files: DiskSpace[]){
    let diskString = files.map(file => {
        if(file.isFile){
            return file.fileId.toString().repeat(file.value);
        } else {
            return '.'.repeat(file.value);
        }
    })

    console.log(diskString.join(''));
}