import React, { Component } from 'react';
import {STATE_START, STATE_MATCH} from "./AppState";
import StateStart from "./StateStart";
import StateMatch from "./StateMatch";
import {connect} from "react-redux";

class AppStateMachine extends Component{

    // render functions
    renderStartState(){
        return <StateStart/>
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
            case STATE_START:
            default:
                renderFunction = () => { return this.renderStartState() };
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