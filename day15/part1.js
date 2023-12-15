const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split(',');

        const values = data.map(str => {
            let currentValue = 0;
            for(let i = 0; i < str.length; i++) {
                currentValue += str.charCodeAt(i);
                currentValue *= 17;
                currentValue %= 256;
            }
            return currentValue;
        });

        const result = values.reduce((sum,num)=>{
            return sum+=num;
        },0);

        console.log(result);
    }
});