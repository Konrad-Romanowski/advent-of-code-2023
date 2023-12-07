const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function getHandType(cards) {
    let numOfJokers = 0;

    const numOfCards = cards.split('').reduce((counter,card)=>{
        (card in counter) ? counter[card] += 1 : counter[card] = 1;
        if(card === 'J') numOfJokers++;
        return counter;
    },{});

    let numOfPairs = 0;
    let numOfThrees = 0;
    for(let card in numOfCards) {
        if(numOfCards[card] === 5) return 'Five of a kind';
        if(numOfCards[card] === 4 && numOfJokers === 1) return 'Five of a kind';
        if(numOfCards[card] === 4 && card !== 'J') return 'Four of a kind';
        if(numOfCards[card] === 3 && card !== 'J') numOfThrees+=1;
        if(numOfCards[card] === 2 && card !== 'J') numOfPairs+=1;
    }

    if(numOfJokers === 4) return 'Five of a kind';

    if(numOfJokers === 3 && numOfPairs === 1) return 'Five of a kind';
    if(numOfJokers === 3) return 'Four of a kind';
    
    if(numOfJokers === 2 && numOfThrees === 1) return 'Five of a kind';
    if(numOfJokers === 2 && numOfPairs === 1) return 'Four of a kind';
    if(numOfJokers === 2) return 'Three of a kind';

    if(numOfJokers === 1 && numOfThrees === 1) return 'Four of a kind';
    if(numOfJokers === 1 && numOfPairs === 2) return 'Full house';
    if(numOfJokers === 1 && numOfPairs === 1) return 'Three of a kind';

    if(numOfThrees && numOfPairs) return 'Full house';
    if(numOfThrees === 1) return 'Three of a kind';
    if(numOfPairs === 2) return 'Two pairs';
    if(numOfPairs === 1) return 'One pair';

    if(numOfJokers === 1) return 'One pair';
    return 'High card';
}

const cardValue = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "T": 10,
    "J": 1,
    "Q": 12,
    "K": 13,
    "A": 14,
}

function areHandsInCorrectOrder(hand1,hand2) {
    for(let i = 0; i < hand1.cards.length; i++) {
        if(cardValue[hand1.cards[i]] > cardValue[hand2.cards[i]]) return true;
        if(cardValue[hand1.cards[i]] < cardValue[hand2.cards[i]]) return false;
    }
    return true;
}

function sortHands(hands) {
    if(hands.length === 0) return hands;
    for(let i = 0; i < hands.length; i++) {
        for(let j = 0; j < hands.length - 1 - i; j++) {
            if(!areHandsInCorrectOrder(hands[j],hands[j+1])) {
                [hands[j],hands[j+1]] = [hands[j+1],hands[j]];
            }
        }
    }
    return hands;
}

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');

        const hands = data.map(hand => {
            const cards = hand.split(' ')[0];
            const bid = hand.split(' ')[1];
            return {
                cards,
                bid,
                type: getHandType(cards)
            }
        });

        const handTypes = [
            'Five of a kind',
            'Four of a kind',
            'Full house',
            'Three of a kind',
            'Two pairs',
            'One pair',
            'High card'
        ];

        const handsGroupedByType = handTypes.map(type => {
            return hands.filter(hand => hand.type === type);
        });

        handsGroupedByType.forEach(group => sortHands(group));
        const sortedHands = handsGroupedByType.flat(1);

        const winnings = sortedHands.reduce((total,hand,idx)=>{
            return total += hand.bid * (sortedHands.length-idx);
        },0);

        console.log(winnings);
    }
});