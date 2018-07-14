import React, {Component} from "react";
import PropTypes from "prop-types";
import uuid from "uuid";
import CardView from "./CardView";
const PlayCardValidator = require("../../../client/src/shared/PlayCardValidator");

class CardList extends Component{

    render(){
        return (
            <div className="handCards">
                pick a card
                {
                    this.props.cards.map((card) => {
                        let isValid = PlayCardValidator.validateCard(card, this.props.topCard, this.props.selectedColor);
                        if(isValid){
                            return <div key={uuid()}>
                                <CardView
                                    key={card.id}
                                    onColorSelection={this.props.onColorSelection}
                                    matchID={this.props.matchID}
                                    owner={this.props.owner}
                                    card={card}
                                    selectedColor={this.props.selectedColor}
                                />
                            </div>
                        }
                    })
                }
            </div>
        );
    }
}

CardList.propTypes = {
    matchID: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
    topCard: PropTypes.object.isRequired,
    onColorSelection: PropTypes.func,
    selectedColor: PropTypes.string
};

export default CardList;