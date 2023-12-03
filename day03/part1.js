const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function isSymbol(char) {
    const regEx = /\d|\./;
    return !regEx.test(char);
}

function isNumberAdjacentToSymbol(number, symbols) {
    for(let dx=-1; dx<number.length+1; dx++) {
        for(let dy=-1; dy<=1;dy++) {
            if(`[${number.firstDigit.x+dx},${number.firstDigit.y+dy}]` in symbols) return true;
        }
    }
    
    return false;
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');
    
        const symbols = {};
        for(let row = 0; row < data.length; row++) {
            for(let col = 0; col < data[row].length; col++) {
                if(isSymbol(data[row][col])) symbols[`[${col},${row}]`] = data[row][col];
            }
        }

        // Below code gets all numbers and stores them in array of objects of a form:
        // {
        //     firstDigit: {x: x coord of first digit, y: y coord of first digit},
        //     length: number of digits in a number,
        //     value: number
        // }
        const numbers = data.reduce((numbers,row,rowIdx)=>{
            for(let col = 0; col < row.length; col++) {
                if(row[col].match(/\d/)) {
                    let firstDigit= {x: col, y: rowIdx};
                    let length = 1;
                    let value = row[col];

                    col++;
                    while(col < row.length && row[col].match(/\d/)) {
                        length++;
                        value+=row[col];
                        col++;
                    }

                    numbers.push({
                        firstDigit,
                        length,
                        value: parseInt(value)
                    });
                }
            }
            return numbers;
        },[]);

        let sum = 0;
        numbers.forEach(num => {
            if(isNumberAdjacentToSymbol(num,symbols)) sum += num.value;
        });

        console.log(sum);
    }
});