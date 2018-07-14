import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerList from '../components/PlayerList';
import PlayedCardStack from '../components/PlayedCardStack';
import PenaltyList from '../components/PenaltyList';
import {acceptPenalties} from "../actions/MatchActions"
import uuid from "uuid";
import MatchHelper from "../shared/MatchHelper";
import CardList from '../components/CardList';
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
                penalties={this.props.match.penalties} 
                matchID={this.props.match.id}
                activePlayerID={this.props.match.activePlayerID}
                playerName={MatchHelper.getActivePlayer(this.props.match).name}
                selectedColor={this.props.match.selectedColor}
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
    getLeftIndicator(){
        return this.getIndicator(this.state.leftIndicatorID, "effectIndicatorLeft");
    }

    getRightIndicator(){
        return this.getIndicator(this.state.rightIndicatorID, "effectIndicatorRight");
    }

    getIndicator(pID, pClassName){
        if(MatchHelper.isColorChanger(this.props.match.playedCards[this.props.match.playedCards.length-1])){
            console.log("iz color card!11");
            return (
                <div className={pClassName} id={pID}>
                    {pClassName}
                </div>
            );
        }
        console.log("no colorchanger as topCard");
        return null;
    }
    
    colorizeIndicator(id){
        let colorIndicator = document.getElementById(id);
        if(!colorIndicator){
            console.log("colorizing no indicator: " + id);
            return;
        }
        let color = this.props.match.selectedColor.split("_")[1];
        console.log("colo000r: " + color);
        colorIndicator.style.backgroundColor = this.props.match.selectedColor.split("_")[1];
    }

    componentDidUpdate(){
        this.colorizeIndicator(this.state.leftIndicatorID);
        this.colorizeIndicator(this.state.rightIndicatorID);
    }

    componentDidMount(){
        console.log("this.state.leftIndicatorID: " + this.state.leftIndicatorID);
        this.colorizeIndicator(this.state.leftIndicatorID);
        this.colorizeIndicator(this.state.rightIndicatorID);
    }
    //-----------------------------------------------------------------
    
    render(){
        return (
            <div className="match_grid" key={uuid()}>
                <PlayerList className="playerPanel"/>
                <PlayedCardStack 
                    playedCards= {this.props.match.playedCards} 
                    matchID= {this.props.match.id}
                    selectedColor={this.props.match.selectedColor}
                />
                <CardList 
                    
                    matchID={this.props.match.id}
                    cards={MatchHelper.getActivePlayer(this.props.match).cards} 
                    owner={this.props.match.activePlayerID}
                    topCard={MatchHelper.getTopCard(this.props.match)}
                    onColorSelection={this.onShowColorSelector}
                    selectedColor={this.props.match.selectedColor}
                />
                {this.displayPenaltyList()}                
                {this.displayColorSelector()}       
                
                {this.getLeftIndicator()}
                {this.getRightIndicator()}
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