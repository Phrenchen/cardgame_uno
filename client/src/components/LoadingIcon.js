import React, {Component} from "react";
import { connect } from "react-redux";
import MatchHelper from "../shared/MatchHelper";

const Loading = require('react-loading-animation');


class LoadingIcon extends Component{
    
    render(){
        let isLoading = this.props.isWaitingForServer;
        
        if(this.props.match1.players.length > 0){
            isLoading = !MatchHelper.activePlayerIsHuman(this.props.match1);
        }
        
        return (
            <Loading isLoading={isLoading} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        match1: state.match,
        isWaitingForServer: state.appState.isWaitingForServer

    }
};

export default connect(mapStateToProps)(LoadingIcon);