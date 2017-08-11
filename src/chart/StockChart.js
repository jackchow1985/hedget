import React, {Component} from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import axios from 'axios';

class StockChart extends Component {
  constructor(props) {
    super(props);
    // this.props = {
    //   subreddit: 'react'
    // }
    this.state = {
      unitPriceConfig : {},
      charts : []
    }
  }

  clearCharts () {
    this.setState({
      charts : []
    })
  }

  drawBuySellOnChart(chartInstance, executions) {

    for (var i in executions) {
      chartInstance.push({
        type: 'flags',
        data: [
          {
            x: new Date(executions[i]["date time"]),
            title: executions[i]["B/S"],
            text: executions[i]["quantity"] + " @" + executions[i].price
          }
        ],
        color: (executions[i]["B/S"] === "B"
          ? "#5764c6"
          : "orange"), // same as onSeries
        fillColor: (executions[i]["B/S"] === "B"
          ? "#5764c6"
          : "orange"),
        onSeries: 'dataseries',
        //width: 16,
        style: { // text style
          color: 'white'
        },
        states: {
          hover: {
            fillColor: '#395C84' // darker
          }
        }
      })
    }
    //chartInstance.redraw()
  }

  drawUnitPrice(dateTimeX, portfolio, start, end) {
    const baseLineExchange = "SH"

    axios.get(`/trainhub/beta/getMarketData?exchange=${baseLineExchange}&symbol=000300.SH&start=${start}&end=${end}`).then(res => {
      // let chart = this.refs["unit_price"].getChart();
      let chartData = []
      let baseLineData = []
      let baseLine = res.data

      // for (let b in baseLine.close) {
      //   bmMap[bm[b][0]] = baseLine[b].close
      // }
      let firstDateValue = 0
      for (let i in dateTimeX) {
        let key_date = dateTimeX[i].split(" ")[0]
        chartData.push([Date.parse(key_date), portfolio[i] * 100
        ])
        if (firstDateValue === 0)
          firstDateValue = parseFloat(baseLine.close[Date.parse(key_date)])
        baseLineData.push([
          Date.parse(key_date),
          (1 - parseFloat(baseLine.close[Date.parse(key_date)]) / firstDateValue) * 100
        ])
      }
      let series = []
      series.push({type: 'area', name: '基准收益', data: baseLineData, color: 'orange'});
      series.push({type: 'line', name: '策略收益', data: chartData, color: '#4c59c2'});
      const unitPriceConfig = {
        chart: {
          zoomType: 'x'
        },
        title: {
          text: ""
        },
        subtitle: {
          text: "收益曲线"
        },
        legend: {
          enabled: true
        },
        credits: {
          enabled: false
        },
        series
      }
      this.setState({
        unitPriceConfig

      })
    })
  }
  drawChart(chartId, exchange, symbol, start, end, executions, portfolio) {
    axios.get(`/trainhub/beta/getMarketData?exchange=${exchange}&symbol=${symbol}&start=${start}&end=${end}`).then(res => {
      let series = [];
      let chartData = []
      let volume = []
      let md = res.data
      for (let i in md.close) {
        chartData.push([
          parseInt(i, 10),
          md.open[i],
          md.high[i],
          md.low[i],
          md.close[i]
        ]);
        volume.push([
          parseInt(i, 10),
          md.volume[i] // the volume
        ]);
      }
      series.push({
        type: 'candlestick',
        name: "ohcl",
        data: chartData,
        id: 'dataseries',

        tooltip: {
          valueDecimals: 2
        }
      }, false)
      series.push({
        type: 'column',
        name: 'Volume',
        data: volume,
        color: '#4c59c2',
        yAxis: 1
      }, false)
      this.drawBuySellOnChart(series, executions)
      const chartConfig = {
        chart: {
          zoomType: 'x'
        },
        title: {
          text: symbol
        },
        subtitle: {
          text: "买卖点回测"
        },
        plotOptions: {
          candlestick: {
            // color: '#cae285',
            // upColor: '#a30001'
          }
        },

        yAxis: [
          {
            labels: {
              align: 'right',
              x: -3
            },
            title: {
              text: 'OHLC'
            },
            height: '60%',
            lineWidth: 2
          }, {
            labels: {
              align: 'right',
              x: -3
            },
            title: {
              text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
          }
        ],
        credits: {
          enabled: false
        },
        series : series
      }

      let chart_arr = this.state.charts
      chart_arr.push({chartConfig, chartId})
      this.setState({
        charts : chart_arr
      })


    });
    //this.drawUnitPrice(exchange, portfolio)
  }

  render() {
    return (
      <div>
          {this.state.charts.map(i => {
            return <div className="animated bounceInRight"><ReactHighstock key={i.chartId} config={i.chartConfig}></ReactHighstock></div>
          })}
        {this.state.unitPriceConfig.series && <ReactHighstock config={this.state.unitPriceConfig} ref="unit_price"/>}
      </div>
    )
  }
}

export default StockChart;
