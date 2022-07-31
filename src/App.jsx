import './App.css';
import BUTTONS from './BUTTONS/BUTTONS';
import RESULT from './RESULT/RESULT';
import React, { useState } from 'react';

function App() {

  const [button_being_pressed, set_button_being_pressed] = useState(0);

  const press_button = (e) => {
    set_button_being_pressed(e.target);
    setTimeout(() => {set_button_being_pressed(0)}, 200);
  } 

  return (
    <div className="App">
      <div className="calculator-container">
        <RESULT />
        <BUTTONS button_being_pressed={button_being_pressed} press_button={press_button}/>
      </div>
    </div>
  );
}

export default App;
