import React, { Component } from 'react';
import {STATE_START, STATE_MATCH, STATE_GAME_OVER} from "./AppState";
import StateStart from "./StateStart";
import StateMatch from "./StateMatch";
import StateGameOver from "./StateGameOver";
import {connect} from "react-redux";

class AppStateMachine extends Component{

    // render functions
    renderStartState(){
        return <StateStart/>
    }

    renderMatchState(){
        return <StateMatch />
    }

    renderGameOverState(){
        return <StateGameOver />
    }

    render(){
        let renderFunction = null;

        switch(this.props.appState.current){
            case STATE_MATCH:
                renderFunction = this.renderMatchState;
                break;
            case STATE_GAME_OVER:
                renderFunction = this.renderGameOverState;
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

const mapStateToProps = (state) => {
    return {
        appState:state.appState
    };
}
export default connect(mapStateToProps)(AppStateMachine);