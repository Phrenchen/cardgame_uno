import React, {Component} from "react";
import PropTypes from "prop-types";
import CardList from "./CardList";
import MatchHelper from "../shared/MatchHelper";
import MathHelper from "../shared/MathHelper";
import {connect} from "react-redux";
import uuid from "uuid";
import { CardBody, CardTitle } from "reactstrap";

/**
 * positions itself on a circle around screen center
 */
class Player extends Component{
    state={
        id: uuid()
    };
    
    setPosition(){
        let lesserSide = window.innerWidth < window.innerHeight ? 
                            window.innerWidth : 
                            window.innerHeight;
        let screenCenterX = window.innerWidth * .5;
        let screenCenterY = window.innerHeight * .5;

        let radius = lesserSide * .3;
        let origin = {x: screenCenterX, y: screenCenterY};
        let position = MathHelper.calculatePositionsOnCircle(this.props.match.players.length, radius, origin)[this.props.positionInRow - 1];
        
        let containerDiv = document.getElementById(this.state.id);
        if(!containerDiv){
            console.log("could not find containerdiv to reposition");
            return;
        }
        containerDiv.style.position = "absolute";
        containerDiv.style.zIndex =this.props.positionInRow;
        containerDiv.style.left = position.x + "px";
        containerDiv.style.top = position.y + "px";
    }

    getPlayerName(){
        const player = MatchHelper.getPlayerByID(this.props.match.players, this.props.id);
        let name = player.name;
        
        name += "(" + player.cards.length + ")";
        name += (this.props.id === this.props.match.activePlayerID) ? " (*)" : ""

        return name;
    }

    //-------------------
    componentDidMount(){
        this.setPosition();
        
        window.addEventListener("resize", () =>{
            this.setPosition();
        });
    }

    render(){
        return (
            <div  id={this.state.id}>
                <CardBody>
                    <CardTitle>{this.getPlayerName()}</CardTitle>
                </CardBody>
            </div>
        );
    }
}

Player.propTypes = {
    id:PropTypes.string.isRequired,
    positionInRow:PropTypes.number.isRequired,
    match:PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        match: state.match
    }
};
export default connect(mapStateToProps)(Player);