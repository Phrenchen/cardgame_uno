import React, { Component } from 'react';
import {connect} from "react-redux";

class StateMatch extends Component{

    render(){
        console.log(this.props.appState);
        return (
            <div>
                 match
            </div>
        );
    }
}

const mapStateToProps = function(state){
    return {
    }
}
export default connect(mapStateToProps)(StateMatch);