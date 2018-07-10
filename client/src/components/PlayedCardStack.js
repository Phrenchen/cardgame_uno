import React, {Component} from "react";
import PropTypes from "prop-types";
import CardView from "./CardView";
import {Container} from "reactstrap";
class PlayedCardStack extends Component{

    createCard(card, index){
        console.log("rendering played card at " + index + " : " + card.name);
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
        const cardCountToRender = 10;
        let counter = 0;
        let index = this.props.playedCards.length - cardCountToRender;
        if(index < 0){
            index = 0;
        }
        console.log("cards played: " + this.props.playedCards.length);
        console.log("start index: " + index);


        return (
            <div className="playedCards centered">
                {
                    this.props.playedCards.map((card) =>{
                        counter++;

                        if(counter <= cardCountToRender){                       // only render last 10 played cards
                            console.log("---");
                            console.log("creating card for index: " + index + " : " + card.name);
                            return this.createCard(card, index++);
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