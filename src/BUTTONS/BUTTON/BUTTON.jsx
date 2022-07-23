import './button.css';

function BUTTON({name, row, action}) {
  return (
    <div className={'calculator-button row' + row} data-action={action}>{name}</div>
  );
}
  
export default BUTTON;