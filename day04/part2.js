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
            return {
                numbers: row.split(" |")[1].match(/\d+/g),
                matchingNumbers: 0,
                score: 0,
                copies: 1
            }
        });

        playerNumbers.forEach((card,cardNumber)=>{
            let matchingNumbers = 0;

            for(let num of card.numbers) {
                if(winningNumbers[cardNumber][num]) matchingNumbers++;
            }

            card.matchingNumbers = matchingNumbers;
            card.score = (matchingNumbers > 0) ? 2 ** (matchingNumbers-1) : 0;
        });

        for(let i = 0; i < playerNumbers.length; i++) {
            let additionalCards = playerNumbers[i].matchingNumbers;

            while(additionalCards>0) {
                playerNumbers[i+additionalCards].copies+=1*playerNumbers[i].copies;
                additionalCards--;
            }
        }

        const numberOfCards = playerNumbers.reduce((sum,card)=>{
            return sum += card.copies;
        },0);

        console.log(numberOfCards);
    }
});