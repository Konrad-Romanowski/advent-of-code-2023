const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');
        const regEx = /\d/g;
        let sum = 0;
        data.forEach(entry => {
            const digits = entry.match(regEx);
            sum+=parseInt(`${digits[0]}${digits.at(-1)}`);
        });
             
        console.log(sum);
    }
});