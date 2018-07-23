import React, {Component} from "react";
import PropTypes from "prop-types";
import PenaltyView from "./PenaltyView";
import { Button } from "reactstrap";
import uuid from "uuid";
import { connect } from "react-redux";
import MatchHelper from "../shared/MatchHelper";


class PenaltyList extends Component{

    state = {
        autoAcceptDelayID: -1
    }

    createPenaltySet(penaltySet){
        return (
            <PenaltyView
                key={uuid()}
                reason={penaltySet.reason}
                cards={penaltySet.cards}
                penaltyID={penaltySet.id}
                activePlayerID={this.props.match.activePlayerID}
                matchID={this.props.match.id}
                selectedColor={this.props.match.selectedColor}
            />
        );
    }
    
    checkAutoAcceptingPenalties(){
        let delay = 1000;       // delay 1 second
        if(!this.props.isHumanPlayer){
            //this.props.onAccept(this.props.match.activePlayerID);
            
            this.state.autoAcceptDelayID = setTimeout(() =>{
                this.props.onAccept(this.props.match.activePlayerID);
            }, delay);
            
        }
    }

    /* need this if 2 penalty dialogs follow each other: 
    1. player gets a penalty
    2. has no playable card
    3. switch to next player who receives a no-valid-card penalty

    */
    componentDidUpdate(){
        this.checkAutoAcceptingPenalties();
    }
    
    // only executed from non-visible to visible state 
    componentDidMount(){
        this.checkAutoAcceptingPenalties();
    }

    render(){
        return (
            <div className="penaltyList centered"
                onClick={() => {
                    if(this.props.isHumanPlayer){
                        this.props.onAccept(this.props.match.activePlayerID);
                    }
                }}
            >
                <h2>PENALTY CARDS</h2>
                <h4>{MatchHelper.getActivePlayer(this.props.match).name}</h4>
                {
                    this.props.match.penalties.map((penaltySet) =>{
                        return this.createPenaltySet(penaltySet);
                    })
                }
                <Button>OK</Button>
            </div>
        );
    }


}

const mapStateToProps = (state) =>{
    return {
        match: state.match  
    };
}

PenaltyList.propTypes = {
    onAccept: PropTypes.func.isRequired,
    isHumanPlayer: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(PenaltyList);