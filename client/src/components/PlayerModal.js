import React, {Component} from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input
} from "reactstrap";
import {connect} from "react-redux";
import {addPlayer} from "../actions/PlayerActions";

class PlayerModal extends Component{
    state = {
        modal: false,
        name: "empty player name"
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    onChange = (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onSubmit = (e) =>{
        e.preventDefault();

        const newPlayer = {
            name: this.state.name
        };
        this.props.addPlayer(newPlayer);

        // close Modal
        this.toggle();
    }

    render(){
        return (
            <div>
                <Button
                    color="dark"
                    style={{marginBottom: "2rem"}}
                    onClick={this.toggle}
                >
                    Add Player
                </Button>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                >
                    <ModalHeader
                        toggle={this.toggle}

                    >
                        Add to player list
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="item">
                                    Player
                                </Label>
                                <Input 
                                    type="text"
                                    name="name"
                                    id="item"
                                    placeholder="set player name"
                                    onChange={this.onChange}
                                />
                                <Button
                                    color="dark"
                                    style={{marginTop:"2rem"}}
                                    block
                                >
                                    Add Player
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
                
        );
    }
}

const mapStateToProps = state =>({
   // item: state.item
});

export default connect(mapStateToProps, {addPlayer})(PlayerModal);