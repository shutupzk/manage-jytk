import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
import moment from 'moment'
import _ from 'lodash'

import {queryOutpatient, queryPatients} from '../../../ducks'
import { isEmptyObject } from '../../../utils'
class OutpatientScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      payStatus: false,
      selectedId: ''
    }
  }

  componentWillMount () {
    if (isEmptyObject(this.props.outpatient)) {
      this.setState({isInit: true})
      this.queryOutPatient()
    }
  }

  async queryOutPatient () {
    var userId = await localforage.getItem('userId')
    await this.props.queryOutpatient(this.props.client, {userId})
    await this.props.queryPatients(this.props.client, {userId})
    if (!isEmptyObject(this.props.patients)) {
      for (let key in this.props.patients) {
        this.setState({selectedId: key})
        break
      }
    }
    this.setState({isInit: false})
  }
  getOutPatientArr (outpatient, payStatus, patientId) {
    var outpatients = []
    for (var key in outpatient) {
      if (outpatient[key].payStatus === payStatus && outpatient[key].patientId === patientId) {
        outpatients.push(outpatient[key])
      }
    }
    return outpatients
  }
  renderPatientList () {
    const patients = this.props.patients
    let patientArr = []
    _.mapKeys(patients, (patient) => {
      patientArr.push(patient)
    })
    return (
      <div style={{padding: 10, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 15}}>
        <div style={{border: '1px solid #ccc', display: 'flex'}}>
          <select style={{flex: 11, height: 30, padding: 5, border: 'none', backgroundColor: '#fff'}}
            ref='patientSelect'
            onChange={(e) => {
              this.setState({selectedId: e.target.value})
            }}
          >{
            patientArr.map((patient) => {
              return (
                <option key={patient.id} style={{textAlign: 'center', font: 15}} value={patient.id}>
                  {patient.name}
                </option>
              )
            })
          }
          </select>
          {/*<img onClick={() => {
            const select = this.refs.patientSelect
            select.click()
          }} style={{flex: 1, float: 'right', width: 8, height: 15, padding: 8}} src='/static/icons/down.png' />*/}
        </div>
      </div>
    )
  }

  render () {
    if (this.props.loading || this.state.isInit) {
      return (<div>loading...</div>)
    }
    if (this.props.error) {
      return (<div>error...</div>)
    }
    var outpatients = this.getOutPatientArr(this.props.outpatient, this.state.payStatus, this.state.selectedId)
    return (
      <div>
        {this.renderPatientList()}
        <div style={{display: 'flex', border: 'solid 1px #eeeeee', height: '20px', backgroundColor: '#ffffff', padding: 10}}>
          <div style={{width: '50%', textAlign: 'center'}} onClick={() => { this.setState({payStatus: false}) }}>未缴费</div>
          <div style={{width: '50%', textAlign: 'center'}} onClick={() => { this.setState({payStatus: true}) }}>已缴费</div>
        </div>
        {
          outpatients.length > 0 ? outpatients.map((outpatient) => {
            let buttonClass = {padding: '3px 5px', border: 'solid 1px #3CA0FF', backgroundColor: '#ffffff', color: '#3CA0FF', float: 'right'}
            let buttonText = '去缴费'
            if (outpatient.visitSchedule.visitDate !== moment().format('YYYY-MM-DD')) {
              buttonClass = {padding: '3px 5px', backgroundColor: '#dddddd', color: '#ffffff', float: 'right'}
              buttonText = '已过期'
            }
            return (
              <div key={outpatient.id} style={{padding: '10px 20px', backgroundColor: '#ffffff', marginBottom: 10}}>
                <div>就诊时间:{outpatient.visitSchedule.visitDate} {outpatient.visitSchedule.amPm === 'a' ? '上午' : '下午'}
                  <span style={{float: 'right'}}>¥{outpatient.chargeTotal}</span>
                </div>
                <div style={{display: 'flex', paddingTop: 5}}>
                  <div>
                    <img src='/static/icons/doctor_head.png' style={{width: '50px', height: '50px'}} />
                  </div>
                  <div>
                    <div>就诊科室：{outpatient.department.deptName}</div>
                    <div>医生姓名：{outpatient.doctor.doctorName}</div>
                    <div>就诊人：{outpatient.patientName}</div>
                  </div>
                </div>
                { !outpatient.payStatus ? <div><button style={buttonClass}>{buttonText}</button>
                  <div className='clearfix'>&nbsp;</div>
                </div> : ''}
              </div>
            )
          })
          : <div><div style={{padding: '10px 20px', backgroundColor: '#ffffff', marginBottom: 10}}>
            <div>就诊时间:2017-06-02 {'下午'}
              <span style={{float: 'right'}}>¥128</span>
            </div>
            <div style={{display: 'flex', paddingTop: 5}}>
              <div>
                <img src='/static/icons/doctor_head.png' style={{width: '50px', height: '50px'}} />
              </div>
              <div style={{paddingLeft: 10}}>
                <div>就诊科室：胸外科门诊</div>
                <div>医生姓名：张小娴</div>
                <div>就诊人：东东</div>
              </div>
            </div>
            { !this.state.payStatus ? <div><button style={{padding: '3px 5px', border: 'solid 1px #3CA0FF', backgroundColor: '#ffffff', color: '#3CA0FF', float: 'right'}}>去缴费</button>
              <div className='clearfix'>&nbsp;</div>
            </div> : ''}
          </div>
          <div style={{padding: '10px 20px', backgroundColor: '#ffffff', marginBottom: 10}}>
            <div>就诊时间:2017-05-31 {'下午'}
              <span style={{float: 'right'}}>¥128</span>
            </div>
            <div style={{display: 'flex', paddingTop: 5}}>
              <div>
                <img src='/static/icons/doctor_head.png' style={{width: '50px', height: '50px'}} />
              </div>
              <div style={{paddingLeft: 10}}>
                <div>就诊科室：胸外科门诊</div>
                <div>医生姓名：张小娴</div>
                <div>就诊人：东东</div>
              </div>
            </div>
            { !this.state.payStatus ? <div><button style={{padding: '3px 5px', backgroundColor: '#dddddd', color: '#ffffff', float: 'right'}}>已过期</button>
              <div className='clearfix'></div>
            </div> : ''}
          </div>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    outpatient: state.outpatient.data,
    patients: state.patients.data,
    loading: state.outpatient.loading || state.patients.loading,
    error: state.outpatient.error || state.patients.error
  }
}

export default connect(mapStateToProps, {queryOutpatient, queryPatients})(OutpatientScreen)
