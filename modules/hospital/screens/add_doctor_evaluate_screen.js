import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
// import swal from 'sweetalert2'
// import moment from 'moment'
import {theme} from 'components'
import {addDoctorEvaluate} from '../../../ducks'
import Stars from '../components/stars'
class AddDoctorEvaluateScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      advice: '',
      technologyScore: 5,
      serviceScore: 5
    }
  }
  async submitEvaluate () {
    let technologyScore = this.state.technologyScore
    let serviceScore = this.state.serviceScore
    let advice = this.state.advice
    let userId = await localforage.getItem('userId')
    let doctorId = this.props.doctorId || this.props.url.query.doctorId
    if (!advice) {
      console.log('建议不能为空')
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
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    doctors: state.doctors.data,
    doctorId: state.doctors.selectId,
    error: state.doctors.error,
    loading: state.doctors.loading
  }
}

export default connect(mapStateToProps, { addDoctorEvaluate })(AddDoctorEvaluateScreen)
