const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const map = inputFileData.split('\r\n');

        const end = [map.length-1,map[map.length-1].length-2];
        let currentPos = [1,1];

        const paths = [];

        function traverse(currentPos, map, path = {'[1,1]':1, '[0,1]':1}) {
            const [y,x] = currentPos;
            // check if end
            if(y === end[0] && x === end[1]) {
                path[`[${y},${x}]`] = 1;
                paths.push(path);
                return;
            }

            // check top
            if(map[y-1][x] !== "#" && !(JSON.stringify([y-1,x]) in path)) {
                if(map[y-1][x] !== 'v') {
                    traverse([y-1,x],map,{...path, [`[${y-1},${x}]`]: 1});
                }
            }
            // check right
            if(map[y][x+1] !== "#" && !(JSON.stringify([y,x+1]) in path)) {
                if(map[y][x+1] !== '<') {
                    traverse([y,x+1],map,{...path, [`[${y},${x+1}]`]: 1});
                }
            }
            // check bottom
            if(map[y+1][x] !== "#" && !(JSON.stringify([y+1,x]) in path)) {
                if(map[y+1][x] !== '^') {
                    traverse([y+1,x],map,{...path, [`[${y+1},${x}]`]: 1});
                }
            }
            // check left
            if(map[y][x-1] !== "#" && !(JSON.stringify([y,x-1]) in path)) {
                if(map[y][x-1] !== '>') {
                    traverse([y,x-1],map,{...path, [`[${y},${x-1}]`]: 1});
                }
            }
        }

        console.time('traverse');
        traverse(currentPos,map);
        console.timeEnd('traverse');

        let longestPathLength = 0;
        paths.forEach(path => {
            longestPathLength = Math.max(longestPathLength, Object.keys(path).length);
        });

        console.log(longestPathLength-1);
    }
});