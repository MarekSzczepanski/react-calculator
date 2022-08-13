import './App.css';
import BUTTONS from './BUTTONS/BUTTONS';
import RESULT from './RESULT/RESULT';
import React, { useState, useEffect } from 'react';

function App() {

  const [button_being_pressed, set_button_being_pressed] = useState(0);
  const [button_being_animated, set_button_being_animated] = useState(null);
  const [value_to_display, set_value_to_display] = useState(0);
  const [value_to_count, set_value_to_count] = useState(null);
  const [current_operation, set_current_operation] = useState(null);

  useEffect(() => {
    const was_number_or_dot_or_equals_pressed = Number(button_being_pressed) || button_being_pressed === '.' || button_being_pressed === '=';
    
    const display_value = (value) => {
      const was_number_pressed = Number(value);
      const was_zero_pressed_and_only_zero_is_displayed = !value_to_display && value !== '.';
      const is_any_dot_on_display = String(value_to_display).split('.').length > 1;

      if (was_number_pressed) {
        if (current_operation) {
          switch(current_operation) {
            case '+':
              set_value_to_count(Number(value_to_display) + Number(value));
              break;
            case '-':
              set_value_to_count(Number(value_to_display) - Number(value));
              break;
            case '*':
              set_value_to_count(Number(value_to_display) * Number(value));
              break;
            case '/':
              set_value_to_count(Number(value_to_display) / Number(value));
              break;
            default:
              return false;
          }
        }
        return value;
      } else {
        if (was_zero_pressed_and_only_zero_is_displayed) {
          return 0;
        } else if (value === '=') {
          return Number(value_to_count);
        } else {
          if (is_any_dot_on_display) { // prevent more than one dots
            return value_to_display;
          }
          return value_to_display + value;
        }
      }
    }

    if (was_number_or_dot_or_equals_pressed) {
      set_value_to_display(display_value(button_being_pressed));
    } else if (button_being_pressed) {
      set_current_operation(button_being_pressed);
    }
    
    if (button_being_pressed) {
      set_button_being_animated(button_being_pressed);
      setTimeout(() => {set_button_being_animated(null)}, 200);
    }
  }, [button_being_pressed]);

  const handle_press_button = (e) => {
    set_button_being_pressed(e.target.textContent)
  }

  return (
    <div className="App">
      <div className="calculator-container">
        <RESULT value_to_display={value_to_display}/>
        <BUTTONS button_being_animated={button_being_animated} press_button={handle_press_button}/>
      </div>
    </div>
  );
}

export default App;
