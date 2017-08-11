import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NavigatorComponent from './navigator/nav';
import CodeEditor from './editor/CodeEditor';
import Chart from './chart/StockChart';
import LoginDialog from './login/LoginDialog';
import StrategiesList from './strategies/list';
import registerServiceWorker from './registerServiceWorker';
import 'spectre.css'
import 'spectre.css/dist/spectre-icons.css'
import axios from 'axios';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import PlayButton from 'react-icons/lib/go/playback-play'
import SaveButton from 'react-icons/lib/go/cloud-upload'
import AddButton from 'react-icons/lib/go/diff-added'
import ListButton from 'react-icons/lib/go/list-unordered'
import ChartButton from 'react-icons/lib/go/device-desktop'
import DeleteButton from 'react-icons/lib/go/trashcan'
import RobotButton from 'react-icons/lib/go/hubot'
import DashboardButton from 'react-icons/lib/go/dashboard'
import HistoryButton from 'react-icons/lib/go/history'
import ConsoleButton from 'react-icons/lib/go/browser'
import HelpButton from 'react-icons/lib/go/podium'


import 'animate.css'

class RootComponent extends React.Component {
  //const unreadMessages = props.showErrorMsg;
  attack_scaning(code) {
    let rows = code.split('\n')
    for (let i in rows) {
      if (rows[i].indexOf("import") >= 0) {
        if (rows[i].indexOf("pyalgotrade") < 0) {
          return false
        }
      }
    }
    return true;
  }
  loginComplete(userInfo) {
    this.setState({isLoginDialogShow: false, isLoggin: true})
    console.info(userInfo)
    this.refs.navi.loginSuccess(userInfo)
  }
  loginFailed(err) {
    this.setState({isLoginDialogShow: false})
    alert('用户名或密码错误')
    this.refs.navi.loginFailed(err)
  }
  onLoginCancel() {
    this.setState({isLoginDialogShow: false})
  }
  onConsoleCancel() {
    this.setState({isConsoleShow: false})
  }

  onStrategyListCancel() {
    this.setState({isStrategyListShow: false})
  }
  onStrategyListSelect(strategy) {
    this.refs.editor.setStrategy(strategy)
    this.setState({isStrategyListShow: false})
  }
  onSaveCancel() {
    this.setState({isSaveTitleShow: false})
  }
  onDelete(strategy) {
    this.setState({isDeleteShow: true, title : this.refs.editor.getTitle()})
  }
  onDeleteCancel() {
    this.setState({isDeleteShow: false})
  }
  list() {
    if (!this.state.isLoggin) {
      this.setState({isLoginDialogShow: true})
      return
    }
    this.refs.strategy_list.loadData()
    this.setState({isStrategyListShow: true})
  }
  modifyTitle(oldTitle, newTitle) {
    if (!this.state.isLoggin) {
      //this.setState({isLoginDialogShow: true})
      return
    }
    axios.post(`/trainhub/beta/updateTitle`, {
      title: oldTitle,
      newTitle: newTitle
    }).then(res => {
      // this.setState({isSaveTitleShow: false})
      // this.refs.editor.setUnSaveIndicator(false)
      this.refs.strategy_list.loadData(strategies => {
        if (strategies && strategies.length > 0) { // display the latest strategy
          this.refs.editor.setStrategy(strategies[0])
        }
      })
    })

  }
  save() {
    if (!this.state.isLoggin) {
      this.setState({isLoginDialogShow: true})
      return
    }

    let user_code = this.refs.editor.getContext()
    axios.post(`/trainhub/beta/save`, {
      title: this.refs.editor.getTitle(),
      strategy: user_code
    }).then(res => {
      this.setState({isSaveTitleShow: false})
      this.refs.editor.setUnSaveIndicator(false)
    })

  }
  delete() {
    if (!this.state.isLoggin) {
      this.setState({isLoginDialogShow: true})
      return
    }

    //let user_code = this.refs.editor.getContext()
    axios.post(`/trainhub/beta/delete`, {title: this.refs.editor.getTitle()}).then(res => {
      //this.setState({isSaveTitleShow: false})
      this.setState({isDeleteShow: false})
      this.refs.strategy_list.loadData(strategies => {
        if (strategies && strategies.length > 0) { // display the latest strategy
          this.refs.editor.setStrategy(strategies[0])
        }
      })
      //this.refs.editor.setUnSaveIndicator(false)
    })

  }
  create() {
    if (!this.state.isLoggin) {
      this.setState({isLoginDialogShow: true})
      return
    }
    //if(this.state.stName === '') {
    this.setState({isSaveTitleShow: true})
    //  return
    //}
  }

