import React, {Component} from "react";
import PropTypes from "prop-types";
import PlayCardValidator from "../shared/PlayCardValidator";
import MatchHelper from "../shared/MatchHelper";
import MathHelper from "../shared/MathHelper";
import EffectColor from "../shared/EffectColor";
import {connect} from "react-redux";
import { playCard } from "../actions/MatchActions";

/**
 * positions itself on a circle around screen center
 */
class Player extends Component{
    
    state = {
        autoPlayCardDelayID: -1
    }

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

    playRandomCard(){
        // select card from active player
        let validCard = MatchHelper.getRandomValidCardFromActivePlayer(this.props.match);

        if(validCard){
            let selectedColor = PlayCardValidator.isJoker(validCard) ? this.getRandomColor() : "";
            this.props.playCard(this.props.match.id, this.props.match.activePlayerID, validCard.id, selectedColor);
        }
        else{
            console.log("no card to auto-play");
        }
    }

    getRandomColor(){
        let colors = [EffectColor.RED, EffectColor.GREEN, EffectColor.BLUE, EffectColor.YELLOW];
        let randomID = MathHelper.getRandomInt(0, colors.length-1);
        return colors[randomID];
    }

    componentDidMount(){
        let isActive = MatchHelper.getActivePlayer(this.props.match).id === this.props.id;
        
        if(this.props.match.penalties.length > 0){
            return;
        }

        if(isActive && !this.props.isHumanPlayer){
            let delay = MathHelper.getRandomInt(800, 1400);     // delay range : 0.5s - 1.5s
            //this.playRandomCard();

            
            this.state.autoPlayCardDelayID = setTimeout(()=>{
                this.playRandomCard();
            }, delay);
            
        }
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
export default connect(mapStateToProps, {playCard})(Player);