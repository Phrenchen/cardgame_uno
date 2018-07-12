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
        // we need twice the amount of positions to fill bottom half of circle (first element is at 3 o´clock)
        let amountOfPositions = this.props.match.players.length * 1;        // * 2 to position all players on bottom half of circle
        let position = MathHelper.calculatePositionsOnCircle(amountOfPositions, radius, origin)[this.props.positionInRow - 1];
        
        let containerDiv = document.getElementById(this.state.id);
        if(!containerDiv){
            //throw new Error("Player could not position itself");
            return;
        }
        containerDiv.style.position = "absolute";
        containerDiv.style.zIndex = this.props.positionInRow;
        containerDiv.style.left = position.x + "px";
        containerDiv.style.top = position.y + "px";
    }

    getPlayerName = () =>{
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
            try{
                this.setPosition();
            }
            catch(e){
                //console.log("error setting player positions after resize");
            }
        });
    }

    getClassName(){
        return this.props.id === this.props.match.activePlayerID ? 
            "playerIconSmallActive" :
            "playerIconSmall"
    }

    render(){
        const player = MatchHelper.getPlayerByID(this.props.match.players, this.props.id);

        return (
            <div id={this.state.id} >
                {player.cards.length}
                <img 
                    className={this.getClassName()} 
                    src={MatchHelper.getPlayerByID(this.props.match.players, 
                                                    this.props.id).imageUrl
                        } 
                />
            </div>
        );
        /*
                <CardBody>
                    <CardTitle>{this.getPlayerName()}</CardTitle>
                </CardBody>
        */
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