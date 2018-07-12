import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerList from '../components/PlayerList';
import PlayedCardStack from '../components/PlayedCardStack';
import PenaltyList from '../components/PenaltyList';
import {acceptPenalties} from "../actions/MatchActions"
import uuid from "uuid";
import MatchHelper from "../shared/MatchHelper";
import CardList from '../components/CardList';

class StateMatch extends Component{
    hasPenalties = () =>{
        return this.props.match.penalties && this.props.match.penalties.length > 0;
    }

    hasServerMessage = () =>{
        return this.props.message !== "";
    }

    displayAdditionalMatchInfos = () =>{
        
        if(this.hasPenalties()){
            return <PenaltyList className="penaltyList"
                penalties={this.props.match.penalties} 
                matchID={this.props.match.id}
                activePlayerID={this.props.match.activePlayerID}
                playerName={MatchHelper.getActivePlayer(this.props.match).name}
                onAccept={() =>{
                    // trigger action to server
                    this.props.acceptPenalties(this.props.match.id);
                }}
            />
        }
        return null;
    }

    render(){
        return (
            <div key={uuid()}>
                <PlayerList className="playerPanel"/>
                <PlayedCardStack className="playedCards"
                    playedCards= {this.props.match.playedCards} 
                    matchID= {this.props.match.id}
                    />
                <CardList 
                    matchID={this.props.match.id}
                    cards={MatchHelper.getActivePlayer(this.props.match).cards} 
                    owner={this.props.match.activePlayerID}
                    topCard={MatchHelper.getTopCard(this.props.match)}
                    />
                { this.displayAdditionalMatchInfos() }                       
            </div>
        );
    }
} 

const mapStateToProps = (state) =>{
    return {
        match: state.match
    }
}
export default connect(mapStateToProps, {acceptPenalties})(StateMatch);