import React, {Component} from "react";
import PropTypes from "prop-types";
import uuid from "uuid";
import CardView from "./CardView";
import MatchHelper from "../shared/MatchHelper";

const PlayCardValidator = require("../../../client/src/shared/PlayCardValidator");

class HandCards extends Component{
    
    state = {
        cardMap: []
    };

    componentDidMount(){
        let handcardDiv = document.getElementsByClassName("handCards")[0];
        
        if(!handcardDiv){
            return;
        }
        this.highlightCards(handcardDiv);

        // set css column variables for PlayedCards
        handcardDiv.style.setProperty("--handCardCount", this.props.cards.length);
    }

    
    highlightCards (handcardDiv) {
        // for each card
        // set opacity and size depending on valid

        let opacityValue = 1;
        let card;
        let cardElement;
        let isValid;
        
        this.state.cardMap.map((cardMap) =>{
            card = MatchHelper.getCardByID(this.props.cards, cardMap.cardID);
            cardElement = document.getElementById(cardMap.elementID);

            if(card && cardElement){
                isValid = PlayCardValidator.validateCard(card, this.props.topCard, this.props.selectedColor);

                if(isValid){
                    opacityValue = 1;
                    
                }
                else{
                    opacityValue = .5;
                }
                
                
                cardElement.style.setProperty("--cardOpacity", opacityValue);
            }

        });

    }

    

    render(){
        let id;
        let isValid;
        // TODO
        //this.sortCards(this.props.cards);
        MatchHelper.sortCards(this.props.cards);

        return (
            <div>
                pick a card
                <div className="handCards">
                    {
                        this.props.cards.map((card) => {
                            id = uuid();
                            
                            this.state.cardMap.push({
                                elementID: id,
                                cardID: card.id
                            });

                            isValid = PlayCardValidator.validateCard(card, this.props.topCard, this.props.selectedColor);
                            return <div 
                                id={id}
                                key={uuid()}>
                                <CardView
                                    key={card.id}
                                    onColorSelection={this.props.onColorSelection}
                                    matchID={this.props.matchID}
                                    owner={this.props.owner}
                                    card={card}
                                    selectedColor={this.props.selectedColor}
                                    isPlayable={isValid}
                                    />
                            </div>
                        })
                    }
                </div>
            </div>
        );
    }
}

HandCards.propTypes = {
    matchID: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
    topCard: PropTypes.object.isRequired,
    onColorSelection: PropTypes.func,
    selectedColor: PropTypes.string
};

export default HandCards;