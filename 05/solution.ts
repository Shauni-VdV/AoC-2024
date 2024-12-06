import { readFileSync } from 'fs';
const data = readFileSync('../AOC_2024/05/input.txt', 'utf8');


/**
 * --- HELPERS ---
 */
export class Rule {
    first: number;
    next: number;

    constructor(first: number, next: number) {
        this.first = first;
        this.next = next;
    }
}


/**
 * --- DATA INPUT MAPPING ---
*/

// Section 1 = page ordening rules ( array of strings, 'val|val')
const rulesInput = data.split('\n').filter(str => str.match(/\|/)).map(str => str.replace(/\r/g,''));
let rules = parseRules(rulesInput);

// Section 2 = list of updates (array of strings, 'val,val,val,val,...')
const updatesInput = data.split('\n').filter(str => str.match('\,')).map(str => str.replace(/\r/g,''));


function parseUpdate(update: string): number[] {
    return update.split(',').map(page => parseInt(page));
}

function parseRules(rules: string[]): Rule[] {
    //Cannot access 'Rule' before initialization
    return rules.map(rule => new Rule(parseInt(rule.split('|')[0]),parseInt(rule.split('|')[1])));
}

function findRules(page: number, rules: Rule[]): Rule[] {
    return rules.filter(rule => rule.first === page || rule.next === page);
}

function getMiddlePages(updates: string[]){
    let middles: number[] = [];
    console.log('getting middle pages for updates:', updates);
    updates.forEach(update => {
        let pages = parseUpdate(update);
        console.log('parsed update', pages, 'length: ', pages.length);
        let middle = pages[Math.floor(pages.length / 2)];
        middles.push(middle);
    });
    console.log('middles', middles)
    return middles;
}



/**
 * --- SOLUTION PT1 ---
*/
(function solutionPt1(){
    let correctUpdates = getCorrectUpdates(updatesInput);
    let middles = getMiddlePages(correctUpdates);
    let total = middles.reduce((acc, curr) => acc + curr, 0);
    console.log('total:', total);
})();

function getCorrectUpdates(updates: string[]): string[] {
    let correctUpdates: string[] = [];
    updates.forEach(update => {
        if(isCorrect(update)){
            correctUpdates.push(update);
        }
    });
    return correctUpdates
}

function isCorrect(update: string) : boolean {
    let pages = parseUpdate(update);
    let isCorrect = true;
    // console.log('-------------------------------------')
    // console.log('Verifying update', update)
    pages.forEach((page, index) => {
        // get rule for page
        let rulesForPage = findRules(page, rules);
        rulesForPage.forEach(rule => {
            if(rule && pages.indexOf(rule.next) != -1 && pages.indexOf(rule.first) != -1){
                // console.log('rule:', rule);
                // Get index of rule pages in update list
                // console.log('rule first index:', pages.indexOf(rule.first), 'rule next index:', pages.indexOf(rule.next));
                if(pages.indexOf(rule.next) < pages.indexOf(rule.first)){
                    // console.log('rule not followed (!)');
                    isCorrect = false;
                }
            }
        });
    });
    return isCorrect;
}

/**
 * --- SOLUTION PT2 ---
*/

(function solutionPt2(){
    let incorrectUpdates = getIncorrectUpdates();
    console.log("Incorrect updates", incorrectUpdates);

    let correctedUpdates = [];

    incorrectUpdates.forEach((update, index) => {
        console.log("Correcting update ", index, "of ", incorrectUpdates.length);
        let pages = parseUpdate(update);

        let temp = [...pages];
        temp = temp.sort((a,b) => {
            // find relevant rules
            let rulesForUpdate = rules.filter(rule => temp.indexOf(rule.first) != -1 || temp.indexOf(rule.next) != -1);
            // if a is before b in the rules, it needs to be sorted before b, so return -1
            // 
            return rulesForUpdate.find(rule => rule.first === a && rule.next === b) ? -1 : 1;
        })
                
        correctedUpdates.push(temp.join(','));

    });


    let middles = getMiddlePages(correctedUpdates);
    let total = middles.reduce((acc, curr) => acc + curr, 0);
    console.log('total:', total);


})();

function getIncorrectUpdates(){
    console.log('all updates:', updatesInput)
    let correctUpdates = getCorrectUpdates(updatesInput);
    console.log('correct updates', correctUpdates);
    return updatesInput.filter((u) => correctUpdates.indexOf(u) === -1)
}