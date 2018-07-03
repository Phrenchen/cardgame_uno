import React, { Component } from 'react';
import {PLAYER_SETUP} from "./AppState";
import PlayerSetupState from "./PlayerSetupState";
import {connect} from "react-redux";

class AppStateMachine extends Component{

    // render functions
    renderPlayerSetup(){
        return <PlayerSetupState/>
    }


    render(){
        let renderFunction;

        switch(this.props.appState){
            case PLAYER_SETUP:
            default:
                //renderFunction = this.renderPlayerSetup;
                renderFunction = () => { return this.renderPlayerSetup() };
                break;
        }

        if(renderFunction){
            return (
                <div>
                    { renderFunction() }
                </div>
            );
        }

    }
}

const mapStateToProps = function(state){
    return {
        appState:state.appState
    };
}
export default connect(mapStateToProps)(AppStateMachine);