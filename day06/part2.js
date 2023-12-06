const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');

        const time = parseInt(data[0].match(/\d+/g).join(''));
        const record = parseInt(data[1].match(/\d+/g).join(''));

        function calculateDistance(chargeTime,totalTime) {
            return chargeTime * (totalTime - chargeTime);
        }

        // Note that the function calculating distance is quadratic.

        // f(x) = x*(T-x), where
        // x - charging time,
        // T - race time (time available for charging).

        // f(x) = -x^2 + Tx,
        // Our parabola is oppening to the bottom.
        // What we are looking for is the number of Integers
        // for which f(x) > R,
        // where R is current record.

        // First we need to solve f(x) = R.
        // So we have to solve equation:
        // -x^2 + Tx = R.
        // Equivalently:
        // -x^2 + Tx - R = 0.

        // delta = T^2 - 4R
        const delta = time ** 2 - 4 * record;

        // x1 = (-T - sqrt(delta)) / (-2)
        // x2 = (-T + sqrt(delta)) / (-2)
        const x1 = (-time - Math.sqrt(delta))/(-2);
        const x2 = (-time + Math.sqrt(delta))/(-2);

        // Note that x1,x2 might be such that
        // f(x1) or f(x2) equals to current record R
        // we should not include those solutions.

        let t1 = Math.min(x1,x2);
        let t2 = Math.max(x1,x2);

        t1 = Number.isInteger(t1) ? t1 + 1 : Math.ceil(t1);
        t2 = Number.isInteger(t2) ? t1 - 1 : Math.floor(t2);

        const result = t2-t1+1;

        console.log(result);
    }
});