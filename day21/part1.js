const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function getStart(map) {
    for(let row = 0; row < map.length; row++) {
        for(let col = 0; col < map[0].length; col++) {
            if(map[row][col] === "S") {
                return JSON.stringify([row,col]);
            }
        }
    }
}

function traverse(occupiedPositions,map) {
    currentPositions = {};
    Object.keys(occupiedPositions).forEach(position => {
        let [y,x] = JSON.parse(position);
        // check UP
        if(y !== 0) {
            if(map[y-1][x] !== '#') {
                `[${y-1},${x}]` in currentPositions ? currentPositions[`[${y-1},${x}]`] +=1 : currentPositions[`[${y-1},${x}]`] = 1;
            }
        }
        // check RIGHT
        if(x !== map[0].length-1) {
            if(map[y][x+1] !== '#') {
                `[${y},${x+1}]` in currentPositions ? currentPositions[`[${y},${x+1}]`] +=1 : currentPositions[`[${y},${x+1}]`] = 1;
            }
        }
        // check DOWN
        if(y !== map.length-1) {
            if(map[y+1][x] !== '#') {
                `[${y+1},${x}]` in currentPositions ? currentPositions[`[${y+1},${x}]`] +=1 : currentPositions[`[${y+1},${x}]`] = 1;
            }
        }
        // check LEFT
        if(x !== 0) {
            if(map[y][x-1] !== '#') {
                `[${y},${x-1}]` in currentPositions ? currentPositions[`[${y},${x-1}]`] +=1 : currentPositions[`[${y},${x-1}]`] = 1;
            }
        }
    });
    return currentPositions
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const map = inputFileData.split('\r\n');

        const start = getStart(map);
        let occupiedPositions = {[start]: 1};

        for(let i = 0; i < 64; i++) {
            occupiedPositions = traverse(occupiedPositions,map);
        }

        console.log(Object.keys(occupiedPositions).length);      
    }
});