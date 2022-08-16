import './App.css';
import BUTTONS from './BUTTONS/BUTTONS';
import RESULT from './RESULT/RESULT';
import React, { useEffect, useReducer } from 'react';

const press_button_reducer = (state, action) => {
  switch (action.type) {
    case 'press':
      return {...state, button_being_pressed: action.value};
    case 'animate':
      return {...state, button_being_animated: action.value};
    default:
      return state;
  }
}

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
  const [press_button_state, press_button_dispatch] = useReducer(press_button_reducer, {
    button_being_pressed: 0,
    button_being_animated: null,
  })
  const [calculation_state, calculation_dispatch] = useReducer(calculation_reducer, {
    value_to_display: 0, 
    current_operation: null, 
    value_to_count: null,
  })

  useEffect(() => {
    console.log(calculation_state)
  }, [calculation_state])

  useEffect(() => {
    const was_number_or_dot_or_equals_pressed = 
      Number(press_button_state.button_being_pressed) || 
      press_button_state.button_being_pressed === '0' || 
      press_button_state.button_being_pressed === '.' || 
      press_button_state.button_being_pressed === '=';
    
    const display_value = (pressed_button) => {
      const is_any_dot_on_display = String(calculation_state.value_to_display).split('.').length > 1;
      const is_only_zero_displayed = !calculation_state.value_to_display;
      const was_number_or_dot_pressed_after_pressing_operation = calculation_state.current_operation && pressed_button !== '=';

      if (was_number_or_dot_pressed_after_pressing_operation) {
        const clear_display_and_return_new_number_to_display = () => {
          calculation_dispatch({type: 'count', value: calculation_state.value_to_count + calculation_state.current_operation});
          calculation_dispatch({type: 'operation', value: null});
          return press_button_state.button_being_pressed;
        }
        return clear_display_and_return_new_number_to_display();

      } else if (pressed_button === '=') {
        const were_both_numbers_to_calculate_inputed = typeof calculation_state.value_to_count === 'string';
        return were_both_numbers_to_calculate_inputed ? do_operation() : calculation_state.value_to_display;

      } else if (pressed_button === '.') {
        return is_any_dot_on_display ? calculation_state.value_to_display : calculation_state.value_to_display + pressed_button;
      }

      return is_only_zero_displayed ? pressed_button : calculation_state.value_to_display + pressed_button;
    }

    const change_display_value = () => {
      calculation_dispatch({
        type: 'display', 
        value: display_value(press_button_state.button_being_pressed)
      });
      press_button_dispatch({type: 'animate', value: null});
    }

    const do_operation = () => {
      const first_two_inputed_numbers_were_calculated_and_next_number_will_be_inputed = calculation_state.value_to_count && !Number(calculation_state.value_to_count);

      if (first_two_inputed_numbers_were_calculated_and_next_number_will_be_inputed) {
        const calculate_before_displaying_new_value = () => {
          const operation = calculation_state.value_to_count.slice(calculation_state.value_to_count.length - 1);
          const present_display_value = Number(calculation_state.value_to_display);
          const past_display_value = Number(calculation_state.value_to_count.slice(0, -1));
          let value_to_display;
  
          const dispatches = (value) => {
            calculation_dispatch({type: 'count', value});
            calculation_dispatch({type: 'display', value});
          }

          switch(operation) {
            case '+':
              value_to_display = past_display_value + present_display_value;
              break;
            case '-':
              value_to_display = past_display_value - present_display_value;
              break;
            case '*':
              value_to_display = past_display_value * present_display_value;
              break;
            case '/':
              value_to_display = past_display_value / present_display_value;
              break;
            default:
              return false;
          }

          dispatches(value_to_display);
        }

        calculate_before_displaying_new_value();
      } else {
        const remember_value_displayed_before_operation = () => {
          calculation_dispatch({type: 'count', value: Number(calculation_state.value_to_display)});
        }
        remember_value_displayed_before_operation();
      }
      calculation_dispatch({type: 'operation', value: press_button_state.button_being_pressed});
    }

    if (was_number_or_dot_or_equals_pressed) {
      change_display_value();
    } else if (press_button_state.button_being_pressed) {
      do_operation();
    }
    
    press_button_dispatch({type: 'animate', value: press_button_state.button_being_pressed});
    setTimeout(() => {press_button_dispatch({type: 'animate', value: null});}, 200);
  }, [press_button_state.button_being_pressed]);

  const handle_press_button = (e) => {
    press_button_dispatch({type: 'press', value: e.target.textContent});
  }

  return (
    <div className="App">
      <div className="calculator-container">
        <RESULT value_to_display={calculation_state.value_to_display}/>
        <BUTTONS button_being_animated={press_button_state.button_being_animated} press_button={handle_press_button}/>
      </div>
    </div>
  );
}

export default App;
