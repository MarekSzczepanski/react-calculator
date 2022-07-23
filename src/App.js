import './App.css';
import BUTTONS from './BUTTONS/BUTTONS';
import RESULT from './RESULT/RESULT';

function App() {
  return (
    <div className="App">
      <div className="calculator-container">
        <RESULT />
        <BUTTONS />
      </div>
    </div>
  );
}

export default App;
