import React, {Component} from "react";
import PropTypes from "prop-types";
import CardView from "./CardView";
import {Container} from "reactstrap";
class PlayedCardStack extends Component{

    createCard(card, index){
        return (
            <CardView
                key={card.id}
                id={card.id}
                matchID={this.props.matchID}
                owner={"-1"}      // has been played. no matter who played it
                name={card.name}
                effects={card.effects}
                positionInRow={index}
            />
        );
    }

    render(){
        let counter = 0;

        return (
            <div className="playedCards">
                played cards
                {
                    this.props.playedCards.map((card) =>{
                        return this.createCard(card, ++counter);
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