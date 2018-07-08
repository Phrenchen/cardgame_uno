import React, {Component} from "react";
import PropTypes from "prop-types";
import uuid from "uuid";
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, CardLink } from "reactstrap";
import { playCard } from "../actions/MatchActions";
import {connect} from "react-redux";
class CardView extends Component {
    
    state={
        id: uuid(),
        style: ""
    }

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

        containerDiv.style.backgroundColor = backgroundColor;
        containerDiv.style.color = color;
    }

    componentDidMount(){
        this.setColor(this.props.effects);
    }

    render(){
        return (
            <Card className="card" id={this.state.id} onClick={() =>{
                if(this.props.playCard){
                    this.props.playCard(this.props.matchID, this.props.owner, this.props.id);
                }
            }} >
                <CardBody>
                    <CardTitle>{this.props.name}</CardTitle>
                        </CardBody>
                            <img width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
                        <CardBody>
                </CardBody>
            </Card>
        );
    }
}

CardView.propTypes = {
    matchID: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    effects: PropTypes.array.isRequired,
    playCard: PropTypes.func
};

const mapStateToProps = (state) =>({
});

export default connect(mapStateToProps, {playCard} )(CardView);