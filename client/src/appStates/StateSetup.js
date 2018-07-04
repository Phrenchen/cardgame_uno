import React, { Component } from 'react';
import PlayerList from '../components/PlayerList';
import AmountOfPlayerSelector from '../components/AmountOfPlayerSelector';
import {connect} from "react-redux";
import  { Button } from "reactstrap";
import {startMatch, setPlayerCount} from "../actions/MatchActions";

class StateSetup extends Component{

    onStartMatch = () =>{
        let playerIDs = [];
        this.props.player.players.map((player) => {
            playerIDs.push(player.id);
        });
        // call reducer
        this.props.startMatch(playerIDs);
    }

    onPlayerCountChange = (amount) => {
        this.props.setPlayerCount(amount);
    }

    render(){
        //console.log("render StateSetup");
        //console.log(this.props);
        return (
            <div>
                <AmountOfPlayerSelector 
                    onChange={ this.onPlayerCountChange } 
                />
                <PlayerList
                    players= {this.props.player.players}
                />
                <Button
                    onClick= {this.onStartMatch}
                >
                    start match
                </Button>
            </div>
        );
    }
}



const mapStateToProps = function(state){
    return {
        player: state.players//,
        //match: state.match
    }
}
export default connect(mapStateToProps, {startMatch, setPlayerCount})(StateSetup);