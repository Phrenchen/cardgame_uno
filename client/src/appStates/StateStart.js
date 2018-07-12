import React, { Component } from 'react';
import {connect} from "react-redux";
import  { Button } from "reactstrap";
import {startMatch} from "../actions/MatchActions";

class StateStart extends Component{

    onStartMatch = () =>{
        this.props.startMatch(/*this.props.match.playerCount*/);        //TODO: for now every match has 5 players
    }


    render(){
        //console.log("render StateSetup");
        //console.log(this.props);
        return (
                <div className="startscreen">
                    <h1>UNO</h1>
                    <p>
                        work in progress
                        <br/>
                        5 players play on one screen.
                        <br/>
                    </p>
                    <br />
                    <br />
                    <Button
                        onClick= {this.onStartMatch}
                    >
                        start match
                    </Button>
                </div>
        );
    }
}



const mapStateToProps = (state) =>{
    return {
        match: state.match
    }
}
export default connect(mapStateToProps, {startMatch})(StateStart);