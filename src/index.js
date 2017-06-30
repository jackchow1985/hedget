import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CodeEditor from './CodeEditor';
import Chart from './btStock';
import registerServiceWorker from './registerServiceWorker';
import { Button, ButtonToolbar } from 'react-bootstrap';
const buttonsInstance = (
  <ButtonToolbar>
    {/* Standard button */}
    <Button>策略</Button>

    {/* Provides extra visual weight and identifies the primary action in a set of buttons */}
    <Button bsStyle="primary">运行</Button>

    {/* Indicates a successful or positive action */}
    <Button bsStyle="success">保存</Button>



  </ButtonToolbar>
);
const latout = (
  <div>
    < div className = "rows" >
      < div className = "col-md-5 editor code_area" >
        < CodeEditor / >
      < /div>
      <div className = "col-md-7 show_area">
        <Chart  / >
      < /div>
    </div >
  </div>
)
ReactDOM.render(buttonsInstance, document.getElementById('control-bar'));
ReactDOM.render(latout, document.getElementById('root'));

registerServiceWorker();
