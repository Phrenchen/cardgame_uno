import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerList from '../components/PlayerList';
import PlayedCardStack from '../components/PlayedCardStack';
import PenaltyList from '../components/PenaltyList';

class StateMatch extends Component{

    displayPenaltyDialog(){
        if(this.props.match.penalties && this.props.match.penalties.length > 0){
            return <PenaltyList 
                penalties={this.props.match.penalties} 
                activePlayerID={this.props.match.activePlayerID}
            />
        }

        return null;
    }

    render(){


        return (
            <div className="match_grid">
                 <PlayerList topCard= {this.props.match.playedCards[this.props.match.playedCards.length - 1]} />
                 <PlayedCardStack playedCards= {this.props.match.playedCards} />
                 { this.displayPenaltyDialog() }
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