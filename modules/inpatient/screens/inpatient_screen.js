import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
import Router from 'next/router'
import _ from 'lodash'

import {
  queryPatients,
  queryInpatient,
  selectInpatient,
  selectInpatientRecord,
  queryDeposits
 } from '../../../ducks'
import { judge } from '../../../utils'
class InpatientScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectInpatientId: null
    }
  }

  componentWillMount () {
    this.inpatient(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (judge(nextProps.patientsData) && !judge(nextProps.inpatientRecords) && !nextProps.selectInpatientId) {
      this.inpatient(nextProps)
    } else if (this.state.selectInpatientId !== nextProps.selectInpatientId) {
      this.queryInpatient(nextProps.selectInpatientId)
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
  queryInpatient (patientId) {
    this.props.queryInpatient(this.props.client, {patientId})
    this.props.queryDeposits(this.props.client, {patientId})
  }
  filterRecord (inpatientRecordArray, selectInpatientId) {
    let inpatientRecord = inpatientRecordArray.filter((inpatientRecord) => {
      if (selectInpatientId === inpatientRecord.patientId) {
        return true
      }
      return false
    })
    return inpatientRecord[0]
  }

  renderPatientList () {
    const patients = this.props.patientsData
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
              console.log(e.target.value)
              this.props.selectInpatient(e.target.value)
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
            <option value='58eb7c94c77c0857c9dc5b1e'>查康</option>
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
    if (this.props.loading) {
      return (<div>loading...</div>)
    }
    if (this.props.error) {
      return (<div>error...</div>)
    }
    const patientsData = this.props.patientsData
    const selectInpatientId = this.props.selectInpatientId
    const inpatientRecords = this.props.inpatientRecords
    let inpatientRecordArray = []
    for (let i in inpatientRecords) {
      if (inpatientRecords[i] && inpatientRecords[i].id) {
        inpatientRecordArray.push(inpatientRecords[i])
      }
    }
    if (inpatientRecordArray && inpatientRecordArray.length > 0 && this.filterRecord(inpatientRecordArray, selectInpatientId)) {
      return (
        <div>
          {this.renderPatientList()}
          <div>
            {topView(patientsData[selectInpatientId], this.filterRecord(inpatientRecordArray, selectInpatientId), patientsData, this.props)}
            {middleList(this.filterRecord(inpatientRecordArray, selectInpatientId), this.props)}
            {buttomList(this.filterRecord(inpatientRecordArray, selectInpatientId), this.props, this.filterRecord(inpatientRecordArray, selectInpatientId).id)}
          </div>
          <style jsx global>{`
            .topView {
              background-color: #ffffff;
              margin-bottom: 5px;
            }
            .topViewTittle {
              margin-left: 15px;
              margin-right: 15px;
              flex-wrap: nowrap;
              flex-direction: row;
              align-items: center;
            }
            .topViewInfor {
              margin-left: 15px;
              margin-right: 15px;
              margin-top: 20px;
              padding-bottom: 15px;
              margin-bottom: 15px;
              flex-wrap: wrap;
              flex-direction: column;
              align-items: flex-start;
            }
            .txtGray {
              font-size: 14px;
              color: #797979;
              margin-top: 5px;
              margin-bottom: 5px;
              margin-right: 10px;
            }
            .txtBlack {
              font-size: 14px;
              color: #505050;
              margin-top: 5px;
              margin-bottom: 5px;
            }
            .spliteLine {
              backgroundColor: #E6E6E6;
              width: 100%;
              height: 0.5px;
            }
            .payButton {
              padding: 5px;
              border: solid 1px #3CA0FF;
              border-radius: 20px;
              border-width: 0.5px;
              align-items: center;
              justify-content: center;
              height: 20px;
              width: 60px;
            }
          `}</style>
        </div>
      )
    } else {
      return (<div>
        {this.renderPatientList()}
        <div>没有住院信息</div>
      </div>)
    }
  }
}


const topView = (patient, inpatientRecord, patientsData, props) => {
  const name = inpatientRecord.name
  const inpatientNo = inpatientRecord.inpatientNo
  const dept = inpatientRecord.deptName
  const inDate = inpatientRecord.inDate
  const inDays = inpatientRecord.outDate ? parseInt((new Date(inpatientRecord.outDate) - new Date(inDate)) / 1000 / 3600 / 24) : parseInt((new Date() - new Date(inDate)) / 1000 / 3600 / 24)
  // const competentDoctor = inpatientRecord.competentDoctor
  // const competentNurse = inpatientRecord.competentNurse

  let index = 0
  let patientsPickerData = []
  for (let i in patientsData) {
    if (patientsData[i] && patientsData[i].id) {
      patientsPickerData.push({ key: index++, label: patientsData[i].name, id: patientsData[i].id })
    }
  }
  return (
    <div className={'topView'}>
      <div className={'topViewTittle'}>
        <div style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: '5px 0px' }}>
          <span style={{ fontSize: 19, color: '#505050', marginTop: 15, marginBottom: 15 }} >{ name }</span>
          <span style={{ fontSize: 14, color: '#B4B4B4', marginLeft: 10 }}>{ '住院号：' + inpatientNo}</span>
        </div>
        {/* <ModalPicker
          data={patientsPickerData}
          onChange={async (option) => {
            props.selectInpatient(option.id)
            props.queryInpatient(props.client, {patientId: option.id})
          }}>
          <img style={{width: 10, height: 10}} />
        </ModalPicker> */}
      </div>
      <div className={'spliteLine'} />
      <div className={'topViewInfor'}>
        <div style={{ flexDirection: 'row', padding: '5px 0px' }}>
          <span className={'txtGray'} >科 &nbsp;&nbsp;室</span>
          <span className={'txtBlack'} >{ dept } {inpatientRecord.wardName}</span>
        </div>
        <div style={{ flexDirection: 'row', display: 'flex', padding: '5px 0px' }}>
          <div style={{ flexDirection: 'row', flex: 6 }}>
            <span className={'txtGray'} >入院日期</span>
            <span className={'txtBlack'} >{ inDate }</span>
          </div>
          <div style={{ flexDirection: 'row', flex: 6 }}>
            <span className={'txtGray'} >住院天数</span>
            <span className={'txtBlack'} >{inDays}</span>
          </div>
        </div>
        {/* <div style={{ flexDirection: 'row' }}>
          <div style={{ flexDirection: 'row', flex: 1 }}>
            <div className={'txtGray'} >主管医生</div>
            <div className={'txtBlack'} >{ competentDoctor }</div>
          </div>
          <div style={{ flexDirection: 'row', flex: 1 }}>
            <div className={'txtGray'} >主管护士</div>
            <div className={'txtBlack'} >{ competentNurse }</div>
          </div>
        </div> */}
      </div>
    </div>
  )
}


