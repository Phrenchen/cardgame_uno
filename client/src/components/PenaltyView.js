import React, {Component} from "react";
import PropTypes from "prop-types";
import CardView from "./CardView";
import uuid from "uuid";

class PenaltyView extends Component{
    render(){
        return (
            <div id={uuid()}>
                <p>{this.props.reason}</p>
            {
                this.props.cards.map((card) => {
                    return <CardView
                        key={card.id}
                        id={card.id}
                        owner={this.props.activePlayerID}
                        name={card.name}
                        effects={card.effects}
                        />
                })
            }
            </div>
        )
    }
}

PenaltyView.propTypes = {
    reason: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
    penaltyID: PropTypes.string.isRequired,
    activePlayerID: PropTypes.string.isRequired
};

export default PenaltyView;