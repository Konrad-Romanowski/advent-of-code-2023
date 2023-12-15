const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function hash(label) {
    let result = 0;
    for(let i = 0; i < label.length; i++) {
        result += label[i].charCodeAt();
        result *= 17;
        result %= 256;
    }
    return result;
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {

        const operations = inputFileData.split(',').map(str => {
            const label = str.match(/[a-z]+/)[0];
            const type = str.indexOf('=') > -1 ? '=' : '-';
            const box = hash(label);

            let focalLength = type === '=' ? parseInt(str.match(/\d+/)[0]) : null;

            return {label, box, type, focalLength}
        });

        const boxes = Array.from({length: 256},()=>[]);

        operations.forEach(operation => {
            if(operation.type === '-') {
                boxes[operation.box] = boxes[operation.box].filter(box => box.label !== operation.label);
            }
            if(operation.type === '=') {
                if(boxes[operation.box].some(box => box.label === operation.label)) {
                    boxes[operation.box] = boxes[operation.box].map(box => {
                        if(box.label === operation.label) {
                            return {...box, focalLength: operation.focalLength}
                        } else {
                            return box;
                        }
                    });
                } else {
                    boxes[operation.box].push(operation);
                }
            }
        });

        const focusingPower = boxes.reduce((sum,box,boxIdx) => {
            let partialSum = 0;
            if(box.length !== 0) {
                box.forEach((lense,slot) => {
                    partialSum+= (boxIdx+1)*(slot+1)*lense.focalLength;
                });
            }
            return sum+=partialSum;
        },0);

        console.log(focusingPower);
    }
});