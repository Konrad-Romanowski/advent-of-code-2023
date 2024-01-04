const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

// digging in 'U' direction = going y++
function dig(startingPoint,operation,trench) {
    let currentPoint = startingPoint;
    
    if(operation.direction === 'R') {
        for(let x = 1; x <= operation.numOfSteps; x++) {
            currentPoint[1]+=1;
            trench[`[${currentPoint}]`] = operation.direction;
        }
    }
    
    if(operation.direction === 'D') {
        for(let y = 1; y <= operation.numOfSteps; y++) {
            currentPoint[0]-=1;
            trench[`[${currentPoint}]`] = operation.direction;
        }
    }
    
    if(operation.direction === 'L') {
        for(let x = 1; x <= operation.numOfSteps; x++) {
            currentPoint[1]-=1;
            trench[`[${currentPoint}]`] = operation.direction;
        }
    }

    if(operation.direction === 'U') {
        for(let y = 1; y <= operation.numOfSteps; y++) {
            currentPoint[0]+=1;
            trench[`[${currentPoint}]`] = operation.direction;
        }
    }

    return currentPoint;
}

function floodFill(point, trench, interrior) {
    const stack = [];
    stack.push(point);

    while(stack.length > 0) {
        const [y,x] = stack.pop();
        if(!trench.hasOwnProperty(`[${y},${x}]`) && !interrior.hasOwnProperty(`[${y},${x}]`)) {
            interrior[`[${y},${x}]`] = 1;
            
            // GO UP
            if(!trench.hasOwnProperty(`[${y+1},${x}]`) && !interrior.hasOwnProperty(`[${y+1},${x}]`)) {
                stack.push([y+1,x]);
            }
            // GO RIGHT
            if(!trench.hasOwnProperty(`[${y},${x+1}]`) && !interrior.hasOwnProperty(`[${y},${x+1}]`)) {
                stack.push([y,x+1]);
            }
            // GO DOWN
            if(!trench.hasOwnProperty(`[${y-1},${x}]`) && !interrior.hasOwnProperty(`[${y-1},${x}]`)) {
                stack.push([y-1,x]);
            }
            // GO LEFT
            if(!trench.hasOwnProperty(`[${y},${x-1}]`) && !interrior.hasOwnProperty(`[${y},${x-1}]`)) {
                stack.push([y,x-1]);
            }
        }
    }
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');
        const operations = data.map(operation => {
            return {
                direction: operation[0],
                numOfSteps: parseInt(operation.match(/\d+/g)[0])
            }
        });

        let currentPosition = [0,0]; // [y,x] - going UP means y+=1

        const trench = {};

        operations.forEach(operation => {
            currentPosition = dig(currentPosition,operation,trench);
        });

        let interrior = {};

        for(let position in trench) {
            const [y,x] = JSON.parse(position);
            if(trench[position] === 'R') floodFill([y-1,x],trench, interrior);
            if(trench[position] === 'D') floodFill([y,x-1],trench, interrior);
            if(trench[position] === 'L') floodFill([y+1,x],trench, interrior);
            if(trench[position] === 'U') floodFill([y,x+1],trench, interrior);
        }

        console.log(Object.keys(trench).length+Object.keys(interrior).length);        
    }
});