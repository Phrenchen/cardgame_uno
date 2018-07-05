import React, {Component} from "react";
import  { Container, Row, Col } from "reactstrap";
import {connect} from "react-redux";
import {getItems, deleteItem} from "../actions/ItemActions";
import {getPlayers} from "../actions/PlayerActions";
import PropTypes from "prop-types";
import uuid from "uuid";
import CardView from "./CardView";

class CardList extends Component{
    
    componentDidMount(){
    }

    onDeleteClick = (id) =>{
        this.props.deleteItem(id);
    }

    render(){
        //console.log(items);
        return (
            <Container>
                <Row>
                    {
                        this.props.cards.map((card) => {
                            return <Col key={uuid()}>
                                <CardView
                                    key={card.id}
                                    id={card.id}
                                    name={card.name}
                                    effects={card.effects}
                                />
                            </Col>
                        })
                    }
                </Row>
            </Container>
        );
    }
}

CardList.propTypes = {
    cards: PropTypes.array.isRequired
};

const mapStateToProps = (state) =>({
    
});



//TODO: add "playCard" action
export default connect(mapStateToProps, { /*playCard*/ } )(CardList);