import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
import Router from 'next/router'
import _ from 'lodash'
import {Loading, FilterCard, FilterSelect, FilterTime, Modal, ModalHeader, ModalFooter, FilterTimeResult, theme, NoDataCard, ErrCard, RequireLoginCard, Prompt} from 'components'

import {
  queryPatients,
  queryInpatient,
  selectInpatient,
  selectInpatientRecord,
  queryDeposits,
	signin,
	updateInpatient,
	queryHospitals
 } from '../../../ducks'
import { judge } from '../../../utils'
class QueryInpatientScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectInpatientId: null,
      showFilterModal: false,
      animating: false,
      autoClose: true,
      closeTime: 2,
      isShow: false,
			promptContent: '',
			inpatientCardNum: null
    }
  }

  componentWillMount () {
		this.autoSignin()
		this.props.queryHospitals(this.props.client)
  }

  // 自动登陆 刷新token,用户信息,就诊人信息，
  async autoSignin () {
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
    const userId = this.props.userId
    if (userId && !this.props.selectInpatientId) {
      this.inpatient(this.props)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (judge(nextProps.patientsData) && !judge(nextProps.inpatientRecords) && !nextProps.selectInpatientId) {
      this.inpatient(nextProps)
    } else if (this.state.selectInpatientId !== nextProps.selectInpatientId) {
      this.setState({selectInpatientId: nextProps.selectInpatientId})
    }
  }

  async inpatient (props) {
    const patients = props.patientsData
    if (judge(patients)) {
      let array = []
      for (let i in patients) {
        if (patients[i] && patients[i].id) {
          array.push(patients[i])
        }
      }
      if (array.length > 0) {
        this.selectInpatient(array[0].id)
      }
    } else {
      var userId = await localforage.getItem('userId')
      props.queryPatients(props.client, {userId})
    }
  }

  getPatients () {
    const userId = this.props.userId
    this.props.queryPatients(this.props.client, { userId })
  }

  selectInpatient (patientId) {
    this.props.selectInpatient(patientId)
  }

  async submit () {
    let i = 2
		const inpatientNo = this.state.inpatientCardNum
		const patientId = this.props.selectInpatientId
    if (!inpatientNo) {
      this.setState({
        isShow: true,
        promptContent: '请输入住院号'
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
    }
    this.setState({animating: true})
		const hospitalId = this.props.hospitals && this.props.hospitals[0] && this.props.hospitals[0].id
		console.log('------hospitals', hospitalId, patientId)
    const error = await this.props.updateInpatient(this.props.client, {hospitalId, patientId, inpatientNo })
		this.setState({animating: false})
		console.log('------error----', error)
    if (error.error) {
      this.setState({
        isShow: true,
        promptContent: error.error
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
		}
    return window.history.back()
	}
	
  render () {
    if (!this.props.token) {
      return (
        <div>
          <span><RequireLoginCard /></span>
        </div>
      )
    }
    if (this.props.loading) {
      return (<div><Loading showLoading={true} /></div>)
    }
    if (this.props.error) {
      return (<div><ErrCard /></div>)
    }
		const selectInpatientId = this.props.selectInpatientId
    const patients = this.props.patientsData
    let patientArr = []
    _.mapKeys(patients, (patient) => {
      patientArr.push(patient)
    })
		return (
			<div>
				<div className='flex tb-flex' style={{background: '#fff', padding: '10px 15px', borderBottom: '1px solid #d8d8d8'}}>
					<span style={{paddingRight: 10}}>就诊人</span> 
					<select
						style={{width: '76%', padding: 0, margin: 0, border: 'none', fontSize: theme.fontsize, color: theme.mainfontcolor}}
						onChange={(e) => {this.props.selectInpatient(e.target.value)}}
						defaultValue={selectInpatientId}>
						{
							patientArr.map((patient) => {
								return (
									<option key={patient.id} value={selectInpatientId}>
										{patient.name}
									</option>
								)
							})
						}
					</select>
				</div>
				<div className='flex tb-flex' style={{background: '#fff', padding: '10px 15px', borderBottom: '1px solid #d8d8d8'}}>
					<span style={{paddingRight: 10}}>住院号</span> 
					<input style={{width: '76%', padding: 0, margin: 0, border: 'none'}} type='text' placeholder='请输入住院号'  style={{fontSize: 15}}
						onChange={(e) => {this.setState({inpatientCardNum: e.target.value})}} />
				</div>
				<footer style={{margin: '30px 15px'}}>
					<button className='btnBG btnBGMain'
						onClick={() => this.submit(this.props)}>完成</button>
				</footer>
				<style jsx global>{`
				`}</style>
				<Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
			</div>
		)
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    patientsData: state.patients.data,
    patientsLoading: state.patients.loading,
    inpatientLoading: state.inpatient.loading,
    selectInpatientId: state.inpatient.selectInpatientId,
		inpatientRecords: state.inpatient.data,
		hospitals: state.hospitals.noJson
  }
}

export default connect(
  mapStateToProps, {
    queryPatients,
    queryInpatient,
    selectInpatient,
    selectInpatientRecord,
    queryDeposits,
		signin,
		updateInpatient,
		queryHospitals
  }
)(QueryInpatientScreen)
