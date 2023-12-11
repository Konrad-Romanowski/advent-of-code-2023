const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function dist(p1,p2,emptyRows,emptyColumns) {
    let emptyRowsBetweenP1andP2 = 0;
    for(let rowIdx in emptyRows) {
        if(
            p1.y > parseInt(rowIdx) && parseInt(rowIdx) > p2.y ||
            p1.y < parseInt(rowIdx) && parseInt(rowIdx) < p2.y
        ) emptyRowsBetweenP1andP2++;
    }

    let emptyColsBetweenP1andP2 = 0;
    for(let colIdx in emptyColumns) {
        if(
            p1.x > parseInt(colIdx) && parseInt(colIdx) > p2.x ||
            p1.x < parseInt(colIdx) && parseInt(colIdx) < p2.x
        ) emptyColsBetweenP1andP2++;
    }
    return Math.abs(p1.y-p2.y)+(1000000-1)*emptyRowsBetweenP1andP2+Math.abs(p1.x-p2.x)+(1000000-1)*emptyColsBetweenP1andP2;
}

function transpose(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    const result = [];
    for (let i = 0; i < cols; i++) {
        result[i] = [];
        for (let j = 0; j < rows; j++) {
            result[i][j] = matrix[j][i];
        }
    }

    return result;
}

function getGalaxies(map) {
    const galaxies = [];
    for(let row = 0; row < map.length; row++) {
        for(let col = 0; col < map[0].length; col++) {
            if(map[row][col] === '#') galaxies.push({x:col, y:row});
        }
    }
    return galaxies;
}

function getDistancesBetweenAllGalaxies(galaxies,emptyRows,emptyColumns) {
    let totalDist = 0;
    for(let i = 0; i < galaxies.length; i++) {
        for(let j = i+1; j < galaxies.length; j++) {
            totalDist+=dist(galaxies[i],galaxies[j],emptyRows,emptyColumns);
        }
    }
    return totalDist;
}

function getEmptyRowIndexes(map) {
    let emptyRows = {};
    map.forEach((row,rowIdx) => {
        if(row.every(item => item === '.')) {
            emptyRows[rowIdx] = true;
        }
    });
    return emptyRows;
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const map = inputFileData.split('\r\n').map(row => row.split(''));

        emptyRows = getEmptyRowIndexes(map);
        emptyColumns = getEmptyRowIndexes(transpose(map));

        const galaxies = getGalaxies(map);
        let totalDist = getDistancesBetweenAllGalaxies(galaxies,emptyRows,emptyColumns);

        console.log(totalDist);
    }
});