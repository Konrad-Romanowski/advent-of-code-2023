const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n').map((nums) => {
            return nums.match(/-?\d+/g).map((num) => parseInt(num));
        });
    
        function produceDiffs(nums) {
            const diffs = [];
            for (let i = 0; i < nums.length - 1; i++) {
                diffs[i] = nums[i + 1] - nums[i];
            }
            return diffs;
        }
    
        function attachDiffs(numbers) {
            let fullData = [numbers];
            let diffs = produceDiffs(numbers);
        
            while (!diffs.every((num) => num === 0)) {
                fullData.push(diffs);
                diffs = produceDiffs(diffs);
            }

            return fullData;
        }
    
        const numbersAndDiffs = data.map((numbers) => attachDiffs(numbers));
    
        function extrapolateLeft(numsAndDiffs) {
            for (let i = numsAndDiffs.length - 1; i > 0; i--) {
                let firstNumOfTopRow = numsAndDiffs[i - 1][0];
                let firstNumOfBottomRow = numsAndDiffs[i][0];
                numsAndDiffs[i - 1].unshift(firstNumOfTopRow - firstNumOfBottomRow);
            }

            return numsAndDiffs;
        }
    
        const extrapolated = numbersAndDiffs.map((set) => {
            return extrapolateLeft(set);
        });
    
        const sum = extrapolated.reduce((sum, nums) => {
            return (sum += nums[0][0]);
        },0);
    
        console.log(sum);
    }
});