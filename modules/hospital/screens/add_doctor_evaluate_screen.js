import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
// import swal from 'sweetalert2'
// import moment from 'moment'
import {theme, RequireLoginCard, Prompt} from 'components'
import {signin, addDoctorEvaluate} from '../../../ducks'
import Stars from '../components/stars'
class AddDoctorEvaluateScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      advice: '',
      technologyScore: 5,
      serviceScore: 5,
      isShow: false,
      autoClose: true,
      closeTime: 2,
      promptContent: ''
    }
  }
  componentWillMount () {
    this.autoSignin()
  }
  async autoSignin () {
    if (!this.props.token) {
      const error = await this.props.signin({ username: null, password: null })
      if (error) return console.log(error)
    }
  }
  async submitEvaluate () {
    let technologyScore = this.state.technologyScore
    let serviceScore = this.state.serviceScore
    let advice = this.state.advice
    let userId = await localforage.getItem('userId')
    let doctorId = this.props.doctorId || this.props.url.query.doctorId
    if (!advice) {
      this.setState({
        isShow: true,
        promptContent: '其他建议不能为空'
      })
      return
    }
    this.props.addDoctorEvaluate(this.props.client, {userId, doctorId, technologyScore, serviceScore, advice})
    this.props.url.back()
  }
  getScore (scoreType, score) {
    if (scoreType === 'technologyScore') {
      this.setState({
        technologyScore: score
      })
    }
    if (scoreType === 'serviceScore') {
      this.setState({
        serviceScore: score
      })
    }
  }
  render () {
    // var doctorId = this.props.doctorId || this.props.url.query.doctorId
    if (!this.props.token) {
      return (<div><RequireLoginCard /></div>)
    }
    return (
      <div>
        <div style={{backgroundColor: '#ffffff', padding: '25px 15px', borderBottom: '1px solid #fff', borderColor: theme.bordercolor}}>
          <div style={{marginBottom: 20}} className='flex tb-flex'>
            <span style={{marginRight: 15, color: theme.mainfontcolor}}>服务态度</span>
            <Stars scoreType='serviceScore' getScore={(scoreType, score) => { this.getScore(scoreType, score) }} />
          </div>
          <div style={{marginBottom: 20}} className='flex tb-flex'>
            <span style={{marginRight: 15, color: theme.mainfontcolor}}>诊疗技术</span>
            <Stars scoreType='technologyScore' getScore={(scoreType, score) => { this.getScore(scoreType, score) }} />
          </div>
          <div style={{marginBottom: 15, color: theme.mainfontcolor}}>其他建议</div>
          <textarea placeholder='请填写您的建议或意见，以帮助我们改进。' rows='5'
            style={{width: '100%', backgroundColor: '#f2f2f2', border: 'none', borderRadius: '2px', padding: '10px 0', textIndent: '10px', fontSize: theme.fontsize}}
            onChange={(e) => { this.setState({advice: e.target.value}) }}
          />
        </div>
        <div style={{margin: 20}}>
          <button
            onClick={() => { this.submitEvaluate() }}
            className='btnBG btnBGMain'
          >提交</button>
        </div>
        <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    doctors: state.doctors.data,
    doctorId: state.doctors.selectId,
    error: state.doctors.error,
    loading: state.doctors.loading
  }
}

export default connect(mapStateToProps, { signin, addDoctorEvaluate })(AddDoctorEvaluateScreen)
