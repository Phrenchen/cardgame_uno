import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerList from '../components/PlayerList';
import PlayedCardStack from '../components/PlayedCardStack';

class StateMatch extends Component{

    render(){
        return (
            <div className="match_grid">
                 <PlayerList topCard= {this.props.match.playedCards[this.props.match.playedCards.length - 1]} />
                 <PlayedCardStack playedCards= {this.props.match.playedCards} />
            </div>
        );
    }
}

const mapStateToProps = function(state){
    return {
        match: state.match
    }
}
export default connect(mapStateToProps)(StateMatch);