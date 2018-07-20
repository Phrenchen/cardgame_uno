import React, { Component } from 'react';
import {connect} from "react-redux";
import {acceptPenalties} from "../actions/MatchActions"
import uuid from "uuid";
import MatchHelper from "../shared/MatchHelper";
import  { Button } from "reactstrap";
import {startMatch} from "../actions/MatchActions";

class StateGameOver extends Component{
    hasPenalties = () =>{
        return this.props.match.penalties && this.props.match.penalties.length > 0;
    }

    hasServerMessage = () =>{
        return this.props.message !== "";
    }

    createPlayerResults = (match, player) =>{
        let imageUrlParts = MatchHelper.getPlayerByID(this.props.match.players, player.id).imageUrl.split(".");
        let imageUrl = imageUrlParts[0] + (player.isHumanPlayer ? "_human" : "") + "." + imageUrlParts[1];

        if(match.activePlayerID === player.id){
            return (
                <div key={uuid()}>
                    <img 
                        className={"player_win"} 
                        src={imageUrl} 
                    />
                    {player.name} won the match!
                </div>
            );
        }
        else{
            return (
                <div key={uuid()}>
                    <img 
                        className={"player_lose"} 
                        src={MatchHelper.getPlayerByID(this.props.match.players, player.id).imageUrl} 
                    />
                    {player.name} scored: {player.matchScore}
                </div>
            );
        }
    }

    onStartMatch = () =>{
        this.props.startMatch(/*this.props.match.playerCount*/);        //TODO: for now every match has 5 players
    }

    sortPlayersByMatchScore(players){
        players.sort((a, b) =>{
            if(a.matchScore < b.matchScore){
                return -1;
            }
            else if(a.matchScore > b.matchScore){
                return 1;
            }
            return 0;
        });
    }
    
    render(){
        this.sortPlayersByMatchScore(this.props.match.players);

        return (
            <div className="gameOver">
                <h3>
                    GAME OVER!
                </h3>
                {
                    this.props.match.players.map((player) => {
                        return this.createPlayerResults(this.props.match, player)
                    })
                }
                <Button
                    onClick= {this.onStartMatch}
                >
                    next match
                </Button>
            </div>
        );
    }
} 

const mapStateToProps = (state) =>{
    return {
        match: state.match
    }
}
export default connect(mapStateToProps, {startMatch})(StateGameOver);