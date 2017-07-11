import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
import Router from 'next/router'
import _ from 'lodash'
import {Loading, FilterCard, FilterSelect, FilterTime, Modal, ModalHeader, ModalFooter, FilterTimeResult, theme, NoDataCard, ErrCard, RequireLoginCard} from 'components'

import {
  queryPatients,
  queryInpatient,
  selectInpatient,
  selectInpatientRecord,
  queryDeposits,
  signin
 } from '../../../ducks'
import { judge } from '../../../utils'
class InpatientScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectInpatientId: null,
      showFilterModal: false,
    }
  }

  componentWillMount () {
    this.autoSignin()
  }

  // 自动登陆 刷新token,用户信息,就诊人信息，
  async autoSignin () {
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
    const userId = this.props.userId
    if (userId) {
      this.inpatient(this.props)
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
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

  renderModal() {
    let modalHtml;
    modalHtml = <Modal showModalState={this.state.showTipModal || this.state.showFilterModal}>
      <ModalHeader>请选择起止时间</ModalHeader>
      <div className='flex' style={{padding: 20}}>
        <input type='date'
          onChange={(e) => { this.setState({startDate: e.target.value}) }}
          style={{border: '1px solid #ccc', flex: 6}} name='startDate' max={this.state.maxDate} />
        <span style={{flex: 1, padding: 5, textAlign: 'center'}}> - </span>
        <input type='date'
          onChange={(e) => { this.setState({endDate: e.target.value}) }}
          style={{border: '1px solid #ccc', flex: 6}} name='endDate' max={this.state.maxDate} />
      </div>
      <ModalFooter>
        <button className='modalBtn modalBtnBorder' onClick={(e) => {this.setState({showFilterModal: false})}}>取消</button>
        <button className='modalBtn modalMainBtn' onClick={(e) => {this.setState({showFilterModal: false})}}>确定</button>
      </ModalFooter>
    </Modal>
    return modalHtml;
  }

  renderPatientList () {
    const patients = this.props.patientsData
    let patientArr = []
    _.mapKeys(patients, (patient) => {
      patientArr.push(patient)
    })
    return (
      <FilterCard>
        <FilterSelect
          changePatientSelect={(e) => {
            console.log('------changePatientSelect', e.target.value)
            this.props.selectInpatient(e.target.value)
          }}
          patientArr = {patientArr}
        />
      </FilterCard>
    )
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
              margin-bottom: ${theme.tbmargin};
            }
            .topViewTittle {
              padding: 0 ${theme.lrmargin};
              align-items: center;
              line-height: 45px;
              border-bottom: 1px dashed #eee;
            }
            .topViewInfor {
              padding: ${theme.tbmargin} ${theme.lrmargin};
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
              padding: 0;
              border: solid 1px ${theme.maincolor};
              border-radius: 10px;
              border-width: 0.5px;
              align-items: center;
              justify-content: center;
              line-height: 26px;
              width: 80px;
            }
          `}</style>
        </div>
      )
    } else {
      return (<div>
        {this.renderPatientList()}
        <div><NoDataCard /></div>
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
        <span style={{ fontSize: 16, color: theme.mainfontcolor, paddingRight: '.06rem' }} >{ name }</span>
        <span style={{ fontSize: 14, color: theme.fontcolor }}>{ '住院号：' + inpatientNo}</span>
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
    <div style={{borderBottom: '1px solid', borderTop: '1px solid', borderColor: theme.bordercolor, backgroundColor: '#ffffff', marginBottom: 10}}>
      {balanceItem(balance, status)}
      <div
        style={{display: 'flex', borderTop: 'solid 1px #eeeeee'}}
      >
        <div style={{width: '50%'}} onClick={() => { Router.push('/inpatient/paid_list') }}>
          <div className='flex lr-flex' style={{borderRight: '1px solid #eee', padding: '15px 0'}}>
            <p style={{width: 20, height: 20, lineHeight: '20px', background: '#6B9FEC', textAlign: 'center', color: '#fff', borderRadius: '100%', fontSize: '12px', marginRight: 6}}>预</p>
            <dl>
              <dt style={{fontSize: theme.fontSize, color: theme.mainfontcolor}} >预缴金记录</dt>
              <dd style={{fontSize: theme.nfontsize, color: theme.nfontcolor}} >{totalPayment + '元'}</dd>
            </dl>
          </div>
        </div>
        {totalItem(totalConsumption)}
      </div>
    </div>
  )
}

const balanceItem = (balance, status) => {
  // if (status) {
  //   return null
  // }
  return (
    <div style={{ borderBottomWidth: 0.5, borderBottomColor: '#E6E6E6', padding: '20px 15px 20px 20px' }}>
      <div style={{fontSize: theme.nfontsize, color: theme.fontcolor }} >预交金余额（元）</div>
      <div style={{display: 'flex', alignItems: 'center', marginTop: 6, justifyContent: 'space-between' }}>
        <div style={{ fontSize: 28, color: theme.mainfontcolor }} >{balance}</div>
        <div onClick={() => { Router.push('/inpatient/payment') }}>
          <div className={'payButton'}>
            <div style={{color: theme.maincolor, textAlign: 'center'}}>充值</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const totalItem = (totalConsumption) => {
  return (
    <div className='flex lr-flex' style={{width: '50%', padding: '15px 0'}}>
      <p style={{width: 20, height: 20, lineHeight: '20px', background: '#72C7FF', textAlign: 'center', color: '#fff', borderRadius: '100%', fontSize: '12px', marginRight: 6}}>院</p>
      <dl>
        <dt style={{fontSize: theme.fontSize, color: theme.mainfontcolor}} >住院总费用</dt>
        <dd style={{fontSize: theme.nfontsize, color: theme.nfontcolor}} >{totalConsumption + '元'}</dd>
      </dl>
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
            <div style={{padding: 15, borderBottom: '1px solid #d8d8d8', color: theme.mainfontcolor, backgroundColor: '#ffffff'}} key={i} onClick={() => {
              if (item.title === '一日清单') {
                props.selectInpatientRecord({patientRecordId: id})
              }
              Router.push('/inpatient/' + item.navKey)
            }}>
              <div className='flex' style={{ justifyContent: 'space-between'}}>{item.title}<span className='back-left' style={{display: 'inline-block', transform: 'rotate(135deg)'}}></span></div>
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
    queryDeposits,
    signin
  }
)(InpatientScreen)
