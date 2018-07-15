import React, {Component} from "react";
import PropTypes from "prop-types";
import EffectColor from "../shared/EffectColor";


/**
 * contains 4 color buttons which send (C2S) playCard(cardID, color)
 * grid 
 */
class ColorSelector extends Component{
    componentDidMount(){
        let container = document.getElementsByClassName("colorselector_grid")[0];
        if(!container){
            return;
        }
        let width = container.offsetWidth * .5 * -1;
        let height = container.offsetHeight * .5 * -1;
        console.log(width + "/" + height);
        container.style.setProperty("--containerOffsetX", width);
        container.style.setProperty("--containerOffsetY", height);
    }

    render(){
        return (
            <div className="colorselector_grid centered">
                <h3 className="colorSelectorTitle">Select a color</h3>
                
                <button 
                    className="btn_select_color_red"
                    onClick={()=>{
                        this.props.playCard(this.props.matchID, this.props.activePlayerID, this.props.cardID, EffectColor.RED);
                    }}
                ></button>
                <button 
                    className="btn_select_color_green"
                    onClick={()=>{
                        this.props.playCard(this.props.matchID, this.props.activePlayerID, this.props.cardID, EffectColor.GREEN);
                    }}    
                ></button>
                <button 
                    className="btn_select_color_blue"
                    onClick={()=>{
                        this.props.playCard(this.props.matchID, this.props.activePlayerID, this.props.cardID, EffectColor.BLUE);
                    }}
                ></button>
                <button 
                    className="btn_select_color_yellow"
                    onClick={()=>{
                        this.props.playCard(this.props.matchID, this.props.activePlayerID, this.props.cardID, EffectColor.YELLOW);
                    }}
                ></button>
            </div>
        );
    }
}

ColorSelector.propTypes = {
    matchID: PropTypes.string.isRequired,
    activePlayerID: PropTypes.string.isRequired,
    playCard: PropTypes.func.isRequired,
    cardID: PropTypes.string.isRequired
}

export default ColorSelector;