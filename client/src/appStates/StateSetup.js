import React, { Component } from 'react';
import PlayerList from '../components/PlayerList';
import AmountOfPlayerSelector from '../components/AmountOfPlayerSelector';
//import PlayerModal from '../components/PlayerModal';
import {connect} from "react-redux";
import  { Button } from "reactstrap";
import {startMatch, setPlayerCount} from "../actions/MatchActions";
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';

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
        return (
            <div>
                <AmountOfPlayerSelector 
                    onChange={ this.onPlayerCountChange } 
                />
                <PlayerList/>
                <Button
                    onClick= {this.onStartMatch}
                >
                    start match
                </Button>
            </div>
        );
                /*
                <PlayerModal/>
                <PlayerList/>
                */
    }
}



const mapStateToProps = function(state){
    return {
        player: state.players
    }
}
export default connect(mapStateToProps, {startMatch, setPlayerCount})(StateSetup);