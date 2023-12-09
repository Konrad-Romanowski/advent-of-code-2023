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
    
        function extrapolate(numsAndDiffs) {
            for (let i = numsAndDiffs.length - 1; i > 0; i--) {
                let idx1 = numsAndDiffs[i - 1].length - 1; // top arr
                let idx2 = numsAndDiffs[i].length - 1; // bottom arr
                let lastItem1 = numsAndDiffs[i - 1][idx1];
                let lastItem2 = numsAndDiffs[i][idx2];
                numsAndDiffs[i - 1].push(lastItem1 + lastItem2);
            }

            return numsAndDiffs;
        }
    
        const extrapolated = numbersAndDiffs.map((set) => {
            return extrapolate(set);
        });
    
        const sum = extrapolated.reduce((sum, nums) => {
            return (sum += nums[0][nums[0].length - 1]);
        },0);
    
        console.log(sum);
    }
});