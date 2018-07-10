import React, {Component} from "react";
import {connect} from "react-redux";
/**
 * class will display help information depending on the current appState
 * 
 */

 class Help extends Component{

    render(){
        console.log("help for " + this.props.appState.current);

        return (
            <div>
                halp for {this.props.appState.current}
                message:{this.props.appState.helpMessage}
            </div>
        );
    }
 }

 const mapStateToProps = (state) =>{
     appState: state.appState;
 }

 export default connect(mapStateToProps)(Help);