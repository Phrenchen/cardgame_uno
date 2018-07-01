import React, {Component} from "react";
import  { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {connect} from "react-redux";
import {getPlayers, deletePlayer} from "../actions/PlayerActions";
import PropTypes from "prop-types";

class PlayerList extends Component{
    
    componentDidMount(){
        this.props.getPlayers();
    }

    onDeleteClick = (id) =>{
        this.props.deletePlayer(id);
    }

    render(){
        const { players } = this.props.items;       // WIE WAS PASSIERT HIER??? CHECK IT!
        //console.log(items);
        return (
            <Container>
                <ListGroup>
                    <TransitionGroup className="shopping-list">
                        {
                            players.map(({_id, name}) => {                // WAT IS LOS? CEHCK!
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

PlayerList.propTypes = {
    getPlayers: PropTypes.func.isRequired,
    items: PropTypes.object.isRequired
};

const mapStateToProps = (state) =>({
    items: state.players
});



export default connect(mapStateToProps, {getPlayers, deletePlayer} )(PlayerList);