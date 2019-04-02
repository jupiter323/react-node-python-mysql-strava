import React, { Component } from 'react';
import './App.css';
import { Header } from './component';
import { PostContainer } from './container';

class App extends Component {
  render() {
    return (
      <div>
          <Header/>
          <PostContainer/>
      </div>
    );
  }
}

export default App;
