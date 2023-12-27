const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function moveNorth(map) {
    const rocks = [];

    for(let row = 0; row < map.length; row++){
        for(let col = 0; col < map[0].length; col++) {
            if(map[row][col] === 'O') rocks.push({x: col, y: row});
        }
    }
    
    rocks.forEach(rock => {
        while(rock.y > 0) {
            if(map[rock.y-1][rock.x] !== '.') break;
            map[rock.y][rock.x] = '.';
            map[rock.y-1][rock.x] = 'O';
            rock.y--;
        }
    });
}

function moveEast(map) {
    const rocks = [];

    for(let col = map[0].length-1; col >= 0; col--) {
        for(let row = 0; row < map.length; row++){
            if(map[row][col] === 'O') rocks.push({x: col, y: row});
        }
    }

    rocks.forEach(rock => {
        while(rock.x < map[0].length-1) {
            if(map[rock.y][rock.x+1] !== '.') break;
            map[rock.y][rock.x] = '.';
            map[rock.y][rock.x+1] = 'O';
            rock.x++;
        }
    });
}

function moveSouth(map) {
    const rocks = [];

    for(let row = map.length - 1; row >=0; row--){
        for(let col = 0; col < map[0].length; col++) {
            if(map[row][col] === 'O') rocks.push({x: col, y: row});
        }
    }
    
    rocks.forEach(rock => {
        while(rock.y < map.length-1) {
            if(map[rock.y+1][rock.x] !== '.') break;
            map[rock.y][rock.x] = '.';
            map[rock.y+1][rock.x] = 'O';
            rock.y++;
        }
    });
}

function moveWest(map) {
    const rocks = [];

    for(let col = 0; col < map[0].length; col++) {
        for(let row = 0; row < map.length; row++){
            if(map[row][col] === 'O') rocks.push({x: col, y: row});
        }
    }

    rocks.forEach(rock =>{
        while(rock.x > 0) {
            if(map[rock.y][rock.x-1] !== '.') break;
            map[rock.y][rock.x] = '.';
            map[rock.y][rock.x-1] = 'O';
            rock.x--;
        }
    });
}

function mapToString(map) {
    let string = '';

    map.forEach(row => {
        string += row.join('')
    });

    return string;
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');
        const map = data.map(row => {
            return row.split('');
        });

        let maps = {};
        let isFirstRepeat = false;
        let firstRepeatCycleNum;
        let T;
        const numOfCycles = 1000000000;

        // Since we are continuing to perform same operation over and over again,
        // we hope that the map will have the same arrangement after some fixed
        // number of cycles. If so, we don't need to run all 1000000000 operations,
        // but just ignore repeating cycles and go exactly to the final result.

        // What we need to do is to get:
        // - number of cycles before the first repetition (firstRepeatCycleNum) (1),
        // - number of cycles after which the same arrangement occurs twice (2).

        // Then we can calculate:
        // - period (T) as (2) - (1);
        // - number of cycles before the first period starts (preRepeatNumOfCycles = firstRepeatCycleNum - T);
        
        // We know that numOfCycles (1000000000) = preRepeatNumOfCycles + X*T + R.
        // Hence, R = (numOfCycles - preRepeatNumOfCycles) % T.

        for(let cycle = 1; cycle <= numOfCycles; cycle++) {
            moveNorth(map);
            moveWest(map);
            moveSouth(map);
            moveEast(map);
            let stringifiedMap = mapToString(map);

            if(maps.hasOwnProperty(stringifiedMap)) {
                if(!isFirstRepeat) {
                    firstRepeatCycleNum = cycle;
                    isFirstRepeat = true;
                }
                if(maps[stringifiedMap] === 2) {
                    T = cycle - firstRepeatCycleNum;
                    break;
                }
                maps[stringifiedMap] += 1;
            } else {
                maps[stringifiedMap] = 1;
            }
        }

        const preRepeatNumOfCycles = firstRepeatCycleNum - T;
        const numOfCyclesToPerformed = (numOfCycles - preRepeatNumOfCycles) % T;

        for(let cycle = 1; cycle <= numOfCyclesToPerformed; cycle++) {
            moveNorth(map);
            moveWest(map);
            moveSouth(map);
            moveEast(map);
        }

        let rocks = [];

        for(let row = 0; row < map.length; row++){
            for(let col = 0; col < map[0].length; col++) {
                if(map[row][col] === 'O') rocks.push({x: col, y: row});
            }
        }

        let result = rocks.reduce((total,rock)=>{
            return total+= map.length - rock.y;
        },0);

        console.log(result);
    }
});