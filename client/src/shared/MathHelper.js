const getNRandomInts = (min, max, amount) =>{
    let result = [];
    let random;

    while(result.length < amount){
        random = getRandomInt(min, max);

        if(result.indexOf(random) == -1){
            result.push(random);
        }
    }

    for(let i=0; i<amount; i++){
        result.push( getRandomInt(min, max) );
    }
    return result;
}
module.exports.getNRandomInts = getNRandomInts;

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports.getRandomInt = getRandomInt;


// positions on circle
const calculatePositionsOnCircle = (numPositions, radius, origin, centerInSlice = false) => {
    let positions = [];
    let angleOffset = 360 / numPositions;
    let pos;
    let centerOffset = centerInSlice ? angleOffset / 2 : 0;

    for (let i = 0; i < numPositions; i++) {
        pos = pointOnCircle(radius, i * angleOffset + centerOffset, origin);
        positions.push(pos);
    }
    return positions;
}
module.exports.calculatePositionsOnCircle = calculatePositionsOnCircle;

const pointOnCircle = (radius, angleInDegrees, origin) => {
    let angleInRadians = angleInDegrees * Math.PI / 180;
    let x = radius * Math.cos(angleInRadians) + origin.x;
    let y = radius * Math.sin(angleInRadians) + origin.y;
    
    return {
        x: x,
        y: y
    };
}
module.exports.pointOnCircle = pointOnCircle;