const middleList = (inpatientRecord, props) => {
  const balance = inpatientRecord.balance // 预缴金余额
  const totalPayment = inpatientRecord.totalPayment // 预缴金总额
  const status = inpatientRecord.status // 是否出院
  const totalConsumption = inpatientRecord.totalConsumption // 总消费
  return (
    <div style={{padding: 5, backgroundColor: '#ffffff', marginBottom: 10}}>
      {balanceItem(balance, status)}
      <div
        style={{display: 'flex', padding: 5, borderTop: 'solid 1px #eeeeee'}}
      >
        <div style={{flex: 6, alignItems: 'center'}} onClick={() => { Router.push('/inpatient/paid_list') }}>
          <div style={{fontSize: 16, color: '#505050', textAlign: 'center'}} >预缴金记录</div>
          <div style={{fontSize: 13, color: '#B4B4B4', marginBottom: 2, textAlign: 'center'}} >{totalPayment + '元'}</div>
        </div>
        <div style={{flex: 6}}>{totalItem(totalConsumption)}</div>
      </div>
    </div>
  )
}

const balanceItem = (balance, status) => {
  // if (status) {
  //   return null
  // }
  return (
    <div style={{ borderBottomWidth: 0.5, borderBottomColor: '#E6E6E6' }}>
      <div style={{ marginLeft: 15, marginRight: 15, fontSize: 13, color: '#797979', marginTop: 20 }} >预交金余额（元）</div>
      <div style={{ marginLeft: 15, marginRight: 15, marginBottom: 19, display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 13 }}>
        <div style={{ fontSize: 28, color: '#505050', flex: 6 }} >{balance}</div>
        <div onClick={() => { Router.push('/inpatient/payment') }}>
          <div className={'payButton'}>
            <div style={{color: '#3CA0FF', textAlign: 'center'}}>充值</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const totalItem = (totalConsumption) => {
  return (
    <div>
      <div style={{fontSize: 16, color: '#505050', textAlign: 'center'}}>住院总费用</div>
      <div style={{fontSize: 13, color: '#B4B4B4', marginBottom: 2, textAlign: 'center'}}>{totalConsumption + '元'}</div>
    </div>
  )
}

const buttomList = (inpatientRecord, props, id) => {
  const status = inpatientRecord.status
  const array1 = [
    {
      title: '一日清单',
      icon: 'av-timer',
      navKey: 'daily_fee'
    },
    {
      title: '住院须知',
      icon: 'flight-takeoff',
      navKey: ''
    }
  ]
  const array2 = [
    {
      title: '入院信息登记',
      icon: 'flight-takeoff',
      navKey: 'info_entry'
    },
    {
      title: '一日清单',
      icon: 'flight-takeoff',
      navKey: 'daily_fee'
    },
    {
      title: '出院医嘱',
      icon: 'flight-takeoff',
      navKey: 'doctor_advice'
    }
  ]
  let array = []
  if (status) {
    array = array2
  } else {
    array = array1
  }
  return (
    <div>
      {
        array2.map((item, i) => {
          return (
            <div style={{padding: 15, marginBottom: 1, backgroundColor: '#ffffff'}} key={i} onClick={() => {
              if (item.title === '一日清单') {
                props.selectInpatientRecord({patientRecordId: id})
              }
              Router.push('/inpatient/' + item.navKey)
            }}>
              <div>{item.title}<span style={{float: 'right'}}>></span></div>
            </div>
          )
        })
      }
    </div>
  )
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
    inpatientRecords: state.inpatient.data
  }
}

export default connect(
  mapStateToProps, {
    queryPatients,
    queryInpatient,
    selectInpatient,
    selectInpatientRecord,
    queryDeposits
  }
)(InpatientScreen)
