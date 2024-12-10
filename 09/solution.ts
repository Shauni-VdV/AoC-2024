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
    disk.forEach((block, index) => {
        if(block.isFile){
            checksum += block.fileId * index;

        }
    });
    return checksum;
}

// solvePt1();
solvePt2();

function solvePt2(){
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


    let organizedDisk = reorganize2(disk);
   // console.log('organized disk', organizedDisk.map(block => block.fileId === null ? '.' : block.fileId).join(''));
    
    let formattedDisk = formatDisk(organizedDisk);

    console.log("Checksum: ", getChecksum(formattedDisk));
}

function reorganize2(diskInput: DiskSpace[]){
    let disk : DiskSpace[] = JSON.parse(JSON.stringify(diskInput)); // deepcopy want referenties zijn (misschien; i didn't bother checking it without) kaka

    // van achter naar voor door diskspace items loopen
    for(let i = disk.length -1 ; i >= 0; i--){
        
        if(disk[i].isFile){
            // van voor naar achter, op zoek naar een 'free space' block dat groot genoeg iss
            for(let j= 0; j <= disk.length - 1 ; j++){
                if(!disk[j].isFile && disk[j].fileId !== 0 && j < i){
                    if(disk[i].value <= disk[j].value){ // file past in free space
                        //swap swap file blocks with free space blocks
                        let remainingFileBlockSpace = disk[j].value - disk[i].value; // Remaining space in the original free space block

                        let fileBlock = disk[i];
                        let freeSpaceBlock = disk[j];
                        freeSpaceBlock.value = disk[i].value; 


                        // splice freespaceblock with deleteNr of 1, insert fileblock + a new free space block with the remaining value
                        disk.splice(i, 1, freeSpaceBlock);

                        let newFreeSpaceBlock = [fileBlock, new DiskSpace(remainingFileBlockSpace, false, null)];
                        disk.splice(j, 1, ...newFreeSpaceBlock);
                       
                        break;
                    }
                }
                
            }
            //console.log(formatDisk(disk).map(block => block.fileId === null ? '.' : block.fileId).join(''));

        }

    }
    return disk;
}

function reorganize2Old(diskInput: DiskSpace[]){
    let reorganizedDisk : DiskSpace[] = [];
    let disk : DiskSpace[] = JSON.parse(JSON.stringify(diskInput)); // deepcopy want referenties zijn (misschien; i didn't bother checking it without) kaka
    // enkel als de volledige file 'block' erin past, mag het verplaatst worden
    // dus van achter naar voor door de lijst gaan, kijken naar hoeveel items van die value er zijn (in totaal in dit geval)
    // dan kijken naar de eerste groep van free spaces, daar de lengte van nemen
    // als freespaces groter is dan de file, dan mag het verplaatst worden
    console.log(disk.map(block => block.fileId === null ? '.' : block.fileId).join(''));
    for(let i = disk.length -1 ; i >= 0; i = i - disk[i].value){
        console.log('i', i);
        let fileSize = disk[i].value;
        console.log('file size', fileSize);
        console.log('file id', disk[i].fileId);
        let fileStartIndex = disk.indexOf(disk.findLast(block => block.fileId === disk[i].fileId)) - fileSize + 1;

        let firstFreeSpaceSize = 0;
        let firstFreeSpaceIndex = disk.indexOf(disk.find(block => !block.isFile));
        // find the size of the first free space
        for(let j = firstFreeSpaceIndex; j < disk.length; j++){
            if(disk[j].isFile){
                break;
            }
            firstFreeSpaceSize++;
        }
        console.log('first free space size', firstFreeSpaceSize);
        console.log('first free space index', firstFreeSpaceIndex);

        if(fileSize <= firstFreeSpaceSize){
            console.log("REPLACING FILE ----------------------------------------------")
            // move file to free space, 
            let fileBlocks = disk.splice(fileStartIndex, fileSize);
            let freeSpaceBlocks = disk.splice(firstFreeSpaceIndex, fileSize);
            console.log('file blocks', fileBlocks);
            console.log('free space blocks', freeSpaceBlocks);

            disk.splice(fileStartIndex, 0, ...freeSpaceBlocks);
            disk.splice(firstFreeSpaceIndex, 0 , ...fileBlocks);

            //disk.splice(fileStartIndex, fileSize, ...disk.splice(firstFreeSpaceIndex, fileSize))
            //disk.fill(new DiskSpace(null, false, null), fileStartIndex, disk.length);
        }

        console.log(disk.map(block => block.fileId === null ? '.' : block.fileId).join(''));


    }
    return reorganizedDisk;
}