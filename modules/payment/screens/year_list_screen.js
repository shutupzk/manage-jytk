import React, { Component } from 'react'
import request from 'superagent-bluebird-promise'
import { API_SERVER } from '../../../config'

class YearListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      sortWay: null,
      array: []
    }
    this.type = '02'
  }

  async componentWillMount () {
    let { total, years, yearDatas, yearList } = (await request.post(`http://${API_SERVER}/payment/years`)).body
    let array = []
    for (let key in yearList) {
      array.push({ year: key, fee: yearList[key], key })
    }
    this.setState({ total, years, yearDatas, array })
  }

  renderTitle () {
    return (
      <ul className='flex tb-flex orderTitle'>
        <li className={'numberText titleText'}>序号</li>
        <li className={'subjectText titleText '}>时间</li>
        <li className={'subjectText titleText '}>金额</li>
        {/* <li className={'subjectText titleText'}>查看</li> */}
        <style jsx>{`
          .orderTitle {
            color: #797979;
            background: #f2f2f2;
            padding: 10px 15px;
            border-radius: 3px;
          }
          .titleText {
            padding: 0px, 10px;
            font-size: 16px;
          }
          .numberText {
            width: 5%;
            text-align: left;
          }
          .contentText {
            width: 50%;
            text-align: left;
          }
          .subjectText {
            width: 20%;
            text-align: center;
          }
          .subjectText1 {
            width: 40%;
            text-align: center;
          }
          .subjectText2 {
            width: 60%;
            text-align: center;
          }
        `}</style>
      </ul>
    )
  }

  renderRow (item, index) {
    return (
      <ul className='flex tb-flex listItem' key={index}>
        <li className={'numberText'}>{index + 1}</li>
        <li className={'subjectText'}>{item.year || '无'}</li>
        <li className={'subjectText'}>{item.fee} 元</li>
        {/* <li className={'subjectText'}>
          <button className='fenyeItem' onClick={() => this.goToDetail(item.id)}>
            设置
          </button>
        </li> */}
        <style jsx>{`
          .numberText {
            width: 5%;
            text-align: left;
          }
          .contentText {
            width: 50%;
            text-align: left;
          }
          .subjectText {
            width: 20%;
            text-align: center;
          }
          .fenyeItem {
            background: #3ca0ff;
            border-radius: 2px;
            display: inline-block;
            cursor: pointer;
            border: 1px solid #3ca0ff;
            color: #fff;
          }
          .subjectText1 {
            width: 40%;
            text-align: center;
          }
          .subjectText2 {
            width: 60%;
            text-align: center;
          }
        `}</style>
      </ul>
    )
  }

  renderItem (value, key) {
    return (
      <li className={'left textoverflow1'} key={key} style={{ width: '30%', marginRight: 10 }}>
        {value || '无'}
      </li>
    )
  }

  render () {
    let { array, total } = this.state
    return (
      <div className={'orderRecordsPage'}>
        <div style={{ margin: '20px' }}>
          总收入：
          <span style={{ marginLeft: 10, fontSize: 20, color: 'red' }}>{total}</span>
        </div>
        {this.renderTitle()}
        {array.map((item, index) => {
          return this.renderRow(item, index)
        })}
      </div>
    )
  }
}

export default YearListScreen
