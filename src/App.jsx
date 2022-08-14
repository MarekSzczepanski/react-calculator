import './App.css';
import BUTTONS from './BUTTONS/BUTTONS';
import RESULT from './RESULT/RESULT';
import React, { useState, useEffect, useReducer } from 'react';

const calculation_reducer = (state, action) => {
  switch (action.type) {
    case 'display':
      return {...state, value_to_display: action.value};
    case 'operation':
      return {...state, current_operation: action.value};
    case 'count':
      return {...state, value_to_count: action.value};
    default:
      return state;
  }
}

function App() {
  const [button_being_pressed, set_button_being_pressed] = useState(0);
  const [button_being_animated, set_button_being_animated] = useState(null);
  const [state, dispatch] = useReducer(calculation_reducer, {
    value_to_display: 0, 
    current_operation: null, 
    value_to_count: null,
  })

  useEffect(() => {
    const was_number_or_dot_or_equals_pressed = Number(button_being_pressed) || button_being_pressed === '.' || button_being_pressed === '=';
    
    const display_value = (value) => {
      const was_number_pressed = Number(value);
      const was_zero_pressed_and_only_zero_is_displayed = !state.value_to_display && value !== '.';
      const is_any_dot_on_display = String(state.value_to_display).split('.').length > 1;

      if (was_number_pressed) {
        if (state.current_operation) {
          switch(state.current_operation) {
            case '+':
              dispatch({type: 'count', value: Number(state.value_to_display) + Number(value)});
              break;
            case '-':
              dispatch({type: 'count', value: Number(state.value_to_display) - Number(value)});
              break;
            case '*':
              dispatch({type: 'count', value: Number(state.value_to_display) * Number(value)});
              break;
            case '/':
              dispatch({type: 'count', value: Number(state.value_to_display) / Number(value)});
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
          return Number(state.value_to_count);
        } else {
          if (is_any_dot_on_display) { // prevent more than one dots
            return state.value_to_display;
          }
          return state.value_to_display + value;
        }
      }
    }

    if (was_number_or_dot_or_equals_pressed) {
      dispatch({type: 'display', value: display_value(button_being_pressed)});
    } else if (button_being_pressed) {
      dispatch({type: 'operation', value: button_being_pressed});
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
        <RESULT value_to_display={state.value_to_display}/>
        <BUTTONS button_being_animated={button_being_animated} press_button={handle_press_button}/>
      </div>
    </div>
  );
}

export default App;
