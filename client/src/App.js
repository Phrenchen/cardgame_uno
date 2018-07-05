import React, { Component } from 'react';

import {Provider} from "react-redux";
import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import AppStateMachine from "./appStates/AppStateMachine";


class App extends Component {
  componentDidMount(){
    //console.log(store.getState());


    store.subscribe(() =>{
        //console.log("************** STATE CHANGED ***************");
        //console.log(store.getState());
    });
  }
  
  render() {
    return (
      <Provider store={store}>
        <AppStateMachine />
      </Provider>
    );
  }
}

export default App;