const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function getMirrors(data) {
    let mirrors = [];
    
    for(let line = 0; line < data.length; line++) {
        let currentMirror = [];
        while(data[line] !== '' && line < data.length) {
            currentMirror.push(data[line]);
            line++;
        }
        mirrors.push(currentMirror);
    }

    return mirrors;
}

function transpose(matrix) {
    matrix = matrix.map(line => line.split(''));

    const rows = matrix.length;
    const cols = matrix[0].length;

    let result = [];
    for (let i = 0; i < cols; i++) {
        result[i] = [];
        for (let j = 0; j < rows; j++) {
            result[i][j] = matrix[j][i];
        }
    }

    result = result.map(line => line.join(''));

    return result;
}

function compareRows(row1,row2) {
    for(let i = 0; i < row1.length; i++) {
        if(row1[i] !== row2[i]) return false;
    }
    return true;
}

function scanRows(mirror) {
    for(let i = 0; i < mirror.length-1; i++) {
        let isMirror = true;

        let startingIndex = i;
        
        let topIdx = i;
        let bottomIdx = i+1;

        while(topIdx >= 0 && bottomIdx < mirror.length) {
            let topRow = mirror[topIdx];
            let bottomRow = mirror[bottomIdx];
            if(!compareRows(topRow,bottomRow)) {
                isMirror = false;
                break;
            }
            topIdx--;
            bottomIdx++;
        }
        if(isMirror) return 100*(startingIndex+1);
    }
    
    return 0;
}

function scanColumns(mirror) {
    mirror = transpose(mirror);
    const result = scanRows(mirror);
    
    return result/100;
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');
        const mirrors = getMirrors(data);

        let result = 0;

        for(let mirror of mirrors) {
            result += scanColumns(mirror);
            result += scanRows(mirror);
        }

        console.log(result);
    }
});