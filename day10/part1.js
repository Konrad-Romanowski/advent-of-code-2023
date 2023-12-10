const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function getStart(map) {
    let start = null;
    map.forEach((row,rowNumber) => {
        row.forEach((col,colNumber) => {
            if(col === 'S') start = {x: colNumber, y: rowNumber, prevMove: ''}
        });
    });
    return start;
}

function makeFirstMove(start,map) {
    // check if we can go UP
    if(start.y !== 0) {
        if(
            map[start.y-1][start.x] === '7' ||
            map[start.y-1][start.x] === '|' ||
            map[start.y-1][start.x] === 'F'
        ) {
            return {
                ...start,
                y: start.y-1,
                prevMove: 'U'
            }
        }
    }

    // check if we can go RIGHT
    if(start.x !== map[0].length-1) {
        if(
            map[start.y][start.x+1] === 'J' ||
            map[start.y][start.x+1] === '-' ||
            map[start.y][start.x+1] === '7'
        ) {
            return {
                ...start,
                x: start.x+1,
                prevMove: 'R'
            }
        }
    }

    // check if we can go DOWN
    if(start.y !== map.length-1) {
        if(
            map[start.y+1][start.x] === 'J' ||
            map[start.y+1][start.x] === '|' ||
            map[start.y+1][start.x] === 'L'
        ) return {
            ...start,
            y: start.y+1,
            prevMove: 'D'
        }
    }

    // check if we can go LEFT
    if(start.x !== 0) {
        if(
            map[start.y+1][start.x] === 'L' ||
            map[start.y+1][start.x] === '-' ||
            map[start.y+1][start.x] === 'F'
        ) return {
            ...start,
            x: start.x-1,
            prevMove: 'L'
        }
    }
}

function move(currentPos,map) {
    if(currentPos.prevMove === 'U') {
        if(map[currentPos.y][currentPos.x] === '|') return {...currentPos, y:currentPos.y-1, prevMove: 'U'}
        if(map[currentPos.y][currentPos.x] === 'F') return {...currentPos, x:currentPos.x+1, prevMove: 'R'}
        if(map[currentPos.y][currentPos.x] === '7') return {...currentPos, x:currentPos.x-1, prevMove: 'L'}
    }
    if(currentPos.prevMove === 'R') {
        if(map[currentPos.y][currentPos.x] === 'J') return {...currentPos, y:currentPos.y-1, prevMove: 'U'}
        if(map[currentPos.y][currentPos.x] === '-') return {...currentPos, x:currentPos.x+1, prevMove: 'R'}
        if(map[currentPos.y][currentPos.x] === '7') return {...currentPos, y:currentPos.y+1, prevMove: 'D'}
    }
    if(currentPos.prevMove === 'D') {
        if(map[currentPos.y][currentPos.x] === 'J') return {...currentPos, x:currentPos.x-1, prevMove: 'L'}
        if(map[currentPos.y][currentPos.x] === '|') return {...currentPos, y:currentPos.y+1, prevMove: 'D'}
        if(map[currentPos.y][currentPos.x] === 'L') return {...currentPos, x:currentPos.x+1, prevMove: 'R'}
    }
    if(currentPos.prevMove === 'L') {
        if(map[currentPos.y][currentPos.x] === 'L') return {...currentPos, y:currentPos.y-1, prevMove: 'U'}
        if(map[currentPos.y][currentPos.x] === '-') return {...currentPos, x:currentPos.x-1, prevMove: 'L'}
        if(map[currentPos.y][currentPos.x] === 'F') return {...currentPos, y:currentPos.y+1, prevMove: 'D'}
    }
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const map = inputFileData.split('\r\n').map(line => {
            return line.split('');
        });

        let currentPos = getStart(map);
        let numOfMoves = 0;

        currentPos = makeFirstMove(currentPos,map);
        numOfMoves++;

        while(map[currentPos.y][currentPos.x] !== 'S') {
            currentPos = move(currentPos,map);
            numOfMoves++   
        }

        console.log(Math.floor(numOfMoves/2));
    }
});