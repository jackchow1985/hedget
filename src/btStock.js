import React, {
  Component
} from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import axios from 'axios';

class StockChart extends Component {
  constructor(props) {
    const config = {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: "BT"
      },
      subtitle: {
        text: " "
      },
      plotOptions: {
        candlestick: {
          color: '#cae285',
          upColor: '#a30001'
        }
      },

      yAxis: [{
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
      }],
      credits: {
        enabled: false
      }
    }

    super(props);
    this.props = {
      subreddit: 'react'
    }
    this.state = {
      config: config
    };
  }

  componentDidMount() {

    let chart = this.refs["bt"].getChart();
    axios.get(`fdtai/api/v1/marketdata/sc/call?method=day_ohlc&args=SZ,000543.SZ,2012-07-05,2013-07-26`)
      .then(res => {
        let chartData = []
        let volume = []
        let md = res.data
        for (let i in md.close) {
          chartData.push([
            parseInt(i),
            md.open[i],
            md.high[i],
            md.low[i],
            md.close[i],
          ]);
          volume.push([
            parseInt(i),
            md.volume[i] // the volume
          ]);
        }
        let seriesArr = []
        chart.addSeries({
          type: 'candlestick',
          name: "ohcl",
          data: chartData,
          id: 'dataseries',

          tooltip: {
            valueDecimals: 2
          }
        })
        chart.addSeries({
          type: 'column',
          name: 'Volume',
          data: volume,
          color: '#cae285',
          yAxis: 1
        })

        //chart.series[0].setData (data)
      });

  }

  render() {
    return ( < ReactHighstock config = {
        this.state.config
      }
      ref = "bt" /
      > )
  }
}



export default StockChart;
