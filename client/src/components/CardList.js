import React, {Component} from "react";
import  { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {connect} from "react-redux";
import {getItems, deleteItem} from "../actions/ItemActions";
import {getPlayers} from "../actions/PlayerActions";
import PropTypes from "prop-types";

class CardList extends Component{
    
    componentDidMount(){
        this.props.getItems();
        //this.props.getPlayers();
    }

    onDeleteClick = (id) =>{
        this.props.deleteItem(id);
    }

    render(){
        const { items } = this.props.items;       // WIE WAS PASSIERT HIER??? CHECK IT!
        //console.log(items);
        return (
            <Container>
                <ListGroup>
                    <TransitionGroup className="shopping-list">
                        {
                            items.map(({_id, name}) => {                // WAT IS LOS? CEHCK!
                                return(
                                <CSSTransition key={_id} timeout={500} classNames="fade">
                                    <ListGroupItem>
                                        <Button
                                            className="remove-btn"
                                            color="danger"
                                            size="sm"
                                            onClick={this.onDeleteClick.bind(this, _id)}
                                        >
                                        &times;
                                        </Button>
                                        {name}
                                    </ListGroupItem>
                                </CSSTransition>
                            )})
                        }
                    </TransitionGroup>
                </ListGroup>
            </Container>
        );
    }
}

CardList.propTypes = {
    getItems: PropTypes.func.isRequired,
    //getPlayers: PropTypes.func.isRequired,
    items: PropTypes.object.isRequired
};

const mapStateToProps = (state) =>({
    items: state.item
});



export default connect(mapStateToProps, {getItems, getPlayers, deleteItem} )(CardList);