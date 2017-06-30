import React, {
  Component
} from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Button
} from 'react-bootstrap';

import CodeMirror from 'react-codemirror';
import CSS from 'codemirror/lib/codemirror.css';
import Theme from 'codemirror/theme/bespin.css';
import 'codemirror/mode/python/python';
class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.updateCode = this.updateCode.bind(this);
    this.state = {
      code: "123"
    };
  }

  updateCode() {
    // alert('change')
  }
  render() {
    var options = {
      lineNumbers: true,
      mode: 'python',
      theme: 'bespin',
      height : '500px'
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


export default CodeEditor;
