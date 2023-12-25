const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function getX(L1,L2) {
    return (L2.b-L1.b)/(L1.a-L2.a);
}

function getIntersectionPoint(L1,L2) {
    const x = getX(L1,L2);
    const y = L1.a*x + L1.b;

    return {x,y};
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const inputData = inputFileData.split('\r\n');

        const points = inputData.reduce((points, entry) => {
            let data = entry.match(/-?\d+/g);
            points.push({
                x: parseInt(data[0]),
                y: parseInt(data[1]),
                z: parseInt(data[2]),
                dx: parseInt(data[3]),
                dy: parseInt(data[4]),
                dz: parseInt(data[5]),
                a: parseInt(data[4]) / parseInt(data[3]),
                b: parseInt(data[1]) - parseInt(data[4])/parseInt(data[3]) * parseInt(data[0])
            });
            return points
        },[]);

        const x0 = 200000000000000;
        const y0 = 200000000000000;
        const x1 = 400000000000000;
        const y1 = 400000000000000;

        let counter = 0;

        for(let i = 0; i < points.length-1; i++) {
            for(let j = i+1; j < points.length; j++) {
                // check if lines are not parallel
                if(points[i].a !== points[j].a) {
                    const {x,y} = getIntersectionPoint(points[i],points[j]);
                    if(x0 <= x && x <= x1 && y0 <= y && y <= y1) {
                        if (
                            points[i].dx <= 0 && x <= points[i].x &&
                            points[j].dx <= 0 && x <= points[j].x ||
                            points[i].dx > 0 && x > points[i].x &&
                            points[j].dx > 0 && x > points[j].x ||
                            points[i].dx <= 0 && x <= points[i].x &&
                            points[j].dx > 0 && x > points[j].x ||
                            points[i].dx > 0 && x > points[i].x &&
                            points[j].dx <= 0 && x <= points[j].x
                        ) {
                            counter++;
                        }
                    }
                }
            }
        }

        console.log(counter);

        // console.log(points[0])
        // console.log(points[4])
    }
});