  submit() {
    if (this.state.stName === '')
      return
    let user_code = `

# 在这里编写初始化逻辑
frequency = 'DAY' #在日线上做回测
exchange = ['SZ'] # 上海交易所
instrument = ['000001.SZ'] # 股票代码
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

       `;
    this.refs.editor.setStrategy({title: this.state.stName, code: user_code})
    axios.post(`/trainhub/beta/save`, {
      title: this.state.stName,
      strategy: user_code
    }).then(res => {
      this.setState({isSaveTitleShow: false, stName: ''})
    })
  }
  run() {
    //console.info(this.refs.editor.getContext())
    if (!this.state.isLoggin) {
      this.setState({isLoginDialogShow: true})
      return
    }
    let user_code = this.refs.editor.getContext()
    if (!this.attack_scaning(user_code)) {
      alert("安全警告！严禁import pyalgotrade以外的python包")
    } else {
      this.refs.chart.clearCharts()
      this.setState({isRuningStragey: true})
      axios.post(`/trainhub/beta/strategyBuild`, {strategy: user_code}).then(res => {
        if (!res.data || res.data.error) {
          this.setState({showErrorMsg: res.data.error, isRuningStragey: false})
        } else {
          this.setState({
            console: res.data.console,
            showErrorMsg: '',
            isRuningStragey: false,
            executions_data: res.data.result.result,
            loadTime: res.data.result.load_time,
            runTime: res.data.result.run_time
          })
          const [start,
            end,
            portfolio,
            dateTimeX] = [res.data.result.start, res.data.result.end, res.data.result.port_and_posi.portfolio, res.data.result.port_and_posi.date_time]
          for (let inst in res.data.result.instrument) {
            const exchange = res.data.result.instrument[inst].split(".")[1]
            this.refs.chart.drawChart(`chart-${inst}`, exchange, res.data.result.instrument[inst], res.data.result.start, res.data.result.end, res.data.result.result.filter(trade => trade.instrument === res.data.result.instrument[inst]), portfolio)
          }
          this.refs.chart.drawUnitPrice(dateTimeX, portfolio, start, end)
        }

      });
    }

  }
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      console: [],
      showErrorMsg: '',
      resultMsg: '',
      isRuningStragey: false,
      executions_data: [],
      isLoggin: false,
      isLoginDialogShow: false,
      isSaveTitleShow: false,
      isHelpShow:false,
      isStrategyListShow: false,
      isConsoleShow: false,
      isDeleteShow: false,
      stName: '',
      userinfo: {},
      loadTime: 0,
      runTime: 0
    }
    this.run = this.run.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.list = this.list.bind(this);
    this.create = this.create.bind(this);
    this.submit = this.submit.bind(this);
    this.onLoginCancel = this.onLoginCancel.bind(this);
    this.onConsoleCancel = this.onConsoleCancel.bind(this);
    this.onStrategyListCancel = this.onStrategyListCancel.bind(this);
    this.onStrategyListSelect = this.onStrategyListSelect.bind(this);
    this.onSaveCancel = this.onSaveCancel.bind(this);
    this.onDeleteCancel = this.onDeleteCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.cancelMsg = this.cancelMsg.bind(this);
    this.loginComplete = this.loginComplete.bind(this)
    this.loginFailed = this.loginFailed.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.modifyTitle = this.modifyTitle.bind(this);

  }
  componentDidMount() {
    //check user login
    axios.get(`/trainhub/beta/getSession`).then(res => {
      if (res.data && res.data.username) {
        this.setState({isLoggin: true})
        this.setState({userinfo: res.data})
        this.refs.navi.loginSuccess(res.data)
        this.refs.strategy_list.loadData(strategies => {
          if (strategies && strategies.length > 0) { // display the latest strategy
            this.refs.editor.setStrategy(strategies[0])
          }
        })
      }
      console.info(res.data)
    })
  }

  cancelMsg() {
    this.setState({showErrorMsg: '', resultMsg: ''})
  }
  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({[name]: value});
  }
  isRunning() {
    return 'btn btn-primary ' + (this.state.isRuningStragey
      ? 'loading'
      : 'tooltip')
  }
  render() {
    const columns = [
      {
        Header: '交易日期',
        accessor: 'date time',
        minWidth: 120

      }, {
        Header: '股票代码',
        accessor: 'instrument' // String-based value accessors!
      }, {
        Header: '操作',
        accessor: 'B/S', // String-based value accessors!
        Cell: props => <span className={props.value === 'B'
          ? 'buy-action'
          : 'sell-action'}>{props.value === 'B'
            ? '买'
            : '卖'}</span>,
        width: 50
      }, {
        Header: '交易价格',
        accessor: 'price',
        Cell: props => <span className='number'>{props.value.toFixed(2)}</span>
      }, {
        Header: '交易量',
        accessor: 'quantity' // String-based value accessors!
      }, {
        Header: '手续费',
        accessor: 'commission',
        Cell: props => <span className='number'>{props.value.toFixed(2)}</span>
      }
    ]

    return (

      <div>
        <NavigatorComponent ref="navi"/>
        <div className={this.state.isLoginDialogShow
          ? 'modal active '
          : 'modal'}>
          <div className="modal-overlay"></div>
          <div className="modal-container">
            <div className="modal-header">
              <button className="btn btn-clear float-right" onClick={this.onLoginCancel}></button>
              <div className="modal-title">用户登陆</div>
            </div>
            <div className="modal-body">
              <div className="content">
                <LoginDialog ref="login" onLoginComplete={this.loginComplete} onLoginFailed={this.loginFailed} onCancel={this.onLoginCancel}/>
              </div>
            </div>
            <div className="modal-footer">
              Copyright by FDTAI 2017
            </div>
          </div>
        </div>
        <div className={this.state.isRuningStragey
          ? 'modal active '
          : 'modal'}>
          <div className="modal-overlay"></div>

      			<div className="sk-cube-grid">
      			  <div className="sk-cube sk-cube1"></div>
      			  <div className="sk-cube sk-cube2"></div>
      			  <div className="sk-cube sk-cube3"></div>
      			  <div className="sk-cube sk-cube4"></div>
      			  <div className="sk-cube sk-cube5"></div>
      			  <div className="sk-cube sk-cube6"></div>
      			  <div className="sk-cube sk-cube7"></div>
      			  <div className="sk-cube sk-cube8"></div>
      			  <div className="sk-cube sk-cube9"></div>
      			</div>
        </div>
        <div className={this.state.isConsoleShow
          ? 'modal active '
          : 'modal'}>
          <div className="modal-overlay"></div>
          <div className="modal-container console-wrapper">
            <div className="modal-header">
              <button className="btn btn-clear float-right" onClick={this.onConsoleCancel}></button>
              <div className="modal-title">控制台
              </div>
            </div>
            <div className="modal-body">
              <div className="content">
                {this.state.console.map(i => {
                  return <p>{i}</p>;
                })}
              </div>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
        <div className={this.state.isStrategyListShow
          ? 'modal active '
          : 'modal'}>
          <div className="modal-overlay"></div>
          <div className="modal-container list-wrapper">
            <div className="modal-header">
              <button className="btn btn-clear float-right" onClick={this.onStrategyListCancel}></button>
              <div className="modal-title">策略列表
              </div>
            </div>
            <div className="modal-body">
              <div className="content">
                <StrategiesList ref="strategy_list" onStrategySelect={this.selectedStrategy} onSelect={this.onStrategyListSelect} username={this.state.userinfo.username}/>
              </div>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
        <div className={this.state.isHelpShow
          ? 'modal active '
          : 'modal'}>
          <div className="modal-overlay"></div>
          <div className="modal-container help_wrapper">
            <div className="modal-header">
              <button className="btn btn-clear float-right" onClick={() => this.setState({isHelpShow:false})}></button>
              <div className="modal-title">策略指南
              </div>
            </div>
            <iframe src="help.html" width="100%" height="100%" title="help"/>

          </div>


        </div>
        <div className={this.state.isDeleteShow
          ? 'modal active '
          : 'modal'}>
          <div className="modal-overlay"></div>
          <div className="modal-container">
            <div className="modal-header">
              <button className="btn btn-clear float-right" onClick={this.onDeleteCancel}></button>
              <div className="modal-title">删除策略
              </div>
            </div>
            <div className="modal-body centered">
              <div className="content">
                <div className="form-group">
                  你确定要删除{this.state.title} ？
                </div>

                <div className="form-group">
                  <button className="btn btn-primary" onClick={this.delete} type="submit">确定删除</button>
                </div>
              </div>
            </div>

            <div className="modal-footer"></div>
          </div>
        </div>
        <div className={this.state.isSaveTitleShow
          ? 'modal active '
          : 'modal'}>
          <div className="modal-overlay"></div>
          <div className="modal-container">
            <div className="modal-header">
              <button className="btn btn-clear float-right" onClick={this.onSaveCancel}></button>
              <div className="modal-title">新建策略</div>
            </div>
            <div className="modal-body">
              <div className="content">
                <div className="form-group">
                  <label className="form-label">策略名字 （注意：相同策略名字会被覆盖）</label>
                  <input className="form-input" name="stName" type="text" id="input-stName-1" placeholder="策略名" onChange={this.handleChange} value={this.state.stName}/>
                </div>
                <div className="form-group">
                  <button className="btn btn-primary" onClick={this.submit} type="submit">保存</button>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="columns">
          <div className="column col-md-6 editor code_area">
            <CodeEditor ref="editor" modifyTitle={this.modifyTitle}/>
          </div>

          <div className="column col-md-6 show_area">
            <div className="control-bar">
              <button className={this.isRunning()} data-tooltip="编译并运行" onClick={this.run}>
                <PlayButton className="play_button"/>
              </button>
              <button className="btn tooltip" data-tooltip="策略编写指南"  onClick={() => this.setState({isHelpShow: true})}>
                <HelpButton className="play_button"/>
              </button>
              <button className="btn tooltip" data-tooltip="我的策略列表" onClick={this.list}>
                <ListButton className="play_button"/>
              </button>
              <button className="btn tooltip" data-tooltip="保存当前策略" onClick={this.save}>
                <SaveButton className="play_button"/>
              </button>
              <button className="btn tooltip" data-tooltip="新建策略" onClick={this.create}>
                <AddButton className="play_button"/>
              </button>
              <button className="btn tooltip" data-tooltip="删除当前策略" onClick={this.onDelete}>
                <DeleteButton className="play_button"/>
              </button>
              <button className="btn tooltip" data-tooltip="控制台输出" onClick={() => this.setState({isConsoleShow: true})}>
                <ConsoleButton className="play_button"/>
              </button>
              <button className="btn tooltip" data-tooltip="性能分析-即将推出">
                <DashboardButton className="play_button tbd-btn"/>
              </button>
              <button className="btn tooltip" data-tooltip="收益指标分析-即将推出">
                <ChartButton className="play_button tbd-btn"/>
              </button>
              <button className="btn tooltip" data-tooltip="策略转化成交易机器人-即将推出">
                <RobotButton className="play_button tbd-btn"/>
              </button>
              <button className="btn tooltip" data-tooltip="历史回测-即将推出">
                <HistoryButton className="play_button tbd-btn"/>
              </button>
              <div className="float-right perform_timing">行情加载耗时:{parseInt(this.state.loadTime * 1000, 10)}
                ms 策略运行耗时:{parseInt(this.state.runTime * 1000, 10)}
                ms</div>
            </div>
            {this.state.showErrorMsg.length > 0 && <div className="toast toast-error">
              <button className="btn btn-clear float-right" onClick={this.cancelMsg}></button>
              {this.state.showErrorMsg.split("\n").map(i => {
                return <div>{i}</div>;
              })}
            </div>}
            <Chart ref="chart"/> {this.state.executions_data.length > 0 && <ReactTable data={this.state.executions_data} columns={columns} minRows={5} className='-striped -highlight custom-table'/>}
          </div>

        </div>
      </div>
    )
  }
}
ReactDOM.render(
  <RootComponent/>, document.getElementById('root'));

registerServiceWorker();
