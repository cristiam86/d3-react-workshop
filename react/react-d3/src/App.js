import React, { Component } from 'react';
import './App.css';
import BarChart from './BarChart';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="chart" style={{"width": "100%","height": "500px"}}>
          <BarChart />
        </div>
        
      </div>
    );
  }
}

export default App;
