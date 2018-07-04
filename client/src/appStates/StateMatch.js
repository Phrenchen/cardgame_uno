import React, { Component } from 'react';
import PlayerList from '../components/PlayerList';
import PlayerModal from '../components/PlayerModal';
import {connect} from "react-redux";
import  { Container, ListGroup, ListGroupItem, Button } from "reactstrap";

class StateMatch extends Component{

    onStartMatch(){
        // call reducer
    }


    render(){
        console.log(this.props.appState);
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
        appState: state.appState
    }
}
export default connect(mapStateToProps)(StateMatch);