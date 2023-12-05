const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

const steps = [
    'seed-to-soil',
    'soil-to-fertilizer',
    'fertilizer-to-water',
    'water-to-light',
    'light-to-temperature',
    'temperature-to-humidity',
    'humidity-to-location'
]

function getMapFromAlmanac(mapName,almanac) {
    const start = almanac.indexOf(`${mapName} map:`);
    const temp = almanac.slice(start);

    let end;
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

function mapValue(value,step,almanac) {
    let newValue = value;
    const mapType = getMapFromAlmanac(step,almanac);

    mapType.forEach(map => {
        if(map.sourceRangeStart <= value && value <= map.sourceRangeStart + map.rangeLength - 1) {
            newValue = map.destinationRangeStart + value - map.sourceRangeStart;
        }
    });
    return newValue;
}

function getLocation(seed,steps,almanac) {
    let currentValue = seed;
    steps.forEach(step => {
        currentValue = mapValue(currentValue,step,almanac);
    });

    return currentValue;
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const almanac = inputFileData.split('\r\n');

        const seeds = almanac[0].match(/\d+/g).map(seed => parseInt(seed));

        const locations = seeds.map(seed => getLocation(seed,steps,almanac));

        let MIN = Infinity;
        locations.forEach(location => {
            MIN = Math.min(MIN,location);
        });

        console.log(MIN);
    }
});