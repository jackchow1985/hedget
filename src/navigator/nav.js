import React, {Component} from 'react';

class Navigator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userinfo : {}
    }
  }
  loginSuccess(userinfo) {
    this.setState({
      userinfo
    })
  }
  loginFailed(userinfo) {
  }
  render() {
    return (
      <div className="columns nav">
        <div className="logo_str column col-8">FDT<span className="ai_logo">AI</span><span className="platform-name">TRAIHUB-AI  </span></div>
        <div className="column col-4">
          <div className="menu_item active">策略回测平台</div>
          <div className="menu_item">我的策略库</div>
          <div className="menu_item">机器人工厂</div>
          <div className="menu_item">{this.state.userinfo.username && <div className="avatar"><img alt="avatar" src="https://picturepan2.github.io/spectre/img/avatar-2.png"/></div>} {this.state.userinfo.username || '登陆'}</div>
        </div>
      </div>
    )
  }
}

export default Navigator
