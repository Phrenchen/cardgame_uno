const matches = [];
module.exports.matches = matches;

const getMatchByID = (matchID) => {
    for(let i=0; i<matches.length; i++){
        console.log(matches[i].id);
        if(matches[i].id === matchID){
            return matches[i];
        }
    }
    return null;
}
module.exports.getMatchByID = getMatchByID;