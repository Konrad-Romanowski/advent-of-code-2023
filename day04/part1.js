const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');

        const winningNumbers = data.map(row => {
            return row.split(" |")[0].match(/\d+/g).slice(1).reduce((numbers,number)=>{
                number in numbers ? numbers[number] += 1 : numbers[number] = 1;
                return numbers;
            },{});
        });

        const playerNumbers = data.map(row => {
            return row.split(" |")[1].match(/\d+/g).reduce((numbers,number)=>{
                number in numbers ? numbers[number] += 1 : numbers[number] = 0;
                return numbers;
            },{});
        });

        playerNumbers.forEach((card,cardNumber)=>{
            for(let num in card) {
                if(num in winningNumbers[cardNumber]) playerNumbers[cardNumber][num]+=1;
            }
        });
        
        const score = playerNumbers.reduce((score,card)=>{
            let numOfWinningNumbers = 0;
            for(let num in card) {
                numOfWinningNumbers += card[num];
            }
            if(numOfWinningNumbers === 0) return score + 0;
            return score += 2 ** (numOfWinningNumbers-1);
        },0);

        console.log(score);
    }
});