import './App.css';
import BUTTONS from './BUTTONS/BUTTONS';
import RESULT from './RESULT/RESULT';
import React, { useState, useEffect, useReducer } from 'react';

const calculation_reducer = (state, action) => {
  switch (action.type) {
    case 'display':
      return {...state, value_to_display: action.value ? action.value : state.value_to_display};
    case 'operation':
      return {...state, current_operation: action.value};
    case 'count':
      return {...state, value_to_count: action.value};
    default:
      return state;
  }
}

const App = () => {
  const [button_being_pressed, set_button_being_pressed] = useState(0);
  const [button_being_animated, set_button_being_animated] = useState(null);
  const [state, dispatch] = useReducer(calculation_reducer, {
    value_to_display: 0, 
    current_operation: null, 
    value_to_count: null,
  })

  useEffect(() => {
    console.log(state)
  }, [state])

  useEffect(() => {
    const was_number_or_dot_or_equals_pressed = Number(button_being_pressed) || button_being_pressed === '0' || button_being_pressed === '.' || button_being_pressed === '=';
    
    const display_value = (pressed_button) => {
      const was_number_pressed = Number(pressed_button) || pressed_button === '0';
      const is_any_dot_on_display = String(state.value_to_display).split('.').length > 1;
      const is_only_zero_displayed = !state.value_to_display;

      if (was_number_pressed) {
        if (state.current_operation) {
          const clear_display_and_return_new_number_to_display = () => {
            dispatch({type: 'count', value: state.value_to_count + state.current_operation})
            dispatch({type: 'operation', value: null})
            return button_being_pressed;
          }
          return clear_display_and_return_new_number_to_display();
        }

        const display_next_number = () => {
          return is_only_zero_displayed ? pressed_button : state.value_to_display + pressed_button;
        }

        return display_next_number();
      } else {
        if (pressed_button === '=') {
          const were_both_numbers_to_calculate_inputed = typeof state.value_to_count === 'string';
          
          if (were_both_numbers_to_calculate_inputed) {
            return do_operation();
          } else if (!state.current_operation) {
            return state.value_to_display;
          }

          return Number(state.value_to_count);
        } else {
          if (is_any_dot_on_display) { // prevent more than one dots
            return state.value_to_display;
          }
          return state.value_to_display + pressed_button;
        }
      }
    }

    const change_display_value = () => {
      dispatch({
        type: 'display', 
        value: display_value(button_being_pressed)
      });
    }

    const do_operation = () => {
      const is_at_least_third_number_inputed_or_equals_pressed = state.value_to_count && !Number(state.value_to_count);

      if (is_at_least_third_number_inputed_or_equals_pressed) {
        const calculate_before_displaying_new_value = () => {
          const operation = state.value_to_count.slice(state.value_to_count.length - 1);
          const present_display_value = Number(state.value_to_display);
          const past_display_value = Number(state.value_to_count.slice(0, -1));
          let value_to_display;
  
          const dispatches = (value) => {
            dispatch({type: 'count', value});
            dispatch({type: 'display', value});
          }

          switch(operation) {
            case '+':
              value_to_display = past_display_value + present_display_value;
              dispatches(value_to_display);
              break;
            case '-':
              value_to_display = past_display_value - present_display_value;
              dispatches(value_to_display);
              break;
            case '*':
              value_to_display = past_display_value * present_display_value;
              dispatches(value_to_display);
              break;
            case '/':
              value_to_display = past_display_value / present_display_value;
              dispatches(value_to_display);
              break;
            default:
              return false;
          }
        }

        calculate_before_displaying_new_value();
      } else {
        const remember_value_displayed_before_operation = () => {
          dispatch({type: 'count', value: Number(state.value_to_display)});
        }

        remember_value_displayed_before_operation();
      }
      dispatch({type: 'operation', value: button_being_pressed});
    }

    if (was_number_or_dot_or_equals_pressed) {
      change_display_value();
    } else if (button_being_pressed) {
      do_operation();
    }
    
    set_button_being_animated(button_being_pressed);
    setTimeout(() => {set_button_being_animated(null)}, 200);
  }, [button_being_pressed]);

  const handle_press_button = (e) => {
    set_button_being_pressed(e.target.textContent);
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
