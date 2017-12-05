import React, { Component } from 'react'
import request from 'superagent-bluebird-promise'
import { API_SERVER } from '../../../config'
import ReactEcharts from 'echarts-for-react'

class YearEchartScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      sortWay: null,
      array: [],
      options: {}
    }
    this.type = '02'
  }

  async componentWillMount () {
    let { total, years, yearDatas, yearList } = (await request.post(`http://${API_SERVER}/payment/years`)).body
    let array = []
    for (let key in yearList) {
      array.push({ year: key, fee: yearList[key], key })
    }
    const options = {
      grid: {
        left: '4%',
        top: '8%',
        right: '6%',
        bottom: '4%',
        containLabel: true
      },
      xAxis: {
        boundaryGap: false,
        data: years
      },
      yAxis: {},
      series: [
        {
          type: 'line',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          data: yearDatas
        }
      ]
    }
    this.setState({ total, years, yearDatas, array, options })
  }

  render () {
    let { options, total } = this.state
    return (
      <div className={'orderRecordsPage'}>
        <div style={{ margin: '20px' }}>
          总收入：
          <span style={{ marginLeft: 10, fontSize: 20, color: 'red' }}>{total}</span>
        </div>
        <ReactEcharts option={options} notMerge lazyUpdate theme={'theme_name'} onChartReady={this.onChartReadyCallback} />
      </div>
    )
  }
}

export default YearEchartScreen
