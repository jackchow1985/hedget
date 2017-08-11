import React, {Component} from 'react';
import './Editor.css';

import ace from 'brace';
import 'brace/ext/language_tools'

import AceEditor from 'react-ace';
import 'brace/ext/language_tools'

import 'brace/mode/python';
import langDict from './Completion'

const defaultValue = `from pyalgotrade.technical import ma

# 在这里编写初始化逻辑
frequency = 'DAY' #在日线上做回测
exchange = ['SH','SZ'] # 上海交易所
instrument = ['601398.SH', '000001.SZ'] # 股票代码
start = 20160101 #回测开始时间 YYYYMMDD
end = 20161231   #回测结束时间 YYYYMMDD
user_id = 'Jack' #用户名
cash = 10000.0  #初始资产
commission = 0.0008 # 手续费，默认万8
slippage = 0.1 # 滑点。例如，0.1 的滑点将使原本10元买入的成交变成以 11 元成交。


def __init__(self, feed, instrument):

    self.__instrument = instrument
    self.__close = {}
    for ele in self.__instrument:
        self.__close[ele] = feed[ele].getCloseDataSeries()
    self.__loop = 0
    self.__half_cash = self.getBroker().getCash() / 2

def onBars(self, bars):

    # user defined strategy
    if self.__loop < 30:
        self.__loop += 1
        return

    # iterate on each instrument
    for ele in self.__instrument:

        # close_ds = self.getFeed()[self.__instrument].getCloseDataSeries()
        sma_short = indicator.SMA(self.__close[ele], 40, timeperiod=10)
        sma_long = indicator.SMA(self.__close[ele], 40, timeperiod=30)

        # curr_price = self.getLastPrice(self.__instrument)
        bar = bars[ele]
        curr_price = bar.getClose()

        # check for stop loss
        curr_pos = self.getBroker().getShares(ele)

        # stop loss when cross of sma_short and sma_long
        if curr_pos != 0:
            if (sma_short[-1] - sma_long[-1]) * (sma_short[-2] - sma_long[-2]) < 0:
                self.marketOrder(ele, -1 * curr_pos, goodTillCanceled=True)

        # The trading logic, it is mean-reversion
        elif curr_pos == 0 and sma_short[-1] < (1.00 - 0.01) * sma_long[-1]:
            shares = int(self.__half_cash * 0.9 / curr_price)
            self.marketOrder(ele, shares, goodTillCanceled=True)

   `;
const themes = [
  'monokai',
  'github',
  'tomorrow',
  'kuroir',
  'twilight',
  'xcode',
  'textmate',
  'solarized_dark',
  'solarized_light',
  'terminal'
]
themes.forEach((theme) => {
  import (`brace/theme/${theme}`)
})

class CodeEditor extends Component {
  onLoad() {
    setTimeout(()=> {
      this.setState({theme: 'monokai'})
    }, 500)
  }
  onChange(newValue) {
    console.log('change', newValue);
    this.setState({value: newValue})
    if(this.state.unSaveIndicator.indexOf("*") <0) {
        this.setState({unSaveIndicator: "*"})
    }

  }

  onSelectionChange(newValue, event) {
    console.log('select-change', newValue);
    console.log('select-change-event', event);
  }
  setTheme(e) {
    this.setState({theme: e.target.value})
  }
  setMode(e) {
    this.setState({mode: e.target.value})
  }
  setBoolean(name, value) {
    this.setState({[name]: value})
  }
  setFontSize(e) {
    this.setState({
      fontSize: parseInt(e.target.value, 10)
    })
  }
  getContext() {
    return this.state.value
  }
  getTitle() {
    return this.state.title
  }
  setStrategy(strategy) {
    this.setState({
      value : strategy.code,
      title : strategy.title,
      oldTitle : strategy.title
    })
  }
  setUnSaveIndicator(toggle) {
    this.setState({
      unSaveIndicator : (toggle?'*' :'')
    })
  }
  constructor(props) {
    super(props);
    this.state = {
      oldTitle: '',
      unSaveIndicator : '',
      title:'未命名策略',
      value: defaultValue,
      theme: 'textmate',
      mode: 'python',
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      fontSize: 14,
      showGutter: true,
      showPrintMargin: true,
      highlightActiveLine: true,
      enableSnippets: true,
      showLineNumbers: true
    };
    this.setTheme = this.setTheme.bind(this);
    this.setMode = this.setMode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.setFontSize = this.setFontSize.bind(this);
    this.setBoolean = this.setBoolean.bind(this);
    this.handleChange = this.handleChange.bind(this)
    //this.changeName = this.changeName.bind(this)
    let langTools = ace.acequire('ace/ext/language_tools');
    langTools.addCompleter({
      getCompletions: function(editor, session, pos, prefix, callback) {
        callback(null, langDict);
      }
    });

  }

  handleChange(event) {
    const value = event.target.value;
    // const name = event.target.name;
    this.setState({title: value});
  }

  render() {
    return (
      <div className="editor_wrapper">
        <input type="text" className="title" onChange={this.handleChange} value={this.state.title} onBlur={() => this.props.modifyTitle(this.state.oldTitle, this.state.title)}/>
        <select
          className="theme float-right"
          name="Theme"
          onChange={this.setTheme}
          value={this.state.theme}>
          {themes.map((lang) =>
            <option key={lang} value={lang}>
              {lang}
            </option>
          )}
        </select>
        <AceEditor
          ref="ace_editor"
          mode={this.state.mode}
          theme={this.state.theme}
          name="blah2"
          onLoad={this.onLoad}
          onChange={this.onChange}
          onSelectionChange={this.onSelectionChange}
          fontSize={this.state.fontSize}
          width="100%"
          height={window.innerHeight - 100}
          showPrintMargin={this.state.showPrintMargin}
          showGutter={this.state.showGutter}
          highlightActiveLine={this.state.highlightActiveLine}
          value={this.state.value}
          enableBasicAutocompletion={this.state.enableBasicAutocompletion}
          enableLiveAutocompletion={this.state.enableLiveAutocompletion}
          />
      </div>
    );
  }
}

export default CodeEditor;
