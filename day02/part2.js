const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');

        const redRexEx = /\d+ red/g;
        const greenRegEx = /\d+ green/g;
        const blueRegEx = /\d+ blue/g;

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

        // Below code maps 'games' array into array consisting of
        // minimum required cubes of each color per game.
        //
        // Result from example given:
        // [
        //     { red: 4, green: 2, blue: 6 },
        //     { red: 1, green: 3, blue: 4 },
        //     { red: 20, green: 13, blue: 6 },
        //     { red: 14, green: 3, blue: 15 },
        //     { red: 6, green: 3, blue: 2 }
        // ]
        const requiredCubesPerGame = games.map(game => {
            let requiredCubes = {red: 0, green: 0, blue: 0};

            game.sets.forEach(set => {
                requiredCubes.red = Math.max(requiredCubes.red, set.red);
                requiredCubes.green = Math.max(requiredCubes.green, set.green);
                requiredCubes.blue = Math.max(requiredCubes.blue, set.blue);
            })

            return requiredCubes;
        });

        const sumOfPowers = requiredCubesPerGame.reduce((power,game) => {
            return power += game.red * game.green * game.blue;
        },0);

        console.log(sumOfPowers);
    }
});