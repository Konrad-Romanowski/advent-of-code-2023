const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');

        const moves = data[0];
        let moveIndex = 0;
        let numOfMoves = 0;

        const nodes = data.slice(2).reduce((nodes,line) => {
            const points = line.match(/\w+/g);
            const node = {L: points[1], R: points[2]};
            return {
                ...nodes,
                [points[0]]: node
            }
        },{});

        let currentNode = 'AAA';

        while(currentNode !== 'ZZZ') {
            if(moveIndex === moves.length) moveIndex = 0;
            currentNode = nodes[currentNode][moves[moveIndex]];
            moveIndex++;
            numOfMoves++
        }

        console.log(numOfMoves);
    }
});