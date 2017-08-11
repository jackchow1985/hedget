import React, {Component} from 'react';
import axios from 'axios';
import md5 from 'md5'
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoading: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }
  login() {}
  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({[name]: value});
  }
  onCancel() {
    this.props.onCancel();
  }
  handleSubmit(event) {
    const _self = this
    this.setState({isLoading: true})
    setTimeout(() => {
      axios.post(`/trainhub/beta/login`, {
        username: this.state.username,
        password: md5(this.state.password)
      }).then(res => {
        if (res.data && res.data.userinfo) { //login success
          _self.props.onLoginComplete(res.data.userinfo);
        } else {
            _self.props.onLoginFailed(res.data.err);
        }
        this.setState({isLoading: false})
      })
    }, 1000)
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label className="form-label">用户名</label>
          <input className="form-input" name="username" type="text" id="input-example-1" placeholder="用户名" onChange={this.handleChange} value={this.state.username}/>
          <label className="form-label">密码</label>
          <input className="form-input" name="password" type="password" id="input-example-2" placeholder="密码" onChange={this.handleChange} value={this.state.password}/>
        </div>

        <div className="form-group">
          <label className="form-checkbox">
            <input type="checkbox"/>
            <i className="form-icon"></i>
            Remember me
          </label>
        </div>
        <div className="form-group">
          <button className={this.state.isLoading
            ? "loading btn btn-primary"
            : "btn btn-primary"} type="submit">Submit</button>
          <button className="btn btn-link" type="reset" onClick={this.onCancel}>Cancel</button>
        </div>
      </form>
    )
  }
}

export default Login
