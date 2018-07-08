import React, {Component} from "react";
import PropTypes from "prop-types";
import PenaltyView from "./PenaltyView";
import { Button } from "reactstrap";
import uuid from "uuid";


class PenaltyList extends Component{

    getPenaltySet(penaltySet){
        return (
            <PenaltyView
                key={uuid()}
                reason={penaltySet.reason}
                cards={penaltySet.cards}
                penaltyID={penaltySet.id}
                activePlayerID={this.props.activePlayerID}
                matchID={this.props.matchID}
            />
        );
    }

    render(){
        return (
            <div className="penaltyList">
                <h2>PENALTY CARDS</h2>
                {
                    this.props.penalties.map((penaltySet) =>{
                        return this.getPenaltySet(penaltySet);
                    })
                }
                <Button
                    onClick={() => {
                        this.props.onAccept(this.props.activePlayerID);
                    }}
                >OK</Button>
            </div>
        );
    }


}


PenaltyList.propTypes = {
    penalties: PropTypes.array.isRequired,
    activePlayerID: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired
};


export default PenaltyList;