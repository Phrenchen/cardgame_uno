import React, { Component } from 'react';
import {connect} from "react-redux";
import {acceptPenalties} from "../actions/MatchActions"
import uuid from "uuid";
import MatchHelper from "../shared/MatchHelper";

class StateGameOver extends Component{
    hasPenalties = () =>{
        return this.props.match.penalties && this.props.match.penalties.length > 0;
    }

    hasServerMessage = () =>{
        return this.props.message != "";
    }

    createPlayerResults = (match, player) =>{
        if(match.activePlayerID === player.id){
            return (
                <p key={uuid()}>winner is {player.name}!</p>
            );
        }
        else{
            return (
                <p key={uuid()}>{player.name} has scored {player.matchScore}</p>
            );
        }
    }

    render(){
        let player = MatchHelper.getActivePlayer(this.props.match);
        return (
            <div key={uuid()}>
                {
                    this.props.match.players.map((player) => {
                        return this.createPlayerResults(this.props.match, player)
                    })
                }
            </div>
        );
    }
} 

const mapStateToProps = (state) =>{
    return {
        match: state.match
    }
}
export default connect(mapStateToProps, {acceptPenalties})(StateGameOver);