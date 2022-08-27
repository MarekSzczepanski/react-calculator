import BUTTON from './BUTTON/BUTTON';
import './buttons.css';

function BUTTONS({button_being_animated, press_button}) {

  const button_names = [
    {name: 7, row: 0},
    {name: 8, row: 0},
    {name: 9, row: 0},
    {name: '*', row: 0},
    {name: 4, row: 1},
    {name: 5, row: 1},
    {name: 6, row: 1},
    {name: '-', row: 1},
    {name: 1, row: 2},
    {name: 2, row: 2},
    {name: 3, row: 2},
    {name: '+', row: 2},
    {name: '/', row: 3},
    {name: 0, row: 3},
    {name: '.', row: 3},
    {name: '=', row: 3},
    {name: 'C', row: -1},
  ];

  return (
    <div className='calculator-buttons-container'>
      {button_names.map((button, i) => {
        return <BUTTON name={button_names[i].name} row={button_names[i].row} is_being_animated={button_being_animated && button_being_animated == button_names[i].name ? true : false} press_button={press_button} key={i}></BUTTON>  
      })}
    </div>
  );
}
  
export default BUTTONS;