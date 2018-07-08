import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerList from '../components/PlayerList';
import PlayedCardStack from '../components/PlayedCardStack';
import PenaltyList from '../components/PenaltyList';
import {acceptPenalties} from "../actions/MatchActions"
import uuid from "uuid";

class StateMatch extends Component{

    displayPenaltyDialog = () =>{
        if(this.props.match.penalties && this.props.match.penalties.length > 0){
            return <PenaltyList 
                penalties={this.props.match.penalties} 
                matchID={this.props.match.id}
                activePlayerID={this.props.match.activePlayerID}
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
            <div className="match_grid" key={uuid()}>
                 <PlayerList/>
                 <PlayedCardStack 
                    playedCards= {this.props.match.playedCards} 
                    matchID= {this.props.match.id}
                />
                 { this.displayPenaltyDialog() }
            </div>
        );
    }
} 

const mapStateToProps = function(state){
    return {
        match: state.match
    }
}
export default connect(mapStateToProps, {acceptPenalties})(StateMatch);