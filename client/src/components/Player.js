import React, {Component} from "react";
import PropTypes from "prop-types";
import MatchHelper from "../shared/MatchHelper";
import {connect} from "react-redux";
import uuid from "uuid";

/**
 * positions itself on a circle around screen center
 */
class Player extends Component{
    
    getPlayerName = () =>{
        const player = MatchHelper.getPlayerByID(this.props.match.players, this.props.id);
        let name = player.name;
        
        name += "(" + player.cards.length + ")";
        name += (this.props.id === this.props.match.activePlayerID) ? " (*)" : ""

        return name;
    }

    //-------------------
    getClassName(){
        return this.props.id === this.props.match.activePlayerID ? 
            "playerIconSmallActive" :
            "playerIconSmall"
    }

    render(){
        const player = MatchHelper.getPlayerByID(this.props.match.players, this.props.id);

        return (
            <div>
                {player.cards.length}
                <img 
                    className={this.getClassName()} 
                    src={MatchHelper.getPlayerByID(this.props.match.players, 
                                                    this.props.id).imageUrl
                        } 
                />
            </div>
        );
        /*
                <CardBody>
                    <CardTitle>{this.getPlayerName()}</CardTitle>
                </CardBody>
        */
    }
}

Player.propTypes = {
    id:PropTypes.string.isRequired,
    positionInRow:PropTypes.number.isRequired,
    match:PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        match: state.match
    }
};
export default connect(mapStateToProps)(Player);