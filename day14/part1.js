const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function moveNorth(rock,map) {
    while(rock.y > 0) {
        if(map[rock.y-1][rock.x] !== '.') break;
        map[rock.y][rock.x] = '.';
        map[rock.y-1][rock.x] = 'O';
        rock.y--;
    }
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');
        const map = data.map(row => {
            return row.split('');
        });
        const rocks = data.reduce((rocks,row,rowIdx) => {
            for(let colIdx = 0; colIdx < row.length; colIdx++) {
                if(row[colIdx] === 'O') rocks.push({x: colIdx, y: rowIdx});
            }
            return rocks
        },[]);

        rocks.forEach(rock => moveNorth(rock,map));

        let result = rocks.reduce((total,rock)=>{
            return total+= map.length - rock.y;
        },0);

        console.log(result);
    }
});