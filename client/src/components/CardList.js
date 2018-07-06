import React, {Component} from "react";
import  { Container, Row, Col } from "reactstrap";
import {connect} from "react-redux";
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

        return (
            <Container>
                <Row>
                    {
                        this.props.cards.map((card) => {
                            return <Col key={uuid()}>
                                <CardView
                                    key={card.id}
                                    id={card.id}
                                    owner={this.props.owner}
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
    owner: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired
};



const mapStateToProps = (state) =>({
    
});



//TODO: add "playCard" action
export default connect(mapStateToProps, { /*playCard*/ } )(CardList);