const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\n');

        const cards = data.map(row => {
            const winningNumbers = row.split(" |")[0].match(/\d+/g).slice(1).reduce((numbers,number) => {
                number in numbers ? numbers[number] += 1 : numbers[number] = 1;
                return numbers;
            },{});

            const playerNumbers = row.split(" |")[1].match(/\d+/g);

            return {
                winningNumbers,
                playerNumbers,
                matchingNumbers: 0,
                score: 0,
            }
        });

        cards.forEach(card => {
            for(let num of card.playerNumbers) {
                if(card.winningNumbers[num]) card.matchingNumbers++;
            }
            card.score = (card.matchingNumbers > 0) ? 2 ** (card.matchingNumbers-1) : 0;
        });

        const score = cards.reduce((total,card) => {
            return total+=card.score;
        },0);

        console.log(score);
    }
});