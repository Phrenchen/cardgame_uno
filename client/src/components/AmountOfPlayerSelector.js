import React, {Component} from "react";
import PropTypes from "prop-types";
import  { ButtonGroup, Button } from "reactstrap";

class AmountOfPlayerSelector extends Component{

    onValueChange = (value) =>{
        let id = value.split("_")[1];
        this.props.onChange(id);
    }

    render(){
        return (
            <ButtonGroup>
                <Button id="playercount_1"
                    onClick={ (e) => {
                        this.onValueChange(e.target.id );
                    }}
                >1</Button>
                <Button id="playercount_2"
                    onClick={ (e) => {
                        this.onValueChange(e.target.id );
                    }}
                >2</Button>
                <Button id="playercount_3"
                    onClick={ (e) => {
                        this.onValueChange(e.target.id );
                    }}
                >3</Button>
                <Button id="playercount_4"
                    onClick={ (e) => {
                        this.onValueChange(e.target.id );
                    }}
                >4</Button>
                <Button id="playercount_5"
                    onClick={ (e) => {
                        this.onValueChange(e.target.id );
                    }}
                >5</Button>
            </ButtonGroup>
        );

    }
}

AmountOfPlayerSelector.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default AmountOfPlayerSelector;