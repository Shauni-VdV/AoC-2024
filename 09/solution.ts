import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/09/input.txt', 'utf8');

const numbers = data.split('').map(nr => parseInt(nr));
console.log(numbers);

class DiskSpace {
    value: number;
    isFile: boolean;
    fileId: number | null;

    constructor( value, isFile, fileId, ) {
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
            // push number amount of DiskSpace items
            disk.push(new DiskSpace(number, true, fileId));
            fileId++;
        } else {
            // uneven blocks = free space
            disk.push(new DiskSpace(number, false, null));
        }
    });

    let formattedDisk = formatDisk(disk);
    //console.log('formatted disk', formattedDisk.map(block => block.fileId === null ? '.' : block.fileId).join(''));
    // reorganize: take last file and move it to the first free space until there are no gaps remaining
    let organizedDisk = reorganize(formattedDisk);

   // console.log('organized disk', organizedDisk.map(block => block.fileId === null ? '.' : block.fileId).join(''));

    console.log("Checksum: ", getChecksum(organizedDisk));
}

solvePt1();

function reorganize(diskInput: DiskSpace[]){
    // alles na de index bepaald door aantal file blocks moet free space zijn
    let disk = JSON.parse(JSON.stringify(diskInput)); // deepcopy want referenties zijn kaka

    let amountOfFileBlocks = disk.filter(block => block.isFile).length;
    while(disk.indexOf(disk.findLast(block => block.isFile))> amountOfFileBlocks -1){

        let lastFile = disk.findLast(block => block.isFile);
        let lastFileIndex = disk.indexOf(lastFile);
        
        let firstFreeSpace = disk.find(block => !block.isFile);
        let firstFreeSpaceIndex = disk.indexOf(firstFreeSpace);
        
        // swap blocks at indexes
        let temp = disk[lastFileIndex];
        disk[lastFileIndex] = disk[firstFreeSpaceIndex];
        disk[firstFreeSpaceIndex] = temp;
       // console.log(disk.map(block => block.fileId === null ? '.' : block.fileId).join(''));

    }
    return disk;
}

function formatDisk(disk: DiskSpace[]){
    let formattedDisk : DiskSpace[] = [];

    disk.forEach(block => {
        let blocks = [...Array(block.value)].map(() => block);
        formattedDisk.push(...blocks)
    })
    return formattedDisk;

}

function getChecksum(disk: DiskSpace[]){
    let checksum = 0;
    let fileBlocks = disk.filter(block => block.isFile);
    fileBlocks.forEach((block, index) => {
        checksum += block.fileId * index;
    });
    return checksum;
}
