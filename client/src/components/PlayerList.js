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
                <div>
                    <CardList 
                        matchID={this.props.match.id}
                        cards={player.cards} 
                        owner={player.id}
                        topCard={this.props.match.playedCards[this.props.match.playedCards.length - 1]}
                    />
                </div>
            );
        }
        return null;
    }

    createPlayers(){
        let counter = 0;

        return  this.props.match.players.map((player) => {                // WAT IS LOS? CEHCK!
            counter++;

            return(
                <div key={uuid()}>
                    <ListGroupItem >
                        <Navbar color="dark" dark expand="sm" className="mb-5">
                            <Container>
                                <Button>Player {counter + " (" + player.cards.length + " )"}</Button>
                                    {
                                        this.createCardList(player) // will only render something if the player is active
                                    }
                            </Container>
                        </Navbar>
                    </ListGroupItem>
                </div>
            )});
    }

    render(){
        return (
            <div className="playerPanel">
                <ListGroup>
                        {
                            this.createPlayers()
                        }
                </ListGroup>
            </div>
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