import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import CardView from "./CardView";
import uuid from "uuid";
import MatchHelper from "../shared/MatchHelper";
import PlayCardValidator from "../shared/PlayCardValidator";

class PlayedCardStack extends Component{

    state = {
        cardCountToRender: 1,
        topIndicatorID: uuid(),
        bottomIndicatorID: uuid()
    }

    componentDidMount(){
        let handcardDiv = document.getElementsByClassName("playedCards")[0];
        if(!handcardDiv){
            return;
        }
        // set css column variables for PlayedCards
        let columnCount = this.props.playedCards.length < this.state.cardCountToRender ?
                            this.props.playedCards.length :
                            this.state.cardCountToRender;
        handcardDiv.style.setProperty("--playedCardCount", columnCount);

        this.colorizeIndicator(this.state.topIndicatorID);
        this.colorizeIndicator(this.state.bottomIndicatorID);
    }

    colorizeIndicator(id){
        let colorIndicator = document.getElementById(id);
        if(!colorIndicator){
            console.log("woooo:(")
            return;
        }
        let color;
        let topCard = MatchHelper.getTopCard(this.props.match);
        
        if( PlayCardValidator.isJoker(topCard) ){
            color = this.props.match.selectedColor.split("_")[1];
        }
        else{
            color = MatchHelper.getColor(topCard);
        }
        colorIndicator.style.backgroundColor = color;
    }


    getTopIndicator(){
        return this.getIndicator(this.state.topIndicatorID, "effectIndicatorVertical effectIndicatorTop");
    }

    getBottomIndicator(){
        return this.getIndicator(this.state.bottomIndicatorID, "effectIndicatorVertical effectIndicatorBottom");
    }

    getIndicator(pID, pClassName){
        return (
            <div className={pClassName} id={pID}>
            </div>
        );
    }
    render(){
        let counter = 0;
        let index = this.props.match.playedCards.length - this.state.cardCountToRender;
        if(index < 0){
            index = 0;
        }

        return (
                <div className="playedCards">
                    {this.getTopIndicator()}
                    {
                        this.props.match.playedCards.map((card) =>{
                            if(counter < this.state.cardCountToRender){                       // only render last 10 played cards
                                return this.createCard(this.props.match.playedCards[index++], ++counter);
                            }
                            else{
                                return null;
                            }
                        })
                    }
                    {this.getBottomIndicator()}
                </div>
        );  
    }

    createCard(card, index){
        return (
            <CardView
                key={uuid()}
                matchID={this.props.matchID}
                owner={"-1"}      // has been played. no matter who played it
                positionInRow={index}
                card={card}
                selectedColor={this.props.selectedColor}
                isPlayable={false}
            />
        );
    }
}

PlayedCardStack.propTypes = {
    match:PropTypes.object.isRequired
};



const mapStateToProps = (state) =>{
    return {
        match: state.match
    }
}
export default connect(mapStateToProps)(PlayedCardStack);