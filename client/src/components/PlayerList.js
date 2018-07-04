import React, {Component} from "react";
import  { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {connect} from "react-redux";
import {getPlayers, deletePlayer} from "../actions/PlayerActions";
import PropTypes from "prop-types";
import uuid from "uuid";

class PlayerList extends Component{
    
    componentDidMount(){
        this.props.getPlayers();
    }

    createPlayers(){
        let playerCount = this.props.match.playerCount;
        let players = new Array();
        let id;

        // looks stupid. probably is. doesn´t worry me, though :)
        for(let j=0; j<playerCount; j++){
            players.push(j);
        }

        return players.map((playerIndex, index) => {                // WAT IS LOS? CEHCK!
            id = uuid();
            return(
                <CSSTransition key={id} timeout={500} classNames="fade">
                    <ListGroupItem>
                        {"Player " + (index + 1)}
                    </ListGroupItem>
                </CSSTransition>
            )});
    }

    render(){
        return (
            <Container>
                <ListGroup>
                    <TransitionGroup className="shopping-list">
                        {
                            this.createPlayers()
                        }
                    </TransitionGroup>
                </ListGroup>
            </Container>
        );
    }
}

PlayerList.propTypes = {
    getPlayers: PropTypes.func.isRequired,
    players: PropTypes.object.isRequired
};

const mapStateToProps = (state) =>({
    players: state.players,
    match: state.match
});



export default connect(mapStateToProps, {getPlayers, deletePlayer} )(PlayerList);