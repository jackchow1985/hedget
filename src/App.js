import React, {
  Component
} from 'react';
import logo from './logo.svg';
import './App.css';
import CodeMirror from 'react-codemirror';
import Css from 'codemirror/lib/codemirror.css';
require('codemirror/mode/python/python');
class App extends Component {
  constructor(props) {
    super(props);
    this.updateCode = this.updateCode.bind(this);
    this.state = {
      code: "123"
    };
  }

  updateCode() {

  }
  render() {
    var options = {
      lineNumbers: true,
      mode: 'python'
    };
    return <CodeMirror value = {
      this.state.code
    }
    onChange = {
      this.updateCode
    }
    options = {
      options
    }
    />
  }
}


export default App;
