const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

// Below function reads mapping rules for each step from the input
// and returns it in an easier to use structure.
function getMappingFromAlmanac(step,almanac) {
    const start = almanac.indexOf(`${step} map:`);
    const temp = almanac.slice(start);

    let end;
    // Below condition solves issue with reading last part of mapping i.e. 'humidity-to-location map:'
    if(temp.indexOf('') === -1) {
        end = start + temp.length;
    } else {
        end = start + temp.indexOf('');
    }

    return almanac.slice(start+1,end).map(range => {
        return ({
            sourceRangeStart: parseInt(range.match(/\d+/g)[1]),
            destinationRangeStart: parseInt(range.match(/\d+/g)[0]),
            rangeLength: parseInt(range.match(/\d+/g)[2]),
        });
    });
}

// Below function applies correct mapping rule based on the input
// and returns mapped value.
function mapValue(value,mappingRules) {
    // We are checking if the value falls into one of the ranges
    for(let i = 0 ; i < mappingRules.length; i++) {
        if(mappingRules[i].sourceRangeStart <= value && value <= mappingRules[i].sourceRangeStart + mappingRules[i].rangeLength - 1) {
            return mappingRules[i].destinationRangeStart + value - mappingRules[i].sourceRangeStart;
        }
    }
    return value;

    // Easier to understand alternative below.
    // However, this solution keeps looping even if
    // the actual range has been already found.

    // let newValue = value;
    // mappingRules.forEach(rule => {
    //     if(rule.sourceRangeStart <= value && value <= rule.sourceRangeStart + rule.rangeLength - 1) {
    //         newValue = rule.destinationRangeStart + value - rule.sourceRangeStart;
    //     }
    // });
    // return newValue;
}

function getLocation(seed,mapping) {
    let currentValue = seed;
    mapping.forEach(mappingStep => {
        currentValue = mapValue(currentValue,mappingStep.mappingRules);
    });

    return currentValue;
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const almanac = inputFileData.split('\r\n');
        const seeds = almanac[0].match(/\d+/g).map(seed => parseInt(seed));

        const steps = [
            'seed-to-soil',
            'soil-to-fertilizer',
            'fertilizer-to-water',
            'water-to-light',
            'light-to-temperature',
            'temperature-to-humidity',
            'humidity-to-location'
        ];

        const mapping = steps.map(step => {
            return {
                step,
                mappingRules: getMappingFromAlmanac(step,almanac)
            }
        },{});
        
        const locations = seeds.map(seed => getLocation(seed,mapping));

        let MIN = Infinity;
        locations.forEach(location => {
            MIN = Math.min(MIN,location);
        });

        console.log(MIN);
    }
});