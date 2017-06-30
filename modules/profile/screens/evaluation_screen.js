import React, {Component } from 'react'
import { connect } from 'react-redux'
// import Router from 'next/router'
import localforage from 'localforage'
// import Link from 'next/link'
import {theme} from 'components'
import { queryUser, queryHospitals, addHospitalEvaluate } from '../../../ducks'
import { isEmptyObject } from '../../../utils'
import EvaluationItem from '../components/evaluation_item'
class EvaluationScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      waitingScore: 5,
      appointmentScore: 5,
      environmentScore: 5,
      feelingScore: 5,
      advice: ''
    }
  }
  componentWillMount () {
    const user = this.props.user
    const hospitals = this.props.hospitals
    var userId = localforage.getItem('userId')
    if (isEmptyObject(user)) {
      this.props.queryUser(this.props.client, {userId})
    }
    if (isEmptyObject(hospitals)) {
      this.props.queryHospitals(this.props.client)
    }
  }
  getScore (key, score) {
    if (key === 'waitTime') {
      this.setState({waitingScore: score})
    }
    if (key === 'appointment') {
      this.setState({appointmentScore: score})
    }
    if (key === 'environment') {
      this.setState({environmentScore: score})
    }
    if (key === 'feeling') {
      this.setState({feelingScore: score})
    }
  }
  getHospitalId (hospitals) {
    for (var key in hospitals) {
      if (key && hospitals[key].id) {
        return key
      }
    }
  }
  async submitEvaluation () {
    const waitingScore = this.state.waitingScore
    const appointmentScore = this.state.appointmentScore
    const environmentScore = this.state.environmentScore
    const feelingScore = this.state.feelingScore
    const advice = this.state.advice
    const userId = await localforage.getItem('userId')
    const hospitalId = this.getHospitalId(this.props.hospitals)
    console.log(userId, hospitalId, waitingScore, appointmentScore, environmentScore, feelingScore, advice)
    const evaluation = await this.props.addHospitalEvaluate(this.props.client, {userId, hospitalId, waitingScore, appointmentScore, environmentScore, feelingScore, advice})
    if (evaluation.error) {
      console.log(evaluation.error)
    } else {
      this.props.url.back()
    }
  }
  render () {
    if (this.props.loading) {
      return (
        <div>loading...</div>
      )
    }
    if (this.props.error) {
      return (
        <div>error...</div>
      )
    }
    var arr = [
      {num: 1, title: '总体感受', key: 'feeling', score: 5},
      {num: 2, title: '预约挂号', key: 'appointment', score: 5},
      {num: 3, title: '环境设施', key: 'environment', score: 5},
      {num: 4, title: '候诊时间', key: 'waitTime', score: 5},
      {num: 5, title: '其他建议', key: 'other', score: 5}
    ]
    return (
      <div>
        { arr.map((item, i) => {
          if (item.key === 'other') {
            return (
              <div style={{padding: 10, backgroundColor: '#ffffff'}}>
                <header className='header'>{item.num}.&nbsp;{item.title}</header>
                <div style={{padding: 10}}>
                  <textarea
                    rows='5'
                    placeholder='请填写您的意见或建议，以帮助我们改进。'
                    style={{background: '#F2F2F2', border: '1px solid #D8D8D8', width: '100%', fontSize: theme.fontsize}}
                    onChange={(e) => { this.setState({advice: e.target.value}) }}
                  />
                </div>
                <style jsx>{`
                  .header{
                     color: ${theme.mainfontcolor}
                  }
                `}</style>
              </div>
            )
          }
          return <EvaluationItem item={item} getScore={(score) => { this.getScore(item.key, score) }} />
        }) }
        <div>
          <button
            className='fullWidthFixed fullWidthBtn fullWidthBtnMain'
            onClick={() => { this.submitEvaluation() }}
          >提交</button>
        </div>
      </div>
    )
  }
}

function mapStateToPrpos (state) {
  return {
    user: state.user.data,
    hospitals: state.hospitals.data,
    loading: state.hospitals.loading || state.user.loading,
    error: state.hospitals.error || state.user.error
  }
}

export default connect(mapStateToPrpos, {queryUser, queryHospitals, addHospitalEvaluate})(EvaluationScreen)
