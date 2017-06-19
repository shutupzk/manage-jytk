import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
// import swal from 'sweetalert2'
// import moment from 'moment'
import {addDepartmentEvaluate} from '../../../ducks'
import Stars from '../components/stars'
function fnShow (lis, num) {
  num = num || 0
  for (var i = 0; i < lis.length; i++) {
    lis[i].className = i < num ? 'light' : ''
  }
}
class AddDepartmentEvaluateScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      advice: '',
      technologyScore: 5,
      orderlyScore: 5
    }
  }
  async submitEvaluate () {
    let technologyScore = this.state.technologyScore
    let orderlyScore = this.state.orderlyScore
    let advice = this.state.advice
    let userId = await localforage.getItem('userId')
    let departmentId = this.props.departmentId || this.props.url.query.departmentId
    if (!advice) {
      console.log('建议不能为空')
      return
    }
    this.props.addDepartmentEvaluate(this.props.client, {userId, departmentId, technologyScore, orderlyScore, advice})
    this.props.url.back()
  }
  getScore (scoreType, score) {
    if (scoreType === 'technologyScore') {
      this.setState({
        technologyScore: score
      })
    }
    if (scoreType === 'orderlyScore') {
      this.setState({
        orderlyScore: score
      })
    }
  }
  render () {
    // var departmentId = this.props.departmentId || this.props.url.query.departmentId
    return (
      <div>
        <div style={{backgroundColor: '#ffffff', padding: 15}}>
          <div style={{marginBottom: 10}}>
            <span style={{marginRight: 15}}>技术水平</span>
            <Stars scoreType='technologyScore' getScore={(scoreType, score) => { this.getScore(scoreType, score) }} />
            {/* <img src='/static/icons/star.png' style={{widht: 20, height: 20, marginRight: 10}} />
            <img src='/static/icons/star.png' style={{widht: 20, height: 20, marginRight: 10}} />
            <img src='/static/icons/star.png' style={{widht: 20, height: 20, marginRight: 10}} />
            <img src='/static/icons/star.png' style={{widht: 20, height: 20, marginRight: 10}} />
            <img src='/static/icons/star.png' style={{widht: 20, height: 20}} /> */}
          </div>
          <div style={{marginBottom: 10}}>
            <span style={{marginRight: 15}}>候诊秩序</span>
            <Stars scoreType='orderlyScore' getScore={(scoreType, score) => { this.getScore(scoreType, score) }} />
          </div>
          <div style={{marginBottom: 10}}>其他建议</div>
          <textarea placeholder='请填写您的建议或意见，以帮助我们改进。' rows='5'
            style={{width: '100%', backgroundColor: '#eeeeee', border: 'none'}}
            onChange={(e) => { this.setState({advice: e.target.value}) }}
          />
        </div>
        <div style={{margin: 20}}>
          <button
            onClick={() => { this.submitEvaluate() }}
            style={{width: '100%', display: 'block', backgroundColor: '#3CA0FF', height: '40px', borderRadius: '10px', fontSize: 16}}
          >提交</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    departments: state.departments.data,
    departmentId: state.departments.selectId,
    error: state.departments.error,
    loading: state.departments.loading
  }
}

export default connect(mapStateToProps, { addDepartmentEvaluate })(AddDepartmentEvaluateScreen)
