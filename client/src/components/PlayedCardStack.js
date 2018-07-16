import React, {Component} from "react";
import PropTypes from "prop-types";
import CardView from "./CardView";
import uuid from "uuid";
import MatchHelper from "../shared/MatchHelper";

class PlayedCardStack extends Component{

    state = {
        cardCountToRender: 3
    }

    componentDidMount(){
        let handcardDiv = document.getElementsByClassName("playedCards")[0];
        if(!handcardDiv){
            return;
        }
        // set css column variables for PlayedCards
        let columnCount = this.props.playedCards.length < this.state.cardCountToRender ?
                            this.props.playedCards.length :
                            this.state.cardCountToRender;
        handcardDiv.style.setProperty("--playedCardCount", columnCount);
    }

    render(){
        let counter = 0;
        let index = this.props.playedCards.length - this.state.cardCountToRender;
        if(index < 0){
            index = 0;
        }

        return (
            <div className="playedCards">
                {
                    this.props.playedCards.map((card) =>{
                        if(counter < this.state.cardCountToRender){                       // only render last 10 played cards
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

    createCard(card, index){
        return (
            <CardView
                key={uuid()}
                matchID={this.props.matchID}
                owner={"-1"}      // has been played. no matter who played it
                positionInRow={index}
                card={card}
                selectedColor={this.props.selectedColor}
                isPlayable={false}
            />
        );
    }
}

PlayedCardStack.propTypes = {
    matchID: PropTypes.string.isRequired,
    playedCards: PropTypes.array.isRequired,
    selectedColor: PropTypes.string.isRequired
};

export default PlayedCardStack;