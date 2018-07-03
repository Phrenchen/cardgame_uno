import React, { Component } from 'react';
import PlayerList from '../components/PlayerList';
import PlayerModal from '../components/PlayerModal';
import {connect} from "react-redux";

class PlayerSetupState extends Component{
    render(){
        console.log(this.props.appState);
        return (
            <div>
                <PlayerModal/>
                <PlayerList/>
            </div>
        );
    }
}

const mapStateToProps = function(state){
    return {
        appState: state.appState
    }
}
export default connect(mapStateToProps)(PlayerSetupState);