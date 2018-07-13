import React, {Component} from "react";
import PropTypes from "prop-types";
import uuid from "uuid";
import CardView from "./CardView";
const PlayCardValidator = require("../../../client/src/shared/PlayCardValidator");

class CardList extends Component{
    state = {
        id: uuid()
    }


    setPosition(){
        /*
        let lesserSide = window.innerWidth < window.innerHeight ? 
                            window.innerWidth : 
                            window.innerHeight;
        let screenCenterX = window.innerWidth * .5;
        let screenCenterY = window.innerHeight * .5;
        */
        let position = {x: 50, y: 20};
        let containerDiv = document.getElementById(this.state.id);
        if(!containerDiv){
            //throw new Error("CardList could not position itself");
            return;
        }
        containerDiv.style.position = "absolute";
        containerDiv.style.zIndex =this.props.positionInRow;
        containerDiv.style.left = position.x + "px";
        containerDiv.style.bottom = position.y + "px";
    }
    //_--------------------
    componentDidMount(){
        this.setPosition();
        
        window.addEventListener("resize", () =>{
            this.setPosition();
        });
    }

    render(){
        return (
            <div id={this.state.id}>
                    Player Cards
                    {
                        this.props.cards.map((card) => {
                            let isValid = PlayCardValidator.validateCard(card, this.props.topCard, this.props.selectedColor);
                            if(isValid){
                                return <div key={uuid()}>
                                    <CardView
                                        key={card.id}
                                        onColorSelection={this.props.onColorSelection}
                                        matchID={this.props.matchID}
                                        owner={this.props.owner}
                                        card={card}
                                        selectedColor={this.props.selectedColor}
                                    />
                                </div>
                            }
                        })
                    }
            </div>
        );
    }
}

CardList.propTypes = {
    matchID: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
    topCard: PropTypes.object.isRequired,
    onColorSelection: PropTypes.func,
    selectedColor: PropTypes.string
};

export default CardList;