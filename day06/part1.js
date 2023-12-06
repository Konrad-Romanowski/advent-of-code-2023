const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');

        const times = data[0].match(/\d+/g).map(time => parseInt(time));
        const records = data[1].match(/\d+/g).map(record => parseInt(record));

        let races = [];

        for(let i = 0; i < times.length; i++) {
            races[i] = {
                time: times[i],
                record: records[i],
            }
        }

        function calculateDistance(chargeTime,totalTime) {
            return chargeTime * (totalTime - chargeTime);
        }

        function getPossibleDistances(race) {
            const results = [];
            for(let t = 0; t < race.time; t++) {
                results[t] = calculateDistance(t,race.time);
            }
            return results;
        }

        races = races.map(race=>{
            return {
                ...race,
                possibleDistances: getPossibleDistances(race)
            }
        });

        const winningOptionsPerRace = races.map(race => {
            return race.possibleDistances.filter(dist => dist > race.record).length;
        });

        const result = winningOptionsPerRace.reduce((result,numberOfWays)=>{
            return result *= numberOfWays;
        },1);

        console.log(result);
    }
});