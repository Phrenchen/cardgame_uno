import React, {Component} from "react";
import  { Container, 
    ListGroup, 
    ListGroupItem, 
    Collapse,
    Navbar, 
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem
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
    
    /*
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    */

    createPlayers(){
        let playerCount = this.props.match.players.length;
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
                        <Navbar color="dark" dark expand="sm" className="mb-5">
                            <Container>
                                <NavbarBrand href="/">Player {index + 1}</NavbarBrand>
                                <NavbarToggler onClick={ () =>{
                                        let toggles = this.state.toggles.slice();

                                        toggles.map((t, id) => {
                                            toggles[id] = index === id;
                                        });
                                        
                                        this.setState({
                                            toggles: toggles
                                        });
                                    }} />
                                <Collapse isOpen={this.state.toggles[index]} navbar>
                                    <Nav className="ml_auto" navbar>
                                        <NavItem>
                                            <CardList cards={this.props.match.players[index].cards} />
                                        </NavItem>
                                    </Nav>
                                </Collapse>
                            </Container>
                        </Navbar>
                    </ListGroupItem>
                </CSSTransition>
            )});
    }

    /*
    
    <Button
                                                onClick={this.onDeleteAllPlayers}
                                            >delete all players</Button>
                                            <Button
                                                onClick={this.onStartMatch}
                                            >start match</Button>
    */

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