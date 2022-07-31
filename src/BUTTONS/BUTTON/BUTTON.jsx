import './button.css';

function BUTTON({name, row, action, is_being_pressed, press_button}) {
  return (
    <div className={is_being_pressed ? 'calculator-button row' + row + ' active' : 'calculator-button row' + row} data-action={action} onClick={press_button}>{name}</div>
  );
}
  
export default BUTTON;