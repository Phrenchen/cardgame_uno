import React, { Component } from 'react';
import {connect} from "react-redux";
import PlayerList from '../components/PlayerList';

class StateMatch extends Component{

    render(){
        return (
            <div>
                 <PlayerList />
            </div>
        );
    }
}

const mapStateToProps = function(state){
    return {
    }
}
export default connect(mapStateToProps)(StateMatch);