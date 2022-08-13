import './button.css';

function BUTTON({name, row, is_being_animated, press_button}) {
  return (
    <div className={is_being_animated ? 'calculator-button row' + row + ' active' : 'calculator-button row' + row} onClick={press_button}>{name}</div>
  );
}

export default BUTTON;