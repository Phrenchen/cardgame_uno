import React, {Component} from "react";
import  { Container, Row, Col } from "reactstrap";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import uuid from "uuid";
import CardView from "./CardView";
const PlayCardValidator = require("../../../client/src/shared/PlayCardValidator");

class CardList extends Component{
    
    componentDidMount(){
    }

    onDeleteClick = (id) =>{
        this.props.deleteItem(id);
    }

    render(){
        return (
            <Container>
                <Row>
                    {
                        this.props.cards.map((card) => {
                            let isValid = PlayCardValidator.validateCard(card, this.props.topCard);
                            if(isValid){
                                return <Col key={uuid()}>
                                    <CardView
                                        key={card.id}
                                        matchID={this.props.matchID}
                                        id={card.id}
                                        owner={this.props.owner}
                                        name={card.name}
                                        effects={card.effects}
                                        disabled={ isValid }
                                    />
                                </Col>
                            }
                        })
                    }
                </Row>
            </Container>
        );
    }
}

CardList.propTypes = {
    matchID: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
    topCard: PropTypes.object.isRequired
};



const mapStateToProps = (state) =>({
    
});



//TODO: add "playCard" action
export default connect(mapStateToProps, { /*playCard*/ } )(CardList);