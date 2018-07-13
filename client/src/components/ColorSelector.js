import React, {Component} from "react";
import PropTypes from "prop-types";

/**
 * contains 4 color buttons which send (C2S) playCard(cardID, color)
 * grid 
 */
class ColorSelector extends Component{
    render(){
        return (
            <div className="colorselector_grid">
                <h3 className="colorSelectorTitle">Select a color</h3>
                <button>red</button>
                <button>green</button>
                <button>blue</button>
                <button>yellow</button>
            </div>
        );
    }
}

export default ColorSelector;