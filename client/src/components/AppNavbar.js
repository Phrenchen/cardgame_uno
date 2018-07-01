import React, {Component} from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Container,
    Button
} from "reactstrap";
import {connect} from "react-redux";
import {deleteAllPlayers} from "../actions/PlayerActions";


class AppNavbar extends Component{
    state = {
        isOpen: false
    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    onDeleteAllPlayers =() => {
        // for each player: delete serverside
        console.log(this.props.players);
        this.props.deleteAllPlayers(this.props.players);
    }

    render(){
        return (
            <div>
                <Navbar color="dark" dark expand="sm" className="mb-5">
                    <Container>
                        <NavbarBrand href="/">Player List</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml_auto" navbar>
                                <NavItem>
                                    <Button
                                        onClick={this.onDeleteAllPlayers}
                                    >delete all players</Button>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = state =>({
    item: state.item,
    players: state.players
});

export default connect(mapStateToProps, {deleteAllPlayers})(AppNavbar);
//export default AppNavbar;