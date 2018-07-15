import React, {Component} from "react";
import PropTypes from "prop-types";
import PenaltyView from "./PenaltyView";
import { Button } from "reactstrap";
import uuid from "uuid";
import { connect } from "react-redux";
import MatchHelper from "../shared/MatchHelper";


class PenaltyList extends Component{

    componentDidMount(){
        let container = document.getElementsByClassName("penaltyList")[0];
        if(!container){
            return;
        }
        let width = container.offsetWidth * .5 * -1;
        let height = container.offsetHeight * .5 * -1;
        console.log(width + "/" + height);
        container.style.setProperty("--containerOffsetX", width);
        container.style.setProperty("--containerOffsetY", height);
    }


    createPenaltySet(penaltySet){
        console.log(this.props.match.id);
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

    render(){
        return (
            <div className="penaltyList centered">
                <h2>PENALTY CARDS</h2>
                <h4>{MatchHelper.getActivePlayer(this.props.match).name}</h4>
                {
                    this.props.match.penalties.map((penaltySet) =>{
                        return this.createPenaltySet(penaltySet);
                    })
                }
                <Button
                    onClick={() => {
                        this.props.onAccept(this.props.match.activePlayerID);
                    }}
                >OK</Button>
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
};

export default connect(mapStateToProps)(PenaltyList);