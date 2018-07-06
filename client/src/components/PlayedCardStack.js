import React, {Component} from "react";
import PropTypes from "prop-types";
import CardView from "./CardView";

import uuid from "uuid";

class PlayedCardStack extends Component{


    render(){
        //console.log(this.props.playedCards);
        //console.log(this.props.playedCards.length);
        //console.log(this.props.playedCards[0]);
        const topCard = this.props.playedCards[this.props.playedCards.length -1];
        //console.log("top card: " + topCard.name);

        return (
            <div>
                <CardView
                    key={uuid()}
                    id={uuid()}
                    owner={-1}      // has been played. no matter who played it
                    name={topCard.name}
                    effects={topCard.effects}
                />
            </div>
        );  
    }
}

PlayedCardStack.propTypes = {
    playedCards: PropTypes.array.isRequired
};

export default PlayedCardStack;