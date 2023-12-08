const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

// Greatest Common Divisor
function GCD(a, b) {
    if (b === 0) {
        return a;
    } else {
        return GCD(b, a % b);
    }
}

// Least Common Multiple
function LCM(a, b) {
    return (a * b) / GCD(a, b);
}

function arrayLCM(arr) {
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
        result = LCM(result, arr[i]);
    }
    return result;
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');

        const moves = data[0];
        const nodes = data.slice(2).reduce((nodes,line) => {
            const points = line.match(/\w+/g);
            const node = {L: points[1], R: points[2]};
            return {
                ...nodes,
                [points[0]]: node
            }
        },{});

        let startingNodes = [];

        for(let node in nodes) {
            if(node[2] === 'A') startingNodes.push(node);
        }

        function getNumberOfMoves(node) {
            let numOfMoves = 0;
            let moveIndex = 0;
            while(node[2] !== 'Z') {
                if(moveIndex === moves.length) moveIndex = 0;
                node = nodes[node][moves[moveIndex]];
                moveIndex++;
                numOfMoves++
            }
            return numOfMoves;
        }

        const arrOfMoves = startingNodes.map(node => {
            return getNumberOfMoves(node);
        });

        console.log(arrayLCM(arrOfMoves));
    }
});