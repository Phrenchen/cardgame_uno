import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import PenaltyView from "./PenaltyView";
import { Button } from "reactstrap";
import uuid from "uuid";
import PenaltyList from "./PenaltyList";
import {acceptPenalties} from "../actions/MatchActions"

class AdditionalMatchInfos extends Component{

    createMessage(){
        if(this.props.message != ""){
            return (
                <p>{this.props.message}</p>
            );
        }
        return null;
    }

    createPenalties(){
        if(this.props.match.penalties.length > 0){
            return <PenaltyList 
                activePlayerID= {this.props.match.activePlayerID}
                penalties= {this.props.match.penalties}
                onAccept= {() =>{
                    console.log("calling action to accept penalties");
                    this.props.acceptPenalties(this.match.id);
                }}
            />
        }
        return null;
    }


    render(){
        return (
            <div>
                {this.createMessage()}
                {this.createPenalties()}
            </div>
        );
    }
}

AdditionalMatchInfos.propTypes = {
    message: PropTypes.string,
    penalties: PropTypes.array
};

const mapStateToProps = function(state){
    return {
        match: state.match
    };
}

export default connect(mapStateToProps, {acceptPenalties})(AdditionalMatchInfos);