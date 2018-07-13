import React, {Component} from "react";
import PropTypes from "prop-types";
import uuid from "uuid";
import { playCard } from "../actions/MatchActions";
import {connect} from "react-redux";
import MatchHelper from "../shared/MatchHelper";


class CardView extends Component {
    
    state={
        id: uuid()
    };

    // helper. MOVE somewhere clever (this rhymes wtf!?)
    setColor(effects){
        let containerDiv = document.getElementById(this.state.id);
        let color = "white";
        let backgroundColor = "black";
        
        // check if any effect is a color
        effects.map((effect) =>{
            if(effect.name.indexOf("color_") !== -1){
                backgroundColor = effect.name.split("_")[1];
                color = "black";
            }
        });

        if(this.props.positionInRow){       // attention: will not enter if position = 0!!!
            let step = 5;
            let offsetX = this.props.positionInRow * step;
            let offsetY = this.props.positionInRow * step;
            
            containerDiv.style.position = "absolute";
            containerDiv.style.zIndex =this.props.positionInRow;
            containerDiv.style.left = offsetX + "px";
            containerDiv.style.top = offsetY + "px";
        }
        else{
            //console.log("player card");
        }
        containerDiv.style.backgroundColor = backgroundColor;
        containerDiv.style.color = color;
    }

    componentDidMount(){
        this.setColor(this.props.card.effects);
    }

    getContent(){
        if(this.props.card.imageUrl){
            return (
                <div>
                <img 
                    className={"playerIconSmall"} 
                    src={this.props.card.imageUrl} 
                    />
                </div>
            );
        }
        else{
            return (
                <h3>
                    {this.props.card.name}
                </h3>
            );
        }
    }

    render(){
        return (
            <div className="card" id={this.state.id} onClick={() =>{
                if(MatchHelper.isColorChanger(this.props.card)){
                    if(this.props.onColorSelection){
                        this.props.onColorSelection(this.props.card.id);
                    }
                }
                else{
                    this.props.playCard(this.props.matchID, this.props.owner, this.props.card.id);
                }
            }} >
                {
                    this.getContent()
                }
            </div>
        );
    }
}

CardView.propTypes = {
    matchID: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    card: PropTypes.object.isRequired,

    positionInRow: PropTypes.number,
    playCard: PropTypes.func.isRequired,
    selectedColor: PropTypes.string.isRequired,
    onColorSelection: PropTypes.func
};

const mapStateToProps = (state) =>({
});

export default connect(mapStateToProps, {playCard} )(CardView);