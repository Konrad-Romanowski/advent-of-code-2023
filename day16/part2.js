const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');
       
        function traverse(map,beam,visitedCells={}) {
            if(visitedCells[`[${beam.y},${beam.x},${beam.direction}]`]) return;
            if(beam.x >= map[0].length || beam.x < 0 || beam.y >= map.length || beam.y < 0) return;
            `[${beam.y},${beam.x},${beam.direction}]` in visitedCells ? visitedCells[`[${beam.y},${beam.x},${beam.direction}]`] += 1 : visitedCells[`[${beam.y},${beam.x},${beam.direction}]`] = 1;

            if(beam.direction === 'R') {
                if(map[beam.y][beam.x] === '/') {
                    return traverse(map,{x:beam.x, y:beam.y-1, direction: 'U'},visitedCells); 
                }
                if(map[beam.y][beam.x] === '\\') {
                    return traverse(map,{x:beam.x, y:beam.y+1, direction: 'D'},visitedCells); 
                }
                if(map[beam.y][beam.x] === '-' || map[beam.y][beam.x] === '.') {
                    return traverse(map,{...beam, x: beam.x+1},visitedCells); 
                }
                if(map[beam.y][beam.x] === '|') {
                    traverse(map,{x:beam.x, y:beam.y-1, direction:'U'},visitedCells);
                    traverse(map,{x:beam.x, y:beam.y+1, direction:'D'},visitedCells);
                }
            }

            if(beam.direction === 'D') {
                if(map[beam.y][beam.x] === '/') {
                    return traverse(map,{x:beam.x-1, y:beam.y, direction: 'L'},visitedCells); 
                }
                if(map[beam.y][beam.x] === '\\') {
                    return traverse(map,{x:beam.x+1, y:beam.y, direction: 'R'},visitedCells); 
                }
                if(map[beam.y][beam.x] === '|' || map[beam.y][beam.x] === '.') {
                    return traverse(map,{...beam, y: beam.y+1},visitedCells); 
                }
                if(map[beam.y][beam.x] === '-') {
                    traverse(map,{x:beam.x-1, y:beam.y, direction:'L'},visitedCells);
                    traverse(map,{x:beam.x+1, y:beam.y, direction:'R'},visitedCells);
                }
            }

            if(beam.direction === 'L') {
                if(map[beam.y][beam.x] === '/') {
                    return traverse(map,{x:beam.x, y:beam.y+1, direction: 'D'},visitedCells); 
                }
                if(map[beam.y][beam.x] === '\\') {
                    return traverse(map,{x:beam.x, y:beam.y-1, direction: 'U'},visitedCells); 
                }
                if(map[beam.y][beam.x] === '-' || map[beam.y][beam.x] === '.') {
                    return traverse(map,{...beam, x: beam.x-1},visitedCells); 
                }
                if(map[beam.y][beam.x] === '|') {
                    traverse(map,{x:beam.x, y:beam.y-1, direction:'U'},visitedCells);
                    traverse(map,{x:beam.x, y:beam.y+1, direction:'D'},visitedCells);
                }
            }

            if(beam.direction === 'U') {
                if(map[beam.y][beam.x] === '/') {
                    return traverse(map,{x:beam.x+1, y:beam.y, direction: 'R'},visitedCells); 
                }
                if(map[beam.y][beam.x] === '\\') {
                    return traverse(map,{x:beam.x-1, y:beam.y, direction: 'L'},visitedCells); 
                }
                if(map[beam.y][beam.x] === '|' || map[beam.y][beam.x] === '.') {
                    return traverse(map,{...beam, y: beam.y-1},visitedCells); 
                }
                if(map[beam.y][beam.x] === '-') {
                    traverse(map,{x:beam.x-1, y:beam.y, direction:'L'},visitedCells);
                    traverse(map,{x:beam.x+1, y:beam.y, direction:'R'},visitedCells);
                }
            }

            return visitedCells;
        }

        function getNumOfEnergizedTiles(data,beam) {
            let visitedCells = traverse(data,beam);
            let counter = {}
            for(cell in visitedCells) {
                let point = cell.slice(0,-3)+']';
                point in counter ? counter[point] += 1 : counter[point] = 1;
            }
            return Object.keys(counter).length;
        }

        let MAX = 0;

        // Check left edge
        for(let y = 0; y < data.length; y++) {
            let energizedTiles = getNumOfEnergizedTiles(data,{x:0,y,direction:'R'});
            MAX = Math.max(MAX, energizedTiles);
        }

        // Check top edge
        for(let x = 0; x < data[0].length; x++) {
            let energizedTiles = getNumOfEnergizedTiles(data,{x,y:0,direction:'D'});
            MAX = Math.max(MAX, energizedTiles);
        }

        // Check right edge
        for(let y = 0; y < data.length; y++) {
            let energizedTiles = getNumOfEnergizedTiles(data,{x:data.length-1,y,direction:'L'});
            MAX = Math.max(MAX, energizedTiles);
        }

        // Check bottom edge
        for(let x = 0; x < data[0].length; x++) {
            let energizedTiles = getNumOfEnergizedTiles(data,{x,y:data.length-1,direction:'U'});
            MAX = Math.max(MAX, energizedTiles);
        }

        console.log(MAX);
    }
});