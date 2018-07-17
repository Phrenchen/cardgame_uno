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
            "playerIconSmallActive playerPortrait" :
            "playerIconSmall playerPortrait"
    }

    getPlayerMarkerClassName(){
        return this.props.id === this.props.match.activePlayerID ? 
            "playerIconSmallActive overlayImage" :
            "playerIconSmall overlayImage"
    }

    getImageSource(){
        let imageUrlParts = MatchHelper.getPlayerByID(this.props.match.players, this.props.id).imageUrl.split(".");
        let imageUrl = imageUrlParts[0] + (this.props.isHumanPlayer ? "_human" : "") + "." + imageUrlParts[1];
        return imageUrl;
    }

    render(){
        const player = MatchHelper.getPlayerByID(this.props.match.players, this.props.id);

        return (
            <div className="playerContainer">
                <img 
                    className={this.getClassName()} 
                    src={this.getImageSource()} 
                />
                {}
            </div>
        );
    }
}

Player.propTypes = {
    id:PropTypes.string.isRequired,
    match:PropTypes.object.isRequired,
    isHumanPlayer:PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        match: state.match
    }
};
export default connect(mapStateToProps)(Player);