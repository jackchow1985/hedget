import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
class StrategiesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }

    this.handleSelect = this.handleSelect.bind(this)
    this.loadData = this.loadData.bind(this)
  }
  loadData(cb) {
    axios.get(`/trainhub/beta/strategyList`).then(res => {
      if (res.data) { //login success
        this.setState({list: res.data})
      }
      if (cb)
        cb(res.data)
    })
  }
  componentDidMount() {
    this.loadData()
  }

  handleSelect(code) {
    // console.info(id)
    this.props.onSelect(code)
    // event.preventDefault();
  }

  render() {
    return (
      <div className="panel">
        <div className="panel-header text-center">
          <div className="avatar avatar-lg">
            <img src="https://picturepan2.github.io/spectre/img/avatar-2.png" alt="avatar"/>
          </div>
          <div className="panel-title mt-10">{this.props.username}</div>
          <div className="panel-subtitle">策略数：{this.state.list.length}</div>
        </div>
        <nav className="panel-nav">
          <ul className="tab tab-block">
            <li className="tab-item active">
              <a href="#panels">
                默认
              </a>
            </li>
            <li className="tab-item">
              <a href="#panels">
                实盘
              </a>
            </li>
            <li className="tab-item">
              <a href="#panels">
                Paper Test
              </a>
            </li>
          </ul>
        </nav>
        <div className="panel-body">

          {this.state.list && !this.state.list.err && this.state.list.map(i => {
            return (
              <div className="tile tile-centered strategy-item" onClick={() => this.handleSelect(i)} key={i._id}>
                <div className="tile-content">
                  <div className="tile-title">{i.title}</div>
                  <div className="tile-subtitle">{moment(i.updateTime).fromNow()}</div>
                </div>
                <div className="tile-action">
                  <button className="btn btn-link btn-action btn-lg">
                    <i className="icon icon-edit"></i>
                  </button>
                </div>
              </div>

            )
          })}
        </div>

      </div>

    )
  }
}
export default StrategiesList
