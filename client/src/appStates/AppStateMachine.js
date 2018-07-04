import React, { Component } from 'react';
import {STATE_SETUP, STATE_MATCH} from "./AppState";
import StateSetup from "./StateSetup";
import StateMatch from "./StateMatch";
import {connect} from "react-redux";

class AppStateMachine extends Component{

    // render functions
    renderSetupState(){
        return <StateSetup/>
    }

    renderMatchState(){
        return <StateMatch />
    }

    render(){
        let renderFunction = null;

        switch(this.props.appState.current){
            case STATE_MATCH:
                renderFunction = this.renderMatchState;
                break;
            case STATE_SETUP:
            default:
                renderFunction = () => { return this.renderSetupState() };
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