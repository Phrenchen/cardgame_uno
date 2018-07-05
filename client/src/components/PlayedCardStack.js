import React, {Component} from "react";
import PropTypes from "prop-types";

class PlayedCardStack extends Component{


    render(){
        //console.log(this.props.playedCards);
        return (
            <div>
                card stack
            </div>
        );  
    }
}

PlayedCardStack.propTypes = {
    playedCards: PropTypes.array.isRequired
};

export default PlayedCardStack;