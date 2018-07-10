import React, {Component} from "react";
import PropTypes from "prop-types";
import CardList from "./CardList";
import MatchHelper from "../shared/MatchHelper";
import MathHelper from "../shared/MathHelper";
import {connect} from "react-redux";
import uuid from "uuid";
import { CardBody, CardTitle } from "reactstrap";

class Player extends Component{
    constructor(props){
        super(props);
        this.state={
            id: uuid()
        };
    }

    createCardList(id){
        if(id === this.props.match.activePlayerID){
            let cards = MatchHelper.getPlayerByID(id).cards;
            return (
                <div>
                    <CardList 
                        matchID={this.props.match.id}
                        cards={cards} 
                        owner={id}
                        topCard={this.props.match.playedCards[this.props.match.playedCards.length - 1]}
                    />
                </div>
            );
        }
        return null;
    }
    //----------------
    
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
        containerDiv.style.position = "absolute";
        containerDiv.style.zIndex =this.props.positionInRow;
        containerDiv.style.left = position.x + "px";
        containerDiv.style.top = position.y + "px";
    }
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
                    <CardTitle>{MatchHelper.getPlayerByID(this.props.match.players, this.props.id).name}</CardTitle>
                </CardBody>
                {this.createCardList()}
            </div>
        );
    }

}

Player.propTypes = {
    id:PropTypes.string.isRequired,
    positionInRow:PropTypes.number.isRequired,
    match:PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    match: state.match
});
export default connect(mapStateToProps)(Player);