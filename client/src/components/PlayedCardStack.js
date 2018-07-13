import React, {Component} from "react";
import PropTypes from "prop-types";
import CardView from "./CardView";
import uuid from "uuid";

class PlayedCardStack extends Component{

    createCard(card, index){
        return (
            <CardView
                key={uuid()}
                matchID={this.props.matchID}
                disabled={true}
                owner={"-1"}      // has been played. no matter who played it
                positionInRow={index}
                card={card}
            />
        );
    }

    render(){
        const cardCountToRender = 3;
        let counter = 0;
        let index = this.props.playedCards.length - cardCountToRender;
        if(index < 0){
            index = 0;
        }

        return (
            <div className="playedCards centered">
                {
                    this.props.playedCards.map((card) =>{
                        if(counter < cardCountToRender){                       // only render last 10 played cards
                            return this.createCard(this.props.playedCards[index++], counter++);
                        }
                        else{
                            return null;
                        }
                    })
                }
            </div>
        );  
    }
}

PlayedCardStack.propTypes = {
    matchID: PropTypes.string.isRequired,
    playedCards: PropTypes.array.isRequired
};

export default PlayedCardStack;