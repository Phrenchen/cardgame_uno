import React, { Component } from 'react';
import AppNavbar from './components/AppNavbar';
import PlayerList from './components/PlayerList';
import CardList from './components/CardList';
import {Provider} from "react-redux";
import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import CardModal from './components/CardModal';
import PlayerModal from './components/PlayerModal';
import {Container} from "reactstrap";


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
        <div className="App">
          <AppNavbar/>
          <Container>
            <PlayerModal />
            <PlayerList/>
            <br/>
            <CardModal />
            <CardList/>
          </Container>
        </div>
      </Provider>
    );
  }
}

export default App;
