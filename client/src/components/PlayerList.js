import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Player from "./Player";

class PlayerList extends Component{

    
    createPlayer(player, index){
        return (
            <Player
                key={player.id}
                id={player.id}
                positionInRow={index}
            />
        );
    }

    render(){
        let counter = 0;
        return (
            <div className="playerPanel">
                    {
                        this.props.match.players.map((player) => {
                            return this.createPlayer(player, ++counter);  
                        })
                    }
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
export default connect(mapStateToProps)(PlayerList);