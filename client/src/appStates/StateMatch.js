import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerList from '../components/PlayerList';
import PlayedCardStack from '../components/PlayedCardStack';
import PenaltyList from '../components/PenaltyList';
import {acceptPenalties} from "../actions/MatchActions"
import uuid from "uuid";
import MatchHelper from "../shared/MatchHelper";
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
        return <PlayedCardStack 
            playedCards= {this.props.match.playedCards} 
            matchID= {this.props.match.id}
            selectedColor={this.props.match.selectedColor}
        />;
    }
    getLeftIndicator(){
        return this.getIndicator(this.state.leftIndicatorID, "effectIndicatorLeft");
    }

    getRightIndicator(){
        return this.getIndicator(this.state.rightIndicatorID, "effectIndicatorRight");
    }

    getIndicator(pID, pClassName){
        if(MatchHelper.isColorChanger(this.props.match.playedCards[this.props.match.playedCards.length-1])){
            return (
                <div className={pClassName} id={pID}>
                    
                </div>
            );
        }
        return null;
    }
    
    colorizeIndicator(id){
        let colorIndicator = document.getElementById(id);
        if(!colorIndicator){
            return;
        }
        let color = this.props.match.selectedColor.split("_")[1];
        colorIndicator.style.backgroundColor = this.props.match.selectedColor.split("_")[1];
    }


    componentDidUpdate(){
        this.colorizeIndicator(this.state.leftIndicatorID);
        this.colorizeIndicator(this.state.rightIndicatorID);
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
                    <HandCards 
                        matchID={this.props.match.id}
                        cards={MatchHelper.getActivePlayer(this.props.match).cards} 
                        owner={this.props.match.activePlayerID}
                        topCard={MatchHelper.getTopCard(this.props.match)}
                        onColorSelection={this.onShowColorSelector}
                        selectedColor={this.props.match.selectedColor}
                        />
                </div>
                {this.displayPenaltyList()}                
                {this.displayColorSelector()}       
            </div>
        );
        /*
        {this.getLeftIndicator()}
        {this.getRightIndicator()}
        */
    }
} 

const mapStateToProps = (state) =>{
    return {
        match: state.match
    }
}
export default connect(mapStateToProps, {acceptPenalties, showColorSelector, playCard})(StateMatch);