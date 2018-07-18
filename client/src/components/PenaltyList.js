import React, {Component} from "react";
import PropTypes from "prop-types";
import PenaltyView from "./PenaltyView";
import { Button } from "reactstrap";
import uuid from "uuid";
import { connect } from "react-redux";
import MatchHelper from "../shared/MatchHelper";
import MathHelper from "../shared/MathHelper";


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
    
    componentDidMount(){
        let delay = MathHelper.getRandomInt(1000, 2000);     // delay range : 0.5s - 1.5s
        if(!this.props.isHumanPlayer){
            this.state.autoAcceptDelayID = setTimeout(() =>{
                this.props.onAccept(this.props.match.activePlayerID);
            }, delay);
        }
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