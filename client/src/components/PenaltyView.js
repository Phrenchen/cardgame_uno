import React, {Component} from "react";
import PropTypes from "prop-types";
import CardView from "./CardView";
import uuid from "uuid";

class PenaltyView extends Component{

    state = {
        id: uuid()
    };

    componentDidMount(){
        let penaltyCardDiv = document.getElementById(this.state.id);
        
        if(!penaltyCardDiv){
            return;
        }

        // set css column variables for PlayedCards
        penaltyCardDiv.style.setProperty("--penaltyCardCount", this.props.cards.length);
    }

    render(){
        return (
            <div>
                <p>{this.props.reason}</p>
                <div
                    id={this.state.id} 
                    className="penaltyCards">
                {
                    this.props.cards.map((card) => {
                        return <CardView
                        key={uuid()}
                        matchID={this.props.matchID}
                        owner={this.props.activePlayerID}
                        card={card}
                        selectedColor={this.props.selectedColor}
                        isPlayable={false}
                        isHumanPlayer={false}
                        />
                    })
                }
                </div>
            </div>
        )
    }
}

PenaltyView.propTypes = {
    reason: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
    penaltyID: PropTypes.string.isRequired,
    activePlayerID: PropTypes.string.isRequired,
    matchID:PropTypes.string.isRequired,
    selectedColor: PropTypes.string.isRequired
};

export default PenaltyView;