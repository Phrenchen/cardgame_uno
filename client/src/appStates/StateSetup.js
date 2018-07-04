import React, { Component } from 'react';
import PlayerList from '../components/PlayerList';
import PlayerModal from '../components/PlayerModal';
import {connect} from "react-redux";
import  { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import {startMatch} from "../actions/MatchActions";

class StateSetup extends Component{

    onStartMatch = () =>{
        let playerIDs = [];
        this.props.player.players.map((player) => {
            playerIDs.push(player.id);
        });
        // call reducer
        this.props.startMatch(playerIDs);
    }


    render(){
        return (
            <div>
                <PlayerModal/>
                <PlayerList/>
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
        player: state.players
    }
}
export default connect(mapStateToProps, {startMatch})(StateSetup);