import React, {Component} from "react";
import PropTypes from "prop-types";
import CardView from "./CardView";
import {Container} from "reactstrap";
class PlayedCardStack extends Component{


    render(){
        const topCard = this.props.playedCards[this.props.playedCards.length -1];

        return (
            <Container>
                played cards
                <CardView
                    key={topCard.id}
                    id={topCard.id}
                    matchID={this.props.matchID}
                    owner={"-1"}      // has been played. no matter who played it
                    name={topCard.name}
                    effects={topCard.effects}
                />
            </Container>
        );  
    }
}

PlayedCardStack.propTypes = {
    matchID: PropTypes.string.isRequired,
    playedCards: PropTypes.array.isRequired
};

export default PlayedCardStack;