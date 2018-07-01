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
import {addCard} from "../actions/ItemActions";
import {addPlayer} from "../actions/PlayerActions";

class ItemModal extends Component{
    state = {
        modal: false,
        name: ""
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

        //const newItem = {
          //  name: this.state.name
        //};

        // add item via addItem action
        //this.props.addItem(newItem);

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
                    Add Card to Player
                </Button>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                >
                    <ModalHeader
                        toggle={this.toggle}

                    >
                        Add to card list
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="item">
                                    Card
                                </Label>
                                <Input 
                                    type="text"
                                    name="name"
                                    id="item"
                                    placeholder="set card name"
                                    onChange={this.onChange}
                                />
                                <Button
                                    color="dark"
                                    style={{marginTop:"2rem"}}
                                    block
                                >
                                    Add card
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
    item: state.item
});

export default connect(mapStateToProps, {addCard, addPlayer})(ItemModal);