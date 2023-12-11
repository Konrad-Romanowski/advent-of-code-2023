const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function dist(p1,p2) {
    return Math.abs(p1.y-p2.y)+Math.abs(p1.x-p2.x);
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

function expandMap(map) {
    for(let row = map.length-1; row>0; row--) {
        if(map[row].every(item => item === '.')) map.splice(row,0,[...Array.from({length: map[row].length},() => '.')]);
    }

    map = transpose(map);

    for(let row = map.length-1; row>0; row--) {
        if(map[row].every(item => item === '.')) map.splice(row,0,[...Array.from({length: map[row].length},() => '.')]);
    }

    map = transpose(map);

    return map;
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

function getDistancesBetweenAllGalaxies(galaxies) {
    let totalDist = 0;
    for(let i = 0; i < galaxies.length; i++) {
        for(let j = i+1; j < galaxies.length; j++) {
            totalDist+=dist(galaxies[i],galaxies[j]);
        }
    }
    return totalDist;
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const map = inputFileData.split('\r\n').map(row => row.split(''));

        const expandedMap = expandMap(map);
        const galaxies = getGalaxies(expandedMap);
        let totalDist = getDistancesBetweenAllGalaxies(galaxies);

        console.log(totalDist);
    }
});