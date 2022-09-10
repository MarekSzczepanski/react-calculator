import './App.css';
import BUTTONS from './BUTTONS/BUTTONS';
import RESULT from './RESULT/RESULT';
import React, { useEffect, useReducer } from 'react';

const PRESS = 'press';
const ANIMATE = 'animate';
const DISPLAY = 'display';
const OPERATION = 'operation';
const COUNT = 'count';
const CLEAR = 'clear';
const IS_RESULT = 'result';

const press_button_reducer = (state, action) => {
  switch (action.type) {
    case PRESS:
      return {...state, button_being_pressed: action.value};
    case ANIMATE:
      return {...state, button_being_animated: action.value};
    default:
      return state;
  }
}

const calculation_reducer = (state, action) => {
  switch (action.type) {
    case DISPLAY:
      return {...state, value_to_display: action.value ? action.value : state.value_to_display};
    case OPERATION:
      return {...state, current_operation: action.value};
    case COUNT:
      return {...state, value_to_count: action.value};
    case CLEAR:
      return {value_to_display: 0, current_operation: null, value_to_count: null};
    case IS_RESULT:
      return {...state, is_result_displayed: action.value};
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
    is_result_displayed: false,
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

          if (calculation_state.current_operation !== '=') {
            const save_first_number_with_operation = () => {
              calculation_dispatch({type: COUNT, value: calculation_state.value_to_count + calculation_state.current_operation});
            }
            save_first_number_with_operation();
          } else {
            const prepare_first_number_to_merge_with_operation_type = () => {
              calculation_dispatch({type: COUNT, value: String(calculation_state.value_to_count)});
            }
            const mark_current_display_as_result_to_allow_modyfing_result_and_using_it_as_next_first_number = () => {
              calculation_dispatch({type: IS_RESULT, value: true});
            }

            prepare_first_number_to_merge_with_operation_type();
            mark_current_display_as_result_to_allow_modyfing_result_and_using_it_as_next_first_number();
          }

          calculation_dispatch({type: OPERATION, value: null});
          return press_button_state.button_being_pressed;
        }
        return clear_display_and_return_new_number_to_display();

      } else if (pressed_button === '=') {
        const were_both_numbers_to_calculate_inputed = typeof calculation_state.value_to_count === 'string';
        return were_both_numbers_to_calculate_inputed ? do_operation() : calculation_state.value_to_display;

      } else if (pressed_button === '.') return is_any_dot_on_display ? calculation_state.value_to_display : calculation_state.value_to_display + pressed_button;

      return is_only_zero_displayed ? pressed_button : calculation_state.value_to_display + pressed_button;
    }

    const change_display_value = () => {
      const pressed_button = press_button_state.button_being_pressed === '0' ? 0 : press_button_state.button_being_pressed;
      calculation_dispatch({
        type: DISPLAY, 
        value: display_value(pressed_button)
      });
      //press_button_dispatch({type: ANIMATE, value: null});
    }

    const do_operation = () => {
      const first_two_inputed_numbers_were_calculated_and_next_number_will_be_inputed = calculation_state.value_to_count;
      if (first_two_inputed_numbers_were_calculated_and_next_number_will_be_inputed) {
        const calculate_before_displaying_new_value = () => {
          const is_second_number_only_dot = calculation_state.value_to_display === '.'
          const was_operation_pressed_after_operation = typeof calculation_state.value_to_count === 'string'
          let present_display_value = Number(calculation_state.value_to_display);
          let operation;
          let past_display_value; 
          let value_to_display;
          console.log(calculation_state.value_to_count)
          if (was_operation_pressed_after_operation) {
            operation = calculation_state.value_to_count.slice(calculation_state.value_to_count.length - 1);
            past_display_value = Number(calculation_state.value_to_count.slice(0, -1));
          } 

          if (is_second_number_only_dot) {
            present_display_value = 0;
            calculation_dispatch({type: DISPLAY, value: '0'});
          }

          const dispatches = (value) => {
            calculation_dispatch({type: COUNT, value});
            calculation_dispatch({type: DISPLAY, value});
            calculation_dispatch({type: OPERATION, value: null});
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
              if (!present_display_value) {
                value_to_display = "you can't divide by 0";
                break;
              }
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
          calculation_dispatch({type: COUNT, value: Number(calculation_state.value_to_display)});
        }
        remember_value_displayed_before_operation();
      }
      calculation_dispatch({type: OPERATION, value: press_button_state.button_being_pressed});
    }
    console.log(1, calculation_state.current_operation)
    if (was_number_or_dot_or_equals_pressed || calculation_state.current_operation === '=') {
      if (calculation_state.is_result_displayed) {
        const allow_modyfing_result_and_using_it_as_next_first_number = () => {
          calculation_dispatch({type: COUNT, value: null});
          calculation_dispatch({type: IS_RESULT, value: false});
        }
        allow_modyfing_result_and_using_it_as_next_first_number();
      }
      change_display_value();
      
    } else if (press_button_state.button_being_pressed) {
      do_operation();
    }
    
    press_button_dispatch({type: ANIMATE, value: press_button_state.button_being_pressed});
    setTimeout(() => {
      press_button_dispatch({type: ANIMATE, value: null});
    }, 200);
    press_button_dispatch({type: PRESS, value: null});
  }, [press_button_state.button_being_pressed]);

  const handle_press_button = (e) => {
    const was_clear_pressed = e.target.textContent === 'C';
    if (was_clear_pressed) return calculation_dispatch({type: CLEAR});
    press_button_dispatch({type: PRESS, value: e.target.textContent});
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
