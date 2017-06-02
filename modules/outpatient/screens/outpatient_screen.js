import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
import moment from 'moment'

import {queryOutpatient} from '../../../ducks'
import { isEmptyObject } from '../../../utils'
class OutpatientScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      payStatus: false
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
    this.setState({isInit: false})
  }
  getOutPatientArr (outpatient, payStatus) {
    var outpatients = []
    for (var key in outpatient) {
      if (outpatient[key].payStatus === payStatus) {
        outpatients.push(outpatient[key])
      }
    }
    return outpatients
  }
  render () {
    if (this.props.loading || this.state.isInit) {
      return (<div>loading...</div>)
    }
    if (this.props.error) {
      return (<div>error...</div>)
    }
    var outpatients = this.getOutPatientArr(this.props.outpatient, this.state.payStatus)
    return (
      <div>
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
    loading: state.outpatient.loading,
    error: state.outpatient.error
  }
}

export default connect(mapStateToProps, {queryOutpatient})(OutpatientScreen)
