const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

const dictionary = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');
        const regEx = /\d|one|two|three|four|five|six|seven|eight|nine/g;
        let leftDigit;
        let rightDigit;
        let sum = 0;
        data.forEach(entry => {
            for(let i=0;i<entry.length+1;i++) {
                if(entry.slice(0,i).match(regEx)?.length) {
                    leftDigit = dictionary[entry.slice(0,i).match(regEx)[0]]
                    break;
                }
            }
            for(let i=1;i<entry.length+1;i++) {
                if(entry.slice(-i).match(regEx)?.length) {
                    rightDigit = dictionary[entry.slice(-i).match(regEx)[0]];
                    break;
                }
            }
            sum+=leftDigit*10+rightDigit;
        });
        
        console.log(sum);
    }
});