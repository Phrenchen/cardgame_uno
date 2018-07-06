import React, {Component} from "react";
import  { Container, 
    ListGroup, 
    ListGroupItem, 
    Navbar, 
    Button
} from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import uuid from "uuid";
import CardList from "./CardList";

class PlayerList extends Component{

    state = {
        toggles: [true, false, false, false, false]         // TODO: using static 5 player setup
        };           
    

    createCardList(player){
        if(player.id === this.props.match.activePlayerID){
            return (
                <div className="cardlist">
                    <CardList 
                        cards={player.cards} 
                        owner={player.id}
                    />
                </div>
            );
        }
        return null;
    }

    createPlayers(){
        let id;
        let counter = 0;

        return  this.props.match.players.map((player) => {                // WAT IS LOS? CEHCK!
            id = uuid();
            counter++;

            return(
                <CSSTransition className="playerPanel" key={id} timeout={500} classNames="fade">
                    <ListGroupItem>
                        <Navbar color="dark" dark expand="sm" className="mb-5">
                            <Container>
                                <Button>Player {counter}</Button>
                                    {
                                        this.createCardList(player) // will only render something if the player is active
                                    }
                            </Container>
                        </Navbar>
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
    match: PropTypes.object.isRequired
};

const mapStateToProps = (state) =>({
    match: state.match
});



export default connect(mapStateToProps )(PlayerList);