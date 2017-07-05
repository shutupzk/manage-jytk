import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import * as actions from '../../../ducks'
import {
  DailyFeeListItem,
  CalendarsList,
} from '../components'
import {theme} from 'components'

const MONTH = 1
const filterDailyfees = (dailyfees = [], date) => {
  let dailyfe = dailyfees.filter((dailyfe) => {
    if (moment(moment(dailyfe.date).format('YYYY-MM-DD')).isSame(moment(moment(date).format('YYYY-MM-DD')))) {
      return true
    }
    return false
  })
  return dailyfe
}
const getTotalMoney = (dailyData) => {
  let totalMoney = 0.00
  for (let data of dailyData) {
    totalMoney += parseFloat(data.chargeTotal)
  }
  return totalMoney.toFixed(2)
}
class DailyFeeScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false,
      date: '2015-01-04' // moment().format('YYYY-MM-DD')
    }
  }
  componentWillMount () {
    this.props.queryDailyfee(this.props.client, {inpatientRecordId: this.props.selectInpatientRecordId})
  }
  render () {
    let dailyfees = this.props.dailyfees
    this.array = []
    for (let i in dailyfees) {
      if (dailyfees[i] && dailyfees[i].id) {
        this.array.push(dailyfees[i])
      }
    }
    this.dailyData = filterDailyfees(this.array, this.state.date)
    return (
      <div style={{flexDirection: 'column'}}>
        {topView(this.dailyData, this)}
        {spliteLine()}
        {calendar(this.props, this.state, this)}
        {centerTips()}
        {content(this.dailyData)}
        {footView()}
        {/* <CalendarsList
          ref='calendar'
          minDate={moment().subtract(MONTH, 'months').format('YYYY-MM-DD')}
          maxDate={moment().add(MONTH, 'months').format('YYYY-MM-DD')}
          onPressDay={(day) => {
            this.setState({
              date: day
            })
          }}
          modalVisible={this.state.modalVisible} /> */}
        <style jsx global>{`
          .spliteLine {
            background-color: #E6E6E6;
            width: 100%;
            height: 1px;
          }
          .spliteLineWhite {
            width: 100%;
            height: 0.5px;
            background-color: #ffffff;
            margin-left: 15px;
            margin-right: 15px;
          }
          .topView {
            padding: 15px;
            flex-direction: row;
            background-color: ${theme.maincolor};
            height: 104px;
            display: flex;
            align-items: center;
          }
          .calendar {
            background-color: ${theme.maincolor};
            height: .4rem;
            line-height: .4rem;
            color: #fff;
          }
          .centerTips {
            justify-content: center;
            align-items: center;
            padding-top: 10px;
            padding-bottom: 10px;
          }
          .contentTop {
            display: flex;
            flex-direction: row;
            justify-content: center;
            background-color: #ffffff;
            padding: 10px 15px;
          }
          .footView {
            bottom: 20px
            width: 100%;
            position: absolute;
            height: 22px;
            justifyContent: center;
            alignItems: center; 
          }
        `}</style>
      </div>
    )
  }
}

const topView = (dailyfees, calendar) => {
  return (
    <div className={'topView'}>
      {/* <div><img src='/static/icons/back.png' style={{width: 10, height: 10}} /></div> */}
      <div
        onClick={() => {
          if (!(moment(calendar.state.date).format('YYYY-MM-DD') === moment().subtract(MONTH, 'months').format('YYYY-MM-DD'))) {
            const date = moment(calendar.state.date).subtract(1, 'days').format('YYYY-MM-DD')
            calendar.setState({
              date
            })
          }
        }
      }>
        <div className='flex tb-flex' style={{
          color: moment(calendar.state.date).format('YYYY-MM-DD') === moment().subtract(MONTH, 'months').format('YYYY-MM-DD') ? '#D8D8D8' : '#ffffff',
          fontSize: 13,
          marginRight: 5
        }}>
          <p className='back-left' style={{transform: 'rotate(-45deg)', borderTop: '.03rem solid #fff', borderLeft: '.03rem solid #fff'}}></p>前一天
        </div>
      </div>
      <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <div style={{color: '#ffffff', fontSize: 30, textAlign: 'center'}}>{getTotalMoney(calendar.dailyData)}</div>
        <div style={{color: '#ffffff', fontSize: 13, marginTop: 13, textAlign: 'center'}}>今日总费用（元）</div>
      </div>
      <div
        onClick={() => {
          if (!(moment(calendar.state.date).format('YYYY-MM-DD') === moment().add(MONTH, 'months').format('YYYY-MM-DD'))) {
            const date = moment(calendar.state.date).add(1, 'days').format('YYYY-MM-DD')
            calendar.setState({
              date
            })
          }
        }
      }>
        <div className='flex tb-flex' style={{
          color: moment(calendar.state.date).format('YYYY-MM-DD') === moment().add(MONTH, 'months').format('YYYY-MM-DD') ? '#D8D8D8' : '#ffffff',
          fontSize: 13,
          marginRight: 5
        }}>
          后一天<p className='back-left' style={{transform: 'rotate(135deg)', borderTop: '.03rem solid #fff', borderLeft: '.03rem solid #fff'}}></p>
        </div>
      </div>
    </div>
  )
}

const spliteLine = () => {
  return (
    <div className={'spliteLineWhite'} />
  )
}

const calendar = (props, state, calendar) => {
  return (
    <div
      onClick={() => {
        {/*calendar.refs.calendar.startModal()*/}
        calendar.refs.calendar.click()
        console.log(calendar.refs.calendar.value)
      }}>
      <div className={'calendar flex tb-flex lr-flex'}>
        <img style={{height: '16px', marginRight: '10px'}} src={'/static/icons/calendar.png'} />
        <label htmlFor='date'>{state.date}</label>
        <input style={{display: 'none'}} id='date' type='date' ref='calendar' value={state.date} onChange={(e) => { calendar.setState({date: e.target.value})}} />
      </div>
    </div>

  )
}

const centerTips = () => {
  return (
    <div className={'centerTips'}>
      <div style={{color: '#B4B4B4', fontSize: 12, textAlign: 'center'}}>甲类：公费    乙类：部分公费    丙类：自费</div>
    </div>
  )
}

const content = (dailyfees) => {
  return (
    <div className={'content'}>
      {contentTop()}
      <div
        style={{width: '100%'}}
      >
        {
          dailyfees.map((item) => {
            return <DailyFeeListItem data={item} />
          })
        }
      </div>
    </div>
  )
}

const contentTop = () => {
  return (
    <div >
      <div className={'contentTop'}>
        <div style={{color: '#D4D4D4', fontSize: 16}}>项目</div>
        <div style={{flex: 1}} />
        <div style={{color: '#D4D4D4', fontSize: 16}}>金额(元)</div>
      </div>
      <div className={'spliteLine'} />
    </div>
  )
}

const footView = () => {
  return (
    <div className={'footView'}>
      <div style={{fontSize: 12, color: '#B4B4B4', textAlign: 'center'}}>*仅供参考，以医院实际结算为准</div>
    </div>
  )
}

function mapStateToProps (state) {
  return {
    // token: state.user.data.token,
    userId: state.user.data.id,
    dailyfees: state.dailyfee.data,
    selectInpatientRecordId: state.dailyfee.selectInpatientRecordId
  }
}

export default connect(mapStateToProps, actions)(DailyFeeScreen)
