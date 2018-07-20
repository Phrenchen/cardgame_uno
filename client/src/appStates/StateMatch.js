import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerList from '../components/PlayerList';
import PlayedCardStack from '../components/PlayedCardStack';
import PenaltyList from '../components/PenaltyList';
import {acceptPenalties} from "../actions/MatchActions"
import uuid from "uuid";
import MatchHelper from "../shared/MatchHelper";
import PlayCardValidator from "../shared/PlayCardValidator";
import HandCards from '../components/HandCards';
import {showColorSelector} from "../actions/MatchActions";
import { playCard } from "../actions/MatchActions";
import ColorSelector from '../components/ColorSelector';

class StateMatch extends Component{
    state = {
        leftIndicatorID: uuid(),
        rightIndicatorID: uuid()
    }

    hasPenalties = () =>{
        return this.props.match.penalties && this.props.match.penalties.length > 0;
    }

    hasServerMessage = () =>{
        return this.props.message !== "";
    }

    displayPenaltyList = () =>{
        if(this.hasPenalties()){
            return <PenaltyList className="penaltyList"
                onAccept={() =>{
                    // trigger action to server
                    this.props.acceptPenalties(this.props.match.id);
                }}
                isHumanPlayer={MatchHelper.getActivePlayer(this.props.match).isHumanPlayer}
            />
        }
        return null;
    }

    displayColorSelector = () =>{
        return this.props.match.showColorSelector ?
            <ColorSelector 
                matchID= {this.props.match.id}
                activePlayerID= {this.props.match.activePlayerID}
                playCard= {this.props.playCard}
                cardID= {this.props.match.colorSelectorCardID}
            /> :
            null;
    }

    
    onShowColorSelector = (cardID) =>{
        this.props.showColorSelector(cardID);
    }

    //-----------------------------------------------------------------
    getPlayedCardList(){
        return <div className="center_grid">
            {this.getLeftIndicator()}
            <PlayedCardStack 
                playedCards= {this.props.match.playedCards} 
                matchID= {this.props.match.id}
                selectedColor={this.props.match.selectedColor}
            />
            {this.getRightIndicator()}  

        </div>
    }

    getHandCards(){
        let isHuman = MatchHelper.getActivePlayer(this.props.match).isHumanPlayer;
        if(!isHuman){
           return null;      // hide non human player handcards
        }

        return <HandCards 
            matchID={this.props.match.id}
            cards={MatchHelper.getActivePlayer(this.props.match).cards} 
            owner={this.props.match.activePlayerID}
            isHumanPlayer={isHuman}
            topCard={MatchHelper.getTopCard(this.props.match)}
            onColorSelection={this.onShowColorSelector}
            selectedColor={this.props.match.selectedColor}
            />;
    }

    getLeftIndicator(){
        return this.getIndicator(this.state.leftIndicatorID, "effectIndicatorHorizontal");
    }

    getRightIndicator(){
        return this.getIndicator(this.state.rightIndicatorID, "effectIndicatorHorizontal");
    }

    getIndicator(pID, pClassName){
            return (
                <div className={pClassName} id={pID}>
                </div>
            );
    }
    
    // i was cheating badly by just copy & pasting this & related stuff to PlayedCardStack.
    // DAMNIT. sorry, future me. too lazy for now -.-
    colorizeIndicator(id){
        let colorIndicator = document.getElementById(id);
        if(!colorIndicator){
            return;
        }
        
        let color;
        let topCard = MatchHelper.getTopCard(this.props.match);
        
        if( PlayCardValidator.isJoker(topCard) ){
            color = this.props.match.selectedColor.split("_")[1];
        }
        else{
            color = MatchHelper.getColor(topCard);
        }
        colorIndicator.style.backgroundColor = color;
    }


    componentDidUpdate(){
        this.colorizeIndicator(this.state.leftIndicatorID);
        this.colorizeIndicator(this.state.rightIndicatorID);

        // position "centered" elements
        let centeredDivs = document.getElementsByClassName("centered");
        let centered;
        let offsetX;
        let offsetY;

        for(let i=0; i<centeredDivs.length; i++){
            centered = centeredDivs[i];
            offsetX = centered.offsetWidth * .5 * -1;
            offsetY = centered.offsetHeight * .5 * -1;
            offsetX += "px";
            offsetY += "px";
            
            centered.style.setProperty("--containerOffsetX", offsetX);
            centered.style.setProperty("--containerOffsetY", offsetY);
        }
    }

    componentDidMount(){
        this.colorizeIndicator(this.state.leftIndicatorID);
        this.colorizeIndicator(this.state.rightIndicatorID);
    }
    //-----------------------------------------------------------------
    
    render(){
        return (
            <div className="maximized">
                <div className="match_grid" key={uuid()}>
                    <PlayerList className="playerPanel"/>
                    {this.getPlayedCardList()}
                    {this.getHandCards()}
                </div>
                {this.displayPenaltyList()}                
                {this.displayColorSelector()}       
            </div>
        );
        
    }
} 

const mapStateToProps = (state) =>{
    return {
        match: state.match
    }
}
export default connect(mapStateToProps, {acceptPenalties, showColorSelector, playCard})(StateMatch);