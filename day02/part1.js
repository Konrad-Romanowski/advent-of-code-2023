const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');

        const maxRed = 12;
        const maxGreen = 13;
        const maxBlue = 14;

        const redRexEx = /\d+ red/g;
        const greenRegEx = /\d+ green/g;
        const blueRegEx = /\d+ blue/g;

        // Below code transforms input data into array
        // of objects that holds gameID and sets drawn
        // per each game.
        //
        // Result from example given:
        // [
        //     {
        //         gameID: 1,
        //         sets: [
        //             { red: 4, green: 0, blue: 3 },
        //             { red: 1, green: 2, blue: 6 },
        //             { red: 0, green: 2, blue: 0 }
        //         ]
        //     },
        //     ...,
        //     {
        //         gameID: 5,
        //         sets: [
        //             { red: 6, green: 3, blue: 1 },
        //             { red: 1, green: 2, blue: 2 }
        //         ]
        //     }
        // ]
        const games = data.reduce((games,game,idx) => {
            const singleGame = {
                gameID: idx+1
            }
            const samples = game.split(': ')[1].split('; ');

            const sets = samples.map(sample => {
                let numOfRed = sample.match(redRexEx) ? parseInt(sample.match(redRexEx)[0].split(' ')[0]) : 0;
                let numOfGreen = sample.match(greenRegEx) ? parseInt(sample.match(greenRegEx)[0].split(' ')[0]) : 0;
                let numOfBlue = sample.match(blueRegEx) ? parseInt(sample.match(blueRegEx)[0].split(' ')[0]) : 0;
            
                let set = {
                    red: numOfRed,
                    green: numOfGreen,
                    blue: numOfBlue
                }
            
                return set;
            },[]);

            singleGame.sets = sets;
            games.push(singleGame);
            return games;
        },[]);

        const possibleGames = games.filter(game => {
            return game.sets.every(set => (set.red <= maxRed && set.green <= maxGreen && set.blue <= maxBlue))
        });

        const sumOfIDs = possibleGames.reduce((sumOfIDs,game) => {
            return sumOfIDs += game.gameID;
        },0);

        console.log(sumOfIDs);
    }
});