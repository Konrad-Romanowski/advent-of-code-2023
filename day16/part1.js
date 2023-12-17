const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');
    
        let beam = {x:0, y:0, direction: 'R'};
        const visitedCells = {};
       
        function move(map,beam) {
            if(visitedCells[`[${beam.y},${beam.x},${beam.direction}]`]) return;
            if(beam.x >= map[0].length || beam.x < 0 || beam.y >= map.length || beam.y < 0) return;
            `[${beam.y},${beam.x},${beam.direction}]` in visitedCells ? visitedCells[`[${beam.y},${beam.x},${beam.direction}]`] += 1 : visitedCells[`[${beam.y},${beam.x},${beam.direction}]`] = 1;

            if(beam.direction === 'R') {
                if(map[beam.y][beam.x] === '/') {
                    return move(map,{x:beam.x, y:beam.y-1, direction: 'U'}); 
                }
                if(map[beam.y][beam.x] === '\\') {
                    return move(map,{x:beam.x, y:beam.y+1, direction: 'D'}); 
                }
                if(map[beam.y][beam.x] === '-' || map[beam.y][beam.x] === '.') {
                    return move(map,{...beam, x: beam.x+1}); 
                }
                if(map[beam.y][beam.x] === '|') {
                    move(map,{x:beam.x, y:beam.y-1, direction:'U'});
                    move(map,{x:beam.x, y:beam.y+1, direction:'D'});
                }
            }

            if(beam.direction === 'D') {
                if(map[beam.y][beam.x] === '/') {
                    return move(map,{x:beam.x-1, y:beam.y, direction: 'L'}); 
                }
                if(map[beam.y][beam.x] === '\\') {
                    return move(map,{x:beam.x+1, y:beam.y, direction: 'R'}); 
                }
                if(map[beam.y][beam.x] === '|' || map[beam.y][beam.x] === '.') {
                    return move(map,{...beam, y: beam.y+1}); 
                }
                if(map[beam.y][beam.x] === '-') {
                    move(map,{x:beam.x-1, y:beam.y, direction:'L'});
                    move(map,{x:beam.x+1, y:beam.y, direction:'R'});
                }
            }

            if(beam.direction === 'L') {
                if(map[beam.y][beam.x] === '/') {
                    return move(map,{x:beam.x, y:beam.y+1, direction: 'D'}); 
                }
                if(map[beam.y][beam.x] === '\\') {
                    return move(map,{x:beam.x, y:beam.y-1, direction: 'U'}); 
                }
                if(map[beam.y][beam.x] === '-' || map[beam.y][beam.x] === '.') {
                    return move(map,{...beam, x: beam.x-1}); 
                }
                if(map[beam.y][beam.x] === '|') {
                    move(map,{x:beam.x, y:beam.y-1, direction:'U'});
                    move(map,{x:beam.x, y:beam.y+1, direction:'D'});
                }
            }

            if(beam.direction === 'U') {
                if(map[beam.y][beam.x] === '/') {
                    return move(map,{x:beam.x+1, y:beam.y, direction: 'R'}); 
                }
                if(map[beam.y][beam.x] === '\\') {
                    return move(map,{x:beam.x-1, y:beam.y, direction: 'L'}); 
                }
                if(map[beam.y][beam.x] === '|' || map[beam.y][beam.x] === '.') {
                    return move(map,{...beam, y: beam.y-1}); 
                }
                if(map[beam.y][beam.x] === '-') {
                    move(map,{x:beam.x-1, y:beam.y, direction:'L'});
                    move(map,{x:beam.x+1, y:beam.y, direction:'R'});
                }
            }
        }

        move(data,beam);
        
        let counter = {}
        for(cell in visitedCells) {
            let point = cell.slice(0,-3)+']';
            point in counter ? counter[point] += 1 : counter[point] = 1;
        }

        console.log(Object.keys(counter).length);
    }
});